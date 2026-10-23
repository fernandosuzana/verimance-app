import { NextResponse, after } from "next/server";
import { currentMember, supabaseAdmin, hasPlus, type Profile } from "@/lib/supabase/server";
import { analyzeConversation, analyzeRules, LEVEL_RANK, type Lang, type Level } from "@/lib/guardian";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { sb, user, profile } = await currentMember();
  if (!user || !profile) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (profile.status !== "active") return NextResponse.json({ error: "Your account can't send messages right now." }, { status: 403 });
  const { conversationId, body } = await req.json().catch(() => ({}));
  const text = String(body || "").trim().slice(0, 2000);
  if (!text) return NextResponse.json({ error: "Empty message" }, { status: 400 });
  const { data: conv } = await sb.from("conversations").select("id,user_a,user_b").eq("id", conversationId).single(); // RLS: participants only
  if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  const other = conv.user_a === user.id ? conv.user_b : conv.user_a;
  const admin = supabaseAdmin();
  const { data: blk } = await admin.from("blocks").select("blocker").or(`and(blocker.eq.${user.id},blocked.eq.${other}),and(blocker.eq.${other},blocked.eq.${user.id})`).limit(1);
  if (blk?.length) return NextResponse.json({ error: "You can't message this person." }, { status: 403 });
  const { data: recipient } = await admin.from("profiles").select("*").eq("id", other).single();
  if (!recipient || recipient.status === "removed") return NextResponse.json({ error: "This account is no longer available." }, { status: 410 });

  const { data: msg, error } = await admin.from("messages").insert({ conversation_id: conv.id, sender: user.id, body: text }).select("id,sender,body,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await admin.from("conversations").update({ last_message: text.slice(0, 140), last_message_at: new Date().toISOString() }).eq("id", conv.id);

  // Guardian protects the person RECEIVING this message, after the response is sent.
  after(() => protectRecipient(conv.id, recipient as Profile, profile));
  return NextResponse.json({ message: msg });
}

async function protectRecipient(conversationId: string, recipient: Profile, sender: Profile) {
  const admin = supabaseAdmin();
  const { data: rows } = await admin.from("messages").select("sender,body").eq("conversation_id", conversationId).order("created_at", { ascending: false }).limit(30);
  const msgs = (rows || []).reverse().map((m) => ({ from: (m.sender === recipient.id ? "member" : "match") as "member" | "match", text: m.body }));
  const lang = recipient.lang as Lang;
  const facts = { accountDays: Math.max(1, Math.round((Date.now() - new Date(sender.created_at).getTime()) / 864e5)), idVerified: sender.verification === "verified", trust: sender.trust };
  const a = hasPlus(recipient) ? await analyzeConversation(msgs, facts, lang) : analyzeRules(msgs, facts, lang);
  const { data: last } = await admin.from("guardian_alerts").select("level,stage").eq("conversation_id", conversationId).eq("user_id", recipient.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const before = (last?.level || "safe") as Level;
  if (LEVEL_RANK[a.level] > LEVEL_RANK[before] && a.level !== "safe")
    await admin.from("guardian_alerts").insert({ conversation_id: conversationId, user_id: recipient.id, level: a.level, risk: a.risk, stage: a.stage, signals: a.signals, advice: a.advice, engine: a.engine });
  if (["money_request", "investment"].includes(a.stage) && last?.stage !== a.stage && hasPlus(recipient)) {
    const { data: ally } = await admin.from("allies").select("name,email,notify_money").eq("user_id", recipient.id).maybeSingle();
    if (ally?.notify_money) await sendEmail(ally.email, "Verimance · Guardian alert",
      `Hello ${ally.name},\n\n${recipient.name} chose you as their family ally on Verimance.\nGuardian just noticed that someone in one of their conversations brought up money or an investment. Guardian has advised ${recipient.name} not to send anything.\nA friendly call from you could help. You can't see their messages, and they know you were notified.\n\n— Verimance`);
  }
}

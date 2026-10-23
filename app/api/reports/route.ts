import { NextResponse } from "next/server";
import { currentMember, supabaseAdmin } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const { user } = await currentMember(); if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { targetId, conversationId, reason, note, block } = await req.json().catch(() => ({}));
  if (!targetId || targetId === user.id) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const admin = supabaseAdmin();
  let evidence: string[] = [], risk = 0, conv: string | null = null;
  if (conversationId) {
    const { data: c } = await admin.from("conversations").select("id,user_a,user_b").eq("id", conversationId).single();
    if (c && [c.user_a, c.user_b].includes(user.id) && [c.user_a, c.user_b].includes(targetId)) {
      conv = c.id;
      const { data: m } = await admin.from("messages").select("body").eq("conversation_id", c.id).eq("sender", targetId).order("created_at", { ascending: false }).limit(5);
      evidence = (m || []).map((x) => x.body.slice(0, 300)).reverse();
      const { data: a } = await admin.from("guardian_alerts").select("risk").eq("conversation_id", c.id).eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      risk = a?.risk || 0;
    }
  }
  const { error } = await admin.from("reports").insert({ reporter: user.id, target: targetId, conversation_id: conv, reason: String(reason || "r_other").slice(0, 30), note: String(note || "").slice(0, 1000), evidence, risk });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (block) await admin.from("blocks").upsert({ blocker: user.id, blocked: targetId });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { currentMember, hasPlus } from "@/lib/supabase/server";
import { askGuardian, type Lang } from "@/lib/guardian";
export async function POST(req: Request) {
  const { sb, user, profile } = await currentMember();
  if (!user || !profile) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!hasPlus(profile)) return NextResponse.json({ error: "plus" }, { status: 402 });
  const { history } = await req.json().catch(() => ({ history: [] }));
  const h = (Array.isArray(history) ? history : []).filter((m: { role: string; content: string }) => (m.role === "user" || m.role === "assistant") && m.content).map((m: { role: "user" | "assistant"; content: string }) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
  while (h.length && h[0].role !== "user") h.shift();
  if (!h.length || h[h.length - 1].role !== "user") return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { data: convs } = await sb.from("conversations").select("id,user_a,user_b").limit(20);
  const others = (convs || []).map((c) => (c.user_a === user.id ? c.user_b : c.user_a));
  const { data: ppl } = others.length ? await sb.from("profiles").select("id,name,age,city,trust").in("id", others) : { data: [] };
  const { data: alerts } = await sb.from("guardian_alerts").select("conversation_id,level,signals").order("created_at", { ascending: false }).limit(50);
  const ctx = (convs || []).map((c, i) => { const p = (ppl || []).find((x) => x.id === others[i]); const a = (alerts || []).find((x) => x.conversation_id === c.id);
    return p ? `- ${p.name}, ${p.age ?? "?"}, ${p.city}; trust ${p.trust}; Verimance Guardian level ${a?.level || "safe"}${a ? "; signals: " + (a.signals as { label: string }[]).map((s) => s.label).join("; ") : ""}` : ""; }).filter(Boolean).join("\n");
  const answer = await askGuardian(h, ctx, { name: profile.name, age: profile.age, city: profile.city }, profile.lang as Lang);
  return NextResponse.json({ answer });
}

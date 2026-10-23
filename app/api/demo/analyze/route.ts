import { NextResponse } from "next/server";
import { analyzeRules, type Lang } from "@/lib/guardian";
/** Public playground on /business. Rules engine only, so it costs nothing and needs no key. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) return NextResponse.json({ error: "messages[] is required" }, { status: 400 });
  const m = body.participants?.match || {}; const lang = (["en", "fr", "pt"].includes(body.locale) ? body.locale : "en") as Lang;
  const a = analyzeRules(body.messages.slice(-30).map((x: { role: string; text: string }) => ({ from: x.role === "user" ? "member" : "match", text: String(x.text || "").slice(0, 1000) })), { accountDays: Number(m.account_age_days) || 30, idVerified: !!m.id_verified, trust: 60 }, lang);
  return NextResponse.json({ conversation_id: body.conversation_id || null, risk_score: a.risk, risk_level: a.level, playbook_stage: a.stage, signals: a.signals, user_message: a.advice, engine: "guardian-rules (demo)" });
}

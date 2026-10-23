import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { analyzeConversation, type Lang } from "@/lib/guardian";
import { hashKey } from "@/lib/apikeys";

const ACTION = { safe: "none", caution: "nudge_user", high: "warn_user_and_block_links", critical: "interrupt_and_offer_help" } as const;

export async function POST(req: Request) {
  const t0 = Date.now();
  const key = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!key) return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
  const admin = supabaseAdmin();
  const { data: k } = await admin.from("api_keys").select("id,calls,revoked").eq("key_hash", hashKey(key)).maybeSingle();
  if (!k || k.revoked) return NextResponse.json({ error: "invalid_api_key" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) return NextResponse.json({ error: "messages[] is required" }, { status: 400 });
  const m = body.participants?.match || {};
  const lang = (["en", "fr", "pt"].includes(body.locale) ? body.locale : "en") as Lang;
  const msgs = body.messages.slice(-60).map((x: { role: string; text: string }) => ({ from: x.role === "user" ? "member" : "match", text: String(x.text || "").slice(0, 2000) }));
  const a = await analyzeConversation(msgs, { accountDays: Number(m.account_age_days) || 30, idVerified: !!m.id_verified, trust: Number(m.trust_score) || 60 }, lang);
  await admin.from("api_keys").update({ calls: (k.calls || 0) + 1 }).eq("id", k.id);
  return NextResponse.json({
    conversation_id: body.conversation_id || null, risk_score: a.risk, risk_level: a.level, playbook_stage: a.stage,
    signals: a.signals.map((s) => ({ type: s.label, evidence: s.evidence, weight: s.weight })), recommended_action: ACTION[a.level],
    user_message: a.advice, engine: a.engine === "ai" ? "guardian-llm" : "guardian-rules", latency_ms: Date.now() - t0,
  });
}

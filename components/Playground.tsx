"use client";
import { useState } from "react";
import type { Dict, Lang } from "@/lib/i18n";
const SAMPLE = (lang: Lang) => JSON.stringify({ conversation_id: "conv_7f2a", locale: lang, participants: { match: { account_age_days: 9, id_verified: false } }, messages: [
  { role: "match", text: "Good morning dear, I just landed in Hong Kong." }, { role: "user", text: "Morning!" },
  { role: "match", text: "My uncle showed me a trading platform, I made 30% this month. I can help you start with 500 USD." },
  { role: "match", text: "Let's keep it between us, your kids may not understand." }] }, null, 2);
export function Playground({ d, lang }: { d: Dict; lang: Lang }) {
  const [req, setReq] = useState(SAMPLE(lang)); const [res, setRes] = useState(""); const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true); let body: unknown; try { body = JSON.parse(req); } catch { setRes("// Invalid JSON"); setBusy(false); return; }
    const r = await fetch("/api/demo/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setRes(JSON.stringify(await r.json(), null, 2)); setBusy(false);
  }
  return (<div className="console">
    <div><b>{d.request}</b><textarea className="code" aria-label={d.request} value={req} onChange={(e) => setReq(e.target.value)} spellCheck={false} /></div>
    <div><div className="row" style={{ justifyContent: "space-between" }}><b>{d.response}</b><button className="btn sm primary" onClick={run} disabled={busy}>{d.tryApi}</button></div><pre className="code" aria-live="polite">{res}</pre></div>
  </div>);
}

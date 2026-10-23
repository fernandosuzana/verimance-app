"use client";
import { useState } from "react";
import type { Dict } from "@/lib/i18n";
type T = { role: "user" | "assistant"; content: string };
export function GuardianChat({ d, locked }: { d: Dict; locked: boolean }) {
  const [h, setH] = useState<T[]>([]); const [q, setQ] = useState(""); const [busy, setBusy] = useState(false);
  if (locked) return <div className="card stack"><p>{d.plusOnly}</p><a className="btn primary" href="/app/me#plan" style={{ alignSelf: "flex-start" }}>{d.seePlus}</a></div>;
  async function ask(e: React.FormEvent) {
    e.preventDefault(); const text = q.trim(); if (!text || busy) return;
    const next: T[] = [...h, { role: "user", content: text }]; setH(next); setQ(""); setBusy(true);
    const r = await fetch("/api/guardian/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ history: next }) });
    const j = await r.json().catch(() => ({})); setH([...next, { role: "assistant", content: j.answer || j.error || "…" }]); setBusy(false);
  }
  return (
    <div className="chatwrap">
      <div className="msgs">
        <div className="bub them">{d.gHello}</div>
        {h.map((m, i) => <div key={i} className={`bub ${m.role === "user" ? "me" : "them"}`}>{m.content}</div>)}
        {busy && <p className="note">…</p>}
      </div>
      <form className="composer" onSubmit={ask}><textarea aria-label={d.askPh} placeholder={d.askPh} value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn primary" disabled={busy}>{d.send}</button></form>
    </div>);
}

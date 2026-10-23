"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Dict, Lang } from "@/lib/i18n";

type M = { id: number; sender: string; body: string; created_at: string };
type A = { id: number; level: string; advice: string; signals: unknown; created_at: string };
type Other = { id: string; name: string; age: number | null; city: string; photo: string | null; trust: number; removed: boolean };
const REASONS = ["r_money", "r_invest", "r_offapp", "r_fake", "r_harass", "r_other"] as const;

export function Chat({ d, me, conversationId, other, initialMsgs, initialAlerts }: { d: Dict; lang: Lang; me: string; conversationId: string; other: Other; initialMsgs: M[]; initialAlerts: A[] }) {
  const [msgs, setMsgs] = useState<M[]>(initialMsgs); const [alerts, setAlerts] = useState<A[]>(initialAlerts);
  const [text, setText] = useState(""); const [sending, setSending] = useState(false); const [err, setErr] = useState("");
  const [panel, setPanel] = useState<"" | "report">(""); const [reason, setReason] = useState<string>("r_money"); const [note, setNote] = useState(""); const [done, setDone] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sb = supabaseBrowser();
    const ch = sb.channel(`conv-${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, (p) => setMsgs((x) => x.some((m) => m.id === (p.new as M).id) ? x : [...x, p.new as M]))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guardian_alerts", filter: `conversation_id=eq.${conversationId}` }, (p) => setAlerts((x) => [...x, p.new as A]))
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [conversationId]);
  const items = useMemo(() => [...msgs.map((m) => ({ k: "m" + m.id, t: m.created_at, m })), ...alerts.map((a) => ({ k: "a" + a.id, t: a.created_at, a }))].sort((x, y) => x.t.localeCompare(y.t)), [msgs, alerts]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [items.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault(); const body = text.trim(); if (!body || sending) return;
    setSending(true); setErr("");
    const r = await fetch("/api/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId, body }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setErr(j.error || "Error"); else { setText(""); if (j.message) setMsgs((x) => x.some((m) => m.id === j.message.id) ? x : [...x, j.message]); }
    setSending(false);
  }
  async function report(block: boolean) {
    const r = await fetch("/api/reports", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ targetId: other.id, conversationId, reason, note, block }) });
    if (r.ok) { setDone(d.reportThanks); setPanel(""); if (block) location.href = "/app/chats"; }
  }
  return (
    <div className="chatwrap">
      <div className="chathead">
        <a href="/app/chats" className="btn sm" aria-label={d.back}>‹</a>
        {other.photo ? <img className="av" src={other.photo} alt="" style={{ width: 40, height: 40 }} /> : <div className="av" style={{ width: 40, height: 40 }}>{other.name[0]}</div>}
        <div style={{ flex: 1, minWidth: 0 }}><div className="nm">{other.name}{other.age ? `, ${other.age}` : ""}</div><div className="ct">{other.city}</div></div>
        {!other.removed && <button className="btn sm" onClick={() => setPanel(panel ? "" : "report")}>{d.report}</button>}
      </div>
      {panel === "report" && (
        <div className="stack" style={{ padding: 14, borderBottom: "1px solid var(--line)" }}>
          <b>{d.reportH}</b>
          {REASONS.map((k) => <label key={k} className="chk"><input type="radio" name="r" checked={reason === k} onChange={() => setReason(k)} /> {d[k]}</label>)}
          <div className="field"><label htmlFor="note">{d.addNote}</label><textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} /></div>
          <div className="row"><button className="btn sm primary" onClick={() => report(false)}>{d.sendReport}</button><button className="btn sm danger" onClick={() => report(true)}>{d.sendReport} + {d.block}</button></div>
        </div>)}
      <div className="msgs" ref={box} aria-live="polite">
        <div className="gnote safe"><b>Guardian</b>{d.guardianWatching}</div>
        {done && <div className="gnote safe"><b>Verimance</b>{done}</div>}
        {items.map((it) => "m" in it && it.m
          ? <div key={it.k} className={`bub ${it.m.sender === me ? "me" : "them"}`}>{it.m.body}</div>
          : <div key={it.k} className={`gnote ${(it as { a: A }).a.level}`}><b>Guardian</b>{(it as { a: A }).a.advice}</div>)}
      </div>
      {other.removed ? <p className="banner" style={{ margin: 10 }}>{d.removedAcc}</p> : (
        <form className="composer" onSubmit={send}>
          <textarea aria-label={d.writeMsg} placeholder={d.writeMsg} value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); (e.currentTarget.form as HTMLFormElement).requestSubmit(); } }} />
          <button className="btn primary" disabled={sending}>{d.send}</button>
        </form>)}
      {err && <p className="err" style={{ padding: "0 12px 10px" }}>{err}</p>}
    </div>);
}

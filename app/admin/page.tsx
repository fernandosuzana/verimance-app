import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember, supabaseAdmin, configured } from "@/lib/supabase/server";
import { decide, verify, createKey, revokeKey } from "./actions";
import { NewKey } from "@/components/NewKey";

export const dynamic = "force-dynamic";
const REASON: Record<string, string> = { r_money: "Asked for money or gift cards", r_invest: "Pushed an investment or crypto", r_offapp: "Pressured to leave the app", r_fake: "Fake photos or identity", r_harass: "Harassment or threats", r_other: "Something else" };

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (!configured()) return <p>Database not connected.</p>;
  const { user, profile } = await currentMember(); if (!user) redirect("/login?next=/admin");
  if (profile?.role !== "admin") return <div className="card"><p>This area is for the Verimance safety team.</p></div>;
  const tab = (await searchParams).tab || "reports"; const admin = supabaseAdmin();
  const T = (k: string, l: string) => <Link className={`btn sm ${tab === k ? "primary" : ""}`} href={`/admin?tab=${k}`}>{l}</Link>;
  let body: React.ReactNode = null;
  if (tab === "reports") {
    const { data: reps } = await admin.from("reports").select("*").order("created_at", { ascending: false }).limit(300);
    const ids = [...new Set((reps || []).map((r) => r.target))];
    const { data: ppl } = ids.length ? await admin.from("profiles").select("id,name,age,city,photo_url,status,verification,created_at").in("id", ids) : { data: [] };
    const groups = ids.map((id) => ({ p: (ppl || []).find((x) => x.id === id), rs: (reps || []).filter((r) => r.target === id) }));
    const open = groups.filter((g) => g.rs.some((r) => r.status === "open"));
    body = (<>
      <div className="kpis"><div className="card kpi"><span className="muted">Open cases</span><b>{open.length}</b></div><div className="card kpi"><span className="muted">Reports (all time)</span><b>{reps?.length || 0}</b></div><div className="card kpi"><span className="muted">Accounts removed</span><b>{groups.filter((g) => g.p?.status === "removed").length}</b></div></div>
      <div className="list" style={{ marginTop: 16 }}>{groups.map(({ p, rs }) => { const isOpen = rs.some((r) => r.status === "open"); const risk = Math.max(...rs.map((r) => r.risk || 0));
        return (<article key={p?.id || rs[0].id} className="card case">
          <div className="row">{p?.photo_url ? <img className="av" src={p.photo_url} alt="" /> : <div className="av">{p?.name?.[0] || "?"}</div>}
            <div><div className="nm">{p?.name}, {p?.age} · {p?.city}</div><div className="ct">{rs.length} report(s) · account {p?.status} · ID {p?.verification}</div></div></div>
          <div style={{ textAlign: "right" }}><b style={{ fontSize: 28, color: risk >= 70 ? "var(--danger)" : risk >= 40 ? "var(--warn)" : "var(--safe)" }}>{risk}</b><div className="note">Verimance Guardian risk</div></div>
          <div style={{ gridColumn: "1/-1" }}>{rs.map((r) => (<div key={r.id} style={{ borderTop: "1px solid var(--line)", paddingTop: 8, marginTop: 8 }}>
            <b>{REASON[r.reason] || r.reason}</b> <span className={`chip ${r.status === "open" ? "warn" : "safe"}`}>{r.status}</span><span className="note"> · {new Date(r.created_at).toLocaleString()}</span>
            {r.note && <p className="small">“{r.note}”</p>}{(r.evidence as string[])?.length > 0 && <ul className="sigs">{(r.evidence as string[]).map((e, i) => <li key={i}>{e}</li>)}</ul>}</div>))}</div>
          <div className="acts">{isOpen ? <>
            <form action={decide}><input type="hidden" name="target" value={p?.id} /><button className="btn sm danger" name="status" value="removed">Remove account</button></form>
            <form action={decide}><input type="hidden" name="target" value={p?.id} /><button className="btn sm" name="status" value="restricted">Restrict</button></form>
            <form action={decide}><input type="hidden" name="target" value={p?.id} /><button className="btn sm" name="status" value="dismissed">No action</button></form></>
            : <form action={decide}><input type="hidden" name="target" value={p?.id} /><button className="btn sm" name="status" value="open">Reopen and restore account</button></form>}</div>
        </article>); })}{!groups.length && <p className="muted">No reports yet.</p>}</div></>);
  }
  if (tab === "verify") {
    const { data: q } = await admin.from("profiles").select("id,name,age,city,photo_url,created_at").eq("verification", "pending").order("created_at").limit(200);
    body = (<div className="list">{(q || []).map((p) => (<article key={p.id} className="card row">
      {p.photo_url ? <img className="av" src={p.photo_url} alt="" style={{ width: 72, height: 72 }} /> : <div className="av">?</div>}
      <div style={{ flex: 1 }}><div className="nm">{p.name}, {p.age}</div><div className="ct">{p.city} · since {new Date(p.created_at).toLocaleDateString()}</div></div>
      <form action={verify}><input type="hidden" name="id" value={p.id} /><button className="btn sm primary" name="ok" value="1">Approve</button></form>
      <form action={verify}><input type="hidden" name="id" value={p.id} /><button className="btn sm" name="ok" value="0">Reject</button></form></article>))}
      {!q?.length && <p className="muted">No one is waiting for verification.</p>}
      <p className="note">Approve only after checking an ID document and a live video or selfie with the member. Connect an identity provider (see README) to automate this.</p></div>);
  }
  if (tab === "investors") {
    const { data: m } = await admin.from("investor_messages").select("*").order("created_at", { ascending: false }).limit(200);
    body = <div className="list">{(m || []).map((x) => <article key={x.id} className="card"><div className="nm">{x.name}{x.org ? ` · ${x.org}` : ""}</div><a href={`mailto:${x.email}`}>{x.email}</a><p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{x.message}</p><p className="note">{new Date(x.created_at).toLocaleString()}</p></article>)}{!m?.length && <p className="muted">No messages yet.</p>}</div>;
  }
  if (tab === "keys") {
    const { data: k } = await admin.from("api_keys").select("id,name,prefix,calls,revoked,created_at").order("created_at", { ascending: false });
    body = (<div className="stack"><div className="card"><NewKey action={createKey} /></div>
      {(k || []).map((x) => <article key={x.id} className="card row"><div style={{ flex: 1 }}><div className="nm">{x.name}</div><div className="ct"><code>{x.prefix}…</code> · {x.calls} calls · {x.revoked ? "revoked" : "active"}</div></div>
        {!x.revoked && <form action={revokeKey}><input type="hidden" name="id" value={x.id} /><button className="btn sm danger">Revoke</button></form>}</article>)}</div>);
  }
  return (<div className="stack"><p className="eyebrow">Trust &amp; Safety console</p><h1 style={{ fontSize: 40 }}>Verimance team</h1>
    <div className="tabs2">{T("reports", "Reports")}{T("verify", "Verification")}{T("investors", "Investor messages")}{T("keys", "API keys")}</div>{body}</div>);
}

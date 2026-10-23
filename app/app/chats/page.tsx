import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";

export default async function Chats() {
  const { d } = await getDict(); const { sb, user } = await currentMember(); if (!user) redirect("/login");
  const { data: convs } = await sb.from("conversations").select("id,user_a,user_b,last_message,last_message_at").order("last_message_at", { ascending: false }).limit(100);
  const others = (convs || []).map((c) => (c.user_a === user.id ? c.user_b : c.user_a));
  const { data: ppl } = others.length ? await sb.from("profiles").select("id,name,photo_url").in("id", others) : { data: [] };
  const { data: alerts } = await sb.from("guardian_alerts").select("conversation_id,level,created_at").order("created_at", { ascending: false }).limit(300);
  const lvl = new Map<string, string>(); (alerts || []).forEach((a) => { if (!lvl.has(a.conversation_id)) lvl.set(a.conversation_id, a.level); });
  const byId = new Map((ppl || []).map((p) => [p.id, p]));
  return (
    <div className="stack"><h1 style={{ fontSize: 36 }}>{d.chats}</h1>
      {!convs?.length && <p className="muted">{d.noChats}</p>}
      <div className="list">{(convs || []).map((c, i) => { const p = byId.get(others[i]); const l = lvl.get(c.id);
        return (<Link key={c.id} href={`/app/chats/${c.id}`} className="card row" style={{ textDecoration: "none", color: "inherit" }}>
          {p?.photo_url ? <img className="av" src={p.photo_url} alt="" /> : <div className="av">{p?.name?.[0] || "?"}</div>}
          <div style={{ minWidth: 0, flex: 1 }}><div className="nm">{p?.name || "—"}</div><div className="ct" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last_message}</div></div>
          {l && l !== "safe" && <span className={`chip ${l === "caution" ? "warn" : "danger"}`}>Guardian</span>}
        </Link>); })}</div>
    </div>);
}

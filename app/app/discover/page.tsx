import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";
import { startConversation } from "../actions";

export default async function Discover() {
  const { d } = await getDict(); const { sb, user, profile } = await currentMember(); if (!user || !profile) redirect("/login");
  if (!profile.age) redirect("/app/onboarding");
  const { data: blocks } = await sb.from("blocks").select("blocked").eq("blocker", user.id);
  const hidden = new Set([user.id, ...(blocks || []).map((b) => b.blocked)]);
  let q = sb.from("profiles").select("id,name,age,city,gender,seeking,bio,photo_url,trust,created_at").eq("verification", "verified").eq("status", "active").eq("community_visible", true).limit(60);
  if (profile.seeking !== "all") q = q.eq("gender", profile.seeking);
  const { data } = await q;
  const people = (data || []).filter((p) => !hidden.has(p.id) && (p.seeking === "all" || p.seeking === profile.gender));
  const vchip = { none: "", pending: <span className="chip warn">{d.pending}</span>, verified: <span className="chip safe">{d.verified}</span>, rejected: <span className="chip danger">{d.rejected}</span> }[profile.verification];
  return (
    <div className="stack">
      <div className="row"><h1 style={{ fontSize: 36 }}>{d.discover}</h1><span style={{ marginLeft: "auto" }}>{vchip}</span></div>
      {profile.verification === "none" && <p className="card"><Link href="/app/onboarding?step=verify">{d.startVerify}</Link></p>}
      {people.length === 0 && <p className="muted">{d.noOne}</p>}
      <div className="list">{people.map((p) => (
        <article key={p.id} className="card prof">
          <div className="row">{p.photo_url ? <img className="av" src={p.photo_url} alt="" /> : <div className="av">{p.name?.[0] || "?"}</div>}
            <div><div className="nm">{p.name}, {p.age}</div><div className="ct">{p.city}</div></div>
            <div className="trust"><b>{p.trust}</b><small>Trust</small></div></div>
          {p.bio && <p className="muted">{p.bio}</p>}
          <span className="chip safe" style={{ alignSelf: "flex-start" }}>{d.verified}</span>
          <form action={startConversation}><input type="hidden" name="other" value={p.id} /><button className="btn sm primary">{d.sayHello}</button></form>
        </article>))}</div>
    </div>);
}

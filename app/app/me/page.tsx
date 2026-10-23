import { redirect } from "next/navigation";
import { currentMember, hasPlus } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";
import { ProfileForm } from "@/components/ProfileForm";
import { PhotoUpload } from "@/components/PhotoUpload";
import { AllyForm } from "@/components/AllyForm";
import { saveProfile, saveAlly } from "../actions";

export default async function Me({ searchParams }: { searchParams: Promise<{ billing?: string }> }) {
  const { d, lang } = await getDict(); const { sb, user, profile } = await currentMember(); if (!user || !profile) redirect("/login");
  const { data: ally } = await sb.from("allies").select("name,relation,email").eq("user_id", user.id).maybeSingle();
  const billingOn = !!process.env.STRIPE_SECRET_KEY; const { billing } = await searchParams;
  const ends = new Date(profile.plan_ends).toLocaleDateString(lang === "pt" ? "pt-BR" : lang === "fr" ? "fr-CA" : "en-CA", { day: "numeric", month: "long", year: "numeric" });
  const plan = profile.plan === "plus" ? `${d.planPlus} · ${ends}` : hasPlus(profile) ? `${d.planTrial} ${ends}` : d.planFree;
  return (
    <div className="stack">
      <h1 style={{ fontSize: 36 }}>{d.me}</h1>
      <section className="card stack"><b>{d.photo}</b><PhotoUpload uid={user.id} current={profile.photo_url} label={d.choosePhoto} />
        <p className="small">{profile.verification === "verified" ? <span className="chip safe">{d.verified}</span> : profile.verification === "pending" ? <span className="chip warn">{d.pending}</span> : <a href="/app/onboarding?step=verify">{d.startVerify}</a>}</p></section>
      <section id="plan" className="card stack"><b>Verimance Guardian+</b><p>{plan}</p>
        {billing === "ok" && <p className="ok">{d.saved}</p>}
        {!billingOn ? <p className="note">{d.billingOff}</p> : profile.plan === "plus"
          ? <form action="/api/billing/portal" method="post"><button className="btn sm">{d.manageBilling}</button></form>
          : <div className="row"><form action="/api/billing/checkout" method="post"><input type="hidden" name="interval" value="month" /><button className="btn primary sm">{d.subscribe} · {d.monthly}</button></form>
              <form action="/api/billing/checkout" method="post"><input type="hidden" name="interval" value="year" /><button className="btn sm">{d.yearly}</button></form></div>}
        <p className="note">{d.priceNote}</p></section>
      <section className="card stack"><b>{d.allyH}</b><p className="muted small">{d.allyP}</p><AllyForm d={d} ally={ally} action={saveAlly} /></section>
      <h2 style={{ fontSize: 26 }}>{d.editProfile}</h2>
      <ProfileForm d={d} p={profile} action={saveProfile} />
      <form action="/auth/logout" method="post"><button className="btn">{d.logout}</button></form>
    </div>);
}

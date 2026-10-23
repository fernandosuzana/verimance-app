"use client";
import { useActionState } from "react";
import type { Dict } from "@/lib/i18n";
import type { Profile } from "@/lib/supabase/server";
type State = { error?: string; info?: string } | undefined;
export function ProfileForm({ d, p, action, onboarding }: { d: Dict; p: Profile; action: (s: State, fd: FormData) => Promise<State>; onboarding?: boolean }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="card stack">
      {onboarding && <input type="hidden" name="onboarding" value="1" />}
      <div className="field"><label htmlFor="name">{d.name}</label><input id="name" name="name" defaultValue={p.name} required /></div>
      <div className="field"><label htmlFor="age">{d.age}</label><input id="age" name="age" type="number" min={18} max={110} defaultValue={p.age ?? ""} required /></div>
      <div className="field"><label htmlFor="city">{d.city}</label><input id="city" name="city" defaultValue={p.city} required /></div>
      <div className="field"><label htmlFor="gender">{d.iAm}</label><select id="gender" name="gender" defaultValue={p.gender}><option value="w">{d.woman}</option><option value="m">{d.man}</option><option value="nb">{d.nonbinary}</option></select></div>
      <div className="field"><label htmlFor="seeking">{d.interested}</label><select id="seeking" name="seeking" defaultValue={p.seeking}><option value="m">{d.men}</option><option value="w">{d.women}</option><option value="all">{d.everyone}</option></select></div>
      <div className="field"><label htmlFor="intent">{d.lookingFor}</label><select id="intent" name="intent" defaultValue={p.intent}><option value="serious">{d.serious}</option><option value="companion">{d.companion}</option><option value="friends">{d.friends}</option></select></div>
      <div className="field"><label htmlFor="bio">{d.bio}</label><textarea id="bio" name="bio" maxLength={600} defaultValue={p.bio} /></div>
      {!onboarding && <label className="chk"><input type="checkbox" name="community_visible" defaultChecked={p.community_visible} /> {d.visible}</label>}
      {state?.error && <p className="err" role="alert">{state.error}</p>}{state?.info && <p className="ok" role="status">{state.info}</p>}
      <button className="btn primary" disabled={pending}>{onboarding ? d.continue : d.save}</button>
    </form>
  );
}

"use client";
import { useActionState } from "react";
import type { Dict } from "@/lib/i18n";
type State = { error?: string; info?: string } | undefined;
export function AllyForm({ d, ally, action }: { d: Dict; ally: { name: string; relation: string; email: string } | null; action: (s: State, fd: FormData) => Promise<State> }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="stack">
      <div className="field"><label htmlFor="aname">{d.name}</label><input id="aname" name="name" defaultValue={ally?.name} required /></div>
      <div className="field"><label htmlFor="arel">{d.relation}</label><input id="arel" name="relation" defaultValue={ally?.relation} /></div>
      <div className="field"><label htmlFor="aemail">{d.allyEmail}</label><input id="aemail" name="email" type="email" defaultValue={ally?.email} required /></div>
      {state?.error && <p className="err">{state.error}</p>}{state?.info && <p className="ok">{state.info}</p>}
      <div className="row"><button className="btn primary sm" disabled={pending}>{d.save}</button>{ally && <button className="btn sm" name="remove" value="1">{d.removeAlly}</button>}</div>
    </form>);
}

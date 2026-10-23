"use client";
import { useActionState } from "react";
import type { Dict } from "@/lib/i18n";
type S = { error?: string; info?: string } | undefined;
export function InvestorForm({ d, action }: { d: Dict; action: (s: S, fd: FormData) => Promise<S> }) {
  const [st, run, pending] = useActionState(action, undefined);
  if (st?.info) return <div className="card"><p className="ok" role="status">{st.info}</p></div>;
  return (<form action={run} className="card stack" noValidate>
    <div className="field"><label htmlFor="name">{d.yourName}</label><input id="name" name="name" autoComplete="name" /></div>
    <div className="field"><label htmlFor="org">{d.org}</label><input id="org" name="org" autoComplete="organization" /></div>
    <div className="field"><label htmlFor="email">{d.email}</label><input id="email" name="email" type="email" autoComplete="email" /></div>
    <div className="field"><label htmlFor="message">{d.message}</label><textarea id="message" name="message" /></div>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999 }} />
    {st?.error && <p className="err" role="alert">{st.error}</p>}
    <button className="btn primary" disabled={pending}>{d.send}</button>
  </form>);
}

"use client";
import { useActionState } from "react";
type S = { key?: string; error?: string } | undefined;
export function NewKey({ action }: { action: (s: S, fd: FormData) => Promise<S> }) {
  const [st, run, pending] = useActionState(action, undefined);
  return (<form action={run} className="stack">
    <div className="row"><input name="name" placeholder="Partner name" style={{ flex: 1, minHeight: 44, borderRadius: 12, border: "1.5px solid var(--line2)", padding: "0 12px", background: "var(--bg)" }} /><button className="btn sm primary" disabled={pending}>Create key</button></div>
    {st?.key && <p className="ok">Copy this key now, it won't be shown again: <code style={{ userSelect: "all" }}>{st.key}</code></p>}
    {st?.error && <p className="err">{st.error}</p>}
  </form>);
}

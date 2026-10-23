"use client";
import { useActionState } from "react";
type State = { error?: string; info?: string } | undefined;
export function AuthForm({ action, children, submit }: { action: (s: State, fd: FormData) => Promise<State>; children: React.ReactNode; submit: string }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="card stack" noValidate>
      {children}
      {state?.error && <p className="err" role="alert">{state.error}</p>}
      {state?.info && <p className="ok" role="status">{state.info}</p>}
      <button className="btn primary" disabled={pending}>{pending ? "…" : submit}</button>
    </form>
  );
}

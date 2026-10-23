import Link from "next/link";
import { getDict } from "@/lib/lang";
import { AuthForm } from "@/components/AuthForm";
import { logIn } from "../auth/actions";
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { d } = await getDict(); const { next } = await searchParams;
  return (<div className="authbox stack"><h1 style={{ fontSize: 40 }}>{d.welcomeBack}</h1>
    <AuthForm action={logIn} submit={d.login}>
      <input type="hidden" name="next" value={next || "/app"} />
      <div className="field"><label htmlFor="email">{d.email}</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="password">{d.password}</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
    </AuthForm>
    <p className="small"><Link href="/reset">{d.forgot}</Link></p>
    <p className="small">{d.newHere} <Link href="/signup">{d.createAcc}</Link></p></div>);
}

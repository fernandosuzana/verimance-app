import Link from "next/link";
import { getDict } from "@/lib/lang";
import { AuthForm } from "@/components/AuthForm";
import { signUp } from "../auth/actions";
export default async function SignUp() {
  const { d } = await getDict();
  return (<div className="authbox stack"><h1 style={{ fontSize: 40 }}>{d.ctaJoin}</h1>
    <AuthForm action={signUp} submit={d.createAcc}>
      <div className="field"><label htmlFor="name">{d.name}</label><input id="name" name="name" autoComplete="given-name" required /></div>
      <div className="field"><label htmlFor="email">{d.email}</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="password">{d.password}</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /><small className="note">{d.pwHint}</small></div>
      <label className="chk"><input type="checkbox" name="terms" /> {d.terms}</label>
    </AuthForm>
    <p className="small">{d.haveAcc} <Link href="/login">{d.login}</Link></p></div>);
}

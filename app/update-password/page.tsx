import { getDict } from "@/lib/lang";
import { AuthForm } from "@/components/AuthForm";
import { updatePassword } from "../auth/actions";
export default async function UpdatePw() {
  const { d } = await getDict();
  return (<div className="authbox stack"><h1 style={{ fontSize: 36 }}>{d.newPw}</h1>
    <AuthForm action={updatePassword} submit={d.save}><div className="field"><label htmlFor="password">{d.newPw}</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div></AuthForm></div>);
}

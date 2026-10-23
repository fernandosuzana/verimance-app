import { getDict } from "@/lib/lang";
import { AuthForm } from "@/components/AuthForm";
import { sendReset } from "../auth/actions";
export default async function Reset() {
  const { d } = await getDict();
  return (<div className="authbox stack"><h1 style={{ fontSize: 36 }}>{d.resetH}</h1>
    <AuthForm action={sendReset} submit={d.resetSend}><div className="field"><label htmlFor="email">{d.email}</label><input id="email" name="email" type="email" autoComplete="email" required /></div></AuthForm></div>);
}

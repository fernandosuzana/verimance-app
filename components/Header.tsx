import Link from "next/link";
import { Logo } from "./Logo";
import { getDict } from "@/lib/lang";
import { LANGS } from "@/lib/i18n";
import { configured, supabaseServer } from "@/lib/supabase/server";

export async function Header() {
  const { lang, d } = await getDict();
  let signedIn = false;
  if (configured()) { const sb = await supabaseServer(); const { data } = await sb.auth.getUser(); signedIn = !!data.user; }
  return (
    <header className="top"><div className="wrap topin">
      <Link className="brand" href="/" aria-label="Verimance"><Logo /><b>Verimance</b></Link>
      <nav className="nav" aria-label="Main">
        <Link href="/">{d.home}</Link><Link href="/app">{d.app}</Link><Link href="/business">{d.business}</Link><Link href="/investors">{d.investors}</Link>
      </nav>
      <div className="langs" role="group" aria-label="Language">
        {LANGS.map((l) => <a key={l} href={`/api/lang?l=${l}`} aria-current={l === lang}>{l.toUpperCase()}</a>)}
      </div>
      <div className="hbtns">
        {signedIn
          ? <form action="/auth/logout" method="post"><button className="btn sm">{d.logout}</button></form>
          : <><Link className="btn sm" href="/login">{d.login}</Link><Link className="btn sm primary" href="/signup">{d.join}</Link></>}
      </div>
    </div></header>
  );
}

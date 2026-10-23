import Link from "next/link";
import { redirect } from "next/navigation";
import { currentMember, configured } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { d } = await getDict();
  if (!configured()) return <div className="authbox card"><p>{d.notConfigured}</p></div>;
  const { user, profile } = await currentMember();
  if (!user) redirect("/login?next=/app");
  return (
    <div className="appshell">
      {profile?.status === "restricted" && <p className="banner" style={{ marginBottom: 14 }}>{d.restrictedMe}</p>}
      {profile?.status === "removed" ? <p className="banner">{d.removedAcc}</p> : children}
      <nav className="tabbar" aria-label="App">
        <Link href="/app/discover">{d.discover}</Link><Link href="/app/chats">{d.chats}</Link><Link href="/app/guardian">Verimance Guardian</Link><Link href="/app/me">{d.me}</Link>
      </nav>
    </div>
  );
}

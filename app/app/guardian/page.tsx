import { redirect } from "next/navigation";
import { currentMember, hasPlus } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";
import { GuardianChat } from "@/components/GuardianChat";
export default async function GuardianPage() {
  const { d } = await getDict(); const { user, profile } = await currentMember(); if (!user) redirect("/login");
  return <div className="stack"><h1 style={{ fontSize: 36 }}>{d.talkGuardian}</h1><GuardianChat d={d} locked={!hasPlus(profile)} /></div>;
}

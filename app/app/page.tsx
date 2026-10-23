import { redirect } from "next/navigation";
import { currentMember } from "@/lib/supabase/server";
export default async function AppHome() {
  const { profile } = await currentMember();
  redirect(!profile?.age || !profile?.city ? "/app/onboarding" : "/app/discover");
}

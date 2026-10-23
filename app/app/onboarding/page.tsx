import { redirect } from "next/navigation";
import { currentMember } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";
import { ProfileForm } from "@/components/ProfileForm";
import { PhotoUpload } from "@/components/PhotoUpload";
import { saveProfile, requestVerification } from "../actions";

export default async function Onboarding({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const { d } = await getDict(); const { user, profile } = await currentMember(); if (!user || !profile) redirect("/login");
  const { step } = await searchParams;
  if (step === "verify") return (
    <div className="stack"><h1 style={{ fontSize: 38 }}>{d.verifyH}</h1>
      <div className="card stack"><p>{d.verifyP}</p>
        <PhotoUpload uid={user.id} current={profile.photo_url} label={d.choosePhoto} />
        <form action={requestVerification}><button className="btn primary">{d.startVerify}</button></form></div></div>);
  return (<div className="stack"><h1 style={{ fontSize: 38 }}>{d.aboutYou}</h1><ProfileForm d={d} p={profile} action={saveProfile} onboarding /></div>);
}

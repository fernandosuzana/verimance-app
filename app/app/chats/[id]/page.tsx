import { notFound, redirect } from "next/navigation";
import { currentMember } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";
import { Chat } from "@/components/Chat";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const { d, lang } = await getDict();
  const { sb, user } = await currentMember(); if (!user) redirect("/login");
  const { data: c } = await sb.from("conversations").select("id,user_a,user_b").eq("id", id).single();
  if (!c) notFound();
  const otherId = c.user_a === user.id ? c.user_b : c.user_a;
  const { data: other } = await sb.from("profiles").select("id,name,age,city,photo_url,trust,status").eq("id", otherId).maybeSingle();
  const { data: msgs } = await sb.from("messages").select("id,sender,body,created_at").eq("conversation_id", id).order("created_at").limit(500);
  const { data: alerts } = await sb.from("guardian_alerts").select("id,level,advice,signals,created_at").eq("conversation_id", id).order("created_at").limit(100);
  return <Chat d={d} lang={lang} me={user.id} conversationId={id} other={other ? { id: other.id, name: other.name, age: other.age, city: other.city, photo: other.photo_url, trust: other.trust, removed: other.status === "removed" } : { id: otherId, name: "—", age: null, city: "", photo: null, trust: 0, removed: true }} initialMsgs={msgs || []} initialAlerts={alerts || []} />;
}

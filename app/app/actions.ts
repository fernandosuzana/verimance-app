"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentMember, supabaseAdmin } from "@/lib/supabase/server";
import { getDict } from "@/lib/lang";

export async function saveProfile(_: unknown, fd: FormData) {
  const { d } = await getDict(); const { sb, user } = await currentMember(); if (!user) redirect("/login");
  const age = Number(fd.get("age"));
  if (!(age >= 18 && age <= 110)) return { error: d.age + " 18+" };
  const patch = {
    name: String(fd.get("name") || "").trim().slice(0, 40), age, city: String(fd.get("city") || "").trim().slice(0, 80),
    gender: String(fd.get("gender")), seeking: String(fd.get("seeking")), intent: String(fd.get("intent") || "serious"),
    bio: String(fd.get("bio") || "").slice(0, 600), community_visible: fd.get("community_visible") !== null || fd.get("onboarding") !== null,
  };
  const { error } = await sb.from("profiles").update(patch).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/app", "layout");
  if (fd.get("onboarding")) redirect("/app/onboarding?step=verify");
  return { info: d.saved };
}

export async function requestVerification() {
  const { user, profile } = await currentMember(); if (!user) redirect("/login");
  if (profile?.verification === "none" || profile?.verification === "rejected")
    await supabaseAdmin().from("profiles").update({ verification: "pending" }).eq("id", user.id);
  redirect("/app/discover");
}

export async function startConversation(fd: FormData) {
  const { sb, user } = await currentMember(); if (!user) redirect("/login");
  const other = String(fd.get("other"));
  const { data: target } = await sb.from("profiles").select("id").eq("id", other).single(); // RLS: only visible, verified, active members
  if (!target || other === user.id) redirect("/app/discover");
  const [a, b] = [user.id, other].sort();
  const admin = supabaseAdmin();
  const { data: existing } = await admin.from("conversations").select("id").eq("user_a", a).eq("user_b", b).maybeSingle();
  const id = existing?.id ?? (await admin.from("conversations").insert({ user_a: a, user_b: b }).select("id").single()).data?.id;
  redirect(`/app/chats/${id}`);
}

export async function saveAlly(_: unknown, fd: FormData) {
  const { d } = await getDict(); const { sb, user } = await currentMember(); if (!user) redirect("/login");
  if (fd.get("remove")) { await sb.from("allies").delete().eq("user_id", user.id); revalidatePath("/app/me"); return { info: d.saved }; }
  const email = String(fd.get("email") || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: d.invErr };
  const { error } = await sb.from("allies").upsert({ user_id: user.id, name: String(fd.get("name") || "").slice(0, 60), relation: String(fd.get("relation") || "").slice(0, 40), email, notify_money: true });
  if (error) return { error: error.message };
  revalidatePath("/app/me"); return { info: d.saved };
}

export async function blockUser(fd: FormData) {
  const { sb, user } = await currentMember(); if (!user) redirect("/login");
  await sb.from("blocks").upsert({ blocker: user.id, blocked: String(fd.get("other")) });
  redirect("/app/chats");
}

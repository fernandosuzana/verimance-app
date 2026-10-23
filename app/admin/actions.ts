"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentMember, supabaseAdmin } from "@/lib/supabase/server";
import { hashKey, newKey } from "@/lib/apikeys";

async function requireAdmin() { const { user, profile } = await currentMember(); if (!user || profile?.role !== "admin") redirect("/app"); return user.id; }

export async function decide(fd: FormData) {
  const me = await requireAdmin(); const target = String(fd.get("target")); const status = String(fd.get("status"));
  if (!["removed", "restricted", "dismissed", "open"].includes(status)) return;
  const admin = supabaseAdmin();
  await admin.from("reports").update({ status, decided_by: status === "open" ? null : me, decided_at: status === "open" ? null : new Date().toISOString() }).eq("target", target).in("status", status === "open" ? ["removed", "restricted", "dismissed"] : ["open"]);
  await admin.from("profiles").update({ status: status === "removed" ? "removed" : status === "restricted" ? "restricted" : "active" }).eq("id", target);
  revalidatePath("/admin");
}
export async function verify(fd: FormData) {
  await requireAdmin(); const ok = fd.get("ok") === "1";
  await supabaseAdmin().from("profiles").update({ verification: ok ? "verified" : "rejected", trust: ok ? 80 : 40 }).eq("id", String(fd.get("id")));
  revalidatePath("/admin");
}
export async function createKey(_: unknown, fd: FormData) {
  await requireAdmin(); const name = String(fd.get("name") || "").trim().slice(0, 60) || "Partner";
  const key = newKey();
  const { error } = await supabaseAdmin().from("api_keys").insert({ name, prefix: key.slice(0, 12), key_hash: hashKey(key) });
  revalidatePath("/admin");
  return error ? { error: error.message } : { key };
}
export async function revokeKey(fd: FormData) {
  await requireAdmin(); await supabaseAdmin().from("api_keys").update({ revoked: true }).eq("id", Number(fd.get("id"))); revalidatePath("/admin");
}

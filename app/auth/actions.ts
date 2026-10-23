"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { configured, supabaseServer } from "@/lib/supabase/server";
import { getDict, getLang } from "@/lib/lang";

const site = async () => process.env.NEXT_PUBLIC_SITE_URL || `https://${(await headers()).get("host")}`;

export async function signUp(_: unknown, fd: FormData) {
  const { d } = await getDict(); if (!configured()) return { error: d.notConfigured };
  const name = String(fd.get("name") || "").trim(), email = String(fd.get("email") || "").trim(), password = String(fd.get("password") || "");
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: d.invErr };
  if (password.length < 8) return { error: d.pwHint };
  if (!fd.get("terms")) return { error: d.terms };
  const sb = await supabaseServer();
  const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name, lang: await getLang() }, emailRedirectTo: `${await site()}/auth/callback?next=/app/onboarding` } });
  if (error) return { error: error.message };
  if (!data.session) return { info: d.checkEmail };
  redirect("/app/onboarding");
}

export async function logIn(_: unknown, fd: FormData) {
  const { d } = await getDict(); if (!configured()) return { error: d.notConfigured };
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email: String(fd.get("email") || "").trim(), password: String(fd.get("password") || "") });
  if (error) return { error: d.badLogin };
  const next = String(fd.get("next") || "/app");
  redirect(next.startsWith("/") ? next : "/app");
}

export async function sendReset(_: unknown, fd: FormData) {
  const { d } = await getDict(); if (!configured()) return { error: d.notConfigured };
  const sb = await supabaseServer();
  await sb.auth.resetPasswordForEmail(String(fd.get("email") || "").trim(), { redirectTo: `${await site()}/auth/callback?next=/update-password` });
  return { info: d.resetSent };
}

export async function updatePassword(_: unknown, fd: FormData) {
  const { d } = await getDict(); const pw = String(fd.get("password") || "");
  if (pw.length < 8) return { error: d.pwHint };
  const sb = await supabaseServer(); const { error } = await sb.auth.updateUser({ password: pw });
  if (error) return { error: error.message };
  redirect("/app");
}

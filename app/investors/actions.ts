"use server";
import { supabaseAdmin, configured } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { getDict } from "@/lib/lang";
export async function sendInvestorMessage(_: unknown, fd: FormData) {
  const { d } = await getDict();
  const name = String(fd.get("name") || "").trim().slice(0, 100), org = String(fd.get("org") || "").trim().slice(0, 120);
  const email = String(fd.get("email") || "").trim().slice(0, 200), message = String(fd.get("message") || "").trim().slice(0, 4000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: d.invErr };
  if (String(fd.get("website") || "")) return { info: d.invThanks }; // honeypot
  if (!configured()) return { error: d.notConfigured };
  const { error } = await supabaseAdmin().from("investor_messages").insert({ name, org, email, message });
  if (error) return { error: error.message };
  await sendEmail(process.env.INVESTORS_INBOX || "investors@verimance.com", `Investor message · ${name}${org ? " · " + org : ""}`, `${message}\n\n${name}${org ? " · " + org : ""}\n${email}`, email);
  return { info: d.invThanks };
}

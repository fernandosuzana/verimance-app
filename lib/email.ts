import "server-only";
/** Sends an email through Resend when RESEND_API_KEY is set. Returns false when email isn't configured. */
export async function sendEmail(to: string, subject: string, text: string, replyTo?: string) {
  if (!process.env.RESEND_API_KEY) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "Verimance <hello@verimance.com>", to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  }).catch(() => null);
  return !!r?.ok;
}

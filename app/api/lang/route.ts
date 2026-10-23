import { NextResponse, type NextRequest } from "next/server";
import { configured, supabaseServer } from "@/lib/supabase/server";
export async function GET(req: NextRequest) {
  const l = req.nextUrl.searchParams.get("l");
  const lang = l === "fr" || l === "pt" ? l : "en";
  let back = "/";
  try { const r = new URL(req.headers.get("referer") || "/", req.url); if (r.origin === req.nextUrl.origin) back = r.pathname + r.search; } catch {}
  const res = NextResponse.redirect(new URL(back, req.url));
  res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  if (configured()) {
    const sb = await supabaseServer(); const { data: { user } } = await sb.auth.getUser();
    if (user) await sb.from("profiles").update({ lang }).eq("id", user.id);
  }
  return res;
}

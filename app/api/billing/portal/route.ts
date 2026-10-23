import { NextResponse } from "next/server";
import { currentMember, supabaseAdmin } from "@/lib/supabase/server";
import { stripe, siteUrl } from "@/lib/stripe";
export async function POST(req: Request) {
  const s = stripe(); const { user } = await currentMember();
  if (!user || !s) return NextResponse.redirect(new URL("/app/me", req.url), 303);
  const { data } = await supabaseAdmin().from("profiles").select("stripe_customer").eq("id", user.id).single();
  if (!data?.stripe_customer) return NextResponse.redirect(new URL("/app/me", req.url), 303);
  const p = await s.billingPortal.sessions.create({ customer: data.stripe_customer, return_url: `${siteUrl(req)}/app/me#plan` });
  return NextResponse.redirect(p.url, 303);
}

import { NextResponse } from "next/server";
import { currentMember } from "@/lib/supabase/server";
import { stripe, siteUrl } from "@/lib/stripe";
export async function POST(req: Request) {
  const s = stripe(); const { user, profile } = await currentMember();
  if (!user || !profile) return NextResponse.redirect(new URL("/login", req.url), 303);
  if (!s) return NextResponse.redirect(new URL("/app/me#plan", req.url), 303);
  const fd = await req.formData(); const yearly = fd.get("interval") === "year";
  const price = yearly ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY;
  const session = await s.checkout.sessions.create({
    mode: "subscription", line_items: [{ price: price!, quantity: 1 }], client_reference_id: user.id, customer_email: user.email,
    metadata: { user_id: user.id }, subscription_data: { metadata: { user_id: user.id } }, allow_promotion_codes: true,
    success_url: `${siteUrl(req)}/app/me?billing=ok#plan`, cancel_url: `${siteUrl(req)}/app/me#plan`,
  });
  return NextResponse.redirect(session.url!, 303);
}

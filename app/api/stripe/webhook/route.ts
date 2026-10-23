import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
export async function POST(req: Request) {
  const s = stripe(); if (!s || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ ok: false }, { status: 501 });
  let ev: Stripe.Event;
  try { ev = s.webhooks.constructEvent(await req.text(), req.headers.get("stripe-signature") || "", process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: "bad signature" }, { status: 400 }); }
  const admin = supabaseAdmin();
  if (ev.type === "checkout.session.completed") {
    const ses = ev.data.object as Stripe.Checkout.Session; const uid = ses.client_reference_id || ses.metadata?.user_id;
    if (uid) await admin.from("profiles").update({ plan: "plus", stripe_customer: String(ses.customer || ""), plan_ends: new Date(Date.now() + 32 * 864e5).toISOString() }).eq("id", uid);
  }
  if (ev.type === "customer.subscription.updated" || ev.type === "customer.subscription.deleted") {
    const sub = ev.data.object as Stripe.Subscription; const uid = sub.metadata?.user_id; if (!uid) return NextResponse.json({ ok: true });
    const active = ["active", "trialing", "past_due"].includes(sub.status) && ev.type !== "customer.subscription.deleted";
    const end = (sub as unknown as { current_period_end?: number }).current_period_end || sub.items?.data?.[0]?.current_period_end;
    await admin.from("profiles").update({ plan: active ? "plus" : "free", plan_ends: end ? new Date(end * 1000).toISOString() : new Date().toISOString() }).eq("id", uid);
  }
  return NextResponse.json({ ok: true });
}

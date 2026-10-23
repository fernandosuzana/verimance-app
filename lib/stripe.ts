import "server-only";
import Stripe from "stripe";
export const stripe = () => (process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null);
export const siteUrl = (req: Request) => process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

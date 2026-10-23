import { createServerClient } from "@supabase/ssr";
import { createClient as createPlain } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function configured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Supabase client acting as the signed-in member (respects Row Level Security). */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a server component */ }
      },
    },
  });
}

/** Service-role client for trusted server code only (bypasses RLS). Never import in client components. */
export function supabaseAdmin() {
  return createPlain(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Profile = {
  id: string; name: string; age: number | null; city: string; gender: "w" | "m" | "nb"; seeking: "w" | "m" | "all";
  intent: string; bio: string; photo_url: string | null; lang: "en" | "fr" | "pt"; community_visible: boolean;
  verification: "none" | "pending" | "verified" | "rejected"; trust: number; role: "member" | "admin";
  status: "active" | "restricted" | "removed"; plan: "free" | "trial" | "plus"; plan_ends: string; created_at: string;
};

export async function currentMember() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { sb, user: null, profile: null as Profile | null };
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  return { sb, user, profile: profile as Profile | null };
}

export function hasPlus(p: Pick<Profile, "plan" | "plan_ends"> | null) {
  if (!p) return false;
  return p.plan === "plus" || (p.plan === "trial" && new Date(p.plan_ends).getTime() > Date.now());
}

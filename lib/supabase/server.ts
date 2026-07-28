import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Always build a fresh client per call (per @supabase/ssr's own guidance) — this carries
// request-scoped cookies, so it must never be memoized like the browser/admin clients are.
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  try {
    return createServerClient(url, anonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where cookies are read-only — proxy.ts is
            // responsible for refreshing the session in that case, so this is safe to ignore.
          }
        },
      },
    });
  } catch (error) {
    console.warn("[supabase] failed to create server client:", error);
    return null;
  }
}

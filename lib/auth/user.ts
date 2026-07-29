import "server-only";
import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Current signed-in shopper, or null. Safe to call when Supabase isn't configured. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.warn("[auth] getCurrentUser failed:", error);
    return null;
  }
}

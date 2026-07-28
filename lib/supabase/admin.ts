import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null | undefined;

// Service-role client — bypasses RLS. Only the Paystack webhook route should import this; it
// must never be reachable from anything a client request can trigger directly.
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  if (!url || !serviceRoleKey) {
    client = null;
    return client;
  }

  try {
    client = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch (error) {
    console.warn("[supabase] failed to create admin client:", error);
    client = null;
  }

  return client;
}

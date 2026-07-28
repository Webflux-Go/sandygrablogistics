import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (client !== undefined) return client;

  if (!url || !anonKey) {
    client = null;
    return client;
  }

  try {
    client = createBrowserClient(url, anonKey);
  } catch (error) {
    console.warn("[supabase] failed to create browser client:", error);
    client = null;
  }

  return client;
}

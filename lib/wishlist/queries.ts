import "server-only";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Saved product ids for the signed-in user, newest first. Empty for guests. */
export async function getWishlistProductIds(): Promise<string[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[wishlist] getWishlistProductIds failed:", error);
      return [];
    }

    return (data ?? []).map((row) => row.product_id as string);
  } catch (error) {
    console.warn("[wishlist] getWishlistProductIds threw:", error);
    return [];
  }
}

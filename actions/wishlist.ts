"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * The wishlist is written through the cookie-bound client, not the service-role one: RLS scopes
 * every row to auth.uid(), so a signed-out caller simply writes nothing and there is no way to
 * touch another user's list even if a product id is forged.
 */
export async function toggleWishlistItem(
  productId: string,
  wishlisted: boolean
): Promise<{ ok: boolean }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guests keep their wishlist in localStorage — nothing to persist yet.
  if (!user) return { ok: false };

  const { error } = wishlisted
    ? await supabase
        .from("wishlist_items")
        .upsert({ user_id: user.id, product_id: productId })
    : await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

  if (error) {
    console.warn("[wishlist] toggle failed:", error);
    return { ok: false };
  }

  revalidatePath("/shop/account/wishlist");
  return { ok: true };
}

/**
 * Merges a guest's localStorage wishlist into their account on sign-in. Additive on purpose —
 * it never deletes server-side saves, so signing in on a second device can't wipe the list
 * built on the first.
 */
export async function syncWishlist(
  productIds: string[]
): Promise<{ productIds: string[] }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { productIds };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { productIds };

  if (productIds.length > 0) {
    const { error } = await supabase.from("wishlist_items").upsert(
      productIds.map((productId) => ({ user_id: user.id, product_id: productId }))
    );
    if (error) console.warn("[wishlist] sync upsert failed:", error);
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", user.id);

  if (error) {
    console.warn("[wishlist] sync read failed:", error);
    return { productIds };
  }

  revalidatePath("/shop/account/wishlist");
  return { productIds: (data ?? []).map((row) => row.product_id as string) };
}

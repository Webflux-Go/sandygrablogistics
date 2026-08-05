"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrate } from "@/store/wishlist-slice";
import { readWishlist } from "@/lib/cart/storage";
import { syncWishlist } from "@/actions/wishlist";

/**
 * Merges the guest wishlist held in localStorage into the signed-in user's saved list, once per
 * session, then hydrates Redux with the merged result.
 *
 * Without this, anything hearted before signing in would silently vanish from the account page —
 * the shopper saved it, so it should follow them in.
 *
 * Reads localStorage directly rather than subscribing to the Redux wishlist: this needs the
 * pre-sign-in list exactly once, and depending on store state would either re-fire on every
 * subsequent heart tap or race with the provider's own hydration.
 */
export default function WishlistSync({ authenticated }: { authenticated: boolean }) {
  const dispatch = useAppDispatch();
  const synced = useRef(false);

  useEffect(() => {
    if (!authenticated || synced.current) return;
    synced.current = true;

    let cancelled = false;

    syncWishlist(readWishlist())
      .then((result) => {
        if (!cancelled) dispatch(hydrate(result.productIds));
      })
      .catch((error) => console.warn("[wishlist] sync failed:", error));

    return () => {
      cancelled = true;
    };
  }, [authenticated, dispatch]);

  return null;
}

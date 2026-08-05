import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggle } from "@/store/wishlist-slice";
import { useSession } from "@/app/components/shop/providers/session-provider";
import { toggleWishlistItem } from "@/actions/wishlist";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const productIds = useAppSelector((state) => state.wishlist.productIds);
  const { authenticated } = useSession();

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      const nowWishlisted = !productIds.includes(productId);

      // Update Redux first so the heart responds instantly; the write is a background detail.
      dispatch(toggle(productId));

      // Guests are already covered by the localStorage persistence in redux-provider, so the
      // round-trip is only worth making for signed-in users.
      if (authenticated) {
        toggleWishlistItem(productId, nowWishlisted).catch((error) =>
          console.warn("[wishlist] persist failed:", error)
        );
      }
    },
    [authenticated, dispatch, productIds]
  );

  return { productIds, toggleWishlist, isWishlisted };
}

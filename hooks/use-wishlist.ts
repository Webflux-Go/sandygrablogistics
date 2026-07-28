import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggle } from "@/store/wishlist-slice";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const productIds = useAppSelector((state) => state.wishlist.productIds);

  const toggleWishlist = (productId: string) => dispatch(toggle(productId));
  const isWishlisted = (productId: string) => productIds.includes(productId);

  return { productIds, toggleWishlist, isWishlisted };
}

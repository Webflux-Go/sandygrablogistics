"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { hydrate as hydrateCart } from "@/store/cart-slice";
import { hydrate as hydrateWishlist } from "@/store/wishlist-slice";
import { readCart, writeCart, readWishlist, writeWishlist } from "@/lib/cart/storage";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    store.dispatch(hydrateCart(readCart()));
    store.dispatch(hydrateWishlist(readWishlist()));

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      writeCart(state.cart.items);
      writeWishlist(state.wishlist.productIds);
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

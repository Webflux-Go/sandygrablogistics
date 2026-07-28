import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart-slice";
import wishlistReducer from "./wishlist-slice";
import uiReducer from "./ui-slice";

// Cart/wishlist/ui are pure client state that always starts empty and is only ever mutated
// client-side (see redux-provider.tsx's localStorage hydration) — every SSR pass reads the same
// pristine initial state, so a single module-level store (rather than a per-request factory) is
// safe here and keeps this in line with the "Redux never caches server data" boundary.
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

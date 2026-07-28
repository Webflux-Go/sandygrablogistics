import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = { productIds: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggle: (state, action: PayloadAction<string>) => {
      const idx = state.productIds.indexOf(action.payload);
      if (idx === -1) state.productIds.push(action.payload);
      else state.productIds.splice(idx, 1);
    },
    hydrate: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
  },
});

export const { toggle, hydrate } = wishlistSlice.actions;
export default wishlistSlice.reducer;

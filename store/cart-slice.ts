import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types/cart";

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ item: Omit<CartItem, "quantity">; quantity?: number }>
    ) => {
      const { item, quantity = 1 } = action.payload;
      // Matched on lineId, not productId — the same product with a different set of add-ons
      // is a separate line, and must not merge into an existing one at the wrong price.
      const existing = state.items.find((i) => i.lineId === item.lineId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
    },
    removeItem: (state, action: PayloadAction<{ lineId: string }>) => {
      state.items = state.items.filter((i) => i.lineId !== action.payload.lineId);
    },
    setQuantity: (
      state,
      action: PayloadAction<{ lineId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.lineId === action.payload.lineId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    clear: (state) => {
      state.items = [];
    },
    hydrate: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, setQuantity, clear, hydrate } = cartSlice.actions;
export default cartSlice.reducer;

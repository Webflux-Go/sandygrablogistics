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
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
    },
    removeItem: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload.productId);
    },
    setQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
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

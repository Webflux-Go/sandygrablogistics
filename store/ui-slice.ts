import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/lib/sanity/types";

export type ModalKind = "cart" | "quickView" | "auth" | "checkout" | null;

export interface UiState {
  activeModal: ModalKind;
  // Carrying the product itself (rather than just an id) avoids a second network round-trip to
  // re-fetch a single product the catalog/featured-collections query already has in hand.
  quickViewProduct: Product | null;
}

const initialState: UiState = { activeModal: null, quickViewProduct: null };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ modal: Exclude<ModalKind, null>; product?: Product }>
    ) => {
      state.activeModal = action.payload.modal;
      if (action.payload.product) state.quickViewProduct = action.payload.product;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;

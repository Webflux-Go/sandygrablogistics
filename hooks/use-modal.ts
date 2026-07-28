import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openModal, closeModal, type ModalKind } from "@/store/ui-slice";
import type { Product } from "@/lib/sanity/types";

export function useModal() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const quickViewProduct = useAppSelector((state) => state.ui.quickViewProduct);

  const open = (modal: Exclude<ModalKind, null>, product?: Product) =>
    dispatch(openModal({ modal, product }));
  const close = () => dispatch(closeModal());

  return { activeModal, quickViewProduct, open, close };
}

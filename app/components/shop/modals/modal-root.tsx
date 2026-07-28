"use client";

import { useModal } from "@/hooks/use-modal";
import CartDrawer from "./cart-drawer";
import ProductQuickView from "./product-quick-view";
import AuthModal from "./auth-modal";
import CheckoutModal from "./checkout-modal";

export default function ModalRoot() {
  const { activeModal } = useModal();

  switch (activeModal) {
    case "cart":
      return <CartDrawer />;
    case "quickView":
      return <ProductQuickView />;
    case "auth":
      return <AuthModal />;
    case "checkout":
      return <CheckoutModal />;
    default:
      return null;
  }
}

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, removeItem, setQuantity, clear } from "@/store/cart-slice";
import type { CartItem } from "@/types/cart";

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const add = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) =>
      dispatch(addItem({ item, quantity })),
    [dispatch]
  );
  const remove = useCallback(
    (productId: string) => dispatch(removeItem({ productId })),
    [dispatch]
  );
  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch(setQuantity({ productId, quantity })),
    [dispatch]
  );
  const clearCart = useCallback(() => dispatch(clear()), [dispatch]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, add, remove, updateQuantity, clearCart, subtotal, count };
}

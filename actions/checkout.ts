"use server";

import { randomUUID } from "crypto";
import { getProductById } from "@/lib/sanity/queries";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { initTransaction } from "@/lib/paystack/client";
import { absoluteUrl } from "@/lib/site-url";
import type { CartItem } from "@/types/cart";
import type { CheckoutContactInfo } from "@/types/order";

export interface CheckoutResult {
  authorizationUrl?: string;
  error?: string;
}

export async function createCheckoutSession(
  cartItems: CartItem[],
  contact: CheckoutContactInfo
): Promise<CheckoutResult> {
  if (cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }
  if (!contact.email || !contact.name || !contact.address) {
    return { error: "Please fill in your contact and shipping details." };
  }

  // Re-price every line item from Sanity server-side — the client-sent price is never trusted.
  const pricedItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await getProductById(item.productId);
      if (!product || product.stock <= 0) return null;

      // Add-ons are re-priced the same way: the client sends only which keys were chosen, and
      // every price comes from Sanity. An unknown key means the product's add-ons changed since
      // this cart was filled, so the line is rejected rather than silently priced without it.
      const available = product.addOns ?? [];
      const selected = [];

      for (const chosen of item.addOns ?? []) {
        const match = available.find((addOn) => addOn._key === chosen.key);
        if (!match) return null;
        selected.push({ key: match._key, name: match.name, price: match.price });
      }

      const unitPrice =
        product.price + selected.reduce((sum, addOn) => sum + addOn.price, 0);

      return {
        productId: item.productId,
        // Add-ons are appended to the snapshotted name so the order record, the confirmation
        // email and the admin table all show what was actually bought without extra plumbing.
        name:
          selected.length > 0
            ? `${product.name} (+ ${selected.map((a) => a.name).join(", ")})`
            : product.name,
        price: unitPrice,
        quantity: item.quantity,
      };
    })
  );

  if (pricedItems.some((item) => item === null)) {
    return { error: "One or more items in your cart are no longer available." };
  }
  const validItems = pricedItems as NonNullable<(typeof pricedItems)[number]>[];
  const totalAmount = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Guest checkout means there's no user session to satisfy the orders/order_items RLS
  // policies (which only allow reads scoped to auth.uid()) — this is a trusted server context
  // that has already re-priced and validated everything above, so it writes via the
  // service-role client rather than the cookie-bound one.
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { error: "Checkout isn't configured yet." };
  }

  const reference = `sg_${randomUUID()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email: contact.email,
      status: "pending",
      paystack_reference: reference,
      total_amount: totalAmount,
      shipping_name: contact.name,
      shipping_phone: contact.phone,
      shipping_address: contact.address,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.warn("[checkout] failed to create order:", orderError);
    return { error: "Could not create your order. Please try again." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    validItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    console.warn("[checkout] failed to save order items:", itemsError);
    return { error: "Could not save your order items. Please try again." };
  }

  try {
    const transaction = await initTransaction({
      email: contact.email,
      amountKobo: totalAmount,
      reference,
      callbackUrl: absoluteUrl("/api/paystack/callback"),
      metadata: { orderId: order.id },
    });

    return { authorizationUrl: transaction.authorizationUrl };
  } catch (error) {
    console.warn("[checkout] paystack init failed:", error);
    return { error: "Could not start payment. Please try again." };
  }
}

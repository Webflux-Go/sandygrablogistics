import type { CartItem } from "@/types/cart";
import { buildLineId } from "@/types/cart";

const CART_KEY = "sandygrabs:cart";
const WISHLIST_KEY = "sandygrabs:wishlist";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private browsing quota, etc.) — cart just won't persist.
  }
}

/**
 * Carts saved before add-ons existed have no `lineId`, `addOns` or `basePrice`. Loading one
 * unchanged would crash the drawer on `addOns.map` and leave the remove/quantity buttons inert
 * (they match on `lineId`), so legacy entries are upgraded in place on read.
 */
function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<CartItem>;

  if (typeof item.productId !== "string" || typeof item.price !== "number") {
    return null;
  }

  const addOns = Array.isArray(item.addOns) ? item.addOns : [];

  return {
    lineId:
      item.lineId ??
      buildLineId(
        item.productId,
        addOns.map((addOn) => addOn.key)
      ),
    productId: item.productId,
    name: item.name ?? "",
    slug: item.slug ?? "",
    // Pre-add-on lines had no separate base price — the stored price was the whole unit price.
    basePrice: item.basePrice ?? item.price,
    price: item.price,
    addOns,
    image: item.image ?? null,
    quantity: typeof item.quantity === "number" ? item.quantity : 1,
  };
}

export const readCart = (): CartItem[] =>
  readJSON<unknown[]>(CART_KEY, [])
    .map(normalizeCartItem)
    .filter((item): item is CartItem => item !== null);
export const writeCart = (items: CartItem[]) => writeJSON(CART_KEY, items);
export const readWishlist = () => readJSON<string[]>(WISHLIST_KEY, []);
export const writeWishlist = (ids: string[]) => writeJSON(WISHLIST_KEY, ids);

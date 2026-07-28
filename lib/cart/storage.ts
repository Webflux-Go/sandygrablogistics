import type { CartItem } from "@/types/cart";

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

export const readCart = () => readJSON<CartItem[]>(CART_KEY, []);
export const writeCart = (items: CartItem[]) => writeJSON(CART_KEY, items);
export const readWishlist = () => readJSON<string[]>(WISHLIST_KEY, []);
export const writeWishlist = (ids: string[]) => writeJSON(WISHLIST_KEY, ids);

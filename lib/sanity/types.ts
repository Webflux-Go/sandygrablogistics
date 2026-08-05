import type { SanityImageSource } from "@sanity/image-url";

export type ProductImage = SanityImageSource & { _key?: string };

export type ProductBadge = "New Arrival" | "Hot Deal";

export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
}

/**
 * An optional extra a shopper can add to a product, adding `price` on top of the base price.
 * `_key` is Sanity's stable per-array-member id — it's what the cart and the server-side
 * re-pricing use to identify a selection, since names can be edited.
 */
export interface AddOn {
  _key: string;
  name: string;
  price: number;
  description?: string | null;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: ProductImage[];
  description?: string | null;
  badge?: ProductBadge | null;
  stock: number;
  featured: boolean;
  category?: CategoryRef | null;
  addOns?: AddOn[] | null;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: ProductImage | null;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  heroImage?: ProductImage | null;
}

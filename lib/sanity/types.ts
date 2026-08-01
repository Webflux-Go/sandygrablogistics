import type { SanityImageSource } from "@sanity/image-url";

export type ProductImage = SanityImageSource & { _key?: string };

export type ProductBadge = "New Arrival" | "Hot Deal";

export interface CategoryRef {
  _id: string;
  name: string;
  slug: string;
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

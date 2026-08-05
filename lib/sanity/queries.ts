import "server-only";
import { groq } from "next-sanity";
import { getSanityClient } from "./client";
import type { Product, Category, Collection } from "./types";

const productProjection = groq`{
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  images,
  description,
  badge,
  stock,
  featured,
  "category": category->{ _id, name, "slug": slug.current },
  addOns[]{ _key, name, price, description }
}`;

const featuredProductsQuery = groq`*[_type == "product" && featured == true] | order(_createdAt desc) [0...8] ${productProjection}`;

// The taxonomy is flat now, but the `parent` clause stays: any product still pointing at a
// legacy subcategory keeps showing up under its top-level category, so the catalogue reads
// correctly whether or not the cleanup migration has been run yet.
const productsQuery = groq`*[
  _type == "product"
  && (
    !defined($categorySlug)
    || category->slug.current == $categorySlug
    || category->parent->slug.current == $categorySlug
  )
  && (!defined($search) || name match $search + "*")
] | order(_createdAt desc) ${productProjection}`;

// `!defined(parent)` filters out legacy subcategory documents even though the field is no longer
// in the Studio schema — Sanity stores documents schemalessly, so those values persist until the
// documents are deleted. This keeps the shop showing only top-level categories immediately.
const categoriesQuery = groq`*[_type == "category" && !defined(parent)] | order(order asc, name asc) {
  _id, name, "slug": slug.current, image
}`;

const collectionsQuery = groq`*[_type == "collection"] | order(name asc) {
  _id, name, "slug": slug.current, description, heroImage
}`;

const productByIdQuery = groq`*[_type == "product" && _id == $id][0] ${productProjection}`;

const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0] ${productProjection}`;

// Same category, excluding the product being viewed. Kept small — this is a footer rail, not a
// second catalogue.
const relatedProductsQuery = groq`*[
  _type == "product"
  && _id != $excludeId
  && defined($categorySlug)
  && category->slug.current == $categorySlug
] | order(_createdAt desc) [0...4] ${productProjection}`;

export async function getFeaturedProducts(): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(featuredProductsQuery);
  } catch (error) {
    console.warn("[sanity] getFeaturedProducts failed:", error);
    return [];
  }
}

export async function getProducts(params: {
  categorySlug?: string;
  search?: string;
} = {}): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Product[]>(productsQuery, {
      categorySlug: params.categorySlug ?? null,
      search: params.search ?? null,
    });
  } catch (error) {
    console.warn("[sanity] getProducts failed:", error);
    return [];
  }
}

/** The shop's categories — a flat list, in manual sort order. */
export async function getCategories(): Promise<Category[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Category[]>(categoriesQuery);
  } catch (error) {
    console.warn("[sanity] getCategories failed:", error);
    return [];
  }
}

// Used server-side by actions/checkout.ts to re-price cart items — never trust a price sent
// from the client.
export async function getProductById(id: string): Promise<Product | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<Product | null>(productByIdQuery, { id });
  } catch (error) {
    console.warn("[sanity] getProductById failed:", error);
    return null;
  }
}

/**
 * Products for a list of ids, used by the wishlist. Ids that no longer resolve (product deleted
 * in the Studio) are simply absent from the result rather than erroring.
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const client = getSanityClient();
  if (!client || ids.length === 0) return [];
  try {
    return await client.fetch<Product[]>(
      groq`*[_type == "product" && _id in $ids] ${productProjection}`,
      { ids }
    );
  } catch (error) {
    console.warn("[sanity] getProductsByIds failed:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = getSanityClient();
  if (!client) return null;
  try {
    return await client.fetch<Product | null>(productBySlugQuery, { slug });
  } catch (error) {
    console.warn("[sanity] getProductBySlug failed:", error);
    return null;
  }
}

export async function getRelatedProducts(params: {
  categorySlug?: string | null;
  excludeId: string;
}): Promise<Product[]> {
  const client = getSanityClient();
  if (!client || !params.categorySlug) return [];
  try {
    return await client.fetch<Product[]>(relatedProductsQuery, {
      categorySlug: params.categorySlug,
      excludeId: params.excludeId,
    });
  } catch (error) {
    console.warn("[sanity] getRelatedProducts failed:", error);
    return [];
  }
}

/**
 * Slugs and last-modified dates for the sitemap. Deliberately a separate, minimal projection —
 * pulling full products (images, add-ons, descriptions) just to list URLs would be wasteful.
 */
export async function getSitemapEntries(): Promise<{
  products: { slug: string; updatedAt: string }[];
  categories: { slug: string }[];
}> {
  const client = getSanityClient();
  if (!client) return { products: [], categories: [] };

  try {
    return await client.fetch(groq`{
      "products": *[_type == "product" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": _updatedAt
      },
      "categories": *[_type == "category" && !defined(parent) && defined(slug.current)]{
        "slug": slug.current
      }
    }`);
  } catch (error) {
    console.warn("[sanity] getSitemapEntries failed:", error);
    return { products: [], categories: [] };
  }
}

export async function getCollections(): Promise<Collection[]> {
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Collection[]>(collectionsQuery);
  } catch (error) {
    console.warn("[sanity] getCollections failed:", error);
    return [];
  }
}

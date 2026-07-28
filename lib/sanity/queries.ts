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
  "category": category->{ _id, name, "slug": slug.current }
}`;

const featuredProductsQuery = groq`*[_type == "product" && featured == true] | order(_createdAt desc) [0...8] ${productProjection}`;

const productsQuery = groq`*[
  _type == "product"
  && (!defined($categorySlug) || category->slug.current == $categorySlug)
  && (!defined($search) || name match $search + "*")
] | order(_createdAt desc) ${productProjection}`;

const categoriesQuery = groq`*[_type == "category"] | order(name asc) {
  _id, name, "slug": slug.current, image
}`;

const collectionsQuery = groq`*[_type == "collection"] | order(name asc) {
  _id, name, "slug": slug.current, description, heroImage
}`;

const productByIdQuery = groq`*[_type == "product" && _id == $id][0] ${productProjection}`;

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

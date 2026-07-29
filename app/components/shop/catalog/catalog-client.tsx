"use client";

import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/lib/sanity/types";
import ProductCard from "../product-card";

async function fetchProducts(categorySlug?: string, search?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (search) params.set("search", search);

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.products;
}

export default function CatalogClient({
  categorySlug,
  search,
}: {
  categorySlug?: string;
  search?: string;
}) {
  // Key matches the server prefetch in catalog-section.tsx, so the first paint uses hydrated
  // data with no loading flash; revisiting a category later is served from cache.
  const { data: products = [], isFetching } = useQuery({
    queryKey: ["products", { categorySlug: categorySlug ?? null, search: search ?? null }],
    queryFn: () => fetchProducts(categorySlug, search),
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
        <PackageSearch size={32} strokeWidth={1.5} />
        <p className="text-sm">
          {search
            ? `No products match “${search}”.`
            : "No products in this category yet."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
        isFetching ? "opacity-60" : "opacity-100"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

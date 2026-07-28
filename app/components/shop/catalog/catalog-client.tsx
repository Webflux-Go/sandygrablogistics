"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";
import type { Category, Product } from "@/lib/sanity/types";
import ProductCard from "../product-card";
import CategorySidebar from "./category-sidebar";

async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.products;
}

export default function CatalogClient({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const { data: products = [], isFetching } = useQuery({
    queryKey: ["products", { categorySlug: activeCategory }],
    queryFn: () => fetchProducts(activeCategory),
  });

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr]">
      <CategorySidebar
        categories={categories}
        active={activeCategory}
        onSelect={setActiveCategory}
      />

      <div>
        {products.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
            <PackageSearch size={32} strokeWidth={1.5} />
            <p className="text-sm">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

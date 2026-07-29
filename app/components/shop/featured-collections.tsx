import Link from "next/link";
import { PackageSearch } from "lucide-react";
import Reveal from "../motion/reveal";
import { getFeaturedProducts } from "@/lib/sanity/queries";
import ProductCard from "./product-card";

export default async function FeaturedCollections() {
  const products = await getFeaturedProducts();

  return (
    <section id="collections" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
            Featured Collections
          </h2>
          <a
            href="#catalog"
            className="hidden shrink-0 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:text-neutral-900 sm:inline"
          >
            View all products
          </a>
        </Reveal>

        {products.length > 0 ? (
          <Reveal
            stagger
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Reveal>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-16 text-center text-neutral-400">
            <PackageSearch size={32} strokeWidth={1.5} />
            <p className="text-sm">
              No featured products yet — add some in the Sanity Studio at{" "}
              <Link href="/studio" className="underline underline-offset-2">
                /studio
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

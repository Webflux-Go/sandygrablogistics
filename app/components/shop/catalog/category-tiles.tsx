import Image from "next/image";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { Category } from "@/lib/sanity/types";

export default function CategoryTiles({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => {
        const imageUrl = urlFor(category.image)?.width(500).height(500).url() ?? null;
        const isActive = category.slug === activeSlug;

        return (
          <Link
            key={category._id}
            href={`/shop?category=${category.slug}`}
            className={`group relative block overflow-hidden rounded-2xl border transition-colors ${
              isActive
                ? "border-gold-500"
                : "border-neutral-200 hover:border-gold-400"
            }`}
          >
            <div className="relative aspect-square bg-neutral-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                // No image uploaded for this category yet — a labelled placeholder keeps the
                // grid readable instead of showing an empty box.
                <span className="flex h-full w-full items-center justify-center text-neutral-300">
                  <Boxes size={28} strokeWidth={1.5} />
                </span>
              )}
            </div>
            <p
              className={`px-3 py-3 text-center text-sm font-medium transition-colors ${
                isActive ? "text-gold-700" : "text-neutral-800 group-hover:text-gold-700"
              }`}
            >
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

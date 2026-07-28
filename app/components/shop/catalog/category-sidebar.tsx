"use client";

import type { Category } from "@/lib/sanity/types";

export default function CategorySidebar({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | undefined;
  onSelect: (slug: string | undefined) => void;
}) {
  return (
    <aside>
      <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Categories
      </h3>
      <nav className="mt-4 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            active === undefined
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => onSelect(category.slug)}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              active === category.slug
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {category.name}
          </button>
        ))}
        {categories.length === 0 && (
          <p className="px-3 py-2 text-sm text-neutral-400">No categories yet.</p>
        )}
      </nav>
    </aside>
  );
}

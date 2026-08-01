import Link from "next/link";
import type { Category } from "@/lib/sanity/types";

function hrefFor(slug?: string, search?: string) {
  const params = new URLSearchParams();
  if (slug) params.set("category", slug);
  if (search) params.set("search", search);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default function CategorySidebar({
  categories,
  active,
  search,
}: {
  categories: Category[];
  active?: string;
  search?: string;
}) {
  return (
    <aside>
      <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Categories
      </h3>

      <nav className="mt-4 flex flex-col gap-1">
        <Link
          href={hrefFor(undefined, search)}
          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
            !active
              ? "bg-gold-500 text-neutral-950"
              : "text-neutral-600 hover:bg-gold-50 hover:text-gold-700"
          }`}
        >
          All products
        </Link>

        {categories.map((category) => (
          <Link
            key={category._id}
            href={hrefFor(category.slug, search)}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              active === category.slug
                ? "bg-gold-500 text-neutral-950"
                : "text-neutral-700 hover:bg-gold-50 hover:text-gold-700"
            }`}
          >
            {category.name}
          </Link>
        ))}

        {categories.length === 0 && (
          <p className="px-3 py-2 text-sm text-neutral-400">No categories yet.</p>
        )}
      </nav>
    </aside>
  );
}

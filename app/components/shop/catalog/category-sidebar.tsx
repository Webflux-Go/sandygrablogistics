"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryTree } from "@/lib/sanity/types";

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
  categories: CategoryTree[];
  active?: string;
  search?: string;
}) {
  // Manual expand/collapse, but a group also opens automatically when the active selection
  // lives inside it.
  const [expanded, setExpanded] = useState<string | null>(null);

  const isGroupOpen = (group: CategoryTree) =>
    expanded === group.slug ||
    active === group.slug ||
    group.children.some((child) => child.slug === active);

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

        {categories.map((group) => {
          const open = isGroupOpen(group);

          return (
            <div key={group._id}>
              <div className="flex items-center">
                <Link
                  href={hrefFor(group.slug, search)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active === group.slug
                      ? "bg-gold-500 text-neutral-950"
                      : "text-neutral-700 hover:bg-gold-50 hover:text-gold-700"
                  }`}
                >
                  {group.name}
                </Link>

                {group.children.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : group.slug)}
                    aria-label={`${open ? "Collapse" : "Expand"} ${group.name}`}
                    aria-expanded={open}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:text-gold-700"
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>

              {open && group.children.length > 0 && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-neutral-200 pl-2">
                  {group.children.map((child) => (
                    <Link
                      key={child._id}
                      href={hrefFor(child.slug, search)}
                      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        active === child.slug
                          ? "bg-gold-500 text-neutral-950"
                          : "text-neutral-500 hover:bg-gold-50 hover:text-gold-700"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {categories.length === 0 && (
          <p className="px-3 py-2 text-sm text-neutral-400">No categories yet.</p>
        )}
      </nav>
    </aside>
  );
}

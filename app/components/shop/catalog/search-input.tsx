"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchInput({
  category,
  initialSearch,
}: {
  category?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialSearch ?? "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the mount pass so simply landing on the page doesn't immediately re-navigate.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (value.trim()) params.set("search", value.trim());

      const query = params.toString();
      // replace, not push — typing shouldn't stack up history entries. scroll:false keeps the
      // page from jumping back to the top on every keystroke.
      router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
    }, 350);

    return () => clearTimeout(timeout);
  }, [value, category, router]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-500 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/sanity/queries";
import CatalogClient from "./catalog-client";
import CategorySidebar from "./category-sidebar";
import CategoryTiles from "./category-tiles";
import SearchInput from "./search-input";

export default async function CatalogSection({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const queryClient = new QueryClient();
  const categories = await getCategories();

  await queryClient.prefetchQuery({
    queryKey: ["products", { categorySlug: category ?? null, search: search ?? null }],
    queryFn: () => getProducts({ categorySlug: category, search }),
  });

  const activeCategory = categories.find((item) => item.slug === category);
  const heading = search
    ? `Results for “${search}”`
    : (activeCategory?.name ?? "Browse Our Catalog");

  return (
    <section id="catalog" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
            {heading}
          </h2>
          <SearchInput category={category} initialSearch={search} />
        </div>

        {/* Always tiled, with the current one marked — so there's a visual way to switch
            category from inside a category, not just from the landing view. */}
        {categories.length > 0 && (
          <div className="mt-10">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Shop by category
            </p>
            <CategoryTiles categories={categories} activeSlug={category} />
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr]">
          <CategorySidebar categories={categories} active={category} search={search} />

          <HydrationBoundary state={dehydrate(queryClient)}>
            <CatalogClient categorySlug={category} search={search} />
          </HydrationBoundary>
        </div>
      </div>
    </section>
  );
}

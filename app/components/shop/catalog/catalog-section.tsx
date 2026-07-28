import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCategories, getProducts } from "@/lib/sanity/queries";
import CatalogClient from "./catalog-client";

export default async function CatalogSection() {
  const queryClient = new QueryClient();
  const categories = await getCategories();

  await queryClient.prefetchQuery({
    queryKey: ["products", { categorySlug: undefined }],
    queryFn: () => getProducts(),
  });

  return (
    <section id="catalog" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
          Browse Our Catalog
        </h2>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <CatalogClient categories={categories} />
        </HydrationBoundary>
      </div>
    </section>
  );
}

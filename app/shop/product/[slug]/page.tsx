import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ShopNavbar from "@/app/components/shop/navbar";
import ShopFooter from "@/app/components/shop/footer";
import ProductCard from "@/app/components/shop/product-card";
import ProductGallery from "@/app/components/shop/product/product-gallery";
import ProductPurchase from "@/app/components/shop/product/product-purchase";
import { getProductBySlug, getRelatedProducts } from "@/lib/sanity/queries";
import { getCurrentUser } from "@/lib/auth/user";
import { urlFor } from "@/lib/sanity/image";
import {
  ProductJsonLd,
  BreadcrumbJsonLd,
} from "@/app/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found — Sandygrabs" };

  const image = urlFor(product.images?.[0])?.width(1200).height(630).url();

  const description =
    product.description?.slice(0, 155) ??
    `Buy ${product.name} from Sandygrabs — sourced direct from Turkish factories, inspected before shipping, delivered to Nigeria and worldwide.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/product/${slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/shop/product/${slug}`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, user] = await Promise.all([
    getProductBySlug(slug),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  const related = await getRelatedProducts({
    categorySlug: product.category?.slug,
    excludeId: product._id,
  });

  // Two renditions per image: square crops for the gallery grid, and larger uncropped versions
  // for the fullscreen viewer — cropping there would defeat the point of opening it.
  const images = (product.images ?? [])
    .map((image) => urlFor(image)?.width(900).height(900).url() ?? null)
    .filter((url): url is string => url !== null);

  const fullImages = (product.images ?? [])
    .map((image) => urlFor(image)?.width(1800).url() ?? null)
    .filter((url): url is string => url !== null);

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        images={fullImages}
        priceKobo={product.price}
        inStock={product.stock > 0}
        slug={product.slug}
        category={product.category?.name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Shop", path: "/shop" },
          ...(product.category
            ? [
                {
                  name: product.category.name,
                  path: `/shop?category=${product.category.slug}`,
                },
              ]
            : []),
          { name: product.name, path: `/shop/product/${product.slug}` },
        ]}
      />

      <ShopNavbar email={user?.email ?? null} />

      <main className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-sm text-neutral-500"
          >
            <Link href="/shop" className="transition-colors hover:text-gold-700">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight size={14} className="text-neutral-300" />
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="transition-colors hover:text-gold-700"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="text-neutral-300" />
            <span className="text-neutral-900">{product.name}</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <ProductGallery
              images={images}
              fullImages={fullImages}
              alt={product.name}
            />

            <div className="flex flex-col">
              {product.badge && (
                <span className="mb-3 w-fit rounded-full bg-gold-400 px-3 py-1 text-[11px] font-medium text-neutral-950">
                  {product.badge}
                </span>
              )}

              <h1 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-4xl">
                {product.name}
              </h1>

              {product.description && (
                <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {product.description}
                </p>
              )}

              <div className="mt-8 border-t border-neutral-200 pt-8">
                <ProductPurchase product={product} image={images[0] ?? null} />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-medium tracking-tight text-neutral-900">
                More in {product.category?.name}
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <ShopFooter />
    </>
  );
}

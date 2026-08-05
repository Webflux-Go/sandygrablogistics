import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, Package } from "lucide-react";
import ShopNavbar from "@/app/components/shop/navbar";
import ShopFooter from "@/app/components/shop/footer";
import { getCurrentUser } from "@/lib/auth/user";

export const metadata: Metadata = {
  title: "Your Account",
  // Nothing here should ever be indexed — it's per-customer data behind a login.
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Gate the whole section in one place. Every page below is a Server Component, so this runs
  // before any of their data is fetched.
  if (!user) redirect("/shop");

  return (
    <>
      <ShopNavbar email={user.email ?? null} />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
            Your Account
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{user.email}</p>

          <nav className="mt-8 flex gap-2 border-b border-neutral-200">
            <AccountTab href="/shop/account" label="Orders" icon="orders" />
            <AccountTab
              href="/shop/account/wishlist"
              label="Wishlist"
              icon="wishlist"
            />
          </nav>

          <div className="mt-8">{children}</div>
        </div>
      </main>

      <ShopFooter />
    </>
  );
}

function AccountTab({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: "orders" | "wishlist";
}) {
  const Icon = icon === "orders" ? Package : Heart;

  return (
    <Link
      href={href}
      className="-mb-px flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:border-gold-400 hover:text-gold-700"
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

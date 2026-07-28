import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";
import SignOutButton from "./sign-out-button";

export const dynamic = "force-dynamic";

// This gate lives in a route group rather than at app/admin/layout.tsx so it doesn't also wrap
// /admin/login — otherwise a signed-out visitor gets redirected away from the very page that
// lets them sign in.
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  if (!admin) {
    // Distinguish "not signed in" from "signed in but not an admin" so the login page can
    // explain why access was refused instead of silently showing a blank form again.
    const supabase = await getSupabaseServerClient();
    const signedIn = supabase ? Boolean((await supabase.auth.getUser()).data.user) : false;
    redirect(signedIn ? "/admin/login?error=unauthorized" : "/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-tight text-neutral-900">
              Sandygrabs
            </span>
            <span className="text-xs uppercase tracking-[0.16em] text-neutral-400">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-neutral-500 sm:inline">{admin.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

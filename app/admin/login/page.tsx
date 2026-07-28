import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Sandygrabs
        </p>
        <h1 className="mt-2 text-xl font-medium text-neutral-900">Admin sign in</h1>
        <div className="mt-6">
          <LoginForm unauthorized={error === "unauthorized"} />
        </div>
      </div>
    </main>
  );
}

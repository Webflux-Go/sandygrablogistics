"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/auth";

export default function LoginForm({ unauthorized }: { unauthorized: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    unauthorized ? "That account doesn't have admin access." : null
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
      />
      <input
        required
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

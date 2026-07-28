"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { signIn, signUp } from "@/actions/auth";

export default function AuthModal() {
  const { close } = useModal();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const action = mode === "signIn" ? signIn : signUp;
      const result = await action(email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  };

  const toggleMode = () => {
    setMode((m) => (m === "signIn" ? "signUp" : "signIn"));
    setError(null);
    setSuccess(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">
            {mode === "signIn" ? "Sign In" : "Create Account"}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="text-neutral-400 hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <p className="mt-6 text-sm text-neutral-600">
            {mode === "signIn"
              ? "You're signed in."
              : "Check your email to confirm your account."}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
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
              minLength={6}
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
              {isPending ? "…" : mode === "signIn" ? "Sign In" : "Create Account"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={toggleMode}
          className="mt-4 w-full text-center text-xs text-neutral-500 underline underline-offset-2"
        >
          {mode === "signIn"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MailCheck, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { signIn, signUp } from "@/actions/auth";
import ModalShell, { useModalClose } from "../../motion/modal-shell";

function AuthPanel() {
  const router = useRouter();
  const close = useModalClose();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);
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

      if (mode === "signUp") {
        // Sign-up may need email confirmation before a session exists, so keep the modal open
        // with instructions rather than pretending the user is now logged in.
        setConfirmSent(true);
        return;
      }

      // router.refresh() re-runs the server components, so the navbar picks up the new session
      // and swaps "Sign in" for the account menu.
      router.refresh();
      close();
    });
  };

  const toggleMode = () => {
    setMode((m) => (m === "signIn" ? "signUp" : "signIn"));
    setError(null);
    setConfirmSent(false);
  };

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 id="auth-title" className="text-lg font-medium text-neutral-900">
          {confirmSent
            ? "Check your email"
            : mode === "signIn"
              ? "Sign In"
              : "Create Account"}
        </h2>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X size={20} />
        </button>
      </div>

      {confirmSent ? (
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <MailCheck size={32} strokeWidth={1.5} className="text-gold-600" />
          <p className="text-sm text-neutral-600">
            We sent a confirmation link to{" "}
            <span className="font-medium text-neutral-900">{email}</span>. Confirm it,
            then sign in.
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="mt-2 text-sm font-medium text-gold-700 underline underline-offset-2"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            />
            <input
              required
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              placeholder="Password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold-400 disabled:opacity-50"
            >
              {isPending
                ? "Please wait…"
                : mode === "signIn"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={toggleMode}
            className="mt-4 w-full text-center text-xs text-neutral-500 underline underline-offset-2"
          >
            {mode === "signIn"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </>
      )}
    </div>
  );
}

export default function AuthModal() {
  const { close } = useModal();

  return (
    <ModalShell onClose={close} labelledBy="auth-title">
      <AuthPanel />
    </ModalShell>
  );
}

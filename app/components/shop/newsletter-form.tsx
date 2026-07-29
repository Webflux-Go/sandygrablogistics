"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterFormState } from "@/actions/newsletter";

const initialState: NewsletterFormState = { status: "idle" };

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <div className="mt-4">
      <form action={formAction} className="flex max-w-xs gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Email Address"
          className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-full bg-gold-500 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-neutral-950 transition-colors hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending ? "…" : "Submit"}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          className={`mt-2 text-xs ${
            state.status === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}

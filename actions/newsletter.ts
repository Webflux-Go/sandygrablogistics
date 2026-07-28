"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface NewsletterFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { status: "error", message: "Newsletter signup isn't configured yet." };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error && error.code !== "23505") {
    // 23505 = unique_violation (already subscribed) — treat as success, not an error.
    return { status: "error", message: "Something went wrong. Try again." };
  }

  return { status: "success", message: "You're subscribed!" };
}

"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthResult {
  error: string | null;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Sign-in isn't configured yet." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Sign-up isn't configured yet." };

  const { error } = await supabase.auth.signUp({ email, password });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<AuthResult> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Sign-out isn't configured yet." };

  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

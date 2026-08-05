const FALLBACK_ORIGIN = "http://localhost:3000";

/**
 * The site's canonical origin, with any path stripped.
 *
 * Canonical tags, OG image URLs and the sitemap must all be built from the bare origin — if
 * NEXT_PUBLIC_SITE_URL carries a path (it has), including it would emit canonicals pointing at
 * URLs that don't exist and quietly sabotage indexing.
 */
export const SITE_ORIGIN = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_ORIGIN;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
})();

/**
 * Absolute URL for a path on this site.
 *
 * Uses `new URL` rather than template-string concatenation deliberately: a root-relative path
 * resolves against the *origin*, so a NEXT_PUBLIC_SITE_URL that carries a path or a trailing
 * slash still produces a correct URL. Concatenation did not — with the env var set to
 * ".../shop", Paystack's callback was being sent to "/shop/api/paystack/callback", which 404s
 * because the route lives at "/api/paystack/callback".
 */
export function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_ORIGIN;

  try {
    return new URL(path, base).toString();
  } catch {
    // A malformed NEXT_PUBLIC_SITE_URL would otherwise throw here and take checkout down.
    console.warn(
      `[site-url] NEXT_PUBLIC_SITE_URL is not a valid URL: ${base} — falling back to ${FALLBACK_ORIGIN}`
    );
    return new URL(path, FALLBACK_ORIGIN).toString();
  }
}

import "server-only";
import { createClient, type SanityClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.SANITY_API_VERSION || "2026-01-01";

let client: SanityClient | null | undefined;

// `createClient` validates `projectId` at construction time and throws on an unset/invalid
// value — lazily building + caching it here means an unconfigured Sanity project degrades to
// `null` (queries.ts falls back to empty data) instead of crashing every Server Component that
// imports this module.
export function getSanityClient(): SanityClient | null {
  if (client !== undefined) return client;

  if (!projectId) {
    client = null;
    return client;
  }

  try {
    client = createClient({ projectId, dataset, apiVersion, useCdn: true });
  } catch (error) {
    console.warn("[sanity] failed to create client:", error);
    client = null;
  }

  return client;
}

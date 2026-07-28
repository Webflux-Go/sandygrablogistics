import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: SanityImageSource | undefined | null) {
  if (!builder || !source) return null;
  return builder.image(source);
}

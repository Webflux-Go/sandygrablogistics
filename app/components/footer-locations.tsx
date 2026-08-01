import { MapPin } from "lucide-react";
import { LOCATIONS } from "@/lib/contact";

/**
 * Condensed address block for footers — the first place people look for a physical location.
 * Shares LOCATIONS with the full <Locations /> section so the two can't disagree.
 */
export default function FooterLocations() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {LOCATIONS.map((location) => (
        <div key={location.label}>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
            <MapPin size={14} className="text-gold-600" />
            {location.label}
          </h3>
          <address className="mt-3 text-sm not-italic leading-relaxed text-neutral-500">
            {location.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-gold-700 underline underline-offset-4 hover:text-gold-600"
          >
            Get directions
          </a>
        </div>
      ))}
    </div>
  );
}

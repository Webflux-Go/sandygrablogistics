import Image from "next/image";
import NewsletterForm from "./newsletter-form";
import FooterLocations from "../footer-locations";
import SocialLinks from "../social-links";
import { SOCIALS } from "@/lib/contact";

const COLUMNS = [
  {
    title: "Company",
    links: ["About", "Sustainability", "Blog", "Career"],
  },
  {
    title: "Product",
    links: ["Desks", "Tables", "Chairs", "Lamps"],
  },
];

export default function ShopFooter() {
  return (
    <footer className="border-t border-neutral-200 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/sandygrabslogo.png"
              alt="Sandygrabs"
              width={149}
              height={100}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-xs font-medium uppercase tracking-wide text-neutral-400">
              Subscribe for newsletter
            </p>
            <NewsletterForm />
            <SocialLinks className="mt-6" />
          </div>

          {/* Kept as text links rather than a second icon row — the icons already sit under the
              newsletter, and this column carries the platform names for anyone scanning. */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Connect</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-500 transition-colors hover:text-gold-700"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-neutral-900">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 transition-colors hover:text-gold-700"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        <div className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Shop - Powered by Sandygrabs Logistics</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-900">
              Terms
            </a>
            <a href="#" className="hover:text-neutral-900">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

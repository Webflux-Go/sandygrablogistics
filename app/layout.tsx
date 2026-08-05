import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_ORIGIN } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Sandygrabs sources authentic Turkish furniture, doors and lighting at factory prices and ships worldwide. Air freight in 4–7 days, sea freight in 45 days, with factory inspection before every shipment.";

export const metadata: Metadata = {
  // Without metadataBase, relative OG/canonical URLs stay relative — crawlers and social
  // scrapers need absolute ones, so this is what makes every other URL below resolve.
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Sandygrabs — Turkish Sourcing, Freight & Logistics",
    // Page titles render as "Product Name — Sandygrabs" without each page repeating the brand.
    template: "%s — Sandygrabs",
  },
  description: DESCRIPTION,
  applicationName: "Sandygrabs",
  keywords: [
    "Turkish furniture Nigeria",
    "import from Turkey",
    "cargo consolidation Lagos",
    "air freight Turkey to Nigeria",
    "sea freight Turkey Nigeria",
    "factory inspection Turkey",
    "Sandygrabs logistics",
    "Turkish doors Lagos",
  ],
  authors: [{ name: "Sandygrabs" }],
  creator: "Sandygrabs",
  publisher: "Sandygrabs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sandygrabs",
    locale: "en_NG",
    url: "/",
    title: "Sandygrabs — Turkish Sourcing, Freight & Logistics",
    description: DESCRIPTION,
    images: [
      {
        url: "/sandygrabslogo.png",
        width: 149,
        height: 100,
        alt: "Sandygrabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandygrabs — Turkish Sourcing, Freight & Logistics",
    description: DESCRIPTION,
    images: ["/sandygrabslogo.png"],
  },
  // Icons come from app/icon.png and app/apple-icon.png via the file convention — declaring
  // them here as well would override those with the full 3046x2050 lockup.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import Image from "next/image";
import { Bodoni_Moda } from "next/font/google";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400"],
});

const COLUMNS = [
  {
    title: "Navigation",
    links: ["Home", "Solutions", "Case Study", "Testimonials"],
  },
  {
    title: "About Us",
    links: ["Career", "Blog", "Resources", "Become a Partner"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Agreement", "Privacy Policy", "Licenses"],
  },
];

const SOCIALS = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaXTwitter, href: "#", label: "X" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaFacebook, href: "#", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 px-4 pt-12 sm:px-6">
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              Reliable and efficient solutions for optimizing your supply
              chain, today and every day.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-neutral-900">
                {column.title}
              </h3>
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

        <div className="mt-16 border-t border-neutral-200 py-8 text-center sm:py-10">
          <p
            className={`${bodoniModa.className} text-6xl tracking-tight text-neutral-900 sm:text-7xl md:text-8xl lg:text-9xl`}
          >
            Sandygrabs
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-neutral-200 py-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright &copy; 2026 Sandygrabs Co.</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

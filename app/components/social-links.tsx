import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { SOCIALS } from "@/lib/contact";

const ICONS = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  LinkedIn: FaLinkedin,
  Facebook: FaFacebook,
  X: FaXTwitter,
} as const;

/** Icon row shared by both footers, driven by SOCIALS in lib/contact.ts. */
export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {SOCIALS.map((social) => {
        const Icon = ICONS[social.label];

        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
          >
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}

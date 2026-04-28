import { NAV_LINKS } from "@/lib/constants";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-white/10 bg-[#050508] px-6 py-12"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        {/* Nav Links */}
        <nav className="flex flex-wrap justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex gap-5">
          {profile.socials.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="text-zinc-500 transition-colors hover:text-purple-400"
            >
              {/* Simple text-based icons — replace with SVGs or lucide-react later */}
              <span className="text-lg font-medium">{s.platform}</span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

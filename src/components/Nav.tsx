"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/news", label: "News" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(13, 13, 26, 0.82)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          style={{ textDecoration: "none" }}
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold font-[var(--font-mono)]"
            style={{
              background: "linear-gradient(135deg, #ffffff, #d4d4d8)",
              color: "#0a0a0a",
              boxShadow: "0 0 14px var(--primary-glow)",
            }}
          >
            AS
          </span>
          <span
            className="font-semibold text-sm hidden sm:block"
            style={{ fontFamily: "var(--font-space)", color: "var(--text)" }}
          >
            Aditya Saxena
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                )}
                style={
                  active
                    ? {
                        color: "var(--primary)",
                        background: "rgba(255,255,255,0.12)",
                        boxShadow: "0 1px 0 0 var(--primary)",
                      }
                    : {}
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // over the hero scene the nav is light-on-dusk; after scrolling (or on
  // other routes) it settles onto the paper
  const onPaper = !overHero || scrolled;

  return (
    <header
      className="fixed top-0 z-50 w-full transition-colors duration-500"
      style={{
        background: onPaper ? "rgba(246, 241, 231, 0.88)" : "transparent",
        backdropFilter: onPaper ? "blur(12px)" : "none",
        borderBottom: onPaper ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="whitespace-nowrap shrink-0"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.05rem",
            letterSpacing: "0.02em",
            color: onPaper ? "var(--ink)" : "#fff",
            textDecoration: "none",
            transition: "color 0.5s",
          }}
        >
          Aditya Saxena
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7 overflow-x-auto">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="mono-label whitespace-nowrap shrink-0"
              style={{
                color: onPaper ? "var(--ink-soft)" : "rgba(255,255,255,0.85)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mono-label whitespace-nowrap shrink-0 hidden sm:inline-flex"
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "999px",
              border: `1px solid ${onPaper ? "var(--line-strong)" : "rgba(255,255,255,0.5)"}`,
              color: onPaper ? "var(--ink)" : "#fff",
              textDecoration: "none",
              transition: "color 0.3s, border-color 0.3s",
            }}
          >
            Résumé
          </a>
        </nav>
      </div>
    </header>
  );
}

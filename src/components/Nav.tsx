"use client";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(6, 6, 6, 0.72)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a
          href="#top"
          className="whitespace-nowrap shrink-0"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            color: "var(--text)",
            textDecoration: "none",
          }}
        >
          Aditya Saxena
        </a>

        <nav className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:!text-[var(--text)] whitespace-nowrap shrink-0"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.03em",
                color: "var(--muted)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

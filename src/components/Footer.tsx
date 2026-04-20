import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full py-8 px-6 mt-16"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          © 2026 Aditya Saxena · AI Safety & Security
        </span>
        <div className="flex items-center gap-6">
          {[
            { href: "https://github.com/Anakintano", label: "GitHub" },
            { href: "https://linkedin.com/in/aditya-saxena-mvs", label: "LinkedIn" },
            { href: "mailto:madityasaxena@gmail.com", label: "Email" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              className="text-xs transition-colors duration-200 hover:text-[var(--secondary)]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

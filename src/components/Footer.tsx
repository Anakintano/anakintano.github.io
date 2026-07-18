import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="w-full py-16 px-6"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            color: "var(--text)",
          }}
        >
          Let&apos;s talk.
        </p>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {[
            { href: "mailto:madityasaxena@gmail.com", label: "Email" },
            { href: "https://github.com/Anakintano", label: "GitHub" },
            { href: "https://linkedin.com/in/aditya-saxena-mvs", label: "LinkedIn" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors duration-200 hover:!text-[var(--text)]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.04em",
            color: "var(--muted)",
            opacity: 0.6,
            marginTop: "1.5rem",
          }}
        >
          © 2026 Aditya Saxena · Pune, India
        </span>
      </div>
    </footer>
  );
}

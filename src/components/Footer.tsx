import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{ background: "var(--dusk)", color: "var(--paper)" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 flex flex-col items-center text-center gap-8">
        <p className="mono-label" style={{ color: "rgba(246,241,231,0.55)" }}>
          Get in touch
        </p>
        <a
          href="mailto:madityasaxena@gmail.com"
          className="display"
          style={{
            fontSize: "clamp(1.9rem, 6vw, 4rem)",
            color: "var(--paper)",
            textDecoration: "none",
          }}
        >
          Let&apos;s <em>talk.</em>
        </a>

        <div className="flex items-center gap-8 flex-wrap justify-center mt-2">
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
              className="mono-label"
              style={{
                color: "rgba(246,241,231,0.65)",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <span
          className="mono-label"
          style={{ color: "rgba(246,241,231,0.35)", marginTop: "2rem" }}
        >
          © 2026 Aditya Saxena · Pune, India
        </span>
      </div>
    </footer>
  );
}

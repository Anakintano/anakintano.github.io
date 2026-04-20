"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// ── Skills data ─────────────────────────────────────────────────────────────

const SKILLS: { label: string; cls: string }[] = [
  { label: "Python",               cls: "tag-purple" },
  { label: "PyTorch",              cls: "tag-purple" },
  { label: "TensorFlow",           cls: "tag-purple" },
  { label: "LLMs",                 cls: "tag-cyan"   },
  { label: "Reinforcement Learning", cls: "tag-cyan" },
  { label: "RAG",                  cls: "tag-cyan"   },
  { label: "Hugging Face",         cls: "tag-green"  },
  { label: "Security Research",    cls: "tag-green"  },
  { label: "C",                    cls: "tag-purple" },
  { label: "JavaScript",           cls: "tag-cyan"   },
  { label: "SQL",                  cls: "tag-green"  },
  { label: "Jupyter",              cls: "tag-green"  },
];

// ── Experience ──────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    role: "Microsoft Learn Student Ambassador",
    period: "2023 – 2024",
    bullets: [
      "Led workshops for 180+ developers across campus and community events.",
      "10% measured improvement in participant workflow productivity post-workshops.",
    ],
    tagLabel: "MLSA",
    tagClass: "tag-cyan",
  },
  {
    role: "Summer Analyst — Hindalco (Aditya Birla Group)",
    period: "2024",
    bullets: [
      "Manufacturing analytics engagement spanning 150+ hours of on-site data work.",
      "5% process efficiency improvement through pipeline optimization and reporting.",
    ],
    tagLabel: "Analytics",
    tagClass: "tag-green",
  },
];

// ── Contact links ───────────────────────────────────────────────────────────

const CONTACTS: { label: string; href: string }[] = [
  { label: "madityasaxena@gmail.com",        href: "mailto:madityasaxena@gmail.com" },
  { label: "github.com/Anakintano",          href: "https://github.com/Anakintano" },
  { label: "linkedin.com/in/aditya-saxena-mvs", href: "https://linkedin.com/in/aditya-saxena-mvs" },
  { label: "@Techie038",                     href: "https://twitter.com/Techie038" },
];

// ── Shared motion helpers ───────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: "1060px",
        margin: "0 auto",
        padding: "5rem 1.5rem 6rem",
      }}
    >
      {/* ─── Page header ───────────────────────────────────────────── */}
      <FadeUp delay={0}>
        <p className="mono-label" style={{ marginBottom: "0.6rem" }}>
          // WHO I AM
        </p>
        <h1
          style={{
            fontFamily: "var(--font-space, var(--font-sans))",
            fontSize: "clamp(2.2rem, 6vw, 3.75rem)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          About
        </h1>
        <div className="section-divider" style={{ marginBottom: "3.5rem" }} />
      </FadeUp>

      {/* ─── Two-column layout ─────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
          gap: "3.5rem 4rem",
          alignItems: "start",
        }}
        className="about-grid"
      >
        {/* ── Left column ── */}
        <div>
          {/* Bio */}
          <FadeUp delay={0.08}>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text)",
                marginBottom: "3rem",
                opacity: 0.92,
              }}
            >
              I&apos;m Aditya Saxena — a researcher and engineer at the
              intersection of Machine Learning, Agentic AI, and Security. My
              work focuses on building formal authorization frameworks for
              LLM-based agents, exploring how to make autonomous AI systems
              safer and more robust under adversarial conditions. I enjoy
              building things that are both technically rigorous and actually
              useful.
            </p>
          </FadeUp>

          {/* Experience timeline */}
          <FadeUp delay={0.14}>
            <p className="mono-label" style={{ marginBottom: "1.5rem" }}>
              // Experience
            </p>

            <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
              {/* vertical neon line */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "6px",
                  bottom: "6px",
                  left: 0,
                  width: "2px",
                  background:
                    "linear-gradient(to bottom, var(--primary), var(--secondary))",
                  borderRadius: "2px",
                  opacity: 0.7,
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
                {EXPERIENCE.map(({ role, period, bullets, tagLabel, tagClass }, i) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.18 + i * 0.1, ease: "easeOut" }}
                  >
                    {/* role + period row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "160px" }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "0.975rem",
                            color: "#fff",
                            lineHeight: 1.3,
                          }}
                        >
                          {role}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                            color: "var(--muted)",
                            letterSpacing: "0.06em",
                            marginTop: "0.2rem",
                          }}
                        >
                          {period}
                        </p>
                      </div>
                      <span className={`tag ${tagClass}`}>{tagLabel}</span>
                    </div>

                    {/* bullet list */}
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.35rem",
                      }}
                    >
                      {bullets.map((b) => (
                        <li
                          key={b}
                          style={{
                            fontSize: "0.88rem",
                            color: "var(--muted)",
                            lineHeight: 1.6,
                            paddingLeft: "1rem",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "var(--primary)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            ›
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.5rem",
          }}
        >
          {/* Profile image */}
          <FadeUp delay={0.1}>
            <div style={{ position: "relative" }}>
              {/* glow ring behind image */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "9999px",
                  background:
                    "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)",
                  filter: "blur(12px)",
                  zIndex: 0,
                }}
              />
              <Image
                src="/profile.jpg"
                alt="Aditya Saxena"
                width={240}
                height={240}
                style={{
                  borderRadius: "9999px",
                  border: "2px solid var(--primary)",
                  boxShadow: "0 0 32px var(--primary-glow)",
                  position: "relative",
                  zIndex: 1,
                  display: "block",
                }}
              />
            </div>
          </FadeUp>

          {/* Skills */}
          <FadeUp delay={0.18} style={{ width: "100%" }}>
            <p
              className="mono-label"
              style={{ marginBottom: "1rem", textAlign: "center" }}
            >
              // Skills
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              {SKILLS.map(({ label, cls }) => (
                <span key={label} className={`tag ${cls}`}>
                  {label}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ─── Contact row ───────────────────────────────────────────── */}
      <FadeUp delay={0.25}>
        <div
          className="section-divider"
          style={{ marginTop: "4rem", marginBottom: "2rem" }}
        />
        <p className="mono-label" style={{ marginBottom: "1rem" }}>
          // Contact
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem 1.25rem",
            alignItems: "center",
          }}
        >
          {CONTACTS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--secondary)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--accent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--secondary)")
              }
            >
              {label}
            </a>
          ))}
        </div>
      </FadeUp>

      {/* ─── Responsive grid style ─────────────────────────────────── */}
      <style>{`
        @media (max-width: 720px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

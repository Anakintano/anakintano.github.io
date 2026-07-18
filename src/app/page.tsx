"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";

// ── Typewriter ──────────────────────────────────────────────────────────────

const ROLES = [
  "AI Safety Researcher",
  "Agentic AI Systems",
  "ML Security",
  "LLM Authorization",
];

function TypewriterText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setVisible(true);
      }, 380);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        color: "var(--secondary)",
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(0.95rem, 2.2vw, 1.3rem)",
        letterSpacing: "0.05em",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.38s ease",
        display: "inline-block",
      }}
    >
      {ROLES[index]}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: "var(--secondary)",
          marginLeft: "4px",
          verticalAlign: "middle",
          animation: "cursorBlink 1s step-end infinite",
        }}
      />
    </span>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────────

const STATS: { value: string; unit: string; label: string }[] = [
  { value: "28", unit: "Repos", label: "GitHub" },
  { value: "Active", unit: "Researcher", label: "Status" },
  { value: "ML · Security · Agents", unit: "", label: "Focus" },
];

// ── News placeholders (Notion data wired in later) ──────────────────────────

const NEWS = [
  {
    title: "Working on MCPS paper evaluation",
    date: "Apr 2026",
    tag: "Research",
    tagClass: "tag-purple",
  },
  {
    title: "Joined as Microsoft Learn Ambassador alumnus",
    date: "Jan 2024",
    tag: "Life",
    tagClass: "tag-cyan",
  },
];

// ── Shared motion config ────────────────────────────────────────────────────

const fadeUpTransition: Transition = { duration: 0.55, ease: "easeOut" };

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: fadeUpTransition,
};

// ── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        {/* animated gradient mesh */}
        <div className="gradient-mesh" />

        {/* subtle grid lines */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            pointerEvents: "none",
          }}
        />

        {/* hero content */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 1, maxWidth: "840px" }}
        >
          <p className="mono-label" style={{ marginBottom: "1.4rem" }}>
            // researcher · engineer · builder
          </p>

          <h1
            className="glitch"
            data-text="Aditya Saxena"
            style={{
              fontFamily: "var(--font-space, var(--font-sans))",
              fontSize: "clamp(2.8rem, 8.5vw, 5.75rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
              marginBottom: "1.4rem",
            }}
          >
            Aditya Saxena
          </h1>

          <div style={{ marginBottom: "2.75rem", minHeight: "1.8rem" }}>
            <TypewriterText />
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/research" className="btn-primary">
              Explore Research
            </Link>
            <a
              href="https://github.com/Anakintano"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              GitHub ↗
            </a>
          </div>
        </motion.div>

        {/* fade to bg-base */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(to bottom, transparent, rgba(5,5,8,0.75))",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ─── Stats strip ─────────────────────────────────────────────── */}
      <motion.section
        {...fadeUp}
        style={{
          background: "rgba(13, 13, 26, 0.62)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "2.75rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2.5rem",
          }}
        >
          {STATS.map(({ value, unit, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-space, var(--font-sans))",
                  fontSize: "clamp(1.35rem, 2.8vw, 2rem)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                {value}
                {unit && (
                  <span
                    style={{
                      color: "var(--secondary)",
                      fontSize: "0.9em",
                      marginLeft: "0.3rem",
                    }}
                  >
                    {unit}
                  </span>
                )}
              </p>
              <p className="mono-label" style={{ marginTop: "0.4rem" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Latest News teaser ──────────────────────────────────────── */}
      <motion.section
        {...fadeUp}
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "4.5rem 1.5rem 5.5rem",
        }}
      >
        {/* section header */}
        <div style={{ marginBottom: "2.25rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "var(--secondary)",
            }}
          >
            // Latest Updates
          </span>
          <div className="section-divider" style={{ marginTop: "0.8rem" }} />
        </div>

        {/* cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {NEWS.map(({ title, date, tag, tagClass }, i) => (
            <motion.div
              key={title}
              className="neon-card"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.11, ease: "easeOut" }}
              style={{
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.975rem",
                  color: "var(--text)",
                  flex: 1,
                  minWidth: "160px",
                }}
              >
                {title}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    color: "var(--muted)",
                  }}
                >
                  {date}
                </span>
                <span className={`tag ${tagClass}`}>{tag}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* see all */}
        <div style={{ marginTop: "2rem", textAlign: "right" }}>
          <Link
            href="/news"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "var(--secondary)",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            See all updates →
          </Link>
        </div>
      </motion.section>
    </>
  );
}

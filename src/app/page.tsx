"use client";

import Link from "next/link";
import { motion, type Transition } from "framer-motion";

// ── Shared motion config ────────────────────────────────────────────────────

const fadeUpTransition: Transition = { duration: 0.6, ease: "easeOut" };

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: fadeUpTransition,
};

// ── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: "PhishAI",
    subtitle: "Phishing Detection System",
    period: "University project · Team lead",
    description:
      "End-to-end ML pipeline for a routed, specialist-model phishing detector — DistilBERT fine-tuning, automated data pipelines, ablation studies, and W&B experiment tracking, benchmarked against classical baselines.",
    metrics: ["0.9707 F1 — email", "0.9248 F1 — URL", "Perfect modality routing"],
    stack: ["Python", "DistilBERT", "FastAPI", "Weights & Biases"],
    href: "https://github.com/Anakintano/aditya-Phishing-email-detection",
  },
  {
    title: "RepLift",
    subtitle: "Offline-First Nutrition Tracker",
    period: "Personal project",
    description:
      "Offline-first nutrition tracker with resilient IndexedDB sync — optimistic updates, idempotency keys, exponential backoff, and conflict resolution — plus an AI-assisted natural-language food logger with structured-output validation and a manual fallback.",
    metrics: ["54 passing frontend unit tests"],
    stack: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "Dexie"],
    href: "https://github.com/Anakintano/RepLift",
  },
];

const EXPERIENCE = [
  {
    role: "Software Development Intern — AI & Analytics",
    org: "Aditya Birla Group · Hindalco Industries Ltd.",
    period: "May 2025 — Jul 2025",
    location: "Renukoot, UP",
    description:
      "Built a production-ready AI & analytics platform for an aluminium extrusion plant — an explainable anomaly detection engine over 36,000+ manufacturing records under Six Sigma methods, and a full-stack time-series workflow system on FastAPI and SQLite for operational decision support.",
    note: "Recognized as a Hindalco Role Model for the internship's impact.",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "92svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "6rem 1.5rem 4rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: "720px", margin: "0 auto", width: "100%" }}
        >
          <p className="mono-label" style={{ marginBottom: "1.6rem" }}>
            Pune, India — Computer Science, KIIT
          </p>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(3rem, 9vw, 6rem)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              marginBottom: "1.8rem",
            }}
          >
            Aditya Saxena
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: "540px",
              marginBottom: "2.75rem",
            }}
          >
            Software engineer building full-stack and ML systems. Currently
            finishing my degree, most recently interning on the AI &amp;
            analytics team at Hindalco Industries.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#work" className="btn-primary">
              Selected work
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Résumé
            </a>
          </div>
        </motion.div>
      </section>

      {/* ─── Selected Work ───────────────────────────────────────────── */}
      <section id="work" style={{ maxWidth: "720px", margin: "0 auto", padding: "5rem 1.5rem" }}>
        <motion.div {...fadeUp} style={{ marginBottom: "3rem" }}>
          <span className="mono-label">Selected work</span>
          <div className="section-divider" style={{ marginTop: "0.9rem" }} />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="quiet-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              style={{
                display: "block",
                padding: "2rem",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.4rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-space, var(--font-sans))",
                    fontSize: "1.35rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {p.title}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                  }}
                >
                  {p.period}
                </span>
              </div>

              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                {p.subtitle}
              </p>

              <p style={{ color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                {p.description}
              </p>

              {p.metrics.length > 0 && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "var(--text)",
                    opacity: 0.85,
                    marginBottom: "1.1rem",
                  }}
                >
                  {p.metrics.join("  ·  ")}
                </p>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {p.stack.map((s) => (
                  <span key={s} className="pill">
                    {s}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ─── Experience ──────────────────────────────────────────────── */}
      <section id="experience" style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <motion.div {...fadeUp} style={{ marginBottom: "3rem" }}>
          <span className="mono-label">Experience</span>
          <div className="section-divider" style={{ marginTop: "0.9rem" }} />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {EXPERIENCE.map((e, i) => (
            <motion.div
              key={e.role}
              className="quiet-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              style={{ padding: "2rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.3rem",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{e.role}</h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                  {e.period}
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "1rem" }}>
                {e.org} · {e.location}
              </p>
              <p style={{ color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: e.note ? "1rem" : 0 }}>
                {e.description}
              </p>
              {e.note && (
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontStyle: "italic" }}>{e.note}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── About ───────────────────────────────────────────────────── */}
      <section id="about" style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
        <motion.div {...fadeUp} style={{ marginBottom: "2.5rem" }}>
          <span className="mono-label">About</span>
          <div className="section-divider" style={{ marginTop: "0.9rem" }} />
        </motion.div>

        <motion.div {...fadeUp}>
          <p style={{ color: "var(--text)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "1.25rem" }}>
            I&apos;m a final-year Computer Science student at KIIT, based in Pune.
            I like building things end to end — from a data pipeline to the
            interface someone actually uses — and I&apos;m most interested in
            the parts of software that touch real operational decisions:
            manufacturing anomaly detection, sync and offline reliability,
            model behavior under real constraints.
          </p>
          <p style={{ color: "var(--text)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "1.25rem" }}>
            Outside coursework and projects, I&apos;m also collaborating on a
            couple of research papers on LLM agent security and evaluation
            with faculty in the US — still under review, more to share once
            they&apos;re out.
          </p>
          <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.7 }}>
            Python, TypeScript, FastAPI, Next.js, PostgreSQL, Redis, Pandas,
            scikit-learn, Hugging Face.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={{ marginTop: "2.5rem" }}>
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            View full résumé →
          </Link>
        </motion.div>
      </section>
    </>
  );
}

"use client";

import { motion, Variants, Easing } from "framer-motion";

// ── Animation variants ──────────────────────────────────────────────────────

const EASE: Easing = "easeOut";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay: i * 0.08 },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.08 },
  }),
};

// ── Data ─────────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { id: "L1", label: "Token Verify" },
  { id: "L2", label: "Capability Manifest" },
  { id: "L3", label: "Audit Chain" },
  { id: "L4", label: "Temporal Validation" },
  { id: "L5", label: "Delegation Control" },
];

const METRICS = [
  { value: "76.7%", label: "Attack Blocking", color: "tag-green" },
  { value: "0%", label: "False Positives", color: "tag-green" },
  { value: "0.191ms", label: "Latency", color: "tag-cyan" },
  { value: "6", label: "Threat Categories", color: "tag-purple" },
];

const INTERESTS = [
  {
    emoji: "🛡️",
    title: "AI Safety & Alignment",
    description:
      "Robustness of LLM systems under adversarial conditions, formal verification of agent behavior, and ensuring models act within intended boundaries.",
  },
  {
    emoji: "⚔️",
    title: "Adversarial ML",
    description:
      "Attack surfaces in language model pipelines — prompt injection, tool poisoning, model jailbreaks, and emergent failure modes in agentic systems.",
  },
  {
    emoji: "🔐",
    title: "Agent Authorization",
    description:
      "Capability-based access control for LLM agents, decoupled enforcement architectures, and security models for the Model Context Protocol (MCP).",
  },
  {
    emoji: "🔒",
    title: "Secure Systems",
    description:
      "Cryptographic verification using ECDSA and audit chains, zero-trust architectures, and infrastructure-layer security independent of model reasoning.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: "transparent" }}
    >
      {/* Ambient background */}
      <div className="gradient-mesh" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-20">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-4"
        >
          <motion.p variants={fadeUp} className="mono-label">
            // RESEARCH WORK
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-6xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-space, 'Space Grotesk', sans-serif)",
              color: "#fff",
            }}
          >
            Research
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg max-w-2xl"
            style={{ color: "var(--muted)" }}
          >
            Working at the intersection of AI safety and systems security.
          </motion.p>
        </motion.section>

        <div
          className="section-divider"
          role="separator"
          aria-hidden="true"
        />

        {/* ── Featured Paper ──────────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-6"
        >
          <motion.p variants={fadeUp} className="mono-label">
            // FEATURED PAPER
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={1}
            className="neon-card p-8 md:p-10 space-y-8"
            style={{
              boxShadow:
                "0 0 40px rgba(124,58,237,0.12), 0 0 80px rgba(6,182,212,0.06)",
            }}
          >
            {/* Top badges */}
            <div className="flex flex-wrap gap-3">
              <span
                className="tag tag-red"
                style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
              >
                UNDER REVIEW
              </span>
              <span
                className="tag tag-green"
                style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
              >
                ACTIVE WORK
              </span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2
                className="text-2xl md:text-3xl font-bold leading-snug"
                style={{
                  fontFamily:
                    "var(--font-space, 'Space Grotesk', sans-serif)",
                  color: "#fff",
                }}
              >
                Breaking the Authorization Gap: Decoupled Enforcement for LLM
                Agents
              </h2>

              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--secondary)",
                }}
              >
                Aditya Saxena &middot; Sumit Kumar Tetarave &middot; Dr.
                Rishikesh Sahay &middot; Satya Ranjan Dash
              </p>
            </div>

            {/* Abstract */}
            <p
              className="text-base leading-relaxed max-w-3xl"
              style={{ color: "var(--text)", opacity: 0.85 }}
            >
              LLM-powered agents increasingly execute real-world actions, yet
              authorization decisions remain embedded within model reasoning.
              We show that inference-embedded authorization is fundamentally
              unreliable under adversarial conditions, and propose MCPS — a
              multi-layer enforcement framework that applies capability
              constraints independently of LLM inference.
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap gap-3">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className={`tag ${m.color}`}
                  style={{ fontSize: "0.78rem", padding: "0.3rem 0.85rem" }}
                >
                  <span className="font-bold mr-1">{m.value}</span>
                  <span style={{ opacity: 0.8 }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Pipeline */}
            <div className="space-y-3">
              <p
                className="mono-label"
                style={{ color: "var(--muted)", fontSize: "0.65rem" }}
              >
                ENFORCEMENT PIPELINE
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={stage.id} className="flex items-center gap-2">
                    <div
                      style={{
                        background: "rgba(124,58,237,0.10)",
                        border: "1px solid rgba(124,58,237,0.4)",
                        borderRadius: "8px",
                        padding: "0.3rem 0.75rem",
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.1rem",
                        minWidth: "7rem",
                        boxShadow: "0 0 10px rgba(124,58,237,0.15)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.65rem",
                          color: "var(--primary)",
                          letterSpacing: "0.08em",
                          fontWeight: 700,
                        }}
                      >
                        {stage.id}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.7rem",
                          color: "var(--text)",
                          opacity: 0.9,
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {stage.label}
                      </span>
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <span
                        style={{
                          color: "var(--secondary)",
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.85rem",
                          opacity: 0.7,
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <p
                className="text-sm italic"
                style={{ color: "var(--muted)" }}
              >
                Paper details intentionally limited — currently under blind
                review at a top venue.
              </p>
              <a
                href="https://github.com/Anakintano"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shrink-0"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </motion.div>
        </motion.section>

        <div className="section-divider" role="separator" aria-hidden="true" />

        {/* ── Research Interests ──────────────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <motion.p variants={fadeUp} className="mono-label">
              // RESEARCH INTERESTS
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl font-bold"
              style={{
                fontFamily: "var(--font-space, 'Space Grotesk', sans-serif)",
                color: "#fff",
              }}
            >
              Areas of Focus
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INTERESTS.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i + 2}
                className="neon-card p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={item.title}
                  >
                    {item.emoji}
                  </span>
                  <h3
                    className="text-base font-semibold"
                    style={{
                      fontFamily:
                        "var(--font-space, 'Space Grotesk', sans-serif)",
                      color: "#fff",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Footer spacer ───────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pb-8 text-center"
        >
          <p
            className="mono-label"
            style={{ color: "var(--muted)", opacity: 0.5 }}
          >
            // more work in progress
          </p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimeHero from "@/components/AnimeHero";

// ── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    index: "01",
    title: "PhishAI",
    subtitle: "Routed specialist-model phishing detection",
    description:
      "End-to-end ML pipeline — DistilBERT fine-tuning, automated data pipelines, ablation studies, W&B tracking. 0.9707 F1 on email, 0.9248 on URL, perfect modality routing.",
    stack: "Python · DistilBERT · FastAPI · W&B",
    href: "https://github.com/Anakintano/aditya-Phishing-email-detection",
  },
  {
    index: "02",
    title: "RepLift",
    subtitle: "Offline-first nutrition tracker",
    description:
      "Resilient IndexedDB sync — optimistic updates, idempotency keys, exponential backoff, conflict resolution — plus an AI-assisted natural-language food logger. 54 passing frontend unit tests.",
    stack: "Next.js · TypeScript · FastAPI · PostgreSQL · Redis",
    href: "https://github.com/Anakintano/RepLift",
  },
];

const MARQUEE_ITEMS =
  "Python · TypeScript · FastAPI · Next.js · PostgreSQL · Redis · Transformers · scikit-learn · Hugging Face · Pandas · ";

// ── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-reveal], [data-hero-line]", { opacity: 1, y: 0 });
        return;
      }

      // hero headline — staggered line rise
      const heroTween = gsap.fromTo(
        "[data-hero-line]",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.12,
          delay: 0.25,
        }
      );

      // resilience: if the rAF ticker is throttled (embedded views,
      // battery-saver modes), never leave the page blank — snap to final state
      const guard = window.setTimeout(() => {
        if (heroTween.progress() === 0) {
          gsap.set("[data-hero-line], [data-hero-sub], [data-reveal]", {
            clearProps: "all",
          });
        }
      }, 1800);
      const clearGuard = () => window.clearTimeout(guard);
      heroTween.eventCallback("onStart", clearGuard);
      gsap.fromTo(
        "[data-hero-sub]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.95 }
      );

      // hero content drifts up and fades as you scroll past it
      gsap.to("[data-hero-content]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom 35%",
          scrub: true,
        },
      });

      // generic section reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ─── Hero — anime dusk, editorial serif ─────────────────────── */}
      <section
        data-hero
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          // CSS fallback sky if WebGL is unavailable
          background: "linear-gradient(to top, #f0a875 0%, #d97f6f 30%, #8a6a9e 65%, #3a3560 100%)",
        }}
      >
        <AnimeHero />

        {/* legibility gradient */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,15,28,0.55) 0%, rgba(20,15,28,0.08) 35%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div
          data-hero-content
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "64rem",
            margin: "0 auto",
            padding: "0 1.25rem 5.5rem",
          }}
        >
          <p
            data-hero-sub
            className="mono-label"
            style={{ color: "rgba(255,255,255,0.85)", marginBottom: "1.6rem" }}
          >
            Aditya Saxena — Software Engineer · Pune, India
          </p>

          <h1
            className="display"
            style={{
              fontSize: "clamp(3.2rem, 11vw, 8.5rem)",
              color: "#fff",
              textShadow: "0 2px 40px rgba(20,15,28,0.35)",
              marginBottom: "2.4rem",
            }}
          >
            <span style={{ display: "block", overflow: "hidden" }}>
              <span data-hero-line style={{ display: "block" }}>The craft</span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <span data-hero-line style={{ display: "block" }}>
                <em>is the point.</em>
              </span>
            </span>
          </h1>

          <div data-hero-sub style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
            <a href="#work" className="btn-paper">
              Selected work
            </a>
            <Link href="/blog" className="btn-ghost-light">
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Marquee ─────────────────────────────────────────────────── */}
      <div className="marquee py-4" aria-hidden>
        <div className="marquee-track mono-label" style={{ color: "var(--ink-soft)" }}>
          {MARQUEE_ITEMS.repeat(3)}
          {MARQUEE_ITEMS.repeat(3)}
        </div>
      </div>

      {/* ─── Intro statement ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-28">
        <p
          data-reveal
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
            lineHeight: 1.3,
            maxWidth: "46rem",
          }}
        >
          Final-year CS student who likes building things end to end — from the
          data pipeline to the interface someone actually uses.{" "}
          <em style={{ color: "var(--terracotta)" }}>
            Most recently: the AI &amp; analytics intern at Hindalco Industries.
          </em>
        </p>
      </section>

      {/* ─── Selected work ───────────────────────────────────────────── */}
      <section id="work" className="max-w-4xl mx-auto px-5 sm:px-8 pb-24">
        <div data-reveal className="flex items-baseline justify-between mb-10">
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)" }}>
            Selected <em>work</em>
          </h2>
          <span className="mono-label" style={{ color: "var(--ink-soft)" }}>
            2024 — 2026
          </span>
        </div>

        <div data-reveal>
          {PROJECTS.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="work-row"
            >
              <div className="flex items-baseline gap-5 flex-wrap">
                <span className="mono-label" style={{ color: "var(--ink-soft)" }}>
                  {p.index}
                </span>
                <h3
                  className="work-title"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.8rem, 5vw, 3rem)",
                    transition: "color 0.25s",
                  }}
                >
                  {p.title}
                </h3>
                <span
                  className="mono-label hidden sm:inline"
                  style={{ color: "var(--ink-soft)", marginLeft: "auto" }}
                >
                  {p.subtitle}
                </span>
              </div>
              <p
                style={{
                  color: "var(--ink-soft)",
                  maxWidth: "620px",
                  lineHeight: 1.7,
                  marginTop: "0.9rem",
                  fontSize: "0.95rem",
                }}
              >
                {p.description}
              </p>
              <p className="mono-label" style={{ color: "var(--ink-soft)", marginTop: "1rem", opacity: 0.75 }}>
                {p.stack}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ─── Experience ──────────────────────────────────────────────── */}
      <section
        id="experience"
        style={{ background: "var(--paper-deep)", borderTop: "1px solid var(--line)" }}
      >
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24">
          <div data-reveal className="mb-10">
            <h2 className="display" style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)" }}>
              Experience
            </h2>
          </div>

          <div data-reveal>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}>
                Software Development Intern — AI &amp; Analytics
              </h3>
              <span className="mono-label" style={{ color: "var(--ink-soft)" }}>
                May — Jul 2025
              </span>
            </div>
            <p className="mono-label" style={{ color: "var(--terracotta)", margin: "0.5rem 0 1.2rem" }}>
              Aditya Birla Group · Hindalco Industries · Renukoot, UP
            </p>
            <p style={{ color: "var(--ink)", maxWidth: "640px", lineHeight: 1.75 }}>
              Built a production-ready AI &amp; analytics platform for an
              aluminium extrusion plant — an explainable anomaly detection
              engine over 36,000+ manufacturing records under Six Sigma
              methods, and a full-stack time-series workflow system on FastAPI
              and SQLite for operational decision support.
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "var(--ink-soft)",
                marginTop: "1.2rem",
              }}
            >
              Recognized as a Hindalco Role Model for the internship&apos;s impact.
            </p>
          </div>
        </div>
      </section>

      {/* ─── About ───────────────────────────────────────────────────── */}
      <section id="about" className="max-w-4xl mx-auto px-5 sm:px-8 py-28">
        <div data-reveal className="mb-10">
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)" }}>
            About
          </h2>
        </div>
        <div data-reveal style={{ maxWidth: "640px" }}>
          <p style={{ lineHeight: 1.8, marginBottom: "1.2rem" }}>
            I&apos;m a final-year Computer Science student at KIIT, based in
            Pune. I care about the parts of software that touch real
            operational decisions — manufacturing anomaly detection, sync and
            offline reliability, model behavior under real constraints.
          </p>
          <p style={{ lineHeight: 1.8, marginBottom: "1.8rem" }}>
            Outside coursework, I&apos;m collaborating on a couple of research
            papers on LLM agent security and evaluation with faculty in the US
            — still under review, more to share once they&apos;re out. I write
            about what I&apos;m learning on{" "}
            <Link href="/blog" style={{ color: "var(--terracotta)", textUnderlineOffset: "3px" }}>
              the blog
            </Link>
            .
          </p>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-line">
            Full résumé
          </a>
        </div>
      </section>
    </div>
  );
}

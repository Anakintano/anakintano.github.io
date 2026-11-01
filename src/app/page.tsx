import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

const STAGES = ["commit", "build", "test", "image", "plan", "deploy"];

const WORK = [
  {
    t: "Hindalco Industries — ML/DevOps Intern",
    y: "2025",
    d: "Real-time sensor pipeline and deployed ML quality-detection and forecasting services for an aluminium plant; Six Sigma data pipelines over 36,000+ records.",
  },
  {
    t: "PhishAI",
    y: "2026",
    href: "https://github.com/Anakintano/aditya-Phishing-email-detection",
    d: "Phishing detection with routed specialist models, automated data pipelines and W&B experiment tracking.",
  },
  {
    t: "RepLift",
    y: "2026",
    href: "https://github.com/Anakintano/RepLift",
    d: "Offline-first Next.js + FastAPI + Postgres app with an idempotent sync engine and 54 passing frontend tests.",
  },
];

const ONLINE = [
  { t: "GitHub", y: "Anakintano", href: "https://github.com/Anakintano" },
  { t: "LinkedIn", y: "adityasaxena-devops", href: "https://www.linkedin.com/in/adityasaxena-devops" },
  { t: "Email", y: "madityasaxena@gmail.com", href: "mailto:madityasaxena@gmail.com" },
];

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <>
      <div className="hero">
        <svg viewBox="0 0 960 220" role="img" aria-label="CI/CD pipeline: commit, build, test, image, plan, deploy">
          {STAGES.map((s, i) => {
            const x = 40 + i * 150;
            return (
              <g key={s}>
                {i > 0 && (
                  <line className="wire" x1={x - 50} y1="110" x2={x} y2="110" stroke="#5fd4e0" strokeWidth="2" strokeDasharray="6 6" />
                )}
                <rect x={x} y="80" width="100" height="60" rx="4" fill="#0e1118" stroke="#5fd4e0" strokeWidth="1.5" />
                <text x={x + 50} y="115" textAnchor="middle" fontSize="15" fill="#e8eaf0">{s}</text>
              </g>
            );
          })}
          <text x="40" y="190" fontSize="12" fill="#6fe08c">$ jenkins · docker · kubernetes · terraform · aws</text>
        </svg>
      </div>

      <div className="col">
        <p className="lbl">DevOps / MLOps</p>
        <h1 className="h1">Hi, I&apos;m Aditya.</h1>
        <p className="dek">
          I build the pipelines that take code and models to production — CI/CD, containers,
          infrastructure as code, and the monitoring around them.
        </p>
        <p className="more">
          <a href="#about">More about me</a> · <a href="/resume.pdf">Résumé</a>
        </p>

        <section id="about">
          <h2>About</h2>
          <p>
            Final-year CS student at KIIT, looking for DevOps / MLOps roles. My stack is Jenkins,
            Docker, Kubernetes, Terraform and AWS, with Python and SQL underneath. I like the gap
            between &ldquo;works on my laptop&rdquo; and &ldquo;runs reliably in a plant&rdquo; —
            that&apos;s where my Hindalco internship lived. I also contribute to research on LLM
            agent security.
          </p>
        </section>

        <section id="work">
          <h2>Work</h2>
          {WORK.map(({ t, y, d, href }) => (
            <div className="item" key={t}>
              <div className="hd">
                {href ? (
                  <a className="t" href={href} target="_blank" rel="noopener noreferrer">{t}</a>
                ) : (
                  <span className="t">{t}</span>
                )}
                <span className="y">{y}</span>
              </div>
              <p>{d}</p>
            </div>
          ))}
        </section>

        <section id="stack">
          <h2>Stack</h2>
          <ul className="chips">
            {["Jenkins", "Docker", "Kubernetes", "Terraform", "AWS", "n8n", "Python", "SQL", "GitHub Actions", "W&B"].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        {posts.length > 0 && (
          <section id="posts">
            <h2>Posts</h2>
            <ol className="idx">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}/`}>
                    <span className="t">{p.title}</span>
                    <span className="d">{formatDate(p.date)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section id="online">
          <h2>Online</h2>
          {ONLINE.map(({ t, y, href }) => (
            <div className="item" key={t}>
              <div className="hd">
                <a className="t" href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{t}</a>
                <span className="y">{y}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

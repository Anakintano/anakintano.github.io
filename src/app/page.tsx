import Link from "next/link";
import NightRoom from "@/components/NightRoom";
import { getAllPosts, formatDate } from "@/lib/blog";

const WORK = [
  {
    t: "Hindalco Industries",
    r: "ML/DevOps intern, Industrial IoT",
    y: "2025",
    d: "Real-time pipeline over live billet-inspection sensor data. Deployed a quality-detection model at 95% accuracy, cutting manual inspection by 60%, and a forecasting system behind a 12% throughput gain. Six Sigma pipelines over 36,000+ records.",
  },
  {
    t: "PhishAI",
    r: "Routed phishing detection",
    y: "2026",
    href: "https://github.com/Anakintano/aditya-Phishing-email-detection",
    d: "Specialist DistilBERT models behind a router, automated data pipelines and W&B tracking. 0.9707 F1 on email, 0.9248 on URLs.",
  },
  {
    t: "RepLift",
    r: "Offline-first app",
    y: "2026",
    href: "https://github.com/Anakintano/RepLift",
    d: "Next.js, FastAPI and Postgres with an idempotent sync engine. 54 passing frontend tests.",
  },
];

const STACK = ["Jenkins", "Docker", "Kubernetes", "Terraform", "AWS", "GitHub Actions", "n8n", "Python", "SQL", "W&B"];

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <>
      <NightRoom />

      <div className="col">
        <section id="work">
          <h2>Work</h2>
          {WORK.map(({ t, r, y, d, href }) => (
            <div className="item" key={t}>
              <div className="hd">
                {href ? (
                  <a className="t" href={href} target="_blank" rel="noopener noreferrer">{t}</a>
                ) : (
                  <span className="t">{t}</span>
                )}
                <span className="y">{y}</span>
              </div>
              <p className="role">{r}</p>
              <p>{d}</p>
            </div>
          ))}
        </section>

        <section id="about">
          <h2>About</h2>
          <p>
            Final-year CS student at KIIT, looking for DevOps and MLOps roles. I like the gap between
            &ldquo;works on my laptop&rdquo; and &ldquo;runs reliably in a plant&rdquo;, which is where
            my Hindalco internship lived. I also contribute to research on LLM agent security.
          </p>
          <ul className="chips">
            {STACK.map((s) => <li key={s}>{s}</li>)}
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

        <section id="online" className="close">
          <h2 className="h1">Let&apos;s build something that ships.</h2>
          <div className="acts">
            <a href="mailto:madityasaxena@gmail.com">Email me</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
            <a href="https://www.linkedin.com/in/adityasaxena-devops" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <p className="lbl">
            or <a href="https://github.com/Anakintano" target="_blank" rel="noopener noreferrer">github.com/Anakintano</a>
          </p>
        </section>
      </div>
    </>
  );
}

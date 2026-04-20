import { fetchRepos, Repo } from "@/lib/github";
import GitHubHeatmap from "./GitHubHeatmap";

// ── Language color map ───────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
};

function LanguageDot({ language }: { language: string | null }) {
  if (!language) return null;
  const color = LANG_COLORS[language] ?? "#64748b";
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{ width: 10, height: 10, background: color }}
      />
      <span
        className="text-xs"
        style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
      >
        {language}
      </span>
    </span>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const visibleTopics = repo.topics.slice(0, 2);

  return (
    <article className="neon-card p-5 flex flex-col gap-3 h-full">
      {/* Top row: language + stars */}
      <div className="flex items-center justify-between">
        <LanguageDot language={repo.language} />
        <span
          className="flex items-center gap-1 text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            style={{ color: "#F7DF1E" }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {repo.stargazers_count}
        </span>
      </div>

      {/* Repo name */}
      <h3
        className="font-bold text-base leading-snug"
        style={{
          color: "var(--text)",
          fontFamily: "'Space Grotesk', var(--font-sans)",
        }}
      >
        {repo.name}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "var(--muted)" }}
      >
        {repo.description ?? "No description provided."}
      </p>

      {/* Bottom row: GitHub link + topic chips */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold transition-colors duration-200 hover:text-[var(--accent)]"
          style={{
            color: "var(--secondary)",
            fontFamily: "var(--font-mono)",
            textDecoration: "none",
          }}
        >
          View on GitHub ↗
        </a>
        {visibleTopics.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {visibleTopics.map((topic) => (
              <span key={topic} className="tag tag-cyan">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ── Server component page ────────────────────────────────────────────────────
export default async function ProjectsPage() {
  const repos = await fetchRepos();

  return (
    <main className="relative min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Ambient gradient */}
      <div className="gradient-mesh" style={{ zIndex: 0 }} />

      <div
        className="relative mx-auto max-w-6xl px-6 py-24 flex flex-col gap-20"
        style={{ zIndex: 1 }}
      >
        {/* ── Section 1: Projects Grid ──────────────────────────────── */}
        <section className="flex flex-col gap-10">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <span className="mono-label">// OPEN SOURCE WORK</span>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{
                color: "var(--text)",
                fontFamily: "'Space Grotesk', var(--font-sans)",
              }}
            >
              Projects
            </h1>
            <p className="text-base max-w-xl" style={{ color: "var(--muted)" }}>
              Selected ML, AI &amp; Security projects. All code is open source.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        </section>

        {/* Section divider */}
        <div className="section-divider" />

        {/* ── Section 2: GitHub Activity ────────────────────────────── */}
        <section className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="mono-label">// CONTRIBUTION ACTIVITY</span>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{
                color: "var(--text)",
                fontFamily: "'Space Grotesk', var(--font-sans)",
              }}
            >
              GitHub activity for{" "}
              <a
                href="https://github.com/Anakintano"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--secondary)", textDecoration: "none" }}
              >
                @Anakintano
              </a>
            </h2>
          </div>

          {/* Client heatmap component */}
          <GitHubHeatmap />
        </section>
      </div>
    </main>
  );
}

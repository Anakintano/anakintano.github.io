import { fetchNews, NewsItem } from "@/lib/notion";

export const revalidate = 60; // ISR: revalidate every 60 seconds

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: string): string {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function tagClass(tag: string): string {
  switch (tag) {
    case "Research":
      return "tag tag-purple";
    case "Life":
      return "tag tag-cyan";
    case "Paper":
      return "tag tag-red";
    case "Tech":
      return "tag tag-green";
    default:
      return "tag tag-cyan";
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TagChip({ tag }: { tag: string }) {
  return <span className={tagClass(tag)}>{tag}</span>;
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="neon-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <time
          dateTime={item.date}
          className="font-mono text-xs tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          {formatDate(item.date)}
        </time>
        <TagChip tag={item.tag} />
      </div>

      <h2
        className="text-xl font-bold leading-snug"
        style={{
          color: "var(--text)",
          fontFamily: "'Space Grotesk', var(--font-sans)",
        }}
      >
        {item.title}
      </h2>

      {item.excerpt && (
        <p
          className="text-sm mt-2 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {item.excerpt}
        </p>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Tag legend — visual only, no interactivity
// ---------------------------------------------------------------------------

const TAG_LEGEND: { label: string; cls: string }[] = [
  { label: "Research", cls: "tag tag-purple" },
  { label: "Life",     cls: "tag tag-cyan"   },
  { label: "Tech",     cls: "tag tag-green"  },
  { label: "Paper",    cls: "tag tag-red"    },
];

function TagLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {TAG_LEGEND.map(({ label, cls }) => (
        <span key={label} className={cls}>
          {label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Setup instructions — helper card at the bottom
// ---------------------------------------------------------------------------

function SetupInstructions() {
  return (
    <div
      className="neon-card p-5 md:p-6 opacity-60"
      style={{
        border: "1px dashed rgba(255,255,255,0.25)",
        background: "rgba(17,17,40,0.5)",
      }}
    >
      <p
        className="mono-label mb-3"
        style={{ color: "var(--muted)" }}
      >
        // CONFIG
      </p>
      <h3
        className="text-base font-bold mb-4"
        style={{
          color: "var(--text)",
          fontFamily: "'Space Grotesk', var(--font-sans)",
        }}
      >
        Setting up Notion CMS
      </h3>

      <ol className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
        <li className="flex gap-3">
          <span
            className="font-mono text-xs font-bold shrink-0 mt-0.5"
            style={{ color: "var(--secondary)" }}
          >
            01
          </span>
          <span>
            Create a Notion database with the following columns:{" "}
            <strong style={{ color: "var(--text)" }}>Name</strong> (Title),{" "}
            <strong style={{ color: "var(--text)" }}>Date</strong> (Date),{" "}
            <strong style={{ color: "var(--text)" }}>Tag</strong> (Select —
            options: Research, Life, Tech, Paper),{" "}
            <strong style={{ color: "var(--text)" }}>Excerpt</strong> (Text),{" "}
            <strong style={{ color: "var(--text)" }}>Published</strong>{" "}
            (Checkbox).
          </span>
        </li>
        <li className="flex gap-3">
          <span
            className="font-mono text-xs font-bold shrink-0 mt-0.5"
            style={{ color: "var(--secondary)" }}
          >
            02
          </span>
          <span>
            Go to{" "}
            <span
              className="font-mono text-xs"
              style={{ color: "var(--accent)" }}
            >
              notion.so/my-integrations
            </span>{" "}
            and create a new integration. Copy the Internal Integration Token.
          </span>
        </li>
        <li className="flex gap-3">
          <span
            className="font-mono text-xs font-bold shrink-0 mt-0.5"
            style={{ color: "var(--secondary)" }}
          >
            03
          </span>
          <span>
            Open your database in Notion, click{" "}
            <strong style={{ color: "var(--text)" }}>··· &rarr; Add
            connections</strong>, and share it with your integration.
          </span>
        </li>
        <li className="flex gap-3">
          <span
            className="font-mono text-xs font-bold shrink-0 mt-0.5"
            style={{ color: "var(--secondary)" }}
          >
            04
          </span>
          <span>
            Add to{" "}
            <span
              className="font-mono text-xs"
              style={{ color: "var(--accent)" }}
            >
              .env.local
            </span>
            :
            <br />
            <code
              className="font-mono text-xs block mt-1 p-2 rounded"
              style={{
                background: "rgba(0,0,0,0.3)",
                color: "var(--accent)",
                border: "1px solid rgba(212,212,216,0.15)",
              }}
            >
              NOTION_TOKEN=secret_xxx
              <br />
              NOTION_DB_ID=your-database-id
            </code>
          </span>
        </li>
      </ol>

      <p
        className="text-xs mt-5 italic"
        style={{ color: "var(--muted)" }}
      >
        Until configured, the site shows sample entries.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function NewsPage() {
  const news = await fetchNews();

  return (
    <main className="min-h-screen" style={{ background: "transparent" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="mb-12">
          <p className="mono-label mb-3">// LATEST UPDATES</p>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
            style={{
              color: "var(--text)",
              fontFamily: "'Space Grotesk', var(--font-sans)",
            }}
          >
            News
          </h1>

          <p
            className="text-base sm:text-lg mb-3"
            style={{ color: "var(--muted)" }}
          >
            Things happening in my world — research, projects, life.
          </p>

          <p
            className="text-xs italic"
            style={{ color: "var(--muted)", opacity: 0.6 }}
          >
            Powered by Notion. I write updates there, they appear here
            automatically.
          </p>
        </header>

        <div className="section-divider mb-8" />

        {/* ── Tag legend ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="mono-label mb-3">// CATEGORIES</p>
          <TagLegend />
        </div>

        <div className="section-divider mb-10" />

        {/* ── News feed ──────────────────────────────────────────────── */}
        {news.length > 0 ? (
          <section className="space-y-4">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <div
            className="neon-card p-8 text-center"
            style={{ color: "var(--muted)" }}
          >
            <p className="mono-label mb-2">// EMPTY</p>
            <p className="text-sm">No published entries yet.</p>
          </div>
        )}

        {/* ── Setup instructions ─────────────────────────────────────── */}
        <div className="mt-16">
          <SetupInstructions />
        </div>
      </div>
    </main>
  );
}

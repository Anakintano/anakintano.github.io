import { Client } from "@notionhq/client";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
}

// ---------------------------------------------------------------------------
// Minimal property-value shapes for the properties we read.
// We use `unknown` for the specific value field and narrow with helpers below.
// ---------------------------------------------------------------------------

interface RawTitleProp {
  type: "title";
  title: unknown[];
}
interface RawDateProp {
  type: "date";
  date: unknown;
}
interface RawSelectProp {
  type: "select";
  select: unknown;
}
interface RawRichTextProp {
  type: "rich_text";
  rich_text: unknown[];
}
interface RawCheckboxProp {
  type: "checkbox";
  checkbox: boolean;
}
type RawProp =
  | RawTitleProp
  | RawDateProp
  | RawSelectProp
  | RawRichTextProp
  | RawCheckboxProp
  | { type: string };

interface NotionPage {
  object: string;
  id: string;
  properties: Record<string, RawProp>;
}

interface NotionQueryResponse {
  results: NotionPage[];
}

// ---------------------------------------------------------------------------
// Safe accessors
// ---------------------------------------------------------------------------

function getPlainText(items: unknown[]): string {
  const first = items[0];
  if (first && typeof first === "object" && "plain_text" in first) {
    return String((first as { plain_text: unknown }).plain_text);
  }
  return "";
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

function getNotionClient(): Client | null {
  if (!process.env.NOTION_TOKEN) return null;
  return new Client({ auth: process.env.NOTION_TOKEN });
}

// ---------------------------------------------------------------------------
// Public fetcher
// ---------------------------------------------------------------------------

export async function fetchNews(): Promise<NewsItem[]> {
  const notion = getNotionClient();
  if (!notion || !process.env.NOTION_DB_ID) {
    return getFallbackNews();
  }
  try {
    // databases.query was removed in @notionhq/client v5.
    // We call the unchanged Notion REST endpoint directly via client.request().
    const response = await notion.request<NotionQueryResponse>({
      method: "post",
      path: `databases/${process.env.NOTION_DB_ID}/query`,
      body: {
        filter: { property: "Published", checkbox: { equals: true } },
        sorts: [{ property: "Date", direction: "descending" }],
      },
    });

    return response.results
      .filter((p): p is NotionPage => p.object === "page")
      .map((page) => {
        const props = page.properties;

        // Title
        const titleProp = props.Name;
        const title =
          titleProp?.type === "title"
            ? getPlainText((titleProp as RawTitleProp).title)
            : "Untitled";
        if (!title) {
          // keep default
        }

        // Date
        const dateProp = props.Date;
        let date = "";
        if (dateProp?.type === "date") {
          const d = (dateProp as RawDateProp).date;
          if (d && typeof d === "object" && "start" in d) {
            date = String((d as { start: unknown }).start);
          }
        }

        // Tag
        const tagProp = props.Tag;
        let tag = "Update";
        if (tagProp?.type === "select") {
          const s = (tagProp as RawSelectProp).select;
          if (s && typeof s === "object" && "name" in s) {
            tag = String((s as { name: unknown }).name);
          }
        }

        // Excerpt
        const excerptProp = props.Excerpt;
        const excerpt =
          excerptProp?.type === "rich_text"
            ? getPlainText((excerptProp as RawRichTextProp).rich_text)
            : "";

        return { id: page.id, title: title || "Untitled", date, tag, excerpt };
      });
  } catch {
    return getFallbackNews();
  }
}

// ---------------------------------------------------------------------------
// Fallback data (used when NOTION_TOKEN / NOTION_DB_ID are not set)
// ---------------------------------------------------------------------------

function getFallbackNews(): NewsItem[] {
  return [
    {
      id: "1",
      title: "Working on MCPS evaluation — results looking strong",
      date: "2026-04-15",
      tag: "Research",
      excerpt:
        "Finished extended benchmark runs. 76.7% blocking rate across 6 threat categories with 0% false positives.",
    },
    {
      id: "2",
      title: "Paper submission progress update",
      date: "2026-03-20",
      tag: "Research",
      excerpt:
        "Completed rewrite of threat model and evaluation sections. Targeting a top venue submission.",
    },
    {
      id: "3",
      title: "Exploring new attack surfaces in MCP protocol",
      date: "2026-02-10",
      tag: "Research",
      excerpt:
        "Interesting edge cases around delegation escalation and indirect prompt injection via tool responses.",
    },
    {
      id: "4",
      title: "Wrapped up Microsoft Ambassador year",
      date: "2024-01-15",
      tag: "Life",
      excerpt:
        "Incredible year leading workshops for 180+ developers. Grateful for the community.",
    },
  ];
}

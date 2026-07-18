import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Aditya Saxena",
  description: "Notes on software engineering, machine learning, and things I'm learning while building.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-36 pb-24">
      <p className="mono-label" style={{ color: "var(--ink-soft)" }}>
        Journal
      </p>
      <h1
        className="display"
        style={{ fontSize: "clamp(2.6rem, 7vw, 4.5rem)", margin: "0.8rem 0 3.5rem" }}
      >
        Field <em>notes.</em>
      </h1>

      <div>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="work-row group">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2
                className="work-title"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                  transition: "color 0.25s",
                }}
              >
                {post.title}
              </h2>
              <span className="mono-label" style={{ color: "var(--ink-soft)" }}>
                {formatDate(post.date)}
              </span>
            </div>
            {post.excerpt && (
              <p style={{ color: "var(--ink-soft)", marginTop: "0.6rem", maxWidth: "560px", lineHeight: 1.65 }}>
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
        {posts.length === 0 && (
          <p style={{ color: "var(--ink-soft)" }}>Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}

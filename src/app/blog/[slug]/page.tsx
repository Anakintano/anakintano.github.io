import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — Aditya Saxena`,
    description: post.excerpt,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-36 pb-24">
      <Link
        href="/blog"
        className="mono-label"
        style={{ color: "var(--ink-soft)", textDecoration: "none" }}
      >
        ← All posts
      </Link>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2.3rem, 6vw, 3.8rem)",
          lineHeight: 1.05,
          margin: "1.6rem 0 0.9rem",
        }}
      >
        {post.title}
      </h1>
      <p className="mono-label" style={{ color: "var(--ink-soft)", marginBottom: "3rem" }}>
        {formatDate(post.date)}
      </p>

      <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

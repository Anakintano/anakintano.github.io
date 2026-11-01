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
    <article className="col">
      <Link href="/blog/" className="lbl" style={{ textDecoration: "none" }}>
        ← All posts
      </Link>
      <h1 className="h1" style={{ margin: "1rem 0 0.5rem" }}>{post.title}</h1>
      <p className="lbl" style={{ marginBottom: "2rem" }}>{formatDate(post.date)}</p>

      <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

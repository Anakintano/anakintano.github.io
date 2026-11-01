import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Posts — Aditya Saxena",
  description: "Notes on DevOps, MLOps and things I'm learning while building.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div className="col">
      <p className="lbl">Posts</p>
      <h1 className="h1">Notes</h1>
      <p className="more" />
      <ol className="idx" style={{ marginTop: 24 }}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}/`}>
              <span className="t">{p.title}</span>
              <span className="d">{formatDate(p.date)}</span>
            </Link>
          </li>
        ))}
      </ol>
      {posts.length === 0 && <p>Nothing here yet.</p>}
    </div>
  );
}

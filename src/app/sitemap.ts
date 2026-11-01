import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const SITE = "https://anakintano.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/` },
    { url: `${SITE}/blog/` },
    ...getAllPosts().map((p) => ({ url: `${SITE}/blog/${p.slug}/`, lastModified: p.date })),
  ];
}

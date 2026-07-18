import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages (anakintano.github.io — user site, root path)
  output: "export",
  // directory-style URLs (blog/index.html) so GitHub Pages serves both
  // /blog and /blog/ correctly
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

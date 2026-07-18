# anakintano.github.io

Personal site — Next.js 16 static export, deployed to GitHub Pages via GitHub Actions on every push to `master`.

Live at **https://anakintano.github.io**

## Writing a blog post

Posts are markdown files in [`content/blog/`](content/blog/). Publishing = pushing a commit, so only you can write here — git is the auth.

1. Create `content/blog/my-post-slug.md`:

   ```markdown
   ---
   title: My post title
   date: 2026-07-18
   excerpt: One-line summary shown on the blog index.
   ---

   Post body in **markdown**. Headings, lists, code blocks, images all work.
   ```

2. Commit and push (or add the file directly on github.com — "Add file" in the
   `content/blog` folder — and commit from the browser).
3. The deploy workflow builds and publishes automatically in ~1 minute.

The filename (minus `.md`) becomes the URL: `/blog/my-post-slug`.

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # static export → out/
```

## Stack

- Next.js 16 (app router, `output: "export"`)
- Tailwind CSS v4 + Instrument Serif / Inter / JetBrains Mono
- three.js — procedural anime-dusk hero (WebGL shader, no video asset)
- GSAP + ScrollTrigger — entrance and scroll animations
- `marked` — build-time markdown rendering for the blog

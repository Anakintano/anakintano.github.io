import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pfoot">
      <Link href="/#about">About</Link>
      <Link href="/#work">Work</Link>
      <Link href="/blog/">Posts</Link>
      <Link href="/#online">Online</Link>
      <a href="mailto:madityasaxena@gmail.com">Email</a>
      <span className="sp">© 2026 Aditya Saxena</span>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/blog/", label: "Posts" },
  { href: "/#online", label: "Online" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="site">
      <Link href="/" className="name">Aditya Saxena</Link>
      <nav>
        {links.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={label === "Posts" && pathname.startsWith("/blog") ? "page" : undefined}>
            {label}
          </Link>
        ))}
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="ext">Résumé</a>
      </nav>
    </header>
  );
}

import type { Metadata } from "next";
import { Archivo, Fira_Code, Fira_Sans, Literata, VT323 } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const display = Archivo({ variable: "--font-display", subsets: ["latin"], axes: ["wdth"] });
const osd = VT323({ variable: "--font-osd", subsets: ["latin"], weight: "400" });
const serif = Literata({ variable: "--font-serif", subsets: ["latin"], style: ["normal", "italic"] });
const body = Fira_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "700"] });
const mono = Fira_Code({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

const description =
  "DevOps / MLOps engineer. CI/CD, Docker, Kubernetes, Terraform and AWS. Shipping ML systems from notebook to production. Hindalco MLOps intern.";

export const metadata: Metadata = {
  title: "Aditya Saxena · DevOps & MLOps Engineer",
  description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { title: "Aditya Saxena · DevOps & MLOps Engineer", description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${osd.variable} ${serif.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

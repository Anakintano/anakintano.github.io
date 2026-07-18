import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aditya Saxena — Software Engineer",
  description:
    "Computer science undergraduate at KIIT. Building full-stack and ML systems — internship at Hindalco, phishing detection with DistilBERT, an offline-first nutrition tracker.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Aditya Saxena — Software Engineer",
    description:
      "Computer science undergraduate at KIIT, Pune. Full-stack and ML engineering — Hindalco internship, DistilBERT phishing detection, RepLift.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body id="top" className="min-h-full flex flex-col text-[var(--text)]">
        <ShaderBackground />
        <Nav />
        <main className="flex-1 relative z-[1]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "AMI Panorama — Mobilité internationale des apprentis",
    template: "%s | AMI Panorama",
  },
  description:
    "AMI Panorama accompagne la mobilité internationale des apprentis. Financement Erasmus+, coordination et suivi terrain pour organismes de formation et entreprises.",
  keywords: ["mobilité internationale", "apprentis", "Erasmus+", "CFA", "formation", "alternance"],
  openGraph: {
    siteName: "AMI Panorama",
    type: "website",
    locale: "fr_FR",
    url: "https://amipanorama.com",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen flex flex-col">
        <div className="grid-overlay" aria-hidden="true" />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

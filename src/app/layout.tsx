import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AMI Panorama — Mobilité internationale des apprentis, clé en main",
    template: "%s | AMI Panorama",
  },
  description:
    "AMI Panorama conçoit des programmes de mobilité internationale clé en main pour les CFA et les entreprises — 7 nuits, 6 destinations, formation, visites et financement Erasmus+.",
  keywords: ["mobilité internationale", "apprentis", "Erasmus+", "CFA", "formation", "alternance", "Séville", "Montréal", "Londres", "Séoul", "New York"],
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
    <html lang="fr" className={manrope.variable}>
      <body className="min-h-screen flex flex-col">
        <div className="grid-overlay" aria-hidden="true" />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}

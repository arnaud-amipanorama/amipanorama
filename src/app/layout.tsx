import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrispChat from "@/components/CrispChat";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { activeDestinations } from "@/data/destinations";
import { organizationJsonLd } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Police éditoriale (citations, titres en italique). Chargée ici plutôt que par
// un @import dans globals.css : next/font l'auto-héberge, la précharge et évite
// une requête bloquante vers fonts.googleapis.com.
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amipanorama.com"),
  title: {
    default: "AMI Panorama, Mobilité internationale pour les établissements de formation",
    template: "%s | AMI Panorama",
  },
  description:
    "AMI Panorama conçoit des programmes de mobilité internationale pour les CFA, les écoles et les établissements de l'alternance. Format de référence : 8 jours / 7 nuits ; formats de 4 à 5 jours à 31 jours selon le projet. De 15 à 82 heures de formation, visites d'entreprise, encadrement terrain et accompagnement administratif.",
  keywords: ["mobilité internationale", "apprentis", "CFA", "alternance", "formation professionnelle", "établissements", ...activeDestinations.map((d) => d.city)],
  openGraph: {
    siteName: "AMI Panorama",
    type: "website",
    locale: "fr_FR",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const jsonLd = organizationJsonLd();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="grid-overlay" aria-hidden="true" />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <CrispChat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

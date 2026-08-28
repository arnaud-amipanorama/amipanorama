import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrispChat from "@/components/CrispChat";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  keywords: ["mobilité internationale", "apprentis", "CFA", "alternance", "formation professionnelle", "établissements", "Montréal", "Séville", "New York", "Londres", "Séoul"],
  openGraph: {
    siteName: "AMI Panorama",
    type: "website",
    locale: "fr_FR",
    url: "https://amipanorama.com",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://amipanorama.com/#organization",
      name: "AMI Panorama",
      alternateName: "AMI Panorama, Mobilité internationale",
      url: "https://amipanorama.com",
      logo: "https://amipanorama.com/Assets/Brand/ami-logo-black.png",
      email: "info@amipanorama.com",
      foundingDate: "2022",
      description:
        "AMI Panorama est un opérateur de mobilité internationale qui conçoit, organise et sécurise des programmes de mobilité pour les CFA, les écoles et les établissements de l'alternance et de l'enseignement supérieur. Formation, hébergement, logistique, encadrement terrain, accompagnement administratif et ingénierie financière (financements OPCO, référent mobilité, Erasmus+).",
      areaServed: ["FR"],
      knowsAbout: [
        "mobilité internationale des apprentis",
        "financement OPCO de la mobilité",
        "référent mobilité",
        "Erasmus+ apprentissage",
        "voyage d'études",
        "CFA",
        "alternance",
      ],
      sameAs: ["https://www.instagram.com/ami.panorama"],
    },
    {
      "@type": "WebSite",
      "@id": "https://amipanorama.com/#website",
      url: "https://amipanorama.com",
      name: "AMI Panorama",
      inLanguage: "fr-FR",
      publisher: { "@id": "https://amipanorama.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Programmes de mobilité internationale pour CFA et établissements de formation",
      provider: { "@id": "https://amipanorama.com/#organization" },
      serviceType: "Mobilité internationale des apprentis et alternants",
      areaServed: "France",
      description:
        "Séjours de mobilité internationale clés en main (format de référence 8 jours / 7 nuits, de 4 à 5 jours à 31 jours) : formation professionnelle, visites d'entreprise, hébergement, encadrement et ingénierie financière. Destinations : Montréal, Séville, New York, Londres, Malte, Berlin, Rome, Miami, Maroc, Séoul.",
    },
  ],
};

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

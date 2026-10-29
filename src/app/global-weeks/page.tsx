import type { Metadata } from "next";
import { fundingExamplePhrase } from "@/data/globalWeeks";
import GlobalWeeksExperience from "./GlobalWeeksExperience";

const description = `Global Weeks by AMI Panorama : une mobilité internationale pour les alternants, même sans voyage de promo. Dans la majorité des cas, ton voyage sera financé. Un reste à charge peut s’appliquer, par exemple ${fundingExamplePhrase()}.`;

export const metadata: Metadata = {
  title: "Global Weeks, mobilité internationale pour alternants",
  description,
  alternates: { canonical: "/global-weeks" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Global Weeks by AMI Panorama",
    description:
      "Pars en mobilité même sans voyage de classe. Dans la majorité des cas, ton voyage sera financé. AMI monte le dossier avec toi.",
    url: "/global-weeks",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AMI Panorama, mobilité internationale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Weeks by AMI Panorama",
    description:
      "Pars en mobilité même sans voyage de classe. Dans la majorité des cas, ton voyage sera financé.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://amipanorama.com/global-weeks#webpage",
  url: "https://amipanorama.com/global-weeks",
  name: "Global Weeks by AMI Panorama",
  description,
  inLanguage: "fr-FR",
  isPartOf: { "@id": "https://amipanorama.com/#website" },
  about: {
    "@type": "Service",
    name: "Global Weeks",
    serviceType: "Mobilité internationale pour alternants",
    provider: { "@id": "https://amipanorama.com/#organization" },
    areaServed: "FR",
    url: "https://amipanorama.com/global-weeks",
  },
};

export default function GlobalWeeksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GlobalWeeksExperience />
    </>
  );
}

import type { Metadata } from "next";
import EuropeanCitizenshipPage from "@/components/european-citizenship/EuropeanCitizenshipPage";
import { citizenshipCopy, citizenshipJsonLd, citizenshipRoutes } from "@/data/europeanCitizenship";

const copy = citizenshipCopy("fr");

export const metadata: Metadata = {
  title: copy.seo.title,
  description: copy.seo.description,
  alternates: {
    canonical: citizenshipRoutes.fr,
    languages: {
      fr: citizenshipRoutes.fr,
      en: citizenshipRoutes.en,
      "x-default": citizenshipRoutes.fr,
    },
  },
  openGraph: {
    title: copy.seo.title,
    description: copy.seo.description,
    url: citizenshipRoutes.fr,
    locale: "fr_FR",
    alternateLocale: ["en_GB"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.seo.title,
    description: copy.seo.description,
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citizenshipJsonLd("fr")) }} />
      <EuropeanCitizenshipPage locale="fr" />
    </>
  );
}

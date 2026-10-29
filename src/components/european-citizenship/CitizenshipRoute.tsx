import type { Metadata } from "next";
import { citizenshipCopy, citizenshipJsonLd, citizenshipRoutes, type CitizenshipLocale } from "@/data/europeanCitizenship";
import EuropeanCitizenshipPage from "./EuropeanCitizenshipPage";

export function citizenshipMetadata(locale: CitizenshipLocale): Metadata {
  const copy = citizenshipCopy(locale);
  const path = citizenshipRoutes[locale];
  const title = copy.seo.title;
  const description = copy.seo.description;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: path,
      languages: {
        fr: citizenshipRoutes.fr,
        en: citizenshipRoutes.en,
        "x-default": citizenshipRoutes.fr,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AMI Panorama, mobilité internationale" }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function CitizenshipRoute({ locale }: { locale: CitizenshipLocale }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citizenshipJsonLd(locale)) }} />
      <EuropeanCitizenshipPage locale={locale} />
    </>
  );
}

import type { Metadata } from "next";
import { hasEuropeanCitizenshipAccess } from "@/app/citoyennete-europeenne/actions";
import { citizenshipCopy, citizenshipJsonLd, citizenshipRoutes, type CitizenshipLocale } from "@/data/europeanCitizenship";
import AccessGate from "./AccessGate";
import EuropeanCitizenshipPage from "./EuropeanCitizenshipPage";

const privateRobots: Metadata["robots"] = { index: false, follow: false };

export async function citizenshipMetadata(locale: CitizenshipLocale): Promise<Metadata> {
  const open = await hasEuropeanCitizenshipAccess();
  const copy = citizenshipCopy(locale);
  const path = citizenshipRoutes[locale];
  const locked = locale === "fr"
    ? { title: "Accès réservé", description: "Cette page est protégée par un mot de passe." }
    : { title: "Private access", description: "This page is password protected." };
  const title = open ? copy.seo.title : locked.title;
  const description = open ? copy.seo.description : locked.description;

  return {
    title,
    description,
    robots: privateRobots,
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
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function CitizenshipRoute({ locale, access }: { locale: CitizenshipLocale; access?: string }) {
  const open = await hasEuropeanCitizenshipAccess();
  if (!open) return <AccessGate locale={locale} denied={access === "denied"} />;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citizenshipJsonLd(locale)) }} />
      <EuropeanCitizenshipPage locale={locale} />
    </>
  );
}

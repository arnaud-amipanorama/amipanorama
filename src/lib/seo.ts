import type { Metadata } from "next";
import { company, publicPhone, SITE_URL } from "@/data/legal";
import { activeDestinations } from "@/data/destinations";
import { socialLinks } from "@/data/social";

type PageMetaInput = {
  title: string;
  description: string;
  /** Chemin canonique, « / » pour l'accueil. */
  path: string;
  /** Ignore le template « %s | AMI Panorama » du layout. */
  absolute?: boolean;
  index?: boolean;
};

export function pageMeta({ title, description, path, absolute = false, index = true }: PageMetaInput): Metadata {
  const canonical = path === "" ? "/" : path;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "fr_FR",
      type: "website",
      siteName: company.brand,
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
  };
}

/**
 * TODO Arnaud : ne pas trancher ici le récit de fondation
 * (Montréal 2022, déjà publié, vs création de la SAS à Strasbourg en 2023).
 * `foundingDate` reste la valeur déjà en ligne.
 * Le positionnement « agence de voyage » de llms.txt n'est pas modifié ici.
 * Le type TravelAgency reflète le code APE 79.12Z déjà publié dans les mentions.
 */
export function organizationJsonLd() {
  const destinationNames = activeDestinations.map((d) => d.city).join(", ");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "TravelAgency"],
        "@id": `${SITE_URL}/#organization`,
        name: company.brand,
        alternateName: "AMI Panorama, Mobilité internationale",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/Assets/Brand/ami-logo-black.png`,
        },
        image: `${SITE_URL}/Assets/Brand/ami-logo-black.png`,
        email: company.email,
        ...(publicPhone.confirmed && publicPhone.value ? { telephone: publicPhone.value } : {}),
        foundingDate: "2022",
        description:
          "AMI Panorama est un opérateur de mobilité internationale qui conçoit, organise et sécurise des programmes de mobilité pour les CFA, les écoles et les établissements de l'alternance et de l'enseignement supérieur. Formation, hébergement, logistique, encadrement terrain, accompagnement administratif et ingénierie financière (financements OPCO, référent mobilité, Erasmus+).",
        address: {
          "@type": "PostalAddress",
          streetAddress: company.street,
          postalCode: company.postalCode,
          addressLocality: company.city,
          addressCountry: "FR",
        },
        identifier: {
          "@type": "PropertyValue",
          propertyID: "SIREN",
          value: company.siren,
        },
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
        sameAs: socialLinks.map((link) => link.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: company.brand,
        inLanguage: "fr-FR",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Service",
        name: "Programmes de mobilité internationale pour CFA et établissements de formation",
        provider: { "@id": `${SITE_URL}/#organization` },
        serviceType: "Mobilité internationale des apprentis et alternants",
        areaServed: "France",
        description: `Séjours de mobilité internationale clés en main (format de référence 8 jours / 7 nuits, de 4 à 5 jours à 31 jours) : formation professionnelle, visites d'entreprise, hébergement, encadrement et ingénierie financière. Destinations : ${destinationNames}.`,
      },
    ],
  };
}

export function destinationJsonLd(input: {
  slug: string;
  city: string;
  countryCode: string;
  description: string;
  ideal: string;
}) {
  const url = `${SITE_URL}/destinations/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: `Mobilité internationale à ${input.city}`,
        description: input.description,
        url,
        touristType: input.ideal || undefined,
        provider: { "@id": `${SITE_URL}/#organization` },
        itinerary: {
          "@type": "Place",
          name: input.city,
          address: {
            "@type": "PostalAddress",
            addressLocality: input.city,
            addressCountry: input.countryCode,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE_URL}/destinations` },
          { "@type": "ListItem", position: 3, name: input.city, item: url },
        ],
      },
    ],
  };
}

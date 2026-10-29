import type { Metadata } from "next";
import PublicSimulator from "./PublicSimulator";

const description =
  "Estimation indicative d’un séjour Global Weeks, en mobilité individuelle ou de groupe. Dans la majorité des cas, le séjour est financé. D’après nos informations.";

export const metadata: Metadata = {
  title: "Estimer mon séjour Global Weeks",
  description,
  alternates: { canonical: "/global-weeks/simulateur" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Estimer mon séjour Global Weeks",
    description,
    url: "/global-weeks/simulateur",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AMI Panorama, mobilité internationale" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estimer mon séjour Global Weeks",
    description,
  },
};

export default function PublicSimulatorPage() {
  return <PublicSimulator />;
}

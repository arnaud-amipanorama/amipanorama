import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import path from "node:path";
import { indexableDestinations } from "@/data/destinations";

const BASE = "https://amipanorama.com";

function lastModified(file: string) {
  return statSync(path.join(/* turbopackIgnore: true */ process.cwd(), file)).mtime;
}

const pages: { path: string; file: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", file: "src/app/page.tsx", priority: 1, freq: "weekly" },
  { path: "/destinations", file: "src/app/destinations/page.tsx", priority: 0.9, freq: "monthly" },
  { path: "/notre-programme", file: "src/app/notre-programme/page.tsx", priority: 0.9, freq: "monthly" },
  { path: "/a-propos", file: "src/app/a-propos/page.tsx", priority: 0.7, freq: "monthly" },
  { path: "/contact", file: "src/app/contact/page.tsx", priority: 0.8, freq: "monthly" },
  { path: "/rendez-vous", file: "src/app/rendez-vous/page.tsx", priority: 0.6, freq: "monthly" },
  { path: "/mentions-legales", file: "src/app/mentions-legales/page.tsx", priority: 0.2, freq: "yearly" },
  { path: "/politique-de-confidentialite", file: "src/app/politique-de-confidentialite/page.tsx", priority: 0.2, freq: "yearly" },
  { path: "/politique-cookies", file: "src/app/politique-cookies/page.tsx", priority: 0.2, freq: "yearly" },
  { path: "/conditions-generales", file: "src/app/conditions-generales/page.tsx", priority: 0.2, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const destinationMtime = lastModified("src/data/destinations.ts");
  return [
    ...pages.map((page) => ({
      url: `${BASE}${page.path}`,
      lastModified: lastModified(page.file),
      changeFrequency: page.freq,
      priority: page.priority,
    })),
    ...indexableDestinations.map((destination) => ({
      url: `${BASE}/destinations/${destination.slug}`,
      lastModified: destinationMtime,
      changeFrequency: "monthly" as const,
      priority: destination.phare ? 0.8 : 0.7,
    })),
  ];
}

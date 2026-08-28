import type { MetadataRoute } from "next";

const BASE = "https://amipanorama.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/destinations", priority: 0.9, freq: "monthly" },
    { path: "/notre-programme", priority: 0.9, freq: "monthly" },
    { path: "/a-propos", priority: 0.7, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "monthly" },
    { path: "/rendez-vous", priority: 0.6, freq: "monthly" },
    // /services n'est plus une page : elle redirige (308) vers /notre-programme.
    // La déclarer ici revenait à proposer une redirection à l'indexation.
    { path: "/mentions-legales", priority: 0.2, freq: "yearly" },
    { path: "/politique-de-confidentialite", priority: 0.2, freq: "yearly" },
    { path: "/politique-cookies", priority: 0.2, freq: "yearly" },
    { path: "/conditions-generales", priority: 0.2, freq: "yearly" },
  ];
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}

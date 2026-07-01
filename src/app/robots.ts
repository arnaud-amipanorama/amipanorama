import type { MetadataRoute } from "next";

// Autorise tous les moteurs ET les robots d'IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
// via la règle générique "*". Seul l'outil interne est exclu.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/internal/"] }],
    sitemap: "https://amipanorama.com/sitemap.xml",
    host: "https://amipanorama.com",
  };
}

import type { MetadataRoute } from "next";

// Autorise les moteurs et les robots d'IA via la règle « * ».
// L'outil interne et les routes d'API restent exclus.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/internal/", "/api/"] }],
    sitemap: "https://amipanorama.com/sitemap.xml",
  };
}

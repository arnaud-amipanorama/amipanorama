import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/services", destination: "/notre-programme", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Noms versionnés (dossier v1) : cache long, immuable.
        // Les photos de groupes gardent leur chemin historique, aussi utilisé
        // par le simulateur : pas de cache immuable sur ces fichiers.
        source: "/Assets/stock/v1/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

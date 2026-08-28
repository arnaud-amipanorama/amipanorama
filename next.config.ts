import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hôtes autorisés pour next/image. Les visuels de ville encore issus de
    // banques d'images passent aujourd'hui en background-image CSS (donc hors
    // optimisation) ; pexels est déclaré ici pour pouvoir les basculer sur
    // next/image sans nouvelle configuration.
    // static.wixstatic.com retiré : plus aucune image ne vient de l'ancien site Wix.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;

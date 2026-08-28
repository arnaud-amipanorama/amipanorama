// ─────────────────────────────────────────────────────────────────────────
//  RÉSEAUX SOCIAUX, source unique (footer + page contact).
//
//  Règle : un réseau n'est affiché QUE si son URL est connue. Un bouton qui
//  renvoie vers "https://linkedin.com" ou "https://wa.me" (sans identifiant)
//  est pire que pas de bouton du tout.
//
//  Pour activer LinkedIn / WhatsApp : renseigner les variables ci-dessous
//  dans Vercel → Settings → Environment Variables, puis redéployer.
//    NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/ami-panorama
//    NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/33XXXXXXXXX
// ─────────────────────────────────────────────────────────────────────────

export type SocialLink = { label: string; href: string };

const CANDIDATES: (SocialLink | null)[] = [
  { label: "Instagram", href: "https://instagram.com/ami.panorama" },
  process.env.NEXT_PUBLIC_LINKEDIN_URL
    ? { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL }
    : null,
  process.env.NEXT_PUBLIC_WHATSAPP_URL
    ? { label: "WhatsApp", href: process.env.NEXT_PUBLIC_WHATSAPP_URL }
    : null,
];

export const socialLinks: SocialLink[] = CANDIDATES.filter(
  (l): l is SocialLink => l !== null
);

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Décrivez votre projet de mobilité internationale. AMI Panorama revient vers vous avec un premier cadrage adapté à votre groupe.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

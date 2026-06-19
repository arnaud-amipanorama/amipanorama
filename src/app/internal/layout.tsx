import type { Metadata } from "next";

// Tout le segment /internal est non indexé et hors navigation publique.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

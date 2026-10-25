import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ padding: "160px 24px 120px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div className="section-label">404</div>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 60px)",
          fontWeight: 700,
          letterSpacing: "-0.045em",
          lineHeight: 1.05,
          marginBottom: 20,
        }}>
          Cette page n&apos;existe pas.
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
          Le lien est peut-être ancien, ou l&apos;adresse a été saisie avec une erreur.
          Vous pouvez revenir à l&apos;accueil ou parcourir les destinations.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">Retour à l&apos;accueil</Link>
          <Link href="/destinations" className="btn-ghost">Voir les destinations</Link>
          <Link href="/contact" className="btn-ghost">Nous écrire</Link>
        </div>
      </div>
    </section>
  );
}

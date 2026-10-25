import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestination, indexableDestinations } from "@/data/destinations";
import { included, programmeFaq } from "@/data/programme";
import { testimonials } from "@/data/testimonials";
import { destinationJsonLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return indexableDestinations.map((destination) => ({ slug: destination.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination?.indexable) return {};
  return pageMeta({
    title: `Mobilité internationale à ${destination.city}`,
    description: destination.description,
    path: `/destinations/${destination.slug}`,
  });
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination?.indexable) notFound();

  const quotes = testimonials.filter((item) => item.dest === destination.city);
  const duration = programmeFaq.find((item) => item.q.startsWith("Combien de temps"));
  const contents = programmeFaq.find((item) => item.q.startsWith("Que comprend"));
  const faqs = [
    destination.ideal
      ? { q: `Pour quelles filières ${destination.city} est-elle envisagée ?`, a: destination.ideal }
      : null,
    duration ?? null,
    contents ?? null,
  ].filter((item): item is { q: string; a: string } => item !== null);

  const jsonLd = destinationJsonLd({
    slug: destination.slug,
    city: destination.city,
    countryCode: destination.countryCode,
    description: destination.description,
    ideal: destination.ideal,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section style={{ position: "relative", padding: "150px 24px 72px", background: "var(--navy)", overflow: "hidden" }}>
        <Image src={destination.photo} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", opacity: 0.32 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(11,24,41,0.28) 0%, var(--navy) 100%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <nav aria-label="Fil d'Ariane" style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 13, color: "rgba(255,255,255,0.72)", marginBottom: 22 }}>
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <Link href="/destinations">Destinations</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: "#fff" }}>{destination.city}</span>
          </nav>
          <div className="section-label-light">{destination.flag} {destination.country}</div>
          <h1 style={{
            fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.045em",
            color: "#fff", lineHeight: 1, marginBottom: 16,
          }}>
            {destination.city}
          </h1>
          <p style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500,
            fontSize: "clamp(20px, 2.4vw, 30px)", color: "var(--blue-on-dark)",
            maxWidth: 680, lineHeight: 1.35, marginBottom: 18,
          }}>
            {destination.headline}
          </p>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", maxWidth: 640, lineHeight: 1.75 }}>
            {destination.description}
          </p>
          {destination.phare && (
            <div style={{
              display: "inline-block", marginTop: 22, fontSize: 12, fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff",
              background: "rgba(27,61,136,0.92)", borderRadius: 100, padding: "6px 14px",
            }}>
              Destination phare
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "72px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48 }} className="dest-detail-grid">
          <div>
            <div className="section-label">Au programme</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 22 }}>
              Ce que prévoit le séjour à {destination.city}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {destination.highlights.map((item) => (
                <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: destination.accent, flexShrink: 0, marginTop: 8 }} />
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
            {destination.ideal && (
              <p style={{ marginTop: 28, fontSize: 14, color: "var(--text-secondary)" }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
                  Filières recommandées
                </span>
                <span style={{ color: destination.accent, fontWeight: 600 }}>{destination.ideal}</span>
              </p>
            )}
          </div>
          {destination.facts.length > 0 && (
            <aside style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 18, padding: "28px 26px" }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 16 }}>Points clés</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {destination.facts.map((fact) => (
                  <p key={fact} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{fact}</p>
                ))}
              </div>
            </aside>
          )}
        </div>
      </section>

      {destination.gallery.length > 0 && (
        <section style={{ padding: "0 24px 72px", background: "var(--bg)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>Sur place</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {destination.gallery.map((photo) => (
                <div key={photo.src} style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 16, overflow: "hidden" }}>
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 30vw" style={{ objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "0 24px 72px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label">Ce qui est inclus</div>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 8 }}>
            Le format de référence, coordonné de bout en bout.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 640, marginBottom: 28 }}>
            Le détail du séjour à {destination.city} est construit avec l&apos;établissement. Le cadre déjà publié d&apos;AMI Panorama reste le même.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {included.map((item) => (
              <div key={item.num} style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 18px 16px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>{item.num}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 24px 72px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label">Questions fréquentes</div>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.035em", marginBottom: 8 }}>
            Avant de préparer {destination.city}
          </h2>
          <div>
            {faqs.map((item) => (
              <div key={item.q} style={{ padding: "22px 0", borderTop: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.q}</h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>{item.a}</p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
              <Link href="/notre-programme#faq" style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)" }}>
                Toutes les questions sur le programme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {quotes.length > 0 && (
        <section style={{ padding: "0 24px 72px", background: "var(--bg)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="section-label">Ils en parlent</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.035em", marginBottom: 20 }}>
              Retours déjà publiés sur {destination.city}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {quotes.map((quote) => (
                <figure key={quote.name + quote.quote.slice(0, 24)} style={{ margin: 0, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 22px 18px" }}>
                  <blockquote style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    « {quote.quote} »
                  </blockquote>
                  <figcaption style={{ marginTop: 16, fontSize: 13, fontWeight: 600 }}>
                    {quote.name}
                    <span style={{ display: "block", fontWeight: 500, color: "var(--text-muted)", marginTop: 2 }}>{quote.school}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", background: "var(--navy)", borderRadius: 20, padding: "64px 36px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500,
            fontSize: "clamp(26px, 3vw, 40px)", color: "#fff", marginBottom: 14,
          }}>
            Construisons le programme {destination.city}.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Filière, taille du groupe, dates : dites-nous où vous en êtes. Nous revenons avec une première proposition.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Demander un programme</Link>
            <Link href="/rendez-vous" className="btn-ghost-light">Réserver un échange</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .dest-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

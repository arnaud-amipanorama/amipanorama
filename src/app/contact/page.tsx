"use client";
import Link from "next/link";
import { useState } from "react";

const topics = [
  "Demande de programme",
  "Financement & dispositifs",
  "Information sur une destination",
  "Partenariat école / CFA",
  "Autre",
];

const profiles = [
  "CFA / Organisme de formation",
  "École / Établissement",
  "Entreprise / OPCO",
  "Collectivité / Région",
  "Autre",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    prenom: "", nom: "", org: "", profile: "", email: "", telephone: "",
    topic: "", destination: "", groupSize: "", message: "", rgpd: false,
    company: "", // honeypot anti-spam (caché)
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.rgpd) {
      setError("Merci d'accepter la politique de confidentialité pour continuer.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          etablissement: form.org,
          profil: form.profile,
          objet: form.topic,
          destination: form.destination,
          tailleGroupe: form.groupSize,
          message: form.message,
          rgpd: form.rgpd,
          company: form.company,
          page: typeof window !== "undefined" ? window.location.pathname : "/contact",
          date: new Date().toISOString(),
          source: "formulaire contact",
        }),
      });
      if (!res.ok) throw new Error("server");
      setSent(true);
    } catch {
      setError(
        "Une erreur est survenue. Réessayez, ou écrivez-nous directement à info@amipanorama.com."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="page-hero-section" style={{ position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(30,82,208,0.10) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label">Contact</div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.08, maxWidth: 640, marginBottom: 24 }}>
            Parlons de<br />
            <span className="gradient-text">votre prochain groupe.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.75 }}>
            Décrivez votre projet en quelques lignes. Nous revenons vers vous rapidement
            avec un premier cadrage adapté à votre projet. Vous préférez en parler de vive voix ?{" "}
            <Link href="/rendez-vous" style={{ color: "var(--blue)", fontWeight: 500 }}>Réservez un échange.</Link>
          </p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start",
          }} className="contact-grid">

            {/* Form */}
            <div style={{
              background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, padding: "44px 40px",
            }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: "rgba(30,82,208,0.10)", border: "1px solid rgba(30,82,208,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, color: "var(--blue)", margin: "0 auto 24px",
                  }}>✓</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
                    Demande envoyée !
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 400, margin: "0 auto 28px" }}>
                    Merci {form.prenom || ""}. Notre équipe revient vers vous rapidement avec un premier cadrage.
                    Pour gagner du temps, vous pouvez aussi réserver un créneau d&apos;échange dès maintenant.
                  </p>
                  <Link href="/rendez-vous" className="btn-primary" style={{ display: "inline-flex" }}>
                    Réserver un échange
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 32 }}>
                    Votre demande
                  </h2>

                  {/* Row 1 — prénom / nom */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Prénom *</label>
                      <input required placeholder="Prénom" value={form.prenom}
                        onChange={e => set("prenom", e.target.value)}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      <label style={lbl}>Nom *</label>
                      <input required placeholder="Nom" value={form.nom}
                        onChange={e => set("nom", e.target.value)}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  {/* Row 2 — organisation / email */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Organisation</label>
                      <input placeholder="Nom du CFA / établissement" value={form.org}
                        onChange={e => set("org", e.target.value)}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      <label style={lbl}>Email *</label>
                      <input required type="email" placeholder="vous@organisation.fr" value={form.email}
                        onChange={e => set("email", e.target.value)}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  {/* Row 3 — profil / téléphone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Vous êtes…</label>
                      <select value={form.profile}
                        onChange={e => set("profile", e.target.value)}
                        style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}
                        onFocus={focus} onBlur={blur}>
                        <option value="">Votre profil…</option>
                        {profiles.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Téléphone</label>
                      <input type="tel" placeholder="Optionnel" value={form.telephone}
                        onChange={e => set("telephone", e.target.value)}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  {/* Row 4 — objet / destination */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Objet de votre demande</label>
                      <select value={form.topic}
                        onChange={e => set("topic", e.target.value)}
                        style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}
                        onFocus={focus} onBlur={blur}>
                        <option value="">Choisir…</option>
                        {topics.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Destination envisagée</label>
                      <select value={form.destination}
                        onChange={e => set("destination", e.target.value)}
                        style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}
                        onFocus={focus} onBlur={blur}>
                        <option value="">Pas encore décidé</option>
                        {["Montréal", "Séville", "Londres", "Maroc", "New York", "Séoul", "Autre"].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Taille du groupe */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={lbl}>Taille du groupe (approximative)</label>
                    <input placeholder="Ex. 12 apprentis" value={form.groupSize}
                      onChange={e => set("groupSize", e.target.value)}
                      style={inp} onFocus={focus} onBlur={blur} />
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={lbl}>Votre message *</label>
                    <textarea required rows={5}
                      placeholder="Décrivez votre projet, vos contraintes, vos dates souhaitées, votre secteur d'activité…"
                      value={form.message}
                      onChange={e => set("message", e.target.value)}
                      style={{ ...inp, resize: "vertical" as const, minHeight: 120 }}
                      onFocus={focus} onBlur={blur} />
                  </div>

                  {/* Honeypot — caché aux humains, piège à bots */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                    <label>Ne pas remplir
                      <input tabIndex={-1} autoComplete="off" value={form.company}
                        onChange={e => set("company", e.target.value)} />
                    </label>
                  </div>

                  {/* RGPD */}
                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 24, cursor: "pointer" }}>
                    <input type="checkbox" required checked={form.rgpd}
                      onChange={e => set("rgpd", e.target.checked)}
                      style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--coral)", flexShrink: 0, cursor: "pointer" }} />
                    <span style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      J&apos;accepte que mes données soient utilisées pour traiter ma demande, conformément à la{" "}
                      <Link href="/politique-de-confidentialite" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                        politique de confidentialité
                      </Link>. *
                    </span>
                  </label>

                  {error && (
                    <div style={{
                      fontSize: 13, color: "#B42318", background: "rgba(180,35,24,0.07)",
                      border: "1px solid rgba(180,35,24,0.2)", borderRadius: 8,
                      padding: "10px 14px", marginBottom: 16, lineHeight: 1.5,
                    }}>{error}</div>
                  )}

                  <button type="submit" className="btn-primary" disabled={loading}
                    style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Envoi en cours…" : "Envoyer ma demande"}
                    {!loading && (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Booking */}
              <div style={{
                background: "var(--navy)", borderRadius: 16, padding: "28px", position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "radial-gradient(ellipse at top right, rgba(232,88,53,0.18) 0%, transparent 65%)",
                }} />
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8, position: "relative" }}>
                  Préférez un échange direct ?
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 18, position: "relative" }}>
                  Réservez un créneau de 20 minutes, sans engagement, pour parler de votre projet.
                </p>
                <Link href="/rendez-vous" className="btn-primary" style={{ position: "relative", display: "inline-flex" }}>
                  Réserver un échange
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

              <div style={{
                background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px",
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Nos coordonnées</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Email", value: "info@amipanorama.com" },
                    { label: "Réponse", value: "Rapide et personnalisée" },
                    { label: "Langues", value: "Français · Anglais" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px",
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Retrouvez-nous</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { label: "Instagram", href: "https://instagram.com/ami.panorama" },
                    { label: "LinkedIn", href: "https://linkedin.com" },
                    { label: "WhatsApp", href: "https://wa.me" },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 12, fontWeight: 500,
                        padding: "7px 14px", border: "1px solid var(--border)", borderRadius: 8,
                        color: "var(--text-secondary)", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "var(--border-hover)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >{label}</a>
                  ))}
                </div>
              </div>

              <div style={{
                background: "rgba(232,88,53,0.06)", border: "1px solid rgba(232,88,53,0.18)",
                borderRadius: 16, padding: "28px",
              }}>
                <div style={{ fontSize: 20, marginBottom: 12 }}>✦</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--coral)" }}>
                  Premier échange gratuit
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                  Aucun engagement, aucune facturation pour le premier contact. Nous prenons le temps de comprendre votre projet avant de vous proposer quoi que ce soit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

const lbl: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "var(--text-muted)", marginBottom: 7,
  letterSpacing: "0.06em", textTransform: "uppercase",
};

const inp: React.CSSProperties = {
  width: "100%", background: "var(--bg-2)",
  border: "1px solid var(--border)", borderRadius: 8,
  padding: "11px 14px", fontSize: 14, color: "var(--text-primary)",
  outline: "none", transition: "border-color 0.15s", fontFamily: "inherit",
};

const focus = (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = "var(--accent)");
const blur = (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = "var(--border)");

"use client";
import { useState } from "react";

const topics = [
  "Demande de programme",
  "Financement Erasmus+",
  "Information sur une destination",
  "Partenariat école / CFA",
  "Autre",
];

const profiles = [
  "CFA / Organisme de formation",
  "Entreprise / OPCO",
  "Collectivité / Région",
  "Particulier / Apprenti",
  "Autre",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", org: "", profile: "", email: "", topic: "", destination: "", groupSize: "", message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Wire up to your own API route, Resend, or Formspree
    await new Promise(r => setTimeout(r, 900));
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <section className="page-hero-section" style={{ position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(107,92,231,0.14) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label">Contact</div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.08, maxWidth: 640, marginBottom: 24 }}>
            Parlons de<br />
            <span className="gradient-text">votre prochain groupe.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.75 }}>
            Décrivez votre projet en quelques lignes. Nous vous répondons sous 24h ouvrables
            avec une proposition adaptée à votre contexte.
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
                    background: "rgba(107,92,231,0.1)", border: "1px solid rgba(107,92,231,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, margin: "0 auto 24px",
                  }}>✓</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
                    Message envoyé !
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 380, margin: "0 auto" }}>
                    Merci. Notre équipe reviendra vers vous dans les 24 heures ouvrables avec une réponse personnalisée.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 32 }}>
                    Votre demande
                  </h2>

                  {/* Row 1 */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Votre nom *</label>
                      <input required placeholder="Prénom Nom" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                    <div>
                      <label style={lbl}>Organisation *</label>
                      <input required placeholder="Nom du CFA / entreprise" value={form.org}
                        onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Vous êtes…</label>
                      <select value={form.profile}
                        onChange={e => setForm(f => ({ ...f, profile: e.target.value }))}
                        style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}
                        onFocus={focus} onBlur={blur}>
                        <option value="">Votre profil…</option>
                        {profiles.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Email *</label>
                      <input required type="email" placeholder="vous@organisation.fr" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inp} onFocus={focus} onBlur={blur} />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label style={lbl}>Objet de votre demande</label>
                      <select value={form.topic}
                        onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                        style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}
                        onFocus={focus} onBlur={blur}>
                        <option value="">Choisir…</option>
                        {topics.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Destination envisagée</label>
                      <select value={form.destination}
                        onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                        style={{ ...inp, appearance: "none" as const, cursor: "pointer" }}
                        onFocus={focus} onBlur={blur}>
                        <option value="">Pas encore décidé</option>
                        {["Séville", "Montréal", "Londres", "Maroc", "New York", "Séoul"].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Taille du groupe */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={lbl}>Taille du groupe (approximative)</label>
                    <input placeholder="Ex. 12 apprentis" value={form.groupSize}
                      onChange={e => setForm(f => ({ ...f, groupSize: e.target.value }))}
                      style={inp} onFocus={focus} onBlur={blur} />
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 28 }}>
                    <label style={lbl}>Votre message *</label>
                    <textarea required rows={5}
                      placeholder="Décrivez votre projet, vos contraintes, vos dates souhaitées, votre secteur d'activité…"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ ...inp, resize: "vertical" as const, minHeight: 120 }}
                      onFocus={focus} onBlur={blur} />
                  </div>

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
              <div style={{
                background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px",
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Nos coordonnées</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Email", value: "info@amipanorama.com" },
                    { label: "Basés à", value: "Canada · Timezone EST" },
                    { label: "Réponse sous", value: "24h ouvrables" },
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
                background: "rgba(107,92,231,0.06)", border: "1px solid rgba(107,92,231,0.18)",
                borderRadius: 16, padding: "28px",
              }}>
                <div style={{ fontSize: 20, marginBottom: 12 }}>✦</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--accent-light)" }}>
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

"use client";

import { FormEvent, useState } from "react";

type Stage = "request" | "verify" | "pending";

export default function UnlockForm() {
  const [stage, setStage] = useState<Stage>("request");
  const [form, setForm] = useState({ fullName: "", establishment: "", email: "", phone: "", company: "" });
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function requestAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/simulator-access/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (result.granted) { window.location.reload(); return; }
      setStage("verify"); setMessage("Un code à 6 chiffres vient d’être envoyé à votre adresse e-mail.");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "La demande n’a pas pu être envoyée."); }
    finally { setPending(false); }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/simulator-access/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (result.granted) { window.location.reload(); return; }
      setStage("pending");
    } catch (verifyError) { setError(verifyError instanceof Error ? verifyError.message : "Le code n’a pas pu être vérifié."); }
    finally { setPending(false); }
  }

  return (
    <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", background: "#101722", color: "#F8FAFC", padding: 24, fontFamily: "var(--font-manrope, system-ui, sans-serif)" }}>
      <div style={{ position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, pointerEvents: "none", background: "radial-gradient(ellipse, rgba(57,99,183,0.25) 0%, transparent 65%)" }} />
      <main style={{ position: "relative", width: "100%", maxWidth: 440, background: "#1D2736", border: "1px solid #53647E", borderRadius: 18, padding: "clamp(28px,5vw,40px)", boxShadow: "0 24px 80px rgba(0,0,0,0.42)", color: "#F8FAFC" }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#5C8EF0", boxShadow: "0 0 16px rgba(92,142,240,0.72)", marginBottom: 24 }} />
        <h1 style={{ fontSize: 25, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, color: "#FFFFFF" }}>Simulateur de financement</h1>
        <p style={{ fontSize: 13.5, color: "#CBD5E1", margin: "10px 0 28px", lineHeight: 1.55 }}>Cet espace est réservé aux établissements accompagnés par AMI Panorama.</p>
        {stage === "request" && <form onSubmit={requestAccess} style={formStyle}>
          <Field label="Nom et prénom"><input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} style={inputStyle} autoComplete="name" /></Field>
          <Field label="Établissement"><input value={form.establishment} onChange={(e) => update("establishment", e.target.value)} style={inputStyle} autoComplete="organization" /></Field>
          <Field label="E-mail professionnel"><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} style={inputStyle} autoComplete="email" /></Field>
          <Field label="Téléphone"><input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} style={inputStyle} autoComplete="tel" /></Field>
          <input tabIndex={-1} aria-hidden="true" value={form.company} onChange={(e) => update("company", e.target.value)} style={{ display: "none" }} />
          <button type="submit" disabled={pending} style={buttonStyle}>{pending ? "Envoi en cours…" : "Demander l’accès"}</button>
        </form>}
        {stage === "verify" && <form onSubmit={verifyCode} style={formStyle}>
          <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#D5DDEA", lineHeight: 1.55 }}>{message}</p>
          <Field label="Code de vérification"><input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} style={{ ...inputStyle, fontSize: 22, fontWeight: 700, letterSpacing: "0.2em", textAlign: "center" }} autoFocus /></Field>
          <button type="submit" disabled={pending} style={buttonStyle}>{pending ? "Vérification…" : "Vérifier le code"}</button>
          <button type="button" onClick={() => { setStage("request"); setError(""); }} style={linkStyle}>Utiliser une autre adresse</button>
        </form>}
        {stage === "pending" && <div><h2 style={{ fontSize: 18, margin: "0 0 10px", color: "#8FB4FF" }}>Demande vérifiée</h2><p style={{ margin: 0, fontSize: 13.5, color: "#D5DDEA", lineHeight: 1.6 }}>Merci. Ton adresse e-mail est confirmée. Notre équipe va examiner ta demande et te donnera accès au simulateur.</p></div>}
        {error && <p style={{ fontSize: 12.5, color: "#FF8C8C", margin: "18px 0 0", lineHeight: 1.5 }}>{error}</p>}
        <p style={{ fontSize: 11.5, color: "#AAB7C9", margin: "24px 0 0", lineHeight: 1.5 }}>Vos coordonnées servent uniquement à gérer l’accès et le suivi de votre demande.</p>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: "grid", gap: 7, fontSize: 12, color: "#D5DDEA", fontWeight: 600 }}>{label}{children}</label>;
}

const formStyle = { display: "grid", gap: 15 };
const inputStyle = { width: "100%", boxSizing: "border-box" as const, background: "#263246", border: "1px solid #62738D", borderRadius: 10, padding: "12px 13px", fontSize: 14, color: "#FFFFFF", outline: "none" };
const buttonStyle = { width: "100%", border: "none", borderRadius: 10, cursor: "pointer", padding: "13px 15px", fontSize: 14, fontWeight: 700, color: "#fff", background: "#3E68BE", marginTop: 4 };
const linkStyle = { border: "none", background: "transparent", color: "#91B5FF", padding: "4px", fontSize: 12.5, cursor: "pointer" };

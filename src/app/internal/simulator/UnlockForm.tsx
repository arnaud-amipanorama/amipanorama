"use client";
import { useActionState, useEffect } from "react";
import { unlock, type UnlockState } from "./actions";

export default function UnlockForm() {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlock, null);

  useEffect(() => {
    if (state?.ok) window.location.reload();
  }, [state]);

  return (
    <div style={{
      minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#07090F", color: "#fff", padding: 24,
      fontFamily: "var(--font-manrope, system-ui, sans-serif)",
    }}>
      {/* glow */}
      <div style={{
        position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 500, pointerEvents: "none",
        background: "radial-gradient(ellipse, rgba(75,118,240,0.18) 0%, transparent 65%)",
      }} />
      <div style={{
        position: "relative", width: "100%", maxWidth: 380,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18, padding: "40px 32px", backdropFilter: "blur(12px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: "#3A5FAB",
          boxShadow: "0 0 14px rgba(75,118,240,0.8)", marginBottom: 24,
        }} />
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
          AMI Panorama Financial Simulator
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "8px 0 28px" }}>
          Internal Access Only
        </p>
        <form action={action}>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoFocus
            autoComplete="current-password"
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
              padding: "13px 15px", fontSize: 14, color: "#fff", outline: "none",
              marginBottom: 14,
            }}
          />
          <button
            type="submit"
            disabled={pending}
            style={{
              width: "100%", border: "none", borderRadius: 10, cursor: "pointer",
              padding: "13px 15px", fontSize: 14, fontWeight: 600, color: "#fff",
              background: pending ? "rgba(75,118,240,0.6)" : "#3A5FAB",
              transition: "background 0.2s",
            }}
          >
            {pending ? "Vérification…" : "Unlock"}
          </button>
        </form>
        {state?.error && (
          <p style={{ fontSize: 12.5, color: "#FF6B6B", marginTop: 14, marginBottom: 0 }}>{state.error}</p>
        )}
      </div>
    </div>
  );
}

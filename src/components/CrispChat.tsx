"use client";
import { useEffect } from "react";
import ChatWidget from "./ChatWidget";

// Chat live Crisp — activé dès que NEXT_PUBLIC_CRISP_WEBSITE_ID est défini.
// Tant qu'il ne l'est pas, on garde le widget actuel (capture par email/Notion).
const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

export default function CrispChat() {
  useEffect(() => {
    if (!CRISP_ID || typeof window === "undefined") return;
    const w = window as unknown as { $crisp?: unknown[]; CRISP_WEBSITE_ID?: string };
    if (w.$crisp) return; // déjà chargé
    w.$crisp = [];
    w.CRISP_WEBSITE_ID = CRISP_ID;
    const sc = document.createElement("script");
    sc.src = "https://client.crisp.chat/l.js";
    sc.async = true;
    document.head.appendChild(sc);
  }, []);

  if (!CRISP_ID) return <ChatWidget />;
  return null;
}

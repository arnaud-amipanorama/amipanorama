"use client";
import { useEffect } from "react";
import ChatWidget from "./ChatWidget";
import { crispConfigured, loadCrisp } from "@/lib/crisp";

/**
 * Point d'entrée du chat.
 *
 * Le widget de qualification maison est TOUJOURS affiché : c'est lui qui
 * collecte le lead structuré (profil, besoin, destination, taille) et
 * l'envoie vers Resend / Notion. Crisp, s'il est configuré, est chargé en
 * arrière-plan avec son lanceur masqué et sert d'échappatoire « parler à
 * quelqu'un maintenant » depuis l'intérieur du widget.
 *
 * Conséquence : activer NEXT_PUBLIC_CRISP_WEBSITE_ID n'enlève plus rien.
 */
export default function CrispChat() {
  useEffect(() => {
    if (crispConfigured) loadCrisp();
  }, []);

  return <ChatWidget />;
}

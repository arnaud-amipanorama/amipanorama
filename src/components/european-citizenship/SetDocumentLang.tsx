"use client";

import { useEffect } from "react";

/** Aligne l’attribut lang du document quand on quitte la locale par défaut du site. */
export default function SetDocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = lang;
    return () => {
      root.lang = previous;
    };
  }, [lang]);

  return null;
}

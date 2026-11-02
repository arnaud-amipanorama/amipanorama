"use client";

import { useEffect } from "react";
import { ATTRIBUTION_KEY, attributionFromSearch, hasUtm } from "@/lib/attribution";

/** Mémorise la première source UTM de la visite, sans afficher quoi que ce soit. */
export default function AttributionCapture() {
  useEffect(() => {
    const current = attributionFromSearch(window.location.search, document.referrer);
    let stored: Record<string, string> = {};
    try {
      stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}") as Record<string, string>;
    } catch {
      stored = {};
    }
    const next = { ...stored };
    if (hasUtm(current) || !hasUtm(stored)) {
      for (const [key, value] of Object.entries(current)) {
        if (key !== "referrer" && value) next[key] = value;
      }
    }
    if (!next.referrer && current.referrer) next.referrer = current.referrer;
    if (Object.keys(next).length) sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  }, []);
  return null;
}

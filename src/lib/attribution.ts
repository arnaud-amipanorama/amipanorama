/** Première source de visite (UTM, LinkedIn, referrer), conservée le temps de la session. */
export const ATTRIBUTION_KEY = "ami_attribution";

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
};

const FIELDS: [keyof Attribution, string][] = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmContent", "utm_content"],
  ["utmTerm", "utm_term"],
];

function clean(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 180) : undefined;
}

export function attributionFromSearch(search: string, referrer = ""): Attribution {
  const params = new URLSearchParams(search);
  const result: Attribution = {};
  for (const [key, param] of FIELDS) {
    const value = clean(params.get(param));
    if (value) result[key] = value;
  }
  const ref = clean(referrer);
  if (ref) result.referrer = ref;
  return result;
}

export function hasUtm(value: Attribution): boolean {
  return FIELDS.some(([key]) => Boolean(value[key]));
}

/** À appeler dans le navigateur, au moment d’envoyer un formulaire. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const current = attributionFromSearch(window.location.search, document.referrer);
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}") as Attribution;
  } catch {
    stored = {};
  }
  const merged: Attribution = { ...stored };
  if (hasUtm(current) || !hasUtm(stored)) {
    for (const [key] of FIELDS) {
      if (current[key]) merged[key] = current[key];
    }
  }
  if (!merged.referrer && current.referrer) merged.referrer = current.referrer;
  return merged;
}

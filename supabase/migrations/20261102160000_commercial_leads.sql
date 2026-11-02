-- Leads commerciaux du site (questionnaires Global Weeks, simulateur, contact).
-- À appliquer plus tard, une migration à la fois, après validation.
-- Ne pas lancer `supabase db push` depuis cette branche.
--
-- Cette table ne contient pas de données finance.
-- L’accès applicatif est réservé aux rôles commerciaux déjà présents
-- dans public.user_roles : SUPER_ADMIN, DIRECTION, OPERATIONS.
-- Le module aurum (finance) n’est pas un droit d’accès à ces lignes.
-- RLS est activée et aucune policy n’est créée : le Data API public
-- (anon, authenticated) ne peut ni lire ni écrire. Le site serveur
-- utilise la service role, après le contrôle de rôle.

create table public.commercial_leads (
  id uuid primary key,
  received_at timestamptz not null default now(),
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text,
  role text,
  etablissement text,
  opco text,
  entreprise text,
  statut_alternant text,
  destination text,
  session_souhaitee text,
  profil text,
  objet text,
  source text,
  page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  message text,
  lead_status text not null default 'nouveau',
  rgpd boolean not null default false,
  raw jsonb not null default '{}'::jsonb,
  constraint commercial_leads_status_check check (
    lead_status in ('nouveau', 'a_contacter', 'en_cours', 'relance', 'inscrit', 'clos')
  ),
  constraint commercial_leads_role_check check (
    role is null or role in ('alternant', 'referent', 'etudiant', 'autre')
  )
);

comment on table public.commercial_leads is
  'Leads commerciaux du site public. Pas de données finance. Accès staff : SUPER_ADMIN, DIRECTION, OPERATIONS.';

create index commercial_leads_received_at_idx on public.commercial_leads (received_at desc);
create index commercial_leads_email_idx on public.commercial_leads (lower(email));
create index commercial_leads_status_idx on public.commercial_leads (lead_status);

alter table public.commercial_leads enable row level security;

revoke all on table public.commercial_leads from anon, authenticated;

# Espace connecté AMI Panorama — proposition d’architecture

Document de conception uniquement. Aucune migration n’est appliquée, aucun secret n’est posé, ni Supabase ni Vercel ne sont modifiés par ce travail.

Lecture des constats :

- **FAIT** : vu dans le code, l’historique Git ou le texte d’une pull request de ce dépôt.
- **DÉDUCTION** : conclusion tirée de ces faits, sans autre source.
- **HYPOTHÈSE** : non vérifié. Le dépôt `nexus-os` n’est pas lisible depuis cet environnement, et la base de production n’a pas été interrogée.

Périmètre lu : branche `main` au commit `a217cb3` (2 novembre 2026), plus les branches ouvertes `grok/simulateur-secret` (PR #2) et `grok/global-weeks-polish` (PR #10). Ces deux PR ne sont pas dans `main`.

---

## 1. Besoin

Sur amipanorama.com, un lien discret (« Espace » ou « Se connecter ») ouvre une session, puis envoie la personne au bon endroit.

1. Équipe `@amipanorama.com` : Nexus, avec une vue selon le rôle. La finance est réservée à Arnaud, Georges, Sam et Shade. Marine, Léa, Nathan, Julian, Thomas et Mateo ne voient que la logistique et le non sensible. Le contrôle est côté serveur.
2. Référents mobilité des écoles et CFA : uniquement leurs données. Simulations passées (groupe et individuel), départs (groupes, dates, destinations) et simulations liées, infos pratiques (logistique, billets, à savoir), documents (plan de semaine, programme, kit, e-mails pré-écrits). Le simulateur de groupe, aujourd’hui derrière une demande d’accès, passe à terme par ce login.

Les noms de personnes ci-dessus viennent du besoin. Ils n’apparaissent pas dans le code (**HYPOTHÈSE** qu’ils correspondent à des comptes Nexus).

---

## 2. État des lieux

### 2.1 Deux produits, un seul dépôt visible

**FAIT.** Ce dépôt (`arnaud-amipanorama/amipanorama`, `package.json` nomme l’app `site`) est un Next.js 16.2.4, App Router, un seul paquet. Il n’y a pas de `vercel.json`, pas de monorepo, pas de dossier Nexus, pas de `middleware.ts`.

**FAIT.** La PR #2 décrit Nexus comme un autre dépôt, `arnaud-amipanorama/nexus-os`, et renvoie à sa PR #1. Ce dépôt n’est pas accessible avec le jeton de cette session (dépôt introuvable ou privé hors du jeton). Aucun fichier de rôles, d’écoles, de groupes ou de Drive n’y a donc été lu.

**FAIT.** Le site parle à un projet Supabase dont l’URL est écrite dans `src/lib/simulator-access.ts` : `https://zknulgrqwdnwsqmmqdvt.supabase.co`. Les appels sont des RPC PostgREST (`ami_simulator_request_access`, `ami_simulator_decide_access`, `ami_simulator_verify_access`, `ami_simulator_record_event`), avec la clé publishable committée dans ce fichier. Il n’y a pas de dépendance `@supabase/supabase-js`, ni de session Supabase Auth.

**DÉDUCTION.** Le site public et Nexus partagent cette base au moins pour l’accès au simulateur. Le reste du modèle opérationnel (écoles, groupes, projets, finance) vit dans Nexus, hors de ce dépôt.

**FAIT (texte de PR, pas une config du dépôt).** La PR #10 nomme le projet Vercel `amipanorama` et une preview `amipanorama-git-grok-global-weeks-polish-…vercel.app`. `@vercel/analytics` et `@vercel/speed-insights` sont branchés dans `src/app/layout.tsx`. Cette session n’a pas interrogé l’API Vercel.

### 2.2 Routes du site public

**FAIT.** Pages indexées ou liées : `/`, `/global-weeks`, `/global-weeks/simulateur`, `/citoyennete-europeenne`, `/en/european-citizenship`, `/destinations`, `/notre-programme`, `/a-propos`, `/contact`, `/rendez-vous`, pages légales. `src/app/sitemap.ts` et `src/app/robots.ts`.

**FAIT.** `/services` redirige vers `/notre-programme` (commentaire du sitemap). `/internal/` est en `disallow` dans `robots.ts` et porte `robots: noindex` via `src/app/internal/layout.tsx`. Le layout interne n’ajoute aucune authentification : il rend les enfants tels quels.

**FAIT.** La navigation (`src/components/Navbar.tsx`, `src/components/Footer.tsx`) n’a pas de lien « Se connecter » ni « Espace ». Les appels à l’action sont Global Weeks, le simulateur public et la prise de rendez-vous.

Routes utiles :

| Chemin | Rôle actuel | Accès |
| --- | --- | --- |
| `/global-weeks/simulateur` | Estimation individuelle ou de groupe, simplifiée | Public, indexé |
| `/internal/simulator` | Simulateur de groupe guidé et expert | Cookie `ami_simulator_access` |
| `/global-weeks/documents` | Kit PDF, flyer PDF, PowerPoint | Public, sans login |
| `/api/lead` | Contact, chat, Global Weeks, vérification guidée | Public |
| `/api/simulation` | Trace d’une simulation de groupe | Cookie simulateur |
| `/api/simulator-access/*` | Demande, code, approbation | Public |

**FAIT (branche non mergée).** La PR #10 ajoute `/internal/leads` (liste et fiche CRM). Absent de `main`.

### 2.3 Authentification réelle

Il n’y a pas aujourd’hui un fournisseur d’identité unique. Il y a des cookies signés maison, et un flux e-mail.

**FAIT.** Historique : le commit `036b222` protégeait `/internal/simulator` par un champ mot de passe comparé à `SIMULATOR_PASSWORD`. Le commit `50def55` a remplacé cet écran par « Demander l’accès ».

**FAIT.** Sur `main`, `SIMULATOR_PASSWORD` n’est plus un mot de passe saisi. `src/lib/simulator-access.ts` s’en sert comme clé HMAC du cookie `ami_simulator_access` (e-mail, horodatage, signature). Durée 2 heures. Cookie `httpOnly`, `sameSite=lax`, `secure`, `path=/`. Le commentaire de `.env.local.example` dit encore « mot de passe d’accès à l’outil interne » : le nom a survécu, l’écran non.

**FAIT.** Parcours externe (`src/app/internal/simulator/UnlockForm.tsx` et `src/app/api/simulator-access/`) :

1. Formulaire nom, établissement, e-mail, téléphone. Champ honeypot `company`.
2. Le serveur hash un code à 6 chiffres et un jeton d’approbation (SHA-256), puis appelle `ami_simulator_request_access`.
3. Un e-mail Brevo envoie le code (`src/lib/transactional-email.ts`, `BREVO_API_KEY`). Le texte dit que le code vaut 15 minutes : cette durée n’est pas appliquée dans le site, seulement annoncée. Elle est donc portée par la fonction SQL, qui n’est pas dans ce dépôt (**DÉDUCTION**).
4. Si le statut renvoyé est `pending`, un second e-mail part vers `LEAD_NOTIFICATION_TO` avec deux liens GET : approuver ou refuser (`/api/simulator-access/decision?token=…`).
5. Après code valide et `granted`, le cookie est posé.

**FAIT.** Une adresse `@amipanorama.com` (`isAmiEmail`) dont la RPC renvoie `approved` reçoit le cookie tout de suite, sans code et sans regarder `user_roles`. Le domaine de l’e-mail suffit.

**FAIT.** Aucun Google OAuth, aucun magic link Supabase, aucun contrôle `hd` Workspace. Le rendez-vous utilise un lien public Google Calendar (`NEXT_PUBLIC_BOOKING_URL`), ce n’est pas de l’auth.

**DÉDUCTION.** Un lien d’approbation en GET peut être consommé par un antivirus ou un aperçu de messagerie avant qu’un humain ne clique. Le site présente le jeton comme à usage unique, sans le garantir lui-même.

**FAIT (PR #2, non mergée).** La branche envoie un `p_broker_secret` (`SIMULATOR_BROKER_SECRET`) aux RPC, partagé avec un script Nexus `supabase/scripts/poser_secret_simulateur.sql`. Si la base ignore encore ce paramètre, l’appel retombe sur l’ancienne signature. Dès que la nouvelle répond, plus de cookie immédiat, y compris pour `@amipanorama.com` : ces adresses reçoivent un code. Le cookie de cette branche est limité à `path=/internal`. Les migrations citées sont `20261025100000` à `20261025103000` dans Nexus, pas ici. `main` n’envoie pas ce secret.

**FAIT (PR #10, non mergée).** `/internal/leads` ne crée pas de session Supabase Auth. La personne saisit un e-mail. Le serveur, avec `SUPABASE_SERVICE_ROLE_KEY`, lit `public.users` (`email`, `is_active`) et `public.user_roles` via la clé étrangère `user_roles_user_id_fkey` (une seconde clé `created_by` pointe aussi vers `users`, d’où le hint). Rôles acceptés : `SUPER_ADMIN`, `DIRECTION`, `OPERATIONS`. Cookie `ami_leads_staff`, 8 heures, HMAC de l’e-mail, signé par `LEADS_ADMIN_SECRET` ou, à défaut, `SIMULATOR_PASSWORD`. Le commentaire dit que le module `aurum` et le cookie du simulateur n’ouvrent pas cette page. Chaque page revérifie le rôle.

**DÉDUCTION.** Trois mécanismes coexistent ou sont proposés, sans compte unique : cookie simulateur (prod du site), secret courtier (PR #2), cookie staff leads (PR #10). Un espace connecté qui en ajouterait un quatrième augmenterait la surface.

### 2.4 Rôles

**FAIT.** Dans le code de ce dépôt, les seuls noms de rôles écrits sont `SUPER_ADMIN`, `DIRECTION`, `OPERATIONS`, et seulement sur la branche de la PR #10. Le mot `member` n’apparaît pas. Le module finance est nommé `aurum` dans des commentaires de cette même branche, jamais implémenté ici.

**FAIT.** Le contrôle des leads est applicatif et passe par la service role, qui contourne le RLS. La sécurité tient à ce que chaque page rappelle `commercialRoleFor`. Il n’y a pas de policy RLS lisible dans ce dépôt pour `users` ou `user_roles`.

**HYPOTHÈSE.** Nexus possède d’autres rôles (`member`) et un découpage de modules plus fin que ces trois noms. À confirmer dans le dépôt Nexus, pas à deviner.

**FAIT.** Rien dans le code ne relie Arnaud, Georges, Sam ou Shade à `aurum`, ni les six autres personnes à un rôle logistique. Un rôle `DIRECTION` ou `OPERATIONS` ne suffit pas à exprimer la règle finance demandée : elle est nominative, et `DIRECTION` est déjà réutilisé pour le CRM commercial.

### 2.5 Tables et données utiles

Ce dépôt ne contient pas le schéma Nexus. Inventaire de ce qui est prouvé.

| Objet | Statut |
| --- | --- |
| `public.users` (`email`, `is_active`) et `public.user_roles` (`role`, `user_id`, `created_by`) | **FAIT** d’intention : la PR #10 les interroge. Présence réelle en base non revérifiée ici (**HYPOTHÈSE** qu’elles existent, puisque le code a été écrit contre elles). |
| `public.commercial_leads` | **FAIT** : le SQL est dans la PR #10 (`supabase/migrations/20261102160000_commercial_leads.sql`), pas sur `main`. La description de la PR dit la migration appliquée en prod. L’en-tête du fichier dit encore « à appliquer plus tard ». Non revérifié sur la base. Le SQL active le RLS, ne crée aucune policy, et révoque `anon` et `authenticated`. Colonnes : identité, établissement, OPCO, destination, session, UTM, `lead_status`, `raw jsonb`. Pas de montants. |
| RPC `ami_simulator_*` | **FAIT** : appelées par `main`. Corps SQL absent de ce dépôt. |
| Écoles, groupes, projets, documents, Drive | **Absents de ce dépôt.** Aucun client Drive, aucune table de ce nom. **HYPOTHÈSE** : ces objets sont dans Nexus, sous des noms à lire avant d’écrire une clé étrangère. |
| Simulations rejouables | **FAIT** : pas de table `simulations` ici, et aucune route ne relit un historique. |

### 2.6 Ce qui est stocké pour une simulation

Deux simulateurs.

**FAIT.** Le simulateur public (`/global-weeks/simulateur`) calcule dans le navigateur via `estimatePublicMobility` (`src/lib/global-weeks/public-estimate.ts`), qui réutilise le moteur guidé. L’enregistrement passe par `/api/lead` (e-mail Brevo, Notion si `NOTION_TOKEN` et `NOTION_LEADS_DB`, webhook optionnel). `src/lib/lead-store.ts` sur `main` écrit un fichier local seulement si `LEAD_LOCAL_STORE` est défini, et dit explicitement qu’il n’y a pas d’écriture Supabase. Le visiteur ne peut pas rouvrir une estimation.

**FAIT.** Le simulateur de groupe (`/internal/simulator`) a deux modes, guidé et expert (`SimulatorShell`). Le brouillon guidé est dans `localStorage` (`ami_simulator_guided_v1`). Les coordonnées du formulaire guidé sont en mémoire seulement (`guided/contact.ts` : « jamais dans localStorage »). Le drapeau d’onboarding est aussi en `localStorage`.

**FAIT.** Au PDF ou à la demande de vérification, le client POST `/api/simulation` avec l’objet complet : établissement, référent, e-mail, destination, effectifs, reste à charge, financements, montant conservé par l’école, coût du séjour, détail par OPCO (`SimulatorApp.buildPdfData`). La route :

- exige le cookie ;
- écrit le JSON dans les logs (`console.log`, donc logs Vercel) ;
- POST le même JSON vers `SIMULATION_WEBHOOK_URL` s’il est défini ;
- appelle `ami_simulator_record_event` avec l’e-mail du cookie et le payload ;
- ne bloque pas le PDF si cette trace échoue ;
- laisse un `TODO S5` : Notion « Simulations » et deal HubSpot, non fait.

**DÉDUCTION.** On ne peut pas aujourd’hui « revoir ses simulations » dans un espace. Au mieux, des traces existent dans les logs, un webhook, et une fonction SQL dont ce site ne fait jamais le `select`. Les rattacher plus tard à un compte suppose de savoir ce que `ami_simulator_record_event` persiste (payload complet ou simple journal).

**FAIT (PR #10).** Cette branche ajoute une copie commerciale sans montants vers `commercial_leads` pour le mode expert. Le guidé continue d’envoyer un lead texte via `/api/lead`, et le message de vérification contient le reste à payer estimé. Donc le CRM de la PR #10 évite les montants d’un côté, et le lead guidé les remet dans `message`.

### 2.7 Prix, marges, documents

**FAIT.** Les tarifs catalogue (programme et billets par destination) et les barèmes OPCO sont dans `src/lib/simulator/opco-config.ts`, importé par le simulateur public. Exemple : Montréal programme 1 059 € et billets 650 €, base programme 989 €. Ce sont des prix de simulation affichés aux référents et, en version simplifiée, au public. Le fichier ne contient pas de prix d’achat fournisseur ni de marge.

**FAIT.** Le montant « conservé par l’école » (`keptTotal`, `schoolImpact`) est calculé et affiché dans le simulateur de groupe, puis envoyé à `/api/simulation`. Ce n’est pas une marge AMI. C’est le forfait référent que l’établissement garde.

**HYPOTHÈSE.** Prix fournisseurs, marges et notes internes sont dans Nexus (`aurum` ou équivalent). Ils ne fuient pas par ce dépôt, sauf s’ils étaient collés dans un payload de simulation : le payload actuel ne les a pas.

**FAIT.** Documents livrés par le site, sans auth :

- `content/global-weeks/kit-referent.pdf` et `flyer-referent.pdf`, téléchargés par `/global-weeks/documents` ;
- un PowerPoint hors Git, via `GLOBAL_WEEKS_KIT_PPTX_URL` (le commentaire d’exemple parle d’un objet Vercel Blob) ;
- un PDF de kit personnalisé (nom, établissement, employeur, OPCO) généré à la volée par `pdf-lib`.

**FAIT.** Pas de plan de semaine par départ, pas de billets nominatifs, pas d’e-mails pré-écrits par destination, pas de lien Drive. Le kit Montréal « école » décrit dans le besoin n’existe pas comme objet rattaché à un établissement.

### 2.8 RGPD déjà écrit

**FAIT.** `src/app/politique-de-confidentialite/page.tsx` : responsable AMI PANORAMA, Strasbourg. Données de contact, et pour Global Weeks le statut, l’employeur, l’OPCO et le résultat d’estimation. Conservation : prospection 3 ans, contrat 10 ans, navigation 13 mois. Destinataires internes et sous-traitants non nommés. Dernière mise à jour affichée : janvier 2025. La politique ne décrit ni l’espace connecté, ni Supabase, ni les RPC d’accès, ni un portail école. Les cookies d’accès simulateur ne sont pas nommés dans `politique-cookies`.

---

## 3. Architecture cible

### 3.1 Principe

Un seul fournisseur d’identité : **Supabase Auth** sur le projet déjà utilisé par le site et par Nexus. Deux moyens d’entrer, une seule session :

- équipe : Google, limité au Workspace `@amipanorama.com` ;
- écoles : pas de compte public. Invitation, puis magic link (ou code à usage unique) vers l’e-mail invité.

Le site marketing reste anonyme. Le lien « Espace » est dans le pied de page, pas dans la barre principale.

Après connexion, un seul résolveur serveur décide :

| Qui | Où |
| --- | --- |
| Compte staff actif, e-mail du Workspace, au moins un rôle Nexus | Nexus, vue selon les capacités |
| Compte école, adhésion non révoquée | Portail de ses établissements |
| Les deux (cas rare, un salarié qui serait aussi référent) | Choix explicite, jamais un mélange des données |
| Ni l’un ni l’autre | Page « aucun accès », sans liste d’écoles ni d’outils |

Le domaine de l’e-mail ne donne plus le cookie. `@amipanorama.com` sans ligne staff active ne passe pas. Un Gmail invité par une école ne voit pas Nexus.

### 3.2 Trois options de découpage, et le choix

**Option A — retenue.** Le login et le portail école vivent dans ce site Next (`/espace`). Nexus reste l’outil interne. Les deux apps lisent la même session Supabase. Le portail ne réimplémente pas la logistique : il lit des vues « école » fournies par la base.

**Option B — écartée pour le portail.** Faire entrer les écoles dans Nexus avec un rôle `member` restreint. Nexus concentre déjà la finance. Un oubli de filtre y est plus grave, et l’expérience référent (documents, simulations, ton du site) est déjà du côté marketing.

**Option C — plus tard, pas pour le MVP.** Une troisième app sur `espace.amipanorama.com`. Cookie parent plus propre si Nexus est sur un autre hôte, mais un troisième dépôt à tenir. À rouvrir seulement si l’URL réelle de Nexus empêche de partager le cookie.

**DÉDUCTION.** Tant que l’URL de Nexus n’est pas connue, le MVP peut être un chemin `/espace` sur amipanorama.com, puis une redirection vers Nexus pour le staff. Si Nexus n’est pas sous `*.amipanorama.com`, la session Supabase ne traversera pas toute seule : il faudra soit un domaine parent commun, soit un échange de code à usage unique entre les deux apps. C’est le point 1 des questions.

### 3.3 Comptes, écoles, groupes

Modèle cible, indépendant des noms de tables Nexus encore inconnus. Les clés étrangères vers les groupes et les projets Nexus se branchent quand le schéma est lu. En attendant, les identifiants Nexus sont des UUID opaques (`nexus_group_id`), pas des copies des données.

- `auth.users` : identité (Supabase Auth).
- Profil staff : la table `public.users` déjà visée par la PR #10, reliée à `auth.users.id` si ce n’est pas déjà le cas. Rôles inchangés dans `user_roles` pour ne pas casser Nexus.
- Capacité finance, séparée du rôle : `finance` n’est pas déduite de `SUPER_ADMIN`, `DIRECTION` ou `OPERATIONS`. Elle est une attribution explicite. Première liste, à valider : Arnaud, Georges, Sam, Shade. Les six autres personnes reçoivent `logistics` (départs, listes, documents opérationnels) et rien d’autre. Pas de finance par défaut.
- `schools` : établissement partenaire. Si Nexus a déjà cette entité, on n’en crée pas une seconde : on ajoute seulement la visibilité portail. **HYPOTHÈSE** qu’elle existe.
- `school_memberships` : `user_id`, `school_id`, rôle portail `referent` ou `lecteur`, `revoked_at`. Un référent peut couvrir plusieurs établissements (question 4). Aucune adhésion implicite parce que l’e-mail « ressemble » au domaine de l’école.
- `school_invitations` : e-mail, école, rôle, hash du jeton, expiration, invitation, acceptation, révocation. Le jeton en clair ne voyage qu’une fois, dans l’e-mail.
- Rattachement groupe : un départ Nexus visible d’une école passe par une table de liaison `school_id` + identifiant de groupe Nexus. Un groupe Global Weeks multi-écoles a plusieurs lignes. Chaque école ne voit que ses participants.

Règle d’isolation : toute lecture école filtre `school_id` par les adhésions du `auth.uid()`. Jamais par un paramètre d’URL seul. Un identifiant deviné renvoie 404, pas 403, pour ne pas confirmer qu’un départ existe.

### 3.4 Ce que l’école voit, et ce qui reste interne

Visible côté école, en lecture au début :

- ses simulations enregistrées après le login (groupe et, quand elles existent, individuelles rattachées à l’établissement) : hypothèses, barèmes OPCO déjà montrés par le simulateur, reste à charge, forfait référent conservé ;
- ses départs : nom du groupe, dates, destination, effectif de son établissement, statut opérationnel simple ;
- le pratique : horaires, lieu de rendez-vous, hébergement, consignes, billets de ses participants ;
- les documents marqués `school` ou `public` : plan de semaine, programme pédagogique, kit de la destination, modèles d’e-mails.

Strictement interne, absent des vues, des JSON et des URL signées du portail :

- module finance `aurum` : marges, prix d’achat, factures fournisseurs, trésorerie ;
- notes internes, fils commerciaux des autres écoles, `commercial_leads` des autres demandes ;
- participants des autres établissements d’un même groupe multi-écoles ;
- service role, secrets courtier, cookies staff.

Le forfait référent et les tarifs catalogue sont déjà montrés au référent dans le simulateur. Les garder dans le portail est cohérent. Les prix d’achat ne le sont pas : ils n’entrent pas dans le payload école, même en colonne masquée par le CSS.

Les documents publics actuels (kit et flyer Global Weeks) peuvent rester publics. Tout document de départ (billets, rooming, plan nominatif) est privé, URL signée de courte durée, après contrôle d’adhésion. On ne partage pas le Drive interne tel quel : un fichier école est copié ou référencé dans un bucket dont la policy reprend la même adhésion. Le Drive, s’il est la source opérationnelle (**HYPOTHÈSE**), reste l’atelier interne. Le portail ne liste pas un dossier Drive.

### 3.5 Routage après connexion

```text
Pied de page « Espace »
        │
        ▼
/espace/connexion
   Google (staff)  ou  magic link (invitation école)
        │
        ▼
Résolveur serveur (session Supabase, pas le domaine seul)
        ├─ staff ──────────► Nexus (URL à confirmer)
        ├─ école ──────────► /espace  (départs, documents)
        ├─ les deux ───────► /espace/choisir
        └─ rien ───────────► /espace/aucun-acces
```

Le simulateur de groupe reste à `/internal/simulator` pendant les phases 1 et 2. En phase 3, il exige la session école (ou staff) et cesse d’émettre `ami_simulator_access`. Le simulateur public individuel reste ouvert : c’est un outil d’acquisition, pas le dossier de l’établissement. Une estimation publique ne devient une simulation « de l’école » que si un référent connecté l’enregistre, ou si l’équipe la rattache.

### 3.6 Lien avec les PR ouvertes

- PR #2 : le secret courtier reste utile tant que les RPC `ami_simulator_*` sont appelées avec la clé publishable. Le futur login ne le remplace pas tant que ces fonctions existent. Ne pas merger cette PR dans la foulée de l’espace sans reprendre l’ordre qu’elle décrit (secret Vercel, déploiement, puis migrations Nexus).
- PR #10 : le cookie `ami_leads_staff` est un palliatif. Quand la session Supabase staff existe, `/internal/leads` doit l’utiliser et abandonner l’e-mail saisi à la main. D’ici là, ne pas élargir `DIRECTION` pour y faire passer la finance.

---

## 4. Sécurité et RGPD

### 4.1 Pas de fuite entre écoles

- RLS activé sur chaque table du portail. `anon` n’a aucun droit. `authenticated` ne lit une ligne que si `school_id` est dans ses adhésions actives.
- Les vues école sont des vues SQL, pas un filtre React. Elles n’ont pas les colonnes finance.
- Le navigateur n’a que la clé publishable. La service role reste serveur, et seulement pour les opérations qui ne peuvent pas passer par le RLS (invitation, journal technique). Le portail école n’appelle pas la service role pour « filtrer ensuite ».
- Les groupes multi-écoles sont le cas qui casse un filtre naïf « ce groupe est à moi, donc tous ses passagers ». La liaison est école + groupe + participant.
- Les logs applicatifs ne recopient plus le JSON complet de simulation (aujourd’hui `console.log` de tout le payload). On logue un identifiant.
- Les liens d’approbation GET du simulateur actuel ne sont pas réutilisés pour les invitations. Une acceptation est un POST authentifié, ou un magic link Supabase à usage unique.

### 4.2 Finance, côté serveur

Le masquage d’un menu ne compte pas. Chaque requête Nexus qui touche une table finance appelle une fonction du type `app_can(auth.uid(), 'finance')`, utilisée aussi dans le RLS. Défaut : refus. `SUPER_ADMIN` ne reçoit pas la finance tout seul, sauf décision explicite d’Arnaud (question 6). Les personnes logistique gardent `OPERATIONS` ou l’équivalent Nexus pour les départs, sans policy sur les tables `aurum`.

Une revue de cette règle se fait dans le dépôt Nexus. Ce site ne peut pas la garantir seul : **FAIT**, le code finance n’est pas ici.

### 4.3 Journal, invitation, révocation

- Journal `access_events` : qui, quand, quelle action (`login`, `view_departure`, `download`, `invite`, `revoke`), quel objet, hash d’IP plutôt que l’IP en clair. Rétention proposée : 12 mois, puis agrégat ou suppression. Lecture réservée au staff habilité, pas aux écoles.
- Invitation : expiration courte (7 jours, à confirmer), un seul usage, révocable avant acceptation. Relance = nouvelle invitation, pas un rallongement silencieux.
- Révocation : `revoked_at` sur l’adhésion. La session suivante n’a plus l’école. Les refresh tokens de cet utilisateur pour cet usage sont révoqués. Les URL signées de documents expirent en minutes, pas en jours.
- Départ d’un salarié AMI : désactivation dans `public.users` (`is_active`) et ban Auth. Le domaine Google ne suffit plus.
- Changement d’adresse d’un référent : nouvelle invitation. On ne « déplace » pas un compte en changeant l’e-mail sans preuve.

### 4.4 RGPD

Responsable du traitement affiché aujourd’hui : AMI PANORAMA. Le portail ajoute des données de référents (compte, journal de connexion) et, dans les documents de départ, des données de participants transmises par l’école.

- Base légale proposée : exécution du contrat avec l’établissement pour le dossier de départ et les documents ; intérêt légitime ou mesures précontractuelles pour les simulations demandées par le référent ; obligation légale pour les pièces comptables internes, qui ne sortent pas du portail.
- Les participants ne sont pas des utilisateurs du portail dans ce dessin. Leurs billets et listes sont montrés au référent de leur seul établissement. Question juridique à trancher : information des participants, et qui est responsable de cette transmission (question 8).
- Durées : reprendre 3 ans (prospection, invitations non abouties, simulations non suivies d’un départ) et 10 ans (pièces liées à un contrat exécuté). Le dire dans la politique, qui date de janvier 2025 et ne mentionne pas ce flux.
- Sous-traitants à nommer lors de la mise à jour : Supabase (auth et base), Vercel (hébergement et logs), Brevo (e-mails transactionnels, déjà utilisé), Google (identité Workspace). Notion et le webhook restent des canaux leads, pas le portail.
- Droits : accès, rectification, effacement, opposition, portabilité, via info@amipanorama.com, comme aujourd’hui. L’effacement d’un compte école retire l’adhésion et les simulations non contractuelles. Il ne détruit pas la comptabilité interne ni le dossier d’un départ déjà réalisé, conservé sur la base contrat.
- Minimisation : le portail ne reçoit pas le `raw` des leads commerciaux ni les UTM des autres prospects.
- Transferts : le vérifier au moment du choix de région Supabase. Non lu ici.

---

## 5. Plan par phases

Le MVP est la phase 1. Les phases 2 et 3 ne commencent pas tant que les questions 1, 2 et 6 n’ont pas de réponse, et tant que le schéma Nexus des groupes n’a pas été lu.

Ampleur : surfaces touchées, pas un délai calendaire. Aucune de ces migrations n’est à lancer depuis cette branche.

### Phase 1 — MVP : entrer, et arriver dans Nexus

But : le lien « Espace » connecte l’équipe avec Google, puis ouvre Nexus. Le contrôle finance existe côté serveur dans Nexus, pas seulement dans un menu. Les écoles ne sont pas encore là. Le simulateur de groupe ne change pas.

Surfaces :

- ce site : lien discret, page `/espace/connexion`, callback, résolveur staff, redirection ;
- Supabase Auth : fournisseur Google, inscriptions publiques fermées ;
- Nexus : capacité `finance` et refus par défaut sur les requêtes finance. C’est le gros du risque, et ce code n’est pas dans ce dépôt.

Migrations à écrire plus tard, une par une, après lecture du schéma réel :

1. `…_staff_auth_link` — relier `public.users` à `auth.users` si le lien n’existe pas. Ne pas recréer `users` ni `user_roles`.
2. `…_staff_capabilities` — table d’attributions `finance` et `logistics`, avec RLS, sans policy pour `anon`. Les quatre e-mails finance n’y sont insérés qu’après validation d’Arnaud, dans un script séparé, pas dans la migration de structure.

Variables : identifiants OAuth Google (console Google et fournisseur Supabase, pas dans Git) ; `NEXT_PUBLIC_SUPABASE_URL` ; clé publishable sous un nom de variable plutôt que committée ; `NEXUS_APP_URL`. Ne pas ajouter la service role sur le site pour cette phase.

Risques : le Workspace refuse le `hd` ; `public.users` n’a pas la forme supposée par la PR #10 ; Nexus est sur un hôte qui ne partage pas le cookie ; un `SUPER_ADMIN` historique voit encore la finance parce que l’ancien code ne consulte pas la nouvelle capacité. Parade : test de non-régression avec un compte logistique réel avant d’annoncer le lien.

Critère de fini : un compte `@amipanorama.com` actif ouvre Nexus ; un compte du même domaine sans fiche active n’ouvre rien ; un compte hors liste finance reçoit un refus serveur sur une route finance, même en appelant l’URL ; un compte logistique ouvre la partie départs.

### Phase 2 — Portail école en lecture

But : un référent invité voit ses départs et les documents marqués école. Pas d’édition, pas d’historique de simulations.

Surfaces : tables d’invitation et d’adhésion, vues SQL branchées sur les groupes Nexus, pages `/espace` (liste, fiche départ, téléchargements), e-mails Brevo ou modèle Supabase, mise à jour de la politique de confidentialité.

Migrations, dans l’ordre, chacune revue seule :

3. `…_schools_portal` — établissements portail, ou colonnes de visibilité sur la table Nexus existante. Pas de doublon si la table existe.
4. `…_school_memberships` — adhésions et invitations, RLS.
5. `…_departure_visibility` — liaison école ↔ groupe Nexus et drapeau de visibilité des documents. Les colonnes finance ne sont pas dans la vue.
6. `…_access_events` — journal.

Variables : URL du site pour les liens d’invitation (`NEXT_PUBLIC_SITE_URL`, déjà prévue) ; expéditeur Brevo déjà utilisé (`LEAD_CONFIRMATION_FROM`) ou expéditeur dédié. Bucket de fichiers : soit Supabase Storage, soit l’hébergement déjà envisagé pour le PowerPoint. Pas de partage Drive anonyme.

Risques : mauvais rattachement d’un groupe multi-écoles ; document versé avec le drapeau `school` alors qu’il contient une marge ; service role utilisée « pour aller plus vite » dans une route de téléchargement. Parade : jeu d’essai de deux écoles sur un même groupe, et revue de la liste des colonnes de la vue avant la première invitation réelle.

Critère de fini : le référent A ne peut pas ouvrir un départ, un document ou un participant de B, y compris en changeant l’identifiant dans l’URL. La révocation coupe l’accès au prochain chargement.

### Phase 3 — Simulations et kit de communication

But : le référent revoit ses simulations, et trouve le kit (plan, programme, e-mails types, exemple Montréal). Le simulateur de groupe s’ouvre avec la session, plus avec le cookie de 2 heures.

Surfaces : enregistrement serveur d’une simulation rattachée au compte et à l’école ; lecture ; reprise éventuelle des événements `ami_simulator_record_event` si leur payload est exploitable et licite ; retrait du cookie `ami_simulator_access` ; documents de kit versionnés par destination.

Migrations :

7. `…_simulations` — une ligne par simulation enregistrée, auteur, école, kind `groupe` ou `individuel`, entrée et résultat montrables. Pas de colonne prix d’achat.
8. `…_simulator_cookie_retirement` — seulement quand la session suffit. Couper l’approbation par simple domaine. Le secret HMAC peut rester le temps du déploiement, puis être retiré de l’usage.
9. `…_school_documents` — métadonnées des kits et modèles, audience `public` ou `school` ou `internal`.

Variables : aucune nouvelle si Auth et le bucket de la phase 2 sont en place. Retirer ensuite la dépendance fonctionnelle à `SIMULATOR_PASSWORD` comme contrôle d’accès (la clé peut encore signer d’anciens cookies le temps de la bascule). `SIMULATOR_BROKER_SECRET` reste tant que les RPC existent.

Risques : réimporter des payloads historiques qui contiennent des données d’une autre école, ou le reste à charge dans un champ libre ; casser l’accès des référents le jour où le cookie disparaît. Parade : la bascule est un drapeau, les anciens cookies restent valides une fenêtre courte, et l’import historique est un script relu, pas une migration automatique.

Critère de fini : un référent connecté rouvre une simulation que lui-même a enregistrée ; il ne voit pas celles du voisin ; `/internal/simulator` sans session renvoie à `/espace/connexion`.

### Hors de ces phases

Édition des départs par l’école, paiement, signatures, comptes participants, application mobile. Le CRM leads (PR #10) reste un outil staff : il n’est pas le portail.

---

## 6. Esquisses SQL

À ne pas appliquer. Les types et les noms de clés Nexus sont des placeholders. Les policies réelles se réécrivent après avoir lu `nexus-os`. Pas de `supabase db push` depuis la branche de ce document : elle ne contient pas de dossier `supabase/`.

```sql
-- ESQUISSE. Ne pas exécuter.
-- 2. Capacités staff. finance n'est pas un rôle user_roles.

create table public.staff_capabilities (
  user_id uuid not null references public.users (id) on delete cascade,
  capability text not null check (capability in ('finance', 'logistics')),
  granted_by uuid,
  granted_at timestamptz not null default now(),
  primary key (user_id, capability)
);

alter table public.staff_capabilities enable row level security;
revoke all on public.staff_capabilities from anon, authenticated;

-- La colonne public.users.auth_user_id vient de l'esquisse 1
-- (lien vers auth.users). Elle n'est pas dans le code lu.
create or replace function public.app_can(capability text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_capabilities c
    join public.users u on u.id = c.user_id
    where u.auth_user_id = auth.uid()
      and u.is_active
      and c.capability = app_can.capability
  );
$$;
```

```sql
-- ESQUISSE. Ne pas exécuter.
-- 4 et 5. Adhésion école et lecture d'un départ.
-- nexus_group_id sera remplacé par la vraie clé.

create table public.school_memberships (
  user_id uuid not null references auth.users (id) on delete cascade,
  school_id uuid not null,
  portal_role text not null check (portal_role in ('referent', 'lecteur')),
  revoked_at timestamptz,
  primary key (user_id, school_id)
);

alter table public.school_memberships enable row level security;

create table public.school_departure_access (
  school_id uuid not null,
  nexus_group_id uuid not null,
  primary key (school_id, nexus_group_id)
);

alter table public.school_departure_access enable row level security;

-- La vue exposée à l'école ne sélectionne pas les colonnes finance.
-- La policy répète l'adhésion active de auth.uid().
```

```sql
-- ESQUISSE. Ne pas exécuter.
-- 6. Journal. ip_hash, pas l'adresse en clair.

create table public.access_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_id uuid,
  school_id uuid,
  action text not null,
  object_type text,
  object_id uuid
);

alter table public.access_events enable row level security;
revoke all on public.access_events from anon;
```

L’insertion des quatre personnes finance n’est pas dans ces esquisses : elle dépend des UUID réels et de la confirmation d’Arnaud.

---

## 7. Questions pour Arnaud

1. Quelle est l’URL de Nexus en production, et est-elle sous `amipanorama.com` ?
2. Le dépôt `nexus-os` peut-il être ouvert pour caler les vraies tables écoles, groupes, projets et `aurum` avant toute migration ?
3. La migration `commercial_leads` de la PR #10 est-elle bien déjà appliquée en prod, malgré l’en-tête du fichier qui dit le contraire ?
4. Un référent peut-il appartenir à plusieurs établissements, et qui a le droit d’inviter (seulement AMI, ou aussi le référent) ?
5. Les départs Global Weeks multi-écoles doivent-ils masquer les participants des autres établissements ? Proposition : oui.
6. La finance est-elle strictement Arnaud, Georges, Sam et Shade, y compris face à un `SUPER_ADMIN` technique ?
7. Faut-il reprendre l’historique déjà envoyé à `ami_simulator_record_event`, ou seulement les simulations d’après la mise en service ?
8. Qui informe les participants que le référent de leur école verra billets et listes : AMI, l’établissement, ou les deux ?
9. Les kits (plan de semaine, e-mails types, Montréal) sont-ils déjà dans un Drive, et lesquels sont identiques pour toutes les écoles d’une destination ?
10. Le simulateur public individuel doit-il rester sans compte, avec enregistrement dans l’espace seulement si le référent est connecté ?
11. Faut-il fermer les inscriptions Google à l’organisation Workspace uniquement, et refuser les comptes Gmail personnels même invités comme staff ?
12. La PR #2 (secret courtier) et la PR #10 (leads) doivent-elles être mergées, tenues, ou reprises par l’espace avant la phase 1 ?

---

## 8. Sources

- `main` @ `a217cb3` : `src/lib/simulator-access.ts`, `src/app/api/simulator-access/`, `src/app/api/simulation/route.ts`, `src/app/internal/simulator/`, `src/lib/simulator/opco-config.ts`, `src/lib/global-weeks/public-path.ts`, `src/app/global-weeks/documents/route.ts`, `src/app/api/lead/route.ts`, `src/lib/lead-store.ts`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/app/robots.ts`, `.env.local.example`, `package.json`.
- Commit `036b222` : mot de passe partagé. Commit `50def55` : demande d’accès par e-mail.
- PR #2 `grok/simulateur-secret` : secret courtier Nexus, migrations `20261025100000`–`20261025103000` citées, non présentes ici.
- PR #10 `grok/global-weeks-polish` : `src/lib/leads-access.ts`, `supabase/migrations/20261102160000_commercial_leads.sql`, rôles et module `aurum` dans les commentaires.
- Non lu : code de `arnaud-amipanorama/nexus-os`, contenu réel de la base `zknulgrqwdnwsqmmqdvt`, réglages du projet Vercel.

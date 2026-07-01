#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  AMI Panorama — optimisation des photos pour le web
#  À lancer UNE FOIS en local (macOS) depuis le dossier "site/" :
#       bash scripts/optimize-photos.sh
#
#  Utilise `sips` (intégré à macOS) : convertit HEIC/PNG/JPG → JPEG,
#  redimensionne (max 1600 px), range avec des noms propres dans :
#     public/Assets/groups/   (photos de groupes → défilé + destinations)
#     public/Assets/program/  (visites pro → page Notre programme)
#
#  Idempotent : relançable sans risque (écrase les sorties).
# ─────────────────────────────────────────────────────────────────────────────
set -u
SRC="public/Assets/Belles photos groupes"
G="public/Assets/groups"
P="public/Assets/program"
Q=82; MAX=1600

if ! command -v sips >/dev/null 2>&1; then
  echo "❌ 'sips' introuvable (ce script nécessite macOS)."; exit 1
fi
if [ ! -d "$SRC" ]; then
  echo "❌ Dossier source introuvable : $SRC"
  echo "   Lance ce script depuis le dossier 'site/'."; exit 1
fi
mkdir -p "$G" "$P"

echo "▶︎ Image hero (V2, Giralda ciel bleu) → public/Assets/Hero/sevilla-hero-v2.jpg"
sips -s format jpeg -s formatOptions 90 -Z 2400 "public/Assets/Hero/HERO V2 - Seville blue sky .png" --out "public/Assets/Hero/sevilla-hero-v2.jpg" >/dev/null 2>&1 \
  && echo "  ✅ sevilla-hero-v2.jpg" || echo "  ❌ hero v2 (source manquante ?)"

ok=0; miss=0
conv() { # $1 = chemin source (relatif à $SRC)  $2 = chemin sortie complet
  local s="$SRC/$1" o="$2"
  if [ ! -f "$s" ]; then echo "  ⚠️  manquant : $1"; miss=$((miss+1)); return; fi
  if sips -s format jpeg -s formatOptions "$Q" -Z "$MAX" "$s" --out "$o" >/dev/null 2>&1; then
    echo "  ✅ $(basename "$o")"; ok=$((ok+1))
  else
    echo "  ❌ échec : $1"; miss=$((miss+1))
  fi
}

echo "▶︎ Photos de groupes → $G"
# Montréal
conv "Montreal/Montreal group.jpg"               "$G/montreal-group.jpg"
conv "Montreal/Montreal group diploma .HEIC"      "$G/montreal-diploma.jpg"
conv "Montreal/Montreal group diner.HEIC"         "$G/montreal-diner.jpg"
# Londres
conv "London/London group.jpg"                    "$G/london-group.jpg"
conv "London/london group museum.jpg"             "$G/london-museum.jpg"
conv "London/london group picture bridge.jpg"     "$G/london-bridge.jpg"
# Malte
conv "Malta/MALTA MAIN .png"                       "$G/malta-main.jpg"
conv "Malta/Malta group .jpg"                      "$G/malta-group.jpg"
conv "Malta/Malta Students.png"                    "$G/malta-students.jpg"
# New York
conv "NY/Group NY aberrant. Magnifique photo .png" "$G/newyork-group.jpg"
conv "NY/NY Group .HEIC"                           "$G/newyork-students.jpg"
# Rome
conv "Rome/Rome Group .png"                        "$G/rome-group.jpg"
conv "Rome/Rome Photo Groupe.png"                 "$G/rome-square.jpg"
conv "Rome/Rome Diploma.png"                       "$G/rome-diploma.jpg"
# Séville
conv "Sevilla/Sevilla Garden Group.jpg"           "$G/seville-garden.jpg"
conv "Sevilla/Sevilla group.JPG"                  "$G/seville-group.jpg"
conv "Sevilla/Sevilla group boat.jpg"             "$G/seville-boat.jpg"
# Berlin
conv "Berlin/Main Berlin .png"                     "$G/berlin-main.jpg"

echo "▶︎ Visites professionnelles → $P"
conv "Visites pro /Visite Pro Eleves .png"         "$P/visite-eleves.jpg"
conv "Visites pro /Visite entreprise startup .png" "$P/visite-startup.jpg"
conv "Visites pro /Visite pro .png"                "$P/visite-pro.jpg"
conv "Visites pro /Visite startup .png"            "$P/visite-startup-2.jpg"
conv "Visites pro /Conference .heic"               "$P/visite-conference.jpg"

echo "▶︎ Photos additionnelles (racine Assets) → $G"
A="public/Assets"
convA() { # $1 = source relative à public/Assets  $2 = nom de sortie
  local s="$A/$1" o="$G/$2"
  if [ ! -f "$s" ]; then echo "  ⚠️  manquant : $1"; miss=$((miss+1)); return; fi
  if sips -s format jpeg -s formatOptions "$Q" -Z "$MAX" "$s" --out "$o" >/dev/null 2>&1; then
    echo "  ✅ $2"; ok=$((ok+1))
  else
    echo "  ❌ échec : $1"; miss=$((miss+1))
  fi
}
convA "Groupe Montreal.jpg"       "montreal-extra.jpg"
convA "Groupe New York.jpg"       "newyork-extra.jpg"
convA "NEW YORK AMI Panorama.jpg" "newyork-pano.jpg"
convA "Groupe Seville .jpg"       "seville-extra.jpg"
convA "Groupe Seville.jpg"        "seville-extra-2.jpg"
convA "Groupe Seville.png"        "seville-extra-3.jpg"
convA "Groupe seville2.jpg"       "seville-extra-4.jpg"
convA "Grooupe Depart.jpg"        "groupe-depart.jpg"
convA "Photo Avec Logo .jpg"      "groupe-logo.jpg"
convA "IMG_6217.HEIC"             "extra-photo.jpg"
convA "IMG_9419.DNG"              "extra-photo-2.jpg"

echo
echo "Terminé : $ok converties, $miss ignorées/manquantes."
echo
echo "Pour publier (depuis 'site/') :"
echo "  git add public/Assets/groups public/Assets/program"
echo "  git commit -m \"assets: photos groupes + visites pro optimisées\""
echo "  git push"

import { readFile } from "node:fs/promises";
import { PDFDocument, PDFName, PDFString, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { KIT_PDF_PATH } from "./assets";
import { PUBLIC_SIMULATOR_LABEL, PUBLIC_SIMULATOR_URL } from "./public-path";

/**
 * Repères mesurés sur l'export Canva « kit référent » (page 1440×810).
 * Si une nouvelle version déplace « Prénom NOM », mettre à jour ces ancres.
 * Le fond de la fiche est un aplat #EEF3FB ; le lien de la dernière page est sur blanc.
 */
const PAGE_HEIGHT = 810;

type Rgb = [number, number, number];

type Anchor = {
  pageIndex: number;
  x: number;
  baselineFromTop: number;
  top: number;
  bottom: number;
  coverRight: number;
  size: number;
  color: Rgb;
  background: Rgb;
  maxWidth: number;
};

const INK: Rgb = [0x12 / 255, 0x18 / 255, 0x27 / 255];
const CARD: Rgb = [238 / 255, 243 / 255, 251 / 255];
const GREEN: Rgb = [0x17 / 255, 0x8a / 255, 0x68 / 255];
const WHITE: Rgb = [1, 1, 1];

const NAME: Anchor = {
  pageIndex: 1,
  x: 79.2,
  baselineFromTop: 498.6,
  top: 476.2,
  bottom: 505.2,
  coverRight: 390,
  size: 20.25,
  color: INK,
  background: CARD,
  maxWidth: 300,
};

const SCHOOL: Anchor = { ...NAME, x: 403.2, coverRight: 760, maxWidth: 340 };
const EMPLOYER: Anchor = { ...NAME, baselineFromTop: 599.85, top: 577.4, bottom: 606.4, coverRight: 390, maxWidth: 300 };
const OPCO: Anchor = { ...EMPLOYER, x: 403.2, coverRight: 760, maxWidth: 340 };

const SIMULATOR_LINK: Anchor = {
  pageIndex: 19,
  x: 90.45,
  baselineFromTop: 606.6,
  top: 584.2,
  bottom: 614.2,
  coverRight: 900,
  size: 20.25,
  color: GREEN,
  background: WHITE,
  maxWidth: 780,
};

export type KitPersonalization = {
  prenom?: string;
  nom?: string;
  etablissement?: string;
  employeur?: string;
  opco?: string;
};

function clean(value: string | undefined, max = 80): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Helvetica (WinAnsi) couvre le français courant. Quelques ligatures sont translittérées. */
function toWinAnsi(value: string): string {
  return value
    .normalize("NFC")
    .replaceAll("œ", "oe")
    .replaceAll("Œ", "OE")
    .replaceAll("æ", "ae")
    .replaceAll("Æ", "AE")
    .replace(/[^\u0000-\u00FF]/g, "");
}

function fitSize(font: PDFFont, text: string, size: number, maxWidth: number): number {
  let next = size;
  while (next > 11 && font.widthOfTextAtSize(text, next) > maxWidth) next -= 0.5;
  return next;
}

function paint(page: PDFPage, font: PDFFont, anchor: Anchor, text: string) {
  const value = toWinAnsi(text);
  if (!value) return;
  const size = fitSize(font, value, anchor.size, anchor.maxWidth);
  const width = font.widthOfTextAtSize(value, size);
  const coverRight = Math.max(anchor.coverRight, anchor.x + width + 8);
  const height = anchor.bottom - anchor.top;
  page.drawRectangle({
    x: anchor.x - 2,
    y: PAGE_HEIGHT - anchor.bottom,
    width: coverRight - anchor.x + 2,
    height,
    color: rgb(...anchor.background),
  });
  page.drawText(value, {
    x: anchor.x,
    y: PAGE_HEIGHT - anchor.baselineFromTop,
    size,
    font,
    color: rgb(...anchor.color),
  });
  return { x: anchor.x, y: PAGE_HEIGHT - anchor.bottom, width: Math.max(width, 120), height };
}

function addLink(page: PDFPage, doc: PDFDocument, rect: { x: number; y: number; width: number; height: number }, url: string) {
  const annot = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
    Border: [0, 0, 0],
    A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
  });
  const ref = doc.context.register(annot);
  page.node.set(PDFName.of("Annots"), doc.context.obj([ref]));
}

/**
 * PDF du kit prêt à télécharger.
 * Le nom (et, s'ils sont connus, l'établissement, l'employeur, l'OPCO)
 * remplace les placeholders de la page 2. La dernière page pointe vers
 * le simulateur public, même si l'export Canva cite encore l'adresse interne.
 * Le PowerPoint n'est pas personnalisé.
 */
export async function buildKitPdf(input: KitPersonalization = {}, source?: Uint8Array): Promise<Uint8Array> {
  const bytes = source ?? (await readFile(KIT_PDF_PATH));
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const fullName = [clean(input.prenom, 40), clean(input.nom, 40)].filter(Boolean).join(" ");

  if (fullName) paint(doc.getPage(NAME.pageIndex), font, NAME, fullName);
  const school = clean(input.etablissement);
  const employer = clean(input.employeur);
  const opco = clean(input.opco);
  if (school) paint(doc.getPage(SCHOOL.pageIndex), font, SCHOOL, school);
  if (employer) paint(doc.getPage(EMPLOYER.pageIndex), font, EMPLOYER, employer);
  if (opco) paint(doc.getPage(OPCO.pageIndex), font, OPCO, opco);

  const link = paint(doc.getPage(SIMULATOR_LINK.pageIndex), font, SIMULATOR_LINK, PUBLIC_SIMULATOR_LABEL);
  if (link) addLink(doc.getPage(SIMULATOR_LINK.pageIndex), doc, link, PUBLIC_SIMULATOR_URL);

  return doc.save({ useObjectStreams: false });
}

import { readFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { hasGlobalWeeksAccess } from "@/app/global-weeks/actions";
import { FLYER_PDF_PATH, KIT_PPTX_PATH, PUBLIC_SIMULATOR_PATH, isKitPptxReady, kitPptxUrl } from "@/lib/global-weeks/assets";
import { buildKitPdf, type KitPersonalization } from "@/lib/global-weeks/personalize-kit";

export const dynamic = "force-dynamic";

function attachment(body: Uint8Array, type: string, filename: string) {
  return new NextResponse(Buffer.from(body), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

function field(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

async function authorize() {
  if (await hasGlobalWeeksAccess()) return null;
  return NextResponse.json({ error: "Accès Global Weeks requis" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const denied = await authorize();
  if (denied) return denied;

  const doc = request.nextUrl.searchParams.get("doc");
  if (doc === "kit") {
    const pdf = await buildKitPdf();
    return attachment(pdf, "application/pdf", "kit-referent-global-weeks.pdf");
  }
  if (doc === "flyer") {
    const pdf = await readFile(FLYER_PDF_PATH);
    return attachment(pdf, "application/pdf", "flyer-referent-global-weeks.pdf");
  }
  if (doc === "pptx") {
    const remote = kitPptxUrl();
    if (remote) return NextResponse.redirect(remote);
    if (isKitPptxReady()) {
      const pptx = await readFile(KIT_PPTX_PATH);
      return attachment(pptx, "application/vnd.openxmlformats-officedocument.presentationml.presentation", "kit-referent-global-weeks.pptx");
    }
    return NextResponse.json(
      {
        error: "PowerPoint non hébergé",
        hostPath: "content/global-weeks/kit-referent.pptx",
        hostEnv: "GLOBAL_WEEKS_KIT_PPTX_URL",
        simulator: PUBLIC_SIMULATOR_PATH,
      },
      { status: 404 },
    );
  }
  return NextResponse.json({ error: "Document inconnu" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const denied = await authorize();
  if (denied) return denied;

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }
  const input: KitPersonalization = {
    prenom: field(raw.prenom),
    nom: field(raw.nom),
    etablissement: field(raw.etablissement),
    employeur: field(raw.employeur),
    opco: field(raw.opco),
  };
  if (!input.prenom?.trim() || !input.nom?.trim()) {
    return NextResponse.json({ error: "Prénom et nom requis" }, { status: 400 });
  }
  const pdf = await buildKitPdf(input);
  const slug = `${input.prenom}-${input.nom}`.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40);
  return attachment(pdf, "application/pdf", `kit-referent-global-weeks-${slug || "personnalise"}.pdf`);
}

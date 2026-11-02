import { NextRequest, NextResponse } from "next/server";
import { currentLeadsEmail } from "@/app/internal/leads/actions";
import { filterLeads, type LeadFilters } from "@/lib/lead-filters";
import { leadsToCsv } from "@/lib/lead-csv";
import { listLeads } from "@/lib/lead-repository";

export async function GET(request: NextRequest) {
  const email = await currentLeadsEmail();
  if (!email) return NextResponse.json({ error: "Accès réservé" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const filters: LeadFilters = {
    q: params.get("q") ?? undefined,
    role: params.get("role") ?? undefined,
    status: params.get("status") ?? undefined,
    destination: params.get("destination") ?? undefined,
    source: params.get("source") ?? undefined,
  };
  const csv = leadsToCsv(filterLeads(await listLeads(), filters));
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"leads-ami.csv\"",
      "Cache-Control": "no-store",
    },
  });
}

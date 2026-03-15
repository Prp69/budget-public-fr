// src/app/api/parlementaires/[chambre]/route.ts
// Proxy serveur → API officielle assemblee-nationale.fr + senat.fr
// Évite les problèmes CORS côté navigateur
// Cache 24h (données stables)

import { NextResponse } from "next/server";

// ─── Mapping groupe → sigle interne ──────────────────────────────────────────

function sigleAN(libelle: string): string {
  const l = (libelle ?? "").toLowerCase();
  if (l.includes("rassemblement national"))          return "RN";
  if (l.includes("union des droites"))               return "UDR";
  if (l.includes("droite républicaine") || l.includes("droite republicaine")) return "DR";
  if (l.includes("démocrates") || l.includes("democrates")) return "DEM";
  if (l.includes("horizons"))                        return "HOR";
  if (l.includes("ensemble pour la r"))              return "EPR";
  if (l.includes("libertés") || l.includes("liot")) return "LIOT";
  if (l.includes("socialiste"))                      return "SOC";
  if (l.includes("écologiste") || l.includes("ecologiste")) return "EcoS";
  if (l.includes("france insoumise") || l.includes("nouveau front populaire")) return "LFI";
  if (l.includes("gauche démocrate") || l.includes("gauche democrate") || l.includes("gdr")) return "GDR";
  return "NI";
}

function sigleSenat(libelle: string): string {
  const l = (libelle ?? "").toLowerCase();
  if (l.includes("communiste") || l.includes("crce") || l.includes("kanaky")) return "CRCEK";
  if (l.includes("écologiste") || l.includes("solidarité et territoires"))    return "EST";
  if (l.includes("socialiste, écol") || l.includes("ser"))                    return "SER";
  if (l.includes("rdse") || l.includes("rassemblement démocratique et social"))return "RDSE";
  if (l.includes("rdpi") || l.includes("progressistes"))                      return "RDPI";
  if (l.includes("indépendants") || l.includes("lirt"))                       return "LIRT";
  if (l.includes("union centriste") || l.includes(" uc"))                     return "UC";
  if (l.includes("républicains") || l.includes(" lr"))                        return "LR";
  return "NI";
}

// ─── Parseur données AN ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseActeursAN(data: any): { nom: string; sigle: string; departement: string }[] {
  const acteurs = data?.acteurs?.acteur ?? data?.export?.acteurs?.acteur ?? [];
  const arr     = Array.isArray(acteurs) ? acteurs : [acteurs];
  const result: { nom: string; sigle: string; departement: string }[] = [];

  for (const a of arr) {
    const ident = a?.etatCivil?.ident;
    if (!ident) continue;
    const nom    = `${ident.prenom ?? ""} ${ident.nom ?? ""}`.trim();
    if (!nom) continue;

    // Trouver le groupe politique dans les mandats
    let sigle = "NI";
    const mandats = a?.mandats?.mandat;
    const mandatArr = mandats ? (Array.isArray(mandats) ? mandats : [mandats]) : [];
    for (const m of mandatArr) {
      const typeOrgane = m?.typeOrgane ?? "";
      if (typeOrgane === "GP" || typeOrgane === "GROUPE") {
        sigle = sigleAN(m?.organeRef?.["#text"] ?? m?.nomOrgane ?? m?.libelle ?? "");
        if (sigle !== "NI") break;
        // Essayer via infosQualite
        const libelle = m?.infosQualite?.libelleCourCourtQualite ?? "";
        sigle = sigleAN(libelle);
        if (sigle !== "NI") break;
      }
    }

    // Circonscription
    let departement = "";
    for (const m of mandatArr) {
      if (m?.typeOrgane === "CIRCONSCRIPTION" || m?.typeOrgane === "CIRCO") {
        departement = m?.election?.lieu?.departement ?? m?.nomOrgane ?? "";
        break;
      }
    }

    result.push({ nom, sigle, departement });
  }
  return result;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chambre: string }> }
) {
  const { chambre } = await params;

  try {
    if (chambre === "AN") {
      // URL officielle AN — JSON des députés actifs (17e législature)
      const url = "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_valides_opendata/AMO10_deputes_actifs_mandats_valides_opendata.json";
      const res = await fetch(url, {
        next: { revalidate: 86400 }, // cache 24h
        headers: { "User-Agent": "BudgetPublic/1.0 (contact: contact@budgetpublic.fr)" },
      });

      if (!res.ok) throw new Error(`AN API ${res.status}`);
      const json = await res.json();
      const deputes = parseActeursAN(json);

      return NextResponse.json({ parlementaires: deputes }, {
        headers: { "Cache-Control": "public, max-age=86400" },
      });
    }

    if (chambre === "SENAT") {
      // URL officielle Sénat — open data sénateurs en exercice
      const url = "https://data.senat.fr/data/senateurs/ODSEN_GENERAL.json";
      const res = await fetch(url, {
        next: { revalidate: 86400 },
        headers: { "User-Agent": "BudgetPublic/1.0" },
      });

      if (!res.ok) throw new Error(`Sénat API ${res.status}`);
      const json = await res.json();

      // Format Sénat : tableau direct ou { senateurs: [...] }
      const raw = Array.isArray(json) ? json : (json?.senateurs ?? json?.data ?? []);
      const senateurs = raw.map((s: {
        Nom?: string; Prenom?: string; NOM?: string; PRENOM?: string;
        Groupe?: { Libelle?: string }; groupe?: { libelle?: string };
        Departement?: string; departement?: string;
      }) => ({
        nom:          `${s.Prenom ?? s.PRENOM ?? ""} ${s.Nom ?? s.NOM ?? ""}`.trim(),
        sigle:        sigleSenat(s.Groupe?.Libelle ?? s.groupe?.libelle ?? ""),
        departement:  s.Departement ?? s.departement ?? "",
      })).filter((s: { nom: string }) => s.nom.trim().length > 1);

      return NextResponse.json({ parlementaires: senateurs }, {
        headers: { "Cache-Control": "public, max-age=86400" },
      });
    }

    return NextResponse.json({ error: "Chambre inconnue" }, { status: 400 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg, parlementaires: [] }, { status: 200 });
    // status 200 pour que le client puisse afficher le fallback gracieusement
  }
}
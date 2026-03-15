// src/app/api/parlementaires/[chambre]/route.ts
// Sources officielles uniquement :
//   AN  : data.assemblee-nationale.fr (CSV direct, 17e législature)
//   Sénat : data.senat.fr (CSV direct, sénateurs ACTIFS)

import { NextResponse } from "next/server";

// ─── Helpers CSV ──────────────────────────────────────────────────────────────

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Parser l'en-tête (gère les guillemets)
  const headers = parseLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.trim()] = (values[i] ?? "").trim();
    });
    return row;
  }).filter(row => Object.values(row).some(v => v.length > 0));
}

function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

// ─── Mapping groupe AN (sigle CSV → sigle interne) ───────────────────────────

const SIGLE_AN: Record<string, string> = {
  "GDR":     "GDR",
  "LFI-NFP": "LFI",
  "LFI":     "LFI",
  "ECOS":    "EcoS",
  "SOC":     "SOC",
  "LIOT":    "LIOT",
  "EPR":     "EPR",
  "DEM":     "DEM",
  "Dem":     "DEM",
  "HOR":     "HOR",
  "DR":      "DR",
  "UDR":     "UDR",
  "RN":      "RN",
  "NI":      "NI",
};

// ─── Mapping groupe Sénat (libellé CSV → sigle interne) ─────────────────────

function sigleSenat(libelle: string): string {
  const l = (libelle ?? "").toLowerCase().trim();
  if (l === "crcek" || l.includes("communiste") || l.includes("kanaky")) return "CRCEK";
  if (l === "est"   || l.includes("solidarité et territoires"))           return "EST";
  if (l === "ser"   || l.includes("socialiste, écol"))                    return "SER";
  if (l === "rdse"  || l.includes("rassemblement démocratique"))          return "RDSE";
  if (l === "rdpi"  || l.includes("progressistes"))                       return "RDPI";
  if (l === "lirt"  || l.includes("indépendants"))                        return "LIRT";
  if (l === "uc"    || l.includes("union centriste"))                     return "UC";
  if (l === "lr"    || l.includes("républicains"))                        return "LR";
  return "NI";
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chambre: string }> }
) {
  const { chambre } = await params;

  try {
    if (chambre === "AN") {
      const url = "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_csv_opendata/liste_deputes_libre_office.csv";
      const res = await fetch(url, {
        next:    { revalidate: 86400 },
        headers: { "User-Agent": "BudgetPublic/1.0 (opendata@budgetpublic.fr)" },
      });
      if (!res.ok) throw new Error(`AN CSV ${res.status}`);

      const text = await res.text();
      const rows = parseCSV(text);

      const parlementaires = rows
        .filter(r => r["Prénom"] && r["Nom"])
        .map(r => ({
          nom:         `${r["Prénom"]} ${r["Nom"]}`,
          sigle:       SIGLE_AN[r["Groupe politique (abrégé)"]?.trim()] ?? "NI",
          departement: r["Département"] ?? "",
        }));

      return NextResponse.json(
        { parlementaires, total: parlementaires.length },
        { headers: { "Cache-Control": "public, max-age=86400" } }
      );
    }

    if (chambre === "SENAT") {
      const url = "https://data.senat.fr/data/senateurs/ODSEN_GENERAL.csv";
      const res = await fetch(url, {
        next:    { revalidate: 86400 },
        headers: { "User-Agent": "BudgetPublic/1.0" },
      });
      if (!res.ok) throw new Error(`Sénat CSV ${res.status}`);

      const text = await res.text();
      const rows = parseCSV(text);

      const parlementaires = rows
        // Garder uniquement les sénateurs ACTIFS
        .filter(r => (r["État"] ?? r["tat"] ?? "").toUpperCase() === "ACTIF")
        .filter(r => r["Nom usuel"] || r["Prnom usuel"])
        .map(r => ({
          nom:         `${r["Prénom usuel"] ?? r["Prnom usuel"] ?? ""} ${r["Nom usuel"] ?? ""}`.trim(),
          sigle:       sigleSenat(r["Groupe politique"] ?? ""),
          departement: r["Circonscription"] ?? "",
        }))
        .filter(r => r.nom.length > 1);

      return NextResponse.json(
        { parlementaires, total: parlementaires.length },
        { headers: { "Cache-Control": "public, max-age=86400" } }
      );
    }

    return NextResponse.json({ error: "Chambre inconnue" }, { status: 400 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[parlementaires/${chambre}]`, msg);
    // Retourne un tableau vide — le composant affichera le fallback "siège N"
    return NextResponse.json(
      { error: msg, parlementaires: [], total: 0 },
      { status: 200 }
    );
  }
}
// src/app/api/parlementaires/[chambre]/route.ts
// Sources officielles :
//   AN    : data.assemblee-nationale.fr  — CSV séparateur virgule, UTF-8
//   Sénat : data.senat.fr/ODSEN_GENERAL.csv — séparateur point-virgule, Latin-1

import { NextResponse } from "next/server";

// ─── Parseur CSV générique ────────────────────────────────────────────────────

function parseCSV(text: string, sep = ","): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = splitLine(lines[0], sep);
  return lines.slice(1)
    .map(line => {
      const vals = splitLine(line, sep);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h.trim().replace(/^\uFEFF/, "")] = (vals[i] ?? "").trim(); });
      return row;
    })
    .filter(r => Object.values(r).some(v => v));
}

function splitLine(line: string, sep: string): string[] {
  const res: string[] = [];
  let cur = "", inQ = false;
  for (const c of line) {
    if (c === '"') { inQ = !inQ; }
    else if (c === sep && !inQ) { res.push(cur); cur = ""; }
    else { cur += c; }
  }
  res.push(cur);
  return res;
}

// ─── Mapping sigles AN ────────────────────────────────────────────────────────
// Valeurs exactes de la colonne "Groupe politique (abrégé)" du CSV officiel

const SIGLE_AN: Record<string, string> = {
  "GDR":     "GDR",
  "LFI-NFP": "LFI",
  "EcoS":    "EcoS",
  "SOC":     "SOC",
  "LIOT":    "LIOT",
  "EPR":     "EPR",
  "Dem":     "DEM",   // casse exacte du CSV : D majuscule, em minuscule
  "HOR":     "HOR",
  "DR":      "DR",
  "UDR":     "UDR",
  "RN":      "RN",
  "NI":      "NI",
};

// ─── Mapping sigles Sénat ─────────────────────────────────────────────────────
// Valeurs exactes de la colonne "Groupe politique" du CSV ODSEN_GENERAL

const SIGLE_SENAT: Record<string, string> = {
  "CRCEK": "CRCEK",
  "EST":   "EST",
  "SER":   "SER",
  "RDSE":  "RDSE",
  "RDPI":  "RDPI",
  "LIRT":  "LIRT",
  "UC":    "UC",
  "LR":    "LR",
  "NI":    "NI",
  "RASNAG":"NI",  // Réunion administrative des non-affiliés
};

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chambre: string }> }
) {
  const { chambre } = await params;

  try {
    // ── Assemblée nationale ──
    if (chambre === "AN") {
      const url = "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_csv_opendata/liste_deputes_libre_office.csv";
      const res = await fetch(url, {
        next:    { revalidate: 86400 },
        headers: { "User-Agent": "BudgetPublic/1.0" },
      });
      if (!res.ok) throw new Error(`AN HTTP ${res.status}`);

      const text  = await res.text();
      const rows  = parseCSV(text, ",");

      const parlementaires = rows
        .filter(r => r["Prénom"] && r["Nom"])
        .map(r => ({
          nom:         `${r["Prénom"]} ${r["Nom"]}`,
          sigle:       SIGLE_AN[r["Groupe politique (abrégé)"]?.trim()] ?? "NI",
          departement: r["Département"] ?? "",
        }));

      const debug = parlementaires.reduce((a, p) => { a[p.sigle] = (a[p.sigle] ?? 0) + 1; return a; }, {} as Record<string,number>);
      console.log("[AN]", parlementaires.length, "députés:", debug);

      return NextResponse.json(
        { parlementaires, total: parlementaires.length, debug },
        { headers: { "Cache-Control": "public, max-age=86400" } }
      );
    }

    // ── Sénat ──
    if (chambre === "SENAT") {
      const url = "https://data.senat.fr/data/senateurs/ODSEN_GENERAL.csv";
      // Le CSV Sénat est en Latin-1 et séparateur ";"
      const res = await fetch(url, {
        next:    { revalidate: 86400 },
        headers: { "User-Agent": "BudgetPublic/1.0" },
      });
      if (!res.ok) throw new Error(`Sénat HTTP ${res.status}`);

      // Lire en Latin-1 (ISO-8859-1)
      const buffer     = await res.arrayBuffer();
      const text       = new TextDecoder("iso-8859-1").decode(buffer);
      const rows       = parseCSV(text, ";");

      // La 1ère ligne du CSV Sénat est un commentaire SQL — la sauter si elle commence par "%"
      // parseCSV a déjà pris la 1ère ligne comme en-têtes, donc vérifier les clés
      const sampleRow  = rows[0] ?? {};
      const keys       = Object.keys(sampleRow);
      console.log("[SENAT] colonnes détectées:", keys.slice(0, 6));

      // Colonnes attendues : "Matricule", "Qualité", "Nom usuel", "Prénom usuel",
      // "État", "Groupe politique", "Circonscription"
      // Si la colonne s'appelle "tat" (Latin-1 mal décodé → non, on décode bien)
      const colNom     = keys.find(k => k.toLowerCase().includes("nom usuel"))     ?? "Nom usuel";
      const colPrenom  = keys.find(k => k.toLowerCase().includes("prnom") || k.toLowerCase().includes("prénom")) ?? "Prénom usuel";
      const colEtat    = keys.find(k => k.toLowerCase().includes("tat") || k.toLowerCase() === "état") ?? "État";
      const colGroupe  = keys.find(k => k.toLowerCase().includes("groupe"))        ?? "Groupe politique";
      const colCirco   = keys.find(k => k.toLowerCase().includes("circo"))         ?? "Circonscription";

      console.log("[SENAT] colonnes utilisées:", { colNom, colPrenom, colEtat, colGroupe });

      const parlementaires = rows
        .filter(r => (r[colEtat] ?? "").toUpperCase() === "ACTIF")
        .filter(r => r[colNom])
        .map(r => ({
          nom:         `${r[colPrenom] ?? ""} ${r[colNom] ?? ""}`.trim(),
          sigle:       SIGLE_SENAT[(r[colGroupe] ?? "").trim()] ?? "NI",
          departement: r[colCirco] ?? "",
        }))
        .filter(r => r.nom.length > 2);

      const debug = parlementaires.reduce((a, p) => { a[p.sigle] = (a[p.sigle] ?? 0) + 1; return a; }, {} as Record<string,number>);
      console.log("[SENAT]", parlementaires.length, "sénateurs:", debug);

      return NextResponse.json(
        { parlementaires, total: parlementaires.length, debug },
        { headers: { "Cache-Control": "public, max-age=86400" } }
      );
    }

    return NextResponse.json({ error: "Chambre inconnue" }, { status: 400 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[parlementaires/${chambre}]`, msg);
    return NextResponse.json({ error: msg, parlementaires: [], total: 0 }, { status: 200 });
  }
}
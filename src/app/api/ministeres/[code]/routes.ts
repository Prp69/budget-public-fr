// src/app/api/ministeres/[code]/route.ts
//
// Schéma réel confirmé des CSV PLF 2025 sur data.gouv.fr (etalab/plf) :
//
// RID_DESTINATION (b7da87c8) — "PLF 2025 Dépenses selon destination"
//   Mission ; Programme ; Action ; Sous-action ; AE_PLF ; CP_PLF
//   (séparateur ; , valeurs entre guillemets)
//
// RID_NATURE (44ebd8cb) — "PLF 2025 Dépenses BG+BA selon destination ET nature"
//   Mission ; Programme ; Action ; Sous-action ; Titre ; Catégorie ; AE_PLF ; CP_PLF
//
// RID_PLURIANNUEL (50fafbbf) — "PLF 2025 Dépenses pluriannuelles par titre"
//   Mission ; Programme ; Titre ; CP_2021 ; CP_2022 ; CP_2023 ; CP_2024 ; CP_2025
//
// NOTE : pas de colonne Ministère directe — on filtre par liste de programmes LOLF.
// Les numéros de programme sont stables (définis par la LOLF) et fournis par
// la table PROGRAMMES_PAR_MINISTERE ci-dessous.
//
// API tabular-api.data.gouv.fr :
//   Filtre exact  : colonne__exact=valeur
//   Filtre "in"   : colonne__in=val1,val2,val3
//   Agrégation    : colonne__groupby  + colonne__sum  (si ALLOW_AGGREGATION activé)
//   Fallback      : page_size=500, agrégation côté serveur
//   Résultat clé  : colonne__sum  pour les sommes

import { NextResponse } from "next/server";

const TABULAR = "https://tabular-api.data.gouv.fr/api/resources";

const RID_NATURE      = "44ebd8cb-473c-483a-8538-3fa89e533718"; // destination+nature
const RID_PLURIANNUEL = "50fafbbf-e767-4df9-8cd9-2679d3ee2612"; // pluriannuel

// ─── Programmes LOLF par ministère ───────────────────────────────────────────
// Numéros stables ; source : nomenclature LOLF 2025
// On ne garde que les programmes "budgétaires" (hors remboursements & CAS)
const PROGRAMMES: Record<string, number[]> = {
  "08": [140, 141, 143, 230],                        // Éducation nationale
  "38": [150, 172, 193, 231],                        // Ens. supérieur & Recherche
  "02": [144, 146, 212],                             // Défense
  "76": [101, 107, 166, 182, 310, 335],              // Justice
  "40": [152, 161, 176, 207, 216, 232, 354],         // Intérieur
  "11": [102, 103, 111, 155],                        // Travail & Emploi
  "44": [134, 220, 305, 343],                        // Économie & Finances
  "62": [157, 183, 204, 304, 312, 379],              // Santé & Solidarités
  "58": [113, 159, 162, 174, 181, 203, 217, 345],    // Transitions écologiques
  "15": [149, 154, 206, 215],                        // Agriculture
  "07": [131, 175, 224, 361],                        // Culture
  "05": [105, 151, 185, 209, 347],                   // Action extérieure
};

// Catégories → Titre simplifié
const CATEGORIE_TITRE: Record<string, string> = {
  "21": "Titre 2 — Personnel",
  "22": "Titre 2 — Personnel",
  "23": "Titre 2 — Personnel",
  "31": "Titre 3 — Fonctionnement",
  "32": "Titre 3 — Fonctionnement",
  "51": "Titre 5 — Investissement",
  "52": "Titre 5 — Investissement",
  "61": "Titre 6 — Intervention",
  "62": "Titre 6 — Intervention",
  "63": "Titre 6 — Intervention",
  "64": "Titre 6 — Intervention",
  "71": "Titre 7 — Charges financières",
  "72": "Titre 7 — Charges financières",
};

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function inFilter(progs: number[]) {
  return progs.join(",");
}

type Row = Record<string, string | number | null>;

// Agréger des lignes brutes par une clé, sommer une colonne numérique
function aggregate(
  rows: Row[],
  keyCol: string,
  sumCol: string
): { key: string; sum: number }[] {
  const map: Record<string, number> = {};
  for (const r of rows) {
    const key = String(r[keyCol] ?? "").trim();
    const val = Number(String(r[sumCol] ?? "0").replace(/\s/g, "").replace(",", "."));
    if (!key) continue;
    map[key] = (map[key] ?? 0) + val;
  }
  return Object.entries(map)
    .map(([key, sum]) => ({ key, sum }))
    .sort((a, b) => b.sum - a.sum);
}

// Trouver la colonne réelle (insensible à la casse, trim)
function findCol(row: Row, ...candidates: string[]): string | null {
  const keys = Object.keys(row).map((k) => k.trim());
  for (const c of candidates) {
    const found = keys.find((k) => k.toLowerCase() === c.toLowerCase());
    if (found) return found;
  }
  return null;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const progs = PROGRAMMES[code];

  if (!progs || progs.length === 0) {
    return NextResponse.json(
      { titres: [], programmes: [], historique: [], error: `Code ministère inconnu : ${code}` },
      { status: 200 }
    );
  }

  const progFilter = inFilter(progs);
  const opts = { next: { revalidate: 3600 } } as RequestInit;

  try {
    // ── Requête A : nature (titre/catégorie) + programmes ─────────────────
    const urlNature =
      `${TABULAR}/${RID_NATURE}/data/?` +
      `Programme__in=${progFilter}&` +
      `page_size=500`;

    // ── Requête B : pluriannuel ────────────────────────────────────────────
    const urlPluri =
      `${TABULAR}/${RID_PLURIANNUEL}/data/?` +
      `Programme__in=${progFilter}&` +
      `page_size=500`;

    const [resNature, resPluri] = await Promise.all([
      fetch(urlNature, opts),
      fetch(urlPluri, opts),
    ]);

    // ── Parser la réponse nature ──────────────────────────────────────────
    let titres: { titre: string; label: string; cp: number; ae: number }[] = [];
    let programmes: { num: string; label: string; cp: number }[] = [];

    if (resNature.ok) {
      const d = await resNature.json();
      const rows: Row[] = d?.data ?? [];

      if (rows.length > 0) {
        const sample = rows[0];

        // Détecter les colonnes
        const colProg     = findCol(sample, "Programme", "programme", "num_programme");
        const colCat      = findCol(sample, "Catégorie_code", "categorie_code", "Categorie_code", "cat_code");
        const colCatLib   = findCol(sample, "Catégorie", "categorie", "lib_categorie", "Categorie");
        const colCP       = findCol(sample, "CPPLF", "CP_PLF", "cp_plf", "CP", "cp");
        const colAE       = findCol(sample, "AEPLF", "AE_PLF", "ae_plf", "AE", "ae");
        const colMission  = findCol(sample, "Mission", "mission", "lib_mission");

        console.log(`[ministeres/${code}] colonnes détectées:`, { colProg, colCat, colCatLib, colCP, colAE, colMission });
        console.log(`[ministeres/${code}] sample row:`, sample);

        // --- Ventilation par titre ---
        if (colCat && colCP) {
          const byTitre: Record<string, { cp: number; ae: number }> = {};
          for (const r of rows) {
            const cat = String(r[colCat] ?? "").trim();
            const titre = CATEGORIE_TITRE[cat] ?? (cat.startsWith("2") ? "Titre 2 — Personnel"
              : cat.startsWith("3") ? "Titre 3 — Fonctionnement"
              : cat.startsWith("5") ? "Titre 5 — Investissement"
              : cat.startsWith("6") ? "Titre 6 — Intervention"
              : cat.startsWith("7") ? "Titre 7 — Charges financières"
              : `Autre (cat. ${cat})`);
            const cp = Number(String(r[colCP] ?? "0").replace(/\s/g, "").replace(",", "."));
            const ae = colAE ? Number(String(r[colAE] ?? "0").replace(/\s/g, "").replace(",", ".")) : 0;
            if (!byTitre[titre]) byTitre[titre] = { cp: 0, ae: 0 };
            byTitre[titre].cp += cp;
            byTitre[titre].ae += ae;
          }
          titres = Object.entries(byTitre)
            .map(([titre, { cp, ae }]) => ({ titre, label: titre, cp, ae }))
            .filter((t) => t.cp > 0)
            .sort((a, b) => a.titre.localeCompare(b.titre));
        }

        // --- Programmes top ---
        if (colProg && colCP) {
          // On a besoin du libellé mission aussi
          const byProg: Record<string, { cp: number; label: string }> = {};
          for (const r of rows) {
            const prog = String(r[colProg] ?? "").trim();
            const cp   = Number(String(r[colCP] ?? "0").replace(/\s/g, "").replace(",", "."));
            const label = colMission ? String(r[colMission] ?? prog) : prog;
            if (!byProg[prog]) byProg[prog] = { cp: 0, label };
            byProg[prog].cp += cp;
          }
          programmes = Object.entries(byProg)
            .map(([num, { cp, label }]) => ({ num, label, cp }))
            .filter((p) => p.cp > 0)
            .sort((a, b) => b.cp - a.cp)
            .slice(0, 8);
        }
      }
    }

    // ── Parser le pluriannuel ─────────────────────────────────────────────
    let historique: { annee: string; cp: number }[] = [];

    if (resPluri.ok) {
      const d = await resPluri.json();
      const rows: Row[] = d?.data ?? [];

      if (rows.length > 0) {
        const sample = rows[0];
        console.log(`[ministeres/${code}] pluri sample:`, sample);

        // Sommer les colonnes annuelles
        const anneesMap: Record<string, number> = {};
        for (const r of rows) {
          for (const [k, v] of Object.entries(r)) {
            // Matcher CP_2021, CPPLF_2022, cp_2023, etc.
            const m = k.match(/(?:cp|CP)[_\s-]?(?:PLF[_\s-]?)?(\d{4})/i);
            if (m) {
              const annee = m[1];
              const val = Number(String(v ?? "0").replace(/\s/g, "").replace(",", "."));
              anneesMap[annee] = (anneesMap[annee] ?? 0) + val;
            }
          }
        }
        historique = Object.entries(anneesMap)
          .map(([annee, cp]) => ({ annee, cp }))
          .filter((h) => h.cp > 0 && Number(h.annee) >= 2020)
          .sort((a, b) => a.annee.localeCompare(b.annee));
      }
    }

    console.log(`[ministeres/${code}] résultat → titres:${titres.length} progs:${programmes.length} histo:${historique.length}`);

    return NextResponse.json({ titres, programmes, historique });

  } catch (err) {
    console.error(`[ministeres/${code}] erreur:`, err);
    return NextResponse.json(
      { titres: [], programmes: [], historique: [], error: String(err) },
      { status: 500 }
    );
  }
}
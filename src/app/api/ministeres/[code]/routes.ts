// src/app/api/ministeres/[code]/route.ts
import { NextResponse } from "next/server";

const BASE = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets";

// Dataset A : ventilation par titre pour l'année courante (PLF 2025)
const DS_TITRES = "plf25-depenses-2025-du-bg-et-des-ba-selon-nomenclatures-destination-et-nature";
// Dataset B : historique pluriannuel par programme × titre
const DS_PLURIANNUEL = "plf25-depenses-pluriannuelles-par-titre-des-programmes";

// Libellés des titres budgétaires (nomenclature LOLF)
const TITRES: Record<string, string> = {
  "1": "Personnel (Titre 2)",
  "2": "Fonctionnement (Titre 3)",
  "3": "Investissement (Titre 5)",
  "5": "Remboursements & dégrèvements",
  "6": "Dépenses d'intervention (Titre 6)",
  "7": "Charges financières (Titre 7)",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    // ── 1. Ventilation par titre (année courante) ──────────────────────────
    const titresParams = new URLSearchParams({
      where:    `cod_ministere='${code}'`,
      group_by: "titre",
      select:   "titre, sum(cp) as total_cp, sum(ae) as total_ae",
      limit:    "20",
    });
    const resTitres = await fetch(
      `${BASE}/${DS_TITRES}/records?${titresParams}`,
      { next: { revalidate: 3600 } }
    );

    // ── 2. Programmes du ministère (top 8 par CP) ──────────────────────────
    const progsParams = new URLSearchParams({
      where:    `cod_ministere='${code}'`,
      group_by: "num_programme, lib_programme",
      select:   "num_programme, lib_programme, sum(cp) as total_cp",
      order_by: "total_cp DESC",
      limit:    "8",
    });
    const resProgs = await fetch(
      `${BASE}/${DS_TITRES}/records?${progsParams}`,
      { next: { revalidate: 3600 } }
    );

    // ── 3. Historique pluriannuel (2021-2025) ──────────────────────────────
    const histo5Params = new URLSearchParams({
      where:    `cod_ministere='${code}'`,
      group_by: "cod_ministere",
      select:   [
        "cod_ministere",
        "sum(cp_2021) as cp_2021",
        "sum(cp_2022) as cp_2022",
        "sum(cp_2023) as cp_2023",
        "sum(cp_2024) as cp_2024",
        "sum(cp_2025) as cp_2025",
      ].join(", "),
      limit: "1",
    });
    const resHisto = await fetch(
      `${BASE}/${DS_PLURIANNUEL}/records?${histo5Params}`,
      { next: { revalidate: 3600 } }
    );

    // ── Vérifier les réponses ──────────────────────────────────────────────
    if (!resTitres.ok || !resProgs.ok || !resHisto.ok) {
      return NextResponse.json(
        { error: "API data.economie.gouv.fr indisponible", status: resTitres.status },
        { status: 502 }
      );
    }

    const [dataTitres, dataProgs, dataHisto] = await Promise.all([
      resTitres.json(),
      resProgs.json(),
      resHisto.json(),
    ]);

    // ── Formater les titres ────────────────────────────────────────────────
    const titres = (dataTitres.results ?? dataTitres.records ?? [])
      .map((r: Record<string, unknown>) => ({
        titre:    String(r.titre ?? ""),
        label:    TITRES[String(r.titre ?? "")] ?? `Titre ${r.titre}`,
        cp:       Number(r.total_cp ?? 0),
        ae:       Number(r.total_ae ?? 0),
      }))
      .filter((t: { cp: number }) => t.cp > 0)
      .sort((a: { titre: string }, b: { titre: string }) =>
        a.titre.localeCompare(b.titre)
      );

    // ── Formater les programmes ────────────────────────────────────────────
    const programmes = (dataProgs.results ?? dataProgs.records ?? []).map(
      (r: Record<string, unknown>) => ({
        num:   String(r.num_programme ?? ""),
        label: String(r.lib_programme ?? ""),
        cp:    Number(r.total_cp ?? 0),
      })
    );

    // ── Formater l'historique ──────────────────────────────────────────────
    const h = (dataHisto.results ?? dataHisto.records ?? [])[0] ?? {};
    const historique = [
      { annee: "2021", cp: Number(h.cp_2021 ?? 0) },
      { annee: "2022", cp: Number(h.cp_2022 ?? 0) },
      { annee: "2023", cp: Number(h.cp_2023 ?? 0) },
      { annee: "2024", cp: Number(h.cp_2024 ?? 0) },
      { annee: "2025", cp: Number(h.cp_2025 ?? 0) },
    ].filter((p) => p.cp > 0);

    return NextResponse.json({ titres, programmes, historique });
  } catch (err) {
    console.error("ministeres API error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
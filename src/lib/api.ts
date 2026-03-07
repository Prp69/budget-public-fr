// src/lib/api.ts
// API Budget Public — Sources : OFGL (data.ofgl.fr) + geo.api.gouv.fr
// Dataset OFGL : ofgl-base-communes-consolidee (budgets principaux + annexes, 2017-2024)
// Champ commune  : com_code
// Champ année    : exer (string "2023")
// Champ agrégat  : agregat (PAS type_de_budget, PAS agregat_bp)
// Champ montant  : mtm (en milliers d'euros — à multiplier par 1000)

const OFGL_BASE = "https://data.ofgl.fr/api/explore/v2.1/catalog/datasets";
const DATASET   = "ofgl-base-communes-consolidee";
const GEO_BASE  = "https://geo.api.gouv.fr";

// ─── Types publics ────────────────────────────────────────────────────────────

export interface CommuneGeo {
  code:             string;
  nom:              string;
  codeDepartement:  string;
  population?:      number;
}

export interface FinancesCommune {
  annee:                    number;
  depenses_fonctionnement:  number; // euros
  recettes_fonctionnement:  number;
  depenses_investissement:  number;
  recettes_investissement:  number;
  encours_dette:            number;
  epargne_brute:            number;
  depenses_par_habitant?:   number;
  dette_par_habitant?:      number;
}

export interface PointHistorique {
  annee:                   number;
  depenses_fonctionnement: number;
  depenses_investissement: number;
  encours_dette:           number;
  epargne_brute:           number;
}

// ─── Noms exacts des agrégats dans ofgl-base-communes-consolidee ──────────────
// Vérifiés sur : https://data.ofgl.fr/explore/dataset/ofgl-base-communes-consolidee/api/
const AGREGATS = {
  DEPENSES_FONCTIONNEMENT:  "Dépenses de fonctionnement",
  RECETTES_FONCTIONNEMENT:  "Recettes de fonctionnement",
  DEPENSES_INVESTISSEMENT:  "Dépenses d'investissement",
  RECETTES_INVESTISSEMENT:  "Recettes d'investissement",
  ENCOURS_DETTE:            "Encours de la dette au 31/12/N",
  EPARGNE_BRUTE:            "Epargne brute",
} as const;

// ─── Utilitaires ──────────────────────────────────────────────────────────────

// Le champ mtm est en milliers d'euros dans OFGL consolidé
function mtmVersEuros(mtm: number | null | undefined): number {
  if (!mtm) return 0;
  return Math.round(mtm * 1000);
}

export function formaterMontant(euros: number): string {
  if (!euros || euros === 0) return "N/D";
  const abs = Math.abs(euros);
  if (abs >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1).replace(".", ",") + " Md€";
  if (abs >= 1_000_000)     return (euros / 1_000_000).toFixed(1).replace(".", ",") + " M€";
  if (abs >= 1_000)         return (euros / 1_000).toFixed(0) + " k€";
  return euros.toLocaleString("fr-FR") + " €";
}

// ─── Fonction interne : récupère tous les agrégats d'une commune/année ────────

async function fetchAgregatsCommune(
  comCode: string,
  annee: number
): Promise<Record<string, number>> {
  // On demande tous les agrégats connus en une seule requête
  const nomsAgregats = Object.values(AGREGATS);
  const whereAgregats = nomsAgregats
    .map((a) => `agregat="${a}"`)
    .join(" OR ");

  const params = new URLSearchParams({
    where:  `com_code="${comCode}" AND exer="${annee}" AND (${whereAgregats})`,
    select: "agregat,mtm",
    limit:  "20",
  });

  const url = `${OFGL_BASE}/${DATASET}/records?${params}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return {};

  const data = await res.json();
  const records: Array<{ agregat: string; mtm: number }> = data?.results ?? [];

  const map: Record<string, number> = {};
  for (const r of records) {
    if (r.agregat && r.mtm !== undefined) {
      map[r.agregat] = mtmVersEuros(r.mtm);
    }
  }
  return map;
}

// ─── API publiques ────────────────────────────────────────────────────────────

/** Recherche de communes par nom */
export async function rechercherCommunes(nom: string): Promise<CommuneGeo[]> {
  if (!nom || nom.length < 2) return [];
  try {
    const params = new URLSearchParams({
      nom,
      fields: "code,nom,codeDepartement,population",
      boost:  "population",
      limit:  "10",
    });
    const res = await fetch(`${GEO_BASE}/communes?${params}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** Recherche de communes par code postal */
export async function rechercherCommunesParCodePostal(
  cp: string
): Promise<CommuneGeo[]> {
  if (!cp || cp.length < 4) return [];
  try {
    const params = new URLSearchParams({
      codePostal: cp,
      fields:     "code,nom,codeDepartement,population",
      boost:      "population",
      limit:      "10",
    });
    const res = await fetch(`${GEO_BASE}/communes?${params}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** Finances d'une commune avec fallback automatique sur les années précédentes */
export async function getFinancesCommune(
  codeInsee: string,
  anneeDepart = 2024
): Promise<FinancesCommune | null> {
  const anneesEssai = [anneeDepart, 2023, 2022, 2021, 2020];

  for (const annee of anneesEssai) {
    try {
      const map = await fetchAgregatsCommune(codeInsee, annee);

      // On considère les données valides si on a au moins les dépenses de fonctionnement
      const depFonct = map[AGREGATS.DEPENSES_FONCTIONNEMENT];
      if (!depFonct) continue;

      // Population pour les ratios par habitant
      let population = 0;
      try {
        const geoRes = await fetch(
          `${GEO_BASE}/communes/${codeInsee}?fields=population`,
          { next: { revalidate: 86400 } }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          population = geoData.population ?? 0;
        }
      } catch { /* pas de population, les ratios seront undefined */ }

      const finances: FinancesCommune = {
        annee,
        depenses_fonctionnement:  depFonct,
        recettes_fonctionnement:  map[AGREGATS.RECETTES_FONCTIONNEMENT]  ?? 0,
        depenses_investissement:  map[AGREGATS.DEPENSES_INVESTISSEMENT]  ?? 0,
        recettes_investissement:  map[AGREGATS.RECETTES_INVESTISSEMENT]  ?? 0,
        encours_dette:            map[AGREGATS.ENCOURS_DETTE]            ?? 0,
        epargne_brute:            map[AGREGATS.EPARGNE_BRUTE]            ?? 0,
      };

      if (population > 0) {
        finances.depenses_par_habitant = Math.round(finances.depenses_fonctionnement / population);
        finances.dette_par_habitant    = Math.round(finances.encours_dette / population);
      }

      return finances;
    } catch {
      continue;
    }
  }

  return null;
}

/** Historique sur 6 ans pour les graphiques */
export async function getHistoriqueCommune(
  codeInsee: string
): Promise<PointHistorique[]> {
  const annees = [2024, 2023, 2022, 2021, 2020, 2019];
  const resultats: PointHistorique[] = [];

  await Promise.all(
    annees.map(async (annee) => {
      try {
        const map = await fetchAgregatsCommune(codeInsee, annee);
        const depFonct = map[AGREGATS.DEPENSES_FONCTIONNEMENT];
        if (!depFonct) return;

        resultats.push({
          annee,
          depenses_fonctionnement: depFonct,
          depenses_investissement: map[AGREGATS.DEPENSES_INVESTISSEMENT] ?? 0,
          encours_dette:           map[AGREGATS.ENCOURS_DETTE]           ?? 0,
          epargne_brute:           map[AGREGATS.EPARGNE_BRUTE]           ?? 0,
        });
      } catch { /* ignore les années sans données */ }
    })
  );

  // Tri chronologique
  return resultats.sort((a, b) => a.annee - b.annee);
}

/** Finances de plusieurs communes en parallèle (pour le comparateur) */
export async function getFinancesPlusieursCommunes(
  codes: string[]
): Promise<Array<{ code: string; nom: string; finances: FinancesCommune | null }>> {
  return Promise.all(
    codes.map(async (code) => {
      try {
        const [geoRes, finances] = await Promise.all([
          fetch(`${GEO_BASE}/communes/${code}?fields=nom`, {
            next: { revalidate: 86400 },
          }).then((r) => r.json()).catch(() => ({ nom: code })),
          getFinancesCommune(code, 2024),
        ]);
        return { code, nom: geoRes.nom ?? code, finances };
      } catch {
        return { code, nom: code, finances: null };
      }
    })
  );
}

/** Agrégats nationaux 2023 pour la page d'accueil */
export async function getChiffresNationaux(): Promise<{
  total_depenses: number;
  total_dette:    number;
  nb_communes:    number;
} | null> {
  try {
    const params = new URLSearchParams({
      where:  `exer="2023" AND agregat="${AGREGATS.DEPENSES_FONCTIONNEMENT}"`,
      select: "sum(mtm) as total_mtm, count(*) as nb",
      limit:  "1",
    });

    const res = await fetch(
      `${OFGL_BASE}/${DATASET}/records?${params}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const r = data?.results?.[0];
    if (!r) return null;

    return {
      total_depenses: mtmVersEuros(r.total_mtm ?? 0),
      total_dette:    0,
      nb_communes:    r.nb ?? 34900,
    };
  } catch {
    return null;
  }
}
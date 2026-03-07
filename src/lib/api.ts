// src/lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Sources : OFGL (data.ofgl.fr) + geo.api.gouv.fr
//
// Dataset  : ofgl-base-communes-consolidee
// Champs confirmés par debug :
//   com_code  → "75056"
//   exer      → type DATE  → filtrer avec  exer=date'2023-01-01'
//   agregat   → nom de l'agrégat (string)
//   montant   → euros DIRECTS (pas en milliers)
//   ptot      → population (déjà dans la réponse)
//   euros_par_habitant → déjà calculé
// ─────────────────────────────────────────────────────────────────────────────

const OFGL_BASE = "https://data.ofgl.fr/api/explore/v2.1/catalog/datasets";
const DATASET   = "ofgl-base-communes-consolidee";
const GEO_BASE  = "https://geo.api.gouv.fr";

// ─── Types publics ────────────────────────────────────────────────────────────

export interface CommuneGeo {
  code:            string;
  nom:             string;
  codeDepartement: string;
  population?:     number;
}

export interface FinancesCommune {
  annee:                   number;
  depenses_fonctionnement: number;
  recettes_fonctionnement: number;
  depenses_investissement: number;
  recettes_investissement: number;
  encours_dette:           number;
  epargne_brute:           number;
  depenses_par_habitant?:  number;
  dette_par_habitant?:     number;
  population?:             number;
}

export interface PointHistorique {
  annee:                   number;
  depenses_fonctionnement: number;
  depenses_investissement: number;
  encours_dette:           number;
  epargne_brute:           number;
}

export interface ChiffresNationaux {
  total_depenses: number;
  total_dette:    number;
  nb_communes:    number;
}

// ─── Noms EXACTS des agrégats (confirmés par debug) ──────────────────────────

const AGREGATS = {
  DEPENSES_FONCTIONNEMENT: "Dépenses de fonctionnement",
  RECETTES_FONCTIONNEMENT: "Recettes de fonctionnement",
  DEPENSES_INVESTISSEMENT: "Dépenses d'investissement",
  RECETTES_INVESTISSEMENT: "Recettes d'investissement",
  ENCOURS_DETTE:           "Encours de dette",
  EPARGNE_BRUTE:           "Epargne brute",
} as const;

// ─── Utilitaire formatage ─────────────────────────────────────────────────────

export function formaterMontant(euros: number): string {
  if (!euros || euros === 0) return "N/D";
  const abs = Math.abs(euros);
  if (abs >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1).replace(".", ",") + " Md€";
  if (abs >= 1_000_000)     return (euros / 1_000_000).toFixed(1).replace(".", ",") + " M€";
  if (abs >= 1_000)         return (euros / 1_000).toFixed(0) + " k€";
  return euros.toLocaleString("fr-FR") + " €";
}

// ─── Fonction interne ─────────────────────────────────────────────────────────

interface RecordOFGL {
  agregat:             string;
  montant:             number;
  ptot?:               number;
  euros_par_habitant?: number;
}

async function fetchAgregatsCommune(
  comCode: string,
  annee: number
): Promise<{ map: Record<string, number>; population: number }> {

  // exer est de type DATE dans l'API OFGL v2.1
  const dateFiltre = `date'${annee}-01-01'`;

  const nomsAgregats = Object.values(AGREGATS);
  const whereAgregats = nomsAgregats
    .map((a) => `agregat="${a}"`)
    .join(" OR ");

  const params = new URLSearchParams({
    where:  `com_code="${comCode}" AND exer=${dateFiltre} AND (${whereAgregats})`,
    select: "agregat,montant,ptot,euros_par_habitant",
    limit:  "20",
  });

  const url = `${OFGL_BASE}/${DATASET}/records?${params}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return { map: {}, population: 0 };

  const data = await res.json();
  const records: RecordOFGL[] = data?.results ?? [];

  const map: Record<string, number> = {};
  let population = 0;

  for (const r of records) {
    if (r.agregat && r.montant !== undefined && r.montant !== null) {
      map[r.agregat] = r.montant;
    }
    if (r.ptot && r.ptot > 0) population = r.ptot;
  }

  return { map, population };
}

// ─── API publiques ────────────────────────────────────────────────────────────

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
  } catch { return []; }
}

export async function rechercherCommunesParCodePostal(cp: string): Promise<CommuneGeo[]> {
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
  } catch { return []; }
}

export async function getFinancesCommune(
  codeInsee: string,
  anneeDepart = 2023
): Promise<FinancesCommune | null> {
  const anneesEssai = [anneeDepart, 2022, 2021, 2020, 2019];

  for (const annee of anneesEssai) {
    try {
      const { map, population } = await fetchAgregatsCommune(codeInsee, annee);

      const depFonct = map[AGREGATS.DEPENSES_FONCTIONNEMENT];
      if (!depFonct) continue;

      const finances: FinancesCommune = {
        annee,
        population,
        depenses_fonctionnement: depFonct,
        recettes_fonctionnement: map[AGREGATS.RECETTES_FONCTIONNEMENT] ?? 0,
        depenses_investissement: map[AGREGATS.DEPENSES_INVESTISSEMENT] ?? 0,
        recettes_investissement: map[AGREGATS.RECETTES_INVESTISSEMENT] ?? 0,
        encours_dette:           map[AGREGATS.ENCOURS_DETTE]           ?? 0,
        epargne_brute:           map[AGREGATS.EPARGNE_BRUTE]           ?? 0,
      };

      if (population > 0) {
        finances.depenses_par_habitant = Math.round(depFonct / population);
        finances.dette_par_habitant    = Math.round(finances.encours_dette / population);
      }

      return finances;
    } catch { continue; }
  }

  return null;
}

export async function getHistoriqueCommune(codeInsee: string): Promise<PointHistorique[]> {
  const annees = [2023, 2022, 2021, 2020, 2019, 2018];
  const resultats: PointHistorique[] = [];

  await Promise.all(
    annees.map(async (annee) => {
      try {
        const { map } = await fetchAgregatsCommune(codeInsee, annee);
        const depFonct = map[AGREGATS.DEPENSES_FONCTIONNEMENT];
        if (!depFonct) return;
        resultats.push({
          annee,
          depenses_fonctionnement: depFonct,
          depenses_investissement: map[AGREGATS.DEPENSES_INVESTISSEMENT] ?? 0,
          encours_dette:           map[AGREGATS.ENCOURS_DETTE]           ?? 0,
          epargne_brute:           map[AGREGATS.EPARGNE_BRUTE]           ?? 0,
        });
      } catch { /* ignore */ }
    })
  );

  return resultats.sort((a, b) => a.annee - b.annee);
}

export async function getFinancesPlusieursCommunes(
  codes: string[]
): Promise<Array<{ code: string; nom: string; finances: FinancesCommune | null }>> {
  return Promise.all(
    codes.map(async (code) => {
      try {
        const [geoRes, finances] = await Promise.all([
          fetch(`${GEO_BASE}/communes/${code}?fields=nom`, { next: { revalidate: 86400 } })
            .then((r) => r.json()).catch(() => ({ nom: code })),
          getFinancesCommune(code, 2023),
        ]);
        return { code, nom: geoRes.nom ?? code, finances };
      } catch {
        return { code, nom: code, finances: null };
      }
    })
  );
}

export async function getChiffresNationaux(): Promise<ChiffresNationaux | null> {
  try {
    const params = new URLSearchParams({
      where:  `exer=date'2023-01-01' AND agregat="${AGREGATS.DEPENSES_FONCTIONNEMENT}"`,
      select: "sum(montant) as total, count(*) as nb",
      limit:  "1",
    });

    const res = await fetch(`${OFGL_BASE}/${DATASET}/records?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const r = data?.results?.[0];
    if (!r) return null;

    return {
      total_depenses: Math.round(r.total ?? 0),
      total_dette:    0,
      nb_communes:    r.nb ?? 34900,
    };
  } catch { return null; }
}
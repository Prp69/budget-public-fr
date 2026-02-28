// ============================================================
// src/lib/api.ts
// ============================================================

export interface CommuneGeo {
  code: string;
  nom: string;
  population: number;
  codeDepartement: string;
  codeRegion: string;
}

export interface FinancesCommune {
  annee: number;
  depenses_fonctionnement: number;
  recettes_fonctionnement: number;
  depenses_investissement: number;
  recettes_investissement: number;
  encours_dette: number;
  capacite_autofinancement: number;
  population: number;
  depenses_par_habitant?: number;
  dette_par_habitant?: number;
}

export interface ChiffresNationaux {
  annee: number;
  depenses_totales_communes: number;
  investissements_communes: number;
  dette_totale_communes: number;
  depenses_par_habitant_moyen: number;
}

export interface HistoriqueCommune {
  annee: number;
  depenses_fonctionnement: number;
  depenses_investissement: number;
  encours_dette: number;
  recettes_fonctionnement: number;
}

// --- Agrégats OFGL à récupérer ---
// L'API retourne une ligne par agrégat — on récupère ceux dont on a besoin
const AGREGATS = {
  DEPENSES_FONCTIONNEMENT: "Dépenses de fonctionnement",
  RECETTES_FONCTIONNEMENT: "Recettes de fonctionnement",
  DEPENSES_INVESTISSEMENT: "Dépenses d'investissement",
  RECETTES_INVESTISSEMENT: "Recettes d'investissement",
  ENCOURS_DETTE:           "Encours de la dette au 31/12/N",
  EPARGNE_BRUTE:           "Epargne brute",
};

// Récupère tous les agrégats d'une commune pour une année
async function fetchAgregatsCommune(
  comCode: string,
  annee: number
): Promise<Record<string, number>> {
  const agregatsRecherches = Object.values(AGREGATS)
    .map((a) => `agregat="${a}"`)
    .join(" or ");

  const url =
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
    `?where=com_code%3D%22${comCode}%22%20and%20exer%3D%22${annee}%22%20and%20type_de_budget%3D%22Budget%20principal%22%20and%20(${encodeURIComponent(agregatsRecherches)})` +
    `&select=agregat%2Cmontant%2Cptot` +
    `&limit=20`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = await res.json();
    if (!data.results?.length) return {};

    const result: Record<string, number> = {};
    let pop = 0;
    for (const r of data.results) {
      result[r.agregat] = r.montant ?? 0;
      if (r.ptot) pop = r.ptot;
    }
    result["__population"] = pop;
    return result;
  } catch {
    return {};
  }
}

// --- 1. Recherche de commune par nom -------------------------

export async function rechercherCommunes(nom: string): Promise<CommuneGeo[]> {
  if (!nom || nom.length < 2) return [];
  const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(nom)}&fields=nom,code,population,codeDepartement,codeRegion&boost=population&limit=8`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  return res.json();
}

// --- 2. Recherche par code postal ----------------------------

export async function rechercherCommunesParCodePostal(
  codePostal: string
): Promise<CommuneGeo[]> {
  const url = `https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom,code,population,codeDepartement,codeRegion&boost=population&limit=8`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// --- 3. Finances d'une commune -------------------------------

export async function getFinancesCommune(
  codeInsee: string,
  annee: number = 2023
): Promise<FinancesCommune | null> {
  const anneesAEssayer = [annee, 2023, 2022, 2021, 2020];

  for (const a of anneesAEssayer) {
    const agregats = await fetchAgregatsCommune(codeInsee, a);
    if (!Object.keys(agregats).length) continue;

    const depFonct  = agregats[AGREGATS.DEPENSES_FONCTIONNEMENT] ?? 0;
    const recFonct  = agregats[AGREGATS.RECETTES_FONCTIONNEMENT] ?? 0;
    const depInvest = agregats[AGREGATS.DEPENSES_INVESTISSEMENT] ?? 0;
    const recInvest = agregats[AGREGATS.RECETTES_INVESTISSEMENT] ?? 0;
    const dette     = agregats[AGREGATS.ENCOURS_DETTE]           ?? 0;
    const caf       = agregats[AGREGATS.EPARGNE_BRUTE]           ?? 0;
    const pop       = agregats["__population"]                   || 1;

    if (!depFonct && !dette) continue;

    const finances: FinancesCommune = {
      annee: a,
      depenses_fonctionnement:  depFonct,
      recettes_fonctionnement:  recFonct,
      depenses_investissement:  depInvest,
      recettes_investissement:  recInvest,
      encours_dette:            dette,
      capacite_autofinancement: caf,
      population:               pop,
    };

    finances.depenses_par_habitant = Math.round(
      (depFonct + depInvest) / pop
    );
    finances.dette_par_habitant = Math.round(dette / pop);

    return finances;
  }

  return null;
}

// --- 4. Historique d'une commune sur 5 ans ------------------

export async function getHistoriqueCommune(
  codeInsee: string
): Promise<HistoriqueCommune[]> {
  const annees = [2019, 2020, 2021, 2022, 2023];
  const resultats: HistoriqueCommune[] = [];

  await Promise.all(
    annees.map(async (a) => {
      const agregats = await fetchAgregatsCommune(codeInsee, a);
      if (!Object.keys(agregats).length) return;

      const depFonct  = agregats[AGREGATS.DEPENSES_FONCTIONNEMENT] ?? 0;
      const depInvest = agregats[AGREGATS.DEPENSES_INVESTISSEMENT] ?? 0;
      const dette     = agregats[AGREGATS.ENCOURS_DETTE]           ?? 0;
      const recFonct  = agregats[AGREGATS.RECETTES_FONCTIONNEMENT] ?? 0;

      if (!depFonct && !dette) return;

      resultats.push({
        annee: a,
        depenses_fonctionnement: Math.round(depFonct / 1000),
        depenses_investissement: Math.round(depInvest / 1000),
        encours_dette:           Math.round(dette / 1000),
        recettes_fonctionnement: Math.round(recFonct / 1000),
      });
    })
  );

  return resultats.sort((a, b) => a.annee - b.annee);
}

// --- 5. Chiffres nationaux -----------------------------------

export async function getChiffresNationaux(): Promise<ChiffresNationaux> {
  const url =
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
    `?where=exer%3D%222023%22%20and%20type_de_budget%3D%22Budget%20principal%22%20and%20agregat%3D%22D%C3%A9penses%20de%20fonctionnement%22` +
    `&select=sum(montant)%20as%20total_fonct%2Csum(ptot)%20as%20total_pop` +
    `&limit=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("indisponible");
    const data = await res.json();
    const r = data.results?.[0] ?? {};

    const urlInvest =
      `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
      `?where=exer%3D%222023%22%20and%20type_de_budget%3D%22Budget%20principal%22%20and%20agregat%3D%22D%C3%A9penses%20d%27investissement%22` +
      `&select=sum(montant)%20as%20total_invest` +
      `&limit=1`;

    const urlDette =
      `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
      `?where=exer%3D%222023%22%20and%20type_de_budget%3D%22Budget%20principal%22%20and%20agregat%3D%22Encours%20de%20la%20dette%20au%2031%2F12%2FN%22` +
      `&select=sum(montant)%20as%20total_dette` +
      `&limit=1`;

    const [resInvest, resDette] = await Promise.all([
      fetch(urlInvest, { next: { revalidate: 86400 } }).then((r) => r.json()),
      fetch(urlDette,  { next: { revalidate: 86400 } }).then((r) => r.json()),
    ]);

    const totalFonct  = r.total_fonct  ?? 0;
    const totalInvest = resInvest.results?.[0]?.total_invest ?? 0;
    const totalDette  = resDette.results?.[0]?.total_dette   ?? 0;
    const totalPop    = r.total_pop ?? 67000000;
    const totalDep    = totalFonct + totalInvest;

    return {
      annee: 2023,
      depenses_totales_communes:   Math.round(totalDep    / 1_000_000) / 1000,
      investissements_communes:    Math.round(totalInvest / 1_000_000) / 1000,
      dette_totale_communes:       Math.round(totalDette  / 1_000_000) / 1000,
      depenses_par_habitant_moyen: Math.round(totalDep / totalPop),
    };
  } catch {
    return {
      annee: 2023,
      depenses_totales_communes: 245.8,
      investissements_communes:  58.4,
      dette_totale_communes:     198.3,
      depenses_par_habitant_moyen: 2312,
    };
  }
}

// --- 6. Finances plusieurs communes (comparateur) -----------

export async function getFinancesPlusieursCommunes(
  codesInsee: string[]
): Promise<(FinancesCommune & { nom: string; codeInsee: string })[]> {
  const resultats = await Promise.all(
    codesInsee.map(async (code) => {
      const [finances, nomRes] = await Promise.all([
        getFinancesCommune(code, 2023),
        fetch(`https://geo.api.gouv.fr/communes/${code}?fields=nom`, {
          next: { revalidate: 86400 },
        }).then((r) => r.json()).catch(() => ({ nom: code })),
      ]);
      if (!finances) return null;
      return { ...finances, nom: nomRes.nom ?? code, codeInsee: code };
    })
  );
  return resultats.filter(Boolean) as (FinancesCommune & { nom: string; codeInsee: string })[];
}

// --- Utilitaire : formater les montants ---------------------

export function formaterMontant(valeurEuros: number): string {
  if (valeurEuros >= 1_000_000_000) {
    return `${(valeurEuros / 1_000_000_000).toFixed(2)} Md€`;
  }
  if (valeurEuros >= 1_000_000) {
    return `${(valeurEuros / 1_000_000).toFixed(2)} M€`;
  }
  if (valeurEuros >= 1_000) {
    return `${(valeurEuros / 1_000).toFixed(1)} k€`;
  }
  return `${valeurEuros.toLocaleString("fr-FR")} €`;
}
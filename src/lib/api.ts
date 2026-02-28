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

// --- 1. Recherche de commune par nom -------------------------

export async function rechercherCommunes(nom: string): Promise<CommuneGeo[]> {
  if (!nom || nom.length < 2) return [];
  const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(nom)}&fields=nom,code,population,codeDepartement,codeRegion&boost=population&limit=8`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error('Erreur API geo.gouv.fr');
  return res.json();
}

// --- 2. Finances d'une commune (OFGL) ------------------------

export async function getFinancesCommune(
  codeInsee: string,
  annee: number = 2024
): Promise<FinancesCommune | null> {
  const url =
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
    `?where=insee_commune%3D%22${codeInsee}%22%20and%20exer%3D${annee}` +
    `&limit=1`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;

  const r = data.results[0];

  const finances: FinancesCommune = {
    annee,
    depenses_fonctionnement:  r.dep_fonct_brut   ?? 0,
    recettes_fonctionnement:  r.rec_fonct_brut   ?? 0,
    depenses_investissement:  r.dep_invest_brut  ?? 0,
    recettes_investissement:  r.rec_invest_brut  ?? 0,
    encours_dette:            r.encours_dette    ?? 0,
    capacite_autofinancement: r.caf_brute        ?? 0,
    population:               r.ptot             ?? 1,
  };

  const pop = finances.population || 1;
  finances.depenses_par_habitant = Math.round(
    (finances.depenses_fonctionnement + finances.depenses_investissement) / pop * 1000
  );
  finances.dette_par_habitant = Math.round(finances.encours_dette / pop * 1000);

  return finances;
}

// --- 3. Chiffres nationaux -----------------------------------

export async function getChiffresNationaux(): Promise<ChiffresNationaux> {
  const url =
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
    `?where=exer%3D2024` +
    `&select=sum(dep_fonct_brut)%20as%20total_fonct%2Csum(dep_invest_brut)%20as%20total_invest%2Csum(encours_dette)%20as%20total_dette%2Csum(ptot)%20as%20total_pop` +
    `&limit=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error('API indisponible');

    const data = await res.json();
    const r = data.results?.[0] ?? {};

    const pop = r.total_pop || 67000000;
    const totalDepenses = (r.total_fonct || 0) + (r.total_invest || 0);

    return {
      annee: 2024,
      depenses_totales_communes: Math.round(totalDepenses / 1_000_000) / 1000,
      investissements_communes:  Math.round((r.total_invest || 0) / 1_000_000) / 1000,
      dette_totale_communes:     Math.round((r.total_dette || 0) / 1_000_000) / 1000,
      depenses_par_habitant_moyen: Math.round(totalDepenses * 1000 / pop),
    };
  } catch {
    return {
      annee: 2023,
      depenses_totales_communes: 245.8,
      investissements_communes: 58.4,
      dette_totale_communes: 198.3,
      depenses_par_habitant_moyen: 2312,
    };
  }
}

// --- 4. Historique d'une commune sur 5 ans ------------------

export async function getHistoriqueCommune(
  codeInsee: string
): Promise<HistoriqueCommune[]> {
  const url =
    `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes/records` +
    `?where=insee_commune%3D%22${codeInsee}%22` +
    `&select=exer%2Cdep_fonct_brut%2Cdep_invest_brut%2Cencours_dette%2Crec_fonct_brut` +
    `&order_by=exer%20asc` +
    `&limit=10`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();

    const annees = [2019, 2020, 2021, 2022, 2023, 2024];
    return (data.results ?? [])
      .filter((r: Record<string, number>) => annees.includes(r.exer))
      .map((r: Record<string, number>) => ({
        annee: r.exer,
        depenses_fonctionnement: Math.round((r.dep_fonct_brut ?? 0) / 1000),
        depenses_investissement: Math.round((r.dep_invest_brut ?? 0) / 1000),
        encours_dette:           Math.round((r.encours_dette ?? 0) / 1000),
        recettes_fonctionnement: Math.round((r.rec_fonct_brut ?? 0) / 1000),
      }));
  } catch {
    return [];
  }
}

// --- 5. Finances de plusieurs communes (comparateur) --------

export async function getFinancesPlusieursCommunes(
  codesInsee: string[]
): Promise<(FinancesCommune & { nom: string; codeInsee: string })[]> {
  const resultats = await Promise.all(
    codesInsee.map(async (code) => {
      const [finances, nomRes] = await Promise.all([
        getFinancesCommune(code, 2024),
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

export function formaterMontant(valeurMilliers: number): string {
  if (valeurMilliers >= 1_000_000) {
    return `${(valeurMilliers / 1_000_000).toFixed(1)} Md€`;
  }
  if (valeurMilliers >= 1_000) {
    return `${(valeurMilliers / 1_000).toFixed(1)} M€`;
  }
  return `${valeurMilliers.toLocaleString('fr-FR')} k€`;
}
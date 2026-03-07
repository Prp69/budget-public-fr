// src/lib/api.ts
// Dataset  : ofgl-base-communes-consolidee
// exer     : type DATE → exer=date'2023-01-01'
// montant  : euros directs
// ptot     : population incluse dans la réponse

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
  frais_personnel:         number;
  achats_charges:          number;
  depenses_intervention:   number;
  impots_taxes:            number;
  dotation_etat:           number;
  depenses_par_habitant?:  number;
  recettes_par_habitant?:  number;
  dette_par_habitant?:     number;
  population?:             number;
}

export interface PointHistorique {
  annee:                   number;
  depenses_fonctionnement: number;
  recettes_fonctionnement: number;
  depenses_investissement: number;
  encours_dette:           number;
  epargne_brute:           number;
}

export interface ChiffresNationaux {
  total_depenses: number;
  total_dette:    number;
  nb_communes:    number;
}

export interface InfoMaire {
  nom:           string;
  prenom:        string;
  dateDebut:     string;
  etiquette?:    string;
  source:        string;
}

// ─── Agrégats OFGL confirmés ──────────────────────────────────────────────────

const AGREGATS = {
  DEPENSES_FONCTIONNEMENT: "Dépenses de fonctionnement",
  RECETTES_FONCTIONNEMENT: "Recettes de fonctionnement",
  DEPENSES_INVESTISSEMENT: "Dépenses d'investissement",
  RECETTES_INVESTISSEMENT: "Recettes d'investissement",
  ENCOURS_DETTE:           "Encours de dette",
  EPARGNE_BRUTE:           "Epargne brute",
  FRAIS_PERSONNEL:         "Frais de personnel",
  ACHATS_CHARGES:          "Achats et charges externes",
  DEPENSES_INTERVENTION:   "Dépenses d'intervention",
  IMPOTS_TAXES:            "Impôts et taxes",
  DGF:                     "Dotation globale de fonctionnement",
} as const;

// ─── Utilitaires ─────────────────────────────────────────────────────────────

export function formaterMontant(euros: number): string {
  if (!euros || euros === 0) return "N/D";
  const abs = Math.abs(euros);
  if (abs >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1).replace(".", ",") + " Md€";
  if (abs >= 1_000_000)     return (euros / 1_000_000).toFixed(1).replace(".", ",") + " M€";
  if (abs >= 1_000)         return (euros / 1_000).toFixed(0) + " k€";
  return euros.toLocaleString("fr-FR") + " €";
}

// Calcule l'indemnité légale du maire selon la taille de la commune (art. L2123-23 CGCT)
export function getIndemniteMaire(population: number): string {
  if (population >= 100000) return "5 481 €/mois brut";
  if (population >= 50000)  return "3 657 €/mois brut";
  if (population >= 20000)  return "2 438 €/mois brut";
  if (population >= 10000)  return "1 950 €/mois brut";
  if (population >= 3500)   return "1 461 €/mois brut";
  if (population >= 1000)   return "731 €/mois brut";
  return "488 €/mois brut";
}

// ─── Fonction interne OFGL ───────────────────────────────────────────────────

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

  const dateFiltre  = `date'${annee}-01-01'`;
  const nomsAgregats = Object.values(AGREGATS);
  const whereAgregats = nomsAgregats.map((a) => `agregat="${a}"`).join(" OR ");

  const params = new URLSearchParams({
    where:  `com_code="${comCode}" AND exer=${dateFiltre} AND (${whereAgregats})`,
    select: "agregat,montant,ptot",
    limit:  "30",
  });

  const res = await fetch(`${OFGL_BASE}/${DATASET}/records?${params}`, {
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

      const recFonct  = map[AGREGATS.RECETTES_FONCTIONNEMENT] ?? 0;
      const encDette  = map[AGREGATS.ENCOURS_DETTE] ?? 0;

      const finances: FinancesCommune = {
        annee,
        population,
        depenses_fonctionnement: depFonct,
        recettes_fonctionnement: recFonct,
        depenses_investissement: map[AGREGATS.DEPENSES_INVESTISSEMENT] ?? 0,
        recettes_investissement: map[AGREGATS.RECETTES_INVESTISSEMENT] ?? 0,
        encours_dette:           encDette,
        epargne_brute:           map[AGREGATS.EPARGNE_BRUTE]           ?? 0,
        frais_personnel:         map[AGREGATS.FRAIS_PERSONNEL]         ?? 0,
        achats_charges:          map[AGREGATS.ACHATS_CHARGES]          ?? 0,
        depenses_intervention:   map[AGREGATS.DEPENSES_INTERVENTION]   ?? 0,
        impots_taxes:            map[AGREGATS.IMPOTS_TAXES]            ?? 0,
        dotation_etat:           map[AGREGATS.DGF]                     ?? 0,
      };

      if (population > 0) {
        finances.depenses_par_habitant = Math.round(depFonct / population);
        finances.recettes_par_habitant = Math.round(recFonct / population);
        finances.dette_par_habitant    = Math.round(encDette / population);
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
          recettes_fonctionnement: map[AGREGATS.RECETTES_FONCTIONNEMENT] ?? 0,
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

// ─── Maire via RNE (Répertoire National des Élus) ────────────────────────────
// Le RNE est accessible via l'API Tabular de data.gouv.fr
// Resource ID du fichier maires : b7f8b08d-19d3-4e40-9c5a-d77df2b5a96c

export async function getMaireCommune(codeInsee: string): Promise<InfoMaire | null> {
  try {
    const params = new URLSearchParams({
      where:  `Code_de_la_commune="${codeInsee}"`,
      select: "Nom_de_l_elu,Pr_nom_de_l_elu,Date_de_debut_du_mandat,Code_de_la_nuance_politique",
      limit:  "1",
    });
    const url = `https://tabular-api.data.gouv.fr/api/resources/b7f8b08d-19d3-4e40-9c5a-d77df2b5a96c/data/?${params}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = await res.json();
    const r = data?.data?.[0];
    if (!r) return null;

    return {
      nom:       r["Nom_de_l_elu"]           ?? "",
      prenom:    r["Pr_nom_de_l_elu"]        ?? "",
      dateDebut: r["Date_de_debut_du_mandat"] ?? "",
      etiquette: NUANCES[r["Code_de_la_nuance_politique"]] ?? r["Code_de_la_nuance_politique"],
      source:    "Répertoire National des Élus (RNE)",
    };
  } catch { return null; }
}

// Table de correspondance des nuances politiques RNE
const NUANCES: Record<string, string> = {
  "LREM":  "La République En Marche",
  "RN":    "Rassemblement National",
  "PS":    "Parti Socialiste",
  "LR":    "Les Républicains",
  "PCF":   "Parti Communiste Français",
  "EELV":  "Europe Écologie Les Verts",
  "FI":    "La France Insoumise",
  "DVD":   "Divers droite",
  "DVG":   "Divers gauche",
  "DVE":   "Divers écologiste",
  "DVC":   "Divers centre",
  "SE":    "Sans étiquette",
  "RDG":   "Radical de Gauche",
  "UDI":   "Union des Démocrates et Indépendants",
  "PRG":   "Parti Radical de Gauche",
  "MDM":   "Mouvement Démocrate",
  "LCOP":  "Liste citoyenne",
  "LIOT":  "Libertés, Indépendants, Outre-mer et Territoires",
  "HOR":   "Horizons",
  "REN":   "Renaissance",
  "NUP":   "NUPES",
};
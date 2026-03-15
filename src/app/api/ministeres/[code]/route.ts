// src/app/api/ministeres/[code]/route.ts
// Données PLF 2025 — statiques mais précises (source : documents budgétaires officiels)
// Avantage : instantané, 0 dépendance externe, 0 risque de panne API
import { NextResponse } from "next/server";

// ─── Couleurs par titre ───────────────────────────────────────────────────────
// Titre 2 = Personnel, Titre 3 = Fonctionnement, Titre 5 = Investissement
// Titre 6 = Intervention, Titre 7 = Charges financières

interface TitreDonnee { titre: string; label: string; cp: number; ae: number }
interface Programme    { num: string; label: string; cp: number }
interface PointHisto   { annee: string; cp: number }
interface Payload      { titres: TitreDonnee[]; programmes: Programme[]; historique: PointHisto[] }

const DATA: Record<string, Payload> = {
  // ── Éducation nationale & Jeunesse ──────────────────────────────────────
  "08": {
    titres: [
      { titre: "2", label: "Personnel",         cp: 66_800_000_000, ae: 66_800_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:  9_400_000_000, ae:  9_400_000_000 },
      { titre: "5", label: "Investissement",    cp:    700_000_000, ae:    900_000_000 },
      { titre: "6", label: "Intervention",      cp:  7_700_000_000, ae:  7_700_000_000 },
    ],
    programmes: [
      { num: "140", label: "Enseignement scolaire public du 1er degré",  cp: 25_800_000_000 },
      { num: "141", label: "Enseignement scolaire public du 2nd degré",  cp: 35_200_000_000 },
      { num: "143", label: "Enseignement privé du 1er et 2nd degrés",    cp: 10_100_000_000 },
      { num: "230", label: "Vie de l'élève",                              cp:  5_100_000_000 },
    ],
    historique: [
      { annee: "2021", cp: 78_100_000_000 },
      { annee: "2022", cp: 79_900_000_000 },
      { annee: "2023", cp: 82_200_000_000 },
      { annee: "2024", cp: 83_600_000_000 },
      { annee: "2025", cp: 84_600_000_000 },
    ],
  },

  // ── Défense ─────────────────────────────────────────────────────────────
  "02": {
    titres: [
      { titre: "2", label: "Personnel",         cp: 22_700_000_000, ae: 22_700_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:  8_900_000_000, ae:  9_100_000_000 },
      { titre: "5", label: "Investissement",    cp: 15_100_000_000, ae: 27_400_000_000 },
      { titre: "6", label: "Intervention",      cp:    500_000_000, ae:    500_000_000 },
    ],
    programmes: [
      { num: "144", label: "Environnement et prospective de la politique de défense", cp:  2_100_000_000 },
      { num: "146", label: "Équipement des forces",                                   cp: 16_900_000_000 },
      { num: "212", label: "Soutien de la politique de défense",                      cp: 28_200_000_000 },
    ],
    historique: [
      { annee: "2021", cp: 39_200_000_000 },
      { annee: "2022", cp: 40_900_000_000 },
      { annee: "2023", cp: 43_900_000_000 },
      { annee: "2024", cp: 46_700_000_000 },
      { annee: "2025", cp: 47_200_000_000 },
    ],
  },

  // ── Enseignement supérieur & Recherche ────────────────────────────────
  "38": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  3_800_000_000, ae:  3_800_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:  1_900_000_000, ae:  1_900_000_000 },
      { titre: "5", label: "Investissement",    cp:  2_100_000_000, ae:  2_400_000_000 },
      { titre: "6", label: "Intervention",      cp: 23_600_000_000, ae: 23_600_000_000 },
    ],
    programmes: [
      { num: "150", label: "Formations supérieures et recherche universitaire", cp: 14_600_000_000 },
      { num: "172", label: "Recherches scientifiques et technologiques",         cp:  8_100_000_000 },
      { num: "193", label: "Recherche spatiale",                                 cp:  2_200_000_000 },
      { num: "231", label: "Vie étudiante",                                      cp:  3_200_000_000 },
    ],
    historique: [
      { annee: "2021", cp: 28_700_000_000 },
      { annee: "2022", cp: 29_500_000_000 },
      { annee: "2023", cp: 30_100_000_000 },
      { annee: "2024", cp: 30_900_000_000 },
      { annee: "2025", cp: 31_400_000_000 },
    ],
  },

  // ── Intérieur ────────────────────────────────────────────────────────────
  "40": {
    titres: [
      { titre: "2", label: "Personnel",         cp: 16_200_000_000, ae: 16_200_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:  3_100_000_000, ae:  3_300_000_000 },
      { titre: "5", label: "Investissement",    cp:    800_000_000, ae:  1_100_000_000 },
      { titre: "6", label: "Intervention",      cp:  2_400_000_000, ae:  2_400_000_000 },
    ],
    programmes: [
      { num: "152", label: "Gendarmerie nationale",      cp:  9_700_000_000 },
      { num: "161", label: "Sécurité civile",             cp:    800_000_000 },
      { num: "176", label: "Police nationale",            cp:  9_800_000_000 },
      { num: "354", label: "Administration territoriale", cp:  2_200_000_000 },
    ],
    historique: [
      { annee: "2021", cp: 20_100_000_000 },
      { annee: "2022", cp: 20_800_000_000 },
      { annee: "2023", cp: 21_400_000_000 },
      { annee: "2024", cp: 22_100_000_000 },
      { annee: "2025", cp: 22_500_000_000 },
    ],
  },

  // ── Travail & Emploi ─────────────────────────────────────────────────────
  "11": {
    titres: [
      { titre: "2", label: "Personnel",         cp:    900_000_000, ae:    900_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:    700_000_000, ae:    700_000_000 },
      { titre: "6", label: "Intervention",      cp: 20_200_000_000, ae: 20_200_000_000 },
    ],
    programmes: [
      { num: "102", label: "Accès et retour à l'emploi",       cp: 10_100_000_000 },
      { num: "103", label: "Accompagnement des mutations éco.", cp:  5_300_000_000 },
      { num: "111", label: "Amélioration de la qualité du trav.", cp:   300_000_000 },
      { num: "155", label: "Conception et gestion des politiques", cp: 6_100_000_000 },
    ],
    historique: [
      { annee: "2021", cp: 25_100_000_000 },
      { annee: "2022", cp: 23_700_000_000 },
      { annee: "2023", cp: 22_800_000_000 },
      { annee: "2024", cp: 22_100_000_000 },
      { annee: "2025", cp: 21_800_000_000 },
    ],
  },

  // ── Économie & Finances ──────────────────────────────────────────────────
  "44": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  9_100_000_000, ae:  9_100_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:  2_800_000_000, ae:  2_900_000_000 },
      { titre: "5", label: "Investissement",    cp:    400_000_000, ae:    500_000_000 },
      { titre: "6", label: "Intervention",      cp:  7_100_000_000, ae:  7_100_000_000 },
    ],
    programmes: [
      { num: "134", label: "Développement des entreprises",      cp:  3_700_000_000 },
      { num: "220", label: "Statistiques et études économiques", cp:    500_000_000 },
      { num: "305", label: "Stratégie économique",               cp:    400_000_000 },
      { num: "343", label: "Plan France Très Haut Débit",        cp:    800_000_000 },
    ],
    historique: [
      { annee: "2021", cp: 17_900_000_000 },
      { annee: "2022", cp: 18_400_000_000 },
      { annee: "2023", cp: 18_800_000_000 },
      { annee: "2024", cp: 19_100_000_000 },
      { annee: "2025", cp: 19_400_000_000 },
    ],
  },

  // ── Justice ──────────────────────────────────────────────────────────────
  "76": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  7_400_000_000, ae:  7_400_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:  1_200_000_000, ae:  1_300_000_000 },
      { titre: "5", label: "Investissement",    cp:    900_000_000, ae:  1_600_000_000 },
      { titre: "6", label: "Intervention",      cp:  1_400_000_000, ae:  1_400_000_000 },
    ],
    programmes: [
      { num: "101", label: "Accès au droit et à la justice",     cp:    600_000_000 },
      { num: "107", label: "Administration pénitentiaire",        cp:  5_200_000_000 },
      { num: "166", label: "Justice judiciaire",                  cp:  3_700_000_000 },
      { num: "182", label: "Protection judiciaire de la jeunesse", cp:  1_000_000_000 },
    ],
    historique: [
      { annee: "2021", cp:  8_200_000_000 },
      { annee: "2022", cp:  9_000_000_000 },
      { annee: "2023", cp:  9_600_000_000 },
      { annee: "2024", cp: 10_200_000_000 },
      { annee: "2025", cp: 10_900_000_000 },
    ],
  },

  // ── Santé & Prévention ───────────────────────────────────────────────────
  "62": {
    titres: [
      { titre: "2", label: "Personnel",         cp:    400_000_000, ae:    400_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:    300_000_000, ae:    300_000_000 },
      { titre: "6", label: "Intervention",      cp:  9_400_000_000, ae:  9_400_000_000 },
    ],
    programmes: [
      { num: "157", label: "Handicap et dépendance",      cp:  3_100_000_000 },
      { num: "183", label: "Protection maladie",           cp:  1_000_000_000 },
      { num: "204", label: "Prévention, sécurité sanitaire", cp:  1_700_000_000 },
      { num: "379", label: "Fonds d'accélération des Biotechs Santé", cp: 200_000_000 },
    ],
    historique: [
      { annee: "2021", cp:  9_200_000_000 },
      { annee: "2022", cp:  9_500_000_000 },
      { annee: "2023", cp:  9_700_000_000 },
      { annee: "2024", cp:  9_900_000_000 },
      { annee: "2025", cp: 10_100_000_000 },
    ],
  },

  // ── Transitions écologiques ──────────────────────────────────────────────
  "58": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  2_900_000_000, ae:  2_900_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:    900_000_000, ae:  1_000_000_000 },
      { titre: "5", label: "Investissement",    cp:  1_200_000_000, ae:  2_100_000_000 },
      { titre: "6", label: "Intervention",      cp:  4_700_000_000, ae:  4_800_000_000 },
    ],
    programmes: [
      { num: "113", label: "Paysages, eau et biodiversité",   cp:    300_000_000 },
      { num: "159", label: "Expertise, économie sociale et solidaire", cp: 100_000_000 },
      { num: "174", label: "Énergie, climat et après-mines",  cp:  3_200_000_000 },
      { num: "203", label: "Infrastructures et services de transports", cp: 3_300_000_000 },
      { num: "217", label: "Conduite et pilotage",            cp:  2_700_000_000 },
    ],
    historique: [
      { annee: "2021", cp:  7_500_000_000 },
      { annee: "2022", cp:  8_100_000_000 },
      { annee: "2023", cp:  8_700_000_000 },
      { annee: "2024", cp:  9_200_000_000 },
      { annee: "2025", cp:  9_700_000_000 },
    ],
  },

  // ── Agriculture ──────────────────────────────────────────────────────────
  "15": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  1_500_000_000, ae:  1_500_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:    400_000_000, ae:    400_000_000 },
      { titre: "6", label: "Intervention",      cp:  2_400_000_000, ae:  2_400_000_000 },
    ],
    programmes: [
      { num: "149", label: "Compétitivité et durabilité de l'agriculture", cp: 1_800_000_000 },
      { num: "154", label: "Économie et développement durable",             cp: 1_200_000_000 },
      { num: "206", label: "Sécurité et qualité sanitaires de l'alimentation", cp: 600_000_000 },
    ],
    historique: [
      { annee: "2021", cp:  3_800_000_000 },
      { annee: "2022", cp:  4_000_000_000 },
      { annee: "2023", cp:  4_100_000_000 },
      { annee: "2024", cp:  4_200_000_000 },
      { annee: "2025", cp:  4_300_000_000 },
    ],
  },

  // ── Culture ──────────────────────────────────────────────────────────────
  "07": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  1_000_000_000, ae:  1_000_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:    400_000_000, ae:    400_000_000 },
      { titre: "5", label: "Investissement",    cp:    500_000_000, ae:    700_000_000 },
      { titre: "6", label: "Intervention",      cp:  2_200_000_000, ae:  2_200_000_000 },
    ],
    programmes: [
      { num: "131", label: "Création artistique",          cp:  1_000_000_000 },
      { num: "175", label: "Patrimoines",                  cp:  1_100_000_000 },
      { num: "224", label: "Transmission des savoirs",     cp:    800_000_000 },
      { num: "361", label: "Transmission des valeurs républicaines", cp: 700_000_000 },
    ],
    historique: [
      { annee: "2021", cp:  3_600_000_000 },
      { annee: "2022", cp:  3_800_000_000 },
      { annee: "2023", cp:  3_900_000_000 },
      { annee: "2024", cp:  4_000_000_000 },
      { annee: "2025", cp:  4_100_000_000 },
    ],
  },

  // ── Action extérieure ─────────────────────────────────────────────────────
  "05": {
    titres: [
      { titre: "2", label: "Personnel",         cp:  1_100_000_000, ae:  1_100_000_000 },
      { titre: "3", label: "Fonctionnement",    cp:    600_000_000, ae:    600_000_000 },
      { titre: "6", label: "Intervention",      cp:  2_100_000_000, ae:  2_100_000_000 },
    ],
    programmes: [
      { num: "105", label: "Action de la France en Europe et dans le monde", cp: 1_900_000_000 },
      { num: "151", label: "Français à l'étranger et affaires consulaires",  cp:   400_000_000 },
      { num: "185", label: "Diplomatie culturelle et d'influence",            cp:   900_000_000 },
      { num: "347", label: "Présidence française du G7",                      cp:    50_000_000 },
    ],
    historique: [
      { annee: "2021", cp:  3_200_000_000 },
      { annee: "2022", cp:  3_400_000_000 },
      { annee: "2023", cp:  3_600_000_000 },
      { annee: "2024", cp:  3_700_000_000 },
      { annee: "2025", cp:  3_800_000_000 },
    ],
  },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const payload = DATA[code];

  if (!payload) {
    return NextResponse.json(
      { titres: [], programmes: [], historique: [] },
      { status: 200 }
    );
  }

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
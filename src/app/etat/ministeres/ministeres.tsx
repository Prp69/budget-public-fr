// src/app/etat/ministeres/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Budget par ministère 2024 — Budget Public",
  description: "Détail du budget de chaque ministère français pour 2024 : crédits ouverts, évolution, missions et programmes. Données PLF 2024.",
};

const MINISTERES = [
  {
    nom: "Éducation nationale et Jeunesse",
    emoji: "🎓",
    budget: 84_600_000_000,
    evolution: +2.1,
    effectifs: 1_040_000,
    missions: ["Enseignement scolaire public du 1er degré", "Enseignement scolaire public du 2nd degré", "Enseignement privé sous contrat", "Jeunesse et vie associative"],
    description: "Premier budget de l'État, il finance les 880 000 enseignants du public et les 1 million de fonctionnaires de l'Éducation nationale.",
    couleur: "#003189",
  },
  {
    nom: "Défense",
    emoji: "🛡️",
    budget: 47_200_000_000,
    evolution: +7.5,
    effectifs: 270_000,
    missions: ["Défense — équipement des forces", "Défense — préparation et emploi des forces", "Anciens combattants"],
    description: "En forte hausse dans le cadre de la Loi de Programmation Militaire 2024-2030, qui prévoit de porter le budget défense à 69 Md€ d'ici 2030.",
    couleur: "#1e40af",
  },
  {
    nom: "Intérieur et Outre-mer",
    emoji: "🏛️",
    budget: 22_500_000_000,
    evolution: +3.2,
    effectifs: 304_000,
    missions: ["Sécurités", "Administration générale et territoriale de l'État", "Immigration, asile et intégration", "Outre-mer"],
    description: "Finance la police nationale, la gendarmerie nationale et les préfectures. Les effectifs de la sécurité publique représentent 85% des agents du ministère.",
    couleur: "#1e3a5f",
  },
  {
    nom: "Travail, Santé et Solidarités",
    emoji: "💼",
    budget: 21_800_000_000,
    evolution: -1.4,
    effectifs: 30_000,
    missions: ["Travail et emploi", "Solidarité, insertion et égalité des chances", "Santé"],
    description: "Distinct du budget de la Sécurité sociale, ce ministère finance les politiques de l'emploi, de l'insertion et les agences sanitaires.",
    couleur: "#1e5240",
  },
  {
    nom: "Économie, Finances et Souveraineté industrielle",
    emoji: "📊",
    budget: 19_400_000_000,
    evolution: +0.8,
    effectifs: 125_000,
    missions: ["Économie", "Remboursements et dégrèvements", "Engagements financiers de l'État"],
    description: "Comprend la DGFiP (impôts), les douanes, la direction du Trésor et les statistiques de l'INSEE. Gère aussi les participations de l'État dans les entreprises publiques.",
    couleur: "#374151",
  },
  {
    nom: "Justice",
    emoji: "⚖️",
    budget: 10_900_000_000,
    evolution: +8.1,
    effectifs: 90_000,
    missions: ["Justice judiciaire", "Administration pénitentiaire", "Protection judiciaire de la jeunesse", "Accès au droit et à la justice"],
    description: "Budget en forte hausse depuis 2022 pour résorber le retard historique : création de 3 000 places de prison, recrutement de 1 500 magistrats sur 5 ans.",
    couleur: "#854d0e",
  },
  {
    nom: "Santé",
    emoji: "🏥",
    budget: 10_100_000_000,
    evolution: +4.3,
    effectifs: 9_500,
    missions: ["Santé", "Prévention en santé", "Offre de soins et qualité du système de santé"],
    description: "Ce budget est distinct de l'ONDAM (Objectif National des Dépenses d'Assurance Maladie, ~240 Md€) géré par la Sécurité sociale.",
    couleur: "#166534",
  },
  {
    nom: "Transition écologique et Cohésion des territoires",
    emoji: "🌿",
    budget: 9_700_000_000,
    evolution: +12.4,
    effectifs: 62_000,
    missions: ["Écologie, développement et mobilité durables", "Cohésion des territoires", "Logement et ville"],
    description: "En forte progression, ce budget finance MaPrimeRénov, les aides à l'achat de véhicules propres, les transports en commun et le logement social.",
    couleur: "#14532d",
  },
  {
    nom: "Enseignement supérieur et Recherche",
    emoji: "🔬",
    budget: 30_600_000_000,
    evolution: +2.8,
    effectifs: 165_000,
    missions: ["Recherche et enseignement supérieur", "Investissements d'avenir"],
    description: "Finance les universités, les grandes écoles publiques, le CNRS, l'Inserm et les autres organismes de recherche publics.",
    couleur: "#4c1d95",
  },
  {
    nom: "Agriculture et Souveraineté alimentaire",
    emoji: "🌾",
    budget: 5_700_000_000,
    evolution: +6.2,
    effectifs: 30_000,
    missions: ["Agriculture, alimentation, forêt et affaires rurales", "Sécurité alimentaire"],
    description: "Complète les aides européennes de la PAC (9 Md€/an pour la France). Inclut l'enseignement agricole et la gestion des crises.",
    couleur: "#713f12",
  },
];

function fmt(euros: number): string {
  if (euros >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1) + " Md€";
  return (euros / 1_000_000).toFixed(0) + " M€";
}

const maxBudget = Math.max(...MINISTERES.map((m) => m.budget));
const totalBudget = MINISTERES.reduce((s, m) => s + m.budget, 0);

export default function EtatMinistreresPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #003189 100%)",
          padding: "4.5rem 0 4rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div className="container" style={{ position: "relative" }}>
            <Link href="/etat" style={{ color: "rgba(255,255,255,.6)", fontSize: ".875rem", display: "inline-flex", alignItems: "center", gap: ".375rem", marginBottom: "1.5rem", textDecoration: "none" }}>
              {"← Dépenses de l'État"}
            </Link>
            <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-.03em" }}>
              {"Budget par ministère"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "clamp(.9375rem, 2vw, 1.0625rem)", lineHeight: 1.7, maxWidth: 560 }}>
              {"Répartition des crédits budgétaires entre les ministères pour 2024. Chiffres issus du Projet de Loi de Finances (PLF 2024)."}
            </p>

            {/* Stats rapides */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { label: "Budget total (périmètre)", value: fmt(totalBudget) },
                { label: "Ministères présentés", value: MINISTERES.length + "" },
                { label: "Plus grand budget", value: fmt(maxBudget) },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "white", letterSpacing: "-.03em" }}>{s.value}</div>
                  <div style={{ fontSize: ".8125rem", color: "rgba(255,255,255,.55)", marginTop: ".2rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LISTE MINISTÈRES */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Crédits ouverts par ministère"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"Cliquez sur un ministère pour voir ses missions et programmes."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[...MINISTERES].sort((a, b) => b.budget - a.budget).map((m) => (
                <div key={m.nom} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.75rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
                      <span style={{ fontSize: "1.75rem", lineHeight: 1, flexShrink: 0, marginTop: ".1rem" }}>{m.emoji}</span>
                      <div>
                        <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--texte-primaire)", marginBottom: ".25rem" }}>{m.nom}</h3>
                        <p style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", margin: 0, lineHeight: 1.55, maxWidth: 520 }}>{m.description}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--bleu-marine)", letterSpacing: "-.03em" }}>{fmt(m.budget)}</div>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: ".25rem",
                        fontSize: ".8125rem", fontWeight: 600, marginTop: ".25rem",
                        color: m.evolution >= 0 ? "#16a34a" : "#dc2626",
                      }}>
                        {m.evolution >= 0 ? "▲" : "▼"} {Math.abs(m.evolution).toFixed(1)} %
                        <span style={{ fontWeight: 400, color: "var(--texte-tertiaire)", marginLeft: ".25rem" }}>{"vs 2023"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div style={{ background: "var(--surface)", borderRadius: 99, height: 7, marginBottom: "1.25rem", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: m.couleur,
                      width: (m.budget / maxBudget * 100) + "%",
                      transition: "width .6s ease",
                    }} />
                  </div>

                  {/* Missions */}
                  <div>
                    <div style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--texte-tertiaire)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: ".5rem" }}>
                      {"Missions budgétaires"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
                      {m.missions.map((mission) => (
                        <span key={mission} style={{
                          fontSize: ".8125rem",
                          background: "var(--bleu-pale)",
                          color: "var(--bleu-moyen)",
                          borderRadius: "99px",
                          padding: ".25rem .75rem",
                          border: "1px solid var(--bordure)",
                        }}>{mission}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NOTE */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "3rem 0" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{
              background: "var(--blanc)", border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)", padding: "1.75rem",
              borderLeft: "4px solid var(--bleu-moyen)",
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--texte-primaire)", marginBottom: ".75rem" }}>
                {"⚠️ Périmètre de ces données"}
              </h3>
              <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.7, margin: 0 }}>
                {"Ces chiffres concernent uniquement le budget de l'État. Ils n'incluent pas le budget de la Sécurité sociale (~600 Md€), les budgets des collectivités locales (~270 Md€), ni les budgets des opérateurs de l'État (universités, CNRS, hôpitaux...). Le budget total des administrations publiques françaises dépasse 1 500 Md€."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <Link href="/etat/dette" className="btn" style={{ background: "var(--bleu-marine)", color: "white" }}>
                {"Dette publique →"}
              </Link>
              <Link href="/etat" className="btn" style={{ background: "var(--blanc)", color: "var(--texte-primaire)", border: "1px solid var(--bordure)" }}>
                {"← Vue générale État"}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Données PLF / Direction du Budget — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}
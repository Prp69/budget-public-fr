// src/app/etat/ministeres/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Budget par ministère — Budget Public",
  description: "Détail des crédits alloués à chaque ministère dans le budget 2024.",
};

const MINISTERES = [
  { nom: "Éducation nationale & Jeunesse",   budget: 84_600_000_000, agents: 985_000,  evol: +2.1,  desc: "Premier employeur de France, incluant les universités." },
  { nom: "Défense",                           budget: 47_200_000_000, agents: 270_000,  evol: +7.5,  desc: "Loi de programmation militaire 2024-2030 en cours." },
  { nom: "Enseignement supérieur & Recherche",budget: 31_400_000_000, agents: 170_000,  evol: +3.8,  desc: "Universités, CNRS, CEA, INRAE." },
  { nom: "Intérieur",                         budget: 22_500_000_000, agents: 280_000,  evol: +3.2,  desc: "Police nationale, gendarmerie, sécurité civile." },
  { nom: "Travail & Emploi",                  budget: 21_800_000_000, agents: 9_400,    evol: -1.4,  desc: "France Travail, aides à l'emploi." },
  { nom: "Économie, Finances & Souveraineté", budget: 19_400_000_000, agents: 130_000,  evol: +0.8,  desc: "DGFiP, Douanes, INSEE." },
  { nom: "Justice",                           budget: 10_900_000_000, agents: 91_000,   evol: +8.1,  desc: "Tribunaux, prisons, accès au droit." },
  { nom: "Santé & Prévention",                budget: 10_100_000_000, agents: 5_600,    evol: +4.3,  desc: "Hors Assurance maladie (LFSS)." },
  { nom: "Transitions écologiques",           budget: 9_700_000_000,  agents: 42_000,   evol: +12.4, desc: "Transports, logement, biodiversité." },
  { nom: "Agriculture & Souveraineté alim.",  budget: 4_300_000_000,  agents: 30_000,   evol: +1.1,  desc: "Aides aux agriculteurs, filières alimentaires." },
  { nom: "Culture",                           budget: 4_100_000_000,  agents: 12_000,   evol: +2.5,  desc: "Monuments, musées, spectacle vivant." },
  { nom: "Action extérieure",                 budget: 3_800_000_000,  agents: 14_000,   evol: +0.9,  desc: "Diplomatie, consulats, coopération." },
];

function fmt(n: number) {
  return n >= 1e9 ? (n / 1e9).toFixed(1) + " Md€" : (n / 1e6).toFixed(0) + " M€";
}
function fmtAgents(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(0) + " k" : n.toString();
}
const maxB = Math.max(...MINISTERES.map((m) => m.budget));
const totalBudget = MINISTERES.reduce((s, m) => s + m.budget, 0);

export default function MinistreresPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 860 }}>
            <span className="tag-hero">🏛️ État › Ministères</span>
            <h1>{"Budget par ministère"}</h1>
            <p className="lead">{"Répartition des crédits budgétaires entre les principales missions de l'État pour l'exercice 2024."}</p>
            <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <div>
                <div className="stat-hero">{fmt(totalBudget)}</div>
                <div className="stat-hero-label">{"Crédits totaux (hors dette)"}</div>
              </div>
              <div>
                <div className="stat-hero">{MINISTERES.length}</div>
                <div className="stat-hero-label">{"Ministères détaillés"}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Crédits par ministère — PLF 2024"}</div>
              <div className="chart-subtitle">{"En milliards d'euros, hors charge de la dette (54 Md€)"}</div>
              {MINISTERES.map((m) => {
                const pct = (m.budget / maxB) * 100;
                return (
                  <div key={m.nom} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".375rem" }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", fontWeight: 500, color: "var(--encre)" }}>{m.nom}</span>
                      <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{fmt(m.budget)}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: m.evol >= 0 ? "#1E6B3C" : "var(--rouge)", minWidth: 46, textAlign: "right" }}>{m.evol >= 0 ? "+" : ""}{m.evol}%</span>
                        <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", minWidth: 40, textAlign: "right" }}>{fmtAgents(m.agents)}{" agents"}</span>
                      </span>
                    </div>
                    <div style={{ background: "var(--creme-fonce)", borderRadius: 3, height: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: "var(--bleu)", transition: "width .6s ease" }} />
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", marginTop: ".25rem", fontStyle: "italic" }}>{m.desc}</div>
                  </div>
                );
              })}
              <div className="chart-source">{"Source : PLF 2024, Annexes budgétaires, ministère des Finances"}</div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/etat/dette" className="btn btn-primaire">{"Dette publique →"}</Link>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2024 BudgetPublic"}</span>
          <Link href="/sources" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"Sources →"}</Link>
        </div>
      </footer>
    </>
  );
}
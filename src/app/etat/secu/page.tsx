// src/app/etat/secu/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Sécurité sociale — Budget Public",
  description: "Budget de la Sécurité sociale 2025 : 666 Md€ répartis entre maladie, vieillesse, famille et autonomie.",
};

const BRANCHES = [
  {
    label: "Assurance maladie (Ondam)",
    montant: 266_000_000_000,
    evol: +2.8,
    couleur: "#2B8C6B",
    desc: "Soins hospitaliers, soins de ville, médicaments, établissements médico-sociaux.",
    detail: [
      { label: "Établissements de santé",        v: 108_800_000_000 },
      { label: "Soins de ville",                  v:  98_000_000_000 },
      { label: "Médicaments (ville)",              v:  24_000_000_000 },
      { label: "Établissements médico-sociaux",   v:  26_000_000_000 },
      { label: "Autres",                           v:   9_200_000_000 },
    ],
  },
  {
    label: "Branche vieillesse (retraites)",
    montant: 304_000_000_000,
    evol: +3.1,
    couleur: "#247A5E",
    desc: "Pensions de retraite du régime général, de base, et régimes alignés.",
    detail: [
      { label: "Pensions régime général",  v: 165_000_000_000 },
      { label: "Régimes alignés (MSA…)",   v:  42_000_000_000 },
      { label: "Minimum vieillesse (Aspa)",v:   3_200_000_000 },
      { label: "CNRACL (fonctionnaires)",  v:  45_000_000_000 },
      { label: "Autres régimes",           v:  48_800_000_000 },
    ],
  },
  {
    label: "Branche famille",
    montant: 59_000_000_000,
    evol: +0.8,
    couleur: "#3DAB88",
    desc: "Allocations familiales, APL, congés parentaux, crèches, RSA (en partie).",
    detail: [
      { label: "Allocations familiales",   v: 13_200_000_000 },
      { label: "APL (aides au logement)",  v:  9_700_000_000 },
      { label: "Prestation accueil jeune enfant", v: 8_500_000_000 },
      { label: "Prime à la naissance / adoption", v: 1_200_000_000 },
      { label: "Autres prestations",       v: 26_400_000_000 },
    ],
  },
  {
    label: "Branche autonomie",
    montant: 42_400_000_000,
    evol: +6.0,
    couleur: "#5BC4A2",
    desc: "Dépendance des personnes âgées et handicapées (créée en 2020).",
    detail: [
      { label: "EHPAD et résidences",          v: 14_000_000_000 },
      { label: "Aide à domicile (APA, PCH)",   v:  9_000_000_000 },
      { label: "Établissements handicap",      v: 12_000_000_000 },
      { label: "Autres",                        v:  7_400_000_000 },
    ],
  },
  {
    label: "Accidents du travail (AT-MP)",
    montant: 16_000_000_000,
    evol: +2.2,
    couleur: "#7DD3BE",
    desc: "Indemnisation des accidents du travail et maladies professionnelles.",
    detail: [
      { label: "Rentes et pensions",        v:  8_200_000_000 },
      { label: "Indemnités journalières",   v:  4_100_000_000 },
      { label: "Prévention / autres",       v:  3_700_000_000 },
    ],
  },
];

const HISTORIQUE = [
  { annee: "2019", v: 499_000_000_000 },
  { annee: "2020", v: 562_000_000_000 },
  { annee: "2021", v: 574_000_000_000 },
  { annee: "2022", v: 607_000_000_000 },
  { annee: "2023", v: 634_000_000_000 },
  { annee: "2024", v: 648_000_000_000 },
  { annee: "2025", v: 666_000_000_000 },
];

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " Md€";
  return (n / 1e6).toFixed(0) + " M€";
}

const totalBranches = BRANCHES.reduce((s, b) => s + b.montant, 0);
const maxBranche    = Math.max(...BRANCHES.map((b) => b.montant));
const maxHisto      = Math.max(...HISTORIQUE.map((h) => h.v));

export default function SecuPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section className="hero-interieur" style={{ background: "#1D6B52" }}>
          <div className="container inner" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem" }}>
              <div>
                <span className="tag-hero" style={{ background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.2)" }}>
                  {"🏥 État › Sécurité sociale"}
                </span>
                <h1>{"Sécurité sociale"}</h1>
                <p className="lead">
                  {"666 milliards d'euros en 2025 — soit plus que le budget de l'État. La Sécu finance la santé, les retraites, la famille et l'autonomie de 67 millions de Français."}
                </p>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "rgba(255,255,255,.5)", marginTop: ".75rem" }}>
                  {"Source : PLFSS 2025, Ministère de la Santé — Loi promulguée le 28 février 2025"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "2.5rem", flexShrink: 0, flexWrap: "wrap" }}>
                <div>
                  <div className="stat-hero">{"666 Md€"}</div>
                  <div className="stat-hero-label">{"Dépenses totales 2025"}</div>
                </div>
                <div>
                  <div className="stat-hero" style={{ color: "rgba(255,255,255,.75)" }}>{"-22 Md€"}</div>
                  <div className="stat-hero-label">{"Déficit 2025"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRANCHES */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Dépenses par branche"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--gris-1)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 680 }}>
              {"La Sécurité sociale est organisée en 5 branches. Cliquez sur une ligne pour voir le détail."}
            </p>

            {BRANCHES.map((b) => (
              <div key={b.label} style={{ marginBottom: "2rem" }}>
                {/* Barre principale */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".5rem", flexWrap: "wrap", gap: ".5rem" }}>
                  <span style={{ fontFamily: "var(--sans)", fontWeight: 600, fontSize: ".9375rem", color: "var(--encre)" }}>{b.label}</span>
                  <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 700, color: b.couleur }}>{fmt(b.montant)}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "#1E6B3C" }}>{"+"+b.evol+"%"}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-3)" }}>
                      {((b.montant / totalBranches) * 100).toFixed(0)}{"% du total"}
                    </span>
                  </span>
                </div>
                <div style={{ background: "var(--creme-fonce)", borderRadius: 3, height: 14, overflow: "hidden", marginBottom: ".625rem" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${(b.montant / maxBranche) * 100}%`, background: b.couleur }} />
                </div>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", fontStyle: "italic", marginBottom: ".75rem" }}>{b.desc}</p>

                {/* Sous-détail */}
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--gris-5)" }}>
                  {b.detail.map((d) => (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".375rem" }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)", flex: 1 }}>{d.label}</span>
                      <div style={{ width: 120, background: "var(--creme-fonce)", borderRadius: 2, height: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${(d.v / b.montant) * 100}%`, background: b.couleur, opacity: .7 }} />
                      </div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)", minWidth: 70, textAlign: "right" }}>{fmt(d.v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="chart-source">{"Source : PLFSS 2025, Direction de la Sécurité sociale"}</div>
          </div>
        </section>

        {/* HISTORIQUE */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Évolution des dépenses — 2019 à 2025"}</div>
              <div className="chart-subtitle">{"En milliards d'euros, toutes branches confondues"}</div>
              {HISTORIQUE.map((h) => {
                const prev = HISTORIQUE[HISTORIQUE.indexOf(h) - 1];
                const evol = prev ? ((h.v - prev.v) / prev.v) * 100 : null;
                return (
                  <div key={h.annee} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".75rem" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--gris-2)", width: 36, flexShrink: 0 }}>{h.annee}</span>
                    <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 20, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${(h.v / maxHisto) * 100}%`,
                        background: h.annee === "2025" ? "#2B8C6B" : h.annee === "2020" ? "var(--rouge)" : "#5BC4A2",
                        opacity: h.annee === "2020" ? 0.85 : 1,
                      }} />
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".875rem", color: "var(--encre)", width: 72, flexShrink: 0, textAlign: "right" }}>{fmt(h.v)}</span>
                    {evol !== null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: evol > 5 ? "var(--rouge)" : "#1E6B3C", width: 48, textAlign: "right" }}>
                        {evol >= 0 ? "+" : ""}{evol.toFixed(1)}%
                      </span>
                    )}
                  </div>
                );
              })}
              <div style={{ marginTop: ".75rem", padding: ".75rem 1rem", background: "var(--rouge-pale)", borderLeft: "3px solid var(--rouge)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", lineHeight: 1.6 }}>
                <strong>{"2020 : "}</strong>{"Le Covid entraîne une hausse exceptionnelle de +63 Md€ (+12,6%) en un an. Les dépenses de Sécu n'ont plus jamais retrouvé leur trajectoire d'avant-crise."}
              </div>
              <div className="chart-source">{"Source : DSS, rapports à la Commission des comptes de la Sécurité sociale"}</div>
            </div>
          </div>
        </section>

        {/* NAVIGATION */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/etat/ministeres" className="btn btn-contour">{"Budget État (PLF)"}</Link>
              <Link href="/etat/dette" className="btn btn-primaire">{"Dette publique →"}</Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2025 BudgetPublic — PLFSS 2025"}</span>
          <Link href="/sources" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"Sources →"}</Link>
        </div>
      </footer>
    </>
  );
}
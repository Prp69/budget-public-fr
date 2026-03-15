"use client";
// src/app/etat/securite-sociale/page.tsx
// "use client" car accordéon interactif
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ComparaisonEU from "@/components/ComparaisonEU";

// ─── Données PLFSS 2025 ───────────────────────────────────────────────────────

const BRANCHES = [
  {
    label: "Assurance maladie (Ondam)",
    montant: 266_000_000_000,
    evol: +2.8,
    couleur: "#2B8C6B",
    desc: "Soins hospitaliers, soins de ville, médicaments, établissements médico-sociaux.",
    detail: [
      { label: "Établissements de santé",         v: 108_800_000_000 },
      { label: "Soins de ville",                   v:  98_000_000_000 },
      { label: "Médicaments (ville)",               v:  24_000_000_000 },
      { label: "Établissements médico-sociaux",    v:  26_000_000_000 },
      { label: "Autres dépenses",                  v:   9_200_000_000 },
    ],
  },
  {
    label: "Branche vieillesse (retraites)",
    montant: 304_000_000_000,
    evol: +3.1,
    couleur: "#247A5E",
    desc: "Pensions de retraite du régime général, régimes alignés et autres régimes obligatoires.",
    detail: [
      { label: "Pensions régime général (CNAV)",  v: 165_000_000_000 },
      { label: "Régimes alignés (MSA, RSI…)",     v:  42_000_000_000 },
      { label: "CNRACL (fonctionnaires)",          v:  45_000_000_000 },
      { label: "Minimum vieillesse (Aspa)",        v:   3_200_000_000 },
      { label: "Autres régimes",                   v:  48_800_000_000 },
    ],
  },
  {
    label: "Branche famille",
    montant: 59_000_000_000,
    evol: +0.8,
    couleur: "#3DAB88",
    desc: "Allocations familiales, aides au logement, accueil du jeune enfant.",
    detail: [
      { label: "Allocations familiales",           v: 13_200_000_000 },
      { label: "APL (aides au logement)",          v:  9_700_000_000 },
      { label: "Prestation accueil jeune enfant",  v:  8_500_000_000 },
      { label: "Complément familial & PAJE",       v:  4_800_000_000 },
      { label: "Autres prestations",               v: 22_800_000_000 },
    ],
  },
  {
    label: "Branche autonomie (CNSA)",
    montant: 42_400_000_000,
    evol: +6.0,
    couleur: "#5BC4A2",
    desc: "Dépendance des personnes âgées et handicapées (5e branche créée en 2020).",
    detail: [
      { label: "EHPAD et résidences seniors",      v: 14_000_000_000 },
      { label: "Établissements handicap (ESMS)",   v: 12_000_000_000 },
      { label: "Aide à domicile (APA, PCH)",       v:  9_000_000_000 },
      { label: "Autres dépenses d'autonomie",      v:  7_400_000_000 },
    ],
  },
  {
    label: "Accidents du travail (AT-MP)",
    montant: 16_000_000_000,
    evol: +2.2,
    couleur: "#7DD3BE",
    desc: "Indemnisation et prévention des accidents du travail et maladies professionnelles.",
    detail: [
      { label: "Rentes et pensions AT",            v:  8_200_000_000 },
      { label: "Indemnités journalières",          v:  4_100_000_000 },
      { label: "Prévention et autres",             v:  3_700_000_000 },
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

export default function SecuriteSocialePage() {
  const [ouvert, setOuvert] = useState<string | null>(null);

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
                  {"666 milliards d'euros en 2025 — soit davantage que le budget de l'État. La Sécurité sociale finance la santé, les retraites, la famille et l'autonomie de 67 millions de Français."}
                </p>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "rgba(255,255,255,.5)", marginTop: ".75rem" }}>
                  {"Source : PLFSS 2025, Ministère chargé de la Santé"}
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

        {/* BRANCHES — accordéon */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Dépenses par branche"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--gris-1)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 680 }}>
              {"Cliquez sur une branche pour afficher le détail des postes de dépenses."}
            </p>

            {BRANCHES.map((b) => {
              const isOpen = ouvert === b.label;
              return (
                <div key={b.label} style={{ marginBottom: ".75rem" }}>
                  {/* Ligne cliquable */}
                  <button
                    onClick={() => setOuvert(isOpen ? null : b.label)}
                    style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".375rem", flexWrap: "wrap", gap: ".5rem" }}>
                      <span style={{
                        fontFamily: "var(--sans)", fontWeight: isOpen ? 700 : 600,
                        fontSize: ".9375rem", color: isOpen ? b.couleur : "var(--encre)",
                        display: "flex", alignItems: "center", gap: ".5rem",
                      }}>
                        {isOpen && <span style={{ width: 3, height: 14, background: b.couleur, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />}
                        {b.label}
                      </span>
                      <span style={{ display: "flex", gap: ".875rem", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--serif)", fontSize: "1.0625rem", fontWeight: 700, color: b.couleur }}>{fmt(b.montant)}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "#1E6B3C" }}>{"+"+b.evol+"%"}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-3)" }}>
                          {((b.montant / totalBranches) * 100).toFixed(0)}{"% du total"}
                        </span>
                        <span style={{ fontSize: ".875rem", color: "var(--gris-3)", transition: "transform 200ms ease", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>{"▾"}</span>
                      </span>
                    </div>
                    {/* Barre */}
                    <div style={{ background: "var(--creme-fonce)", borderRadius: 3, height: isOpen ? 10 : 8, overflow: "hidden", transition: "height 150ms ease" }}>
                      <div style={{ height: "100%", borderRadius: 3, width: `${(b.montant / maxBranche) * 100}%`, background: b.couleur, opacity: isOpen ? 1 : 0.7 }} />
                    </div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", fontStyle: "italic", marginTop: ".375rem", textAlign: "left" }}>{b.desc}</p>
                  </button>

                  {/* Détail accordéon */}
                  {isOpen && (
                    <div style={{
                      marginTop: ".625rem",
                      background: "var(--bleu-pale)",
                      border: "1px solid var(--bleu-clair)",
                      borderLeft: `3px solid ${b.couleur}`,
                      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                      padding: "1rem 1.25rem",
                      animation: "fadeUp .15s ease both",
                    }}>
                      {b.detail.map((d) => (
                        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".625rem" }}>
                          <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--encre)", flex: 1 }}>{d.label}</span>
                          <div style={{ width: 140, background: "var(--bleu-clair)", borderRadius: 2, height: 10, overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ height: "100%", borderRadius: 2, width: `${(d.v / b.montant) * 100}%`, background: b.couleur, opacity: .8 }} />
                          </div>
                          <span style={{ fontFamily: "var(--mono)", fontSize: ".875rem", color: "var(--encre)", minWidth: 72, textAlign: "right", flexShrink: 0 }}>{fmt(d.v)}</span>
                        </div>
                      ))}
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", marginTop: ".5rem", fontStyle: "italic" }}>
                        {"Source : PLFSS 2025, Direction de la Sécurité sociale"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="chart-source">{"Source : PLFSS 2025, Commission des comptes de la Sécurité sociale"}</div>
          </div>
        </section>

        {/* HISTORIQUE */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Évolution des dépenses — 2019 à 2025"}</div>
              <div className="chart-subtitle">{"En milliards d'euros, toutes branches confondues"}</div>
              {HISTORIQUE.map((h, i) => {
                const prev = i > 0 ? HISTORIQUE[i - 1] : null;
                const evol = prev ? ((h.v - prev.v) / prev.v) * 100 : null;
                const isCovid = h.annee === "2020";
                const isCurrent = h.annee === "2025";
                return (
                  <div key={h.annee} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".75rem" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--gris-2)", width: 36, flexShrink: 0 }}>{h.annee}</span>
                    <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 20, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${(h.v / maxHisto) * 100}%`,
                        background: isCovid ? "var(--rouge)" : isCurrent ? "#2B8C6B" : "#5BC4A2",
                      }} />
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".875rem", color: "var(--encre)", width: 74, flexShrink: 0, textAlign: "right" }}>{fmt(h.v)}</span>
                    {evol !== null && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", width: 50, textAlign: "right", flexShrink: 0, color: evol > 5 ? "var(--rouge)" : "#1E6B3C" }}>
                        {evol >= 0 ? "+" : ""}{evol.toFixed(1)}%
                      </span>
                    )}
                  </div>
                );
              })}
              <div style={{ marginTop: ".75rem", padding: ".75rem 1rem", background: "var(--rouge-pale)", borderLeft: "3px solid var(--rouge)", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", lineHeight: 1.6 }}>
                <strong>{"2020 : "}</strong>{"Le Covid entraîne une hausse de +63 Md€ (+12,6 %) en un an. Les dépenses de Sécurité sociale n'ont plus jamais retrouvé leur trajectoire d'avant-crise."}
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

        <ComparaisonEU metrique="depenses" titre={"Protection sociale — dépenses publiques totales UE27 (2024)"} note={"Source : Eurostat 2024. Les dépenses sociales (retraites, santé, famille) représentent plus de la moitié des dépenses publiques totales en France."} />

      </main>


      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2025 BudgetPublic — PLFSS 2025"}</span>
          <Link href="/sources" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"Sources →"}</Link>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      `}</style>
    </>
  );
}
// src/app/etat/dette/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ComparaisonEU from "@/components/ComparaisonEU";

export const metadata: Metadata = {
  title: "Dette publique française — Budget Public",
  description: "Évolution, composition et enjeux de la dette publique française. 3 162 milliards d'euros fin 2023.",
};

const HISTORIQUE = [
  { an: "2000", dette: 57.3 },  { an: "2005", dette: 67.4 },
  { an: "2010", dette: 85.3 },  { an: "2015", dette: 95.6 },
  { an: "2020", dette: 114.6 }, { an: "2021", dette: 112.9 },
  { an: "2022", dette: 111.6 }, { an: "2023", dette: 110.6 },
];
const maxDette = Math.max(...HISTORIQUE.map((h) => h.dette));

const DETENTEURS = [
  { label: "Investisseurs étrangers",    pct: 52, couleur: "var(--bleu)" },
  { label: "Banque de France / BCE",     pct: 22, couleur: "#4A7EC7" },
  { label: "Assureurs & fonds français", pct: 18, couleur: "#7BAED4" },
  { label: "Ménages & autres",           pct: 8,  couleur: "var(--gris-4)" },
];

export default function DettePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 860 }}>
            <span className="tag-hero">⚠️ État › Dette publique</span>
            <h1>{"Dette publique"}</h1>
            <p className="lead">{"3 162 milliards d'euros fin 2023 — soit 110,6 % du PIB. La dette publique française est l'accumulation de tous les déficits passés : chaque année où les dépenses dépassent les recettes, l'État emprunte sur les marchés financiers pour combler la différence."}
                </p>
                <p className="lead" style={{ marginTop: ".75rem" }}>
                  {"Contrairement aux idées reçues, la dette n'est pas remboursée mais refinancée en permanence : l'État émet de nouvelles obligations (OAT) pour rembourser les anciennes. Le coût de cette dette — les intérêts — atteint 54 Md€ en 2024, soit le deuxième poste budgétaire de l'État, devant même l'Éducation nationale."}</p>
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {[
                { v: "3 162 Md€", l: "Dette totale fin 2023" },
                { v: "110,6 %", l: "Du PIB français" },
                { v: "54 Md€", l: "Charge d'intérêts 2024" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="stat-hero">{s.v}</div>
                  <div className="stat-hero-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ÉVOLUTION */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Évolution de la dette — % du PIB"}</div>
              <div className="chart-subtitle">{"Depuis 2000, en points de PIB"}</div>
              {HISTORIQUE.map((h) => (
                <div key={h.an} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".75rem" }}>
                  <div style={{ width: 40, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--gris-2)", textAlign: "right" }}>{h.an}</div>
                  <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 18, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      width: `${(h.dette / maxDette) * 100}%`,
                      background: h.dette > 100 ? "var(--rouge)" : "var(--bleu)",
                    }} />
                  </div>
                  <div style={{ width: 60, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".875rem", color: h.dette > 100 ? "var(--rouge)" : "var(--encre)", fontWeight: 600 }}>{h.dette} %</div>
                </div>
              ))}
              <div className="chart-source">{"Source : INSEE, Eurostat — Maastricht debt"}</div>
            </div>
          </div>
        </section>

        {/* DÉTENTEURS */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Qui détient la dette française ?"}</h2>
            <div className="chart-wrapper">
              <div className="chart-title">{"Répartition des détenteurs"}</div>
              {DETENTEURS.map((d) => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: 220, flexShrink: 0, fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--encre)" }}>{d.label}</div>
                  <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 20, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${d.pct}%`, background: d.couleur }} />
                  </div>
                  <div style={{ width: 44, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".875rem", color: "var(--encre)", fontWeight: 600, textAlign: "right" }}>{d.pct} %</div>
                </div>
              ))}
              <div className="chart-source">{"Source : Agence France Trésor — 2023"}</div>
            </div>
            <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--rouge-pale)", borderLeft: "3px solid var(--rouge)", borderRadius: "0 var(--radius-md) var(--radius-md) 0" }}>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--encre)", lineHeight: 1.65 }}>
                <strong>{"Point clé : "}</strong>
                {"Plus de la moitié de la dette française est détenue par des non-résidents. La charge d'intérêts — 54 Md€ en 2024 — est désormais le 2e poste budgétaire, devant l'Éducation nationale."}
              </p>
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/etat/ministeres" className="btn btn-primaire">{"Budget par ministère →"}</Link>
            </div>
          </div>
        </section>
        <ComparaisonEU metrique="dette" titre={"Dette publique — comparaison UE27 (fin 2024)"} note={"Source : Eurostat, 2e notification PDE oct. 2025. Dette au sens du traité de Maastricht."} />

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
// src/app/impots/ir/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Impôt sur le revenu — Budget Public",
  description: "Barème progressif, tranches, qui paie quoi. Données DGFiP 2023.",
};

const TRANCHES = [
  { jusqu: "11 294 €",   taux: 0,  label: "0 %",  couleur: "var(--gris-4)" },
  { jusqu: "28 797 €",   taux: 11, label: "11 %", couleur: "#7BAED4" },
  { jusqu: "82 341 €",   taux: 30, label: "30 %", couleur: "#4A7EC7" },
  { jusqu: "177 106 €",  taux: 41, label: "41 %", couleur: "var(--bleu)" },
  { jusqu: "Au-delà",    taux: 45, label: "45 %", couleur: "var(--bleu-fonce)" },
];

const STATS = [
  { v: "102 Md€", l: "Recettes IR 2023", s: "2e impôt par volume" },
  { v: "40 %",    l: "Des foyers imposés", s: "18 M sur 45 M de foyers" },
  { v: "1 000 €", l: "IR médian", s: "Parmi les foyers imposés" },
  { v: "< 1 %",   l: "Paient 30 % de l'IR", s: "Les plus hauts revenus" },
];

export default function IRPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 860 }}>
            <span className="tag-hero">💶 Impôts › IR</span>
            <h1>{"Impôt sur le revenu"}</h1>
            <p className="lead">{"102 milliards collectés en 2023 sur 18 millions de foyers imposés. Découvrez le barème, les tranches et qui paie réellement."}</p>
          </div>
        </section>

        <section className="section-page">
          <div className="container">
            <div className="grille-4">
              {STATS.map((s) => (
                <div key={s.l} className="carte" style={{ padding: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 600, color: "var(--encre)", marginTop: ".5rem", fontSize: ".9rem" }}>{s.l}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{s.s}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Barème progressif 2024 (revenus 2023)"}</div>
              <div className="chart-subtitle">{"Par tranche de revenu imposable (part fiscale)"}</div>
              {TRANCHES.map((t) => (
                <div key={t.taux} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: 110, flexShrink: 0, fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)", textAlign: "right", lineHeight: 1.3 }}>
                    {"Jusqu'à"}<br />{t.jusqu}
                  </div>
                  <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 28, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${Math.max(t.taux, 3)}%`, background: t.couleur }} />
                  </div>
                  <div style={{ width: 44, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".9375rem", fontWeight: 700, color: "var(--encre)" }}>{t.label}</div>
                </div>
              ))}
              <div className="chart-source">{"Source : DGFiP — Barème IR 2024 sur revenus 2023"}</div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "var(--bleu-pale)", borderLeft: "3px solid var(--bleu)", borderRadius: "0 var(--radius-md) var(--radius-md) 0" }}>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--encre)", lineHeight: 1.65 }}>
                <strong>{"Système par tranches : "}</strong>
                {"Le taux marginal ne s'applique qu'à la portion du revenu qui dépasse le seuil. Un contribuable dans la tranche à 30 % ne paie pas 30 % sur l'ensemble de son revenu."}
              </p>
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/impots" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/impots/tva" className="btn btn-primaire">{"TVA →"}</Link>
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
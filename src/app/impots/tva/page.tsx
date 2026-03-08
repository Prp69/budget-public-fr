// src/app/impots/tva/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "TVA — Budget Public",
  description: "La TVA, premier impôt français : taux, fonctionnement, répartition État / collectivités.",
};

const TAUX = [
  { taux: "20 %", label: "Taux normal",       desc: "La majorité des biens et services",        examples: "Électronique, vêtements, services" },
  { taux: "10 %", label: "Taux intermédiaire", desc: "Restauration, travaux, transport",         examples: "Restaurant, rénovation, train" },
  { taux: "5,5 %",label: "Taux réduit",        desc: "Alimentation, livres, énergie",            examples: "Supermarché, livres, gaz" },
  { taux: "2,1 %",label: "Taux super-réduit",  desc: "Médicaments remboursables, presse",        examples: "Médicaments, journaux" },
];

export default function TVAPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 860 }}>
            <span className="tag-hero">💶 Impôts › TVA</span>
            <h1>{"Taxe sur la Valeur Ajoutée"}</h1>
            <p className="lead">{"213 milliards de recettes en 2023. La TVA est le premier impôt français — invisible, universel, et payé par tous les consommateurs."}</p>
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {[
                { v: "213 Md€", l: "Recettes TVA 2023" },
                { v: "33 %",    l: "Des recettes fiscales de l'État" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="stat-hero">{s.v}</div>
                  <div className="stat-hero-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 860 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Les 4 taux de TVA en France"}</h2>
            <div className="grille-2">
              {TAUX.map((t) => (
                <div key={t.taux} className="carte" style={{ padding: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{t.taux}</div>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 600, color: "var(--encre)", marginTop: ".5rem", fontSize: "1rem" }}>{t.label}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-2)", marginTop: ".375rem", lineHeight: 1.5 }}>{t.desc}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", marginTop: ".5rem", fontStyle: "italic" }}>{"Ex : "}{t.examples}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Répartition des recettes TVA 2023"}</div>
              {[
                { label: "Budget général de l'État", pct: 67, v: "143 Md€", c: "var(--bleu)" },
                { label: "Sécurité sociale (Sécu)", pct: 24, v: "51 Md€",  c: "#4A7EC7" },
                { label: "Collectivités locales",    pct: 9,  v: "19 Md€",  c: "var(--gris-3)" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ width: 200, flexShrink: 0, fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--encre)" }}>{r.label}</div>
                  <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 20, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${r.pct}%`, background: r.c }} />
                  </div>
                  <div style={{ width: 60, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{r.v}</div>
                  <div style={{ width: 36, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-2)", textAlign: "right" }}>{r.pct} %</div>
                </div>
              ))}
              <div className="chart-source">{"Source : DGFiP, rapport PLF 2024"}</div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", background: "var(--rouge-pale)", borderLeft: "3px solid var(--rouge)", borderRadius: "0 var(--radius-md) var(--radius-md) 0" }}>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--encre)", lineHeight: 1.65 }}>
                <strong>{"Impôt régressif ? "}</strong>
                {"La TVA est souvent critiquée car elle pèse proportionnellement plus sur les ménages modestes, qui consomment une plus grande part de leurs revenus que les ménages aisés."}
              </p>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/impots" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/impots/ir" className="btn btn-primaire">{"Impôt sur le revenu →"}</Link>
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
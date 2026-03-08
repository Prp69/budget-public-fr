// src/app/impots/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Impôts & Prélèvements — Budget Public",
  description: "Les grandes catégories de prélèvements obligatoires en France : IR, TVA, IS, CSG.",
};

const IMPOTS = [
  { nom: "TVA",                    montant: 213_000_000_000, pct: 33.1, couleur: "var(--bleu)" },
  { nom: "Impôt sur le revenu",    montant: 102_000_000_000, pct: 15.8, couleur: "#4A7EC7" },
  { nom: "Impôt sur les sociétés", montant: 65_000_000_000,  pct: 10.1, couleur: "#7BAED4" },
  { nom: "CSG / CRDS",             montant: 148_000_000_000, pct: 23.0, couleur: "#2B8C6B" },
  { nom: "Cotisations sociales",   montant: 410_000_000_000, pct: 63.6, couleur: "#4DB89A" },
  { nom: "Taxes foncières",        montant: 40_000_000_000,  pct: 6.2,  couleur: "#B45309" },
  { nom: "Autres",                 montant: 66_000_000_000,  pct: 10.2, couleur: "var(--gris-3)" },
];
const maxM = Math.max(...IMPOTS.map((i) => i.montant));
function fmt(n: number) { return (n / 1e9).toFixed(0) + " Md€"; }

export default function ImpotsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 860 }}>
            <span className="tag-hero">💶 Fiscalité française</span>
            <h1>{"Impôts & Prélèvements obligatoires"}</h1>
            <p className="lead">{"La France collecte environ 1 100 milliards de prélèvements obligatoires par an — 46,1 % du PIB, parmi les plus élevés au monde."}</p>
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {[
                { v: "1 100 Md€", l: "Prélèvements totaux 2023" },
                { v: "46,1 %", l: "Du PIB français" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="stat-hero">{s.v}</div>
                  <div className="stat-hero-label">{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link href="/impots/ir" className="btn" style={{ background: "white", color: "var(--bleu)", fontWeight: 700 }}>{"Impôt sur le revenu"}</Link>
              <Link href="/impots/tva" className="btn" style={{ background: "rgba(255,255,255,.15)", color: "white", border: "1px solid rgba(255,255,255,.3)" }}>{"TVA →"}</Link>
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Principaux prélèvements obligatoires"}</div>
              <div className="chart-subtitle">{"En milliards d'euros — recettes 2023 (périmètre large : État + Sécu + collectivités)"}</div>
              {IMPOTS.map((imp) => (
                <div key={imp.nom} style={{ marginBottom: ".875rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 200, flexShrink: 0, fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--encre)", textAlign: "right" }}>{imp.nom}</div>
                  <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 18, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(imp.montant / maxM) * 100}%`, background: imp.couleur }} />
                  </div>
                  <div style={{ width: 70, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{fmt(imp.montant)}</div>
                  <div style={{ width: 50, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-2)", textAlign: "right" }}>{imp.pct} %</div>
                </div>
              ))}
              <div className="chart-source">{"Source : DGFiP, DREES, rapport sur les prélèvements obligatoires 2023"}</div>
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container">
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Approfondir"}</h2>
            <div className="grille-2">
              {[
                { href: "/impots/ir", titre: "Impôt sur le revenu", desc: "Barème progressif, tranches, niches fiscales. Qui paie quoi ?", tag: "102 Md€ / an" },
                { href: "/impots/tva", titre: "TVA", desc: "Le plus grand impôt français : taux, exonérations, répartition.", tag: "213 Md€ / an" },
              ].map((c) => (
                <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
                  <div className="carte" style={{ padding: "1.75rem" }}>
                    <span className="tag tag-bleu" style={{ marginBottom: "1rem" }}>{c.tag}</span>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--encre)", marginBottom: ".625rem" }}>{c.titre}</h3>
                    <p style={{ fontFamily: "var(--sans)", fontSize: ".9rem", color: "var(--gris-2)", lineHeight: 1.6 }}>{c.desc}</p>
                    <div style={{ marginTop: "1rem", fontFamily: "var(--sans)", fontSize: ".875rem", fontWeight: 600, color: "var(--bleu)" }}>{"Voir le détail →"}</div>
                  </div>
                </Link>
              ))}
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
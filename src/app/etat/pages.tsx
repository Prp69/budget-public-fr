// src/app/etat/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Budget de l'État — Budget Public",
  description: "Dépenses par ministère, dette publique, déficit. Données officielles PLF / DGFiP.",
};

const MINISTERES = [
  { nom: "Éducation nationale",    budget: 84_600_000_000, evol: +2.1 },
  { nom: "Défense",                budget: 47_200_000_000, evol: +7.5 },
  { nom: "Intérieur",              budget: 22_500_000_000, evol: +3.2 },
  { nom: "Travail & Emploi",       budget: 21_800_000_000, evol: -1.4 },
  { nom: "Économie & Finances",    budget: 19_400_000_000, evol: +0.8 },
  { nom: "Justice",                budget: 10_900_000_000, evol: +8.1 },
  { nom: "Santé",                  budget: 10_100_000_000, evol: +4.3 },
  { nom: "Transitions écologiques",budget: 9_700_000_000,  evol: +12.4 },
];

function fmt(n: number) {
  return n >= 1e9 ? (n / 1e9).toFixed(1) + " Md€" : (n / 1e6).toFixed(0) + " M€";
}
const maxB = Math.max(...MINISTERES.map((m) => m.budget));

export default function EtatPage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 860 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem" }}>
              <div>
                <span className="tag-hero">🏛️ Finances nationales</span>
                <h1>{"Budget de l'État"}</h1>
                <p className="lead">{"491 milliards de dépenses, 3 162 milliards de dette. Explorez comment l'État français gère les finances publiques nationales."}</p>
                <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  <Link href="/etat/ministeres" className="btn" style={{ background: "white", color: "var(--bleu)", fontWeight: 700 }}>{"Budget par ministère"}</Link>
                  <Link href="/etat/dette" className="btn" style={{ background: "rgba(255,255,255,.15)", color: "white", border: "1px solid rgba(255,255,255,.3)" }}>{"Dette publique →"}</Link>
                </div>
              </div>
              <div style={{ display: "flex", gap: "2rem", flexShrink: 0 }}>
                {[
                  { v: "491 Md€", l: "Dépenses 2024" },
                  { v: "3 162 Md€", l: "Dette publique" },
                ].map((s) => (
                  <div key={s.l} style={{ textAlign: "right" }}>
                    <div className="stat-hero">{s.v}</div>
                    <div className="stat-hero-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CHIFFRES CLÉS */}
        <section className="section-page">
          <div className="container">
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Chiffres clés 2024"}</h2>
            <div className="grille-4">
              {[
                { v: "491 Md€", l: "Budget général", s: "Loi de finances 2024",     c: "var(--bleu)" },
                { v: "153 Md€", l: "Déficit public",  s: "5,1 % du PIB — objectif", c: "var(--rouge)" },
                { v: "3 162 Md€", l: "Dette totale",  s: "111,6 % du PIB fin 2023", c: "var(--rouge)" },
                { v: "54 Md€",  l: "Charge de dette", s: "2e poste budgétaire",     c: "#B45309" },
              ].map((c) => (
                <div key={c.l} className="carte" style={{ padding: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 700, color: c.c, lineHeight: 1, letterSpacing: "-.03em" }}>{c.v}</div>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 600, color: "var(--encre)", marginTop: ".5rem", fontSize: ".9375rem" }}>{c.l}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{c.s}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GRAPHIQUE MINISTÈRES */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="chart-wrapper">
              <div className="chart-title">{"Principaux ministères — Budget 2024"}</div>
              <div className="chart-subtitle">{"En milliards d'euros, hors charges de la dette"}</div>
              {MINISTERES.map((m) => (
                <div key={m.nom} style={{ marginBottom: ".875rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 180, flexShrink: 0, fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", textAlign: "right" }}>{m.nom}</div>
                  <div style={{ flex: 1, background: "var(--creme-fonce)", borderRadius: 3, height: 20, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      width: `${(m.budget / maxB) * 100}%`,
                      background: "var(--bleu)",
                      transition: "width .6s ease",
                    }} />
                  </div>
                  <div style={{ width: 70, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{fmt(m.budget)}</div>
                  <div style={{ width: 55, flexShrink: 0, fontFamily: "var(--mono)", fontSize: ".75rem", color: m.evol >= 0 ? "#1E6B3C" : "var(--rouge)", textAlign: "right" }}>{m.evol >= 0 ? "+" : ""}{m.evol}%</div>
                </div>
              ))}
              <div className="chart-source">{"Source : PLF 2024, ministère des Finances"}</div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat/ministeres" className="btn btn-primaire">{"Détail par ministère →"}</Link>
              <Link href="/etat/dette" className="btn btn-contour">{"Dette publique"}</Link>
            </div>
          </div>
        </section>

        {/* COMPRENDRE */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Comment fonctionne le budget de l'État ?"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
              {"Le budget de l'État est voté chaque automne sous forme de Loi de Finances (LFI). Il distingue les dépenses de fonctionnement (salaires des fonctionnaires, dotations) des dépenses d'investissement (infrastructures, recherche)."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75 }}>
              {"Le déficit — différence entre recettes et dépenses — s'accumule chaque année pour former la dette publique, aujourd'hui supérieure à 3 000 milliards d'euros."}
            </p>
            <Link href="/comprendre" className="btn btn-contour" style={{ marginTop: "1.5rem" }}>{"Guide complet →"}</Link>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0", marginTop: "4rem" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2024 BudgetPublic — Données officielles open data"}</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[{ l: "Communes", h: "/communes" }, { l: "Sources", h: "/sources" }, { l: "À propos", h: "/apropos" }].map((lk) => (
              <Link key={lk.h} href={lk.h} style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{lk.l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
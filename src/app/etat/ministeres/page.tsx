// src/app/etat/ministeres/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import MinistreresClient from "@/components/MinistreresClient";

export const metadata: Metadata = {
  title: "Budget par ministère — Budget Public",
  description: "Détail interactif des crédits par ministère : ventilation par titre, programmes, évolution sur 5 ans. Données PLF 2025 en temps réel.",
};

const TOTAL = 265_800_000_000; // hors dette + remboursements
const NB    = 12;

function fmt(n: number) {
  return n >= 1e9 ? (n / 1e9).toFixed(0) + " Md€" : (n / 1e6).toFixed(0) + " M€";
}

export default function MinistreresPage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem" }}>
              <div>
                <span className="tag-hero">🏛️ État › Ministères</span>
                <h1>{"Budget par ministère"}</h1>
                <p className="lead">
                  {"Répartition des crédits PLF 2025 entre les missions de l'État. Cliquez sur un ministère pour afficher la ventilation par titre, les programmes et l'historique 5 ans."}
                </p>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "rgba(255,255,255,.55)", marginTop: ".75rem" }}>
                  {"Données en temps réel — API data.economie.gouv.fr"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "2.5rem", flexShrink: 0, flexWrap: "wrap" }}>
                <div>
                  <div className="stat-hero">{fmt(TOTAL)}</div>
                  <div className="stat-hero-label">{"Crédits totaux (hors dette)"}</div>
                </div>
                <div>
                  <div className="stat-hero">{NB}</div>
                  <div className="stat-hero-label">{"Ministères détaillés"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRAPHIQUE INTERACTIF */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 1000 }}>
            <div className="chart-wrapper">
              <MinistreresClient />
            </div>

            <div style={{ marginTop: "2.5rem", padding: "1rem 1.25rem", background: "var(--bleu-pale)", borderRadius: "var(--radius-md)", display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: ".1rem" }}>{"ℹ️"}</span>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)", lineHeight: 1.65 }}>
                {"Les montants affichés correspondent aux Crédits de Paiement (CP) du PLF 2025, hors charge de la dette (54 Md€). La ventilation par titre (Personnel, Fonctionnement, etc.) est issue de la nomenclature LOLF."}
              </p>
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/etat/dette" className="btn btn-primaire">{"Dette publique →"}</Link>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2025 BudgetPublic"}</span>
          <Link href="/sources" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"Sources →"}</Link>
        </div>
      </footer>
    </>
  );
}
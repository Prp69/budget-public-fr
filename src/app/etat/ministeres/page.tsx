// src/app/etat/ministeres/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ComparaisonEU from "@/components/ComparaisonEU";
import MinistreresClient from "@/components/MinistreresClient";
import EffectifsMinisteres from "@/components/EffectifsMinisteres";

export const metadata: Metadata = {
  title: "Budget de l'État par ministère — Budget Public",
  description: "Détail interactif des crédits par ministère : ventilation par titre, programmes, évolution sur 5 ans, effectifs. Données PLF 2025.",
};

const TOTAL = 265_800_000_000;
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
                <span className="tag-hero">{"🏛️ État › Ministères"}</span>
                <h1>{"Budget de l'État — détail par ministère"}</h1>
                <p className="lead">
                  {"Chaque automne, le Parlement vote les crédits alloués à chaque ministère dans le cadre du Projet de Loi de Finances (PLF). Ces crédits déterminent les moyens dont dispose l'État pour assurer ses missions : éducation, sécurité, justice, diplomatie, etc."}
                </p>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "rgba(255,255,255,.8)", lineHeight: 1.65, marginTop: ".875rem", maxWidth: 620 }}>
                  {"Cliquez sur chaque ministère pour découvrir la nature des dépenses (personnel, fonctionnement, investissement), les principaux programmes budgétaires et l'évolution sur 5 ans. Les données sont issues du PLF 2025."}
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

        {/* GRAPHIQUE BUDGETS */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 1000 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Crédits par ministère"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: ".75rem", maxWidth: 760 }}>
              {"Le budget de l'État est divisé en missions, elles-mêmes découpées en programmes, puis en actions. Chaque ministère pilote un ou plusieurs programmes, qui définissent précisément les objectifs et les moyens associés. Le montant affiché correspond aux Crédits de Paiement (CP), c'est-à-dire les sommes effectivement décaissées dans l'année."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 760 }}>
              {"À noter : le Titre 2 (dépenses de personnel) représente souvent 70 à 80 % du budget des ministères régaliens comme l'Éducation nationale, la Défense ou l'Intérieur. C'est pourquoi la masse salariale est un enjeu central du budget de l'État."}
            </p>
            <div className="chart-wrapper">
              <MinistreresClient />
            </div>
            <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "var(--bleu-pale)", borderRadius: "var(--radius-md)", display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: ".1rem" }}>{"ℹ️"}</span>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)", lineHeight: 1.65 }}>
                {"Les montants correspondent aux Crédits de Paiement (CP) du PLF 2025, hors charge de la dette (54 Md€) et remboursements. La ventilation par titre (Personnel, Fonctionnement, Investissement, Intervention) suit la nomenclature de la LOLF (Loi Organique relative aux Lois de Finances)."}
              </p>
            </div>
          </div>
        </section>

        {/* EFFECTIFS */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 1000 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Fonctionnaires par ministère"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: ".75rem", maxWidth: 760 }}>
              {"La France compte environ 5,9 millions d'agents publics toutes fonctions publiques confondues (État, territoriale, hospitalière). La seule fonction publique de l'État (FPE) emploie 2,4 millions d'agents en 2024. L'Éducation nationale est de loin le premier employeur avec plus d'un million d'agents."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: "2rem", maxWidth: 760 }}>
              {"Après une décennie de réductions d'effectifs liées aux réformes RGPP (Révision Générale des Politiques Publiques, 2007-2012) et MAP (Modernisation de l'Action Publique, 2012-2017), les recrutements ont repris depuis 2018. En 15 ans, la Justice, l'Intérieur et l'Éducation nationale ont fortement augmenté leurs effectifs, tandis que les Finances et la Santé ont réduit les leurs."}
            </p>
            <EffectifsMinisteres />
          </div>
        </section>

        {/* COMPARAISON EU */}
        <ComparaisonEU metrique="depenses" titre={"Budget de l'État — dépenses publiques dans l'UE (2024)"} />

        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
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
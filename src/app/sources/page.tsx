// src/app/sources/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Sources & Données — Budget Public",
  description: "Toutes les sources officielles utilisées par BudgetPublic.fr : OFGL, DGFiP, INSEE, data.gouv.fr.",
};

const SOURCES = [
  {
    org: "OFGL", nom: "Observatoire des Finances et de la Gestion publique Locales",
    url: "https://data.ofgl.fr", usage: "Finances des communes — dépenses, recettes, dette, épargne brute",
    tag: "Communes",
  },
  {
    org: "DGFiP", nom: "Direction Générale des Finances Publiques",
    url: "https://www.impots.gouv.fr", usage: "Données fiscales nationales, IR, TVA, IS",
    tag: "Impôts",
  },
  {
    org: "INSEE", nom: "Institut National de la Statistique et des Études Économiques",
    url: "https://www.insee.fr", usage: "Population, PIB, données macro-économiques",
    tag: "National",
  },
  {
    org: "data.gouv.fr", nom: "Plateforme nationale des données ouvertes",
    url: "https://www.data.gouv.fr", usage: "Répertoire National des Élus (maires), données diverses",
    tag: "Open data",
  },
  {
    org: "geo.api.gouv.fr", nom: "API Géo — gouvernement français",
    url: "https://geo.api.gouv.fr", usage: "Codes INSEE, noms et métadonnées des communes",
    tag: "Géo",
  },
  {
    org: "PLF 2024", nom: "Projet de Loi de Finances — ministère des Finances",
    url: "https://www.budget.gouv.fr", usage: "Budget de l'État, crédits ministériels, charges de la dette",
    tag: "État",
  },
  {
    org: "Agence France Trésor", nom: "AFT — gestionnaire de la dette de l'État",
    url: "https://www.aft.gouv.fr", usage: "Encours de dette, détenteurs, émissions OAT",
    tag: "Dette",
  },
];

export default function SourcesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 760 }}>
            <span className="tag-hero">🔍 Transparence</span>
            <h1>{"Sources & Données"}</h1>
            <p className="lead">{"BudgetPublic n'utilise que des données officielles, publiques et librement accessibles. Voici toutes nos sources."}</p>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 900 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Nos sources de données"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {SOURCES.map((s) => (
                <div key={s.org} className="carte" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" }}>
                  <div style={{ flexShrink: 0, minWidth: 120 }}>
                    <span className="tag tag-bleu" style={{ marginBottom: ".5rem" }}>{s.tag}</span>
                    <div style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1rem", color: "var(--bleu)", marginTop: ".375rem" }}>{s.org}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: ".9375rem", color: "var(--encre)", marginBottom: ".25rem" }}>{s.nom}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-2)", lineHeight: 1.5, marginBottom: ".5rem" }}>{s.usage}</div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--bleu)", fontWeight: 500 }}>{s.url} ↗</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Méthodologie"}</h2>
            <div style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75 }}>
              <p style={{ marginBottom: "1rem" }}>{"Les données financières des communes proviennent de l'OFGL, qui consolide les comptes administratifs transmis chaque année par les collectivités. Les montants affichés correspondent à l'exercice le plus récent disponible (généralement N-2)."}</p>
              <p style={{ marginBottom: "1rem" }}>{"Les données sur les maires proviennent du Répertoire National des Élus (RNE), mis à jour par le ministère de l'Intérieur suite à chaque élection ou changement."}</p>
              <p>{"Les données nationales (État, impôts) sont issues des documents budgétaires officiels (PLF, LFI, Rapports économiques, sociaux et financiers)."}</p>
            </div>
            <Link href="/apropos" className="btn btn-contour" style={{ marginTop: "1.5rem" }}>{"À propos du projet →"}</Link>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2024 BudgetPublic"}</span>
          <Link href="/apropos" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"À propos →"}</Link>
        </div>
      </footer>
    </>
  );
}
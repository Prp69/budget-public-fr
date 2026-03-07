// src/app/sources/page.tsx — Server Component

import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Sources officielles — Budget Public",
  description: "Toutes les sources de données utilisées par Budget Public : DGFiP, OFGL, INSEE, data.gouv.fr.",
};

const SOURCES = [
  {
    nom: "OFGL",
    nom_complet: "Observatoire des Finances et de la Gestion publique Locales",
    url: "https://data.ofgl.fr",
    logo_lettre: "O",
    couleur: "#003189",
    description: "L'OFGL publie chaque année les agrégats financiers consolidés de toutes les communes françaises, à partir des balances comptables transmises par la DGFiP. C'est la source principale utilisée par Budget Public pour les données de fonctionnement, d'investissement et d'endettement.",
    donnees: ["Dépenses de fonctionnement par commune", "Dépenses d'investissement", "Encours de dette", "Épargne brute", "Recettes de fonctionnement"],
    licence: "Licence Ouverte v2.0 (Etalab)",
    mise_a_jour: "Annuelle (données N-1 disponibles en fin d'année N)",
    fiabilite: "Très haute — données issues des comptes de gestion officiels",
  },
  {
    nom: "DGFiP",
    nom_complet: "Direction Générale des Finances Publiques",
    url: "https://www.impots.gouv.fr",
    logo_lettre: "D",
    couleur: "#1E4E8C",
    description: "La DGFiP collecte et publie les données comptables brutes de toutes les collectivités locales via le réseau des trésoreries. Les données utilisées par l'OFGL proviennent directement de la DGFiP, qui constitue la source primaire de référence.",
    donnees: ["Balances comptables des communes", "Comptes de gestion", "Données fiscales locales", "Fichiers DGFIP-BudgétsLocaux"],
    licence: "Licence Ouverte v2.0 (Etalab)",
    mise_a_jour: "Annuelle",
    fiabilite: "Très haute — données comptables certifiées",
  },
  {
    nom: "INSEE",
    nom_complet: "Institut National de la Statistique et des Études Économiques",
    url: "https://www.insee.fr",
    logo_lettre: "I",
    couleur: "#0891B2",
    description: "L'INSEE fournit les données de population utilisées pour calculer les indicateurs par habitant (dépenses/habitant, dette/habitant). Le recensement de la population est la référence officielle pour ces calculs.",
    donnees: ["Population légale des communes", "Revenus fiscaux des ménages", "Données socio-économiques locales"],
    licence: "Licence Ouverte v2.0 (Etalab)",
    mise_a_jour: "Annuelle (décalage de 3 ans pour le recensement)",
    fiabilite: "Très haute — source statistique nationale officielle",
  },
  {
    nom: "API Géo",
    nom_complet: "API Découpage Administratif — geo.api.gouv.fr",
    url: "https://geo.api.gouv.fr",
    logo_lettre: "G",
    couleur: "#7C3AED",
    description: "L'API Géo du gouvernement fournit les données de référence sur les communes françaises : codes INSEE, noms officiels, populations, codes postaux et appartenance aux EPCI. Elle alimente la barre de recherche et l'autocomplétion du site.",
    donnees: ["Codes INSEE des communes", "Noms officiels", "Codes postaux", "Coordonnées géographiques"],
    licence: "Licence Ouverte v2.0 (Etalab)",
    mise_a_jour: "Continue (intégration des fusions et créations de communes)",
    fiabilite: "Très haute — référentiel administratif officiel",
  },
  {
    nom: "data.gouv.fr",
    nom_complet: "Plateforme des données ouvertes du gouvernement français",
    url: "https://data.gouv.fr",
    logo_lettre: "D",
    couleur: "#C1292E",
    description: "data.gouv.fr est la plateforme nationale d'open data du gouvernement. Elle agrège les jeux de données publiés par l'ensemble des administrations françaises, dont la DGFiP, l'OFGL et l'INSEE, sous Licence Ouverte.",
    donnees: ["Portail des données publiques", "Comptes individuels des communes", "Données électorales", "Données géographiques"],
    licence: "Licence Ouverte v2.0 (Etalab)",
    mise_a_jour: "Variable selon les jeux de données",
    fiabilite: "Haute — portail officiel avec traçabilité des producteurs",
  },
];

const METHODOLOGIE = [
  {
    titre: "Collecte des données",
    texte: "Les données financières sont récupérées en temps réel via les APIs publiques de l'OFGL et de la DGFiP. Aucune donnée n'est modifiée ou retraitée — nous affichons les valeurs brutes telles que publiées par les organismes officiels.",
  },
  {
    titre: "Calculs et indicateurs",
    texte: "Les indicateurs par habitant (dépenses/hab, dette/hab) sont calculés en divisant les montants financiers par la population légale INSEE de la commune pour l'année correspondante. Tous les calculs sont documentés dans le code source ouvert du site.",
  },
  {
    titre: "Délai de disponibilité",
    texte: "Les données financières sont publiées avec un décalage d'environ 12 à 18 mois. En 2026, les données les plus récentes disponibles sont généralement celles de 2023. Le site affiche toujours l'année de référence des données présentées.",
  },
  {
    titre: "Limites et précautions",
    texte: "Les données présentées concernent le budget principal des communes. Les budgets annexes (eau, assainissement, transport) ne sont pas toujours inclus. Pour une analyse comptable approfondie, consultez directement les comptes de gestion auprès de votre trésorerie municipale.",
  },
];

export default function PageSources() {
  const styleBadge = (couleur: string): React.CSSProperties => ({
    width: 44,
    height: 44,
    borderRadius: "var(--radius-md)",
    background: couleur,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 800,
    fontSize: "1.125rem",
    flexShrink: 0,
  });

  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
          padding: "4rem 0 3.5rem",
        }}>
          <div className="container">
            <Link href="/" style={{ color: "rgba(255,255,255,.6)", fontSize: ".875rem", display: "inline-flex", alignItems: "center", gap: ".375rem", marginBottom: "1.5rem", textDecoration: "none" }}>
              {"← Retour à l'accueil"}
            </Link>
            <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: ".75rem" }}>
              {"Sources officielles & méthodologie"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.0625rem", maxWidth: 560 }}>
              {"Toutes les données présentées sur Budget Public proviennent de sources gouvernementales vérifiées, sous Licence Ouverte."}
            </p>
          </div>
        </section>

        {/* SOURCES */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Sources de données"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"5 sources officielles, toutes sous Licence Ouverte v2.0 (Etalab), réutilisables librement avec mention de la source."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {SOURCES.map((s) => (
                <div key={s.nom} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div style={styleBadge(s.couleur)}>{s.logo_lettre}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--texte-primaire)" }}>{s.nom}</div>
                      <div style={{ fontSize: ".875rem", color: "var(--texte-secondaire)" }}>{s.nom_complet}</div>
                    </div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
                      marginLeft: "auto",
                      fontSize: ".8125rem",
                      color: "var(--bleu-moyen)",
                      border: "1px solid var(--bordure)",
                      borderRadius: "var(--radius-sm)",
                      padding: ".375rem .75rem",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      textDecoration: "none",
                    }}>
                      {"Visiter →"}
                    </a>
                  </div>

                  <p style={{ fontSize: ".9375rem", color: "var(--texte-secondaire)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                    {s.description}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                    <div style={{ background: "var(--bleu-pale)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                      <div style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--texte-tertiaire)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".5rem" }}>
                        {"Données utilisées"}
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".25rem" }}>
                        {s.donnees.map((d) => (
                          <li key={d} style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", display: "flex", alignItems: "flex-start", gap: ".375rem" }}>
                            <span style={{ color: "var(--bleu-moyen)", marginTop: "2px", flexShrink: 0 }}>{"·"}</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ background: "var(--bleu-pale)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
                      <div style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--texte-tertiaire)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".5rem" }}>
                        {"Informations"}
                      </div>
                      <div style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                        <div><span style={{ fontWeight: 600 }}>{"Licence : "}</span>{s.licence}</div>
                        <div><span style={{ fontWeight: 600 }}>{"Mise à jour : "}</span>{s.mise_a_jour}</div>
                        <div><span style={{ fontWeight: 600 }}>{"Fiabilité : "}</span>{s.fiabilite}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* METHODOLOGIE */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Méthodologie"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"Comment nous collectons, traitons et présentons les données."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {METHODOLOGIE.map((m, i) => (
                <div key={m.titre} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--bleu-marine)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: ".875rem", fontWeight: 700, marginBottom: ".875rem",
                  }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontSize: "1rem", marginBottom: ".5rem", color: "var(--texte-primaire)" }}>{m.titre}</h3>
                  <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.7, margin: 0 }}>{m.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LICENCE */}
        <section style={{ padding: "3rem 0" }}>
          <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{"⚖️"}</div>
            <h2 style={{ fontSize: "1.375rem", marginBottom: ".75rem" }}>{"Licence Ouverte v2.0 (Etalab)"}</h2>
            <p style={{ color: "var(--texte-secondaire)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {"Toutes les données présentées sur ce site sont issues de sources publiques sous Licence Ouverte v2.0, qui autorise la réutilisation libre et gratuite des données, y compris à des fins commerciales, sous réserve de mentionner la source et la date de dernière mise à jour."}
            </p>
            <a href="https://www.etalab.gouv.fr/licence-ouverte-open-licence" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {"Consulter la licence →"}
            </a>
          </div>
        </section>

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Données OFGL / DGFiP — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}

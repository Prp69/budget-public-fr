import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getFinancesCommune,
  getHistoriqueCommune,
  formaterMontant,
} from "@/lib/api";
import Header from "@/components/Header";
import CommuneCharts from "@/components/CommuneCharts";
import Comparateur from "@/components/Comparateur";

interface Props {
  params: { code: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const nomRes = await fetch(
    `https://geo.api.gouv.fr/communes/${params.code}?fields=nom`,
    { next: { revalidate: 86400 } }
  ).then((r) => r.json()).catch(() => ({ nom: params.code }));

  return {
    title: `Budget de ${nomRes.nom} — Budget Public`,
    description: `Dépenses, investissements et dette de ${nomRes.nom}. Données officielles DGFiP/OFGL.`,
  };
}

export default async function PageCommune({ params }: Props) {
  const [nomRes, finances, historique] = await Promise.all([
    fetch(
      `https://geo.api.gouv.fr/communes/${params.code}?fields=nom,population,codeDepartement`,
      { next: { revalidate: 86400 } }
    ).then((r) => r.json()).catch(() => null),
    getFinancesCommune(params.code, 2024),
    getHistoriqueCommune(params.code),
  ]);

  if (!nomRes) notFound();

  const nom: string = nomRes.nom;
  const population: number = nomRes.population ?? 0;
  const departement: string = nomRes.codeDepartement ?? "";

  const indicateurs = finances
    ? [
        { label: "Dépenses fonctionnement", value: formaterMontant(finances.depenses_fonctionnement), color: "var(--bleu-moyen)" },
        { label: "Investissements",          value: formaterMontant(finances.depenses_investissement), color: "#0891B2" },
        { label: "Encours de dette",          value: formaterMontant(finances.encours_dette),           color: "var(--rouge-accent)" },
        { label: "Dépenses / habitant",       value: `${finances.depenses_par_habitant?.toLocaleString("fr-FR")} €`, color: "#7C3AED" },
        { label: "Dette / habitant",          value: `${finances.dette_par_habitant?.toLocaleString("fr-FR")} €`,    color: "#D97706" },
      ]
    : [];

  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section
          style={{
            background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
            padding: "3.5rem 0 3rem",
          }}
        >
          <div className="container">
            
                        {(() => {
            const styleLien: React.CSSProperties = {
                color: "rgba(255,255,255,.6)",
                fontSize: ".875rem",
                display: "inline-flex",
                alignItems: "center",
                gap: ".375rem",
                marginBottom: "1.5rem",
                textDecoration: "none",
            };
            return (
                <a href="/" style={styleLien}>
                {"← Retour à l'accueil"}
                </a>
            );
            })()}
            <h1
              style={{
                color: "white",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 800,
                marginBottom: ".5rem",
              }}
            >
              {nom}
            </h1>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: "1rem" }}>
              {"Département " + departement + " · " + population.toLocaleString("fr-FR") + " habitants · Données 2024 (OFGL / DGFiP)"}
            </p>
          </div>
        </section>

        {/* INDICATEURS + GRAPHIQUES */}
        {finances ? (
          <section style={{ padding: "3rem 0" }}>
            <div className="container">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "3rem",
                }}
              >
                {indicateurs.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "var(--blanc)",
                      border: "1px solid var(--bordure)",
                      borderTop: `3px solid ${item.color}`,
                      borderRadius: "var(--radius-lg)",
                      padding: "1.25rem 1.5rem",
                      boxShadow: "var(--ombre-xs)",
                    }}
                  >
                    <p style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", marginBottom: ".375rem" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--texte-primaire)" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
                {"Évolution sur 5 ans"}
              </h2>
              <CommuneCharts historique={historique} nomCommune={nom} />
            </div>
          </section>
        ) : (
          <section style={{ padding: "4rem 0", textAlign: "center" }}>
            <div className="container">
              <p style={{ color: "var(--texte-secondaire)", fontSize: "1rem" }}>
                {"Les données financières de " + nom + " ne sont pas encore disponibles pour 2024."}
              </p>
            </div>
          </section>
        )}

        {/* COMPARATEUR */}
        <section
          style={{
            background: "var(--bleu-pale)",
            borderTop: "1px solid var(--bordure)",
            padding: "4rem 0",
          }}
        >
          <div className="container">
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>
              {"Comparer avec d'autres communes"}
            </h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2rem", fontSize: ".9375rem" }}>
              {"Ajoutez jusqu'à 4 communes pour comparer leurs finances côte à côte."}
            </p>
            <Comparateur />
          </div>
        </section>

      </main>

      <footer
        style={{
          background: "var(--bleu-marine)",
          color: "rgba(255,255,255,.6)",
          padding: "1.5rem 0",
          textAlign: "center",
          fontSize: ".8125rem",
        }}
      >
        <div className="container">
          {"© 2026 Budget Public — Données OFGL / DGFiP — Licence Ouverte v2.0"}
        </div>
      </footer>
    </>
  );
}
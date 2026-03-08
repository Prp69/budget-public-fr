// src/app/elections/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Élections municipales 2026 — Budget Public",
  description: "Préparez-vous aux élections municipales de mars 2026 : comprendre les enjeux budgétaires, les candidats et le rôle du maire.",
};

export default function ElectionsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur" style={{ background: "var(--encre)" }}>
          <div className="container inner" style={{ maxWidth: 860 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: "1.5rem" }}>
              <span className="tag-hero" style={{ background: "rgba(192,57,43,.35)", borderColor: "rgba(192,57,43,.4)" }}>🗳️ Mars 2026</span>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: "var(--rouge)", boxShadow: "0 0 0 3px rgba(192,57,43,.3)",
                animation: "pulse 2s infinite",
              }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "rgba(255,255,255,.7)" }}>{"Bientôt"}</span>
            </div>
            <h1 style={{ color: "white" }}>{"Élections municipales 2026"}</h1>
            <p className="lead">{"Le 22 et 29 mars 2026, les Français éliront leurs conseils municipaux. Connaissez-vous le bilan financier de votre commune ?"}</p>
            <Link href="/communes" className="btn" style={{ marginTop: "1.5rem", background: "var(--rouge)", color: "white" }}>
              {"Vérifier ma commune →"}
            </Link>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 860 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Les enjeux budgétaires locaux"}</h2>
            <div className="grille-3">
              {[
                { icon: "💰", titre: "Finances de la commune", desc: "Dettes, investissements, épargne brute : quel héritage reçoit le futur conseil ?" },
                { icon: "🏗️", titre: "Projets d'investissement", desc: "Écoles, routes, équipements culturels : quels chantiers sont engagés ou planifiés ?" },
                { icon: "📊", titre: "Fiscalité locale", desc: "Taxe foncière, taxe d'habitation résidences secondaires : ont-elles augmenté ?" },
              ].map((c) => (
                <div key={c.titre} className="carte" style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: ".875rem" }}>{c.icon}</div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 700, color: "var(--encre)", marginBottom: ".625rem" }}>{c.titre}</h3>
                  <p style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-2)", lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page" style={{ background: "var(--bleu-pale)" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Le rôle financier du maire"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: "1rem" }}>
              {"Le maire est l'ordonnateur principal du budget communal. Il prépare et soumet le budget au conseil municipal pour vote, puis le fait exécuter. Il signe les contrats d'emprunts et engage la commune dans ses dépenses d'investissement."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75 }}>
              {"Les choix fiscaux et d'investissement d'une équipe municipale peuvent marquer une commune pendant des décennies. C'est pourquoi comprendre les finances locales est essentiel avant de voter."}
            </p>
            <Link href="/communes" className="btn btn-primaire" style={{ marginTop: "1.5rem" }}>{"Explorer les finances de ma commune →"}</Link>
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
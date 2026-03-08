// src/app/apropos/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "À propos — Budget Public",
  description: "BudgetPublic, un outil citoyen pour comprendre les finances publiques françaises.",
};

export default function AProposPage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 760 }}>
            <span className="tag-hero">ℹ️ Le projet</span>
            <h1>{"À propos de BudgetPublic"}</h1>
            <p className="lead">{"Un outil citoyen, libre et sans publicité, pour rendre les finances publiques françaises accessibles à tous."}</p>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Notre mission"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
              {"BudgetPublic.fr est né d'un constat simple : les données sur les finances publiques existent et sont ouvertes, mais elles restent inaccessibles pour la plupart des citoyens. Formats complexes, jargon technique, absence de contextualisation — autant d'obstacles à la compréhension démocratique."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
              {"Notre mission : rendre ces données compréhensibles, visuelles et utiles — pour les citoyens curieux, les journalistes, les élus en herbe, les enseignants."}
            </p>
          </div>
        </section>

        <section className="section-page" style={{ background: "var(--bleu-pale)" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Principes"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { titre: "Données officielles uniquement", desc: "Nous ne publions que des données provenant de sources gouvernementales vérifiables : OFGL, DGFiP, INSEE, data.gouv.fr." },
                { titre: "Sans publicité", desc: "Aucun annonceur, aucun tracking commercial. Le site est financé de façon indépendante." },
                { titre: "Open source", desc: "Le code source est public. Toute la communauté peut contribuer, signaler des erreurs ou proposer des améliorations." },
                { titre: "Pédagogique avant tout", desc: "Chaque donnée est contextualisée, expliquée, comparée. Nous n'affichons pas des chiffres bruts — nous racontons ce qu'ils signifient." },
              ].map((p) => (
                <div key={p.titre} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ width: 8, height: 8, background: "var(--rouge)", borderRadius: "50%", marginTop: ".5rem", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontWeight: 700, color: "var(--encre)", marginBottom: ".25rem" }}>{p.titre}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".9rem", color: "var(--gris-2)", lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/sources" className="btn btn-primaire">{"Nos sources →"}</Link>
              <Link href="/communes" className="btn btn-contour">{"Explorer les communes"}</Link>
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
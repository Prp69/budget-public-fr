// src/app/apropos/page.tsx — Server Component

import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "À propos — Budget Public",
  description: "Budget Public est un site d'information civique indépendant sur les finances des communes françaises.",
};

const VALEURS = [
  { emoji: "📊", titre: "Données officielles uniquement", texte: "Toutes les informations proviennent de sources gouvernementales vérifiées : DGFiP, OFGL, INSEE. Aucune donnée estimée ou extrapolée." },
  { emoji: "⚖️", titre: "Neutralité politique absolue", texte: "Budget Public ne juge pas les élus, ne formule aucune recommandation de vote et ne prend aucune position partisane. Nous présentons des faits." },
  { emoji: "🔓", titre: "Accès libre et gratuit", texte: "Toutes les données sont accessibles sans inscription, sans abonnement. L'information civique doit être universellement accessible." },
  { emoji: "🔍", titre: "Transparence totale", texte: "Notre code source est ouvert sur GitHub. Nos sources et notre méthodologie sont entièrement documentées et vérifiables." },
];

const FAQ = [
  {
    question: "Budget Public est-il affilié à un parti politique ?",
    reponse: "Non. Budget Public est un projet indépendant, sans affiliation à aucun parti, mouvement ou organisation politique. Notre seul objectif est de rendre les données publiques accessibles à tous les citoyens.",
  },
  {
    question: "Les données sont-elles fiables ?",
    reponse: "Oui. Toutes les données proviennent de sources officielles (DGFiP, OFGL, INSEE) sous Licence Ouverte v2.0. Nous n'ajoutons aucune interprétation ni modification aux données brutes. L'année de référence est toujours affichée.",
  },
  {
    question: "Pourquoi certaines communes n'ont-elles pas de données ?",
    reponse: "Les données financières sont publiées avec un délai de 12 à 18 mois par l'OFGL. Les communes très récemment créées ou issues de fusions peuvent ne pas encore apparaître dans la base. Certaines très petites communes peuvent aussi manquer de données.",
  },
  {
    question: "Comment vous contacter pour signaler une erreur ?",
    reponse: "Vous pouvez ouvrir une issue sur notre dépôt GitHub ou nous contacter via la page de contact. Nous vérifions chaque signalement et corrigeons les erreurs dans les meilleurs délais.",
  },
  {
    question: "Puis-je réutiliser les données de ce site ?",
    reponse: "Les données elles-mêmes sont sous Licence Ouverte v2.0 et librement réutilisables. Le code source du site est également ouvert. Mentionnez la source originale (DGFiP/OFGL/INSEE) conformément à la licence.",
  },
];

export default function PageAPropos() {
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
              {"À propos de Budget Public"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: "1.0625rem", maxWidth: 560, lineHeight: 1.7 }}>
              {"Un projet civique indépendant pour rendre les finances publiques locales accessibles à tous les citoyens français."}
            </p>
          </div>
        </section>

        {/* MISSION */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{"Notre mission"}</h2>
            <div style={{
              background: "var(--blanc)",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--ombre-xs)",
              marginBottom: "2rem",
            }}>
              <p style={{ fontSize: "1.0625rem", color: "var(--texte-secondaire)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                {"En France, les comptes des communes sont publics par la loi. Mais en pratique, ils sont éparpillés sur des portails techniques, rédigés dans un jargon comptable inaccessible, et invisibles pour la grande majorité des citoyens."}
              </p>
              <p style={{ fontSize: "1.0625rem", color: "var(--texte-secondaire)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                {"Budget Public a une seule ambition : rendre ces données lisibles, comparables et compréhensibles — sans filtre politique, sans simplification abusive, sans biais idéologique."}
              </p>
              <p style={{ fontSize: "1.0625rem", color: "var(--texte-secondaire)", lineHeight: 1.8, margin: 0 }}>
                {"Nous ne disons pas si un maire gère bien ou mal sa commune. Nous donnons les faits, et chaque citoyen fait ses propres conclusions."}
              </p>
            </div>
          </div>
        </section>

        {/* VALEURS */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "2.5rem" }}>{"Nos valeurs"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {VALEURS.map((v) => (
                <div key={v.titre} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: ".875rem" }}>{v.emoji}</div>
                  <h3 style={{ fontSize: "1rem", marginBottom: ".625rem", color: "var(--texte-primaire)" }}>{v.titre}</h3>
                  <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.65, margin: 0 }}>{v.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "2.5rem" }}>{"Questions fréquentes"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {FAQ.map((item) => (
                <div key={item.question} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <h3 style={{ fontSize: "1rem", color: "var(--bleu-marine)", marginBottom: ".625rem" }}>
                    {item.question}
                  </h3>
                  <p style={{ fontSize: ".9rem", color: "var(--texte-secondaire)", lineHeight: 1.7, margin: 0 }}>
                    {item.reponse}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPEN SOURCE */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "3rem 0" }}>
          <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--bleu-marine)" style={{ display: "inline-block" }}>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.375rem", marginBottom: ".75rem" }}>{"Code source ouvert"}</h2>
            <p style={{ color: "var(--texte-secondaire)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              {"Le code source de Budget Public est entièrement public sur GitHub. Vous pouvez vérifier nos calculs, signaler des erreurs ou contribuer à améliorer le site."}
            </p>
            <a href="https://github.com/budget-public-fr" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {"Voir le code source →"}
            </a>
          </div>
        </section>

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Projet civique indépendant — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}

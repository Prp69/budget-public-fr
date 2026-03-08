// src/app/comprendre/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Comprendre le budget — Budget Public",
  description: "Guide pédagogique : comment fonctionne un budget communal ? Recettes, dépenses, épargne brute, dette.",
};

const SECTIONS = [
  {
    num: "01", titre: "Recettes & Dépenses",
    contenu: "Un budget municipal se divise en deux grandes sections : le fonctionnement (dépenses courantes : salaires, fournitures, entretien) et l'investissement (travaux, équipements durables). Les recettes de fonctionnement comprennent les impôts locaux, les dotations de l'État et les tarifs des services publics.",
  },
  {
    num: "02", titre: "L'épargne brute",
    contenu: "La différence entre recettes et dépenses de fonctionnement s'appelle l'épargne brute. C'est la capacité de la commune à autofinancer ses investissements. Un ratio sain se situe au-dessus de 10 % des recettes de fonctionnement.",
  },
  {
    num: "03", titre: "La dette communale",
    contenu: "Les communes peuvent emprunter pour financer leurs investissements. L'indicateur clé est la capacité de désendettement : nombre d'années nécessaires pour rembourser la dette avec l'épargne brute. En dessous de 10 ans, la situation est généralement saine.",
  },
  {
    num: "04", titre: "Les dotations de l'État",
    contenu: "La Dotation Globale de Fonctionnement (DGF) est le principal transfert financier de l'État vers les communes. Elle compense la suppression de certains impôts locaux et finance les services de base. Son montant varie selon la taille et les caractéristiques de chaque commune.",
  },
];

export default function ComprendrePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 760 }}>
            <span className="tag-hero">📚 Guide pédagogique</span>
            <h1>{"Comprendre le budget communal"}</h1>
            <p className="lead">{"Les finances locales vues de près : comment lire un budget, distinguer recettes et dépenses, évaluer la santé financière d'une commune."}</p>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            {SECTIONS.map((s, i) => (
              <div key={s.num} style={{
                display: "flex", gap: "2rem", alignItems: "flex-start",
                paddingBottom: i < SECTIONS.length - 1 ? "2.5rem" : 0,
                marginBottom: i < SECTIONS.length - 1 ? "2.5rem" : 0,
                borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--gris-5)" : "none",
              }}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: "2.5rem", fontWeight: 500,
                  color: "var(--rouge)", lineHeight: 1, flexShrink: 0, width: 56,
                }}>{s.num}</div>
                <div>
                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.375rem", fontWeight: 700, color: "var(--encre)", marginBottom: ".875rem" }}>{s.titre}</h2>
                  <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75 }}>{s.contenu}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-page" style={{ background: "var(--bleu-pale)" }}>
          <div className="container" style={{ maxWidth: 760 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Lexique rapide"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {[
                { mot: "DGF", def: "Dotation Globale de Fonctionnement — transfert annuel de l'État vers les communes." },
                { mot: "Épargne brute", def: "Excédent des recettes sur les dépenses de fonctionnement." },
                { mot: "Section d'investissement", def: "Partie du budget consacrée aux dépenses pluriannuelles (travaux, matériel)." },
                { mot: "Taux d'imposition", def: "Pourcentage appliqué à la base fiscale pour calculer l'impôt local dû." },
                { mot: "Encours de dette", def: "Capital restant dû sur l'ensemble des emprunts en cours." },
                { mot: "Capacité de désendettement", def: "Durée (en années) nécessaire pour rembourser la dette avec l'épargne brute." },
              ].map((t) => (
                <div key={t.mot} className="carte" style={{ padding: "1.125rem 1.25rem" }}>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 700, color: "var(--bleu)", fontSize: ".9rem", marginBottom: ".375rem" }}>{t.mot}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-1)", lineHeight: 1.55 }}>{t.def}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-page">
          <div className="container" style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/communes" className="btn btn-primaire">{"Chercher une commune →"}</Link>
              <Link href="/sources" className="btn btn-contour">{"Sources & données"}</Link>
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
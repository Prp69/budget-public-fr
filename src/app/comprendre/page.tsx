// src/app/comprendre/page.tsx — Server Component

import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Comprendre le budget communal — Budget Public",
  description: "Guide pédagogique pour comprendre les finances de votre commune : dépenses, recettes, dette, investissements.",
};

const SECTIONS = [
  {
    id: "structure",
    emoji: "🏛️",
    titre: "La structure du budget communal",
    contenu: [
      {
        sous_titre: "Deux grandes sections",
        texte: "Le budget d'une commune est divisé en deux sections distinctes : la section de fonctionnement et la section d'investissement. Ces deux sections obéissent à des règles comptables différentes et financent des natures de dépenses très différentes.",
      },
      {
        sous_titre: "La section de fonctionnement",
        texte: "Elle couvre toutes les dépenses courantes nécessaires au fonctionnement quotidien de la commune : salaires des agents municipaux, achats de fournitures, entretien des bâtiments, remboursement des intérêts de la dette, versements aux associations. Les recettes de fonctionnement proviennent principalement des impôts locaux et des dotations de l'État.",
      },
      {
        sous_titre: "La section d'investissement",
        texte: "Elle finance les projets durables : construction d'écoles, rénovation de routes, équipements sportifs et culturels. Ces dépenses sont financées par l'épargne dégagée du fonctionnement, les emprunts bancaires, et les subventions de l'État ou de la région.",
      },
    ],
  },
  {
    id: "recettes",
    emoji: "💰",
    titre: "Les recettes : d'où vient l'argent ?",
    contenu: [
      {
        sous_titre: "Les impôts locaux",
        texte: "La taxe foncière sur les propriétés bâties est le principal impôt local. Elle est payée par les propriétaires (occupants ou bailleurs). La commune fixe un taux appliqué sur la valeur cadastrale du bien, déterminée par l'État.",
      },
      {
        sous_titre: "Les dotations de l'État",
        texte: "La Dotation Globale de Fonctionnement (DGF) est versée par l'État à chaque commune. Son montant dépend de la population, du potentiel fiscal et de l'effort fiscal de la commune. Elle représente souvent 15 à 25% des recettes de fonctionnement.",
      },
      {
        sous_titre: "Les autres recettes",
        texte: "Les tarifs des services publics (eau, cantines, crèches), les revenus du domaine communal (locations), et les subventions exceptionnelles complètent les ressources de la commune.",
      },
    ],
  },
  {
    id: "depenses",
    emoji: "📊",
    titre: "Les dépenses : où va l'argent ?",
    contenu: [
      {
        sous_titre: "Les charges de personnel",
        texte: "En moyenne, les frais de personnel représentent 55 à 65% des dépenses de fonctionnement d'une commune. Ce poste comprend les salaires, les charges sociales et les cotisations retraite des agents territoriaux.",
      },
      {
        sous_titre: "Les achats et services",
        texte: "Énergie, entretien, fournitures, prestations de services : ces dépenses représentent 20 à 30% du budget de fonctionnement. Elles varient selon la taille et les services proposés par la commune.",
      },
      {
        sous_titre: "Le remboursement de la dette",
        texte: "Chaque année, la commune rembourse le capital et les intérêts des emprunts contractés pour financer ses investissements passés. Ce poste est prélevé sur la section d'investissement (capital) et de fonctionnement (intérêts).",
      },
    ],
  },
  {
    id: "dette",
    emoji: "📉",
    titre: "La dette communale",
    contenu: [
      {
        sous_titre: "Qu'est-ce que l'encours de dette ?",
        texte: "L'encours de dette correspond au capital total que la commune doit encore rembourser à ses créanciers (banques, État). Ce n'est pas la dette de l'année, mais la dette cumulée de tous les emprunts en cours.",
      },
      {
        sous_titre: "La capacité de désendettement",
        texte: "C'est le nombre d'années nécessaires pour rembourser la totalité de la dette si la commune y consacrait toute son épargne brute. En dessous de 10 ans, la situation est considérée comme saine. Au-delà de 15 ans, elle est jugée préoccupante.",
      },
      {
        sous_titre: "Dette par habitant : l'indicateur clé",
        texte: "Pour comparer des communes de tailles différentes, on ramène la dette au nombre d'habitants. La moyenne nationale est d'environ 1 800 €/habitant, mais elle varie de moins de 500 € pour les communes les mieux gérées à plus de 5 000 € pour certaines villes très endettées.",
      },
    ],
  },
  {
    id: "vote",
    emoji: "🗳️",
    titre: "Budget et élections : ce que vous devez savoir",
    contenu: [
      {
        sous_titre: "Le maire et le budget",
        texte: "C'est le maire, assisté de son équipe municipale, qui prépare et propose le budget. Le conseil municipal le vote chaque année avant le 15 avril. L'opposition peut s'exprimer lors de ce vote.",
      },
      {
        sous_titre: "Que regarder avant de voter ?",
        texte: "Évolution des dépenses de personnel, niveau d'endettement par rapport aux communes similaires, part des dépenses d'investissement (signe de dynamisme ou d'endettement excessif), et surtout la capacité de désendettement. Ces indicateurs permettent de juger la gestion passée.",
      },
      {
        sous_titre: "Les promesses et le budget réel",
        texte: "Les programmes électoraux promettent souvent des investissements importants. Pour les évaluer, comparez-les à la capacité d'autofinancement de la commune et à son encours de dette existant. Un programme très ambitieux dans une commune déjà fortement endettée mérite des explications.",
      },
    ],
  },
];

const GLOSSAIRE = [
  { terme: "Épargne brute", definition: "Différence entre les recettes et les dépenses de fonctionnement. Elle finance les investissements et le remboursement de la dette en capital." },
  { terme: "Dotation Globale de Fonctionnement (DGF)", definition: "Principale subvention de l'État aux communes, calculée selon la population et le potentiel fiscal." },
  { terme: "Capacité de désendettement", definition: "Nombre d'années pour rembourser la dette en mobilisant toute l'épargne brute. Indicateur clé de santé financière." },
  { terme: "Encours de dette", definition: "Capital total restant à rembourser sur l'ensemble des emprunts en cours au 31 décembre de l'année." },
  { terme: "Budget primitif", definition: "Budget prévisionnel voté en début d'année, avant les ajustements liés à la réalité de l'exécution." },
  { terme: "Compte administratif", definition: "Document qui retrace l'exécution réelle du budget : ce qui a été vraiment dépensé et encaissé dans l'année." },
  { terme: "Taxe foncière", definition: "Impôt annuel payé par les propriétaires de biens immobiliers, calculé sur la valeur cadastrale du bien." },
  { terme: "M14 / M57", definition: "Nomenclatures comptables utilisées par les communes françaises pour enregistrer leurs opérations budgétaires." },
];

export default function PageComprendre() {
  const styleSection: React.CSSProperties = {
    background: "var(--blanc)",
    border: "1px solid var(--bordure)",
    borderRadius: "var(--radius-lg)",
    padding: "2rem",
    marginBottom: "1.5rem",
  };

  const styleSousTitre: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--bleu-marine)",
    marginBottom: ".5rem",
    marginTop: "1.5rem",
  };

  const styleTexte: React.CSSProperties = {
    fontSize: ".9375rem",
    color: "var(--texte-secondaire)",
    lineHeight: 1.75,
  };

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
              {"Comprendre le budget communal"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.0625rem", maxWidth: 560 }}>
              {"Guide pédagogique pour décrypter les finances de votre commune — sans jargon comptable."}
            </p>

            {/* Navigation rapide */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: "2rem" }}>
              {SECTIONS.map((s) => (
                <a key={s.id} href={"#" + s.id} style={{
                  fontSize: ".8125rem",
                  color: "rgba(255,255,255,.85)",
                  background: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.2)",
                  borderRadius: "99px",
                  padding: ".375rem .875rem",
                  textDecoration: "none",
                }}>
                  {s.emoji + " " + s.titre.split(":")[0].trim()}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENU */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 860 }}>

            {SECTIONS.map((section) => (
              <div key={section.id} id={section.id} style={styleSection}>
                <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "1.75rem" }}>{section.emoji}</span>
                  <h2 style={{ fontSize: "1.25rem", color: "var(--texte-primaire)" }}>{section.titre}</h2>
                </div>
                <div className="divider" style={{ marginBottom: "1.5rem" }} />
                {section.contenu.map((bloc) => (
                  <div key={bloc.sous_titre}>
                    <h3 style={styleSousTitre}>{bloc.sous_titre}</h3>
                    <p style={styleTexte}>{bloc.texte}</p>
                  </div>
                ))}
              </div>
            ))}

            {/* GLOSSAIRE */}
            <div id="glossaire" style={styleSection}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "1.75rem" }}>📖</span>
                <h2 style={{ fontSize: "1.25rem", color: "var(--texte-primaire)" }}>{"Glossaire des termes clés"}</h2>
              </div>
              <div className="divider" style={{ marginBottom: "1.5rem" }} />
              <div style={{ display: "grid", gap: "1rem" }}>
                {GLOSSAIRE.map((item) => (
                  <div key={item.terme} style={{
                    background: "var(--bleu-pale)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem 1.25rem",
                    borderLeft: "3px solid var(--bleu-moyen)",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--bleu-marine)", marginBottom: ".375rem" }}>
                      {item.terme}
                    </div>
                    <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.65, margin: 0 }}>
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{
              background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
              textAlign: "center",
            }}>
              <h2 style={{ color: "white", fontSize: "1.5rem", marginBottom: ".75rem" }}>
                {"Prêt à consulter les comptes de votre commune ?"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.7)", marginBottom: "1.75rem", fontSize: ".9375rem" }}>
                {"Appliquez ce que vous venez d'apprendre sur les données réelles de votre commune."}
              </p>
              <Link href="/communes" className="btn" style={{ background: "white", color: "var(--bleu-marine)", fontWeight: 700 }}>
                {"Rechercher ma commune →"}
              </Link>
            </div>

          </div>
        </section>

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Données OFGL / DGFiP — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}

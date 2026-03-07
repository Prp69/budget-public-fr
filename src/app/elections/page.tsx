// src/app/elections/page.tsx — Server Component

import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Élections municipales 2026 — Budget Public",
  description: "Consultez les finances de votre commune avant de voter aux élections municipales du 15 mars 2026.",
};

const QUESTIONS_CLES = [
  {
    question: "La commune a-t-elle augmenté ses impôts ?",
    comment: "Comparez l'évolution des recettes fiscales sur les 6 dernières années. Une hausse régulière des taux de taxe foncière indique une pression fiscale croissante.",
    indicateur: "Recettes fiscales / évolution",
  },
  {
    question: "La dette est-elle sous contrôle ?",
    comment: "Vérifiez la capacité de désendettement (nombre d'années pour rembourser la dette avec l'épargne brute). En dessous de 10 ans = sain. Au-delà de 15 ans = préoccupant.",
    indicateur: "Encours dette / épargne brute",
  },
  {
    question: "La commune investit-elle ?",
    comment: "Des dépenses d'investissement dynamiques signalent une commune qui modernise ses équipements. Mais attention : des investissements trop élevés creusent la dette.",
    indicateur: "Dépenses d'investissement / habitant",
  },
  {
    question: "Les dépenses de fonctionnement sont-elles maîtrisées ?",
    comment: "Une hausse des dépenses de fonctionnement supérieure à l'inflation sur 6 ans peut indiquer une gestion moins rigoureuse. Regardez notamment l'évolution des charges de personnel.",
    indicateur: "Dépenses fonctionnement / évolution",
  },
  {
    question: "L'épargne brute est-elle positive ?",
    comment: "L'épargne brute (recettes - dépenses de fonctionnement) doit être positive. Si elle est négative, la commune dépense plus qu'elle ne gagne en fonctionnement — situation très préoccupante.",
    indicateur: "Épargne brute",
  },
];

const CALENDRIER = [
  { date: "Maintenant", label: "Consultez les finances", description: "Accédez aux données financières officielles de votre commune et comprenez la situation héritée.", actif: true },
  { date: "15 mars 2026", label: "Premier tour", description: "Élection du conseil municipal. Majorité absolue requise (50% + 1 des suffrages exprimés, avec quorum de 25%).", actif: false },
  { date: "22 mars 2026", label: "Second tour", description: "Si aucune liste n'a obtenu la majorité absolue au premier tour, un second tour est organisé.", actif: false },
  { date: "Avril 2026", label: "Installation", description: "Le nouveau conseil municipal se réunit et élit le maire. Début du nouveau mandat de 6 ans.", actif: false },
];

const INFOS_SCRUTIN = [
  { label: "Mode de scrutin", valeur: "Proportionnel de liste à 2 tours" },
  { label: "Communes < 1 000 hab.", valeur: "Scrutin plurinominal majoritaire" },
  { label: "Durée du mandat", valeur: "6 ans" },
  { label: "Âge minimal candidat", valeur: "18 ans" },
  { label: "Droit de vote", valeur: "Citoyens français et UE inscrits sur les listes" },
  { label: "Inscription listes", valeur: "Avant le 7 mars 2026" },
];

export default function PageElections() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, var(--bleu-marine) 0%, #C1292E 100%)",
          padding: "4rem 0 3.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div className="container" style={{ position: "relative" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,.6)", fontSize: ".875rem", display: "inline-flex", alignItems: "center", gap: ".375rem", marginBottom: "1.5rem", textDecoration: "none" }}>
              {"← Retour à l'accueil"}
            </Link>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              background: "#C1292E", borderRadius: "99px",
              padding: ".375rem 1rem", marginBottom: "1.5rem",
              fontSize: ".8125rem", color: "white", fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
              {"ÉLECTIONS MUNICIPALES — 15 MARS 2026"}
            </div>
            <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: ".75rem", maxWidth: 640 }}>
              {"Votez en connaissance de cause"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: "1.0625rem", maxWidth: 520, lineHeight: 1.7 }}>
              {"Consultez les comptes officiels de votre commune avant d'aller aux urnes. Des données factuelles, sans parti pris."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
              <Link href="/communes" className="btn" style={{ background: "white", color: "var(--bleu-marine)", fontWeight: 700 }}>
                {"Consulter ma commune →"}
              </Link>
              <Link href="/comprendre" className="btn" style={{ background: "rgba(255,255,255,.15)", color: "white", border: "1px solid rgba(255,255,255,.3)" }}>
                {"Comprendre le budget"}
              </Link>
            </div>
          </div>
        </section>

        {/* CALENDRIER */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "2.5rem" }}>{"Calendrier électoral"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {CALENDRIER.map((etape) => (
                <div key={etape.date} style={{
                  background: etape.actif ? "var(--bleu-marine)" : "var(--blanc)",
                  border: "1px solid " + (etape.actif ? "var(--bleu-marine)" : "var(--bordure)"),
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{
                    fontSize: ".8125rem", fontWeight: 700,
                    color: etape.actif ? "rgba(255,255,255,.6)" : "var(--rouge-accent)",
                    marginBottom: ".5rem", textTransform: "uppercase", letterSpacing: ".05em",
                  }}>
                    {etape.date}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: etape.actif ? "white" : "var(--texte-primaire)", marginBottom: ".5rem" }}>
                    {etape.label}
                  </div>
                  <p style={{ fontSize: ".8125rem", color: etape.actif ? "rgba(255,255,255,.7)" : "var(--texte-secondaire)", lineHeight: 1.6, margin: 0 }}>
                    {etape.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUESTIONS CLÉS */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"5 questions à poser avant de voter"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem", maxWidth: 560 }}>
              {"Ces indicateurs financiers vous permettent d'évaluer la gestion de votre commune sortante sur les 6 dernières années."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {QUESTIONS_CLES.map((q, i) => (
                <div key={q.question} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "1rem",
                  alignItems: "start",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "var(--bleu-marine)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: ".875rem", fontWeight: 700, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1rem", color: "var(--texte-primaire)", marginBottom: ".5rem" }}>{q.question}</h3>
                    <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.65, margin: 0 }}>{q.comment}</p>
                  </div>
                  <div style={{
                    background: "var(--bleu-pale)",
                    border: "1px solid var(--bordure)",
                    borderRadius: "var(--radius-sm)",
                    padding: ".375rem .625rem",
                    fontSize: ".75rem",
                    color: "var(--bleu-moyen)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>
                    {q.indicateur}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INFOS SCRUTIN */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>{"Informations pratiques"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
              {INFOS_SCRUTIN.map((info) => (
                <div key={info.label} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ fontSize: ".8125rem", color: "var(--texte-tertiaire)", fontWeight: 500, marginBottom: ".375rem" }}>{info.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--texte-primaire)" }}>{info.valeur}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
              textAlign: "center",
            }}>
              <h2 style={{ color: "white", fontSize: "1.5rem", marginBottom: ".75rem" }}>
                {"Consultez les comptes de votre commune"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.7)", marginBottom: "1.75rem", fontSize: ".9375rem" }}>
                {"Données officielles DGFiP — librement accessibles, sans inscription."}
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

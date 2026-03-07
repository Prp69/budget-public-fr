// src/app/etat/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Dépenses de l'État — Budget Public",
  description: "Explorez le budget de l'État français : dépenses par ministère, dette publique, déficit. Données officielles PLF / DGFiP.",
};

const MINISTERES = [
  { nom: "Éducation nationale",         budget: 84_600_000_000, emoji: "🎓", evolution: +2.1 },
  { nom: "Défense",                      budget: 47_200_000_000, emoji: "🛡️", evolution: +7.5 },
  { nom: "Intérieur",                    budget: 22_500_000_000, emoji: "🏛️", evolution: +3.2 },
  { nom: "Travail & Emploi",             budget: 21_800_000_000, emoji: "💼", evolution: -1.4 },
  { nom: "Économie & Finances",          budget: 19_400_000_000, emoji: "📊", evolution: +0.8 },
  { nom: "Justice",                      budget: 10_900_000_000, emoji: "⚖️", evolution: +8.1 },
  { nom: "Santé",                        budget: 10_100_000_000, emoji: "🏥", evolution: +4.3 },
  { nom: "Transitions écologiques",      budget: 9_700_000_000,  emoji: "🌿", evolution: +12.4 },
];

const CHIFFRES_CLES = [
  { label: "Budget général de l'État",   value: "491 Md€", sub: "Loi de finances 2024",           emoji: "🏦", couleur: "#003189" },
  { label: "Déficit public",             value: "153 Md€", sub: "Objectif PLF 2024 : 5,1 % du PIB", emoji: "📉", couleur: "#C1292E" },
  { label: "Dette publique",             value: "3 162 Md€", sub: "111,6 % du PIB — fin 2023",    emoji: "⚠️", couleur: "#9C1B22" },
  { label: "Charge de la dette",         value: "54 Md€", sub: "2e poste budgétaire",              emoji: "💸", couleur: "#F59E0B" },
];

function fmt(euros: number): string {
  if (euros >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1) + " Md€";
  return (euros / 1_000_000).toFixed(0) + " M€";
}

const maxBudget = Math.max(...MINISTERES.map((m) => m.budget));

export default function EtatPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #003189 100%)",
          padding: "4.5rem 0 4rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div className="container" style={{ position: "relative", maxWidth: 760 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
              borderRadius: "99px", padding: ".375rem 1rem",
              marginBottom: "1.5rem", fontSize: ".8125rem",
              color: "rgba(255,255,255,.85)", fontWeight: 500,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FCD34D", display: "inline-block" }} />
              {"Données PLF 2024 — Direction du Budget"}
            </div>
            <h1 style={{
              color: "white",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800, lineHeight: 1.15,
              marginBottom: "1rem", letterSpacing: "-.03em",
            }}>
              {"Dépenses de l'État"}
            </h1>
            <p style={{
              color: "rgba(255,255,255,.7)",
              fontSize: "clamp(.9375rem, 2vw, 1.0625rem)",
              lineHeight: 1.7, maxWidth: 540,
            }}>
              {"Comment l'État dépense nos impôts ? Explorez le budget par ministère, l'évolution de la dette et le déficit public. Données officielles du Projet de Loi de Finances."}
            </p>
          </div>
        </section>

        {/* CHIFFRES CLÉS */}
        <section style={{ padding: "3rem 0", background: "var(--fond)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {CHIFFRES_CLES.map((c) => (
                <div key={c.label} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "var(--ombre-xs)",
                  borderTop: `3px solid ${c.couleur}`,
                }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: ".25rem" }}>{c.emoji}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: c.couleur }}>{c.value}</div>
                  <div style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--texte-primaire)", marginTop: ".15rem" }}>{c.label}</div>
                  <div style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginTop: ".2rem" }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUDGET PAR MINISTÈRE */}
        <section style={{ padding: "3rem 0", background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)" }}>
          <div className="container">
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.375rem", marginBottom: ".5rem" }}>{"Budget par ministère"}</h2>
              <p style={{ color: "var(--texte-secondaire)", fontSize: ".9375rem" }}>
                {"Principaux ministères en crédits de paiement — Loi de finances initiale 2024"}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
              {MINISTERES.map((m) => (
                <div key={m.nom} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1rem 1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem", flexWrap: "wrap", gap: ".5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{m.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--texte-primaire)" }}>{m.nom}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{
                        fontSize: ".8125rem", fontWeight: 600,
                        color: m.evolution >= 0 ? "#059669" : "#C1292E",
                        background: m.evolution >= 0 ? "#f0fdf4" : "#fef2f2",
                        border: `1px solid ${m.evolution >= 0 ? "#bbf7d0" : "#fecaca"}`,
                        borderRadius: 6, padding: ".15rem .5rem",
                      }}>
                        {m.evolution >= 0 ? "+" : ""}{m.evolution.toFixed(1) + " %"}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--bleu-marine)", minWidth: 80, textAlign: "right" }}>
                        {fmt(m.budget)}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: "var(--bordure)", borderRadius: 4 }}>
                    <div style={{
                      width: `${(m.budget / maxBudget) * 100}%`,
                      height: "100%", borderRadius: 4,
                      background: "linear-gradient(90deg, var(--bleu-marine), var(--bleu-moyen))",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <p style={{ marginTop: "1.25rem", fontSize: ".8125rem", color: "var(--texte-tertiaire)" }}>
              {"Source : Direction du Budget — PLF 2024. Données indicatives, hors charges de personnel et hors transferts intra-État."}
            </p>
          </div>
        </section>

        {/* SECTION À VENIR */}
        <section style={{ padding: "3.5rem 0" }}>
          <div className="container">
            <div style={{
              background: "var(--blanc)",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--ombre-xs)",
            }}>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>{"Prochainement"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                {[
                  { titre: "Budget par ministère", desc: "Détail des programmes et actions", href: "/etat/ministeres", dispo: false },
                  { titre: "Évolution de la dette", desc: "Historique depuis 1980", href: "/etat/dette", dispo: false },
                  { titre: "Comparaison européenne", desc: "Déficit et dette vs UE", href: "/etat/comparaison", dispo: false },
                ].map((item) => (
                  <div key={item.titre} style={{
                    background: "var(--surface)",
                    border: "1px solid var(--bordure)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.25rem",
                    opacity: item.dispo ? 1 : 0.65,
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: ".375rem" }}>{item.titre}</div>
                    <div style={{ fontSize: ".875rem", color: "var(--texte-secondaire)" }}>{item.desc}</div>
                    {!item.dispo && (
                      <div style={{
                        marginTop: ".75rem", display: "inline-block",
                        fontSize: ".75rem", fontWeight: 600,
                        background: "var(--bordure)", color: "var(--texte-tertiaire)",
                        borderRadius: 6, padding: ".15rem .5rem",
                      }}>{"Bientôt"}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LIEN COMMUNES */}
        <section style={{ padding: "0 0 3.5rem" }}>
          <div className="container" style={{ maxWidth: 600 }}>
            <div style={{
              background: "linear-gradient(135deg, var(--bleu-marine) 0%, #C1292E 100%)",
              borderRadius: "var(--radius-xl)", padding: "2rem 2.5rem",
              textAlign: "center",
            }}>
              <h2 style={{ color: "white", fontSize: "1.375rem", fontWeight: 800, marginBottom: ".75rem" }}>
                {"Comparez avec les finances communales"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.72)", marginBottom: "1.5rem", fontSize: ".9375rem" }}>
                {"La dette de l'État en perspective avec celle des 34 900 communes françaises."}
              </p>
              <Link href="/communes" style={{
                background: "white", color: "var(--bleu-marine)",
                padding: ".75rem 1.75rem", borderRadius: "var(--radius-md)",
                textDecoration: "none", fontWeight: 700, display: "inline-block",
              }}>
                {"Explorer les communes →"}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{
        background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)",
        padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem",
      }}>
        <div className="container">
          {"© 2026 Budget Public — Source : Direction du Budget / DGFiP — Licence Ouverte v2.0"}
        </div>
      </footer>
    </>
  );
}
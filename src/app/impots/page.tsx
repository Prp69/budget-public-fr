// src/app/impots/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Impôts en France — Budget Public",
  description: "Comprendre la fiscalité française : impôt sur le revenu, TVA, cotisations. À quoi servent vos impôts ? Données officielles DGFiP.",
};

const RECETTES = [
  { label: "TVA",                          montant: 209_700_000_000, pct: 46.4, couleur: "#003189", emoji: "🛒" },
  { label: "Impôt sur le revenu (IR)",     montant: 94_600_000_000,  pct: 20.9, couleur: "#0891B2", emoji: "👤" },
  { label: "Impôt sur les sociétés (IS)",  montant: 65_300_000_000,  pct: 14.4, couleur: "#1E4E8C", emoji: "🏢" },
  { label: "TICPE (carburants)",           montant: 16_100_000_000,  pct: 3.6,  couleur: "#F59E0B", emoji: "⛽" },
  { label: "Autres recettes fiscales",     montant: 66_800_000_000,  pct: 14.7, couleur: "#8B5CF6", emoji: "📦" },
];

const FACTS = [
  {
    titre: "Impôt sur le revenu",
    desc: "44 % des foyers fiscaux ne paient pas l'IR grâce aux abattements et au quotient familial. Le taux marginal maximal est de 45 %.",
    emoji: "👥", couleur: "#003189",
    href: "/impots/ir",
  },
  {
    titre: "TVA",
    desc: "Premier impôt français. Taux normal à 20 %, réduit à 10 % ou 5,5 %. Tout le monde la paie, quel que soit son revenu.",
    emoji: "🏷️", couleur: "#C1292E",
    href: "/impots/tva",
  },
  {
    titre: "Prélèvements obligatoires",
    desc: "La France est à 45,4 % du PIB, l'un des taux les plus élevés de l'OCDE. Cela inclut impôts ET cotisations sociales.",
    emoji: "📊", couleur: "#059669",
    href: "/impots",
  },
  {
    titre: "Niches fiscales",
    desc: "Plus de 470 niches fiscales recensées par le Conseil des prélèvements obligatoires, pour un coût estimé à 90 Md€/an.",
    emoji: "🕳️", couleur: "#F59E0B",
    href: "/impots",
  },
];

const total = RECETTES.reduce((s, r) => s + r.montant, 0);

function fmt(euros: number): string {
  if (euros >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1) + " Md€";
  return (euros / 1_000_000).toFixed(0) + " M€";
}

export default function ImpotsPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, #1a2744 0%, #C1292E 100%)",
          padding: "4.5rem 0 4rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,.05) 0%, transparent 60%)",
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
              {"Données DGFiP / PLF 2024"}
            </div>
            <h1 style={{
              color: "white",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800, lineHeight: 1.15,
              marginBottom: "1rem", letterSpacing: "-.03em",
            }}>
              {"Les impôts en France"}
            </h1>
            <p style={{
              color: "rgba(255,255,255,.72)",
              fontSize: "clamp(.9375rem, 2vw, 1.0625rem)",
              lineHeight: 1.7, maxWidth: 540,
            }}>
              {"À quoi servent vos impôts ? Qui paie quoi ? Explorez les recettes fiscales de l'État, la répartition entre impôts directs et indirects, et ce que financent vos contributions."}
            </p>
          </div>
        </section>

        {/* RÉPARTITION DES RECETTES */}
        <section style={{ padding: "3rem 0", background: "var(--fond)" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.375rem", marginBottom: ".5rem" }}>{"Recettes fiscales nettes de l'État"}</h2>
            <p style={{ color: "var(--texte-secondaire)", fontSize: ".9375rem", marginBottom: "2rem" }}>
              {"Total : " + fmt(total) + " — Loi de finances 2024"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {RECETTES.map((r) => (
                <div key={r.label} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1rem 1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".5rem", flexWrap: "wrap", gap: ".5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{r.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: ".9375rem" }}>{r.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{
                        fontWeight: 700, fontSize: ".875rem", color: r.couleur,
                        background: r.couleur + "18", borderRadius: 6, padding: ".15rem .5rem",
                        border: `1px solid ${r.couleur}33`,
                      }}>
                        {r.pct.toFixed(1) + " %"}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--bleu-marine)", minWidth: 80, textAlign: "right" }}>
                        {fmt(r.montant)}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: "var(--bordure)", borderRadius: 4 }}>
                    <div style={{
                      width: `${r.pct}%`, height: "100%", borderRadius: 4,
                      background: r.couleur,
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "1.25rem", fontSize: ".8125rem", color: "var(--texte-tertiaire)" }}>
              {"Source : PLF 2024 — Direction du Budget. Recettes fiscales nettes, hors remboursements et dégrèvements."}
            </p>
          </div>
        </section>

        {/* FAITS CLÉS */}
        <section style={{ padding: "3rem 0", background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.375rem", marginBottom: ".5rem" }}>{"Le saviez-vous ?"}</h2>
            <p style={{ color: "var(--texte-secondaire)", fontSize: ".9375rem", marginBottom: "2rem" }}>
              {"Points clés sur la fiscalité française"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {FACTS.map((f) => (
                <div key={f.titre} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  boxShadow: "var(--ombre-xs)",
                  borderTop: `3px solid ${f.couleur}`,
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>{f.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: ".5rem", color: f.couleur }}>{f.titre}</div>
                  <div style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIEN COLLECTIVITÉS */}
        <section style={{ padding: "3rem 0" }}>
          <div className="container" style={{ maxWidth: 720 }}>
            <div style={{
              background: "var(--blanc)",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--ombre-xs)",
            }}>
              <h2 style={{ fontSize: "1.25rem", marginBottom: ".75rem" }}>{"Impôts locaux vs impôts nationaux"}</h2>
              <p style={{ color: "var(--texte-secondaire)", fontSize: ".9375rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                {"En plus des impôts nationaux (IR, TVA, IS…), les communes perçoivent des impôts locaux : taxe foncière, cotisation foncière des entreprises (CFE). Ces recettes représentent une part importante des budgets communaux."}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/communes" style={{
                  background: "var(--bleu-marine)", color: "white",
                  padding: ".75rem 1.5rem", borderRadius: "var(--radius-md)",
                  textDecoration: "none", fontWeight: 700, fontSize: ".9375rem",
                }}>
                  {"Explorer les finances communales →"}
                </Link>
                <Link href="/comprendre" style={{
                  background: "var(--bleu-pale)", color: "var(--bleu-marine)",
                  border: "1px solid var(--bordure)",
                  padding: ".75rem 1.5rem", borderRadius: "var(--radius-md)",
                  textDecoration: "none", fontWeight: 600, fontSize: ".9375rem",
                }}>
                  {"Guide pédagogique"}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer style={{
        background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)",
        padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem",
      }}>
        <div className="container">
          {"© 2026 Budget Public — Source : DGFiP / Direction du Budget — Licence Ouverte v2.0"}
        </div>
      </footer>
    </>
  );
}
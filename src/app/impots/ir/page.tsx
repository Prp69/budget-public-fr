// src/app/impots/ir/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Impôt sur le revenu — Budget Public",
  description: "Comment fonctionne l'impôt sur le revenu en France ? Barème, tranches, quotient familial, niches fiscales. Données DGFiP 2024.",
};

const TRANCHES_2024 = [
  { de: 0,      a: 11_294,  taux: 0,   label: "Exonéré" },
  { de: 11_294, a: 28_797,  taux: 11,  label: "11 %" },
  { de: 28_797, a: 82_341,  taux: 30,  label: "30 %" },
  { de: 82_341, a: 177_106, taux: 41,  label: "41 %" },
  { de: 177_106, a: Infinity, taux: 45, label: "45 %" },
];

const STATS = [
  { val: "94 Md€",    lbl: "Recettes IR 2024", emoji: "💰" },
  { val: "20,9 %",    lbl: "Part des recettes fiscales", emoji: "📊" },
  { val: "19,1 M",    lbl: "Foyers fiscaux imposables", emoji: "👥" },
  { val: "37,6 M",    lbl: "Foyers fiscaux au total", emoji: "🏠" },
  { val: "4 926 €",   lbl: "Cotisation moyenne (foyers imposés)", emoji: "🔢" },
  { val: "51 %",      lbl: "Foyers non imposables", emoji: "🟢" },
];

const MECANISMES = [
  {
    titre: "Le quotient familial",
    emoji: "👨‍👩‍👧‍👦",
    texte: "Le revenu imposable est divisé par le nombre de parts du foyer (1 pour un célibataire, 2 pour un couple, + 0,5 par enfant). L'impôt est calculé sur ce quotient puis multiplié par le nombre de parts. Ce système avantage les familles nombreuses.",
  },
  {
    titre: "La décote",
    emoji: "⬇️",
    texte: "Pour les faibles revenus proches du seuil d'imposition, une décote réduit l'impôt calculé. En 2024, la décote s'applique lorsque l'impôt est inférieur à 1 929 € pour un célibataire ou 3 191 € pour un couple.",
  },
  {
    titre: "Les niches fiscales",
    emoji: "🏠",
    texte: "Les réductions et crédits d'impôt (emploi à domicile, dons, investissement locatif...) sont plafonnés à 10 000 € par an et par foyer pour les principales niches. Les niches fiscales représentent environ 90 Md€ de manque à gagner pour l'État.",
  },
  {
    titre: "La mensualisation",
    emoji: "📅",
    texte: "Depuis 2019, l'impôt sur le revenu est prélevé à la source directement sur le salaire, la pension ou le revenu. Le taux de prélèvement est calculé par la DGFiP et transmis aux employeurs via la DSN.",
  },
];

const EXEMPLES = [
  { revenu: 20_000, impot: 0,     taux_effectif: 0 },
  { revenu: 30_000, impot: 1_003, taux_effectif: 3.3 },
  { revenu: 40_000, impot: 3_303, taux_effectif: 8.3 },
  { revenu: 60_000, impot: 9_403, taux_effectif: 15.7 },
  { revenu: 80_000, impot: 16_143, taux_effectif: 20.2 },
  { revenu: 100_000, impot: 24_583, taux_effectif: 24.6 },
  { revenu: 200_000, impot: 63_583, taux_effectif: 31.8 },
];

function fmt(n: number): string {
  return n.toLocaleString("fr-FR") + " €";
}

export default function ImpotsIRPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #003189 60%, #1a2744 100%)",
          padding: "4.5rem 0 4rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div className="container" style={{ position: "relative" }}>
            <Link href="/impots" style={{ color: "rgba(255,255,255,.6)", fontSize: ".875rem", display: "inline-flex", alignItems: "center", gap: ".375rem", marginBottom: "1.5rem", textDecoration: "none" }}>
              {"← Vue d'ensemble des impôts"}
            </Link>
            <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-.03em" }}>
              {"Impôt sur le revenu"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "clamp(.9375rem, 2vw, 1.0625rem)", lineHeight: 1.7, maxWidth: 560, marginBottom: "2.5rem" }}>
              {"Barème 2024, tranches, quotient familial et mécanismes de l'IR. Qui paye quoi, et combien."}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
              {STATS.slice(0, 3).map((s) => (
                <div key={s.lbl}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", letterSpacing: "-.03em" }}>{s.val}</div>
                  <div style={{ fontSize: ".8125rem", color: "rgba(255,255,255,.5)", marginTop: ".2rem" }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS COMPLÈTES */}
        <section style={{ padding: "3rem 0", borderBottom: "1px solid var(--bordure)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
              {STATS.map((s) => (
                <div key={s.lbl} style={{
                  background: "var(--blanc)", border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{s.emoji}</div>
                  <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--bleu-marine)", letterSpacing: "-.03em" }}>{s.val}</div>
                  <div style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", marginTop: ".25rem" }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BARÈME */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Barème 2024 (revenus 2023)"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2rem", fontSize: ".9375rem" }}>
              {"Pour une part (célibataire sans enfant). Le barème est progressif : chaque tranche ne s'applique qu'à la partie du revenu comprise dans cette tranche."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {TRANCHES_2024.map((t, i) => (
                <div key={i} style={{
                  background: "var(--blanc)", border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
                  display: "grid", gridTemplateColumns: "1fr auto",
                  alignItems: "center", gap: "1rem",
                  borderLeft: "4px solid " + (
                    t.taux === 0 ? "#16a34a" :
                    t.taux <= 11 ? "#2563eb" :
                    t.taux <= 30 ? "#7c3aed" :
                    t.taux <= 41 ? "#ea580c" : "#dc2626"
                  ),
                }}>
                  <div>
                    <div style={{ fontSize: ".8125rem", color: "var(--texte-tertiaire)", marginBottom: ".25rem" }}>
                      {t.de === 0
                        ? "Jusqu'à " + t.a.toLocaleString("fr-FR") + " €"
                        : t.a === Infinity
                          ? "Au-delà de " + t.de.toLocaleString("fr-FR") + " €"
                          : "De " + t.de.toLocaleString("fr-FR") + " € à " + t.a.toLocaleString("fr-FR") + " €"
                      }
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--texte-primaire)" }}>{t.label}</div>
                  </div>
                  <div style={{
                    fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-.04em",
                    color: t.taux === 0 ? "#16a34a" : t.taux >= 41 ? "#dc2626" : "var(--bleu-marine)",
                  }}>
                    {t.taux} %
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "1.5rem", background: "var(--bleu-pale)", borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem", borderLeft: "3px solid var(--bleu-moyen)",
              fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.65,
            }}>
              {"💡 Exemple : un célibataire avec 50 000 € de revenus imposables paie 0 € sur les 11 294 premiers euros, 11% sur la tranche 11 294–28 797 € (soit 1 925 €) et 30% sur la tranche 28 797–50 000 € (soit 6 361 €). Total : 8 286 €, soit un taux effectif de 16,6%."}
            </div>
          </div>
        </section>

        {/* EXEMPLES */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Exemples de cotisations"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2rem", fontSize: ".9375rem" }}>
              {"Pour un célibataire, sans enfant, sans réduction ni crédit d'impôt."}
            </p>
            <div style={{ display: "grid", gap: ".625rem" }}>
              {EXEMPLES.map((e) => (
                <div key={e.revenu} style={{
                  background: "var(--blanc)", border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)", padding: "1rem 1.5rem",
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  alignItems: "center", gap: "1rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div>
                    <div style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginBottom: ".25rem" }}>{"Revenu net imposable"}</div>
                    <div style={{ fontWeight: 700, color: "var(--texte-primaire)" }}>{fmt(e.revenu)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginBottom: ".25rem" }}>{"Impôt dû"}</div>
                    <div style={{ fontWeight: 700, color: e.impot === 0 ? "#16a34a" : "var(--rouge-accent)" }}>
                      {e.impot === 0 ? "0 € (non imposable)" : fmt(e.impot)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginBottom: ".25rem" }}>{"Taux effectif"}</div>
                    <div style={{ fontWeight: 700, color: "var(--texte-primaire)" }}>
                      {e.taux_effectif.toFixed(1)} %
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MÉCANISMES */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Les mécanismes clés"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"Ce qui rend le calcul de l'IR plus complexe qu'une simple application du barème."}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.25rem" }}>
              {MECANISMES.map((m) => (
                <div key={m.titre} style={{
                  background: "var(--blanc)", border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)", padding: "1.5rem",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".875rem" }}>
                    <span style={{ fontSize: "1.625rem" }}>{m.emoji}</span>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--texte-primaire)" }}>{m.titre}</h3>
                  </div>
                  <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.7, margin: 0 }}>{m.texte}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/impots/tva" className="btn" style={{ background: "var(--bleu-marine)", color: "white" }}>
                {"Voir la TVA →"}
              </Link>
              <Link href="/impots" className="btn" style={{ background: "var(--blanc)", color: "var(--texte-primaire)", border: "1px solid var(--bordure)" }}>
                {"← Vue d'ensemble"}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Données DGFiP / Bofip — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}
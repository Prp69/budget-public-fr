// src/app/etat/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import ComparaisonEU from "@/components/ComparaisonEU";

export const metadata: Metadata = {
  title: "Budget de l'État — Budget Public",
  description: "PLF, PLFSS, dépenses publiques totales. Où vont les 1 500 milliards de dépenses publiques françaises ?",
};

// ─── Données 2025 ─────────────────────────────────────────────────────────────

const BUDGETS = [
  {
    id: "etat",
    label: "Budget de l'État (PLF)",
    montant: 491_000_000_000,
    couleur: "var(--bleu)",
    pct: 100, // base de référence visuelle
    desc: "Dépenses nettes du budget général — ministères, dette, transferts aux collectivités.",
    lien: "/etat/ministeres",
    labelLien: "Détail par ministère →",
    tag: "PLF 2025",
  },
  {
    id: "secu",
    label: "Sécurité sociale (PLFSS)",
    montant: 666_000_000_000,
    couleur: "#2B8C6B",
    pct: 136,
    desc: "Toutes branches : maladie (266 Md€), vieillesse (304 Md€), famille (59 Md€), autonomie (42 Md€).",
    lien: "/etat/securite-sociale",
    labelLien: "Détail par branche →",
    tag: "PLFSS 2025",
  },
  {
    id: "collectivites",
    label: "Collectivités territoriales",
    montant: 290_000_000_000,
    couleur: "#B45309",
    pct: 59,
    desc: "Communes, départements, régions — budgets de fonctionnement et d'investissement.",
    lien: "/communes",
    labelLien: "Explorer les communes →",
    tag: "2023",
  },
];

const TOTAL_DEPENSES_PUBLIQUES = 1_600_000_000_000; // ~60% du PIB

const BRANCHES_SECU = [
  { label: "Maladie (Ondam)",  montant: 266_000_000_000, couleur: "#2B8C6B",  evol: +2.8 },
  { label: "Vieillesse",        montant: 304_000_000_000, couleur: "#247A5E",  evol: +3.1 },
  { label: "Famille",           montant:  59_000_000_000, couleur: "#3DAB88",  evol: +0.8 },
  { label: "Autonomie",         montant:  42_000_000_000, couleur: "#5BC4A2",  evol: +6.0 },
  { label: "AT-MP",             montant:  16_000_000_000, couleur: "#7DD3BE",  evol: +2.2 },
];

const MINISTERES_TOP = [
  { nom: "Éducation nationale", budget: 84_600_000_000, evol: +2.1 },
  { nom: "Défense",              budget: 47_200_000_000, evol: +7.5 },
  { nom: "Ens. supérieur",       budget: 31_400_000_000, evol: +3.8 },
  { nom: "Intérieur",            budget: 22_500_000_000, evol: +3.2 },
  { nom: "Travail & Emploi",     budget: 21_800_000_000, evol: -1.4 },
];

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(0) + " Md€";
  return (n / 1e6).toFixed(0) + " M€";
}

const maxBranche = Math.max(...BRANCHES_SECU.map((b) => b.montant));
const maxMinistere = Math.max(...MINISTERES_TOP.map((m) => m.budget));

export default function EtatPage() {
  return (
    <>
      <Header />
      <main>

        {/* ── HERO ── */}
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem" }}>
              <div>
                <span className="tag-hero">🏛️ Finances publiques nationales</span>
                <h1>{"Budget de l'État"}</h1>
                <p className="lead">
                  {"L'État dépense 1 600 milliards d'euros par an au total, si l'on additionne le budget de l'État, la Sécurité sociale et les collectivités locales. Ce chiffre représente environ 57 % du PIB français, ce qui place la France parmi les pays où la part de la dépense publique est la plus élevée au monde."}
                </p>
                <p className="lead" style={{ marginTop: ".75rem" }}>
                  {"Contrairement à ce que l'on croit souvent, le budget de l'État (PLF, 491 Md€) n'est que la partie émergée de l'iceberg. La Sécurité sociale (PLFSS) pèse à elle seule 666 Md€ — soit davantage — tandis que les collectivités territoriales (communes, départements, régions) gèrent 290 Md€ supplémentaires. Ces trois budgets sont votés séparément chaque automne par le Parlement."}
                </p>
              </div>
              <div style={{ display: "flex", gap: "2.5rem", flexShrink: 0, flexWrap: "wrap" }}>
                <div>
                  <div className="stat-hero">{"1 600 Md€"}</div>
                  <div className="stat-hero-label">{"Dépenses publiques totales"}</div>
                </div>
                <div>
                  <div className="stat-hero" style={{ color: "rgba(255,255,255,.7)" }}>{"~60 %"}</div>
                  <div className="stat-hero-label">{"Du PIB français"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VUE D'ENSEMBLE DES 3 BUDGETS ── */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Les trois grands blocs de dépenses publiques"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 700 }}>
              {"Les dépenses publiques françaises se répartissent entre trois grandes sphères, chacune votée par un texte de loi distinct chaque automne."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {BUDGETS.map((b) => (
                <div key={b.id} className="carte" style={{ padding: "1.5rem 1.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
                        <span className="tag tag-gris">{b.tag}</span>
                        <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: "1rem", color: "var(--encre)" }}>{b.label}</span>
                      </div>
                      <p style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-2)", lineHeight: 1.6 }}>{b.desc}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 700, color: b.couleur, lineHeight: 1, letterSpacing: "-.02em" }}>{fmt(b.montant)}</div>
                    </div>
                  </div>
                  {/* Barre proportionnelle */}
                  <div style={{ background: "var(--creme-fonce)", borderRadius: 3, height: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(b.montant / TOTAL_DEPENSES_PUBLIQUES) * 100}%`, background: b.couleur }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".625rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-3)" }}>
                      {((b.montant / TOTAL_DEPENSES_PUBLIQUES) * 100).toFixed(0)}{"% des dépenses publiques totales"}
                    </span>
                    <Link href={b.lien} style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", fontWeight: 600, color: b.couleur, textDecoration: "none" }}>
                      {b.labelLien}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEUX COLONNES : ÉTAT + SÉCU ── */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <div className="grille-2">

              {/* PLF — Top 5 ministères */}
              <div>
                <div className="chart-wrapper">
                  <div className="chart-title">{"Budget État — Top 5 ministères"}</div>
                  <div className="chart-subtitle">{"Crédits de paiement — PLF 2025"}</div>
                  {MINISTERES_TOP.map((m) => (
                    <div key={m.nom} style={{ marginBottom: ".75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".25rem" }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)" }}>{m.nom}</span>
                        <span style={{ display: "flex", gap: ".625rem" }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{fmt(m.budget)}</span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: m.evol >= 0 ? "#1E6B3C" : "var(--rouge)", minWidth: 44, textAlign: "right" }}>{m.evol >= 0 ? "+" : ""}{m.evol}%</span>
                        </span>
                      </div>
                      <div style={{ background: "var(--creme-fonce)", borderRadius: 2, height: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${(m.budget / maxMinistere) * 100}%`, background: "var(--bleu)" }} />
                      </div>
                    </div>
                  ))}
                  <div className="chart-source">{"Source : PLF 2025, Direction du Budget"}</div>
                  <Link href="/etat/ministeres" className="btn btn-primaire" style={{ marginTop: "1rem", fontSize: ".8125rem" }}>{"Voir tous les ministères →"}</Link>
                </div>
              </div>

              {/* PLFSS — Branches */}
              <div>
                <div className="chart-wrapper">
                  <div className="chart-title">{"Sécurité sociale — Par branche"}</div>
                  <div className="chart-subtitle">{"Objectifs de dépenses — PLFSS 2025"}</div>
                  {BRANCHES_SECU.map((b) => (
                    <div key={b.label} style={{ marginBottom: ".75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".25rem" }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)" }}>{b.label}</span>
                        <span style={{ display: "flex", gap: ".625rem" }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{fmt(b.montant)}</span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "#1E6B3C", minWidth: 44, textAlign: "right" }}>{"+"+b.evol+"%"}</span>
                        </span>
                      </div>
                      <div style={{ background: "var(--creme-fonce)", borderRadius: 2, height: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${(b.montant / maxBranche) * 100}%`, background: b.couleur }} />
                      </div>
                    </div>
                  ))}
                  <div className="chart-source">{"Source : PLFSS 2025, Ministère de la Santé"}</div>
                  <Link href="/etat/securite-sociale" className="btn" style={{ marginTop: "1rem", fontSize: ".8125rem", background: "#2B8C6B", color: "white" }}>{"Détail Sécurité sociale →"}</Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── DÉFICIT & DETTE ── */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Déficits et dettes"}</h2>
            <div className="grille-2">
              {[
                { label: "Déficit État (PLF 2025)",        v: "153 Md€",   s: "5,1 % du PIB",         c: "var(--rouge)" },
                { label: "Déficit Sécu (PLFSS 2025)",      v: "−22 Md€",   s: "Toutes branches",       c: "var(--rouge)" },
                { label: "Dette publique totale",           v: "3 162 Md€", s: "111,6 % du PIB — 2024", c: "var(--rouge)" },
                { label: "Dette sociale (CADES + Acoss)",   v: "163 Md€",   s: "Fin 2025 (Cour des comptes)", c: "#B45309" },
              ].map((c) => (
                <div key={c.label} className="carte" style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 700, color: c.c, lineHeight: 1, letterSpacing: "-.02em" }}>{c.v}</div>
                  <div style={{ fontFamily: "var(--sans)", fontWeight: 600, color: "var(--encre)", marginTop: ".5rem", fontSize: ".9rem" }}>{c.label}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{c.s}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat/dette" className="btn btn-rouge">{"Dette publique →"}</Link>
              <Link href="/sources" className="btn btn-contour">{"Sources →"}</Link>
            </div>
          </div>
        </section>

        <ComparaisonEU metrique="depenses" titre={"Dépenses publiques totales — France vs UE27 (2024)"} />
        <ComparaisonEU metrique="deficit" titre={"Déficit public — France vs UE27 (2024)"} />

      </main>


      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2025 BudgetPublic — PLF & PLFSS 2025"}</span>
          <Link href="/sources" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"Sources →"}</Link>
        </div>
      </footer>
    </>
  );
}
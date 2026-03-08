"use client";
// src/components/HomeClient.tsx
import Link from "next/link";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

interface ChiffresNationaux {
  total_depenses: number;
  total_dette: number;
  nb_communes: number;
}

interface Props {
  chiffres: ChiffresNationaux | null;
}

const RUBRIQUES = [
  {
    slug: "communes",
    label: "Communes",
    titre: "35 000 budgets,\nune seule vérité",
    description: "Comparez les finances de votre commune. Dépenses, dette, investissements — données officielles OFGL, mises à jour annuellement.",
    couleur: "#2B4C8C",
    stat: "35 357",
    statLabel: "communes en France",
    liens: [
      { label: "Rechercher une commune", href: "/communes" },
      { label: "Comprendre le budget", href: "/comprendre" },
      { label: "Élections 2026", href: "/elections" },
    ],
    chartTitle: "Répartition dépenses communes",
    chartSub: "En % — moyenne nationale 2022",
    chartSource: "Source : OFGL, base communes consolidée 2022",
    barres: [
      { nom: "Personnel", pct: 57 },
      { nom: "Achats & services", pct: 22 },
      { nom: "Investissement", pct: 14 },
      { nom: "Autres", pct: 7 },
    ],
  },
  {
    slug: "etat",
    label: "État",
    titre: "491 milliards.\nComment sont-ils\ndépensés ?",
    description: "Du ministère de l'Éducation à la Défense, explorez la répartition du budget de l'État et l'évolution de la dette depuis 1980.",
    couleur: "#1A3260",
    stat: "112 %",
    statLabel: "du PIB — dette publique 2024",
    liens: [
      { label: "Budget par ministère", href: "/etat/ministeres" },
      { label: "Dette publique", href: "/etat/dette" },
      { label: "Vue d'ensemble", href: "/etat" },
    ],
    chartTitle: "5 premiers ministères",
    chartSub: "En milliards d'euros — PLF 2024",
    chartSource: "Source : Direction du Budget, PLF 2024",
    barres: [
      { nom: "Éducation", pct: 100, val: "84,6 Md" },
      { nom: "Défense", pct: 56, val: "47,2 Md" },
      { nom: "Recherche", pct: 36, val: "30,6 Md" },
      { nom: "Intérieur", pct: 27, val: "22,5 Md" },
      { nom: "Travail", pct: 26, val: "21,8 Md" },
    ],
  },
  {
    slug: "impots",
    label: "Impôts",
    titre: "452 milliards.\nD'où vient\nl'argent ?",
    description: "TVA, impôt sur le revenu, impôt sur les sociétés. Qui paye quoi et comment les recettes fiscales sont réparties.",
    couleur: "#C0392B",
    stat: "46,4 %",
    statLabel: "des recettes fiscales — TVA",
    liens: [
      { label: "Vue d'ensemble", href: "/impots" },
      { label: "Impôt sur le revenu", href: "/impots/ir" },
      { label: "TVA", href: "/impots/tva" },
    ],
    chartTitle: "Recettes fiscales par impôt",
    chartSub: "En % du total — 2024",
    chartSource: "Source : DGFiP, rapport recettes fiscales 2024",
    barres: [
      { nom: "TVA", pct: 46.4, val: "46,4%" },
      { nom: "Impôt revenu", pct: 20.9, val: "20,9%" },
      { nom: "Impôt sociétés", pct: 14.4, val: "14,4%" },
      { nom: "TICPE", pct: 3.6, val: "3,6%" },
      { nom: "Autres", pct: 14.7, val: "14,7%" },
    ],
  },
];

const STATS_NATIONALES = [
  { val: "491 Md€", lbl: "Budget de l'État 2024",  rouge: false },
  { val: "3 162 Md€", lbl: "Dette publique totale", rouge: true },
  { val: "452 Md€", lbl: "Recettes fiscales 2024",  rouge: false },
  { val: "35 357", lbl: "Communes en France",        rouge: false },
];

export default function HomeClient({ chiffres }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const r = RUBRIQUES[activeIdx];

  return (
    <main style={{ background: "var(--creme)" }}>

      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0 4.5rem", borderBottom: "1px solid var(--bordure)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 80% 10%, rgba(43,76,140,.07) 0%, transparent 45%), radial-gradient(circle at 15% 90%, rgba(192,57,43,.04) 0%, transparent 35%)",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "4rem", alignItems: "center" }}>

            {/* ── Gauche ── */}
            <div className="fade-up">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                background: "var(--rouge-pale)", border: "1px solid rgba(192,57,43,.15)",
                borderRadius: 3, padding: ".3rem .875rem", marginBottom: "2rem",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rouge)", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--rouge)" }}>
                  {"Données officielles — DGFiP · OFGL 2024"}
                </span>
              </div>

              <h1 style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
                fontWeight: 900, lineHeight: 1.08,
                letterSpacing: "-.035em",
                color: "var(--encre)",
                marginBottom: "1.5rem",
              }}>
                {"Les finances\npubliques françaises,\n"}<span style={{
                  color: "var(--bleu)",
                  borderBottom: "3px solid var(--rouge)",
                  paddingBottom: "2px",
                }}>{"sans filtre"}</span>
              </h1>

              <p style={{ fontFamily: "var(--sans)", fontSize: "1.125rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 480, marginBottom: "2.5rem" }}>
                {"Communes, État, impôts — accédez aux comptes officiels et comprenez où vont vos impôts."}
              </p>

              <SearchBar />
              <p style={{ fontFamily: "var(--sans)", marginTop: ".875rem", fontSize: ".8125rem", color: "var(--gris-3)" }}>
                {"Exemple : Paris, Lyon, votre code postal…"}
              </p>
            </div>

            {/* ── Droite — tableau de bord ── */}
            <div className="fade-up fade-up-2">
              <div style={{ background: "var(--blanc)", border: "1px solid var(--bordure)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--ombre-md)" }}>
                {/* Tricolore fin en haut */}
                <div style={{ height: 4, display: "flex" }}>
                  <div style={{ flex: 1, background: "#2B4C8C" }} />
                  <div style={{ flex: 1, background: "#F0EFE9" }} />
                  <div style={{ flex: 1, background: "#C0392B" }} />
                </div>
                <div style={{ padding: "1.5rem 1.75rem" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gris-3)", marginBottom: "1.25rem" }}>
                    {"Tableau de bord — France 2024"}
                  </div>
                  {STATS_NATIONALES.map((s, i) => (
                    <div key={s.lbl} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: ".875rem 0",
                      borderBottom: i < STATS_NATIONALES.length - 1 ? "1px solid var(--gris-5)" : "none",
                    }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-1)" }}>{s.lbl}</span>
                      <span style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: s.rouge ? "var(--rouge)" : "var(--bleu)", letterSpacing: "-.02em" }}>
                        {s.val}
                      </span>
                    </div>
                  ))}
                  <Link href="/sources" style={{ display: "block", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--gris-5)", fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", textDecoration: "none" }}>
                    {"Sources : PLF 2024, INSEE, OFGL, DGFiP →"}
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          RUBRIQUES — Onglets
      ════════════════════════════════════════════════ */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--bordure)" }}>
        <div className="container">

          <div style={{ marginBottom: "2.5rem" }}>
            <span className="rule-rouge" />
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 700, color: "var(--encre)", letterSpacing: "-.02em" }}>
              {"Explorer les finances publiques"}
            </h2>
          </div>

          {/* Onglets */}
          <div style={{ display: "flex", borderBottom: "2px solid var(--gris-5)", marginBottom: "2.5rem", gap: 0 }}>
            {RUBRIQUES.map((rub, i) => (
              <button key={rub.slug} onClick={() => setActiveIdx(i)} style={{
                fontFamily: "var(--sans)", fontSize: ".9375rem",
                fontWeight: activeIdx === i ? 700 : 400,
                color: activeIdx === i ? rub.couleur : "var(--gris-2)",
                background: "none", border: "none", cursor: "pointer",
                padding: ".75rem 1.5rem .75rem",
                borderBottom: activeIdx === i ? `3px solid ${rub.couleur}` : "3px solid transparent",
                marginBottom: "-2px",
                transition: "all 150ms ease",
              }}>
                {rub.label}
              </button>
            ))}
          </div>

          {/* Panneau */}
          <div key={r.slug} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", animation: "fadeUp .2s ease both" }}>

            {/* Texte */}
            <div>
              <h3 style={{
                fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 3vw, 2.625rem)",
                fontWeight: 700, lineHeight: 1.12, letterSpacing: "-.025em",
                color: "var(--encre)", marginBottom: "1.25rem", whiteSpace: "pre-line",
              }}>{r.titre}</h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.8, marginBottom: "2rem" }}>
                {r.description}
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {r.liens.map((lien, i) => (
                  <Link key={lien.href} href={lien.href} style={{
                    display: "flex", alignItems: "center", gap: ".75rem",
                    fontFamily: "var(--sans)", fontSize: ".9375rem",
                    color: i === 0 ? r.couleur : "var(--gris-1)",
                    fontWeight: i === 0 ? 600 : 400,
                    textDecoration: "none",
                    padding: ".625rem 0",
                    borderBottom: "1px solid var(--gris-5)",
                    transition: "gap 150ms ease",
                  }}>
                    <span style={{ width: i === 0 ? 24 : 16, height: 2, background: i === 0 ? r.couleur : "var(--gris-4)", borderRadius: 1, flexShrink: 0, transition: "width 150ms ease" }} />
                    {lien.label}
                    <span style={{ marginLeft: "auto", fontSize: ".875rem", opacity: .35 }}>{"→"}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Carte avec stat + graphique Economist */}
            <div>
              <div style={{ background: "var(--blanc)", border: "1px solid var(--bordure)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--ombre-sm)" }}>
                <div style={{ height: 4, background: r.couleur }} />
                <div style={{ padding: "1.75rem 2rem" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gris-3)", marginBottom: ".625rem" }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 900, color: r.couleur, letterSpacing: "-.04em", lineHeight: 1, marginBottom: ".375rem" }}>
                    {r.stat}
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--gris-2)", marginBottom: "1.75rem" }}>
                    {r.statLabel}
                  </div>

                  {/* Chart style Economist */}
                  <div style={{ borderTop: "3px solid var(--rouge)", paddingTop: "1rem" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--encre)", marginBottom: ".25rem" }}>
                      {r.chartTitle}
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", color: "var(--gris-2)", marginBottom: "1rem", fontStyle: "italic" }}>
                      {r.chartSub}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                      {r.barres.map((b) => (
                        <div key={b.nom} style={{ display: "grid", gridTemplateColumns: "90px 1fr 48px", alignItems: "center", gap: ".625rem" }}>
                          <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-1)" }}>{b.nom}</span>
                          <div style={{ background: "var(--creme-fonce)", borderRadius: 2, height: 14, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: r.couleur, width: b.pct + "%", opacity: .9 }} />
                          </div>
                          <span style={{ fontFamily: "var(--mono)", fontSize: ".6875rem", color: "var(--gris-2)", textAlign: "right" }}>
                            {"val" in b ? (b as { val: string }).val : b.pct + "%"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", color: "var(--gris-3)", marginTop: ".875rem", borderTop: "1px solid var(--gris-5)", paddingTop: ".5rem", fontStyle: "italic" }}>
                      {r.chartSource}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BANDEAU ÉLECTIONS
      ════════════════════════════════════════════════ */}
      <section style={{ background: "var(--encre)", padding: "3rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              background: "var(--rouge)", borderRadius: 3,
              padding: ".25rem .75rem", marginBottom: "1rem",
              fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 700,
              color: "white", letterSpacing: ".05em", textTransform: "uppercase",
            }}>
              <span style={{ width: 6, height: 6, background: "white", borderRadius: "50%", display: "inline-block" }} />
              {"15 mars 2026 — Élections municipales"}
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "white", letterSpacing: "-.02em" }}>
              {"Votez en connaissance de cause"}
            </h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "rgba(255,255,255,.5)", marginTop: ".5rem" }}>
              {"Consultez les comptes officiels de votre commune avant d'aller aux urnes."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/communes" style={{ fontFamily: "var(--sans)", display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".625rem 1.25rem", background: "white", color: "var(--encre)", fontWeight: 600, fontSize: ".875rem", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
              {"Ma commune →"}
            </Link>
            <Link href="/elections" style={{ fontFamily: "var(--sans)", display: "inline-flex", alignItems: "center", gap: ".5rem", padding: ".625rem 1.25rem", background: "transparent", color: "white", fontWeight: 500, fontSize: ".875rem", borderRadius: "var(--radius-sm)", textDecoration: "none", border: "1.5px solid rgba(255,255,255,.25)" }}>
              {"Voir le calendrier"}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer style={{ background: "var(--blanc)", borderTop: "1px solid var(--bordure)", padding: "3rem 0 2rem" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", height: 20, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: 6, background: "#2B4C8C" }} />
                  <div style={{ width: 6, background: "#F2F1ED", borderTop: "1px solid #E0DED7", borderBottom: "1px solid #E0DED7" }} />
                  <div style={{ width: 6, background: "#C0392B" }} />
                </div>
                <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "1rem", color: "var(--encre)" }}>
                  {"Budget"}<span style={{ color: "var(--bleu)" }}>{"Public"}</span>
                </span>
              </div>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", lineHeight: 1.7 }}>
                {"Données officielles sur les finances publiques françaises. Gratuit, sans publicité, sans inscription."}
              </p>
            </div>
            {[
              { titre: "Communes", liens: [{ l: "Rechercher", h: "/communes" }, { l: "Comprendre", h: "/comprendre" }, { l: "Élections 2026", h: "/elections" }] },
              { titre: "État & Impôts", liens: [{ l: "Budget État", h: "/etat" }, { l: "Dette publique", h: "/etat/dette" }, { l: "Fiscalité", h: "/impots" }] },
              { titre: "À propos", liens: [{ l: "Sources", h: "/sources" }, { l: "À propos", h: "/apropos" }] },
            ].map((col) => (
              <div key={col.titre}>
                <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gris-3)", marginBottom: ".875rem" }}>
                  {col.titre}
                </div>
                {col.liens.map((lien) => (
                  <Link key={lien.h} href={lien.h} style={{ display: "block", fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-1)", textDecoration: "none", marginBottom: ".5rem" }}>
                    {lien.l}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--gris-5)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>
              {"© 2026 Budget Public — OFGL / DGFiP / INSEE — Licence Ouverte v2.0"}
            </span>
            <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>
              {"Sans publicité · Sans inscription"}
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
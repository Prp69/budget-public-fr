// src/components/EffectifsMinisteres.tsx
// Graphique effectifs par ministère + évolution 15 ans
// Source : INSEE Siasp 2024, PLF annuels, DGAFP

// Données effectifs 2024 (agents État, hors opérateurs) — source INSEE Siasp
const EFFECTIFS_2024 = [
  { code: "08", nom: "Éducation nat. & Recherche", agents: 1_144_000, evol7ans: +44_568,  couleur: "#2B4C8C" },
  { code: "40", nom: "Intérieur",                  agents:   280_000, evol7ans: +13_462,  couleur: "#4A7EC7" },
  { code: "02", nom: "Défense",                    agents:   270_000, evol7ans:  +3_740,  couleur: "#1A3260" },
  { code: "44", nom: "Économie & Finances",        agents:   130_000, evol7ans: -15_267,  couleur: "#C0392B" },
  { code: "76", nom: "Justice",                    agents:    91_000, evol7ans: +11_916,  couleur: "#2B8C6B" },
  { code: "58", nom: "Transitions écolog.",        agents:    42_000, evol7ans:  +3_598,  couleur: "#3DAB88" },
  { code: "15", nom: "Agriculture",               agents:    30_000, evol7ans:  -1_406,  couleur: "#5BC4A2" },
  { code: "05", nom: "Action extérieure",         agents:    14_000, evol7ans:    -944,  couleur: "#7DD3BE" },
  { code: "07", nom: "Culture",                   agents:    12_000, evol7ans:    +515,  couleur: "#B45309" },
  { code: "11", nom: "Travail & Emploi",           agents:     9_400, evol7ans:  +6_456,  couleur: "#9B1B22" },
  { code: "62", nom: "Santé & Prévention",        agents:     5_600, evol7ans:  -7_482,  couleur: "#6B2B8C" },
];

// Historique effectifs totaux FPE (en milliers) — source INSEE Siasp séries longues
const HISTO_FPE = [
  { annee: 2010, total: 2_410 },
  { annee: 2011, total: 2_389 },
  { annee: 2012, total: 2_372 },
  { annee: 2013, total: 2_356 },
  { annee: 2014, total: 2_340 },
  { annee: 2015, total: 2_328 },
  { annee: 2016, total: 2_318 },
  { annee: 2017, total: 2_309 },
  { annee: 2018, total: 2_307 },
  { annee: 2019, total: 2_310 },
  { annee: 2020, total: 2_320 },
  { annee: 2021, total: 2_337 },
  { annee: 2022, total: 2_352 },
  { annee: 2023, total: 2_373 },
  { annee: 2024, total: 2_394 },
];

function fmtAgents(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + " M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + " k";
  return n.toLocaleString("fr-FR");
}

const maxAgents = Math.max(...EFFECTIFS_2024.map((e) => e.agents));
const maxHisto  = Math.max(...HISTO_FPE.map((h) => h.total));
const minHisto  = Math.min(...HISTO_FPE.map((h) => h.total));

export default function EffectifsMinisteres() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

      {/* ── Graphique 1 : Effectifs 2024 par ministère ── */}
      <div className="chart-wrapper">
        <div className="chart-title">{"Effectifs par ministère — 2024"}</div>
        <div className="chart-subtitle">
          {"Nombre d'agents de l'État (ETPT), hors opérateurs. La couleur indique l'évolution sur 7 ans (2017-2024)."}
        </div>

        {EFFECTIFS_2024.map((e) => {
          const pct      = (e.agents / maxAgents) * 100;
          const evolSign = e.evol7ans >= 0;
          return (
            <div key={e.code} style={{ marginBottom: ".875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".25rem", flexWrap: "wrap", gap: ".25rem" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", fontWeight: 500, color: "var(--encre)" }}>
                  {e.nom}
                </span>
                <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>
                    {fmtAgents(e.agents)}
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: ".75rem",
                    color: evolSign ? "#1E6B3C" : "var(--rouge)",
                    minWidth: 72, textAlign: "right",
                  }}>
                    {evolSign ? "+" : ""}{(e.evol7ans / 1000).toFixed(1)}k {evolSign ? "▲" : "▼"} /7 ans
                  </span>
                </span>
              </div>
              <div style={{ background: "var(--creme-fonce)", borderRadius: 3, height: 12, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  width: `${pct}%`,
                  background: evolSign ? e.couleur : "#C0392B",
                  opacity: 0.85,
                }} />
              </div>
            </div>
          );
        })}

        <div className="chart-source">
          {"Source : INSEE Siasp 2024, DGAFP — agents titulaires + contractuels, hors opérateurs et militaires pour la Défense"}
        </div>
      </div>

      {/* ── Graphique 2 : Évolution FPE 2010-2024 ── */}
      <div className="chart-wrapper">
        <div className="chart-title">{"Évolution totale de la fonction publique d'État — 2010 à 2024"}</div>
        <div className="chart-subtitle">
          {"En milliers d'agents (ETPT). Après la baisse de 2010-2017 (réformes RGPP/MAP), les effectifs repartent à la hausse depuis 2018."}
        </div>

        {/* Mini graphique en courbe via barres */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80, marginBottom: ".75rem" }}>
          {HISTO_FPE.map((h) => {
            const hauteurPct = ((h.total - minHisto) / (maxHisto - minHisto)) * 70 + 30;
            const isCurrent  = h.annee === 2024;
            const isMin      = h.total === minHisto;
            return (
              <div key={h.annee} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{
                  width: "100%", borderRadius: "2px 2px 0 0",
                  height: `${hauteurPct}%`,
                  background: isCurrent ? "var(--rouge)" : isMin ? "var(--bleu-fonce)" : "var(--bleu)",
                  opacity: isCurrent ? 1 : 0.65,
                  transition: "height .4s ease",
                }} />
              </div>
            );
          })}
        </div>

        {/* Axe années */}
        <div style={{ display: "flex", gap: 3 }}>
          {HISTO_FPE.map((h) => (
            <div key={h.annee} style={{ flex: 1, textAlign: "center" }}>
              {(h.annee % 5 === 0 || h.annee === 2024) && (
                <span style={{ fontFamily: "var(--mono)", fontSize: ".6rem", color: h.annee === 2024 ? "var(--rouge)" : "var(--gris-3)" }}>
                  {String(h.annee).slice(2)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Légende min/max */}
        <div style={{ display: "flex", gap: "2rem", marginTop: ".75rem", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)" }}>
            <strong style={{ color: "var(--bleu-fonce)" }}>{"Min 2017 : "}</strong>
            {(minHisto / 1000).toFixed(0) + " k agents"}
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)" }}>
            <strong style={{ color: "var(--rouge)" }}>{"2024 : "}</strong>
            {(HISTO_FPE.find(h => h.annee === 2024)!.total / 1000).toFixed(0) + " k agents"}
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)" }}>
            <strong>{"Variation 2010-2024 : "}</strong>
            {((HISTO_FPE.at(-1)!.total - HISTO_FPE[0].total) / 1000).toFixed(0)}{"k agents"}
          </div>
        </div>

        <div className="chart-source">
          {"Source : INSEE Siasp, séries annuelles 2010-2024 — Fonction publique de l'État (FPE), France hors Mayotte"}
        </div>
      </div>
    </div>
  );
}
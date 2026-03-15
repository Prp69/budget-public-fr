"use client";
// src/components/MinistreresClient.tsx
import { useState, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ministere {
  nom:    string;
  code:   string;
  budget: number;
  agents: number;
  evol:   number;
  desc:   string;
}

interface TitreDonnee { titre: string; label: string; cp: number; ae: number }
interface Programme    { num: string; label: string; cp: number }
interface PointHistorique { annee: string; cp: number }
interface DetailMinistere {
  titres:      TitreDonnee[];
  programmes:  Programme[];
  historique:  PointHistorique[];
  _debug?:     { colsDest: string[]; colsNature: string[] };
}
interface CacheEntry { data: DetailMinistere; ts: number }

// ─── Données statiques ────────────────────────────────────────────────────────

const MINISTERES: Ministere[] = [
  { nom: "Éducation nationale & Jeunesse",    code: "08", budget: 84_600_000_000, agents: 1_144_000, evol: +2.1,  desc: "Premier employeur de France, incluant les universités." },
  { nom: "Défense",                            code: "02", budget: 47_200_000_000, agents: 270_000,   evol: +7.5,  desc: "Loi de programmation militaire 2024-2030 en cours." },
  { nom: "Enseignement supérieur & Recherche", code: "38", budget: 31_400_000_000, agents: 170_000,   evol: +3.8,  desc: "Universités, CNRS, CEA, INRAE." },
  { nom: "Intérieur",                          code: "40", budget: 22_500_000_000, agents: 280_000,   evol: +3.2,  desc: "Police nationale, gendarmerie, sécurité civile." },
  { nom: "Travail & Emploi",                   code: "11", budget: 21_800_000_000, agents: 9_400,     evol: -1.4,  desc: "France Travail, aides à l'emploi." },
  { nom: "Économie, Finances & Souveraineté",  code: "44", budget: 19_400_000_000, agents: 130_000,   evol: +0.8,  desc: "DGFiP, Douanes, INSEE." },
  { nom: "Justice",                            code: "76", budget: 10_900_000_000, agents: 91_000,    evol: +8.1,  desc: "Tribunaux, prisons, accès au droit." },
  { nom: "Santé & Prévention",                 code: "62", budget: 10_100_000_000, agents: 5_600,     evol: +4.3,  desc: "Hors Assurance maladie (LFSS)." },
  { nom: "Transitions écologiques",            code: "58", budget: 9_700_000_000,  agents: 42_000,    evol: +12.4, desc: "Transports, logement, biodiversité." },
  { nom: "Agriculture & Souveraineté alim.",   code: "15", budget: 4_300_000_000,  agents: 30_000,    evol: +1.1,  desc: "Aides aux agriculteurs, filières alimentaires." },
  { nom: "Culture",                            code: "07", budget: 4_100_000_000,  agents: 12_000,    evol: +2.5,  desc: "Monuments, musées, spectacle vivant." },
  { nom: "Action extérieure",                  code: "05", budget: 3_800_000_000,  agents: 14_000,    evol: +0.9,  desc: "Diplomatie, consulats, coopération." },
];

// Historique effectifs (ETPT agents de l'État, hors opérateurs) — source : INSEE Siasp, PLF annuels
const EFFECTIFS_HISTORIQUE: Record<string, Record<number, number>> = {
  "08": { 2010: 980_000, 2013: 970_000, 2016: 975_000, 2019: 1_000_000, 2021: 1_020_000, 2022: 1_040_000, 2023: 1_100_000, 2024: 1_144_000 },
  "02": { 2010: 310_000, 2013: 295_000, 2016: 272_000, 2019: 268_000,   2021: 266_000,   2022: 268_000,   2023: 270_000,   2024: 276_000   },
  "38": { 2010: 155_000, 2013: 158_000, 2016: 160_000, 2019: 163_000,   2021: 165_000,   2022: 167_000,   2023: 169_000,   2024: 170_000   },
  "40": { 2010: 245_000, 2013: 242_000, 2016: 250_000, 2019: 260_000,   2021: 268_000,   2022: 273_000,   2023: 277_000,   2024: 280_000   },
  "11": { 2010: 12_500,  2013: 12_000,  2016: 11_500,  2019: 10_500,    2021: 10_000,    2022: 9_800,     2023: 9_600,     2024: 9_400     },
  "44": { 2010: 165_000, 2013: 158_000, 2016: 150_000, 2019: 143_000,   2021: 138_000,   2022: 134_000,   2023: 132_000,   2024: 130_000   },
  "76": { 2010: 68_000,  2013: 70_000,  2016: 74_000,  2019: 80_000,    2021: 84_000,    2022: 87_000,    2023: 89_000,    2024: 91_000    },
  "62": { 2010: 7_000,   2013: 6_800,   2016: 6_500,   2019: 6_000,     2021: 5_800,     2022: 5_700,     2023: 5_650,     2024: 5_600     },
  "58": { 2010: 55_000,  2013: 52_000,  2016: 49_000,  2019: 45_000,    2021: 43_000,    2022: 42_500,    2023: 42_200,    2024: 42_000    },
  "15": { 2010: 35_000,  2013: 33_500,  2016: 32_000,  2019: 31_000,    2021: 30_500,    2022: 30_200,    2023: 30_100,    2024: 30_000    },
  "07": { 2010: 11_000,  2013: 11_200,  2016: 11_500,  2019: 11_800,    2021: 11_900,    2022: 12_000,    2023: 12_000,    2024: 12_000    },
  "05": { 2010: 14_500,  2013: 14_200,  2016: 14_000,  2019: 14_000,    2021: 13_900,    2022: 13_900,    2023: 14_000,    2024: 14_000    },
};

const TITRES_COULEURS: Record<string, string> = {
  "1": "#2B4C8C",
  "2": "#4A7EC7",
  "3": "#2B8C6B",
  "5": "var(--gris-3)",
  "6": "#C0392B",
  "7": "#B45309",
};

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " Md€";
  if (n >= 1e6) return (n / 1e6).toFixed(0) + " M€";
  return n.toLocaleString("fr-FR") + " €";
}

function fmtAgents(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + " M";
  if (n >= 1000) return (n / 1000).toFixed(0) + " k";
  return String(n);
}

// ─── Cache ───────────────────────────────────────────────────────────────────

const CACHE: Record<string, CacheEntry> = {};
const TTL = 5 * 60 * 1000;

// ─── Composant principal ─────────────────────────────────────────────────────

export default function MinistreresClient() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [detail, setDetail]             = useState<DetailMinistere | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const maxBudget   = Math.max(...MINISTERES.map((m) => m.budget));
  const maxAgents   = Math.max(...MINISTERES.map((m) => m.agents));
  const totalBudget = MINISTERES.reduce((s, m) => s + m.budget, 0);

  const fetchDetail = useCallback(async (code: string) => {
    if (selectedCode === code) { setSelectedCode(null); setDetail(null); return; }
    setSelectedCode(code);
    setDetail(null);
    setError(null);
    const cached = CACHE[code];
    if (cached && Date.now() - cached.ts < TTL) { setDetail(cached.data); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/ministeres/${code}`);
      if (!res.ok) {
        const body = await res.text().catch(() => "(no body)");
        throw new Error(`HTTP ${res.status} — ${body.slice(0, 200)}`);
      }
      const data: DetailMinistere = await res.json();
      CACHE[code] = { data, ts: Date.now() };
      setDetail(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedCode]);

  return (
    <div>
      {/* ── En-tête ── */}
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="chart-title">{"Crédits par ministère — PLF 2025"}</div>
          <div className="chart-subtitle">{"Cliquez sur un ministère pour afficher la ventilation par titre, les programmes et l'historique 5 ans"}</div>
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.125rem", fontWeight: 700, color: "var(--bleu)" }}>
          {fmt(totalBudget)}
          <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 400, color: "var(--gris-3)", marginLeft: ".5rem" }}>{"hors dette"}</span>
        </div>
      </div>

      {/* ── Liste ministères ── */}
      {MINISTERES.map((m) => {
        const pct       = (m.budget / maxBudget) * 100;
        const isSelected = selectedCode === m.code;
        const isOther   = selectedCode !== null && !isSelected;

        return (
          <div key={m.code} style={{ marginBottom: ".625rem", opacity: isOther ? 0.45 : 1, transition: "opacity 200ms ease" }}>
            <button onClick={() => fetchDetail(m.code)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".375rem" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: ".9rem", fontWeight: isSelected ? 700 : 500, color: isSelected ? "var(--bleu)" : "var(--encre)", display: "flex", alignItems: "center", gap: ".5rem" }}>
                  {isSelected && <span style={{ width: 3, height: 14, background: "var(--rouge)", borderRadius: 2, flexShrink: 0, display: "inline-block" }} />}
                  {m.nom}
                </span>
                <span style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", color: "var(--encre)" }}>{fmt(m.budget)}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", minWidth: 46, textAlign: "right", color: m.evol >= 0 ? "#1E6B3C" : "var(--rouge)" }}>
                    {m.evol >= 0 ? "+" : ""}{m.evol}%
                  </span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", minWidth: 40, textAlign: "right" }}>
                    {fmtAgents(m.agents)}{" ag."}
                  </span>
                  <span style={{ fontSize: ".75rem", color: "var(--gris-3)", display: "inline-block", transform: isSelected ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}>{"▾"}</span>
                </span>
              </div>
              <div style={{ background: "var(--creme-fonce)", borderRadius: 3, height: isSelected ? 8 : 6, overflow: "hidden", transition: "height 150ms ease" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: "var(--bleu)", opacity: isSelected ? 1 : 0.65 }} />
              </div>
            </button>

            {/* ── Panneau détail ── */}
            {isSelected && (
              <div style={{ marginTop: ".875rem", background: "var(--bleu-pale)", border: "1px solid var(--bleu-clair)", borderLeft: "3px solid var(--bleu)", borderRadius: "0 var(--radius-md) var(--radius-md) 0", padding: "1.25rem 1.5rem", animation: "fadeUp .2s ease both" }}>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", marginBottom: "1rem", fontStyle: "italic" }}>{m.desc}</p>

                {loading && (
                  <div style={{ display: "flex", gap: ".625rem", alignItems: "center", color: "var(--gris-2)", fontFamily: "var(--sans)", fontSize: ".875rem" }}>
                    <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid var(--bleu-clair)", borderTopColor: "var(--bleu)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    {"Chargement…"}
                  </div>
                )}

                {error && (
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--rouge)", background: "var(--rouge-pale)", padding: ".75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
                    {error}
                  </div>
                )}

                {detail && !loading && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>

                    {/* Col 1 — Titres */}
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--gris-2)", marginBottom: ".875rem" }}>
                        {"Nature des dépenses"}
                      </div>
                      {detail.titres.length === 0 ? (
                        <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", fontStyle: "italic" }}>{"Aucune donnée"}</p>
                      ) : (() => {
                        const totalCp = detail.titres.reduce((s, t) => s + t.cp, 0);
                        return detail.titres.map((t) => (
                          <div key={t.titre} style={{ marginBottom: ".75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".25rem" }}>
                              <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)" }}>{t.label}</span>
                              <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-1)" }}>{fmt(t.cp)}</span>
                            </div>
                            <div style={{ background: "var(--bleu-clair)", borderRadius: 2, height: 10, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 2, width: `${totalCp > 0 ? (t.cp / totalCp) * 100 : 0}%`, background: TITRES_COULEURS[t.titre] ?? "var(--bleu)" }} />
                            </div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".125rem", textAlign: "right" }}>
                              {totalCp > 0 ? ((t.cp / totalCp) * 100).toFixed(1) + "%" : ""}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Col 2 — Programmes */}
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--gris-2)", marginBottom: ".875rem" }}>
                        {"Principaux programmes"}
                      </div>
                      {detail.programmes.length === 0 ? (
                        <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", fontStyle: "italic" }}>{"Aucune donnée"}</p>
                      ) : (() => {
                        const maxCp = Math.max(...detail.programmes.map((p) => p.cp));
                        return detail.programmes.map((p) => (
                          <div key={p.num} style={{ marginBottom: ".625rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: ".5rem", marginBottom: ".25rem", alignItems: "flex-start" }}>
                              <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--encre)", lineHeight: 1.35, flex: 1 }}>
                                <span style={{ fontFamily: "var(--mono)", color: "var(--gris-3)", marginRight: ".375rem" }}>{p.num}</span>
                                {p.label}
                              </span>
                              <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-1)", flexShrink: 0 }}>{fmt(p.cp)}</span>
                            </div>
                            <div style={{ background: "var(--bleu-clair)", borderRadius: 2, height: 6, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 2, width: `${maxCp > 0 ? (p.cp / maxCp) * 100 : 0}%`, background: "var(--bleu)" }} />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Col 3 — Historique CP */}
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--gris-2)", marginBottom: ".875rem" }}>
                        {"Évolution budget 2021–2025"}
                      </div>
                      {detail.historique.length === 0 ? (
                        <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", fontStyle: "italic" }}>{"Aucune donnée"}</p>
                      ) : (() => {
                        const maxH = Math.max(...detail.historique.map((h) => h.cp));
                        return detail.historique.map((h, i) => {
                          const prev = i > 0 ? detail.historique[i - 1].cp : null;
                          const evolPct = prev ? ((h.cp - prev) / prev) * 100 : null;
                          return (
                            <div key={h.annee} style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".5rem" }}>
                              <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-2)", width: 36, flexShrink: 0 }}>{h.annee}</span>
                              <div style={{ flex: 1, background: "var(--bleu-clair)", borderRadius: 2, height: 18, overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: 2, width: `${maxH > 0 ? (h.cp / maxH) * 100 : 100}%`, background: h.annee === "2025" ? "var(--rouge)" : "var(--bleu)", opacity: h.annee === "2025" ? 1 : 0.7 }} />
                              </div>
                              <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--encre)", width: 60, flexShrink: 0, textAlign: "right" }}>{fmt(h.cp)}</span>
                              {evolPct !== null && (
                                <span style={{ fontFamily: "var(--mono)", fontSize: ".7rem", color: evolPct >= 0 ? "#1E6B3C" : "var(--rouge)", width: 40, textAlign: "right" }}>
                                  {evolPct >= 0 ? "+" : ""}{evolPct.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          );
                        });
                      })()}
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".75rem", fontStyle: "italic" }}>
                        {"Source : PLF 2025, data.economie.gouv.fr"}
                      </div>
                    </div>
                  </div>
                )}

                {(detail || error) && (
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--bleu-clair)" }}>
                    <span style={{ fontSize: "1rem" }}>{"👥"}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)" }}>
                      {`${fmtAgents(m.agents)} agents en 2024 — ${m.evol >= 0 ? "+" : ""}${m.evol}% vs 2023`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="chart-source">{"Source : PLF 2025, data.economie.gouv.fr — Ministère des Finances"}</div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
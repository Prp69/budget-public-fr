"use client";
// src/components/MinistreresClient.tsx
import { useState, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ministere {
  nom:    string;
  code:   string;  // code LOLF (ex: "08")
  budget: number;
  agents: number;
  evol:   number;
  desc:   string;
}

interface TitreDonnee {
  titre: string;
  label: string;
  cp:    number;
  ae:    number;
}

interface Programme {
  num:   string;
  label: string;
  cp:    number;
}

interface PointHistorique {
  annee: string;
  cp:    number;
}

interface DetailMinistere {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titres:      TitreDonnee[];
  programmes:  Programme[];
  historique:  PointHistorique[];
}

interface CacheEntry {
  data:  DetailMinistere;
  ts:    number;
}

// ─── Données statiques ────────────────────────────────────────────────────────

const MINISTERES: Ministere[] = [
  { nom: "Éducation nationale & Jeunesse",    code: "08", budget: 84_600_000_000, agents: 985_000, evol: +2.1,  desc: "Premier employeur de France, incluant les universités." },
  { nom: "Défense",                            code: "02", budget: 47_200_000_000, agents: 270_000, evol: +7.5,  desc: "Loi de programmation militaire 2024-2030 en cours." },
  { nom: "Enseignement supérieur & Recherche", code: "38", budget: 31_400_000_000, agents: 170_000, evol: +3.8,  desc: "Universités, CNRS, CEA, INRAE." },
  { nom: "Intérieur",                          code: "40", budget: 22_500_000_000, agents: 280_000, evol: +3.2,  desc: "Police nationale, gendarmerie, sécurité civile." },
  { nom: "Travail & Emploi",                   code: "11", budget: 21_800_000_000, agents: 9_400,   evol: -1.4,  desc: "France Travail, aides à l'emploi." },
  { nom: "Économie, Finances & Souveraineté",  code: "44", budget: 19_400_000_000, agents: 130_000, evol: +0.8,  desc: "DGFiP, Douanes, INSEE." },
  { nom: "Justice",                            code: "76", budget: 10_900_000_000, agents: 91_000,  evol: +8.1,  desc: "Tribunaux, prisons, accès au droit." },
  { nom: "Santé & Prévention",                 code: "62", budget: 10_100_000_000, agents: 5_600,   evol: +4.3,  desc: "Hors Assurance maladie (LFSS)." },
  { nom: "Transitions écologiques",            code: "58", budget: 9_700_000_000,  agents: 42_000,  evol: +12.4, desc: "Transports, logement, biodiversité." },
  { nom: "Agriculture & Souveraineté alim.",   code: "15", budget: 4_300_000_000,  agents: 30_000,  evol: +1.1,  desc: "Aides aux agriculteurs, filières alimentaires." },
  { nom: "Culture",                            code: "07", budget: 4_100_000_000,  agents: 12_000,  evol: +2.5,  desc: "Monuments, musées, spectacle vivant." },
  { nom: "Action extérieure",                  code: "05", budget: 3_800_000_000,  agents: 14_000,  evol: +0.9,  desc: "Diplomatie, consulats, coopération." },
];

const TITRES_COULEURS: Record<string, string> = {
  "1": "#2B4C8C",  // Personnel — bleu
  "2": "#4A7EC7",  // Fonctionnement — bleu clair
  "3": "#2B8C6B",  // Investissement — vert
  "5": "var(--gris-3)",
  "6": "#C0392B",  // Intervention — rouge
  "7": "#B45309",  // Charges financières — orange
};

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " Md€";
  if (n >= 1e6) return (n / 1e6).toFixed(0) + " M€";
  return n.toLocaleString("fr-FR") + " €";
}

function fmtAgents(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(0) + " k" : String(n);
}

// ─── Cache en mémoire (session) ───────────────────────────────────────────────

const CACHE: Record<string, CacheEntry> = {};
const TTL = 5 * 60 * 1000; // 5 minutes

// ─── Composant principal ──────────────────────────────────────────────────────

export default function MinistreresClient() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [detail, setDetail]             = useState<DetailMinistere | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const maxBudget = Math.max(...MINISTERES.map((m) => m.budget));
  const totalBudget = MINISTERES.reduce((s, m) => s + m.budget, 0);

  const fetchDetail = useCallback(async (code: string) => {
    // Si déjà sélectionné → fermer
    if (selectedCode === code) {
      setSelectedCode(null);
      setDetail(null);
      return;
    }

    setSelectedCode(code);
    setDetail(null);
    setError(null);

    // Vérifier le cache
    const cached = CACHE[code];
    if (cached && Date.now() - cached.ts < TTL) {
      setDetail(cached.data);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/ministeres/${code}`);
      if (!res.ok) {
        const body = await res.text().catch(() => "(no body)");
        throw new Error(`HTTP ${res.status} — ${body.slice(0, 300)}`);
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
      {/* ── En-tête total ── */}
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="chart-title">{"Crédits par ministère — PLF 2025"}</div>
          <div className="chart-subtitle">{"Cliquez sur un ministère pour afficher le détail des dépenses en temps réel"}</div>
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "1.125rem", fontWeight: 700, color: "var(--bleu)" }}>
          {fmt(totalBudget)}
          <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 400, color: "var(--gris-3)", marginLeft: ".5rem" }}>{"hors dette"}</span>
        </div>
      </div>

      {/* ── Liste des ministères ── */}
      {MINISTERES.map((m) => {
        const pct        = (m.budget / maxBudget) * 100;
        const isSelected = selectedCode === m.code;
        const isOther    = selectedCode !== null && !isSelected;

        return (
          <div key={m.code} style={{
            marginBottom: ".625rem",
            opacity: isOther ? 0.45 : 1,
            transition: "opacity 200ms ease",
          }}>
            {/* ── Ligne cliquable ── */}
            <button
              onClick={() => fetchDetail(m.code)}
              style={{
                width: "100%", background: "none", border: "none",
                cursor: "pointer", padding: 0, textAlign: "left",
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "baseline", marginBottom: ".375rem",
              }}>
                <span style={{
                  fontFamily: "var(--sans)", fontSize: ".9rem",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? "var(--bleu)" : "var(--encre)",
                  display: "flex", alignItems: "center", gap: ".5rem",
                }}>
                  {isSelected && (
                    <span style={{ width: 3, height: 14, background: "var(--rouge)", borderRadius: 2, flexShrink: 0, display: "inline-block" }} />
                  )}
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
                  <span style={{ fontSize: ".75rem", color: "var(--gris-3)", transition: "transform 200ms ease", display: "inline-block", transform: isSelected ? "rotate(180deg)" : "none" }}>
                    {"▾"}
                  </span>
                </span>
              </div>

              {/* Barre de progression */}
              <div style={{
                background: "var(--creme-fonce)", borderRadius: 3,
                height: isSelected ? 8 : 6,
                overflow: "hidden",
                transition: "height 150ms ease",
              }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  width: `${pct}%`,
                  background: isSelected ? "var(--bleu)" : "var(--bleu)",
                  opacity: isSelected ? 1 : 0.65,
                  transition: "width .6s ease, opacity 200ms ease",
                }} />
              </div>
            </button>

            {/* ── Panneau de détail (tunnel) ── */}
            {isSelected && (
              <div style={{
                marginTop: ".875rem",
                background: "var(--bleu-pale)",
                border: "1px solid var(--bleu-clair)",
                borderLeft: "3px solid var(--bleu)",
                borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                padding: "1.25rem 1.5rem",
                animation: "fadeUp .2s ease both",
              }}>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", marginBottom: "1rem", fontStyle: "italic" }}>{m.desc}</p>

                {loading && (
                  <div style={{ display: "flex", gap: ".625rem", alignItems: "center", color: "var(--gris-2)", fontFamily: "var(--sans)", fontSize: ".875rem" }}>
                    <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid var(--bleu-clair)", borderTopColor: "var(--bleu)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    {"Chargement depuis data.economie.gouv.fr…"}
                  </div>
                )}

                {error && (
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--rouge)", background: "var(--rouge-pale)", padding: ".75rem 1rem", borderRadius: "var(--radius-sm)" }}>
                    {error}
                  </div>
                )}

                {detail && !loading && (detail.titres.length === 0 && detail.programmes.length === 0 && detail.historique.length === 0) && (
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-2)", padding: ".75rem", background: "var(--blanc)", borderRadius: "var(--radius-sm)" }}>
                    {"Données non disponibles pour ce ministère dans le PLF 2025."}
                    {detail._debug && (
                      <details style={{ marginTop: ".5rem" }}>
                        <summary style={{ cursor: "pointer", fontSize: ".75rem", color: "var(--gris-3)" }}>{"Debug colonnes"}</summary>
                        <pre style={{ fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".25rem", whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(detail._debug, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {detail && !loading && (detail.titres.length > 0 || detail.programmes.length > 0 || detail.historique.length > 0) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>

                    {/* ── Col 1 : Ventilation par titre ── */}
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
                              <div style={{
                                height: "100%", borderRadius: 2,
                                width: `${totalCp > 0 ? (t.cp / totalCp) * 100 : 0}%`,
                                background: TITRES_COULEURS[t.titre] ?? "var(--bleu)",
                              }} />
                            </div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".125rem", textAlign: "right" }}>
                              {totalCp > 0 ? ((t.cp / totalCp) * 100).toFixed(1) + "%" : ""}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* ── Col 2 : Programmes ── */}
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
                              <div style={{
                                height: "100%", borderRadius: 2,
                                width: `${maxCp > 0 ? (p.cp / maxCp) * 100 : 0}%`,
                                background: "var(--bleu)",
                              }} />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* ── Col 3 : Historique 5 ans ── */}
                    <div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--gris-2)", marginBottom: ".875rem" }}>
                        {"Évolution 2021–2025"}
                      </div>
                      {detail.historique.length === 0 ? (
                        <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", fontStyle: "italic" }}>{"Aucune donnée"}</p>
                      ) : (() => {
                        const maxH = Math.max(...detail.historique.map((h) => h.cp));
                        const minH = Math.min(...detail.historique.map((h) => h.cp));
                        return detail.historique.map((h, i) => {
                          const prev    = i > 0 ? detail.historique[i - 1].cp : null;
                          const evolPct = prev ? ((h.cp - prev) / prev) * 100 : null;
                          return (
                            <div key={h.annee} style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".5rem" }}>
                              <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-2)", width: 36, flexShrink: 0 }}>{h.annee}</span>
                              <div style={{ flex: 1, background: "var(--bleu-clair)", borderRadius: 2, height: 18, overflow: "hidden", position: "relative" }}>
                                <div style={{
                                  height: "100%", borderRadius: 2,
                                  width: `${maxH > minH ? ((h.cp - minH) / (maxH - minH)) * 60 + 40 : 100}%`,
                                  background: h.annee === "2025" ? "var(--rouge)" : "var(--bleu)",
                                  opacity: h.annee === "2025" ? 1 : 0.7,
                                }} />
                              </div>
                              <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-1)", width: 60, flexShrink: 0, textAlign: "right" }}>{fmt(h.cp)}</span>
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
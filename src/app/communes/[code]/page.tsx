// src/app/communes/[code]/page.tsx
// Server Component — données chargées côté serveur, 0 "use client"
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import CommuneCharts from "@/components/CommuneCharts";
import Comparateur from "@/components/Comparateur";
import {
  getFinancesCommune,
  getHistoriqueCommune,
  getMaireCommune,
  getIndemniteMaire,
  formaterMontant,
  type InfoMaire,
} from "@/lib/api";

// ─── Données statiques des maires précédents (grandes villes) ────────────────
// Source : Wikipedia / archives publiques — pas d'API disponible pour l'historique
const ANCIENS_MAIRES: Record<string, Array<{ nom: string; de: number; a: number; etiquette: string }>> = {
  "75056": [
    { nom: "Bertrand Delanoë",  de: 2001, a: 2014, etiquette: "PS"  },
    { nom: "Jean Tiberi",       de: 1995, a: 2001, etiquette: "RPR" },
    { nom: "Jacques Chirac",    de: 1977, a: 1995, etiquette: "RPR" },
    { nom: "Pierre-Christian Taittinger", de: 1975, a: 1977, etiquette: "UDR" },
    { nom: "André Roulleaux-Dugage", de: 1966, a: 1975, etiquette: "RI" },
  ],
  "69123": [
    { nom: "Gérard Collomb",    de: 2017, a: 2020, etiquette: "DVG" },
    { nom: "Gérard Collomb",    de: 2001, a: 2017, etiquette: "PS"  },
    { nom: "Raymond Barre",     de: 1995, a: 2001, etiquette: "RPR" },
    { nom: "Michel Noir",       de: 1989, a: 1995, etiquette: "RPR" },
    { nom: "Francisque Collomb",de: 1976, a: 1989, etiquette: "UDF" },
  ],
  "13055": [
    { nom: "Jean-Claude Gaudin",de: 1995, a: 2020, etiquette: "LR"  },
    { nom: "Robert Vigouroux",  de: 1986, a: 1995, etiquette: "DVG" },
    { nom: "Gaston Defferre",   de: 1953, a: 1986, etiquette: "PS"  },
    { nom: "Francis Leenhardt", de: 1945, a: 1953, etiquette: "SFIO"},
    { nom: "Henri Tasso",       de: 1944, a: 1944, etiquette: "SFIO"},
  ],
  "33063": [
    { nom: "Alain Juppé",       de: 2006, a: 2019, etiquette: "LR"  },
    { nom: "Hugues Martin",     de: 2004, a: 2006, etiquette: "UMP" },
    { nom: "Alain Juppé",       de: 1995, a: 2004, etiquette: "RPR" },
    { nom: "Jacques Chaban-Delmas", de: 1947, a: 1995, etiquette: "UDR"},
    { nom: "Fernand Audeguil",  de: 1944, a: 1947, etiquette: "DVG" },
  ],
  "44109": [
    { nom: "Jean-Marc Ayrault", de: 1989, a: 2012, etiquette: "PS"  },
    { nom: "Alain Chenard",     de: 1977, a: 1983, etiquette: "PS"  },
    { nom: "André Morice",      de: 1959, a: 1966, etiquette: "RGR" },
    { nom: "Henry Orrion",      de: 1953, a: 1959, etiquette: "MRP" },
    { nom: "Marcel Brunette",   de: 1947, a: 1953, etiquette: "MRP" },
  ],
};

const COULEURS_ETIQUETTE: Record<string, string> = {
  "PS": "#E75480", "NUPES": "#A50026", "NUP": "#A50026",
  "LR": "#003189", "RPR": "#003189", "UMP": "#003189",
  "RN": "#0D1B6E", "REN": "#FF8C00", "LREM": "#FF8C00",
  "HOR": "#E07B39", "PCF": "#CC0000", "EELV": "#2E7D32",
  "DVG": "#E75480", "DVD": "#6B93C4", "DVC": "#9C27B0",
  "SE":  "#607D8B", "UDI": "#00BCD4", "MDM": "#00ACC1",
  "DVE": "#388E3C",
};

function BadgeEtiquette({ etiquette }: { etiquette?: string }) {
  if (!etiquette) return null;
  const couleur = COULEURS_ETIQUETTE[etiquette] ?? "#607D8B";
  return (
    <span style={{
      display: "inline-block",
      background: couleur + "22",
      color: couleur,
      border: `1px solid ${couleur}44`,
      borderRadius: 6,
      padding: ".15rem .55rem",
      fontSize: ".75rem",
      fontWeight: 600,
      letterSpacing: ".02em",
    }}>
      {etiquette}
    </span>
  );
}

function dureeMandat(dateDebut: string): string {
  if (!dateDebut) return "";
  const debut = new Date(dateDebut);
  const maintenant = new Date();
  const annees = maintenant.getFullYear() - debut.getFullYear();
  const mois   = maintenant.getMonth()   - debut.getMonth();
  const total  = annees * 12 + mois;
  if (total < 1) return "Moins d'un mois";
  if (total < 12) return `${total} mois`;
  const a = Math.floor(total / 12);
  const m = total % 12;
  return m > 0 ? `${a} an${a > 1 ? "s" : ""} et ${m} mois` : `${a} an${a > 1 ? "s" : ""}`;
}

// ─── Metadata dynamique ───────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Finances commune ${code} — Budget Public`,
    description: `Budget, dépenses, recettes et dette de la commune ${code}. Source OFGL / DGFiP.`,
  };
}

// ─── Indicateur clé ───────────────────────────────────────────────────────────

function KPI({
  label, value, sub, couleur = "var(--bleu-moyen)", icone,
}: {
  label: string; value: string; sub?: string; couleur?: string; icone: string;
}) {
  return (
    <div style={{
      background: "var(--blanc)",
      border: "1px solid var(--bordure)",
      borderRadius: "var(--radius-lg)",
      padding: "1.25rem 1.5rem",
      boxShadow: "var(--ombre-xs)",
      borderTop: `3px solid ${couleur}`,
    }}>
      <div style={{ fontSize: "1.4rem", marginBottom: ".25rem" }}>{icone}</div>
      <div style={{ fontSize: "1.375rem", fontWeight: 700, color: couleur }}>{value}</div>
      <div style={{ fontSize: ".875rem", color: "var(--texte-primaire)", fontWeight: 600, marginTop: ".15rem" }}>{label}</div>
      {sub && <div style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginTop: ".2rem" }}>{sub}</div>}
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default async function PageCommune(
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const [finances, historique, maire] = await Promise.all([
    getFinancesCommune(code, 2023),
    getHistoriqueCommune(code),
    getMaireCommune(code),
  ]);

  const nomCommune = `Commune ${code}`;
  const anciensMaires = ANCIENS_MAIRES[code] ?? [];

  // ─── Page "données non disponibles" ─────────────────────────────────────────
  if (!finances) {
    return (
      <>
        <Header />
        <main>
          <section style={{
            background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
            padding: "3.5rem 0 3rem",
          }}>
            <div className="container">
              <Link href="/communes" style={{ color: "rgba(255,255,255,.7)", fontSize: ".875rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: ".35rem", marginBottom: "1rem" }}>
                <span>{"←"}</span>{"Retour aux communes"}
              </Link>
              <h1 style={{ color: "white", fontSize: "clamp(1.5rem,4vw,2.25rem)", fontWeight: 800 }}>
                {`Commune ${code}`}
              </h1>
            </div>
          </section>
          <section style={{ padding: "4rem 0", textAlign: "center" }}>
            <div className="container">
              <p style={{ fontSize: "1.125rem", color: "var(--texte-secondaire)" }}>
                {"Données financières non disponibles pour cette commune."}
              </p>
              <Link href="/communes" style={{
                display: "inline-block", marginTop: "1.5rem",
                background: "var(--bleu-marine)", color: "white",
                padding: ".75rem 1.75rem", borderRadius: "var(--radius-md)",
                textDecoration: "none", fontWeight: 600,
              }}>{"Rechercher une autre commune"}</Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const indemniteMaire = finances.population ? getIndemniteMaire(finances.population) : null;
  const balance = finances.recettes_fonctionnement - finances.depenses_fonctionnement;
  const balancePositive = balance >= 0;

  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
          padding: "3.5rem 0 3rem",
        }}>
          <div className="container">
            <Link href="/communes" style={{
              color: "rgba(255,255,255,.7)", fontSize: ".875rem",
              textDecoration: "none", display: "inline-flex",
              alignItems: "center", gap: ".35rem", marginBottom: "1rem",
            }}>
              <span>{"←"}</span>{"Retour aux communes"}
            </Link>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ color: "white", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 800, marginBottom: ".35rem" }}>
                  {nomCommune}
                </h1>
                <p style={{ color: "rgba(255,255,255,.65)", fontSize: ".9375rem" }}>
                  {`Code INSEE : ${code}`}
                  {finances.population ? ` · ${finances.population.toLocaleString("fr-FR")} habitants` : ""}
                  {` · Données ${finances.annee}`}
                </p>
              </div>
              <div style={{
                background: "rgba(255,255,255,.12)", borderRadius: 12,
                padding: ".5rem 1rem", backdropFilter: "blur(4px)",
              }}>
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: ".75rem" }}>{"Balance fonctionnement"}</span>
                <div style={{
                  color: balancePositive ? "#4ade80" : "#f87171",
                  fontWeight: 700, fontSize: "1.125rem",
                }}>
                  {balancePositive ? "+" : ""}{formaterMontant(balance)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI DÉPENSES */}
        <section style={{ padding: "2.5rem 0 0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--texte-primaire)" }}>
              {"Dépenses"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              <KPI
                icone="📤"
                label="Dépenses de fonctionnement"
                value={formaterMontant(finances.depenses_fonctionnement)}
                sub={finances.depenses_par_habitant ? `${finances.depenses_par_habitant.toLocaleString("fr-FR")} €/hab.` : undefined}
                couleur="#C1292E"
              />
              <KPI
                icone="🏗️"
                label="Dépenses d'investissement"
                value={formaterMontant(finances.depenses_investissement)}
                couleur="#1E4E8C"
              />
              <KPI
                icone="🏦"
                label="Encours de dette"
                value={formaterMontant(finances.encours_dette)}
                sub={finances.dette_par_habitant ? `${finances.dette_par_habitant.toLocaleString("fr-FR")} €/hab.` : undefined}
                couleur="#9C1B22"
              />
              <KPI
                icone="💰"
                label="Épargne brute"
                value={formaterMontant(finances.epargne_brute)}
                couleur="#059669"
              />
            </div>
          </div>
        </section>

        {/* KPI RECETTES */}
        <section style={{ padding: "1.5rem 0 0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--texte-primaire)" }}>
              {"Recettes"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              <KPI
                icone="📥"
                label="Recettes de fonctionnement"
                value={formaterMontant(finances.recettes_fonctionnement)}
                sub={finances.recettes_par_habitant ? `${finances.recettes_par_habitant.toLocaleString("fr-FR")} €/hab.` : undefined}
                couleur="#059669"
              />
              <KPI
                icone="📊"
                label="Recettes d'investissement"
                value={formaterMontant(finances.recettes_investissement)}
                couleur="#0891B2"
              />
              {finances.impots_taxes > 0 && (
                <KPI
                  icone="🏛️"
                  label="Impôts et taxes locaux"
                  value={formaterMontant(finances.impots_taxes)}
                  couleur="#F59E0B"
                />
              )}
              {finances.dotation_etat > 0 && (
                <KPI
                  icone="🇫🇷"
                  label="Dotation de l'État (DGF)"
                  value={formaterMontant(finances.dotation_etat)}
                  couleur="#8B5CF6"
                />
              )}
            </div>
          </div>
        </section>

        {/* GRAPHIQUES */}
        <section style={{ padding: "2.5rem 0" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>{"Évolution budgétaire"}</h2>
            <CommuneCharts historique={historique} nomCommune={nomCommune} finances={finances} />
          </div>
        </section>

        {/* SECTION MAIRE */}
        <section style={{ padding: "0 0 2.5rem" }}>
          <div className="container">
            <div style={{
              background: "var(--blanc)",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem 2rem",
              boxShadow: "var(--ombre-xs)",
            }}>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>{"Exécutif municipal"}</h2>

              {/* Maire actuel */}
              {maire ? (
                <div style={{
                  display: "flex", alignItems: "flex-start",
                  gap: "1.25rem", marginBottom: "1.75rem",
                  paddingBottom: "1.75rem",
                  borderBottom: anciensMaires.length > 0 ? "1px solid var(--bordure)" : "none",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--bleu-marine), var(--bleu-moyen))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: "1.375rem", flexShrink: 0,
                  }}>
                    {"👤"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                        {maire.prenom + " " + maire.nom}
                      </span>
                      <span style={{
                        background: "var(--bleu-pale)", color: "var(--bleu-moyen)",
                        border: "1px solid var(--bordure)", borderRadius: 6,
                        padding: ".15rem .55rem", fontSize: ".75rem", fontWeight: 600,
                      }}>
                        {"Maire actuel"}
                      </span>
                      {maire.etiquette && <BadgeEtiquette etiquette={maire.etiquette} />}
                    </div>
                    {maire.dateDebut && (
                      <div style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", marginTop: ".4rem" }}>
                        {"En fonction depuis le " + new Date(maire.dateDebut).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        {" — " + dureeMandat(maire.dateDebut)}
                      </div>
                    )}
                    {indemniteMaire && (
                      <div style={{ marginTop: ".6rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
                        <span style={{ fontSize: ".8125rem", color: "var(--texte-tertiaire)" }}>
                          {"Indemnité de fonction légale :"}
                        </span>
                        <span style={{
                          fontSize: ".8125rem", fontWeight: 600,
                          color: "var(--texte-secondaire)",
                          background: "var(--surface)", borderRadius: 6,
                          padding: ".1rem .45rem", border: "1px solid var(--bordure)",
                        }}>
                          {indemniteMaire}
                        </span>
                        <span style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)" }}>
                          {"(barème légal art. L2123-23 CGCT)"}
                        </span>
                      </div>
                    )}
                    <div style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginTop: ".5rem" }}>
                      {"Source : " + maire.source}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: "1rem 1.25rem",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1.5rem",
                  fontSize: ".875rem", color: "var(--texte-secondaire)",
                }}>
                  {"Données du maire non disponibles dans le RNE pour cette commune."}
                </div>
              )}

              {/* Maires précédents */}
              {anciensMaires.length > 0 && (
                <div>
                  <h3 style={{ fontSize: ".9375rem", fontWeight: 600, marginBottom: "1rem", color: "var(--texte-secondaire)" }}>
                    {"Maires précédents"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
                    {anciensMaires.map((m, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        padding: ".75rem 1rem",
                        background: "var(--surface)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--bordure)",
                        flexWrap: "wrap", gap: ".5rem",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                          <span style={{ fontWeight: 600, fontSize: ".9375rem" }}>{m.nom}</span>
                          <BadgeEtiquette etiquette={m.etiquette} />
                        </div>
                        <span style={{ fontSize: ".8125rem", color: "var(--texte-tertiaire)" }}>
                          {m.de + " – " + m.a}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginTop: ".75rem" }}>
                    {"Source : archives publiques / Wikipedia"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DÉTAIL DÉPENSES */}
        {(finances.frais_personnel > 0 || finances.achats_charges > 0) && (
          <section style={{ padding: "0 0 2.5rem" }}>
            <div className="container">
              <div style={{
                background: "var(--blanc)",
                border: "1px solid var(--bordure)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem 2rem",
                boxShadow: "var(--ombre-xs)",
              }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>{"Détail des dépenses de fonctionnement"}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                  {[
                    { label: "Frais de personnel",         value: finances.frais_personnel,       pct: finances.frais_personnel / finances.depenses_fonctionnement,       couleur: "#1E4E8C" },
                    { label: "Achats et charges externes",  value: finances.achats_charges,        pct: finances.achats_charges / finances.depenses_fonctionnement,        couleur: "#0891B2" },
                    { label: "Dépenses d'intervention",    value: finances.depenses_intervention, pct: finances.depenses_intervention / finances.depenses_fonctionnement, couleur: "#F59E0B" },
                  ].filter(r => r.value > 0).map((row, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem" }}>
                        <span style={{ fontSize: ".875rem", fontWeight: 500 }}>{row.label}</span>
                        <span style={{ fontSize: ".875rem", fontWeight: 600 }}>
                          {formaterMontant(row.value)}
                          <span style={{ color: "var(--texte-tertiaire)", fontWeight: 400, marginLeft: ".4rem" }}>
                            {"(" + (row.pct * 100).toFixed(1) + "%)"}
                          </span>
                        </span>
                      </div>
                      <div style={{ height: 6, background: "var(--bordure)", borderRadius: 4 }}>
                        <div style={{
                          width: `${Math.min(100, row.pct * 100)}%`,
                          height: "100%", borderRadius: 4,
                          background: row.couleur,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* COMPARATEUR */}
        <section style={{ padding: "0 0 3.5rem" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem" }}>{"Comparer avec d'autres communes"}</h2>
            <Comparateur />
          </div>
        </section>

      </main>

      <footer style={{
        background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)",
        padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem",
      }}>
        <div className="container">
          {"© 2026 Budget Public — Source OFGL / DGFiP — Licence Ouverte v2.0"}
        </div>
      </footer>
    </>
  );
}
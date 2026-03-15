"use client";
// src/components/Hemicycle.tsx
// Hémicycle SVG interactif — disposition gauche→droite par spectre politique
// Données nominatives chargées depuis les APIs officielles AN et Sénat via route proxy
// Chaque point = 1 siège, tooltip au survol avec nom + groupe

import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// DONNÉES STATIQUES — groupes avec noms (fallback si API indisponible)
// Sources : assemblee-nationale.fr, senat.fr — oct. 2025
// Ordre : gauche extrême → gauche → centre-gauche → centre → centre-droite → droite → extrême droite
// ═══════════════════════════════════════════════════════════════════

const GROUPES_AN: GroupeDef[] = [
  // Gauche → droite (spectre politique)
  { nom: "Gauche Démocrate et Républicaine",          sigle: "GDR",  sieges: 22,  couleur: "#A50000", spectre: 0  },
  { nom: "La France insoumise – NFP",                 sigle: "LFI",  sieges: 72,  couleur: "#CC2929", spectre: 1  },
  { nom: "Écologiste et Social",                      sigle: "EcoS", sieges: 23,  couleur: "#2E8B57", spectre: 2  },
  { nom: "Socialistes et apparentés",                 sigle: "SOC",  sieges: 64,  couleur: "#FF8C00", spectre: 3  },
  { nom: "Libertés, Indépendants, Outre-mer, Territ.",sigle: "LIOT", sieges: 22,  couleur: "#8B4513", spectre: 4  },
  { nom: "Ensemble pour la République",               sigle: "EPR",  sieges: 97,  couleur: "#FFBE00", spectre: 5  },
  { nom: "Les Démocrates",                            sigle: "DEM",  sieges: 36,  couleur: "#F7A80D", spectre: 6  },
  { nom: "Horizons & indépendants",                   sigle: "HOR",  sieges: 31,  couleur: "#1E9DE3", spectre: 7  },
  { nom: "Droite Républicaine",                       sigle: "DR",   sieges: 55,  couleur: "#0055A5", spectre: 8  },
  { nom: "Union des droites pour la République",      sigle: "UDR",  sieges: 17,  couleur: "#002366", spectre: 9  },
  { nom: "Rassemblement National",                    sigle: "RN",   sieges: 124, couleur: "#001E96", spectre: 10 },
  { nom: "Non-inscrits",                              sigle: "NI",   sieges: 14,  couleur: "#BBBBBB", spectre: 11 },
];

// Sénat — données france-politique.fr oct. 2025 (348 sièges)
const GROUPES_SENAT: GroupeDef[] = [
  { nom: "Communiste Républicain Citoyen et Écologiste", sigle: "CRCEK", sieges: 18,  couleur: "#A50000", spectre: 0  },
  { nom: "Écologiste – Solidarité et Territoires",       sigle: "EST",   sieges: 16,  couleur: "#2E8B57", spectre: 1  },
  { nom: "Socialiste, Écologiste et Républicain",        sigle: "SER",   sieges: 65,  couleur: "#FF8C00", spectre: 2  },
  { nom: "Rassemblement Démocratique et Social Europ.",  sigle: "RDSE",  sieges: 17,  couleur: "#CC8800", spectre: 3  },
  { nom: "Rassemblement Démo., Progressistes & Indép.", sigle: "RDPI",  sieges: 19,  couleur: "#FFBE00", spectre: 4  },
  { nom: "Les Indépendants – République et Territoires", sigle: "LIRT",  sieges: 20,  couleur: "#1E9DE3", spectre: 5  },
  { nom: "Union Centriste",                             sigle: "UC",    sieges: 59,  couleur: "#F7A80D", spectre: 6  },
  { nom: "Les Républicains",                            sigle: "LR",    sieges: 130, couleur: "#0055A5", spectre: 7  },
  { nom: "Non-inscrits (dont RN)",                     sigle: "NI",    sieges: 4,   couleur: "#001E96", spectre: 8  },
];

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface GroupeDef {
  nom: string; sigle: string; sieges: number; couleur: string; spectre: number;
}

interface Siege {
  nom: string;
  groupe: string;
  sigle: string;
  couleur: string;
  departement?: string;
}

// ═══════════════════════════════════════════════════════════════════
// ALGORITHME HÉMICYCLE
// Disposition en arcs concentriques, gauche→droite, rangées intérieur→extérieur
// Inspiré du placement réel dans l'hémicycle de la République
// ═══════════════════════════════════════════════════════════════════

function genererSieges(groupes: GroupeDef[], total: number): { x: number; y: number; siege: Siege }[] {
  const CX = 500, CY = 430;
  const N_RANGEES = 8;
  const R_INT = 160, R_EXT = 385;
  const MARGE = 5 * Math.PI / 180; // 5° de marge de chaque côté

  // Rayons des 8 rangées concentriques
  const rayons = Array.from({ length: N_RANGEES }, (_, i) =>
    R_INT + (i / (N_RANGEES - 1)) * (R_EXT - R_INT)
  );

  // Nombre de sièges par rangée proportionnel à la circonférence (rayon × π)
  const totalArc = rayons.reduce((s, r) => s + r, 0);
  const parRangee = rayons.map(r => Math.round((r / totalArc) * total));

  // Ajustement pour que le total soit exact
  let diff = total - parRangee.reduce((s, n) => s + n, 0);
  for (let i = N_RANGEES - 1; diff !== 0; i = (i - 1 + N_RANGEES) % N_RANGEES) {
    parRangee[i] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }

  // ─── Clé de l'algorithme : remplissage colonne par colonne (gauche→droite) ───
  // On calcule un "index angulaire normalisé" [0,1] pour chaque siège dans sa rangée,
  // puis on trie TOUS les sièges par cet index pour obtenir l'ordre gauche→droite global.

  interface PosTemp { angle: number; rangee: number; indexDansRangee: number; }
  const positionsTemp: PosTemp[] = [];

  for (let r = 0; r < N_RANGEES; r++) {
    const n = parRangee[r];
    for (let s = 0; s < n; s++) {
      // angle va de π-MARGE (gauche) à MARGE (droite)
      const angle = (Math.PI - MARGE) - (Math.PI - 2 * MARGE) * (s / (n > 1 ? n - 1 : 1));
      positionsTemp.push({ angle, rangee: r, indexDansRangee: s });
    }
  }

  // Trier par angle décroissant = gauche (angle élevé) → droite (angle faible)
  // À angle égal (même colonne), trier par rangée croissante = intérieur → extérieur
  positionsTemp.sort((a, b) => {
    const da = Math.abs(b.angle - a.angle);
    if (da > 0.001) return b.angle - a.angle; // gauche d'abord
    return a.rangee - b.rangee; // intérieur d'abord
  });

  // Créer la liste ordonnée des sièges (gauche→droite selon spectre)
  const siegesOrdres: Siege[] = [];
  const groupesTries = [...groupes].sort((a, b) => a.spectre - b.spectre);
  for (const g of groupesTries) {
    for (let i = 0; i < g.sieges; i++) {
      siegesOrdres.push({
        nom: `${g.nom} — siège ${i + 1}`,
        groupe: g.nom, sigle: g.sigle, couleur: g.couleur,
      });
    }
  }

  // Associer chaque position triée à un siège
  return positionsTemp.map((p, i) => {
    const R = rayons[p.rangee];
    return {
      x: CX + R * Math.cos(p.angle),
      y: CY - R * Math.sin(p.angle),
      siege: siegesOrdres[i] ?? { nom: "?", groupe: "NI", sigle: "NI", couleur: "#CCC" },
    };
  });
}

// ═══════════════════════════════════════════════════════════════════
// CHARGEMENT DONNÉES NOMINATIVES
// ═══════════════════════════════════════════════════════════════════

// Mapping sigle interne → nom groupe officiel AN
const MAP_GROUPE_AN: Record<string, string> = {
  "GDR":  "Gauche Démocrate et Républicaine",
  "LFI":  "La France insoumise – NFP",
  "EcoS": "Écologiste et Social",
  "SOC":  "Socialistes et apparentés",
  "LIOT": "Libertés, Indépendants, Outre-mer, Territ.",
  "EPR":  "Ensemble pour la République",
  "DEM":  "Les Démocrates",
  "HOR":  "Horizons & indépendants",
  "DR":   "Droite Républicaine",
  "UDR":  "Union des droites pour la République",
  "RN":   "Rassemblement National",
  "NI":   "Non-inscrits",
};

function normaliserGroupeAN(slug: string): string {
  const s = slug.toLowerCase().replace(/_/g, " ");
  if (s.includes("rassemblement national") || s.includes("rn"))     return "RN";
  if (s.includes("france insoumise") || s.includes("lfi"))          return "LFI";
  if (s.includes("ecologiste") || s.includes("eco"))                return "EcoS";
  if (s.includes("socialiste"))                                      return "SOC";
  if (s.includes("liot") || s.includes("libert"))                   return "LIOT";
  if (s.includes("ensemble") || s.includes("epr"))                  return "EPR";
  if (s.includes("democrate") || s.includes("dem "))                return "DEM";
  if (s.includes("horizons") || s.includes("hor"))                  return "HOR";
  if (s.includes("droite republicaine") || s.includes(" dr"))       return "DR";
  if (s.includes("union des droites") || s.includes("udr"))         return "UDR";
  if (s.includes("gauche democrat") || s.includes("gdr"))           return "GDR";
  return "NI";
}

// Chargement via route API Next.js (proxy serveur → API officielle AN / Sénat)
// Évite les problèmes CORS et garantit des données officielles
async function chargerParlementaires(chambre: "AN" | "SENAT", groupes: GroupeDef[]): Promise<Siege[]> {
  const res = await fetch(
    `/api/parlementaires/${chambre}`,
    { signal: AbortSignal.timeout(15000) }
  );
  if (!res.ok) throw new Error(`API interne ${res.status}`);
  const json = await res.json();

  if (json.error && json.parlementaires.length === 0) {
    throw new Error(json.error);
  }

  const data: { nom: string; sigle: string; departement: string }[] = json.parlementaires ?? [];

  return data.map((p) => {
    // Chercher d'abord exact, puis insensible à la casse
    const groupe =
      groupes.find(g => g.sigle === p.sigle) ??
      groupes.find(g => g.sigle.toUpperCase() === p.sigle.toUpperCase()) ??
      groupes.find(g => g.sigle === "NI") ??
      groupes[groupes.length - 1];
    return {
      nom:         p.nom,
      groupe:      groupe.nom,
      sigle:       groupe.sigle,
      couleur:     groupe.couleur,
      departement: p.departement,
    };
  });
}

function normaliserGroupeSenat(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("crce") || s.includes("communiste"))   return "CRCEK";
  if (s.includes("est") || s.includes("ecolog"))        return "EST";
  if (s.includes("ser") || s.includes("socialiste"))    return "SER";
  if (s.includes("rdse") || s.includes("radical"))      return "RDSE";
  if (s.includes("rdpi") || s.includes("progress"))     return "RDPI";
  if (s.includes("lirt") || s.includes("independant"))  return "LIRT";
  if (s.includes("uc") || s.includes("centriste"))      return "UC";
  if (s.includes("lr") || s.includes("republicain"))    return "LR";
  return "NI";
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT
// ═══════════════════════════════════════════════════════════════════

interface Props { chambre: "AN" | "SENAT"; titre: string; }

export default function Hemicycle({ chambre, titre }: Props) {
  const groupes     = chambre === "AN" ? GROUPES_AN : GROUPES_SENAT;
  const totalSieges = groupes.reduce((s, g) => s + g.sieges, 0);

  const [sieges,    setSieges]    = useState<Siege[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filtre,    setFiltre]    = useState<string | null>(null);
  const [recherche, setRecherche] = useState<string>("");
  const [tooltip,   setTooltip]   = useState<{ visible: boolean; x: number; y: number; siege: Siege | null }>
    ({ visible: false, x: 0, y: 0, siege: null });

  const svgRef = useRef<SVGSVGElement>(null);

  // Charger les noms réels
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await chargerParlementaires(chambre, groupes);

        if (data.length >= totalSieges * 0.8) {
          // Trier selon le spectre politique des groupes
          data.sort((a, b) => {
            const ga = groupes.find(g => g.sigle === a.sigle)?.spectre ?? 99;
            const gb = groupes.find(g => g.sigle === b.sigle)?.spectre ?? 99;
            return ga - gb;
          });
          setSieges(data.slice(0, totalSieges));
        } else {
          throw new Error("Données insuffisantes");
        }
      } catch {
        // Fallback : générer depuis les groupes
        const fb: Siege[] = [];
        for (const g of groupes) {
          for (let i = 0; i < g.sieges; i++) {
            fb.push({ nom: `${g.nom} — siège ${i + 1}`, groupe: g.nom, sigle: g.sigle, couleur: g.couleur });
          }
        }
        setSieges(fb);
      } finally {
        setLoading(false);
      }
    })();
  }, [chambre]);

  // Recalculer les positions quand sieges change
  const positions = genererSieges(groupes, totalSieges);

  // Fusionner positions + noms réels
  const points = positions.map((pos, i) => ({
    ...pos,
    siege: sieges[i] ?? pos.siege,
  }));

  const RAYON = totalSieges > 400 ? 6.2 : 7.8;

  const handleEnter = useCallback((e: React.MouseEvent<SVGCircleElement>, siege: Siege) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top, siege });
  }, []);

  const handleLeave = useCallback(() => setTooltip(t => ({ ...t, visible: false })), []);

  const majoritéAbsolue = Math.floor(totalSieges / 2) + 1;

  return (
    <div>
      <div className="chart-title">{titre}</div>
      <div className="chart-subtitle">
        {`${totalSieges} sièges — majorité absolue : ${majoritéAbsolue} — survolez pour voir le nom`}
        {loading && (
          <span style={{ marginLeft: ".75rem", color: "var(--bleu)", fontStyle: "italic" }}>
            {"⟳ Chargement des noms…"}
          </span>
        )}
      </div>

      {/* Boutons filtre */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setFiltre(null)}
          style={{ fontFamily: "var(--sans)", fontSize: ".75rem", padding: ".25rem .625rem", borderRadius: 3,
            border: "1px solid var(--bordure)", cursor: "pointer",
            background: filtre === null ? "var(--encre)" : "var(--blanc)",
            color: filtre === null ? "white" : "var(--encre)" }}
        >{"Tous"}</button>
        {groupes.map(g => (
          <button key={g.sigle} onClick={() => setFiltre(filtre === g.sigle ? null : g.sigle)}
            style={{ fontFamily: "var(--sans)", fontSize: ".75rem", padding: ".25rem .625rem", borderRadius: 3,
              border: `1.5px solid ${g.couleur}`, cursor: "pointer",
              background: filtre === g.sigle ? g.couleur : "transparent",
              color: filtre === g.sigle ? "white" : "var(--encre)",
              display: "flex", alignItems: "center", gap: ".3rem" }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: g.couleur, display: "inline-block", flexShrink: 0 }} />
            {g.sigle} <span style={{ fontWeight: 600 }}>{g.sieges}</span>
          </button>
        ))}
      </div>

      {/* SVG */}
      <div style={{ position: "relative", width: "100%", maxWidth: 720, margin: "0 auto" }}>
        <svg ref={svgRef} viewBox="0 0 1000 460" style={{ width: "100%", height: "auto" }}>
          {points.map((p, i) => {
            const rechercheActif = recherche.length >= 2
              ? p.siege.nom.toLowerCase().includes(recherche.toLowerCase())
              : true;
            const filtreActif = filtre === null || p.siege.sigle === filtre;
            const actif = rechercheActif && filtreActif;
            const estTrouve = recherche.length >= 2 && rechercheActif;
            return (
              <circle key={i}
                cx={p.x} cy={p.y}
                r={estTrouve ? RAYON * 1.5 : RAYON}
                fill={p.siege.couleur}
                opacity={actif ? 0.92 : 0.08}
                stroke={estTrouve ? "white" : actif ? "rgba(255,255,255,0.3)" : "none"}
                strokeWidth={estTrouve ? 2 : 0.8}
                style={{ cursor: "pointer", transition: "all .15s ease" }}
                onMouseEnter={e => handleEnter(e, p.siege)}
                onMouseLeave={handleLeave}
              />
            );
          })}

          {/* Ligne de base */}
          <line x1={70} y1={430} x2={930} y2={430} stroke="var(--bordure)" strokeWidth={1.5} />

          {/* Indicateur majorité absolue */}
          <text x={500} y={452} textAnchor="middle"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fill: "var(--gris-3)" }}>
            {`Majorité absolue : ${majoritéAbsolue} sièges`}
          </text>

          {/* Labels gauche / droite */}
          <text x={90} y={415} style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, fill: "var(--gris-3)" }}>{"Gauche"}</text>
          <text x={910} y={415} textAnchor="end" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, fill: "var(--gris-3)" }}>{"Droite"}</text>
        </svg>

        {/* Tooltip */}
        {tooltip.visible && tooltip.siege !== null && (() => {
          const tt = tooltip as { visible: boolean; x: number; y: number; siege: Siege };
          const left = Math.min(tt.x + 14, 560);
          const top  = Math.max(tt.y - 70, 0);
          return (
            <div style={{
              position: "absolute", left, top,
              background: "var(--encre)", color: "white",
              padding: ".5rem .875rem", borderRadius: "var(--radius-sm)",
              fontFamily: "var(--sans)", fontSize: ".8125rem", lineHeight: 1.55,
              pointerEvents: "none", zIndex: 10,
              whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,.3)",
              border: `2px solid ${tt.siege.couleur}`,
            }}>
              <div style={{ fontWeight: 700, fontSize: ".875rem" }}>{tt.siege.nom}</div>
              <div style={{ display: "flex", alignItems: "center", gap: ".4rem", marginTop: ".2rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: tt.siege.couleur, display: "inline-block" }} />
                <span style={{ color: "rgba(255,255,255,.75)", fontSize: ".75rem" }}>{tt.siege.groupe}</span>
              </div>
              {tt.siege.departement && (
                <div style={{ color: "rgba(255,255,255,.5)", fontSize: ".7rem", marginTop: ".1rem" }}>
                  {"📍 "}{tt.siege.departement}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Légende en 2 colonnes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".35rem .875rem", marginTop: "1rem" }}>
        {groupes.map(g => (
          <div key={g.sigle} style={{ display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer" }}
            onClick={() => setFiltre(filtre === g.sigle ? null : g.sigle)}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: g.couleur, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", flex: 1 }}>
              <strong>{g.sigle}</strong>{" — "}{g.nom}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-3)", flexShrink: 0 }}>{g.sieges}</span>
          </div>
        ))}
      </div>

      {/* ── Barre de recherche ── */}
      <div style={{ marginTop: "1.25rem" }}>
        <div style={{ position: "relative", maxWidth: 420 }}>
          <input
            type="text"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            placeholder={chambre === "AN" ? "Rechercher un député par nom…" : "Rechercher un sénateur par nom…"}
            style={{
              width: "100%", boxSizing: "border-box",
              fontFamily: "var(--sans)", fontSize: ".875rem",
              padding: ".625rem 2.5rem .625rem .875rem",
              border: "1.5px solid var(--bordure)",
              borderRadius: "var(--radius-sm)",
              background: "var(--blanc)", color: "var(--encre)",
              outline: "none",
              transition: "border-color 150ms ease",
            }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "var(--bleu)"; }}
            onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = "var(--bordure)"; }}
          />
          {recherche ? (
            <button onClick={() => setRecherche("")} style={{
              position: "absolute", right: ".5rem", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)",
              padding: ".25rem",
            }}>{"✕"}</button>
          ) : (
            <span style={{ position: "absolute", right: ".625rem", top: "50%", transform: "translateY(-50%)", color: "var(--gris-4)", fontSize: ".875rem", pointerEvents: "none" }}>{"🔍"}</span>
          )}
        </div>

        {/* Résultats de recherche */}
        {recherche.length >= 2 && (() => {
          const resultats = points
            .map((p, i) => ({ ...p.siege, idx: i }))
            .filter(s => s.nom.toLowerCase().includes(recherche.toLowerCase()));
          return (
            <div style={{ marginTop: ".5rem" }}>
              {resultats.length === 0 ? (
                <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)", fontStyle: "italic" }}>
                  {"Aucun résultat pour « "}{recherche}{" »"}
                </span>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: ".25rem", maxHeight: 200, overflowY: "auto" }}>
                  {resultats.slice(0, 20).map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.couleur, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", fontWeight: 600 }}>{s.nom}</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)" }}>{s.groupe}</span>
                      {s.departement && <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-4)" }}>{"— "}{s.departement}</span>}
                    </div>
                  ))}
                  {resultats.length > 20 && (
                    <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", fontStyle: "italic" }}>
                      {`+ ${resultats.length - 20} autres résultats — affinez la recherche`}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="chart-source" style={{ marginTop: "1rem" }}>
        {chambre === "AN"
          ? "Source : data.assemblee-nationale.fr — liste officielle XVIIe législature"
          : "Source : data.senat.fr — ODSEN_GENERAL, sénateurs en exercice"}
      </div>
    </div>
  );
}
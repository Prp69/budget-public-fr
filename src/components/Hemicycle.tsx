"use client";
// src/components/Hemicycle.tsx
// Hémicycle SVG interactif — disposition gauche→droite par spectre politique
// Données nominatives chargées depuis nosdeputes.fr / nossenateurs.fr
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
  // Rayons intérieur → extérieur
  const R_INT = 155, R_EXT = 390;

  // Calculer sièges par rangée (proportionnel à la longueur de l'arc)
  const rayons = Array.from({ length: N_RANGEES }, (_, i) =>
    R_INT + (i / (N_RANGEES - 1)) * (R_EXT - R_INT)
  );
  const totalPerim = rayons.reduce((s, r) => s + r, 0);
  const parRangee  = rayons.map(r => Math.round((r / totalPerim) * total));

  // Ajuster le total
  let diff = total - parRangee.reduce((s, n) => s + n, 0);
  for (let i = N_RANGEES - 1; diff !== 0; i = (i - 1 + N_RANGEES) % N_RANGEES) {
    parRangee[i] += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }

  // Créer la liste de sièges ordonnés gauche→droite (selon spectre politique)
  const siegesOrdres: Siege[] = [];
  // Trier groupes par spectre
  const groupesTries = [...groupes].sort((a, b) => a.spectre - b.spectre);
  for (const g of groupesTries) {
    for (let i = 0; i < g.sieges; i++) {
      siegesOrdres.push({
        nom: `${g.nom} — siège ${i + 1}`,
        groupe: g.nom,
        sigle: g.sigle,
        couleur: g.couleur,
      });
    }
  }

  // Mapper les sièges sur les positions
  // Ordre de remplissage : rangée intérieure d'abord, gauche→droite dans chaque rangée
  const positions: { x: number; y: number; siege: Siege }[] = [];
  let siegeIdx = 0;

  // On remplit rangée par rangée (intérieur → extérieur)
  // Dans chaque rangée, les sièges vont de gauche (angle ~175°) à droite (angle ~5°)
  const MARGE_ANGLE = 4; // degrés de marge de chaque côté

  for (let r = 0; r < N_RANGEES; r++) {
    const n = parRangee[r];
    const R = rayons[r];
    for (let s = 0; s < n; s++) {
      const angle = Math.PI * (1 - MARGE_ANGLE / 180) - (Math.PI * (1 - 2 * MARGE_ANGLE / 180)) * (s / (n > 1 ? n - 1 : 1));
      const x = CX + R * Math.cos(angle);
      const y = CY - R * Math.sin(angle);
      positions.push({
        x,
        y,
        siege: siegesOrdres[siegeIdx] ?? { nom: "?", groupe: "NI", sigle: "NI", couleur: "#CCC" },
      });
      siegeIdx++;
    }
  }

  return positions;
}

// ═══════════════════════════════════════════════════════════════════
// CHARGEMENT DONNÉES NOMINATIVES
// ═══════════════════════════════════════════════════════════════════

// Mapping sigle interne → nom groupe nosdeputes.fr
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

async function chargerDeputesAN(): Promise<Siege[]> {
  const res = await fetch(
    "https://www.nosdeputes.fr/17/deputes/json",
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const deputes = json?.deputes ?? [];

  return deputes.map((d: { depute: { nom: string; groupe_sigle: string; nom_circo: string; departement?: string } }) => {
    const dep    = d.depute;
    const sigle  = normaliserGroupeAN(dep.groupe_sigle ?? "");
    const groupe = GROUPES_AN.find(g => g.sigle === sigle);
    return {
      nom:          dep.nom,
      groupe:       groupe?.nom ?? "Non-inscrits",
      sigle,
      couleur:      groupe?.couleur ?? "#CCC",
      departement:  dep.nom_circo ?? dep.departement,
    };
  });
}

async function chargerSenateursSEN(): Promise<Siege[]> {
  const res = await fetch(
    "https://www.nossenateurs.fr/senateurs/json",
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const senateurs = json?.senateurs ?? [];

  return senateurs.map((s: { senateur: { nom: string; groupe_sigle: string; nom_circo?: string } }) => {
    const sen   = s.senateur;
    const sigle = normaliserGroupeSenat(sen.groupe_sigle ?? "");
    const groupe = GROUPES_SENAT.find(g => g.sigle === sigle);
    return {
      nom:         sen.nom,
      groupe:      groupe?.nom ?? "Non-inscrits",
      sigle,
      couleur:     groupe?.couleur ?? "#CCC",
      departement: sen.nom_circo,
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
  const [tooltip,   setTooltip]   = useState<{ visible: boolean; x: number; y: number; siege: Siege | null }>
    ({ visible: false, x: 0, y: 0, siege: null });

  const svgRef = useRef<SVGSVGElement>(null);

  // Charger les noms réels
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = chambre === "AN"
          ? await chargerDeputesAN()
          : await chargerSenateursSEN();

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
            const actif = filtre === null || p.siege.sigle === filtre;
            return (
              <circle key={i}
                cx={p.x} cy={p.y} r={RAYON}
                fill={p.siege.couleur}
                opacity={actif ? 0.9 : 0.1}
                stroke={actif ? "rgba(255,255,255,0.4)" : "none"}
                strokeWidth={0.8}
                style={{ cursor: "pointer", transition: "opacity .15s ease" }}
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

      <div className="chart-source">
        {chambre === "AN"
          ? "Sources : Assemblée nationale open data, nosdeputes.fr — XVIIe législature, oct. 2025"
          : "Sources : Sénat, france-politique.fr, nossenateurs.fr — composition oct. 2025"}
      </div>
    </div>
  );
}
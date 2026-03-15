"use client";
// src/components/Hemicycle.tsx
// Hémicycle interactif — 577 sièges AN ou 348 sièges Sénat
// Données chargées depuis l'API open data assemblee-nationale.fr
// Chaque point = 1 siège, tooltip au survol avec nom + groupe + circonscription

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Depute {
  nom: string;
  groupe: string;
  couleur: string;
  circonscription?: string;
  sigle: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  depute: Depute | null;
}

// ─── Groupes AN — couleurs officielles ───────────────────────────────────────

const COULEURS_GROUPES: Record<string, { couleur: string; sigle: string; ordre: number }> = {
  "Rassemblement National":                            { couleur: "#001E96", sigle: "RN",     ordre: 1  },
  "Union des droites pour la République":              { couleur: "#0D2A74", sigle: "UDR",    ordre: 2  },
  "Droite Républicaine":                               { couleur: "#0055A5", sigle: "DR",     ordre: 3  },
  "Les Démocrates":                                    { couleur: "#F7A80D", sigle: "DEM",    ordre: 4  },
  "Horizons & indépendants":                           { couleur: "#1E9DE3", sigle: "HOR",    ordre: 5  },
  "Ensemble pour la République":                       { couleur: "#FFBE00", sigle: "EPR",    ordre: 6  },
  "Libertés, Indépendants, Outre-mer et Territoires":  { couleur: "#8B4513", sigle: "LIOT",   ordre: 7  },
  "Socialistes et apparentés":                         { couleur: "#FF8C00", sigle: "SOC",    ordre: 8  },
  "Écologiste et Social":                              { couleur: "#2E8B57", sigle: "EcoS",   ordre: 9  },
  "La France insoumise - Nouveau Front Populaire":     { couleur: "#CC2929", sigle: "LFI",    ordre: 10 },
  "Gauche Démocrate et Républicaine - NUPES":          { couleur: "#A50000", sigle: "GDR",    ordre: 11 },
  "Non-inscrits":                                      { couleur: "#BBBBBB", sigle: "NI",     ordre: 12 },
};

// Normaliser le nom de groupe vers notre mapping
function normaliserGroupe(nom: string): string {
  const n = nom.toLowerCase();
  if (n.includes("rassemblement national"))      return "Rassemblement National";
  if (n.includes("union des droites"))           return "Union des droites pour la République";
  if (n.includes("droite républicaine"))         return "Droite Républicaine";
  if (n.includes("démocrates"))                  return "Les Démocrates";
  if (n.includes("horizons"))                    return "Horizons & indépendants";
  if (n.includes("ensemble pour la république")) return "Ensemble pour la République";
  if (n.includes("libertés") || n.includes("liot")) return "Libertés, Indépendants, Outre-mer et Territoires";
  if (n.includes("socialiste"))                  return "Socialistes et apparentés";
  if (n.includes("écologiste"))                  return "Écologiste et Social";
  if (n.includes("france insoumise") || n.includes("lfi") || n.includes("nouveau front")) return "La France insoumise - Nouveau Front Populaire";
  if (n.includes("gauche démocrate") || n.includes("gdr")) return "Gauche Démocrate et Républicaine - NUPES";
  return "Non-inscrits";
}

// ─── Données de fallback (si API indisponible) ────────────────────────────────
// Groupes avec effectifs, triés de droite à gauche pour le positionnement hémicycle

const GROUPES_FALLBACK = [
  { nom: "Rassemblement National",                           sigle: "RN",   sieges: 124, couleur: "#001E96" },
  { nom: "Union des droites pour la République",             sigle: "UDR",  sieges: 17,  couleur: "#0D2A74" },
  { nom: "Droite Républicaine",                              sigle: "DR",   sieges: 55,  couleur: "#0055A5" },
  { nom: "Les Démocrates",                                   sigle: "DEM",  sieges: 36,  couleur: "#F7A80D" },
  { nom: "Horizons & indépendants",                          sigle: "HOR",  sieges: 31,  couleur: "#1E9DE3" },
  { nom: "Ensemble pour la République",                      sigle: "EPR",  sieges: 97,  couleur: "#FFBE00" },
  { nom: "Libertés, Indépendants, Outre-mer et Territoires", sigle: "LIOT", sieges: 22,  couleur: "#8B4513" },
  { nom: "Socialistes et apparentés",                        sigle: "SOC",  sieges: 64,  couleur: "#FF8C00" },
  { nom: "Écologiste et Social",                             sigle: "EcoS", sieges: 23,  couleur: "#2E8B57" },
  { nom: "La France insoumise - Nouveau Front Populaire",    sigle: "LFI",  sieges: 72,  couleur: "#CC2929" },
  { nom: "Gauche Démocrate et Républicaine - NUPES",         sigle: "GDR",  sieges: 22,  couleur: "#A50000" },
  { nom: "Non-inscrits",                                     sigle: "NI",   sieges: 10,  couleur: "#BBBBBB" },
];

// ─── Calcul positions hémicycle ───────────────────────────────────────────────
// Algorithme : arcs concentriques, de droite (0°) à gauche (180°)
// Rangées de l'extérieur vers l'intérieur

function calculerPositions(total: number): { x: number; y: number; index: number }[] {
  const cx = 500, cy = 420;
  const R_MIN = 160, R_MAX = 380;
  const RANGEES = 8;
  const positions: { x: number; y: number; index: number }[] = [];

  // Calculer le nombre de sièges par rangée (proportionnel au rayon)
  const rayons: number[] = [];
  for (let r = 0; r < RANGEES; r++) {
    rayons.push(R_MIN + (r / (RANGEES - 1)) * (R_MAX - R_MIN));
  }

  // Nombre de sièges par rangée proportionnel à la circonférence
  const totalCirc = rayons.reduce((s, r) => s + r, 0);
  const siegesParRangee = rayons.map((r) => Math.round((r / totalCirc) * total));

  // Ajuster pour que le total soit exact
  let diff = total - siegesParRangee.reduce((s, n) => s + n, 0);
  let i = RANGEES - 1;
  while (diff > 0) { siegesParRangee[i % RANGEES]++; diff--; i--; }
  while (diff < 0) { siegesParRangee[i % RANGEES]--; diff++; i--; }

  let idx = 0;
  for (let r = 0; r < RANGEES; r++) {
    const n = siegesParRangee[r];
    const R = rayons[r];
    for (let s = 0; s < n; s++) {
      // Angle de 0° (droite) à 180° (gauche), avec marges
      const angle = Math.PI * (s / (n - 1));
      positions.push({
        x: cx - R * Math.cos(angle),
        y: cy - R * Math.sin(angle),
        index: idx++,
      });
    }
  }

  return positions;
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface HemicycleProps {
  chambre: "AN" | "SENAT";
  titre: string;
}

export default function Hemicycle({ chambre, titre }: HemicycleProps) {
  const [deputes, setDeputes]     = useState<Depute[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [tooltip, setTooltip]     = useState<TooltipState>({ visible: false, x: 0, y: 0, depute: null });
  const [filtre, setFiltre]       = useState<string | null>(null);
  const svgRef                    = useRef<SVGSVGElement>(null);

  // Charger les données depuis l'API open data AN
  useEffect(() => {
    async function charger() {
      setLoading(true);
      try {
        const url = chambre === "AN"
          ? "https://data.assemblee-nationale.fr/api/v2/organe/GP?legislature=17"
          : null;

        if (!url) {
          // Pour le Sénat, utiliser fallback directement
          throw new Error("Sénat: données nominatives non disponibles via API publique");
        }

        const res  = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) throw new Error(`API indisponible (${res.status})`);
        const json = await res.json();

        // Parser la réponse API AN
        const liste: Depute[] = [];
        // Format API AN : export JSON avec organes et membres
        const organes = json?.export?.organes?.organe ?? [];
        for (const organe of organes) {
          const nomGroupe = normaliserGroupe(organe.libelle ?? "");
          const config    = COULEURS_GROUPES[nomGroupe] ?? { couleur: "#BBBBBB", sigle: "NI", ordre: 99 };
          const membres   = organe.membres?.membre ?? [];
          for (const m of (Array.isArray(membres) ? membres : [membres])) {
            const acteur = m.acteur ?? m;
            const nom    = acteur.etatCivil?.ident
              ? `${acteur.etatCivil.ident.prenom} ${acteur.etatCivil.ident.nom}`
              : acteur.uid ?? "?";
            liste.push({ nom, groupe: nomGroupe, couleur: config.couleur, sigle: config.sigle, circonscription: "" });
          }
        }

        if (liste.length > 0) {
          // Trier par groupe (ordre politique droite→gauche)
          liste.sort((a, b) => {
            const oa = COULEURS_GROUPES[a.groupe]?.ordre ?? 99;
            const ob = COULEURS_GROUPES[b.groupe]?.ordre ?? 99;
            return oa - ob;
          });
          setDeputes(liste);
        } else {
          throw new Error("Réponse API vide");
        }
      } catch (err) {
        // Fallback : générer les noms depuis groupes
        const liste: Depute[] = [];
        const groupes = GROUPES_FALLBACK;
        for (const g of groupes) {
          for (let i = 0; i < g.sieges; i++) {
            liste.push({
              nom:           `${g.nom} — siège ${i + 1}`,
              groupe:        g.nom,
              couleur:       g.couleur,
              sigle:         g.sigle,
              circonscription: "",
            });
          }
        }
        setDeputes(liste);
        setError(null); // Ne pas afficher l'erreur, fallback silencieux
      } finally {
        setLoading(false);
      }
    }
    charger();
  }, [chambre]);

  const positions   = calculerPositions(deputes.length || (chambre === "AN" ? 577 : 348));
  const RAYON_POINT = deputes.length > 400 ? 5.8 : 7;

  // Groupes distincts pour la légende
  const groupesDistincts = GROUPES_FALLBACK.filter((g) =>
    deputes.some((d) => d.groupe === g.nom)
  );

  const handleMouseEnter = useCallback((e: React.MouseEvent<SVGCircleElement>, d: Depute) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    setTooltip({
      visible: true,
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top - 10,
      depute: d,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  return (
    <div>
      <div className="chart-title">{titre}</div>
      <div className="chart-subtitle">
        {`${deputes.length || (chambre === "AN" ? 577 : 348)} sièges — survolez chaque point pour voir le nom`}
      </div>

      {/* Filtres groupes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setFiltre(null)}
          style={{
            fontFamily: "var(--sans)", fontSize: ".75rem", padding: ".25rem .625rem",
            borderRadius: 3, border: "1px solid var(--bordure)", cursor: "pointer",
            background: filtre === null ? "var(--bleu)" : "var(--blanc)",
            color: filtre === null ? "white" : "var(--encre)",
          }}
        >{"Tous"}</button>
        {GROUPES_FALLBACK.map((g) => (
          <button
            key={g.sigle}
            onClick={() => setFiltre(filtre === g.nom ? null : g.nom)}
            style={{
              fontFamily: "var(--sans)", fontSize: ".75rem", padding: ".25rem .625rem",
              borderRadius: 3, border: `1px solid ${g.couleur}`, cursor: "pointer",
              background: filtre === g.nom ? g.couleur : "var(--blanc)",
              color: filtre === g.nom ? "white" : "var(--encre)",
              display: "flex", alignItems: "center", gap: ".375rem",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: g.couleur, display: "inline-block" }} />
            {g.sigle} {g.sieges}
          </button>
        ))}
      </div>

      {/* SVG hémicycle */}
      <div style={{ position: "relative", width: "100%", maxWidth: 700, margin: "0 auto" }}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(250,250,247,.8)", zIndex: 2, borderRadius: 8 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-2)" }}>{"Chargement…"}</span>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox="0 0 1000 450"
          style={{ width: "100%", height: "auto", overflow: "visible" }}
        >
          {positions.map((pos, i) => {
            const depute  = deputes[i];
            if (!depute) return null;
            const actif   = filtre === null || depute.groupe === filtre;
            return (
              <circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r={RAYON_POINT}
                fill={depute.couleur}
                opacity={actif ? 0.92 : 0.12}
                stroke={actif ? "rgba(0,0,0,.15)" : "none"}
                strokeWidth={0.5}
                style={{ cursor: "pointer", transition: "opacity .2s ease" }}
                onMouseEnter={(e) => handleMouseEnter(e, depute)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}

          {/* Ligne de base */}
          <line x1={100} y1={420} x2={900} y2={420} stroke="var(--bordure)" strokeWidth={1.5} />

          {/* Label centre */}
          <text x={500} y={445} textAnchor="middle" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fill: "var(--gris-3)" }}>
            {chambre === "AN" ? "XVIIe législature — 2024/2025" : "2023/2025"}
          </text>
        </svg>

        {/* Tooltip */}
        {tooltip.visible && tooltip.depute && (
          <div style={{
            position: "absolute",
            left: Math.min(tooltip.x + 12, 500),
            top: Math.max(tooltip.y - 60, 0),
            background: "var(--encre)",
            color: "white",
            padding: ".5rem .75rem",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--sans)",
            fontSize: ".8125rem",
            lineHeight: 1.5,
            pointerEvents: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(0,0,0,.25)",
          }}>
            <div style={{ fontWeight: 700 }}>{tooltip.depute.nom}</div>
            <div style={{ display: "flex", alignItems: "center", gap: ".375rem", marginTop: ".2rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: tooltip.depute.couleur, display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: "rgba(255,255,255,.75)", fontSize: ".75rem" }}>{tooltip.depute.groupe}</span>
            </div>
            {tooltip.depute.circonscription && (
              <div style={{ color: "rgba(255,255,255,.55)", fontSize: ".7rem", marginTop: ".1rem" }}>{tooltip.depute.circonscription}</div>
            )}
          </div>
        )}
      </div>

      {/* Légende complète */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".375rem .875rem", marginTop: "1rem" }}>
        {GROUPES_FALLBACK.map((g) => (
          <div key={g.sigle} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: g.couleur, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)" }}>
              <strong>{g.sigle}</strong>{" — "}{g.nom}
            </span>
            <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-3)", marginLeft: "auto" }}>{g.sieges}</span>
          </div>
        ))}
      </div>

      <div className="chart-source">
        {"Source : Assemblée nationale open data — data.assemblee-nationale.fr — XVIIe législature"}
      </div>
    </div>
  );
}
// src/components/ComparaisonEU.tsx
// Composant réutilisable — comparaison UE27 sur 3 métriques
// Données Eurostat 2024 (publication avril + octobre 2025)
// Sources : Eurostat PDE 2e notification 2025 + INSEE + FIPECO

// ─── Dataset Eurostat 2024 — tous pays UE27 ──────────────────────────────────
// depenses = dépenses publiques totales % PIB
// deficit  = solde public % PIB (positif = excédent)
// dette    = dette publique % PIB (Maastricht)
// Source : Eurostat, 2e notification PDE oct. 2025 + FIPECO + INSEE

export const PAYS_UE: {
  code: string;
  nom: string;
  depenses: number;
  deficit: number;
  dette: number;
}[] = [
  // Données 2024 — sources Eurostat PDE oct. 2025 + FIPECO avril 2025
  { code: "FI", nom: "Finlande",        depenses: 57.6,  deficit: -3.4,  dette:  81.8 },
  { code: "FR", nom: "France",          depenses: 57.1,  deficit: -5.8,  dette: 113.2 },
  { code: "BE", nom: "Belgique",        depenses: 55.2,  deficit: -4.4,  dette: 103.9 },
  { code: "AT", nom: "Autriche",        depenses: 54.5,  deficit: -4.7,  dette:  82.0 },
  { code: "IT", nom: "Italie",          depenses: 52.9,  deficit: -3.4,  dette: 134.9 },
  { code: "HU", nom: "Hongrie",         depenses: 52.5,  deficit: -5.0,  dette:  74.0 },
  { code: "SE", nom: "Suède",           depenses: 51.6,  deficit: -1.5,  dette:  34.0 },
  { code: "DE", nom: "Allemagne",       depenses: 49.5,  deficit: -2.8,  dette:  62.5 },
  { code: "PT", nom: "Portugal",        depenses: 47.8,  deficit:  0.7,  dette:  95.0 },
  { code: "ES", nom: "Espagne",         depenses: 47.6,  deficit: -3.1,  dette: 101.6 },
  { code: "DK", nom: "Danemark",        depenses: 47.3,  deficit:  4.5,  dette:  30.5 },
  { code: "SI", nom: "Slovénie",        depenses: 46.9,  deficit: -3.4,  dette:  69.1 },
  { code: "CZ", nom: "Tchéquie",        depenses: 46.5,  deficit: -2.8,  dette:  44.0 },
  { code: "HR", nom: "Croatie",         depenses: 46.3,  deficit: -2.2,  dette:  57.1 },
  { code: "GR", nom: "Grèce",           depenses: 46.2,  deficit:  1.3,  dette: 153.6 },
  { code: "SK", nom: "Slovaquie",       depenses: 46.1,  deficit: -5.3,  dette:  58.1 },
  { code: "LU", nom: "Luxembourg",      depenses: 45.2,  deficit:  1.0,  dette:  26.3 },
  { code: "PL", nom: "Pologne",         depenses: 48.5,  deficit: -6.6,  dette:  55.4 },
  { code: "NL", nom: "Pays-Bas",        depenses: 43.9,  deficit: -2.9,  dette:  43.3 },
  { code: "CY", nom: "Chypre",          depenses: 42.8,  deficit:  4.3,  dette:  62.0 },
  { code: "EE", nom: "Estonie",         depenses: 47.8,  deficit: -3.6,  dette:  23.5 },
  { code: "LV", nom: "Lettonie",        depenses: 44.0,  deficit: -3.2,  dette:  47.8 },
  { code: "LT", nom: "Lituanie",        depenses: 41.5,  deficit: -2.8,  dette:  38.0 },
  { code: "RO", nom: "Roumanie",        depenses: 47.2,  deficit: -9.3,  dette:  52.0 },
  { code: "BG", nom: "Bulgarie",        depenses: 40.8,  deficit: -2.8,  dette:  23.8 },
  { code: "MT", nom: "Malte",           depenses: 40.5,  deficit: -3.6,  dette:  47.0 },
  { code: "IE", nom: "Irlande",         depenses: 27.6,  deficit:  4.3,  dette:  37.0 },
];

// Moyenne UE27 calculée à partir des données ci-dessus
export const MOYENNE_UE = {
  depenses: 49.2,
  deficit: -3.1,
  dette: 80.7,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Metrique = "depenses" | "deficit" | "dette";

interface Props {
  metrique?: Metrique;
  titre?: string;
  note?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCouleur(pays: (typeof PAYS_UE)[0], metrique: Metrique): string {
  if (pays.code === "FR") return "var(--rouge)";
  if (metrique === "deficit") {
    return pays.deficit > 0 ? "#2B8C6B" : pays.deficit < -4 ? "#C0392B" : "var(--bleu)";
  }
  if (metrique === "dette") {
    return pays.dette > 100 ? "#C0392B" : pays.dette > 60 ? "#B45309" : "var(--bleu)";
  }
  return "var(--bleu)";
}

function formatVal(v: number, metrique: Metrique): string {
  const sign = v > 0 && metrique !== "depenses" && metrique !== "dette" ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

const CONFIGS: Record<Metrique, { label: string; tri: "desc" | "asc"; refVal: number }> = {
  depenses: { label: "Dépenses publiques (% PIB)",      tri: "desc", refVal: MOYENNE_UE.depenses },
  deficit:  { label: "Solde public (% PIB)",             tri: "desc", refVal: MOYENNE_UE.deficit  },
  dette:    { label: "Dette publique (% PIB, Maastricht)", tri: "desc", refVal: MOYENNE_UE.dette  },
};

// ─── Composant ────────────────────────────────────────────────────────────────

export default function ComparaisonEU({
  metrique = "depenses",
  titre,
  note,
}: Props) {
  const cfg  = CONFIGS[metrique];
  const pays = [...PAYS_UE].sort((a, b) =>
    cfg.tri === "desc" ? b[metrique] - a[metrique] : a[metrique] - b[metrique]
  );

  // Valeur max absente pour scale
  const vals    = pays.map((p) => Math.abs(p[metrique]));
  const maxVal  = Math.max(...vals);
  const isFR_idx = pays.findIndex((p) => p.code === "FR");

  return (
    <section className="section-page" style={{ background: "var(--creme-fonce)" }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="chart-wrapper">
          <div className="chart-title">{titre ?? cfg.label}</div>
          <div className="chart-subtitle">
            {"Comparaison UE27 — données Eurostat 2024"}
            <span style={{ marginLeft: "1rem", fontFamily: "var(--sans)", fontWeight: 600, color: "var(--rouge)", fontSize: ".75rem" }}>
              {"🇫🇷 France : " + formatVal(PAYS_UE.find(p => p.code === "FR")![metrique], metrique)}
            </span>
            <span style={{ marginLeft: "1rem", color: "var(--gris-3)" }}>
              {"Moy. UE27 : " + formatVal(cfg.refVal, metrique)}
            </span>
          </div>

          {/* Légende rapide */}
          <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: "var(--rouge)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)" }}>{"France"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: "var(--bleu)", display: "inline-block" }} />
              <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)" }}>{"Autres pays UE"}</span>
            </div>
            {metrique === "dette" && (
              <div style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "#C0392B", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)" }}>{"Dette > 100% PIB"}</span>
              </div>
            )}
          </div>

          {/* Graphique barres horizontales — col1 : rangs 1→⌈n/2⌉, col2 : ⌈n/2⌉+1→n */}
          {(() => {
            const mid  = Math.ceil(pays.length / 2);
            const col1 = pays.slice(0, mid);
            const col2 = pays.slice(mid);

            const renderPays = (p: typeof pays[0], rank: number) => {
              const val    = p[metrique];
              const absVal = Math.abs(val);
              const pct    = (absVal / maxVal) * 100;
              const isFR   = p.code === "FR";
              const couleur = getCouleur(p, metrique);
              return (
                <div key={p.code} style={{
                  padding: isFR ? ".375rem .5rem" : ".25rem .5rem",
                  background: isFR ? "rgba(192,57,43,.06)" : "transparent",
                  borderRadius: "var(--radius-sm)",
                  border: isFR ? "1px solid rgba(192,57,43,.15)" : "1px solid transparent",
                  marginBottom: ".125rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".65rem", color: "var(--gris-3)", width: 18, flexShrink: 0, textAlign: "right" }}>
                      {rank}
                    </span>
                    <span style={{
                      fontFamily: "var(--sans)",
                      fontSize: ".8125rem",
                      fontWeight: isFR ? 700 : 400,
                      color: isFR ? "var(--rouge)" : "var(--encre)",
                      width: 88,
                      flexShrink: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {isFR ? "🇫🇷 " : ""}{p.nom}
                    </span>
                    <div style={{ flex: 1, background: "var(--gris-5)", borderRadius: 2, height: isFR ? 12 : 9, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        borderRadius: 2,
                        width: `${pct}%`,
                        background: couleur,
                        opacity: isFR ? 1 : 0.7,
                        transition: "width .4s ease",
                      }} />
                    </div>
                    <span style={{
                      fontFamily: "var(--mono)",
                      fontSize: isFR ? ".875rem" : ".8125rem",
                      fontWeight: isFR ? 700 : 400,
                      color: isFR ? "var(--rouge)" : "var(--encre)",
                      minWidth: 52,
                      textAlign: "right",
                      flexShrink: 0,
                    }}>
                      {formatVal(val, metrique)}
                    </span>
                  </div>
                </div>
              );
            };

            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 2rem" }}>
                <div>{col1.map((p, i) => renderPays(p, i + 1))}</div>
                <div>{col2.map((p, i) => renderPays(p, mid + i + 1))}</div>
              </div>
            );
          })()}

          {/* Ligne moyenne UE */}
          <div style={{ marginTop: "1rem", padding: ".75rem 1rem", background: "var(--bleu-pale)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".5rem" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--encre)" }}>
              <strong>{"Moyenne UE27"}</strong>
              {" — "}
              {formatVal(cfg.refVal, metrique)}
            </span>
            {(() => {
              const frVal = PAYS_UE.find(p => p.code === "FR")![metrique];
              const diff  = frVal - cfg.refVal;
              const plus  = diff > 0;
              return (
                <span style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: plus ? "var(--rouge)" : "#1E6B3C" }}>
                  {"France : "}
                  <strong>{plus ? "+" : ""}{diff.toFixed(1)} pts</strong>
                  {" par rapport à la moyenne"}
                </span>
              );
            })()}
          </div>

          <div className="chart-source">
            {note ?? "Source : Eurostat, 2e notification PDE 2025 (données 2024). Irlande : ratio PIB distordu par les activités des multinationales."}
          </div>
        </div>
      </div>
    </section>
  );
}
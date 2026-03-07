"use client";

// src/components/CommuneCharts.tsx
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PointHistorique } from "@/lib/api";

interface Props {
  historique: PointHistorique[];
  nomCommune: string;
}

function formaterAxe(euros: number): string {
  if (euros >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1) + " Md€";
  if (euros >= 1_000_000)     return (euros / 1_000_000).toFixed(0) + " M€";
  if (euros >= 1_000)         return (euros / 1_000).toFixed(0) + " k€";
  return euros + " €";
}

const tooltipFormatter = (
  val: number | undefined,
  name: string | undefined
): [string, string] => {
  const labels: Record<string, string> = {
    depenses_fonctionnement: "Dépenses fonct.",
    depenses_investissement: "Investissements",
    encours_dette:           "Encours dette",
    epargne_brute:           "Épargne brute",
  };
  return [
    val ? formaterAxe(val) : "N/D",
    labels[name ?? ""] ?? (name ?? ""),
  ];
};

export default function CommuneCharts({ historique }: Props) {
  if (!historique || historique.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "3rem",
        color: "var(--texte-secondaire)",
        fontSize: ".9375rem",
        background: "var(--bleu-pale)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--bordure)",
      }}>
        {"Données historiques non disponibles pour cette commune."}
      </div>
    );
  }

  const styleCard: React.CSSProperties = {
    background: "var(--blanc)",
    border: "1px solid var(--bordure)",
    borderRadius: "var(--radius-lg)",
    padding: "1.5rem",
    boxShadow: "var(--ombre-xs)",
  };

  const styleTitre: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "1.25rem",
    color: "var(--texte-primaire)",
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1.25rem",
    }}>

      {/* Graphique 1 : Fonctionnement vs Investissement */}
      <div style={styleCard}>
        <p style={styleTitre}>{"Dépenses : fonctionnement vs investissement"}</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={historique} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradFonct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1E4E8C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1E4E8C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0891B2" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" />
            <XAxis
              dataKey="annee"
              tick={{ fontSize: 12, fill: "var(--texte-secondaire)" }}
            />
            <YAxis
              tickFormatter={formaterAxe}
              tick={{ fontSize: 11, fill: "var(--texte-secondaire)" }}
              width={72}
            />
            <Tooltip
              formatter={tooltipFormatter as never}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--bordure)",
                background: "var(--surface-elevee)",
                color: "var(--texte-primaire)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="depenses_fonctionnement"
              name="depenses_fonctionnement"
              stroke="#1E4E8C"
              strokeWidth={2}
              fill="url(#gradFonct)"
              dot={{ r: 3 }}
            />
            <Area
              type="monotone"
              dataKey="depenses_investissement"
              name="depenses_investissement"
              stroke="#0891B2"
              strokeWidth={2}
              fill="url(#gradInvest)"
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique 2 : Dette et épargne brute */}
      <div style={styleCard}>
        <p style={styleTitre}>{"Dette et épargne brute"}</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={historique} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" />
            <XAxis
              dataKey="annee"
              tick={{ fontSize: 12, fill: "var(--texte-secondaire)" }}
            />
            <YAxis
              tickFormatter={formaterAxe}
              tick={{ fontSize: 11, fill: "var(--texte-secondaire)" }}
              width={72}
            />
            <Tooltip
              formatter={tooltipFormatter as never}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--bordure)",
                background: "var(--surface-elevee)",
                color: "var(--texte-primaire)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="encours_dette"
              name="encours_dette"
              fill="#C1292E"
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
            <Bar
              dataKey="epargne_brute"
              name="epargne_brute"
              fill="#059669"
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
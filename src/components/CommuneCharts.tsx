"use client";

// src/components/CommuneCharts.tsx
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { PointHistorique, FinancesCommune } from "@/lib/api";

interface Props {
  historique:  PointHistorique[];
  nomCommune:  string;
  finances?:   FinancesCommune | null;
}

function formaterAxe(euros: number): string {
  if (euros >= 1_000_000_000) return (euros / 1_000_000_000).toFixed(1) + " Md€";
  if (euros >= 1_000_000)     return (euros / 1_000_000).toFixed(0) + " M€";
  if (euros >= 1_000)         return (euros / 1_000).toFixed(0) + " k€";
  return euros + " €";
}

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid var(--bordure)",
  background: "var(--surface-elevee)",
  color: "var(--texte-primaire)",
  fontSize: "0.8125rem",
};

const LABELS_HISTORIQUE: Record<string, string> = {
  depenses_fonctionnement: "Dép. fonctionnement",
  recettes_fonctionnement: "Rec. fonctionnement",
  depenses_investissement: "Investissements",
  encours_dette:           "Encours dette",
  epargne_brute:           "Épargne brute",
};

const tooltipFormatter = (val: number, name: string): [string, string] => [
  formaterAxe(val),
  LABELS_HISTORIQUE[name] ?? name,
];

// ─── Camembert dépenses par nature ───────────────────────────────────────────

const COULEURS_PIE = ["#1E4E8C", "#0891B2", "#C1292E", "#059669", "#F59E0B", "#8B5CF6"];

interface PieEntry { name: string; value: number; color: string; }

function buildDepensesNature(f: FinancesCommune): PieEntry[] {
  const rawEntries: Array<[string, number]> = [
    ["Frais de personnel",     f.frais_personnel       ?? 0],
    ["Achats et charges ext.", f.achats_charges        ?? 0],
    ["Intervention sociale",   f.depenses_intervention ?? 0],
    ["Investissements",        f.depenses_investissement],
    ["Charges financières",    Math.max(0, f.depenses_fonctionnement
      - (f.frais_personnel ?? 0)
      - (f.achats_charges ?? 0)
      - (f.depenses_intervention ?? 0)
      - f.depenses_investissement
    )],
  ];
  const entries: Array<[string, number]> = rawEntries.filter(([, v]) => v > 0);

  return entries.map(([name, value], i) => ({
    name,
    value,
    color: COULEURS_PIE[i % COULEURS_PIE.length],
  }));
}

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0) + "%"}
    </text>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CommuneCharts({ historique, finances }: Props) {
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

  const pieData = finances ? buildDepensesNature(finances) : [];

  if (!historique || historique.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "3rem",
        color: "var(--texte-secondaire)", fontSize: ".9375rem",
        background: "var(--bleu-pale)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--bordure)",
      }}>
        {"Données historiques non disponibles pour cette commune."}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Graphique 1 : Fonctionnement — dépenses vs recettes */}
      <div style={styleCard}>
        <p style={styleTitre}>{"Fonctionnement : dépenses et recettes"}</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={historique} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradDep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#C1292E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C1292E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#059669" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" />
            <XAxis dataKey="annee" tick={{ fontSize: 12, fill: "var(--texte-secondaire)" }} />
            <YAxis tickFormatter={formaterAxe} tick={{ fontSize: 11, fill: "var(--texte-secondaire)" }} width={72} />
            <Tooltip formatter={tooltipFormatter as never} contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => LABELS_HISTORIQUE[v] ?? v} />
            <Area type="monotone" dataKey="depenses_fonctionnement" stroke="#C1292E" strokeWidth={2} fill="url(#gradDep)" dot={{ r: 3 }} />
            <Area type="monotone" dataKey="recettes_fonctionnement" stroke="#059669" strokeWidth={2} fill="url(#gradRec)" dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique 2 : Investissements + Épargne */}
      <div style={styleCard}>
        <p style={styleTitre}>{"Investissements et épargne brute"}</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={historique} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" />
            <XAxis dataKey="annee" tick={{ fontSize: 12, fill: "var(--texte-secondaire)" }} />
            <YAxis tickFormatter={formaterAxe} tick={{ fontSize: 11, fill: "var(--texte-secondaire)" }} width={72} />
            <Tooltip formatter={tooltipFormatter as never} contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => LABELS_HISTORIQUE[v] ?? v} />
            <Bar dataKey="depenses_investissement" fill="#1E4E8C" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Bar dataKey="epargne_brute"           fill="#0891B2" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique 3 : Dette */}
      <div style={styleCard}>
        <p style={styleTitre}>{"Encours de dette"}</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={historique} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradDette" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#C1292E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#C1292E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bordure)" />
            <XAxis dataKey="annee" tick={{ fontSize: 12, fill: "var(--texte-secondaire)" }} />
            <YAxis tickFormatter={formaterAxe} tick={{ fontSize: 11, fill: "var(--texte-secondaire)" }} width={72} />
            <Tooltip formatter={tooltipFormatter as never} contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="encours_dette" name="encours_dette" stroke="#C1292E" strokeWidth={2} fill="url(#gradDette)" dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique 4 : Camembert répartition dépenses */}
      {finances && pieData.length > 0 && (
        <div style={styleCard}>
          <p style={styleTitre}>{"Répartition des dépenses par nature"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => formaterAxe(val)}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Légende manuelle */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", minWidth: 160 }}>
              {pieData.map((e, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".8125rem" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: e.color, flexShrink: 0 }} />
                  <span style={{ color: "var(--texte-secondaire)" }}>{e.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
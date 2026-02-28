// src/components/CommuneCharts.tsx
// Graphiques d'évolution financière d'une commune — Recharts
"use client";

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { HistoriqueCommune } from "@/lib/api";

interface Props {
  historique: HistoriqueCommune[];
  nomCommune: string;
}

// Formateur axe Y : affiche en M€ si > 1000 k€
const formatYAxis = (val: number) =>
  val >= 1000 ? `${(val / 1000).toFixed(0)}M€` : `${val}k€`;

const formatTooltip = (val: number) =>
  val >= 1000
    ? `${(val / 1000).toFixed(2)} M€`
    : `${val.toLocaleString("fr-FR")} k€`;

export default function CommuneCharts({ historique, nomCommune }: Props) {
  if (!historique.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--texte-secondaire)",
          background: "var(--bleu-pale)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--bordure)",
        }}
      >
        Données historiques non disponibles pour cette commune.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

      {/* --- Graphique 1 : Évolution dépenses fonctionnement vs investissement --- */}
      <div
        style={{
          background: "var(--blanc)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--bordure)",
          padding: "1.75rem",
          boxShadow: "var(--ombre-xs)",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginBottom: ".375rem" }}>
          Évolution des dépenses
        </h3>
        <p style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", marginBottom: "1.5rem" }}>
          Fonctionnement et investissement — {nomCommune} (en k€)
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={historique} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradFonct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E4E8C" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1E4E8C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C1292E" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#C1292E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
            <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} width={64} />
            <Tooltip
              formatter={(val: number, name: string) => [
                formatTooltip(val),
                name === "depenses_fonctionnement" ? "Fonctionnement" : "Investissement",
              ]}
              labelFormatter={(l) => `Année ${l}`}
            />
            <Legend
              formatter={(val) =>
                val === "depenses_fonctionnement" ? "Fonctionnement" : "Investissement"
              }
            />
            <Area
              type="monotone"
              dataKey="depenses_fonctionnement"
              stroke="#1E4E8C"
              strokeWidth={2}
              fill="url(#gradFonct)"
            />
            <Area
              type="monotone"
              dataKey="depenses_investissement"
              stroke="#C1292E"
              strokeWidth={2}
              fill="url(#gradInvest)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* --- Graphique 2 : Évolution de la dette --- */}
      <div
        style={{
          background: "var(--blanc)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--bordure)",
          padding: "1.75rem",
          boxShadow: "var(--ombre-xs)",
        }}
      >
        <h3 style={{ fontSize: "1rem", marginBottom: ".375rem" }}>
          Encours de dette
        </h3>
        <p style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", marginBottom: "1.5rem" }}>
          Évolution du stock de dette total — {nomCommune} (en k€)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={historique} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
            <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} width={64} />
            <Tooltip
              formatter={(val: number) => [formatTooltip(val), "Encours de dette"]}
              labelFormatter={(l) => `Année ${l}`}
            />
            <Bar dataKey="encours_dette" fill="#003189" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", textAlign: "right" }}>
        Source : OFGL — données DGFiP. Montants en milliers d&apos;euros (k€).
      </p>
    </div>
  );
}
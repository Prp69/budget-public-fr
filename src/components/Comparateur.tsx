"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { rechercherCommunes, getFinancesCommune, type CommuneGeo } from "@/lib/api";

interface CommuneData {
  nom: string;
  codeInsee: string;
  depenses_par_habitant: number;
  dette_par_habitant: number;
  depenses_fonctionnement: number;
  depenses_investissement: number;
}

const COULEURS = ["#003189", "#C1292E", "#0891B2", "#7C3AED"];

// Formatter Recharts typé proprement pour éviter les erreurs TypeScript
const tooltipFormatter = (
  val: number | undefined,
  name: string | undefined
): [string, string] => [
  `${(val ?? 0).toLocaleString("fr-FR")} €`,
  name ?? "",
];

export default function Comparateur() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CommuneGeo[]>([]);
  const [communes, setCommunes] = useState<CommuneData[]>([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) { setSuggestions([]); return; }
    const res = await rechercherCommunes(val);
    setSuggestions(res.slice(0, 6));
  };

  const ajouterCommune = async (commune: CommuneGeo) => {
    setQuery("");
    setSuggestions([]);
    if (communes.length >= 4) { setErreur("Maximum 4 communes."); return; }
    if (communes.find((c) => c.codeInsee === commune.code)) {
      setErreur("Cette commune est déjà dans la comparaison."); return;
    }
    setErreur("");
    setLoading(true);
    const finances = await getFinancesCommune(commune.code, 2024);
    setLoading(false);
    if (!finances) { setErreur("Données non disponibles pour " + commune.nom + "."); return; }
    setCommunes((prev) => [
      ...prev,
      {
        nom: commune.nom,
        codeInsee: commune.code,
        depenses_par_habitant: finances.depenses_par_habitant ?? 0,
        dette_par_habitant: finances.dette_par_habitant ?? 0,
        depenses_fonctionnement: Math.round(finances.depenses_fonctionnement / 1000),
        depenses_investissement: Math.round(finances.depenses_investissement / 1000),
      },
    ]);
  };

  const retirerCommune = (code: string) =>
    setCommunes((prev) => prev.filter((c) => c.codeInsee !== code));

  const dataParHabitant = communes.map((c) => ({
    nom: c.nom,
    "Dépenses/hab": c.depenses_par_habitant,
    "Dette/hab": c.dette_par_habitant,
  }));

  return (
    <div>
      {/* Barre de recherche */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={
            communes.length >= 4
              ? "Maximum atteint (4 communes)"
              : "Ajouter une commune à comparer…"
          }
          disabled={communes.length >= 4}
          style={{
            width: "100%",
            padding: ".75rem 1rem",
            border: "1.5px solid var(--bordure)",
            borderRadius: "var(--radius-md)",
            fontSize: "1rem",
            outline: "none",
            background: communes.length >= 4 ? "#f5f5f5" : "white",
            boxSizing: "border-box",
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 8px 24px rgba(0,0,0,.1)",
              zIndex: 50,
              listStyle: "none",
              margin: ".25rem 0 0",
              padding: ".375rem 0",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s.code}
                onClick={() => ajouterCommune(s)}
                style={{
                  padding: ".625rem 1rem",
                  cursor: "pointer",
                  fontSize: ".9375rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "var(--bleu-pale)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <span>{s.nom}</span>
                <span style={{ fontSize: ".8rem", color: "var(--texte-tertiaire)" }}>
                  {s.codeDepartement + " · " + (s.population?.toLocaleString("fr-FR") ?? "") + " hab."}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tags communes sélectionnées */}
      {communes.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2rem" }}>
          {communes.map((c, i) => (
            <span
              key={c.codeInsee}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                background: COULEURS[i],
                color: "white",
                borderRadius: "99px",
                padding: ".375rem .875rem",
                fontSize: ".875rem",
                fontWeight: 500,
              }}
            >
              {c.nom}
              <button
                onClick={() => retirerCommune(c.codeInsee)}
                style={{
                  background: "rgba(255,255,255,.3)",
                  border: "none",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  cursor: "pointer",
                  color: "white",
                  fontSize: "12px",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {"×"}
              </button>
            </span>
          ))}
        </div>
      )}

      {loading && (
        <p style={{ color: "var(--texte-secondaire)", fontSize: ".9rem" }}>
          {"Chargement des données…"}
        </p>
      )}

      {erreur && (
        <p style={{ color: "var(--rouge-accent)", fontSize: ".875rem", marginBottom: "1rem" }}>
          {"⚠️ " + erreur}
        </p>
      )}

      {/* Graphiques */}
      {communes.length >= 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1rem" }}>

          {/* Graphique dépenses et dette par habitant */}
          <div
            style={{
              background: "var(--blanc)",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              boxShadow: "var(--ombre-xs)",
            }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: ".375rem" }}>
              {"Dépenses & dette par habitant (€/hab.)"}
            </h3>
            <p style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)", marginBottom: "1.5rem" }}>
              {"Comparaison normalisée par habitant — données 2024"}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dataParHabitant} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
                <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} unit="€" width={64} />
                <Tooltip formatter={tooltipFormatter as never} />
                <Legend />
                <Bar dataKey="Dépenses/hab" fill="#003189" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Dette/hab" fill="#C1292E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tableau récapitulatif */}
          <div
            style={{
              background: "var(--blanc)",
              border: "1px solid var(--bordure)",
              borderRadius: "var(--radius-lg)",
              padding: "1.75rem",
              boxShadow: "var(--ombre-xs)",
              overflowX: "auto",
            }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>
              {"Tableau comparatif"}
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--bordure)" }}>
                  {["Commune", "Dép. fonctionnement", "Investissements", "Dép./habitant", "Dette/habitant"].map((col) => (
                    <th
                      key={col}
                      style={{
                        textAlign: col === "Commune" ? "left" : "right",
                        padding: ".625rem .75rem",
                        color: "var(--texte-secondaire)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {communes.map((c, i) => (
                  <tr key={c.codeInsee} style={{ borderBottom: "1px solid var(--bordure)" }}>
                    <td style={{ padding: ".75rem", fontWeight: 600 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: COULEURS[i],
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        {c.nom}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", padding: ".75rem" }}>
                      {c.depenses_fonctionnement.toLocaleString("fr-FR") + " k€"}
                    </td>
                    <td style={{ textAlign: "right", padding: ".75rem" }}>
                      {c.depenses_investissement.toLocaleString("fr-FR") + " k€"}
                    </td>
                    <td style={{ textAlign: "right", padding: ".75rem", fontWeight: 600, color: "var(--bleu-marine)" }}>
                      {c.depenses_par_habitant.toLocaleString("fr-FR") + " €"}
                    </td>
                    <td style={{ textAlign: "right", padding: ".75rem", fontWeight: 600, color: "var(--rouge-accent)" }}>
                      {c.dette_par_habitant.toLocaleString("fr-FR") + " €"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: ".75rem", color: "var(--texte-tertiaire)", marginTop: "1rem", textAlign: "right" }}>
              {"Source : OFGL — données DGFiP 2024"}
            </p>
          </div>
        </div>
      )}

      {communes.length === 1 && (
        <p style={{ color: "var(--texte-secondaire)", fontSize: ".9rem", textAlign: "center", padding: "2rem" }}>
          {"Ajoutez au moins une deuxième commune pour voir la comparaison."}
        </p>
      )}
    </div>
  );
}
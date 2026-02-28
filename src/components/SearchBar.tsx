"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { rechercherCommunes, rechercherCommunesParCodePostal, type CommuneGeo } from "@/lib/api";

interface Props {
  size?: "hero" | "normal";
  placeholder?: string;
}

export default function SearchBar({ size = "normal", placeholder = "Rechercher une commune…" }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CommuneGeo[]>([]);
  const [loading, setLoading] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const router = useRouter();
  const refContainer = useRef<HTMLDivElement>(null);

  // Ferme les suggestions si on clique ailleurs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (refContainer.current && !refContainer.current.contains(e.target as Node)) {
        setOuvert(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Recherche avec délai pour ne pas surcharger l'API
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); setOuvert(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const estCodePostal = /^\d{4,5}$/.test(query.trim());
        const res = estCodePostal
          ? await rechercherCommunesParCodePostal(query.trim())
          : await rechercherCommunes(query);
        setSuggestions(res);
        setOuvert(res.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const allerVersCommune = (commune: CommuneGeo) => {
    setQuery(commune.nom);
    setOuvert(false);
    setSuggestions([]);
    router.push(`/communes/${commune.code}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      allerVersCommune(suggestions[0]);
    }
    if (e.key === "Escape") {
      setOuvert(false);
    }
  };

  const isHero = size === "hero";

  return (
    <div ref={refContainer} style={{ position: "relative", width: "100%" }}>

      {/* Champ de saisie */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: isHero ? "1.125rem" : ".875rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: isHero ? "rgba(255,255,255,.5)" : "var(--texte-tertiaire)",
          }}
        >
          {loading ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOuvert(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: "100%",
            padding: isHero ? "1rem 1rem 1rem 3rem" : ".75rem .75rem .75rem 2.5rem",
            fontSize: isHero ? "1.0625rem" : ".9375rem",
            border: isHero ? "none" : "1.5px solid var(--bordure)",
            borderRadius: "var(--radius-md)",
            outline: "none",
            background: isHero ? "rgba(255,255,255,.95)" : "white",
            boxShadow: isHero ? "0 4px 24px rgba(0,0,0,.15)" : "none",
            boxSizing: "border-box",
            color: "var(--texte-primaire)",
          }}
        />

        {query.length > 0 && (
          <button
            onClick={() => { setQuery(""); setSuggestions([]); setOuvert(false); }}
            style={{
              position: "absolute",
              right: ".75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--texte-tertiaire)",
              fontSize: "1.25rem",
              lineHeight: 1,
              padding: ".25rem",
            }}
          >
            {"×"}
          </button>
        )}
      </div>

      {/* Liste de suggestions */}
      {ouvert && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + .375rem)",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid var(--bordure)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 8px 32px rgba(0,0,0,.12)",
            zIndex: 100,
            listStyle: "none",
            margin: 0,
            padding: ".375rem 0",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((s) => (
            <li
              key={s.code}
              onClick={() => allerVersCommune(s)}
              style={{
                padding: ".625rem 1rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--bleu-pale)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--texte-primaire)" }}>
                  {s.nom}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: ".75rem",
                    color: "var(--texte-tertiaire)",
                    background: "var(--bleu-pale)",
                    border: "1px solid var(--bordure)",
                    borderRadius: "4px",
                    padding: ".125rem .375rem",
                    fontWeight: 500,
                  }}
                >
                  {"Dép. " + s.codeDepartement}
                </span>
                <span style={{ fontSize: ".8rem", color: "var(--texte-tertiaire)" }}>
                  {s.population?.toLocaleString("fr-FR") + " hab."}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
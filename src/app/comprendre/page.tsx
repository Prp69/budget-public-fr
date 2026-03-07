"use client";

// src/components/CommunesClient.tsx
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { rechercherCommunes, rechercherCommunesParCodePostal, type CommuneGeo } from "@/lib/api";

const COMMUNES_VEDETTES = [
  { nom: "Paris",     code: "75056", dep: "75", pop: "2 133 111" },
  { nom: "Marseille", code: "13055", dep: "13", pop: "861 635"   },
  { nom: "Lyon",      code: "69123", dep: "69", pop: "513 275"   },
  { nom: "Toulouse",  code: "31555", dep: "31", pop: "471 941"   },
  { nom: "Nice",      code: "06088", dep: "06", pop: "342 522"   },
  { nom: "Nantes",    code: "44109", dep: "44", pop: "320 732"   },
  { nom: "Bordeaux",  code: "33063", dep: "33", pop: "254 436"   },
  { nom: "Strasbourg",code: "67482", dep: "67", pop: "284 677"   },
];

export default function CommunesClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [resultats, setResultats] = useState<CommuneGeo[]>([]);
  const [loading, setLoading] = useState(false);
  const [rechercheLancee, setRechercheLancee] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResultats([]); setRechercheLancee(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      setRechercheLancee(true);
      try {
        const estCodePostal = /^\d{4,5}$/.test(query.trim());
        const res = estCodePostal
          ? await rechercherCommunesParCodePostal(query.trim())
          : await rechercherCommunes(query);
        setResultats(res);
      } catch {
        setResultats([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const allerVers = (code: string) => router.push("/communes/" + code);

  const styleCard: React.CSSProperties = {
    background: "var(--blanc)",
    border: "1px solid var(--bordure)",
    borderRadius: "var(--radius-lg)",
    padding: "1.25rem 1.5rem",
    cursor: "pointer",
    transition: "all 200ms ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
          padding: "4rem 0 3.5rem",
        }}>
          <div className="container">
            <h1 style={{
              color: "white",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800,
              marginBottom: ".75rem",
            }}>
              {"Toutes les communes"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1.0625rem", marginBottom: "2rem", maxWidth: 520 }}>
              {"Recherchez parmi les 34 900 communes françaises et accédez à leurs données financières officielles."}
            </p>

            {/* Barre de recherche */}
            <div style={{ maxWidth: 600, position: "relative" }}>
              <div style={{
                position: "absolute", left: "1rem", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none",
                color: "rgba(255,255,255,.5)",
              }}>
                {loading ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                )}
              </div>
              <input
                ref={refInput}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && resultats.length > 0) allerVers(resultats[0].code); }}
                placeholder={"Nom de commune ou code postal..."}
                autoComplete="off"
                style={{
                  width: "100%",
                  padding: "1rem 1rem 1rem 3rem",
                  fontSize: "1.0625rem",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                  background: "rgba(255,255,255,.95)",
                  boxShadow: "0 4px 24px rgba(0,0,0,.2)",
                  boxSizing: "border-box",
                  color: "var(--texte-primaire)",
                }}
              />
              {query.length > 0 && (
                <button onClick={() => setQuery("")} style={{
                  position: "absolute", right: ".75rem", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: "1.25rem",
                  color: "var(--texte-tertiaire)", padding: ".25rem",
                }}>
                  {"×"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* RÉSULTATS DE RECHERCHE */}
        {rechercheLancee && (
          <section style={{ padding: "2.5rem 0" }}>
            <div className="container">
              <p style={{ color: "var(--texte-secondaire)", fontSize: ".875rem", marginBottom: "1.25rem" }}>
                {resultats.length > 0
                  ? resultats.length + " résultat" + (resultats.length > 1 ? "s" : "") + " pour \"" + query + "\""
                  : "Aucun résultat pour \"" + query + "\""}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
                {resultats.map((c) => (
                  <Link key={c.code} href={"/communes/" + c.code} style={styleCard}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bleu-moyen)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--ombre-sm)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bordure)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--texte-primaire)" }}>{c.nom}</div>
                      <div style={{ fontSize: ".8125rem", color: "var(--texte-tertiaire)", marginTop: ".2rem" }}>
                        {"Département " + c.codeDepartement}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                      <span style={{ fontSize: ".875rem", color: "var(--texte-secondaire)" }}>
                        {c.population?.toLocaleString("fr-FR") + " hab."}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bleu-moyen)" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COMMUNES VEDETTES */}
        {!rechercheLancee && (
          <section style={{ padding: "3.5rem 0" }}>
            <div className="container">
              <div className="divider" style={{ marginBottom: "1rem" }} />
              <h2 style={{ fontSize: "1.375rem", marginBottom: ".5rem" }}>{"Grandes villes"}</h2>
              <p style={{ color: "var(--texte-secondaire)", marginBottom: "2rem", fontSize: ".9375rem" }}>
                {"Accédez directement aux finances des principales métropoles françaises."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                {COMMUNES_VEDETTES.map((c) => (
                  <Link key={c.code} href={"/communes/" + c.code} style={styleCard}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bleu-moyen)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--ombre-sm)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--bordure)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--texte-primaire)" }}>{c.nom}</div>
                      <div style={{ fontSize: ".8125rem", color: "var(--texte-tertiaire)", marginTop: ".2rem" }}>
                        {"Dép. " + c.dep + " · " + c.pop + " hab."}
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bleu-moyen)" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Données OFGL / DGFiP — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}

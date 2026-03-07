"use client";

// src/components/HomeClient.tsx
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import StatCard from "@/components/StatCard";
import { ChiffresNationaux, formaterMontant } from "@/lib/api";

const IconDette = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconCommunes = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconDepenses = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

interface Props { chiffres: ChiffresNationaux | null; }

const RUBRIQUES = [
  {
    titre: "Communes",
    sous: "Finances locales",
    desc: "Dépenses, dette, recettes et élus de toutes les communes françaises.",
    href: "/communes",
    emoji: "🏘️",
    couleur: "#003189",
    gradient: "linear-gradient(135deg, #003189 0%, #1E4E8C 100%)",
    liens: [
      { label: "Rechercher une commune", href: "/communes" },
      { label: "Élections municipales 2026", href: "/elections" },
    ],
  },
  {
    titre: "État",
    sous: "Budget national",
    desc: "Budget par ministère, déficit public, dette de l'État et charge fiscale.",
    href: "/etat",
    emoji: "🏛️",
    couleur: "#1E4E8C",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #1E4E8C 100%)",
    liens: [
      { label: "Dépenses de l'État", href: "/etat" },
      { label: "Budget par ministère", href: "/etat/ministeres" },
    ],
  },
  {
    titre: "Impôts",
    sous: "Fiscalité française",
    desc: "À quoi servent vos impôts ? IR, TVA, IS, prélèvements obligatoires.",
    href: "/impots",
    emoji: "📋",
    couleur: "#C1292E",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #C1292E 100%)",
    liens: [
      { label: "Recettes fiscales de l'État", href: "/impots" },
      { label: "Impôt sur le revenu", href: "/impots/ir" },
    ],
  },
];

const LIENS_SECONDAIRES = [
  { href: "/comprendre", label: "Comprendre le budget", desc: "Guide pédagogique sans jargon", emoji: "📖" },
  { href: "/sources",    label: "Sources officielles",  desc: "DGFiP, OFGL, INSEE",          emoji: "📋" },
  { href: "/apropos",    label: "À propos",              desc: "Le projet en transparence",     emoji: "ℹ️" },
];

export default function HomeClient({ chiffres }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);

  const stats = chiffres ? [
    {
      label: "Communes couvertes",
      value: (chiffres.nb_communes ?? 34900).toLocaleString("fr-FR"),
      icon: <IconCommunes />,
      accentColor: "var(--bleu-moyen)",
      description: "sur 34 935 communes françaises",
      source: "geo.api.gouv.fr",
    },
    {
      label: "Dépenses communales 2023",
      value: formaterMontant(chiffres.total_depenses),
      icon: <IconDepenses />,
      accentColor: "var(--rouge-accent)",
      description: "total national (budgets principaux + annexes)",
      source: "OFGL / DGFiP",
    },
  ] : [];

  return (
    <>
      <Header />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
        padding: "5rem 0 4.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="container" style={{ position: "relative", maxWidth: 760, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: ".5rem",
            background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
            borderRadius: "99px", padding: ".375rem 1rem",
            marginBottom: "1.75rem", fontSize: ".8125rem",
            color: "rgba(255,255,255,.85)", fontWeight: 500,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
            {"Données officielles — DGFiP / OFGL / INSEE"}
          </div>
          <h1 style={{
            color: "white",
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800, lineHeight: 1.15,
            marginBottom: "1.25rem", letterSpacing: "-.03em",
          }}>
            {"Les finances publiques françaises,"}
            <br />{"sans détour"}
          </h1>
          <p style={{
            color: "rgba(255,255,255,.72)",
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
            lineHeight: 1.7, marginBottom: "2.5rem",
            maxWidth: 520, marginInline: "auto",
          }}>
            {"Communes, État, impôts : explorez l'utilisation de l'argent public. Données officielles, actualisées, librement accessibles."}
          </p>
          <div
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              maxWidth: 580, marginInline: "auto",
              transition: "transform 200ms ease",
              transform: searchFocused ? "scale(1.01)" : "scale(1)",
            }}
          >
            <SearchBar />
          </div>
          <p style={{ marginTop: "1rem", fontSize: ".8125rem", color: "rgba(255,255,255,.45)" }}>
            {"Rechercher une commune par nom ou code postal"}
          </p>
        </div>
      </section>

      {/* ── STATS NATIONALES ──────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section style={{ padding: "3rem 0", background: "var(--fond)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              {stats.map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon}
                  accentColor={s.accentColor} description={s.description} source={s.source} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3 RUBRIQUES PRINCIPALES ───────────────────────────────────────── */}
      <section style={{ padding: "4rem 0", background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)" }}>
        <div className="container">
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Explorer les finances publiques"}</h2>
            <p style={{ color: "var(--texte-secondaire)", fontSize: ".9375rem" }}>
              {"Trois niveaux d'analyse pour comprendre l'argent public en France."}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {RUBRIQUES.map((r) => (
              <div key={r.href} style={{
                background: "var(--blanc)",
                border: "1px solid var(--bordure)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--ombre-xs)",
              }}>
                {/* Bandeau couleur */}
                <div style={{ background: r.gradient, padding: "1.5rem 1.75rem" }}>
                  <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>{r.emoji}</div>
                  <div style={{ fontSize: ".75rem", fontWeight: 600, color: "rgba(255,255,255,.65)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".25rem" }}>
                    {r.sous}
                  </div>
                  <h3 style={{ color: "white", fontSize: "1.375rem", fontWeight: 800, marginBottom: ".5rem" }}>{r.titre}</h3>
                  <p style={{ color: "rgba(255,255,255,.72)", fontSize: ".875rem", lineHeight: 1.55 }}>{r.desc}</p>
                </div>
                {/* Liens */}
                <div style={{ padding: "1rem 1.25rem" }}>
                  {r.liens.map((lien) => (
                    <Link key={lien.href} href={lien.href} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: ".625rem .75rem",
                      borderRadius: "var(--radius-sm)",
                      textDecoration: "none",
                      color: "var(--texte-primaire)",
                      fontSize: ".875rem", fontWeight: 500,
                      transition: "background 150ms ease",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bleu-pale)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <span>{lien.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={r.couleur} strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  ))}
                  <Link href={r.href} style={{
                    display: "block", marginTop: ".5rem", padding: ".625rem .75rem",
                    background: r.couleur, color: "white",
                    borderRadius: "var(--radius-sm)", textDecoration: "none",
                    fontSize: ".875rem", fontWeight: 700, textAlign: "center",
                  }}>
                    {"Tout explorer →"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIENS SECONDAIRES ─────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>{"Ressources"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {LIENS_SECONDAIRES.map((lien) => (
              <Link key={lien.href} href={lien.href} style={{
                background: "var(--blanc)", border: "1px solid var(--bordure)",
                borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
                textDecoration: "none", color: "inherit", display: "block",
                transition: "all 200ms ease", boxShadow: "var(--ombre-xs)",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--bleu-moyen)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--bordure)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "1.375rem", marginBottom: ".625rem" }}>{lien.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: ".9375rem", color: "var(--texte-primaire)", marginBottom: ".25rem" }}>{lien.label}</div>
                <div style={{ fontSize: ".8125rem", color: "var(--texte-secondaire)" }}>{lien.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ÉLECTIONS ─────────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 4rem" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{
            background: "linear-gradient(135deg, var(--bleu-marine) 0%, #C1292E 100%)",
            borderRadius: "var(--radius-xl)", padding: "2.75rem 2.5rem",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,.06) 0%, transparent 60%)",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                background: "rgba(255,255,255,.15)", borderRadius: "99px",
                padding: ".3rem .875rem", marginBottom: "1.25rem",
                fontSize: ".8rem", color: "rgba(255,255,255,.9)", fontWeight: 600,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "white", display: "inline-block" }} />
                {"ÉLECTIONS MUNICIPALES — 15 MARS 2026"}
              </div>
              <h2 style={{ color: "white", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, marginBottom: ".75rem" }}>
                {"Votez en connaissance de cause"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.72)", marginBottom: "1.75rem", fontSize: ".9375rem", lineHeight: 1.65 }}>
                {"Consultez les comptes de votre commune avant d'aller aux urnes. Données factuelles, sans biais politique."}
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/communes" className="btn" style={{ background: "white", color: "var(--bleu-marine)", fontWeight: 700 }}>
                  {"Consulter ma commune →"}
                </Link>
                <Link href="/elections" className="btn" style={{ background: "rgba(255,255,255,.15)", color: "white", border: "1px solid rgba(255,255,255,.3)" }}>
                  {"Élections 2026"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{
        background: "var(--bleu-marine)", color: "rgba(255,255,255,.5)",
        padding: "2rem 0", fontSize: ".8125rem",
      }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>{"© 2026 Budget Public — Données OFGL / DGFiP / Direction du Budget — Licence Ouverte v2.0"}</div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link href="/sources"   style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>{"Sources"}</Link>
            <Link href="/apropos"   style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>{"À propos"}</Link>
            <Link href="/comprendre" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>{"Guide"}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
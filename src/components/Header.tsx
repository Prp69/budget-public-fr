"use client";

// src/components/Header.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  {
    label: "Communes",
    href: "/communes",
    children: [
      { label: "Rechercher une commune", href: "/communes" },
      { label: "Élections municipales 2026", href: "/elections" },
    ],
  },
  {
    label: "État",
    href: "/etat",
    children: [
      { label: "Dépenses de l'État", href: "/etat" },
      { label: "Budget par ministère", href: "/etat/ministeres" },
      { label: "Dette publique", href: "/etat/dette" },
    ],
  },
  {
    label: "Impôts",
    href: "/impots",
    children: [
      { label: "Vue d'ensemble", href: "/impots" },
      { label: "Impôt sur le revenu", href: "/impots/ir" },
      { label: "TVA", href: "/impots/tva" },
    ],
  },
  { label: "Comprendre", href: "/comprendre" },
  { label: "Sources", href: "/sources" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [sousmenuOuvert, setSousmenuOuvert] = useState<string | null>(null);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--blanc)",
      borderBottom: "1px solid var(--bordure)",
      boxShadow: "var(--ombre-xs)",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 60, gap: "1rem",
      }}>

        {/* Logo */}
        <Link href="/" style={{
          textDecoration: "none",
          display: "flex", alignItems: "center", gap: ".6rem",
          flexShrink: 0,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: ".875rem", fontWeight: 800,
          }}>
            {"B"}
          </div>
          <span style={{
            fontWeight: 800, fontSize: "1rem",
            color: "var(--bleu-marine)", letterSpacing: "-.02em",
          }}>
            {"Budget Public"}
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: "flex", alignItems: "center", gap: ".25rem" }}>
          {NAV.map((item) => {
            const actif = pathname === item.href || pathname.startsWith(item.href + "/");
            const hasSub = item.children && item.children.length > 0;

            return (
              <div
                key={item.href}
                style={{ position: "relative" }}
                onMouseEnter={() => hasSub && setSousmenuOuvert(item.href)}
                onMouseLeave={() => setSousmenuOuvert(null)}
              >
                <Link
                  href={item.href}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: ".25rem",
                    padding: ".375rem .75rem",
                    borderRadius: "var(--radius-sm)",
                    textDecoration: "none",
                    fontSize: ".875rem", fontWeight: actif ? 700 : 500,
                    color: actif ? "var(--bleu-marine)" : "var(--texte-secondaire)",
                    background: actif ? "var(--bleu-pale)" : "transparent",
                    transition: "all 150ms ease",
                  }}
                >
                  {item.label}
                  {hasSub && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  )}
                </Link>

                {/* Sous-menu */}
                {hasSub && sousmenuOuvert === item.href && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0,
                    background: "var(--blanc)",
                    border: "1px solid var(--bordure)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--ombre-md)",
                    minWidth: 220, zIndex: 200,
                    padding: ".375rem",
                  }}>
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          display: "block",
                          padding: ".5rem .875rem",
                          borderRadius: "var(--radius-sm)",
                          textDecoration: "none",
                          fontSize: ".875rem",
                          color: "var(--texte-primaire)",
                          fontWeight: pathname === child.href ? 600 : 400,
                          background: pathname === child.href ? "var(--bleu-pale)" : "transparent",
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Droite */}
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexShrink: 0 }}>
          <ThemeToggle />
          {/* Burger mobile */}
          <button
            onClick={() => setMenuOuvert(!menuOuvert)}
            style={{
              display: "none",
              background: "none", border: "none", cursor: "pointer",
              padding: ".375rem", color: "var(--texte-primaire)",
            }}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOuvert
                ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div style={{
          borderTop: "1px solid var(--bordure)",
          padding: "1rem",
          display: "flex", flexDirection: "column", gap: ".25rem",
        }}>
          {NAV.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMenuOuvert(false)}
                style={{
                  display: "block", padding: ".625rem .875rem",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  fontSize: ".9375rem", fontWeight: 600,
                  color: "var(--texte-primaire)",
                  background: pathname.startsWith(item.href) ? "var(--bleu-pale)" : "transparent",
                }}
              >
                {item.label}
              </Link>
              {item.children && (
                <div style={{ paddingLeft: "1rem" }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMenuOuvert(false)}
                      style={{
                        display: "block", padding: ".5rem .875rem",
                        borderRadius: "var(--radius-sm)",
                        textDecoration: "none",
                        fontSize: ".875rem", color: "var(--texte-secondaire)",
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
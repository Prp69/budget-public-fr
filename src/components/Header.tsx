"use client";
// src/components/Header.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    label: "Communes",
    href: "/communes",
    children: [
      { label: "Rechercher une commune",     href: "/communes" },
      { label: "Comprendre le budget",       href: "/comprendre" },
      { label: "Élections municipales 2026", href: "/elections" },
    ],
  },
  {
    label: "État",
    href: "/etat",
    children: [
      { label: "Vue d'ensemble",       href: "/etat" },
      { label: "Budget par ministère", href: "/etat/ministeres" },
      { label: "Dette publique",       href: "/etat/dette" },
    ],
  },
  {
    label: "Impôts",
    href: "/impots",
    children: [
      { label: "Vue d'ensemble",      href: "/impots" },
      { label: "Impôt sur le revenu", href: "/impots/ir" },
      { label: "TVA",                 href: "/impots/tva" },
    ],
  },
  { label: "Sources", href: "/sources" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen]     = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(250,250,247,.97)" : "var(--creme)",
      borderBottom: scrolled ? "1px solid var(--bordure)" : "1px solid transparent",
      backdropFilter: "blur(12px)",
      transition: "background 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
      boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,.06)" : "none",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: ".75rem", flexShrink: 0 }}>
          <div style={{ display: "flex", height: 26, borderRadius: 4, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.15)" }}>
            <div style={{ width: 7, background: "#2B4C8C" }} />
            <div style={{ width: 7, background: "#FAFAF7" }} />
            <div style={{ width: 7, background: "#C0392B" }} />
          </div>
          <span style={{
            fontFamily: "var(--serif)",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "var(--encre)",
            letterSpacing: "-.02em",
          }}>
            {"Budget"}<span style={{ color: "var(--bleu)" }}>{"Public"}</span>
          </span>
        </Link>

        {/* ── Nav desktop ── */}
        <nav style={{ display: "flex", alignItems: "center" }} className="desktop-nav">
          {NAV.map((item) => {
            const actif = pathname === item.href || pathname.startsWith(item.href + "/");
            const hasSub = !!item.children;
            return (
              <div
                key={item.href}
                style={{ position: "relative" }}
                onMouseEnter={() => hasSub && setOpen(item.href)}
                onMouseLeave={() => setOpen(null)}
              >
                <Link href={item.href} style={{
                  display: "inline-flex", alignItems: "center", gap: ".3rem",
                  padding: ".5rem .875rem",
                  fontFamily: "var(--sans)",
                  fontSize: ".875rem",
                  fontWeight: actif ? 600 : 400,
                  color: actif ? "var(--bleu)" : "var(--gris-1)",
                  textDecoration: "none",
                  borderRadius: "var(--radius-sm)",
                  transition: "color 150ms ease",
                  borderBottom: actif ? "2px solid var(--rouge)" : "2px solid transparent",
                  paddingBottom: "calc(.5rem - 2px)",
                }}>
                  {item.label}
                  {hasSub && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </Link>

                {/* Pont invisible */}
                {hasSub && open === item.href && (
                  <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", height: 12, zIndex: 199 }} />
                )}

                {/* Dropdown */}
                {hasSub && open === item.href && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--blanc)",
                    border: "1px solid var(--bordure)",
                    borderTop: "3px solid var(--rouge)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "0 12px 36px rgba(0,0,0,.12)",
                    minWidth: 230, zIndex: 200,
                    padding: ".5rem",
                    animation: "fadeUp .15s ease both",
                  }}>
                    {item.children!.map((child) => {
                      const childActif = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(null)}
                          style={{
                            display: "flex", alignItems: "center", gap: ".625rem",
                            padding: ".625rem .875rem",
                            borderRadius: "var(--radius-sm)",
                            textDecoration: "none",
                            fontFamily: "var(--sans)",
                            fontSize: ".875rem",
                            color: childActif ? "var(--bleu)" : "var(--encre)",
                            fontWeight: childActif ? 600 : 400,
                            background: childActif ? "var(--bleu-pale)" : "transparent",
                            transition: "background 100ms ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!childActif) (e.currentTarget as HTMLElement).style.background = "var(--creme-fonce)";
                          }}
                          onMouseLeave={(e) => {
                            if (!childActif) (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          {childActif && (
                            <span style={{ width: 3, height: 14, borderRadius: 2, background: "var(--rouge)", flexShrink: 0 }} />
                          )}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── CTA + Burger ── */}
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexShrink: 0 }}>
          <Link href="/communes" className="btn btn-primaire" style={{ fontSize: ".8125rem", padding: ".5rem 1.125rem" }}>
            {"Rechercher →"}
          </Link>
          <button
            onClick={() => setMobile(!mobile)}
            aria-label="Menu"
            className="burger"
            style={{ background: "none", border: "none", cursor: "pointer", padding: ".375rem", color: "var(--encre)", display: "none" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              {mobile
                ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>
                : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobile && (
        <div style={{ borderTop: "3px solid var(--rouge)", background: "var(--blanc)", padding: "1rem 1.25rem 1.5rem" }}>
          {NAV.map((item) => (
            <div key={item.href} style={{ marginBottom: ".125rem" }}>
              <Link href={item.href} onClick={() => setMobile(false)} style={{
                display: "block", padding: ".75rem .5rem",
                fontFamily: "var(--sans)", fontWeight: 600, fontSize: ".9375rem",
                color: "var(--encre)", textDecoration: "none",
                borderBottom: "1px solid var(--gris-5)",
              }}>
                {item.label}
              </Link>
              {item.children && (
                <div style={{ paddingLeft: "1rem", paddingTop: ".25rem" }}>
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setMobile(false)} style={{
                      display: "block", padding: ".5rem .5rem",
                      fontFamily: "var(--sans)", fontSize: ".875rem",
                      color: "var(--gris-1)", textDecoration: "none",
                    }}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .burger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
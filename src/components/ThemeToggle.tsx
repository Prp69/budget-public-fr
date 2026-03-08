"use client";
// src/components/ThemeToggle.tsx
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove("dark", "light");
  if (theme === "dark")   html.classList.add("dark");
  if (theme === "light")  html.classList.add("light");
  // "system" = aucune classe, la media query gère automatiquement
  try { localStorage.setItem("bp-theme", theme); } catch {}
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("bp-theme") as Theme) || "system";
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  const cycle = () => {
    // Cycle : system → light → dark → system
    const isDark = theme === "dark" || (theme === "system" && getSystemDark());
    const next: Theme = !isDark ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  const effectiveDark = theme === "dark" || (theme === "system" && getSystemDark());

  return (
    <button
      onClick={cycle}
      aria-label={effectiveDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={effectiveDark ? "Mode clair" : "Mode sombre"}
      style={{
        background: "none",
        border: "1.5px solid var(--bordure)",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        padding: ".4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--encre)",
        transition: "background 150ms ease, border-color 150ms ease",
        flexShrink: 0,
        width: 36,
        height: 36,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--creme-fonce)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gris-3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--bordure)";
      }}
    >
      {effectiveDark ? (
        /* Icône soleil */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
          <line x1="2" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        /* Icône lune */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Détecte la préférence système
  const getSystemDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  useEffect(() => {
    setMounted(true);
    // Recharge le thème sauvegardé
    const saved = localStorage.getItem("budget-theme") as Theme | null;
    const initial = saved ?? "system";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Écoute les changements de préférence système
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        setIsDark(mq.matches);
        document.documentElement.removeAttribute("data-theme");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.setAttribute("data-theme", "dark");
      setIsDark(true);
    } else if (t === "light") {
      root.setAttribute("data-theme", "light");
      setIsDark(false);
    } else {
      root.removeAttribute("data-theme");
      setIsDark(getSystemDark());
    }
  };

  const cycleTheme = () => {
    // Cycle : system → light → dark → system
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("budget-theme", next);
  };

  if (!mounted) return null;

  const label =
    theme === "system" ? "Thème système" :
    theme === "light"  ? "Mode clair"    : "Mode sombre";

  return (
    <button
      onClick={cycleTheme}
      title={label}
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".375rem",
        background: "rgba(255,255,255,.1)",
        border: "1px solid rgba(255,255,255,.2)",
        borderRadius: "99px",
        padding: ".375rem .75rem",
        cursor: "pointer",
        color: "rgba(255,255,255,.85)",
        fontSize: ".8125rem",
        fontWeight: 500,
        transition: "background .2s ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.18)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)")
      }
    >
      {theme === "system" ? (
        // Icône moniteur (système)
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8M12 17v4"/>
        </svg>
      ) : theme === "light" ? (
        // Icône soleil (clair)
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        // Icône lune (sombre)
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}
'use client';

/**
 * Header.tsx — Composant d'en-tête réutilisable de Budget Public
 * Sticky, responsive, avec logo textuel et navigation minimaliste.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  // Ombre sur le header dès que l'utilisateur scroll
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--blanc)',
        borderBottom: `1px solid ${isScrolled ? 'var(--bordure)' : 'transparent'}`,
        boxShadow: isScrolled ? 'var(--ombre-sm)' : 'none',
        transition: 'box-shadow 200ms, border-color 200ms',
      }}
    >
      {/* Bandeau officiel haut de page */}
      <div
        style={{
          background: 'var(--bleu-marine)',
          color: 'var(--blanc)',
          fontSize: '.75rem',
          padding: '.35rem 0',
          letterSpacing: '.01em',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          {/* Icône drapeau tricolore */}
          <span style={{ display: 'flex', gap: '2px' }}>
            <span style={{ width: 12, height: 12, background: '#002395', borderRadius: '1px', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, background: '#fff', borderRadius: '1px', display: 'inline-block' }} />
            <span style={{ width: 12, height: 12, background: '#ED2939', borderRadius: '1px', display: 'inline-block' }} />
          </span>
          <span style={{ opacity: .85 }}>
            Site d'information civique — Données issues de sources officielles (DGFiP, INSEE)
          </span>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="container">
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '.75rem', textDecoration: 'none' }}>
            {/* Icône carrée stylisée */}
            <div
              style={{
                width: 38,
                height: 38,
                background: 'var(--bleu-marine)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {/* Pictogramme simple : graphe à barres */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="10" width="4" height="8" rx="1" fill="white" opacity=".8"/>
                <rect x="8" y="6"  width="4" height="12" rx="1" fill="white"/>
                <rect x="14" y="2" width="4" height="16" rx="1" fill="white" opacity=".6"/>
              </svg>
            </div>

            {/* Texte logo */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--bleu-marine)', lineHeight: 1.1, letterSpacing: '-.02em' }}>
                Budget Public
              </div>
              <div style={{ fontSize: '.6875rem', color: 'var(--texte-secondaire)', lineHeight: 1.2, fontWeight: 400 }}>
                Finances des communes françaises
              </div>
            </div>
          </Link>

          {/* Liens de navigation — desktop */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}
            className="nav-links-desktop"
          >
            <Link href="/communes" style={navLinkStyle}>Communes</Link>
            <Link href="/comprendre" style={navLinkStyle}>Comprendre le budget</Link>
            <Link href="/sources" style={navLinkStyle}>Sources officielles</Link>
            <Link href="/elections" className="btn btn-primary" style={{ fontSize: '.875rem', padding: '.5rem 1.125rem' }}>
              Élections 15 mars →
            </Link>
          </div>

          {/* Bouton hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '.5rem',
              color: 'var(--bleu-marine)',
            }}
            className="nav-hamburger"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l14 14M18 4L4 18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h16M3 11h16M3 16h16"/>
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div
          style={{
            background: 'var(--blanc)',
            borderTop: '1px solid var(--bordure)',
            padding: '1rem 0 1.5rem',
          }}
          className="nav-mobile-menu"
        >
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            {[
              { href: '/communes', label: 'Communes' },
              { href: '/comprendre', label: 'Comprendre le budget' },
              { href: '/sources', label: 'Sources officielles' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ padding: '.75rem .5rem', color: 'var(--texte-primaire)', fontWeight: 500, borderBottom: '1px solid var(--bordure)' }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link href="/elections" className="btn btn-primary" style={{ marginTop: '.75rem', justifyContent: 'center' }}>
              Élections 15 mars →
            </Link>
          </div>
        </div>
      )}

      {/* Styles responsive via balise style inline */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

/* Style partagé pour les liens de nav */
const navLinkStyle: React.CSSProperties = {
  fontSize: '.9rem',
  fontWeight: 500,
  color: 'var(--texte-secondaire)',
  textDecoration: 'none',
  transition: 'color var(--transition)',
  paddingBottom: '2px',
  borderBottom: '2px solid transparent',
};

/**
 * StatCard.tsx — Carte de statistique réutilisable.
 * Affiche : icône, valeur principale, label, variation optionnelle, source.
 */

import React from 'react';

export interface StatCardProps {
  /** Icône SVG (composant React ou chaîne emoji) */
  icon: React.ReactNode;
  /** Valeur mise en avant (ex: "3 128 Md€") */
  value: string;
  /** Intitulé de la statistique */
  label: string;
  /** Description courte sous le label */
  description?: string;
  /** Variation par rapport à l'année précédente (ex: "+2.3%") */
  variation?: string;
  /** Direction de la variation : 'up' = hausse, 'down' = baisse, 'neutral' */
  variationDirection?: 'up' | 'down' | 'neutral';
  /** Source officielle */
  source?: string;
  /** Couleur d'accent de l'icône */
  accentColor?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  description,
  variation,
  variationDirection = 'neutral',
  source,
  accentColor = 'var(--bleu-moyen)',
}: StatCardProps) {
  /* Couleur et icône de variation */
  const variationConfig = {
    up:      { color: '#DC2626', bg: '#FEF2F2', arrow: '↑' },
    down:    { color: '#059669', bg: '#ECFDF5', arrow: '↓' },
    neutral: { color: 'var(--texte-tertiaire)', bg: 'var(--fond)', arrow: '→' },
  }[variationDirection];

  return (
    <article
      style={{
        background: 'var(--blanc)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--bordure)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--ombre-sm)',
        transition: 'transform 200ms, box-shadow 200ms',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ombre-md)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ombre-sm)';
      }}
    >
      {/* Décoration de fond */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -24,
          right: -24,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: accentColor,
          opacity: .05,
          pointerEvents: 'none',
        }}
      />

      {/* En-tête : icône + variation */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Icône dans un cadre coloré */}
        <div
          style={{
            width: 44,
            height: 44,
            background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Badge de variation */}
        {variation && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.25rem',
              padding: '.25rem .625rem',
              borderRadius: '99px',
              fontSize: '.75rem',
              fontWeight: 600,
              background: variationConfig.bg,
              color: variationConfig.color,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {variationConfig.arrow} {variation}
          </span>
        )}
      </div>

      {/* Corps : valeur + label */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: 'var(--texte-primaire)',
            lineHeight: 1.1,
            letterSpacing: '-.03em',
            fontFamily: 'var(--font-mono)',
            marginBottom: '.375rem',
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontSize: '.9375rem',
            fontWeight: 600,
            color: 'var(--texte-primaire)',
            marginBottom: description ? '.25rem' : 0,
          }}
        >
          {label}
        </div>

        {description && (
          <div style={{ fontSize: '.8125rem', color: 'var(--texte-secondaire)', lineHeight: 1.5 }}>
            {description}
          </div>
        )}
      </div>

      {/* Source officielle */}
      {source && (
        <div
          style={{
            paddingTop: '.875rem',
            borderTop: '1px solid var(--bordure)',
            fontSize: '.75rem',
            color: 'var(--texte-tertiaire)',
            display: 'flex',
            alignItems: 'center',
            gap: '.375rem',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          Source : {source}
        </div>
      )}
    </article>
  );
}

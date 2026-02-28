"use client";

import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import StatCard from '@/components/StatCard';
import { ChiffresNationaux, formaterMontant } from '@/lib/api';

const IconDette = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IconFonctionnement = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M8 12v4"/>
  </svg>
);
const IconInvestissement = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IconHabitant = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

function buildChiffresCles(data: ChiffresNationaux) {
  return [
    {
      icon: <IconDette />,
      value: `${data.dette_totale_communes} Md€`,
      label: 'Dette des communes',
      description: 'Encours de dette total des communes françaises',
      variation: undefined,
      source: `OFGL, données DGFiP ${data.annee}`,
      accentColor: 'var(--rouge-accent)',
    },
    {
      icon: <IconFonctionnement />,
      value: formaterMontant(data.depenses_totales_communes * 1_000_000),
      label: 'Dépenses totales communes',
      description: 'Fonctionnement + investissement de toutes les communes',
      variation: undefined,
      source: `OFGL, données DGFiP ${data.annee}`,
      accentColor: 'var(--bleu-moyen)',
    },
    {
      icon: <IconInvestissement />,
      value: `${data.investissements_communes} Md€`,
      label: 'Investissements des communes',
      description: "Dépenses d'équipement : écoles, voirie, sports, culture…",
      variation: undefined,
      source: `OFGL, données DGFiP ${data.annee}`,
      accentColor: '#0891B2',
    },
    {
      icon: <IconHabitant />,
      value: `${data.depenses_par_habitant_moyen.toLocaleString('fr-FR')} €`,
      label: 'Dépenses par habitant',
      description: 'Moyenne nationale toutes communes confondues',
      variation: undefined,
      source: `OFGL / INSEE ${data.annee}`,
      accentColor: '#7C3AED',
    },
  ];
}

const RAISONS = [
  {
    emoji: '📊',
    titre: 'Données officielles uniquement',
    texte:
      "Toutes les informations proviennent de sources gouvernementales vérifiées : DGFiP, INSEE, data.gouv.fr. Aucune interprétation politique, seulement des chiffres bruts.",
  },
  {
    emoji: '🔎',
    titre: 'Accessible à tous',
    texte:
      "Nous traduisons les comptes administratifs en visualisations claires et compréhensibles, sans jargon comptable. Le citoyen lambda peut comprendre comment est géré l'argent public.",
  },
  {
    emoji: '⚖️',
    titre: 'Neutralité absolue',
    texte:
      "Budget Public est apartisane et non commerciale. Nous présentons les faits sans commentaires ni jugements de valeur sur les choix politiques des élus.",
  },
  {
    emoji: '🗺️',
    titre: 'Toutes les communes',
    texte:
      "De Paris aux plus petits villages, les 34 900+ communes françaises seront couvertes. Chaque habitant doit pouvoir accéder aux comptes de sa commune.",
  },
];

const FOOTER_EXPLORER = [
  { href: '/communes', label: 'Toutes les communes' },
  { href: '/national', label: 'Budget national' },
  { href: '/comprendre', label: 'Guide du budget' },
  { href: '/elections', label: 'Élections 2026' },
];

const FOOTER_LEGAL = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/cgu', label: 'CGU' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
  { href: '/accessibilite', label: 'Accessibilité' },
  { href: '/sources', label: 'Sources & méthodologie' },
];

const SOURCES = [
  { nom: 'DGFiP', url: 'https://www.impots.gouv.fr', desc: 'Direction Générale des Finances Publiques' },
  { nom: 'INSEE', url: 'https://www.insee.fr', desc: 'Institut National de la Statistique' },
  { nom: 'data.gouv.fr', url: 'https://data.gouv.fr', desc: 'Plateforme des données ouvertes' },
  { nom: 'geo.api.gouv.fr', url: 'https://geo.api.gouv.fr', desc: 'API Géo officielle' },
];

const VILLES_RAPIDES = ['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Nantes'];

export default function HomeClient({
  chiffresNationaux,
}: {
  chiffresNationaux: ChiffresNationaux;
}) {
  const CHIFFRES_CLES = buildChiffresCles(chiffresNationaux);
  return (
    <>
      <Header />

      <main>
        {/* ====================================================
            SECTION 1 — HERO
            ==================================================== */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 60%, #2563EB 100%)',
            padding: '5rem 0 4.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(255,255,255,.07) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div className="container" style={{ position: 'relative' }}>
            <div
              className="animate-fade-in-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '.5rem',
                background: 'rgba(255,255,255,.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.2)',
                borderRadius: '99px',
                padding: '.375rem 1rem',
                marginBottom: '1.75rem',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4ADE80',
                  display: 'inline-block',
                  animation: 'pulse-soft 2s infinite',
                }}
              />
              <span style={{ fontSize: '.8125rem', color: 'rgba(255,255,255,.9)', fontWeight: 500 }}>
                Élections municipales — 15 mars 2026
              </span>
            </div>

            <h1
              className="animate-fade-in-up delay-1"
              style={{
                color: 'var(--blanc)',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 800,
                maxWidth: '700px',
                marginBottom: '1.25rem',
                lineHeight: 1.15,
              }}
            >
              Les dépenses publiques françaises<br />
              <span style={{ color: 'rgba(255,255,255,.7)', fontWeight: 400 }}>en données officielles</span>
            </h1>

            <p
              className="animate-fade-in-up delay-2"
              style={{
                color: 'rgba(255,255,255,.75)',
                fontSize: '1.125rem',
                maxWidth: '560px',
                marginBottom: '2.5rem',
                lineHeight: 1.65,
              }}
            >
              Comprenez comment votre commune gère l&apos;argent public.
              Consultez les comptes officiels — sans filtre politique, sans jargon.
            </p>

            <div className="animate-fade-in-up delay-3" style={{ maxWidth: '600px', marginBottom: '1.25rem' }}>
              <SearchBar size="hero" placeholder="Entrez le nom de votre commune…" />
            </div>

            <div className="animate-fade-in-up delay-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              <span style={{ fontSize: '.8125rem', color: 'rgba(255,255,255,.6)', marginRight: '.25rem', lineHeight: 2 }}>
                Communes populaires :
              </span>
              {VILLES_RAPIDES.map((ville) => (
                <a
                  key={ville}
                  href={`/communes?q=${ville}`}
                  style={{
                    fontSize: '.8125rem',
                    color: 'rgba(255,255,255,.85)',
                    background: 'rgba(255,255,255,.1)',
                    border: '1px solid rgba(255,255,255,.2)',
                    borderRadius: '99px',
                    padding: '.25rem .75rem',
                    transition: 'background var(--transition)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.background = 'rgba(255,255,255,.2)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.background = 'rgba(255,255,255,.1)')}
                >
                  {ville}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 2 — CHIFFRES CLÉS NATIONAUX
            ==================================================== */}
        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div style={{ marginBottom: '3rem' }}>
              <div className="divider" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '.75rem' }}>
                Chiffres clés nationaux
              </h2>
              <p style={{ color: 'var(--texte-secondaire)', maxWidth: '540px', fontSize: '1rem' }}>
                Un panorama des finances publiques françaises au niveau national, mis à jour chaque année à partir des données officielles.
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  marginTop: '1rem',
                  background: 'rgba(193,41,46,.08)',
                  border: '1px solid rgba(193,41,46,.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '.375rem .75rem',
                  fontSize: '.8rem',
                  color: 'var(--rouge-accent)',
                  fontWeight: 500,
                }}
              >
                ✓ Données officielles OFGL — dernière année disponible
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {CHIFFRES_CLES.map((chiffre, i) => (
                <StatCard key={i} {...chiffre} />
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a
                href="/national"
                style={{
                  fontSize: '.9rem',
                  color: 'var(--bleu-moyen)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.375rem',
                }}
              >
                Voir l&apos;ensemble des indicateurs nationaux
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 3 — POURQUOI CE SITE ?
            ==================================================== */}
        <section
          style={{
            background: 'var(--bleu-pale)',
            padding: '5rem 0',
            borderTop: '1px solid var(--bordure)',
            borderBottom: '1px solid var(--bordure)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '3rem',
                alignItems: 'start',
              }}
            >
              <div style={{ gridColumn: 'span 1' }}>
                <div className="divider" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1.25rem' }}>
                  Pourquoi ce site ?
                </h2>
                <p style={{ color: 'var(--texte-secondaire)', lineHeight: 1.8, marginBottom: '1rem' }}>
                  En France, les comptes des communes sont publics — mais inaccessibles en pratique.
                  Éparpillés sur des portails techniques, écrits dans un jargon comptable, ils restent
                  invisibles pour la grande majorité des citoyens.
                </p>
                <p style={{ color: 'var(--texte-secondaire)', lineHeight: 1.8, marginBottom: '1.75rem' }}>
                  <strong style={{ color: 'var(--texte-primaire)' }}>Budget Public</strong> a pour seule ambition
                  de rendre ces données lisibles et comparables, à quelques semaines des élections municipales.
                </p>
                <a href="/apropos" className="btn btn-outline">
                  Notre démarche →
                </a>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  gridColumn: 'span 2',
                }}
              >
                {RAISONS.map((raison, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--blanc)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      border: '1px solid var(--bordure)',
                      boxShadow: 'var(--ombre-xs)',
                    }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '.875rem' }}>{raison.emoji}</div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '.625rem', color: 'var(--texte-primaire)' }}>
                      {raison.titre}
                    </h3>
                    <p style={{ fontSize: '.875rem', color: 'var(--texte-secondaire)', lineHeight: 1.65 }}>
                      {raison.texte}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 4 — CTA ÉLECTIONS MUNICIPALES
            ==================================================== */}
        <section style={{ padding: '5rem 0' }}>
          <div className="container">
            <div
              style={{
                background: 'linear-gradient(135deg, var(--bleu-marine) 0%, var(--bleu-moyen) 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '-40px',
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,.04)',
                  pointerEvents: 'none',
                }}
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '10%',
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(193,41,46,.15)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  background: 'var(--rouge-accent)',
                  borderRadius: '99px',
                  padding: '.375rem 1rem',
                  marginBottom: '1.75rem',
                  fontSize: '.8125rem',
                  color: 'white',
                  fontWeight: 600,
                  letterSpacing: '.02em',
                }}
              >
                📅 ÉLECTIONS MUNICIPALES — 15 MARS 2026
              </div>

              <h2
                style={{
                  color: 'white',
                  fontSize: 'clamp(1.625rem, 4vw, 2.5rem)',
                  marginBottom: '1.25rem',
                  maxWidth: '600px',
                  marginInline: 'auto',
                }}
              >
                Avant de voter, consultez les comptes de votre commune
              </h2>

              <p
                style={{
                  color: 'rgba(255,255,255,.75)',
                  fontSize: '1rem',
                  maxWidth: '520px',
                  marginInline: 'auto',
                  marginBottom: '2.5rem',
                  lineHeight: 1.7,
                }}
              >
                Investissements, dette, évolution des dépenses… Comparez les communes candidates
                et accédez aux données officielles sans intermédiaire.
              </p>

              <div style={{ maxWidth: '520px', marginInline: 'auto' }}>
                <SearchBar size="hero" placeholder="Rechercher votre commune…" />
              </div>

              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.75rem', marginTop: '1rem' }}>
                Données issues de la DGFiP et de l&apos;INSEE — Accès libre et gratuit
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 5 — BANDE SOURCES OFFICIELLES
            ==================================================== */}
        <section
          style={{
            borderTop: '1px solid var(--bordure)',
            padding: '2.5rem 0',
            background: 'var(--blanc)',
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <p
                style={{
                  fontSize: '.875rem',
                  color: 'var(--texte-tertiaire)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Données issues de sources officielles
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem 3.5rem',
              }}
            >
              {SOURCES.map((s) => (
                <a
                  key={s.nom}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.desc}
                  style={{
                    fontSize: '.9375rem',
                    fontWeight: 600,
                    color: 'var(--texte-secondaire)',
                    transition: 'color var(--transition)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--bleu-marine)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--texte-secondaire)')}
                >
                  {s.nom}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================
          FOOTER
          ====================================================== */}
      <footer
        style={{
          background: 'var(--bleu-marine)',
          color: 'rgba(255,255,255,.75)',
          padding: '3rem 0 2rem',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Colonne Marque */}
            <div>
              <div
                style={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  marginBottom: '.625rem',
                  letterSpacing: '-.02em',
                }}
              >
                Budget Public
              </div>
              <p style={{ fontSize: '.875rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                Site d&apos;information civique non partisan sur les finances des communes françaises.
              </p>
              <div style={{ display: 'flex', gap: '2px' }}>
                <div style={{ width: 16, height: 16, background: '#002395', borderRadius: '2px' }} />
                <div style={{ width: 16, height: 16, background: '#fff' }} />
                <div style={{ width: 16, height: 16, background: '#ED2939', borderRadius: '2px' }} />
              </div>
            </div>

            {/* Explorer */}
            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,.5)',
                  fontSize: '.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '1rem',
                }}
              >
                Explorer
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
                {FOOTER_EXPLORER.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      style={{
                        fontSize: '.875rem',
                        color: 'rgba(255,255,255,.7)',
                        transition: 'color var(--transition)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'white')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,.7)')}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,.5)',
                  fontSize: '.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '1rem',
                }}
              >
                Légal
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
                {FOOTER_LEGAL.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      style={{
                        fontSize: '.875rem',
                        color: 'rgba(255,255,255,.7)',
                        transition: 'color var(--transition)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'white')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,.7)')}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transparence */}
            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,.5)',
                  fontSize: '.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: '1rem',
                }}
              >
                Transparence
              </div>
              <p style={{ fontSize: '.875rem', lineHeight: 1.7, marginBottom: '.875rem' }}>
                Budget Public est un projet indépendant, sans financement public ni commercial.
                Le code source est ouvert.
              </p>
              <a
                href="https://github.com/budget-public"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  fontSize: '.8125rem',
                  color: 'rgba(255,255,255,.8)',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '.375rem .75rem',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                Code source (GitHub)
              </a>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,.1)',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <p style={{ fontSize: '.8125rem' }}>
              © 2026 Budget Public — Projet civique indépendant. Données : DGFiP & INSEE.
            </p>
            <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)' }}>
              Aucune affiliation partisane. Aucune publicité.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
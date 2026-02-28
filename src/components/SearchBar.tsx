'use client';

/**
 * SearchBar.tsx — Barre de recherche de commune avec autocomplétion simulée.
 * La liste statique sera remplacée par un appel API (geo.api.gouv.fr) en V2.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ----------------------------------------------------------------
   Données statiques — 10 grandes villes + quelques communes moyennes
   En production : remplacer par fetch sur https://geo.api.gouv.fr/communes
   ---------------------------------------------------------------- */
const VILLES_STATIQUES = [
  { nom: 'Paris',          code: '75056', population: 2145906, departement: 'Paris (75)' },
  { nom: 'Marseille',      code: '13055', population: 861635,  departement: 'Bouches-du-Rhône (13)' },
  { nom: 'Lyon',           code: '69123', population: 516092,  departement: 'Rhône (69)' },
  { nom: 'Toulouse',       code: '31555', population: 479553,  departement: 'Haute-Garonne (31)' },
  { nom: 'Nice',           code: '06088', population: 340017,  departement: 'Alpes-Maritimes (06)' },
  { nom: 'Nantes',         code: '44109', population: 314138,  departement: 'Loire-Atlantique (44)' },
  { nom: 'Montpellier',    code: '34172', population: 295542,  departement: 'Hérault (34)' },
  { nom: 'Strasbourg',     code: '67482', population: 285905,  departement: 'Bas-Rhin (67)' },
  { nom: 'Bordeaux',       code: '33063', population: 257804,  departement: 'Gironde (33)' },
  { nom: 'Lille',          code: '59350', population: 232741,  departement: 'Nord (59)' },
  { nom: 'Rennes',         code: '35238', population: 220488,  departement: 'Ille-et-Vilaine (35)' },
  { nom: 'Reims',          code: '51454', population: 183042,  departement: 'Marne (51)' },
  { nom: 'Le Havre',       code: '76351', population: 172074,  departement: 'Seine-Maritime (76)' },
  { nom: 'Toulon',         code: '83137', population: 171953,  departement: 'Var (83)' },
  { nom: 'Grenoble',       code: '38185', population: 158180,  departement: 'Isère (38)' },
  { nom: 'Dijon',          code: '21231', population: 155090,  departement: 'Côte-d\'Or (21)' },
  { nom: 'Angers',         code: '49007', population: 154508,  departement: 'Maine-et-Loire (49)' },
  { nom: 'Nîmes',          code: '30189', population: 148561,  departement: 'Gard (30)' },
  { nom: 'Villeurbanne',   code: '69266', population: 150716,  departement: 'Rhône (69)' },
  { nom: 'Clermont-Ferrand', code: '63113', population: 143886, departement: 'Puy-de-Dôme (63)' },
];

type Ville = typeof VILLES_STATIQUES[0];

interface SearchBarProps {
  /** Taille du champ : 'default' pour la page commune, 'hero' pour la hero section */
  size?: 'default' | 'hero';
  placeholder?: string;
}

export default function SearchBar({
  size = 'default',
  placeholder = 'Rechercher votre commune...',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Ville[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* --- Filtrage des suggestions ----------------------------- */
  const filtrer = useCallback((valeur: string) => {
    if (!valeur.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const normalise = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const resultats = VILLES_STATIQUES.filter(v =>
      normalise(v.nom).startsWith(normalise(valeur))
    ).slice(0, 6);

    setSuggestions(resultats);
    setIsOpen(resultats.length > 0);
    setActiveIndex(-1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    filtrer(e.target.value);
  };

  /* --- Navigation clavier ----------------------------------- */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        selectionner(suggestions[activeIndex]);
      } else if (query.trim()) {
        router.push(`/communes?q=${encodeURIComponent(query)}`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  /* --- Sélection d'une commune ------------------------------ */
  const selectionner = (ville: Ville) => {
    setQuery(ville.nom);
    setIsOpen(false);
    router.push(`/communes/${ville.code}`);
  };

  /* --- Fermer en cliquant à l'extérieur -------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHero = size === 'hero';

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {/* Champ de saisie */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--blanc)',
          border: isOpen ? '2px solid var(--bleu-marine)' : '2px solid var(--bordure)',
          borderRadius: isHero ? 'var(--radius-lg)' : 'var(--radius-md)',
          boxShadow: isHero ? 'var(--ombre-md)' : 'var(--ombre-xs)',
          transition: 'border-color 200ms, box-shadow 200ms',
          overflow: 'hidden',
        }}
      >
        {/* Icône loupe */}
        <div style={{ padding: isHero ? '0 1rem 0 1.25rem' : '0 .75rem 0 1rem', color: 'var(--texte-tertiaire)', flexShrink: 0 }}>
          <svg width={isHero ? 22 : 18} height={isHero ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(suggestions.length > 0)}
          placeholder={placeholder}
          autoComplete="off"
          aria-label="Rechercher une commune"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: isHero ? '1.0625rem' : '.9375rem',
            color: 'var(--texte-primaire)',
            padding: isHero ? '1.125rem .5rem' : '.75rem .5rem',
          }}
        />

        {/* Bouton effacer */}
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setIsOpen(false); inputRef.current?.focus(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 .75rem', color: 'var(--texte-tertiaire)', display: 'flex' }}
            aria-label="Effacer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </button>
        )}

        {/* Bouton Rechercher — version hero */}
        {isHero && (
          <button
            onClick={() => { if (query.trim()) router.push(`/communes?q=${encodeURIComponent(query)}`); }}
            style={{
              background: 'var(--bleu-marine)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              padding: '1.125rem 1.5rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '.9375rem',
              fontWeight: 600,
              flexShrink: 0,
              transition: 'background var(--transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bleu-moyen)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bleu-marine)')}
          >
            Rechercher
          </button>
        )}
      </div>

      {/* Liste d'autocomplétion */}
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'var(--blanc)',
            border: '1px solid var(--bordure)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--ombre-lg)',
            overflow: 'hidden',
            listStyle: 'none',
            zIndex: 100,
            animation: 'fadeInUp .15s ease',
          }}
        >
          {suggestions.map((ville, index) => (
            <li
              key={ville.code}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={() => selectionner(ville)}
              onMouseEnter={() => setActiveIndex(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '.75rem 1rem',
                cursor: 'pointer',
                background: index === activeIndex ? 'var(--bleu-pale)' : 'transparent',
                borderBottom: index < suggestions.length - 1 ? '1px solid var(--bordure)' : 'none',
                transition: 'background var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
                {/* Icône localisation */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bleu-moyen)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontWeight: 500, color: 'var(--texte-primaire)', fontSize: '.9375rem' }}>{ville.nom}</span>
              </div>
              <span style={{ fontSize: '.8125rem', color: 'var(--texte-tertiaire)' }}>{ville.departement}</span>
            </li>
          ))}

          {/* Pied de liste : indication données */}
          <li style={{ padding: '.5rem 1rem', background: 'var(--bleu-pale)', borderTop: '1px solid var(--bordure)' }}>
            <span style={{ fontSize: '.75rem', color: 'var(--texte-tertiaire)' }}>
              💡 Les 34 900+ communes françaises seront disponibles lors du lancement.
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

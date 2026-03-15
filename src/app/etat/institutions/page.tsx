"use client";
// src/app/etat/institutions/page.tsx
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

// ═══════════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════════

// ── Assemblée nationale — groupes XVIIe législature (oct. 2025) ──
const GROUPES_AN = [
  { nom: "Rassemblement National",           sigle: "RN",      sieges: 124, couleur: "#0E3B7C",  famille: "Extrême droite" },
  { nom: "Nouveau Front Populaire — LFI",    sigle: "LFI-NFP", sieges: 72,  couleur: "#CC2929",  famille: "Gauche radicale" },
  { nom: "Ensemble pour la République",      sigle: "EPR",     sieges: 97,  couleur: "#FFBE00",  famille: "Centre" },
  { nom: "Socialistes & Républicains",       sigle: "SOC",     sieges: 64,  couleur: "#E87830",  famille: "Gauche" },
  { nom: "Droite Républicaine",              sigle: "DR",      sieges: 55,  couleur: "#0055A5",  famille: "Droite" },
  { nom: "Les Démocrates",                   sigle: "DEM",     sieges: 36,  couleur: "#F7A80D",  famille: "Centre" },
  { nom: "Écologiste et Social",             sigle: "EcoS",    sieges: 23,  couleur: "#2E8B57",  famille: "Gauche écolo" },
  { nom: "Horizons & Indépendants",          sigle: "HOR",     sieges: 31,  couleur: "#1E9DE3",  famille: "Centre" },
  { nom: "LIOT",                             sigle: "LIOT",    sieges: 22,  couleur: "#7B68EE",  famille: "Divers" },
  { nom: "GDR — Communistes",                sigle: "GDR",     sieges: 22,  couleur: "#A50000",  famille: "Gauche" },
  { nom: "Union des droites (UDR)",          sigle: "UDR",     sieges: 17,  couleur: "#003189",  famille: "Droite radicale" },
  { nom: "Non-inscrits",                     sigle: "NI",      sieges: 10,  couleur: "#CCCCCC",  famille: "—" },
];
const TOTAL_AN = GROUPES_AN.reduce((s, g) => s + g.sieges, 0);

// ── Sénat — groupes (oct. 2025, source france-politique.fr) ──
const GROUPES_SENAT = [
  { nom: "Les Républicains",                 sigle: "LR",      sieges: 133, couleur: "#0055A5",  famille: "Droite" },
  { nom: "Socialiste, Éco. et Républicain",  sigle: "SER",     sieges: 65,  couleur: "#E87830",  famille: "Gauche" },
  { nom: "Union Centriste",                  sigle: "UC",      sieges: 56,  couleur: "#F7A80D",  famille: "Centre" },
  { nom: "RDPI (Renaissance/majorité prés.)",sigle: "RDPI",    sieges: 22,  couleur: "#FFBE00",  famille: "Centre" },
  { nom: "Les Indépendants",                 sigle: "LIRT",    sieges: 18,  couleur: "#1E9DE3",  famille: "Centre-droite" },
  { nom: "CRCE — Communistes",               sigle: "CRCE",    sieges: 18,  couleur: "#A50000",  famille: "Gauche" },
  { nom: "Écologiste — Sol. et Territoires", sigle: "GEST",    sieges: 17,  couleur: "#2E8B57",  famille: "Gauche écolo" },
  { nom: "RDSE (Radicaux)",                  sigle: "RDSE",    sieges: 16,  couleur: "#7B68EE",  famille: "Centre-gauche" },
  { nom: "Non-inscrits (dont RN)",           sigle: "NI",      sieges:  3,  couleur: "#CCCCCC",  famille: "—" },
];
const TOTAL_SENAT = GROUPES_SENAT.reduce((s, g) => s + g.sieges, 0);

// ── Gouvernement Lecornu II — oct. 2025 ──
const MINISTRES = [
  // Plein exercice
  { nom: "Sébastien Lecornu",       titre: "Premier ministre",                   parti: "Renaissance", couleur: "#FFBE00" },
  { nom: "Laurent Nuñez",           titre: "Intérieur",                           parti: "Renaissance", couleur: "#FFBE00" },
  { nom: "Catherine Vautrin",       titre: "Armées",                              parti: "Ex-LR",       couleur: "#0055A5" },
  { nom: "Jean-Pierre Farandou",    titre: "Travail & Solidarités",               parti: "Soc. civile", couleur: "#888888" },
  { nom: "Monique Barbut",          titre: "Transition écologique",               parti: "Soc. civile", couleur: "#888888" },
  { nom: "Gérald Darmanin",         titre: "Justice (Garde des Sceaux)",          parti: "Renaissance", couleur: "#FFBE00" },
  { nom: "Roland Lescure",          titre: "Économie & Finances",                 parti: "Renaissance", couleur: "#FFBE00" },
  { nom: "Serge Papin",             titre: "PME & Commerce",                      parti: "Soc. civile", couleur: "#888888" },
  { nom: "Annie Genevard",          titre: "Agriculture",                         parti: "LR (suspendu)",couleur: "#0055A5" },
  { nom: "Édouard Geffray",         titre: "Éducation nationale",                 parti: "Soc. civile", couleur: "#888888" },
  { nom: "Jean-Noël Barrot",        titre: "Europe & Affaires étrangères",        parti: "MoDem",       couleur: "#F7A80D" },
  { nom: "Stéphanie Rist",          titre: "Santé & Familles",                    parti: "Renaissance", couleur: "#FFBE00" },
  { nom: "Catherine Pégard",        titre: "Culture",                             parti: "Soc. civile", couleur: "#888888" },
  { nom: "Naïma Moutchou",          titre: "Aménagement du territoire",           parti: "Horizons",    couleur: "#1E9DE3" },
  { nom: "Amélie de Montchalin",    titre: "Action & Comptes publics",            parti: "Renaissance", couleur: "#FFBE00" },
  { nom: "Philippe Baptiste",       titre: "Enseignement supérieur & Recherche",  parti: "Soc. civile", couleur: "#888888" },
  { nom: "Marina Ferrari",          titre: "Sports & Jeunesse",                   parti: "MoDem",       couleur: "#F7A80D" },
  { nom: "Philippe Tabarot",        titre: "Transports",                          parti: "LR (suspendu)",couleur: "#0055A5" },
  { nom: "Vincent Jeanbrun",        titre: "Ville & Logement",                    parti: "LR (suspendu)",couleur: "#0055A5" },
  { nom: "Rachida Dati",            titre: "Culture (conservée)",                 parti: "LR (suspendu)",couleur: "#0055A5" },
];

const MINISTRES_PAR_PARTI = [
  { parti: "Renaissance",   nb: 12, couleur: "#FFBE00" },
  { parti: "LR (suspendus)",nb: 6,  couleur: "#0055A5" },
  { parti: "MoDem",         nb: 4,  couleur: "#F7A80D" },
  { parti: "Horizons",      nb: 3,  couleur: "#1E9DE3" },
  { parti: "Société civile",nb: 7,  couleur: "#888888" },
  { parti: "UDI",           nb: 1,  couleur: "#9B1B22" },
  { parti: "Indépendant",   nb: 1,  couleur: "#AAAAAA" },
];

// ── Autres institutions ──
const AUTRES_INSTITUTIONS = [
  {
    nom: "Conseil économique, social et environnemental (CESE)",
    budget: 45_000_000,
    membres: 175,
    desc: "Assemblée consultative composée de représentants des organisations syndicales, patronales, associations et personnalités qualifiées. Il rend des avis sur les projets de loi économiques et sociaux.",
    role: "Consultatif",
  },
  {
    nom: "Conseil constitutionnel",
    budget: 12_000_000,
    membres: 9,
    desc: "Veille à la constitutionnalité des lois et valide les élections présidentielles et législatives. Composé de 9 membres nommés pour 9 ans (3 par le Président, 3 par le Président de l'AN, 3 par le Président du Sénat).",
    role: "Juridictionnel",
  },
  {
    nom: "Conseil d'État",
    budget: 85_000_000,
    membres: 300,
    desc: "Juge administratif suprême et conseiller juridique du gouvernement. Il examine tous les projets de loi avant leur présentation au Conseil des ministres et peut rendre des avis facultatifs ou obligatoires.",
    role: "Juridictionnel",
  },
  {
    nom: "Cour des comptes",
    budget: 230_000_000,
    membres: 350,
    desc: "Contrôle les comptes de l'État, des collectivités locales et des organismes sociaux. Elle publie chaque année un rapport public et certifie les comptes de l'État. Ses magistrats sont inamovibles.",
    role: "Contrôle",
  },
  {
    nom: "Haut Commissariat au Plan",
    budget: 6_000_000,
    membres: 40,
    desc: "Organisme de réflexion prospective rattaché au Premier ministre, chargé d'animer les débats sur les grandes orientations économiques et sociales à long terme de la France.",
    role: "Consultatif",
  },
  {
    nom: "Défenseur des droits",
    budget: 30_000_000,
    membres: 200,
    desc: "Autorité constitutionnelle indépendante qui protège les citoyens dans leurs relations avec les services publics et les entreprises. Traite chaque année plus de 100 000 réclamations.",
    role: "Protection",
  },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function fmtM(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + " Md€";
  return (n / 1e6).toFixed(1) + " M€";
}

const ROLE_COULEUR: Record<string, string> = {
  "Consultatif":   "var(--bleu-clair)",
  "Juridictionnel":"var(--rouge-pale)",
  "Contrôle":      "#F3F0E8",
  "Protection":    "#EEF7EF",
};

// ── Mini graphique hémicycle en barres ──
function HemicycleBar({ groupes, total, titre }: {
  groupes: typeof GROUPES_AN;
  total: number;
  titre: string;
}) {
  return (
    <div>
      <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--gris-2)", marginBottom: ".75rem" }}>
        {titre}
      </div>
      {/* Barre hémicycle */}
      <div style={{ display: "flex", height: 28, borderRadius: 4, overflow: "hidden", marginBottom: ".875rem" }}>
        {groupes.filter(g => g.sieges > 0).map((g) => (
          <div
            key={g.sigle}
            title={`${g.nom} : ${g.sieges} sièges`}
            style={{ width: `${(g.sieges / total) * 100}%`, background: g.couleur, minWidth: g.sieges > 3 ? 2 : 0 }}
          />
        ))}
      </div>
      {/* Légende */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem .875rem" }}>
        {groupes.filter(g => g.sieges >= 10).map((g) => (
          <div key={g.sigle} style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: g.couleur, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--encre)" }}>
              <strong>{g.sigle}</strong>
              {" "}{g.sieges}
            </span>
          </div>
        ))}
        <span style={{ fontFamily: "var(--mono)", fontSize: ".75rem", color: "var(--gris-3)", marginLeft: ".25rem" }}>
          {"= " + total + " sièges"}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════

export default function InstitutionsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggle = (s: string) => setActiveSection(activeSection === s ? null : s);

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ── */}
        <section className="hero-interieur">
          <div className="container inner" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "2rem" }}>
              <div>
                <span className="tag-hero">{"🏛️ État › Institutions"}</span>
                <h1>{"Les hautes institutions de la République"}</h1>
                <p className="lead">
                  {"Au-delà des ministères, la France dispose d'un ensemble d'institutions constitutionnelles dont le fonctionnement est financé par l'État : le Parlement (Assemblée nationale et Sénat), le Gouvernement, mais aussi les juridictions suprêmes, les organes consultatifs et les autorités indépendantes."}
                </p>
                <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "rgba(255,255,255,.8)", lineHeight: 1.65, marginTop: ".875rem", maxWidth: 620 }}>
                  {"Ces institutions forment l'architecture démocratique de l'État. Elles votent les lois, contrôlent le gouvernement, garantissent les libertés fondamentales et évaluent l'action publique. Leur coût total représente moins de 1 % du budget de l'État — un montant modeste au regard de leur rôle central."}
                </p>
              </div>
              <div style={{ display: "flex", gap: "2.5rem", flexShrink: 0, flexWrap: "wrap" }}>
                <div>
                  <div className="stat-hero">{"~ 1,5 Md€"}</div>
                  <div className="stat-hero-label">{"Budget total institutions"}</div>
                </div>
                <div>
                  <div className="stat-hero" style={{ color: "rgba(255,255,255,.75)" }}>{"925"}</div>
                  <div className="stat-hero-label">{"Parlementaires élus"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ASSEMBLÉE NATIONALE ── */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 className="section-titre" style={{ marginBottom: 0 }}>{"Assemblée nationale"}</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{"577"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Députés"}</div>
                </div>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--rouge)", lineHeight: 1 }}>{"607 M€"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Dotation État 2025"}</div>
                </div>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--encre)", lineHeight: 1 }}>{"643 M€"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Dépenses totales 2025"}</div>
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: ".875rem" }}>
              {"L'Assemblée nationale est la chambre basse du Parlement français. Ses 577 députés, élus au suffrage universel direct pour 5 ans dans autant de circonscriptions, représentent directement les citoyens. Elle détient le dernier mot sur les lois en cas de désaccord avec le Sénat — sauf pour les lois organiques relatives au Sénat lui-même."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: "2rem" }}>
              {"La XVIIe législature, issue des élections de juillet 2024 consécutives à la dissolution décidée par Emmanuel Macron, a produit une Assemblée morcelée en trois blocs sans majorité absolue : le Nouveau Front Populaire à gauche, le bloc central (EPR, Horizons, Démocrates) et le Rassemblement National à droite. Cette fragmentation inédite a rendu particulièrement difficile l'adoption des lois de finances. L'Assemblée bénéficie d'une autonomie financière : elle élabore, exécute et contrôle son budget librement, sans contrôle a priori du ministère du Budget."}
            </p>

            <div className="chart-wrapper">
              <HemicycleBar groupes={GROUPES_AN} total={TOTAL_AN} titre={"Composition par groupe politique — XVIIe législature (oct. 2025)"} />

              {/* Tableau détaillé */}
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".375rem 2rem" }}>
                  {GROUPES_AN.map((g, i) => {
                    const isLeft = i < Math.ceil(GROUPES_AN.length / 2);
                    return (
                      <div key={g.sigle} style={{ display: "flex", alignItems: "center", gap: ".625rem", padding: ".25rem .375rem" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: g.couleur, flexShrink: 0, display: "inline-block" }} />
                        <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", flex: 1 }}>{g.nom}</span>
                        <div style={{ width: 80, background: "var(--gris-5)", borderRadius: 2, height: 8, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 2, width: `${(g.sieges / Math.max(...GROUPES_AN.map(x=>x.sieges))) * 100}%`, background: g.couleur }} />
                        </div>
                        <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", fontWeight: 600, color: "var(--encre)", minWidth: 28, textAlign: "right" }}>{g.sieges}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: ".7rem", color: "var(--gris-3)", minWidth: 36, textAlign: "right" }}>
                          {((g.sieges / TOTAL_AN) * 100).toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="chart-source">{"Source : Assemblée nationale, effectifs des groupes au 13 octobre 2025 — vie-publique.fr"}</div>
            </div>

            {/* Coût par député */}
            <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "var(--bleu-pale)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--bleu)" }}>
              <p style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-1)", lineHeight: 1.65 }}>
                <strong>{"Coût par habitant : "}</strong>
                {"74 centimes d'euro par mois par Français — soit 8,87 € par an — pour l'ensemble du fonctionnement de l'Assemblée nationale. Sur les 607 M€ de dotation, 57,7 % couvrent les charges parlementaires (indemnités, collaborateurs), 33 % les charges de personnel permanent et 9,3 % les frais de fonctionnement divers."}
              </p>
            </div>
          </div>
        </section>

        {/* ── SÉNAT ── */}
        <section className="section-page" style={{ background: "var(--creme-fonce)" }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 className="section-titre" style={{ marginBottom: 0 }}>{"Sénat"}</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{"348"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Sénateurs"}</div>
                </div>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--rouge)", lineHeight: 1 }}>{"353 M€"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Dotation État 2025"}</div>
                </div>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--encre)", lineHeight: 1 }}>{"6 ans"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Mandat sénatorial"}</div>
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: ".875rem" }}>
              {"Le Sénat est la chambre haute du Parlement. Ses 348 sénateurs ne sont pas élus au suffrage universel direct mais au suffrage universel indirect : ils sont choisis par des grands électeurs (conseillers municipaux, généraux et régionaux, ainsi que des délégués des conseils municipaux). Ce mode d'élection explique la domination historique de la droite et du centre dans cette chambre, qui représente les collectivités territoriales."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: "2rem" }}>
              {"Les sénateurs sont renouvelés par moitié tous les 3 ans, pour un mandat de 6 ans. Contrairement à l'Assemblée nationale, le Sénat ne peut pas être dissous par le Président de la République. Il joue un rôle de chambre de réflexion, d'amendement et de contrôle gouvernemental, et dispose d'un droit de veto sur les lois organiques relatives à son propre fonctionnement."}
            </p>

            <div className="chart-wrapper">
              <HemicycleBar groupes={GROUPES_SENAT} total={TOTAL_SENAT} titre={"Composition par groupe politique — octobre 2025"} />
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".375rem 2rem" }}>
                  {GROUPES_SENAT.map((g) => (
                    <div key={g.sigle} style={{ display: "flex", alignItems: "center", gap: ".625rem", padding: ".25rem .375rem" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: g.couleur, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", flex: 1 }}>{g.nom}</span>
                      <div style={{ width: 80, background: "var(--gris-5)", borderRadius: 2, height: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${(g.sieges / Math.max(...GROUPES_SENAT.map(x=>x.sieges))) * 100}%`, background: g.couleur }} />
                      </div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: ".8125rem", fontWeight: 600, color: "var(--encre)", minWidth: 28, textAlign: "right" }}>{g.sieges}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: ".7rem", color: "var(--gris-3)", minWidth: 36, textAlign: "right" }}>
                        {((g.sieges / TOTAL_SENAT) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-source">{"Source : Sénat, groupes politiques au 1er octobre 2025 — france-politique.fr"}</div>
            </div>
          </div>
        </section>

        {/* ── GOUVERNEMENT ── */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 className="section-titre" style={{ marginBottom: 0 }}>{"Gouvernement Lecornu II"}</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{"34"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Ministres"}</div>
                </div>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--rouge)", lineHeight: 1 }}>{"122 M€"}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Budget Élysée 2025"}</div>
                </div>
                <div className="carte" style={{ padding: ".75rem 1.25rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--encre)", lineHeight: 1 }}>{"12 oct."}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", marginTop: ".25rem" }}>{"Nomination 2025"}</div>
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: ".875rem" }}>
              {"Le gouvernement Lecornu II est nommé le 12 octobre 2025, après la chute du gouvernement Bayrou (renversé le 8 septembre par 364 voix) et l'éphémère gouvernement Lecornu I (démis le 6 octobre). C'est le 48e gouvernement de la Ve République. Sébastien Lecornu est alors le 9e Premier ministre sous la présidence Macron."}
            </p>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: "2rem" }}>
              {"L'équipe de 34 membres (19 ministres de plein exercice + 15 ministres délégués) est dominée par Renaissance (12 membres), avec une ouverture vers LR (6 membres, suspendus de leur parti), MoDem (4), Horizons (3) et plusieurs personnalités de la société civile (7). Le gouvernement est en position minoritaire à l'Assemblée nationale et doit obtenir des majorités de circonstance pour faire adopter les textes."}
            </p>

            {/* Graphique composition par parti */}
            <div className="chart-wrapper">
              <div className="chart-title">{"Composition par famille politique — Gouvernement Lecornu II (oct. 2025)"}</div>
              <div style={{ marginBottom: "1.25rem" }}>
                {/* Barre */}
                <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", marginBottom: ".875rem" }}>
                  {MINISTRES_PAR_PARTI.map((p) => (
                    <div
                      key={p.parti}
                      title={`${p.parti} : ${p.nb}`}
                      style={{ width: `${(p.nb / 35) * 100}%`, background: p.couleur }}
                    />
                  ))}
                </div>
                {/* Légende */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem 1.25rem" }}>
                  {MINISTRES_PAR_PARTI.map((p) => (
                    <div key={p.parti} style={{ display: "flex", alignItems: "center", gap: ".375rem" }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: p.couleur, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)" }}>
                        <strong>{p.parti}</strong>{" "}{p.nb}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liste ministres */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".375rem 2rem", marginTop: "1rem" }}>
                {MINISTRES.map((m, i) => (
                  <div key={m.nom} style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", padding: ".3rem .375rem" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.couleur, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", fontWeight: 600, color: "var(--encre)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.nom}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-2)", lineHeight: 1.3 }}>{m.titre}</div>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".65rem", color: "var(--gris-3)", flexShrink: 0, textAlign: "right", paddingTop: 2 }}>{m.parti}</span>
                  </div>
                ))}
              </div>
              <div className="chart-source">{"Source : info.gouv.fr, décret du 12 octobre 2025 — touteleurope.eu, franceinfo.fr"}</div>
            </div>
          </div>
        </section>

        {/* ── AUTRES INSTITUTIONS ── */}
        <section className="section-page" style={{ background: "var(--creme-fonce)" }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <span className="rule-rouge" />
            <h2 className="section-titre">{"Autres hautes administrations"}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--gris-1)", lineHeight: 1.75, maxWidth: 760, marginBottom: "2rem" }}>
              {"Au-delà du Parlement et du Gouvernement, la République française dispose d'un écosystème institutionnel dense : juridictions suprêmes, autorités consultatives, organes de contrôle et autorités indépendantes. Ces institutions jouent un rôle crucial de contre-pouvoir, de conseil juridique et de protection des citoyens."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {AUTRES_INSTITUTIONS.map((inst) => (
                <div key={inst.nom} className="carte" style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".75rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".5rem", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "var(--sans)", fontSize: ".6875rem", fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: ".06em",
                          padding: ".2rem .5rem", borderRadius: 3,
                          background: ROLE_COULEUR[inst.role] ?? "var(--gris-5)",
                          color: "var(--encre)"
                        }}>{inst.role}</span>
                        <span style={{ fontFamily: "var(--sans)", fontWeight: 600, fontSize: ".9375rem", color: "var(--encre)" }}>{inst.nom}</span>
                      </div>
                      <p style={{ fontFamily: "var(--sans)", fontSize: ".875rem", color: "var(--gris-1)", lineHeight: 1.65 }}>{inst.desc}</p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--rouge)", lineHeight: 1 }}>{fmtM(inst.budget)}</div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".2rem" }}>{"Budget annuel"}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{inst.membres}</div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".2rem" }}>{"Membres"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-source" style={{ marginTop: "1.5rem" }}>
              {"Sources : Loi de Finances 2025 mission « Pouvoirs publics », rapports annuels de performance, economie.gouv.fr"}
            </div>
          </div>
        </section>

        {/* ── NAVIGATION ── */}
        <section className="section-page">
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat" className="btn btn-contour">{"← Vue d'ensemble"}</Link>
              <Link href="/etat/ministeres" className="btn btn-contour">{"Budget par ministère"}</Link>
              <Link href="/etat/dette" className="btn btn-primaire">{"Dette publique →"}</Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ borderTop: "1px solid var(--bordure)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-3)" }}>{"© 2025 BudgetPublic — Sources officielles"}</span>
          <Link href="/sources" style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", textDecoration: "none" }}>{"Sources →"}</Link>
        </div>
      </footer>
    </>
  );
}
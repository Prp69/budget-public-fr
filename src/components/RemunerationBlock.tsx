// src/components/RemunerationBlock.tsx
// Bloc rémunération — style éditorial cohérent avec le reste du site
import type { ReactElement } from "react";

interface LigneMontant {
  label: string;
  montant: string;
  note?: string;
  imposable?: boolean;
  type?: "normal" | "total" | "highlight" | "negative";
}

interface Section {
  titre: string;
  icone: string; // SVG path d
  lignes: LigneMontant[];
  texte?: string;
}

interface RemunerationData {
  titre: string;
  intro: string;
  totalBrut: string;
  totalNet: string;
  sourceLabel: string;
  sourceUrl: string;
  sections: Section[];
}

// ─── Icônes SVG monochromes ───────────────────────────────────────────────────

const ICONS: Record<string, ReactElement> = {
  coin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9.5 9.5A2.5 2.5 0 0112 8a2.5 2.5 0 010 5 2.5 2.5 0 000 5 2.5 2.5 0 002.5-1.5"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  train: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 19l-2 2m10-2l2 2M9 3h6"/><circle cx="8.5" cy="15.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/>
    </svg>
  ),
  building: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="13"/><path d="M8 22V12h8v10M9 3h6l3 6H6L9 3z"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  plane: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  ),
};

// ─── Données officielles ──────────────────────────────────────────────────────

export const REMUNERATION: Record<string, RemunerationData> = {

  depute: {
    titre: "Rémunération d'un député",
    intro: "La rémunération d'un député n'est pas un salaire : c'est une indemnité parlementaire fixée par l'ordonnance organique du 13 décembre 1958, indexée sur la grille « hors échelle » de la fonction publique. Elle est complétée par des enveloppes de fonctionnement (non personnelles) et des avantages liés au mandat.",
    totalBrut: "7 637 €",
    totalNet: "~5 953 €",
    sourceLabel: "Assemblée nationale — La situation matérielle du député",
    sourceUrl: "https://www.assemblee-nationale.fr/dyn/synthese/deputes-groupes-parlementaires/la-situation-materielle-du-depute",
    sections: [
      {
        titre: "Indemnité parlementaire",
        icone: "coin",
        texte: "Seul élément constituant un revenu personnel pour le député. Soumise à l'impôt sur le revenu et aux cotisations sociales. Revalorisée en janvier 2024 suite à la hausse du point d'indice de la fonction publique.",
        lignes: [
          { label: "Indemnité de base",                        montant: "5 931,95 €/mois", imposable: true },
          { label: "Indemnité de résidence (3 %)",             montant: "177,96 €/mois",   imposable: true },
          { label: "Indemnité de fonction (25 %)",             montant: "1 527,48 €/mois", imposable: true },
          { label: "Total brut mensuel",                       montant: "7 637,39 €/mois", imposable: true, type: "total", note: "= traitement hors échelle lettre B de la FP" },
          { label: "Net avant impôt estimé",                   montant: "~5 953 €/mois",   type: "highlight", note: "Après cotisations sociales (~22%)" },
          { label: "Cumul mandat local (plafond légal)",        montant: "+ 2 965 €/mois",  note: "1,5 × indemnité de base — si mandat local cumulé" },
        ],
      },
      {
        titre: "Dotation de fonctionnement (DFP)",
        icone: "file",
        texte: "Depuis juillet 2025, la DFP fusionne l'avance de frais de mandat et la dotation matérielle. Ce n'est pas un revenu : chaque dépense est justifiée et contrôlée par le déontologue. Les sommes non utilisées sont restituées.",
        lignes: [
          { label: "Dotation DFP mensuelle (depuis juillet 2025)", montant: "7 238,04 €/mois", type: "total", note: "Fusion AFM + dotation matérielle" },
          { label: "→ Frais de mandat (permanence, déplacements)", montant: "~5 430 €" },
          { label: "→ Matériel informatique et reprographie",      montant: "~1 808 €" },
          { label: "Dépenses en espèces (menues dépenses)",        montant: "600 €/mois max" },
          { label: "Enveloppe collaborateurs (1 à 5 assistants)",  montant: "11 463 €/mois",  note: "Versée directement aux collaborateurs — jamais au député" },
        ],
      },
      {
        titre: "Déplacements pris en charge",
        icone: "train",
        texte: "Les déplacements sont pris en charge uniquement dans le cadre de l'exercice du mandat, pour assurer la présence à Paris et le lien avec la circonscription.",
        lignes: [
          { label: "Réseau SNCF intégral 1ère classe",          montant: "Gratuit" },
          { label: "Vols Paris ↔ circonscription",              montant: "80 A/R par an" },
          { label: "Transports urbains (Navigo Paris)",          montant: "Gratuit" },
          { label: "Parc de voitures avec chauffeur (partagé)",  montant: "~15 véhicules pour l'AN", note: "Depuis le Palais-Bourbon" },
        ],
      },
      {
        titre: "Avantages liés au mandat",
        icone: "building",
        texte: "Ces avantages sont attachés à l'exercice du mandat et prennent fin dès sa cessation. Le logement à Paris reste à la charge personnelle du député.",
        lignes: [
          { label: "Bureau individuel au Palais-Bourbon",       montant: "Mis à disposition" },
          { label: "Informatique, téléphonie, courrier",        montant: "Pris en charge" },
          { label: "Hébergement Paris (résidence Chaban-Delmas)", montant: "Jusqu'à 1 200 €/mois", note: "Sous conditions, remboursement" },
          { label: "Restauration sur place",                    montant: "Tarif préférentiel" },
          { label: "Allocation garde d'enfant (< 3 ans)",       montant: "323,76 €/enfant/mois" },
        ],
      },
      {
        titre: "Retraite et fin de mandat",
        icone: "lock",
        texte: "Les députés cotisent à une caisse de retraite spécifique, réformée en 2017 pour s'aligner sur le droit commun. Une allocation de retour à l'emploi est versée en cas de non-réélection.",
        lignes: [
          { label: "Pension pour 1 mandat complet (5 ans)",     montant: "~661 €/mois nets" },
          { label: "Pension moyenne tous anciens députés",       montant: "~3 000 €/mois",  note: "Reflète des carrières parlementaires longues" },
          { label: "Allocation fin de mandat (AAMRE)",          montant: "4 353 €/mois bruts", note: "57% de l'indemnité, versée 18 à 36 mois" },
        ],
      },
    ],
  },

  senateur: {
    titre: "Rémunération d'un sénateur",
    intro: "La rémunération des sénateurs est fixée par la même ordonnance organique que celle des députés. Les montants de l'indemnité parlementaire sont identiques. Les différences portent sur le montant de l'avance de frais de mandat (légèrement supérieure au Sénat) et sur certains avantages propres au Palais du Luxembourg.",
    totalBrut: "7 637 €",
    totalNet: "~5 676 €",
    sourceLabel: "Sénat — L'indemnité parlementaire et les moyens des sénateurs",
    sourceUrl: "https://www.senat.fr/connaitre-le-senat/role-et-fonctionnement/lindemnite-parlementaire.html",
    sections: [
      {
        titre: "Indemnité parlementaire",
        icone: "coin",
        texte: "Identique à celle des députés — fixée par la même ordonnance organique de 1958. Imposable et soumise aux cotisations sociales. Montant brut mensuel inchangé depuis le 1er janvier 2024.",
        lignes: [
          { label: "Indemnité de base",                        montant: "5 931,95 €/mois", imposable: true },
          { label: "Indemnité de résidence (3 %)",             montant: "177,96 €/mois",   imposable: true },
          { label: "Indemnité de fonction (25 %)",             montant: "1 527,48 €/mois", imposable: true },
          { label: "Total brut mensuel",                       montant: "7 637,39 €/mois", imposable: true, type: "total" },
          { label: "Net avant impôt estimé",                   montant: "~5 676 €/mois",   type: "highlight" },
          { label: "Cumul mandat local (plafond légal)",        montant: "+ 2 965 €/mois",  note: "Plafond identique à celui des députés" },
        ],
      },
      {
        titre: "Avance pour frais de mandat (AFM)",
        icone: "file",
        texte: "Le Sénat maintient l'appellation AFM, légèrement supérieure à celle de l'AN. Tous les frais sont justifiés via l'application JULIA. Le Comité de déontologie contrôle 100% des sénateurs chaque mandat.",
        lignes: [
          { label: "AFM mensuelle (métropole)",                 montant: "6 600 €/mois",   type: "total", note: "Depuis nov. 2023 — 650 € de plus qu'à l'AN" },
          { label: "Enveloppe collaborateurs (1 à 5)",          montant: "8 827,40 €/mois", note: "Versée directement aux collaborateurs" },
          { label: "Justification obligatoire",                 montant: "≥ 85 % des dépenses", note: "Via JULIA, contrôle annuel de tous les sénateurs" },
          { label: "Dépenses interdites",                       montant: "—", note: "Immobilier, frais électoraux, amendes, dépenses personnelles" },
        ],
      },
      {
        titre: "Déplacements pris en charge",
        icone: "train",
        texte: "Mêmes avantages de déplacements que les députés pour les trajets liés à l'exercice du mandat.",
        lignes: [
          { label: "Réseau SNCF intégral 1ère classe",          montant: "Gratuit" },
          { label: "Vols Paris ↔ circonscription",              montant: "Forfait pris en charge" },
          { label: "Transports urbains Paris",                   montant: "Pris en charge" },
          { label: "Taxis et autres",                            montant: "Sur AFM, sur justificatif" },
        ],
      },
      {
        titre: "Avantages liés au mandat",
        icone: "building",
        texte: "Les avantages sont liés au Palais du Luxembourg. Certains services sont fournis directement par le Sénat, réduisant le besoin de recourir à l'AFM.",
        lignes: [
          { label: "Bureau au Palais du Luxembourg",            montant: "Mis à disposition" },
          { label: "Téléphonie et affranchissement",            montant: "Pris en charge directement" },
          { label: "Restaurant, salon, kiosque",                montant: "Tarifs préférentiels" },
          { label: "Salles de réunion et documentation",        montant: "Mis à disposition" },
        ],
      },
      {
        titre: "Retraite et fin de mandat",
        icone: "lock",
        texte: "Les sénateurs cotisent à la Caisse des retraites des anciens sénateurs, sans subvention de l'État. La pension moyenne en 2023 était de 3 391 €/mois, reflet de mandats souvent longs.",
        lignes: [
          { label: "Pension moyenne anciens sénateurs (2023)",   montant: "3 391 €/mois nets", type: "highlight" },
          { label: "Cotisation personnelle mensuelle",           montant: "~1 180 €/mois",  note: "Prélevée sur l'indemnité" },
          { label: "Pension de réversion conjoint",              montant: "60 %" },
          { label: "Allocation funéraire",                       montant: "~36 000 €",      note: "Équivalent 6 mois de rémunération" },
        ],
      },
    ],
  },

  ministre: {
    titre: "Rémunération d'un membre du gouvernement",
    intro: "La rémunération des membres du gouvernement est fixée par le décret n° 2012-983 du 23 août 2012, après la décision de François Hollande de réduire de 30 % les rémunérations des hauts dirigeants de l'État. Les ministres ne peuvent cumuler leurs fonctions avec aucun mandat électif ni aucune autre activité rémunérée.",
    totalBrut: "10 692 €",
    totalNet: "~8 000 €",
    sourceLabel: "Légifrance — Décret n° 2012-983 du 23 août 2012 & PLF 2025",
    sourceUrl: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000026315633",
    sections: [
      {
        titre: "Traitement mensuel selon le rang",
        icone: "coin",
        texte: "La rémunération est différenciée selon le rang dans le gouvernement. Imposable et soumise aux cotisations sociales. Aucun cumul possible avec une indemnité parlementaire ou un autre mandat.",
        lignes: [
          { label: "Premier ministre",                          montant: "16 038 €/mois bruts", imposable: true, type: "highlight" },
          { label: "Ministre de plein exercice",               montant: "10 692 €/mois bruts", imposable: true, type: "total" },
          { label: "Ministre délégué / Secrétaire d'État",     montant: "10 157 €/mois bruts", imposable: true },
          { label: "Net avant impôt (ministre)",               montant: "~8 000 €/mois",  note: "Estimation après cotisations sociales" },
          { label: "Indemnité de départ (3 mois)",             montant: "~32 000 à 48 000 €", note: "Si pas d'activité rémunérée reprise" },
        ],
      },
      {
        titre: "Frais de représentation",
        icone: "file",
        texte: "Les frais de représentation couvrent les dépenses officielles liées à la fonction. Ils ne constituent pas un revenu personnel et ne sont pas imposables.",
        lignes: [
          { label: "Frais de représentation (Premier ministre)", montant: "150 000 €/an max",  note: "Réceptions, déplacements diplomatiques, protocole" },
          { label: "Cabinet ministériel",                        montant: "Variable",           note: "Liste publiée au PLF — directeurs, conseillers, chargés de mission" },
          { label: "Télécommunications et sécurité",             montant: "Pris en charge" },
        ],
      },
      {
        titre: "Déplacements pris en charge",
        icone: "plane",
        texte: "Les déplacements sont intégralement pris en charge dans le cadre des fonctions. La flotte aérienne gouvernementale est réservée aux missions officielles.",
        lignes: [
          { label: "Réseau SNCF intégral 1ère classe",          montant: "Gratuit" },
          { label: "Voiture de fonction blindée + chauffeur",   montant: "Permanent en exercice" },
          { label: "Flotte aérienne gouvernementale (Falcon)",  montant: "Selon rang et mission",  note: "Armée de l'air — Escadron de transport 60" },
        ],
      },
      {
        titre: "Avantages liés aux fonctions",
        icone: "building",
        texte: "Chaque ministre dispose d'un hôtel particulier (logement de fonction). Ces avantages cessent immédiatement à la fin des fonctions — délai de 1 mois pour quitter le logement. Le décret du 16 septembre 2025 a supprimé les avantages à vie des anciens Premiers ministres.",
        lignes: [
          { label: "Logement de fonction (hôtel ministériel)",   montant: "Gratuit + charges + personnel" },
          { label: "Alternative : remboursement loyer",          montant: "80 m² + 20 m²/enfant",  note: "Option alternative au logement de fonction" },
          { label: "Premier ministre : Matignon",                montant: "Résidence officielle + bureaux" },
          { label: "Premier ministre : château de Souzy-la-Briche", montant: "Résidence secondaire (Essonne)" },
          { label: "Anciens PM : voiture + chauffeur",           montant: "Limité à 10 ans",  note: "Décret du 16 sept. 2025 — fin des avantages à vie" },
        ],
      },
      {
        titre: "Retraite et après-mandat",
        icone: "lock",
        texte: "Contrairement à une idée reçue, les ministres ne bénéficient d'aucune retraite spécifique liée à leur fonction. Ils cotisent aux régimes de droit commun comme tout salarié et ne cotisent pas à l'assurance-chômage.",
        lignes: [
          { label: "Retraite spécifique liée à la fonction",    montant: "Non", note: "Cotisation CNAV + IRCANTEC comme tout salarié" },
          { label: "Indemnité de départ (3 mois)",              montant: "Uniquement si sans activité", note: "1 mois de traitement × 3" },
          { label: "Assurance chômage",                         montant: "Non",  note: "Les ministres ne cotisent pas à l'assurance-chômage" },
        ],
      },
    ],
  },
};

// ─── Composant ────────────────────────────────────────────────────────────────

interface Props { type: "depute" | "senateur" | "ministre" }

export default function RemunerationBlock({ type }: Props) {
  const data = REMUNERATION[type];
  if (!data) return null;

  return (
    <div style={{ marginTop: "3rem", borderTop: "1px solid var(--bordure)", paddingTop: "2.5rem" }}>

      {/* ── En-tête ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--encre)", margin: "0 0 .875rem 0", letterSpacing: "-.02em" }}>
            {data.titre}
          </h3>
          <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--gris-1)", lineHeight: 1.75, margin: 0, maxWidth: 680 }}>
            {data.intro}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".875rem", flexShrink: 0 }}>
          <div style={{ background: "var(--bleu-pale)", border: "1px solid var(--bleu-clair)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", textAlign: "center", minWidth: 140 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.375rem", fontWeight: 700, color: "var(--bleu)", lineHeight: 1 }}>{data.totalBrut}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", color: "var(--gris-2)", marginTop: ".375rem", textTransform: "uppercase", letterSpacing: ".05em" }}>{"Brut mensuel"}</div>
          </div>
          <div style={{ background: "var(--rouge-pale)", border: "1px solid rgba(192,57,43,.15)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", textAlign: "center", minWidth: 140 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.375rem", fontWeight: 700, color: "var(--rouge)", lineHeight: 1 }}>{data.totalNet}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: ".6875rem", color: "var(--gris-2)", marginTop: ".375rem", textTransform: "uppercase", letterSpacing: ".05em" }}>{"Net avant impôt"}</div>
          </div>
        </div>
      </div>

      {/* ── Comparaison contexte ── */}
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem", padding: ".875rem 1.25rem", background: "var(--creme-fonce)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--bordure)" }}>
        {[
          { label: "Salaire médian France", val: "2 100 €/mois nets" },
          { label: "SMIC net 2025",         val: "1 426 €/mois" },
          { label: "Indemnité vs médiane",  val: type === "ministre" ? "×3,8" : "×2,7", rouge: true },
        ].map(item => (
          <div key={item.label}>
            <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)" }}>{item.label} : </span>
            <strong style={{ fontFamily: "var(--mono)", fontSize: ".875rem", color: item.rouge ? "var(--rouge)" : "var(--encre)" }}>{item.val}</strong>
          </div>
        ))}
      </div>

      {/* ── Sections en grille ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {data.sections.map((section) => (
          <div key={section.titre} style={{ background: "var(--blanc)", border: "1px solid var(--bordure)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>

            {/* Titre section */}
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem", padding: ".875rem 1.25rem", borderBottom: "1px solid var(--bordure)", background: "var(--creme-fonce)" }}>
              <span style={{ color: "var(--bleu)", flexShrink: 0 }}>{ICONS[section.icone]}</span>
              <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: ".8125rem", textTransform: "uppercase", letterSpacing: ".07em", color: "var(--gris-1)" }}>
                {section.titre}
              </span>
            </div>

            <div style={{ padding: "1rem 1.25rem" }}>
              {/* Texte explicatif */}
              {section.texte && (
                <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)", lineHeight: 1.65, marginBottom: ".875rem", paddingBottom: ".875rem", borderBottom: "1px solid var(--gris-5)" }}>
                  {section.texte}
                </p>
              )}

              {/* Lignes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {section.lignes.map((ligne, i) => {
                  const isTotal     = ligne.type === "total";
                  const isHighlight = ligne.type === "highlight";
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                      padding: ".5rem 0",
                      borderBottom: i < section.lignes.length - 1 ? "1px solid var(--gris-5)" : "none",
                      gap: ".75rem",
                      background: isHighlight ? "rgba(43,76,140,.04)" : "transparent",
                      margin: isHighlight ? "0 -.25rem" : 0,
                      borderRadius: isHighlight ? 3 : 0,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: isTotal ? "var(--encre)" : "var(--gris-1)", fontWeight: isTotal || isHighlight ? 600 : 400, lineHeight: 1.4 }}>
                          {ligne.label}
                          {ligne.imposable && (
                            <span style={{ marginLeft: ".375rem", background: "#FEF9C3", color: "#854D0E", fontSize: ".6rem", padding: ".1rem .35rem", borderRadius: 2, fontFamily: "var(--sans)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>
                              {"imposable"}
                            </span>
                          )}
                        </div>
                        {ligne.note && (
                          <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".1rem", lineHeight: 1.4 }}>
                            {ligne.note}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontFamily: "var(--mono)", fontSize: isTotal || isHighlight ? ".875rem" : ".8125rem",
                        fontWeight: isTotal || isHighlight ? 700 : 500,
                        color: ligne.montant === "Non" ? "var(--rouge)" : isHighlight ? "var(--bleu)" : isTotal ? "var(--encre)" : "var(--gris-1)",
                        textAlign: "right", flexShrink: 0, minWidth: 70,
                      }}>
                        {ligne.montant}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Source */}
      <div style={{ marginTop: "1rem", fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)" }}>
        <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gris-3)", textDecoration: "underline" }}>
          {data.sourceLabel}
        </a>
        {" · Ordonnance n° 58-1210 du 13 déc. 1958 · Décret n° 2012-983 du 23 août 2012"}
      </div>
    </div>
  );
}
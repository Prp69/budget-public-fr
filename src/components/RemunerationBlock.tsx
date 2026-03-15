// src/components/RemunerationBlock.tsx
// Bloc rémunération réutilisable — Député / Sénateur / Ministre / Premier ministre
// Sources : assemblee-nationale.fr, senat.fr, décrets officiels, PLF 2025

// ─── Types ────────────────────────────────────────────────────────────────────

interface LigneMontant {
  label: string;
  montant: string;
  note?: string;
  imposable?: boolean;
}

interface Section {
  titre: string;
  icone: string;
  couleur: string;
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

// ─── Données ──────────────────────────────────────────────────────────────────
// Sources officielles :
//   AN : assemblee-nationale.fr/dyn/synthese/deputes-groupes-parlementaires/la-situation-materielle-du-depute
//   Sénat : senat.fr/connaitre-le-senat/role-et-fonctionnement/lindemnite-parlementaire.html
//   Gouvernement : décret n° 2012-983 du 23 août 2012, Légifrance
//   Ordonnance n° 58-1210 du 13 décembre 1958

export const REMUNERATION: Record<string, RemunerationData> = {

  depute: {
    titre: "Rémunération d'un député",
    intro: "La rémunération d'un député n'est pas un salaire au sens du Code du travail : c'est une indemnité parlementaire, fixée par l'ordonnance organique du 13 décembre 1958 et indexée sur la grille « hors échelle » de la fonction publique. Elle est complétée par des enveloppes de fonctionnement et des avantages en nature qui ne constituent pas un revenu personnel.",
    totalBrut: "7 637 €/mois bruts",
    totalNet: "5 953 €/mois nets (avant impôt)",
    sourceLabel: "Source officielle : Assemblée nationale — La situation matérielle du député",
    sourceUrl: "https://www.assemblee-nationale.fr/dyn/synthese/deputes-groupes-parlementaires/la-situation-materielle-du-depute",
    sections: [
      {
        titre: "Indemnité parlementaire (revenu personnel)",
        icone: "💰",
        couleur: "#2B4C8C",
        texte: "L'indemnité parlementaire est le seul élément constituant le revenu personnel du député. Elle est soumise à l'impôt sur le revenu et aux cotisations sociales. Depuis le 1er janvier 2024, son montant brut mensuel est de 7 637,39 €, en hausse suite à la revalorisation du point d'indice de la fonction publique.",
        lignes: [
          { label: "Indemnité de base",       montant: "5 931,95 €/mois bruts", imposable: true },
          { label: "Indemnité de résidence (3 % de la base)", montant: "177,96 €/mois bruts", imposable: true },
          { label: "Indemnité de fonction (25 % des deux précédentes)", montant: "1 527,48 €/mois bruts", imposable: true },
          { label: "Total brut mensuel",      montant: "7 637,39 €",            imposable: true, note: "= traitement hors échelle lettre B de la FP" },
          { label: "Net avant impôt estimé",  montant: "~5 953 €/mois",         imposable: true, note: "Après cotisations sociales (~22%)" },
          { label: "Cumul mandat local maxi", montant: "+ 2 965 €/mois max",    note: "Plafond légal : 1,5 × indemnité de base" },
        ],
      },
      {
        titre: "Dotation de fonctionnement parlementaire (DFP)",
        icone: "📋",
        couleur: "#2B8C6B",
        texte: "Depuis le 1er juillet 2025, l'Assemblée nationale a fusionné l'avance de frais de mandat (AFM) et la dotation matérielle en une dotation unifiée — la DFP. Ce n'est pas un revenu : chaque dépense doit être justifiée et contrôlée par le déontologue de l'Assemblée nationale. Les montants non utilisés sont restitués.",
        lignes: [
          { label: "Dotation de fonctionnement parlementaire (DFP)", montant: "7 238,04 €/mois", note: "Depuis juillet 2025 (fusion AFM + dotation matérielle)" },
          { label: "→ dont frais de mandat (permanence, déplacements locaux, comm.)", montant: "~5 430 €" },
          { label: "→ dont matériel informatique, reprographie, etc.", montant: "~1 808 €" },
          { label: "Dont partie en espèces sans justificatif", montant: "600 €/mois max",     note: "Pour menues dépenses (transports, presse…)" },
          { label: "Enveloppe collaborateurs (1 à 5 assistants)", montant: "11 463 €/mois",   note: "Versée directement aux collaborateurs, jamais au député" },
        ],
      },
      {
        titre: "Déplacements pris en charge",
        icone: "🚆",
        couleur: "#F7A80D",
        texte: "Les déplacements sont pris en charge par l'Assemblée dans le cadre strict de l'exercice du mandat. Ces avantages permettent au député d'assurer sa présence à Paris et le lien avec sa circonscription, en raison du rythme soutenu des séances parlementaires.",
        lignes: [
          { label: "Réseau SNCF intégral",              montant: "Gratuit",    note: "1ère classe, sur présentation de la carte parlementaire" },
          { label: "Vols Paris ↔ circonscription",      montant: "80 A/R/an",  note: "Pris en charge directement par l'Assemblée" },
          { label: "Abonnement Navigo (Paris)",          montant: "Gratuit",    note: "Ou remboursement équivalent" },
          { label: "Taxis, VTC, vélopartage",            montant: "Sur DFP",    note: "Remboursés sur justificatif dans le cadre du mandat" },
          { label: "Parc de voitures avec chauffeur",   montant: "Partagé",    note: "~15 véhicules pour les déplacements officiels depuis le Palais-Bourbon" },
        ],
      },
      {
        titre: "Avantages en nature",
        icone: "🏛️",
        couleur: "#8B4513",
        texte: "Ces avantages sont liés à l'exercice du mandat et non à la personne du député. Ils prennent fin dès la fin du mandat. Le logement à Paris reste en revanche à la charge personnelle du député (sauf pour quelques chambres en résidence Chaban-Delmas, sous conditions).",
        lignes: [
          { label: "Bureau individuel au Palais-Bourbon",           montant: "Mis à disposition" },
          { label: "Informatique, téléphonie, impressions",         montant: "Pris en charge",   note: "Téléphone de bureau + 20 000 copies/an dont 5 000 couleur" },
          { label: "Courrier parlementaire",                        montant: "Pris en charge" },
          { label: "Restauration sur place",                        montant: "2 restaurants + buvette", note: "À tarif préférentiel, pas gratuit" },
          { label: "Hébergement Paris (chambre hôtel de fonction)", montant: "Remboursement jusqu'à 1 200 €/mois",   note: "Sous conditions, résidence Chaban-Delmas" },
          { label: "Allocation garde d'enfant (< 3 ans)",          montant: "323,76 €/enfant/mois" },
        ],
      },
      {
        titre: "Retraite et fin de mandat",
        icone: "🔒",
        couleur: "#6B2B8C",
        texte: "Les députés cotisent à une caisse de retraite spécifique créée en 1904, réformée depuis 2017 pour l'aligner sur le droit commun. En cas de non-réélection, une allocation de retour à l'emploi (AAMRE) est versée pendant 18 à 36 mois.",
        lignes: [
          { label: "Pension pour 1 mandat complet (5 ans)",  montant: "~661 €/mois nets" },
          { label: "Pension moyenne tous anciens députés",   montant: "~3 000 €/mois",  note: "Correspond à des carrières parlementaires longues" },
          { label: "Allocation fin de mandat (AAMRE)",       montant: "4 353 €/mois bruts", note: "57% de l'indemnité, versée 18 à 36 mois" },
          { label: "Gel des pensions 2026",                 montant: "Décidé en déc. 2025", note: "Économie ~800 000 € pour la caisse" },
        ],
      },
    ],
  },

  senateur: {
    titre: "Rémunération d'un sénateur",
    intro: "La rémunération des sénateurs est strictement identique à celle des députés, fixée par la même ordonnance organique de 1958. Les différences portent sur le montant de l'avance de frais de mandat (légèrement supérieure au Sénat) et sur certains avantages spécifiques au Palais du Luxembourg.",
    totalBrut: "7 637 €/mois bruts",
    totalNet: "5 676 €/mois nets (avant impôt)",
    sourceLabel: "Source officielle : Sénat — L'indemnité parlementaire et les moyens des sénateurs",
    sourceUrl: "https://www.senat.fr/connaitre-le-senat/role-et-fonctionnement/lindemnite-parlementaire.html",
    sections: [
      {
        titre: "Indemnité parlementaire (revenu personnel)",
        icone: "💰",
        couleur: "#2B4C8C",
        texte: "Identique à celle des députés, l'indemnité parlementaire des sénateurs est fixée par la même ordonnance organique. Elle est imposable et soumise aux cotisations sociales. Le montant brut mensuel est de 7 637,39 € depuis le 1er janvier 2024.",
        lignes: [
          { label: "Indemnité de base",       montant: "5 931,95 €/mois bruts", imposable: true },
          { label: "Indemnité de résidence (3 %)", montant: "177,96 €/mois bruts", imposable: true },
          { label: "Indemnité de fonction (25 %)", montant: "1 527,48 €/mois bruts", imposable: true },
          { label: "Net avant impôt",         montant: "~5 676 €/mois", imposable: true, note: "Légèrement inférieur à l'AN selon les organismes" },
          { label: "Cumul mandat local maxi", montant: "+ 2 965 €/mois max", note: "Plafond identique à celui des députés" },
        ],
      },
      {
        titre: "Avance pour frais de mandat (AFM)",
        icone: "📋",
        couleur: "#2B8C6B",
        texte: "Le Sénat maintient l'appellation « Avance pour frais de mandat » (AFM), contrairement à l'AN qui a créé la DFP en juillet 2025. L'AFM sénatoriale est légèrement supérieure à son équivalent à l'Assemblée. Tous les frais doivent être justifiés via l'application JULIA, et le Comité de déontologie contrôle 100% des sénateurs chaque mandat. Les sommes non dépensées ne sont pas reversées l'année suivante mais restent bloquées sur le compte dédié.",
        lignes: [
          { label: "AFM mensuelle (métropole)", montant: "6 600 €/mois", note: "Depuis nov. 2023 — supérieure à l'AFM des députés de 650 €" },
          { label: "Enveloppe collaborateurs (1 à 5)",   montant: "8 827,40 €/mois bruts", note: "Versée directement aux collaborateurs" },
          { label: "Justification obligatoire",          montant: "≥ 85 % des dépenses", note: "Via application JULIA, contrôle annuel 100% des sénateurs" },
          { label: "Dépenses interdites",                montant: "—", note: "Achat immobilier, frais électoraux, amendes, dépenses personnelles" },
        ],
      },
      {
        titre: "Déplacements pris en charge",
        icone: "🚆",
        couleur: "#F7A80D",
        texte: "Les sénateurs bénéficient des mêmes avantages de déplacements que les députés pour les trajets liés à leur mandat.",
        lignes: [
          { label: "Réseau SNCF intégral",           montant: "Gratuit",   note: "1ère classe" },
          { label: "Vols Paris ↔ circonscription",   montant: "Forfait",   note: "Pris en charge selon distance" },
          { label: "Transports urbains Paris",        montant: "Pris en charge", note: "Navigo ou équivalent" },
          { label: "Taxis et autres transports",      montant: "Sur AFM",   note: "Sur justificatif" },
        ],
      },
      {
        titre: "Avantages en nature",
        icone: "🏛️",
        couleur: "#8B4513",
        texte: "Les sénateurs disposent d'avantages liés au Palais du Luxembourg. Le Sénat met à disposition certains services directement, réduisant d'autant le besoin de recourir à l'AFM.",
        lignes: [
          { label: "Bureau au Palais du Luxembourg",      montant: "Mis à disposition" },
          { label: "Téléphonie, affranchissement",        montant: "Pris en charge directement" },
          { label: "Restaurant, salon de coiffure, kiosque à journaux", montant: "À tarif préférentiel", note: "Services propres au Sénat" },
          { label: "Salle de réunion, documentation",     montant: "Mis à disposition" },
          { label: "Informatique",                        montant: "Sur AFM",   note: "Finançable via l'enveloppe de mandat" },
        ],
      },
      {
        titre: "Retraite et fin de mandat",
        icone: "🔒",
        couleur: "#6B2B8C",
        texte: "Les sénateurs cotisent à la Caisse des retraites des anciens sénateurs, alimentée par leurs cotisations personnelles (1 180 €/mois) et une contribution du Sénat, sans subvention extérieure de l'État. La pension moyenne en 2023 était de 3 391 €/mois, ce qui reflète des carrières parlementaires souvent longues.",
        lignes: [
          { label: "Pension moyenne anciens sénateurs",  montant: "3 391 €/mois nets (2023)" },
          { label: "Cotisation personnelle mensuelle",   montant: "~1 180 €/mois", note: "Prélevée sur l'indemnité" },
          { label: "Âge minimum de départ",              montant: "62 ans (64 avec réforme)" },
          { label: "Pension de réversion conjoint",      montant: "60 %", note: "En cas de décès" },
          { label: "Allocation funéraire",               montant: "~36 000 €", note: "6 mois de rémunération" },
          { label: "Allocation fin de mandat",           montant: "Dégressive jusqu'à 64 ans", note: "Pour sénateurs non réélus sans activité" },
        ],
      },
    ],
  },

  ministre: {
    titre: "Rémunération d'un membre du gouvernement",
    intro: "La rémunération des membres du gouvernement est fixée par le décret n° 2012-983 du 23 août 2012, suite à la décision de François Hollande de réduire de 30 % les rémunérations des plus hauts dirigeants de l'État. Elle est soumise à l'impôt sur le revenu. Les membres du gouvernement ne peuvent cumuler leurs fonctions avec aucun mandat électif.",
    totalBrut: "10 692 €/mois bruts (ministre)",
    totalNet: "~8 000 €/mois nets (avant impôt)",
    sourceLabel: "Source : Décret n° 2012-983 du 23 août 2012 — Légifrance — PLF 2025",
    sourceUrl: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000026315633",
    sections: [
      {
        titre: "Traitement mensuel (selon rang)",
        icone: "💰",
        couleur: "#2B4C8C",
        texte: "La rémunération des membres du gouvernement est différenciée selon leur rang. Depuis janvier 2024 (dernière revalorisation), les montants bruts mensuels sont les suivants. Ces montants sont imposables et soumis aux cotisations sociales. Les ministres ne cumulent aucune indemnité parlementaire ni aucun autre mandat.",
        lignes: [
          { label: "Premier ministre",         montant: "16 038 €/mois bruts", imposable: true, note: "= Président de la République depuis 2012" },
          { label: "Ministre de plein exercice", montant: "10 692 €/mois bruts", imposable: true },
          { label: "Ministre délégué / Secrétaire d'État", montant: "10 157 €/mois bruts", imposable: true },
          { label: "Net avant impôt (ministre)", montant: "~8 000 €/mois", note: "Estimation après cotisations sociales" },
          { label: "Net après impôt (ministre)", montant: "~6 000-7 000 €/mois", note: "Variable selon taux personnel" },
          { label: "Indemnité départ (3 mois)", montant: "~32 000-48 000 €", note: "Si non réélection ou pas d'activité reprise" },
        ],
      },
      {
        titre: "Frais de représentation et fonctionnement",
        icone: "📋",
        couleur: "#2B8C6B",
        texte: "Les ministres disposent d'enveloppes de fonctionnement prises en charge par leur ministère. Ces montants sont destinés à couvrir les dépenses de représentation officielle et ne constituent pas un revenu personnel. Le Premier ministre bénéficie d'une enveloppe spécifique supplémentaire.",
        lignes: [
          { label: "Frais de représentation (Premier ministre)", montant: "150 000 €/an max", note: "Réceptions, déplacements diplomatiques, protocole" },
          { label: "Cabinet ministériel",         montant: "Variable selon ministère", note: "Directeur de cabinet, conseillers, chargés de mission — liste publiée au PLF" },
          { label: "Frais de télécommunications", montant: "Pris en charge" },
          { label: "Dépenses de sécurité",        montant: "Pris en charge", note: "Protection policière rapprochée en exercice" },
        ],
      },
      {
        titre: "Déplacements pris en charge",
        icone: "✈️",
        couleur: "#F7A80D",
        texte: "Les déplacements des membres du gouvernement sont entièrement pris en charge par l'État dans le cadre de leurs fonctions. L'accès à la flotte aérienne gouvernementale (Escadron de transport 60 de l'armée de l'air) est réservé aux déplacements officiels.",
        lignes: [
          { label: "Réseau SNCF intégral",        montant: "Gratuit",    note: "1ère classe" },
          { label: "Voiture de fonction blindée avec chauffeur", montant: "Mis à disposition en permanence" },
          { label: "Flotte aérienne gouvernementale (Falcon)", montant: "Accès selon rang et mission", note: "Armée de l'air — Escadron de transport 60" },
          { label: "Transport officiel à Paris",   montant: "Véhicule dédié" },
        ],
      },
      {
        titre: "Avantages en nature",
        icone: "🏛️",
        couleur: "#8B4513",
        texte: "Chaque ministre dispose d'un hôtel particulier (logement de fonction ministériel) à Paris. Ces logements sont mis à disposition gratuitement, y compris leur entretien et leur personnel. Le Premier ministre bénéficie de deux résidences officielles. Ces avantages cessent automatiquement à la fin des fonctions (1 mois pour quitter le logement).",
        lignes: [
          { label: "Logement de fonction (hôtel ministériel)", montant: "Gratuit + charges + personnel" },
          { label: "Alternative : remboursement loyer",        montant: "80 m² + 20 m²/enfant max",   note: "Option alternative au logement de fonction" },
          { label: "Premier ministre : Matignon",               montant: "Résidence officielle + bureaux" },
          { label: "Premier ministre : château de Souzy-la-Briche", montant: "Résidence secondaire (Essonne)" },
          { label: "Fin de fonctions",                          montant: "1 mois pour quitter le logement", note: "Tous avantages cessent immédiatement" },
          { label: "Anciens PM : voiture + chauffeur (post-mandat)", montant: "Limité à 10 ans", note: "Décret du 16 sept. 2025 — fin des avantages à vie" },
        ],
      },
      {
        titre: "Retraite et après-mandat",
        icone: "🔒",
        couleur: "#6B2B8C",
        texte: "Contrairement à une idée reçue, les ministres ne bénéficient pas d'une retraite spécifique à leur fonction. Ils cotisent aux régimes classiques (CNAV + IRCANTEC) comme tout salarié. L'indemnité de départ de 3 mois est versée uniquement s'ils ne reprennent pas d'activité rémunérée immédiatement.",
        lignes: [
          { label: "Retraite spécifique liée à la fonction", montant: "Non", note: "Cotisation aux régimes de droit commun (CNAV + IRCANTEC)" },
          { label: "Indemnité de départ (3 mois)",          montant: "= 1 mois de traitement × 3", note: "Uniquement si pas d'activité rémunérée reprise" },
          { label: "Assurance chômage",                     montant: "Non",   note: "Les ministres ne cotisent pas à l'assurance-chômage" },
          { label: "Protection policière post-mandat",      montant: "Selon risque évalué", note: "Ministres Intérieur : maintien possible selon menace" },
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
    <div style={{ marginTop: "3rem" }}>
      {/* En-tête */}
      <div style={{ borderTop: "3px solid var(--rouge)", paddingTop: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.375rem", fontWeight: 700, color: "var(--encre)", margin: 0 }}>
              {"💶 "}{data.titre}
            </h3>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ background: "var(--bleu-pale)", borderRadius: "var(--radius-sm)", padding: ".625rem 1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--bleu)" }}>{data.totalBrut}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-2)", marginTop: ".2rem" }}>{"Brut mensuel"}</div>
            </div>
            <div style={{ background: "var(--rouge-pale)", borderRadius: "var(--radius-sm)", padding: ".625rem 1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 700, color: "var(--rouge)" }}>{data.totalNet}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-2)", marginTop: ".2rem" }}>{"Net avant impôt"}</div>
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "var(--sans)", fontSize: ".9375rem", color: "var(--gris-1)", lineHeight: 1.7, marginTop: "1rem", maxWidth: 800 }}>
          {data.intro}
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {data.sections.map((section) => (
          <div key={section.titre} className="carte" style={{ padding: "1.25rem 1.5rem" }}>
            {/* Titre section */}
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".875rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{section.icone}</span>
              <span style={{
                fontFamily: "var(--sans)", fontWeight: 700, fontSize: ".8125rem",
                textTransform: "uppercase", letterSpacing: ".05em", color: section.couleur,
              }}>{section.titre}</span>
            </div>

            {/* Texte explicatif */}
            {section.texte && (
              <p style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-1)", lineHeight: 1.65, marginBottom: "1rem", fontStyle: "italic" }}>
                {section.texte}
              </p>
            )}

            {/* Lignes montants */}
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {section.lignes.map((ligne, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  paddingBottom: ".5rem",
                  borderBottom: i < section.lignes.length - 1 ? "1px solid var(--gris-5)" : "none",
                  gap: ".75rem",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--encre)", lineHeight: 1.4 }}>
                      {ligne.label}
                      {ligne.imposable && (
                        <span style={{ marginLeft: ".375rem", background: "#FFF3CD", color: "#856404", fontSize: ".65rem", padding: ".1rem .3rem", borderRadius: 2, fontFamily: "var(--sans)" }}>
                          {"imposable"}
                        </span>
                      )}
                    </div>
                    {ligne.note && (
                      <div style={{ fontFamily: "var(--sans)", fontSize: ".7rem", color: "var(--gris-3)", marginTop: ".125rem", lineHeight: 1.4 }}>
                        {ligne.note}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: ".8125rem", fontWeight: 600,
                    color: ligne.montant === "Non" ? "var(--rouge)" : section.couleur,
                    textAlign: "right", flexShrink: 0, minWidth: 80,
                  }}>
                    {ligne.montant}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comparaison salaire médian */}
      <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "var(--creme-fonce)", borderRadius: "var(--radius-md)", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)" }}>{"Salaire médian France (2025) : "}</span>
          <strong style={{ fontFamily: "var(--mono)", fontSize: ".875rem" }}>{"2 100 €/mois nets"}</strong>
        </div>
        <div>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)" }}>{"Indemnité nette vs médiane : "}</span>
          <strong style={{ fontFamily: "var(--mono)", fontSize: ".875rem", color: "var(--rouge)" }}>
            {type === "ministre" ? "×3,8" : "×2,7"}
          </strong>
        </div>
        <div>
          <span style={{ fontFamily: "var(--sans)", fontSize: ".8125rem", color: "var(--gris-2)" }}>{"SMIC net (2025) : "}</span>
          <strong style={{ fontFamily: "var(--mono)", fontSize: ".875rem" }}>{"1 426 €/mois"}</strong>
        </div>
      </div>

      {/* Source */}
      <div style={{ marginTop: ".75rem", fontFamily: "var(--sans)", fontSize: ".75rem", color: "var(--gris-3)", fontStyle: "italic" }}>
        <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gris-2)" }}>
          {data.sourceLabel}
        </a>
        {" · Ordonnance n° 58-1210 du 13 décembre 1958 · Décret n° 2012-983 du 23 août 2012"}
      </div>
    </div>
  );
}
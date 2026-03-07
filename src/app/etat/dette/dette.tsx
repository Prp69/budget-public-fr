// src/app/etat/dette/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Dette publique française — Budget Public",
  description: "Évolution de la dette publique française de 1980 à 2024 : causes, mécanismes, comparaison européenne. Données Banque de France / INSEE.",
};

const HISTORIQUE = [
  { annee: 1980, dette_pib: 20.7,  montant_md: 130 },
  { annee: 1985, dette_pib: 30.6,  montant_md: 280 },
  { annee: 1990, dette_pib: 35.2,  montant_md: 400 },
  { annee: 1995, dette_pib: 55.5,  montant_md: 720 },
  { annee: 2000, dette_pib: 57.3,  montant_md: 870 },
  { annee: 2005, dette_pib: 67.4,  montant_md: 1_130 },
  { annee: 2008, dette_pib: 68.8,  montant_md: 1_318 },
  { annee: 2010, dette_pib: 81.7,  montant_md: 1_589 },
  { annee: 2015, dette_pib: 95.6,  montant_md: 2_098 },
  { annee: 2019, dette_pib: 97.4,  montant_md: 2_380 },
  { annee: 2020, dette_pib: 114.6, montant_md: 2_650 },
  { annee: 2021, dette_pib: 112.9, montant_md: 2_813 },
  { annee: 2022, dette_pib: 111.6, montant_md: 2_950 },
  { annee: 2023, dette_pib: 110.6, montant_md: 3_062 },
  { annee: 2024, dette_pib: 112.0, montant_md: 3_162 },
];

const COMPARAISON_UE = [
  { pays: "Grèce",       pib: 161.9, couleur: "#dc2626" },
  { pays: "Italie",      pib: 137.3, couleur: "#dc2626" },
  { pays: "France",      pib: 112.0, couleur: "#003189" },
  { pays: "Espagne",     pib: 107.7, couleur: "#f59e0b" },
  { pays: "Portugal",    pib: 99.1,  couleur: "#f59e0b" },
  { pays: "Zone euro",   pib: 88.6,  couleur: "#6b7280" },
  { pays: "UE-27",       pib: 81.7,  couleur: "#6b7280" },
  { pays: "Allemagne",   pib: 63.6,  couleur: "#16a34a" },
  { pays: "Pays-Bas",    pib: 46.6,  couleur: "#16a34a" },
  { pays: "Danemark",    pib: 29.5,  couleur: "#16a34a" },
];

const CAUSES = [
  {
    periode: "1974 – 1993",
    titre: "Premier choc — les chocs pétroliers",
    texte: "La fin des Trente Glorieuses et les chocs pétroliers de 1973 et 1979 entraînent un ralentissement économique brutal. L'État s'endette pour maintenir les dépenses sociales. La dette passe de 15% à 55% du PIB.",
    emoji: "🛢️",
  },
  {
    periode: "1994 – 2007",
    titre: "Stabilisation sans remboursement",
    texte: "La France stabilise son ratio dette/PIB autour de 60-65%, profitant de la croissance et de la baisse des taux. Mais la dette nominale continue de croître : les déficits annuels s'accumulent.",
    emoji: "📊",
  },
  {
    periode: "2008 – 2012",
    titre: "Crise financière mondiale",
    texte: "La crise des subprimes (2008) et la récession qui suit obligent l'État à soutenir l'économie massivement. En 4 ans, la dette bondit de 68% à 90% du PIB (+650 Md€ en valeur nominale).",
    emoji: "📉",
  },
  {
    periode: "2020 – 2021",
    titre: "COVID-19 — quoi qu'il en coûte",
    texte: "La pandémie provoque le plus grand choc budgétaire depuis la guerre : chômage partiel, PGE, plan de relance. En 2020, le déficit atteint 9,1% du PIB et la dette franchit les 100%.",
    emoji: "🦠",
  },
  {
    periode: "2022 – 2024",
    titre: "Crise de l'énergie et inflation",
    texte: "Le bouclier tarifaire sur l'énergie (45 Md€) et les mesures anti-inflation maintiennent les dépenses à un niveau élevé. La remontée des taux depuis 2022 alourdit la charge de la dette.",
    emoji: "⚡",
  },
];

const maxPib = Math.max(...COMPARAISON_UE.map((c) => c.pib));
const maxHistorique = Math.max(...HISTORIQUE.map((h) => h.montant_md));

export default function EtatDettePage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section style={{
          background: "linear-gradient(135deg, #1a0f0f 0%, #7f1d1d 50%, #C1292E 100%)",
          padding: "4.5rem 0 4rem",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          <div className="container" style={{ position: "relative" }}>
            <Link href="/etat" style={{ color: "rgba(255,255,255,.6)", fontSize: ".875rem", display: "inline-flex", alignItems: "center", gap: ".375rem", marginBottom: "1.5rem", textDecoration: "none" }}>
              {"← Dépenses de l'État"}
            </Link>
            <h1 style={{ color: "white", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-.03em" }}>
              {"Dette publique française"}
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "clamp(.9375rem, 2vw, 1.0625rem)", lineHeight: 1.7, maxWidth: 560, marginBottom: "2.5rem" }}>
              {"Évolution, causes et comparaison européenne de la dette des administrations publiques françaises."}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
              {[
                { val: "3 162 Md€", lbl: "Montant total (fin 2023)" },
                { val: "112 %", lbl: "Part du PIB (2024)" },
                { val: "47 400 €", lbl: "Par habitant" },
                { val: "54 Md€", lbl: "Charge annuelle des intérêts" },
              ].map((s) => (
                <div key={s.lbl}>
                  <div style={{ fontSize: "1.625rem", fontWeight: 800, color: "white", letterSpacing: "-.03em" }}>{s.val}</div>
                  <div style={{ fontSize: ".8125rem", color: "rgba(255,255,255,.5)", marginTop: ".2rem" }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ÉVOLUTION HISTORIQUE */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Évolution depuis 1980"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"En milliards d'euros courants — administrations publiques au sens de Maastricht."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {HISTORIQUE.map((h) => (
                <div key={h.annee} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto", gap: "1rem", alignItems: "center" }}>
                  <div style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--texte-secondaire)", textAlign: "right" }}>{h.annee}</div>
                  <div style={{ background: "var(--surface)", borderRadius: 99, height: 22, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: h.dette_pib > 100 ? "#dc2626" : h.dette_pib > 80 ? "#f59e0b" : "#003189",
                      width: (h.montant_md / maxHistorique * 100) + "%",
                      display: "flex", alignItems: "center", paddingLeft: ".5rem",
                    }}>
                      <span style={{ fontSize: ".75rem", color: "white", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {h.montant_md} Md€
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: ".8125rem", fontWeight: 700,
                    color: h.dette_pib > 100 ? "#dc2626" : h.dette_pib > 80 ? "#b45309" : "#374151",
                    textAlign: "right", whiteSpace: "nowrap",
                  }}>
                    {h.dette_pib.toFixed(1)} % PIB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAUSES */}
        <section style={{ background: "var(--bleu-pale)", borderTop: "1px solid var(--bordure)", padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Les grandes étapes de l'endettement"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"Pourquoi la France s'est-elle autant endettée ? Un historique des crises et des choix politiques."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 860 }}>
              {CAUSES.map((c) => (
                <div key={c.periode} style={{
                  background: "var(--blanc)",
                  border: "1px solid var(--bordure)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1.25rem",
                  alignItems: "start",
                  boxShadow: "var(--ombre-xs)",
                }}>
                  <span style={{ fontSize: "2rem", lineHeight: 1, flexShrink: 0 }}>{c.emoji}</span>
                  <div>
                    <div style={{ fontSize: ".75rem", fontWeight: 700, color: "var(--rouge-accent)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: ".25rem" }}>{c.periode}</div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--texte-primaire)", marginBottom: ".5rem" }}>{c.titre}</h3>
                    <p style={{ fontSize: ".875rem", color: "var(--texte-secondaire)", lineHeight: 1.7, margin: 0 }}>{c.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARAISON UE */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="divider" style={{ marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>{"Comparaison européenne"}</h2>
            <p style={{ color: "var(--texte-secondaire)", marginBottom: "2.5rem", fontSize: ".9375rem" }}>
              {"Dette publique en % du PIB — données Eurostat 2023."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".625rem", maxWidth: 720 }}>
              {COMPARAISON_UE.map((p) => (
                <div key={p.pays} style={{ display: "grid", gridTemplateColumns: "120px 1fr 70px", gap: "1rem", alignItems: "center" }}>
                  <div style={{
                    fontSize: ".875rem",
                    fontWeight: p.pays === "France" ? 700 : 500,
                    color: p.pays === "France" ? "var(--bleu-marine)" : "var(--texte-primaire)",
                  }}>{p.pays}</div>
                  <div style={{ background: "var(--surface)", borderRadius: 99, height: 18, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: p.couleur,
                      width: (p.pib / maxPib * 100) + "%",
                    }} />
                  </div>
                  <div style={{
                    fontSize: ".875rem", fontWeight: 700, textAlign: "right",
                    color: p.pays === "France" ? "var(--bleu-marine)" : "var(--texte-secondaire)",
                  }}>
                    {p.pib.toFixed(1)} %
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/etat/ministeres" className="btn" style={{ background: "var(--bleu-marine)", color: "white" }}>
                {"Budget par ministère →"}
              </Link>
              <Link href="/impots" className="btn" style={{ background: "var(--blanc)", color: "var(--texte-primaire)", border: "1px solid var(--bordure)" }}>
                {"Voir les recettes fiscales →"}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer style={{ background: "var(--bleu-marine)", color: "rgba(255,255,255,.6)", padding: "1.5rem 0", textAlign: "center", fontSize: ".8125rem" }}>
        <div className="container">{"© 2026 Budget Public — Données INSEE / Banque de France / Eurostat — Licence Ouverte v2.0"}</div>
      </footer>
    </>
  );
}
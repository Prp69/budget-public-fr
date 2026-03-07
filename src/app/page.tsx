// src/app/page.tsx — Server Component
import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { getChiffresNationaux } from "@/lib/api";

export const metadata: Metadata = {
  title: "Budget Public — Les finances de votre commune, sans détour",
  description: "Consultez les dépenses, la dette et les investissements de toutes les communes françaises. Données officielles DGFiP / OFGL / INSEE.",
};

export default async function HomePage() {
  const chiffres = await getChiffresNationaux();

  return <HomeClient chiffres={chiffres} />;
}
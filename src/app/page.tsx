// src/app/page.tsx — Server Component
import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { getChiffresNationaux } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Budget Public — Les dépenses publiques françaises en données officielles',
  description:
    'Consultez les finances de votre commune en toute transparence. Dépenses, investissements, dette : des données issues de sources officielles (DGFiP, INSEE) pour les 34 900 communes françaises.',
};

export default async function Page() {
  // Chargement des données réelles au moment du rendu — côté serveur
  const chiffresNationaux = await getChiffresNationaux();

  return <HomeClient chiffresNationaux={chiffresNationaux} />;
}
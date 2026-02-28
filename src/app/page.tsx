import { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'Budget Public — Les dépenses publiques françaises en données officielles',
  description:
    "Consultez les finances de votre commune en toute transparence. Dépenses, investissements, dette : des données issues de sources officielles (DGFiP, INSEE) pour les 34 900 communes françaises.",
};

export default function Page() {
  return <HomeClient />;
}
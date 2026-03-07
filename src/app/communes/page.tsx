// src/app/communes/page.tsx
// Page liste et recherche de communes — Server Component

import { Metadata } from "next";
import CommunesClient from "@/components/CommunesClient";

export const metadata: Metadata = {
  title: "Toutes les communes — Budget Public",
  description: "Recherchez parmi les 34 900 communes françaises et consultez leurs finances officielles.",
};

export default function PageCommunes() {
  return <CommunesClient />;
}

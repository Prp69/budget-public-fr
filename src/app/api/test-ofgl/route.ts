// src/app/api/test-ofgl/route.ts
import { NextResponse } from "next/server";

const OFGL_BASE = "https://data.ofgl.fr/api/explore/v2.1/catalog/datasets";
const DATASET   = "ofgl-base-communes-consolidee";

export async function GET() {
  const resultats: Record<string, unknown> = {};

  // TEST 1 : liste tous les agrégats distincts disponibles
  try {
    const url = `${OFGL_BASE}/${DATASET}/records?select=agregat&group_by=agregat&limit=100`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await r.json();
    resultats["agregats_disponibles"] = {
      status: r.status,
      liste: data?.results?.map((x: Record<string,string>) => x.agregat).sort(),
    };
  } catch (e) { resultats["agregats_disponibles"] = { erreur: String(e) }; }

  // TEST 2 : Paris avec filtre date correct
  try {
    const url = `${OFGL_BASE}/${DATASET}/records?where=com_code%3D%2275056%22%20AND%20exer%3Ddate'2023-01-01'&select=agregat%2Cmontant%2Cptot%2Ceuros_par_habitant&limit=50`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await r.json();
    resultats["test_paris_2023"] = {
      status: r.status,
      total: data?.total_count,
      resultats: data?.results,
    };
  } catch (e) { resultats["test_paris_2023"] = { erreur: String(e) }; }

  // TEST 3 : Lyon avec filtre date correct
  try {
    const url = `${OFGL_BASE}/${DATASET}/records?where=com_code%3D%2269123%22%20AND%20exer%3Ddate'2023-01-01'&select=agregat%2Cmontant%2Cptot&limit=50`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await r.json();
    resultats["test_lyon_2023"] = {
      status: r.status,
      total: data?.total_count,
      agregats_trouves: data?.results?.map((x: Record<string, unknown>) => x.agregat),
    };
  } catch (e) { resultats["test_lyon_2023"] = { erreur: String(e) }; }

  return NextResponse.json(resultats, { status: 200 });
}
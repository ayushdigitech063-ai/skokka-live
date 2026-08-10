import type { Metadata } from "next";
import { buildCitiesSEO } from "@/lib/seo/seoEngine";
import CitiesClientPage from "./CitiesClient";

export const metadata: Metadata = buildCitiesSEO();

export default function CitiesPage() {
  return <CitiesClientPage />;
}

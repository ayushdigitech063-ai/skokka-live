import type { Metadata } from "next";
import { buildCitiesSEO } from "@/lib/seo/seoEngine";
import LocationsClientPage from "./LocationsClient";

export const metadata: Metadata = buildCitiesSEO();

export default function LocationsPage() {
  return <LocationsClientPage />;
}

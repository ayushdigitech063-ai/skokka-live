import type { Metadata } from "next";
import { buildEscortsSEO } from "@/lib/seo/seoEngine";
import EscortsClient from "./EscortsClient";

export const metadata: Metadata = buildEscortsSEO();

export default function EscortsPage() {
  return <EscortsClient />;
}

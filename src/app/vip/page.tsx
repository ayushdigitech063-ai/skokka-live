import type { Metadata } from "next";
import { buildVipSEO } from "@/lib/seo/seoEngine";
import VipClientPage from "./VipClient";

export const metadata: Metadata = buildVipSEO();

export default function VipEscortsPage() {
  return <VipClientPage />;
}

import type { Metadata } from "next";
import { buildCallGirlsSEO } from "@/lib/seo/seoEngine";
import EscortsClient from "@/app/escorts-service/EscortsClient";

export const metadata: Metadata = buildCallGirlsSEO();

export default function CallGirlsPage() {
  return <EscortsClient defaultTag="Call Girls" baseRoute="/call-girls" />;
}

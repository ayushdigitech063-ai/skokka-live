import { use } from "react";
import type { Metadata } from "next";
import { buildCallGirlsCitySEO } from "@/lib/seo/seoEngine";
import EscortsClient from "@/app/escorts-service/EscortsClient";

interface Params {
  params: Promise<{ cityname: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { cityname } = await params;
  
  const formattedCityName = cityname
    ? cityname.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "All Cities";

  return buildCallGirlsCitySEO(formattedCityName);
}

export default function CallGirlsCityPage({ params }: Params) {
  const resolved = use(params);
  const { cityname } = resolved;

  const formattedCityName = cityname
    ? cityname.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "All Cities";

  return <EscortsClient defaultCity={formattedCityName} defaultTag="Call Girls" baseRoute="/call-girls" />;
}

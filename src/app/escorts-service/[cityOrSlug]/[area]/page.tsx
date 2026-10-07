import { use } from "react";
import type { Metadata } from "next";
import { buildAreaSEO } from "@/lib/seo/seoEngine";
import EscortsClient from "../../EscortsClient";

interface AreaPageProps {
  params: Promise<{ cityOrSlug: string; area: string }>;
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { cityOrSlug, area } = await params;
  const cityName = cityOrSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const areaName = area
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return buildAreaSEO({ areaName, cityName });
}

export default function AreaEscortsPage({ params }: AreaPageProps) {
  const resolved = use(params);
  const { cityOrSlug, area } = resolved;

  const cityName = cityOrSlug
    ? cityOrSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "All Cities";
  const areaName = area
    ? area
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "All Escorts";

  return <EscortsClient defaultCity={cityName} defaultTag={areaName} />;
}

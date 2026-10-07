import { use } from "react";
import type { Metadata } from "next";
import { buildAreaSEO, buildProfileSEO } from "@/lib/seo/seoEngine";
import EscortsClient from "../../EscortsClient";
import ProfileClientPage from "@/app/profile/[id]/ProfileClientPage";

interface AreaPageProps {
  params: Promise<{ cityOrSlug: string; area: string }>;
}

const isProfileSlug = (slug: string) => /-(sk-\d+)$/i.test(slug) || /-([a-f0-9]{24})$/i.test(slug);

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { cityOrSlug, area } = await params;
  const cityName = cityOrSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (isProfileSlug(area)) {
    return buildProfileSEO({
      name: area.replace(/-(sk-\d+|[a-f0-9]{24})$/i, "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      cityName,
      dbOverride: { canonicalUrl: `/escorts-service/${cityOrSlug}/${area}` }
    });
  }

  const areaName = area
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return buildAreaSEO({ areaName, cityName });
}

export default function AreaEscortsPage({ params }: AreaPageProps) {
  const resolved = use(params);
  const { cityOrSlug, area } = resolved;

  if (isProfileSlug(area)) {
    return <ProfileClientPage params={Promise.resolve({ id: area })} />;
  }

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

import { use } from "react";
import type { Metadata } from "next";
import { buildAreaSEO, buildProfileSEO } from "@/lib/seo/seoEngine";
import EscortsClient from "../../EscortsClient";
import ProfileClientPage from "@/app/profile/[id]/ProfileClientPage";

interface AreaPageProps {
  params: Promise<{ city: string; area: string }>;
}

// Detect if segment is a profile slug (contains sk- id pattern)
function isProfileSlug(segment: string): boolean {
  return /sk-\d+/i.test(segment);
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { city, area } = await params;
  const cityName = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (isProfileSlug(area)) {
    const profileName = area
      .replace(/-sk-\d+/i, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return buildProfileSEO({
      name: profileName || "Verified Escort Model",
      cityName,
      dbOverride: {
        canonicalUrl: `/escorts/${city}/${area}`,
      },
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
  const { city, area } = resolved;

  if (isProfileSlug(area)) {
    // Render profile detail page — area segment IS the profile slug
    return <ProfileClientPage params={Promise.resolve({ id: area })} />;
  }

  // Convert slug "jaipur" → "Jaipur", "vaishali-nagar" → "Vaishali Nagar"
  const cityName = city
    ? city
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

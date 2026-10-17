import type { Metadata } from "next";
import { redirect, permanentRedirect } from "next/navigation";
import {
  buildAreaSEO,
  buildProfileSEO,
  buildCategorySEO,
  buildCallGirlsCitySEO,
  fetchCitySeoData,
  fetchAreaSeoData,
  getAreaPageMetadata,
  CityJsonLd,
  AreaJsonLd,
} from "@/lib/seo/seoEngine";
import EscortsClient from "../../EscortsClient";
import ProfileClientPage from "@/app/profile/[id]/ProfileClientPage";

interface AreaPageProps {
  params: Promise<{ cityOrSlug: string; area: string }>;
}

const isProfileSlug = (slug: string) => /-(sk-\d+)$/i.test(slug) || /-([a-f0-9]{24})$/i.test(slug);

const KNOWN_CATEGORIES: Record<string, string> = {
  "call-girls": "Call Girls",
  "vip-escorts": "VIP Escorts",
  "independent-girls": "Independent Girls",
  "college-escorts": "College Escorts",
  "russian-escorts": "Russian Escorts",
  "massages": "Massages",
  "adult-meetings": "Adult Meetings",
};

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

  // Check if this area/sub-slug exists in DB with custom developer SEO overrides
  const areaData = await fetchAreaSeoData(area);
  if (areaData) {
    return getAreaPageMetadata(cityName, area);
  }

  const normalizedKey = area.toLowerCase().trim();
  if (normalizedKey === "call-girls") {
    return buildCallGirlsCitySEO(cityName, {
      canonicalUrl: `/escorts-service/${cityOrSlug}/${area}`,
    });
  }

  if (KNOWN_CATEGORIES[normalizedKey]) {
    return buildCategorySEO({
      categoryName: KNOWN_CATEGORIES[normalizedKey],
      cityName,
      dbOverride: {
        canonicalUrl: `/escorts-service/${cityOrSlug}/${area}`,
      },
    });
  }

  return getAreaPageMetadata(cityName, area);
}

export default async function AreaEscortsPage({ params }: AreaPageProps) {
  const { cityOrSlug, area } = await params;

  if (isProfileSlug(area)) {
    return <ProfileClientPage params={Promise.resolve({ id: area })} />;
  }

  // Check if developer configured 301 / 302 redirect for this area
  const areaData = await fetchAreaSeoData(area);
  if (areaData?.redirectUrl) {
    if (areaData.redirectType === "301") {
      permanentRedirect(areaData.redirectUrl);
    } else if (areaData.redirectType === "302") {
      redirect(areaData.redirectUrl);
    }
  }

  const cityData = await fetchCitySeoData(cityOrSlug);
  const cityName =
    cityData?.name ||
    (cityOrSlug
      ? cityOrSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "All Cities");
  const areaName =
    areaData?.name ||
    (area
      ? area
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "All Escorts");

  return (
    <>
      <AreaJsonLd
        area={areaData}
        cityName={cityName}
        areaName={areaName}
        canonicalUrl={areaData?.canonicalUrl || `https://mycityqueen.com/escorts-service/${cityOrSlug}/${area}`}
      />
      <EscortsClient
        defaultCity={cityName}
        defaultTag={areaName}
        citySeo={cityData || undefined}
        areaSeo={areaData || undefined}
      />
    </>
  );
}

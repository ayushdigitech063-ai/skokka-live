import type { Metadata } from "next";
import {
  fetchAreaSeoData,
  fetchCitySeoData,
  AreaJsonLd,
  slugifyPath,
} from "@/lib/seo/seoEngine";
import EscortsClient from "../../../EscortsClient";
import { IArea, ICity } from "@/types/location";

interface AreaCategoryPageProps {
  params: Promise<{ cityOrSlug: string; area: string; category: string }>;
}

const KNOWN_CATEGORIES: Record<string, string> = {
  "call-girls": "Call Girls",
  "vip-escorts": "VIP Escorts",
  "independent-girls": "Independent Girls",
  "college-escorts": "College Escorts",
  "russian-escorts": "Russian Escorts",
  "massages": "Massages",
  "adult-meetings": "Adult Meetings",
};

/**
 * Resolves area and category slugs regardless of URL segment order:
 * handles both /city/category/area (e.g. /bengaluru/call-girls/rt-nagar)
 * and legacy /city/area/category (e.g. /bengaluru/rt-nagar/call-girls).
 */
function resolveAreaAndCategory(segment2: string, segment3: string) {
  let resolvedCategorySlug = segment3;
  let resolvedAreaSlug = segment2;

  const seg2Lower = (segment2 || "").toLowerCase().trim();
  const seg3Lower = (segment3 || "").toLowerCase().trim();

  if (KNOWN_CATEGORIES[seg2Lower] && !KNOWN_CATEGORIES[seg3Lower]) {
    resolvedCategorySlug = segment2;
    resolvedAreaSlug = segment3;
  }

  return {
    areaSlug: resolvedAreaSlug,
    categorySlug: resolvedCategorySlug,
  };
}

export async function generateMetadata({ params }: AreaCategoryPageProps): Promise<Metadata> {
  const { cityOrSlug, area, category } = await params;
  const { areaSlug, categorySlug } = resolveAreaAndCategory(area, category);

  const cityName = cityOrSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const areaData = await fetchAreaSeoData(areaSlug);
  const areaName =
    areaData?.name ||
    areaSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const categoryName =
    KNOWN_CATEGORIES[categorySlug.toLowerCase().trim()] ||
    categorySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const title = `${categoryName} in ${areaName}, ${cityName} | 100% Verified Escorts | MyCityQueen`;
  const description = `Find verified ${categoryName.toLowerCase()} and independent companion profiles in ${areaName}, ${cityName}. Direct WhatsApp and phone contact with authentic models for hotel incall and outcall.`;
  const canonical = `https://mycityqueen.com/escorts-service/${slugifyPath(cityOrSlug)}/${slugifyPath(categorySlug)}/${slugifyPath(areaSlug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AreaCategoryPage({ params }: AreaCategoryPageProps) {
  const { cityOrSlug, area, category } = await params;
  const { areaSlug, categorySlug } = resolveAreaAndCategory(area, category);

  const cityName = cityOrSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const areaData = await fetchAreaSeoData(areaSlug);
  const areaName =
    areaData?.name ||
    areaSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const categoryName =
    KNOWN_CATEGORIES[categorySlug.toLowerCase().trim()] ||
    categorySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const cityData = await fetchCitySeoData(cityOrSlug);
  const canonicalUrl = `https://mycityqueen.com/escorts-service/${slugifyPath(cityOrSlug)}/${slugifyPath(categorySlug)}/${slugifyPath(areaSlug)}`;

  return (
    <>
      <AreaJsonLd
        area={areaData}
        cityName={cityName}
        areaName={areaName}
        canonicalUrl={canonicalUrl}
      />
      <EscortsClient
        defaultCity={cityName}
        defaultArea={areaName}
        defaultTag={categoryName}
        citySeo={cityData || undefined}
        areaSeo={areaData || undefined}
        customPageContent={areaData?.pageContent}
        customFaqs={areaData?.faqs}
      />
    </>
  );
}

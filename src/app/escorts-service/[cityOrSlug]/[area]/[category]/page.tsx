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

export async function generateMetadata({ params }: AreaCategoryPageProps): Promise<Metadata> {
  const { cityOrSlug, area, category } = await params;
  const cityName = cityOrSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const areaData = await fetchAreaSeoData(area);
  const areaName =
    areaData?.name ||
    area
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const categoryName = KNOWN_CATEGORIES[category.toLowerCase().trim()] ||
    category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const title = `${categoryName} in ${areaName}, ${cityName} | 100% Verified Escorts | MyCityQueen`;
  const description = `Find verified ${categoryName.toLowerCase()} and independent companion profiles in ${areaName}, ${cityName}. Direct WhatsApp and phone contact with authentic models for hotel incall and outcall.`;
  const canonical = `https://mycityqueen.com/escorts-service/${slugifyPath(cityOrSlug)}/${slugifyPath(area)}/${slugifyPath(category)}`;

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

  const cityName = cityOrSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const areaData = await fetchAreaSeoData(area);
  const areaName =
    areaData?.name ||
    area
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const categoryName = KNOWN_CATEGORIES[category.toLowerCase().trim()] ||
    category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const cityData = await fetchCitySeoData(cityOrSlug);
  const canonicalUrl = `https://mycityqueen.com/escorts-service/${slugifyPath(cityOrSlug)}/${slugifyPath(area)}/${slugifyPath(category)}`;

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

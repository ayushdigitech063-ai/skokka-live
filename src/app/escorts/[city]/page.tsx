import { use } from "react";
import type { Metadata } from "next";
import { buildCitySEO, buildCategorySEO } from "@/lib/seo/seoEngine";
import EscortsClient from "../EscortsClient";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

const CATEGORY_KEYWORDS = [
  "call-girl",
  "call-girls",
  "vip-escort",
  "vip-escorts",
  "independent",
  "college",
  "russian",
  "massage",
  "massages",
  "male-escort",
  "male-escorts",
  "transsexual",
  "adult-meeting",
  "adult-meetings",
  "celebrity",
];

function isCategorySlug(slug: string): boolean {
  if (!slug) return false;
  const s = slug.toLowerCase().trim();
  return CATEGORY_KEYWORDS.some((kw) => s.includes(kw));
}

function formatName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const formatted = formatName(city);

  if (isCategorySlug(city)) {
    return buildCategorySEO({ categoryName: formatted });
  }

  return buildCitySEO({ cityName: formatted, stateName: "India" });
}

export default function CityEscortsPage({ params }: CityPageProps) {
  const { city } = use(params);
  const formatted = formatName(city);

  if (isCategorySlug(city)) {
    return <EscortsClient defaultTag={formatted} defaultCity="All Cities" />;
  }

  return <EscortsClient defaultCity={formatted} defaultTag="All Escorts" />;
}

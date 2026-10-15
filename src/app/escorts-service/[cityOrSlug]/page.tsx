import { use } from "react";
import type { Metadata } from "next";
import {
  buildProfileSEO,
  getCityPageMetadata,
  fetchCitySeoData,
  CityJsonLd,
} from "@/lib/seo/seoEngine";
import EscortsClient from "../EscortsClient";
import ProfileClientPage from "@/app/profile/[id]/ProfileClientPage";

interface Params {
  params: Promise<{ cityOrSlug: string }>;
}

const isProfileSlug = (slug: string) => /-(sk-\d+)$/i.test(slug) || /-([a-f0-9]{24})$/i.test(slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { cityOrSlug } = await params;

  if (isProfileSlug(cityOrSlug)) {
    return buildProfileSEO({
      name: cityOrSlug.replace(/-(sk-\d+|[a-f0-9]{24})$/i, "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      cityName: "India",
      dbOverride: { canonicalUrl: `/escorts-service/${cityOrSlug}` }
    });
  }

  const cityName = cityOrSlug
    ? cityOrSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "All Cities";

  return getCityPageMetadata(cityOrSlug, cityName);
}

export default async function CityOrProfilePage({ params }: Params) {
  const { cityOrSlug } = await params;

  if (isProfileSlug(cityOrSlug)) {
    return <ProfileClientPage params={Promise.resolve({ id: cityOrSlug })} />;
  }

  const cityData = await fetchCitySeoData(cityOrSlug);
  const cityName =
    cityData?.name ||
    (cityOrSlug
      ? cityOrSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "All Cities");

  return (
    <>
      <CityJsonLd city={cityData} cityName={cityName} />
      <EscortsClient defaultCity={cityName} citySeo={cityData || undefined} />
    </>
  );
}

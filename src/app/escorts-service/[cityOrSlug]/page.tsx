import { use } from "react";
import type { Metadata } from "next";
import { redirect, permanentRedirect } from "next/navigation";
import {
  buildProfileSEO,
  buildCategorySEO,
  getCityPageMetadata,
  fetchCitySeoData,
  CityJsonLd,
  fetchLocationSeoData,
  getStatePageMetadata,
  StateJsonLd,
} from "@/lib/seo/seoEngine";
import EscortsClient from "../EscortsClient";
import ProfileClientPage from "@/app/profile/[id]/ProfileClientPage";
import { ICity, IState } from "@/types/location";

interface Params {
  params: Promise<{ cityOrSlug: string }>;
}

const isProfileSlug = (slug: string) => /-(sk-\d+)$/i.test(slug) || /-([a-f0-9]{24})$/i.test(slug);

const KNOWN_CATEGORIES: Record<string, string> = {
  "call-girls": "Call Girls",
  "call_girls": "Call Girls",
  "vip-escorts": "VIP Escorts",
  "vip_escorts": "VIP Escorts",
  "independent-girls": "Independent Girls",
  "independent_girls": "Independent Girls",
  "independent-escorts": "Independent Escorts",
  "independent_escorts": "Independent Escorts",
  "college-escorts": "College Escorts",
  "college_escorts": "College Escorts",
  "college-girls-escorts": "College Girls Escorts",
  "russian-escorts": "Russian Escorts",
  "russian_escorts": "Russian Escorts",
  "massages": "Massages",
  "massage": "Massages",
  "adult-meetings": "Adult Meetings",
  "adult_meetings": "Adult Meetings",
  "male-escorts": "Male Escorts",
  "male_escorts": "Male Escorts",
  "transsexual": "Transsexual",
  "trans": "Transsexual",
  "housewife-escorts": "Housewife Escorts",
  "celebrity-escorts": "Celebrity Escorts",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { cityOrSlug } = await params;

  if (isProfileSlug(cityOrSlug)) {
    return buildProfileSEO({
      name: cityOrSlug.replace(/-(sk-\d+|[a-f0-9]{24})$/i, "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      cityName: "India",
      dbOverride: { canonicalUrl: `/escorts-service/${cityOrSlug}` }
    });
  }

  const normalizedKey = (cityOrSlug || "").toLowerCase().replace(/_/g, "-").trim();
  const rawKey = (cityOrSlug || "").toLowerCase().trim();
  const matchedCategory = KNOWN_CATEGORIES[normalizedKey] || KNOWN_CATEGORIES[rawKey];

  if (matchedCategory) {
    return buildCategorySEO({
      categoryName: matchedCategory,
      cityName: "India",
      dbOverride: { canonicalUrl: `/escorts-service/${cityOrSlug}` },
    });
  }

  // Check if slug matches State or City
  const loc = await fetchLocationSeoData(cityOrSlug);
  if (loc && loc.type === "state") {
    return getStatePageMetadata(cityOrSlug, (loc.data as IState).name);
  }

  const cityName = loc?.data?.name || (cityOrSlug
    ? cityOrSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "All Cities");

  return getCityPageMetadata(cityOrSlug, cityName);
}

export default async function CityOrProfilePage({ params }: Params) {
  const { cityOrSlug } = await params;

  if (isProfileSlug(cityOrSlug)) {
    return <ProfileClientPage params={Promise.resolve({ id: cityOrSlug })} />;
  }

  const normalizedKey = (cityOrSlug || "").toLowerCase().replace(/_/g, "-").trim();
  const rawKey = (cityOrSlug || "").toLowerCase().trim();
  const matchedCategory = KNOWN_CATEGORIES[normalizedKey] || KNOWN_CATEGORIES[rawKey];

  if (matchedCategory) {
    return (
      <EscortsClient
        defaultCity="All Cities"
        defaultTag={matchedCategory}
        baseRoute="/escorts-service"
      />
    );
  }

  const loc = await fetchLocationSeoData(cityOrSlug);

  if (loc && loc.type === "state") {
    const stateData = loc.data as IState;
    if (stateData.redirectUrl) {
      if (stateData.redirectType === "301") {
        permanentRedirect(stateData.redirectUrl);
      } else if (stateData.redirectType === "302") {
        redirect(stateData.redirectUrl);
      }
    }
    const stateName = stateData.name;
    return (
      <>
        <StateJsonLd state={stateData} stateName={stateName} />
        <EscortsClient
          defaultState={stateName}
          defaultCity="All Cities"
          stateSeo={stateData}
          customPageContent={stateData?.pageContent}
          customFaqs={stateData?.faqs}
        />
      </>
    );
  }

  const cityData = (loc?.type === "city" ? loc.data : await fetchCitySeoData(cityOrSlug)) as ICity | null;
  if (cityData?.redirectUrl) {
    if (cityData.redirectType === "301") {
      permanentRedirect(cityData.redirectUrl);
    } else if (cityData.redirectType === "302") {
      redirect(cityData.redirectUrl);
    }
  }

  const cityName =
    cityData?.name ||
    (cityOrSlug
      ? cityOrSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "All Cities");

  return (
    <>
      <CityJsonLd city={cityData} cityName={cityName} />
      <EscortsClient
        defaultCity={cityName}
        citySeo={cityData || undefined}
        customPageContent={cityData?.pageContent}
        customFaqs={cityData?.faqs}
      />
    </>
  );
}

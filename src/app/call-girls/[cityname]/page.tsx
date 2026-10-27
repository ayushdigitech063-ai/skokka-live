import type { Metadata } from "next";
import {
  buildCallGirlsCitySEO,
  fetchCitySeoData,
  CityJsonLd,
} from "@/lib/seo/seoEngine";
import EscortsClient from "@/app/escorts-service/EscortsClient";

interface Params {
  params: Promise<{ cityname: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { cityname } = await params;
  const cityData = await fetchCitySeoData(cityname);

  const formattedCityName =
    cityData?.name ||
    (cityname
      ? cityname.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "All Cities");

  return buildCallGirlsCitySEO(formattedCityName, cityData ? {
    metaTitle: cityData.metaTitle || undefined,
    metaDescription: cityData.metaDescription || undefined,
    canonicalUrl: `/call-girls/${cityData.customSlug || cityData.slug || cityname.toLowerCase()}`,
    ogImage: cityData.ogImage || undefined,
    ogTitle: cityData.ogTitle || undefined,
    ogDescription: cityData.ogDescription || undefined,
    focusKeywords: cityData.focusKeywords,
    microServiceAreas: cityData.microServiceAreas,
    faqs: cityData.faqs,
  } : undefined);
}

export default async function CallGirlsCityPage({ params }: Params) {
  const { cityname } = await params;
  const cityData = await fetchCitySeoData(cityname);

  const formattedCityName =
    cityData?.name ||
    (cityname
      ? cityname.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "All Cities");

  const catOverride = cityData?.categorySeo?.find((c) => c.categorySlug === "call-girls");

  return (
    <>
      <CityJsonLd
        city={cityData}
        cityName={formattedCityName}
        canonicalUrl={`https://mycityqueen.com/call-girls/${cityData?.customSlug || cityData?.slug || cityname.toLowerCase()}`}
      />
      <EscortsClient
        defaultCity={formattedCityName}
        defaultTag="Call Girls"
        baseRoute="/call-girls"
        citySeo={cityData || undefined}
        customPageContent={catOverride?.pageContent || cityData?.pageContent}
        customFaqs={catOverride?.faqs?.length ? catOverride.faqs : cityData?.faqs}
      />
    </>
  );
}

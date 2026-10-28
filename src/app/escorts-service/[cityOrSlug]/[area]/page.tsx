import type { Metadata } from "next";
import { redirect, permanentRedirect } from "next/navigation";
import {
  buildProfileSEO,
  buildCategorySEO,
  buildCallGirlsCitySEO,
  fetchCitySeoData,
  fetchLocationSeoData,
  fetchAreaSeoData,
  getAreaPageMetadata,
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

  const normalizedKey = area.toLowerCase().trim();

  // 1. Check if City or State has category-specific SEO overrides configured by developer
  const loc = await fetchLocationSeoData(cityOrSlug);
  const catOverride = loc?.data?.categorySeo?.find((c) => c.categorySlug === normalizedKey);

  if (catOverride && (catOverride.metaTitle || catOverride.metaDescription || catOverride.canonicalUrl)) {
    const canonical = catOverride.canonicalUrl
      ? (catOverride.canonicalUrl.startsWith("http") ? catOverride.canonicalUrl : `https://mycityqueen.com${catOverride.canonicalUrl}`)
      : `https://mycityqueen.com/escorts-service/${cityOrSlug}/${area}`;

    const title = catOverride.metaTitle || (normalizedKey === "call-girls" ? `Call Girls in ${cityName} | MyCityQueen India` : `${KNOWN_CATEGORIES[normalizedKey] || normalizedKey} in ${cityName} | MyCityQueen`);
    const description = catOverride.metaDescription || `Browse verified companion profiles in ${cityName} with authentic photos and contact details.`;

    return {
      title,
      description,
      keywords: catOverride.focusKeywords?.length ? catOverride.focusKeywords : undefined,
      alternates: {
        canonical,
      },
      robots: {
        index: !(catOverride.robots || "").toLowerCase().includes("noindex"),
        follow: !(catOverride.robots || "").toLowerCase().includes("nofollow"),
        'max-snippet': !(catOverride.robots || "").toLowerCase().includes("noindex") ? -1 : undefined,
        'max-image-preview': !(catOverride.robots || "").toLowerCase().includes("noindex") ? "large" : undefined,
        'max-video-preview': !(catOverride.robots || "").toLowerCase().includes("noindex") ? -1 : undefined,
      },
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

  // 2. Check if this area/sub-slug exists in DB as physical area with custom overrides
  const areaData = await fetchAreaSeoData(area);
  if (areaData) {
    return getAreaPageMetadata(cityName, area);
  }

  // 3. Fallback default category templates
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

  const normalizedKey = area.toLowerCase().trim();
  const loc = await fetchLocationSeoData(cityOrSlug);
  const locData = loc?.data;
  const catOverride = locData?.categorySeo?.find((c) => c.categorySlug === normalizedKey);

  // Check category-specific 301 / 302 redirect
  if (catOverride?.redirectUrl) {
    if (catOverride.redirectType === "301") {
      permanentRedirect(catOverride.redirectUrl);
    } else if (catOverride.redirectType === "302") {
      redirect(catOverride.redirectUrl);
    }
  }

  // Check physical area 301 / 302 redirect
  const areaData = await fetchAreaSeoData(area);
  if (areaData?.redirectUrl) {
    if (areaData.redirectType === "301") {
      permanentRedirect(areaData.redirectUrl);
    } else if (areaData.redirectType === "302") {
      redirect(areaData.redirectUrl);
    }
  }

  const cityName =
    locData?.name ||
    (cityOrSlug
      ? cityOrSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "All Cities");
  const isCategory = Boolean(KNOWN_CATEGORIES[normalizedKey]);
  const areaName =
    areaData?.name ||
    KNOWN_CATEGORIES[normalizedKey] ||
    (area
      ? area
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "");

  const canonicalUrl =
    catOverride?.canonicalUrl ||
    areaData?.canonicalUrl ||
    `https://mycityqueen.com/escorts-service/${cityOrSlug}/${area}`;

  const cleanCustomSchema = (catOverride?.customSchema || areaData?.customSchema || "")
    .replace(/<script[^>]*>/gi, "")
    .replace(/<\/script>/gi, "")
    .trim();

  return (
    <>
      {cleanCustomSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: cleanCustomSchema }}
        />
      ) : (
        <AreaJsonLd
          area={areaData}
          cityName={cityName}
          areaName={areaName}
          canonicalUrl={canonicalUrl}
        />
      )}
      <EscortsClient
        defaultCity={cityName}
        defaultArea={!isCategory ? (areaData?.name || areaName) : undefined}
        defaultTag={isCategory ? (KNOWN_CATEGORIES[normalizedKey] || areaName) : "All Escorts"}
        citySeo={loc?.type === "city" ? (locData as any) : undefined}
        stateSeo={loc?.type === "state" ? (locData as any) : undefined}
        areaSeo={areaData || undefined}
        customPageContent={catOverride?.pageContent || areaData?.pageContent}
        customFaqs={catOverride?.faqs?.length ? catOverride.faqs : areaData?.faqs}
      />
    </>
  );
}

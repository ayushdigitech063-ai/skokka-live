import React from "react";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import { ICity } from "@/types/location";
import { buildCitySEO } from "./seoEngine";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

/**
 * Fetch City SEO data dynamically from backend API by ID, slug, customSlug, or name
 */
export async function fetchCitySeoData(cityOrSlug: string): Promise<ICity | null> {
  if (!cityOrSlug) return null;

  const candidateUrls = [
    `${BACKEND_URL}/locations/cities/${encodeURIComponent(cityOrSlug)}`,
    // If local test URL differs
    `http://localhost:4000/api/locations/cities/${encodeURIComponent(cityOrSlug)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.city) {
          return data.city as ICity;
        }
      }
    } catch {
      // Continue to next candidate or fallback
    }
  }

  return null;
}

/**
 * Build dynamic Next.js Metadata for City URLs
 */
export async function getCityPageMetadata(
  cityOrSlug: string,
  fallbackCityName?: string
): Promise<Metadata> {
  const city = await fetchCitySeoData(cityOrSlug);

  const cityName =
    city?.name ||
    fallbackCityName ||
    (cityOrSlug
      ? cityOrSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "All Cities");

  const stateName = typeof city?.stateId === "object" ? city?.stateId?.name : undefined;

  return buildCitySEO({
    cityName,
    stateName,
    dbOverride: city
      ? {
          metaTitle: city.metaTitle || undefined,
          metaDescription: city.metaDescription || undefined,
          customSlug: city.customSlug || city.slug || undefined,
          ogImage: city.ogImage || undefined,
          ogTitle: city.ogTitle || undefined,
          ogDescription: city.ogDescription || undefined,
          focusKeywords: city.focusKeywords && city.focusKeywords.length > 0 ? city.focusKeywords : undefined,
          microServiceAreas: city.microServiceAreas && city.microServiceAreas.length > 0 ? city.microServiceAreas : undefined,
          faqs: city.faqs && city.faqs.length > 0 ? city.faqs : undefined,
        }
      : undefined,
  });
}

/**
 * Generate Structured JSON-LD Schemas:
 * 1. LocalBusiness Schema (with areaServed including micro service areas)
 * 2. FAQPage Schema (for Google Rich Snippets)
 */
export function generateCityJsonLd(
  city: ICity | null,
  cityName: string,
  canonicalUrl: string
) {
  const domain = SITE_CONFIG.domain;
  const brandName = SITE_CONFIG.name;

  // LocalBusiness Schema
  const areasList = Array.from(
    new Set([
      cityName,
      ...(city?.microServiceAreas || []),
      ...(city?.areas?.map((a) => a.name) || []),
    ])
  );

  const localBusinessSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: city?.ogTitle || city?.metaTitle || `${cityName} Escorts & Companions Directory - ${brandName}`,
    description:
      city?.metaDescription ||
      `Verified independent call girls, female escorts, and VIP models directory in ${cityName}. 100% selfie-verified profiles available 24/7.`,
    url: canonicalUrl,
    image: city?.ogImage || `https://${domain}/images/logo.png`,
    telephone: "+91-9999999999",
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Card",
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: typeof city?.stateId === "object" ? city?.stateId?.name : "India",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "26.9124",
      longitude: "75.7873",
    },
    areaServed: areasList.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };

  // FAQPage Schema
  let faqPageSchema: Record<string, any> | null = null;
  if (city?.faqs && city.faqs.length > 0) {
    const validFaqs = city.faqs.filter((f) => f.question && f.answer);
    if (validFaqs.length > 0) {
      faqPageSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: validFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
    }
  }

  return { localBusinessSchema, faqPageSchema };
}

/**
 * Server-rendered React component that injects JSON-LD scripts into the page
 */
export function CityJsonLd({
  city,
  cityName,
  canonicalUrl,
}: {
  city: ICity | null;
  cityName: string;
  canonicalUrl?: string;
}) {
  const domain = SITE_CONFIG.domain;
  const targetCanonical =
    canonicalUrl ||
    `https://${domain}/escorts-service/${
      city?.customSlug || city?.slug || cityName.toLowerCase().replace(/\s+/g, "-")
    }`;

  const { localBusinessSchema, faqPageSchema } = generateCityJsonLd(
    city,
    cityName,
    targetCanonical
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {faqPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
      )}
    </>
  );
}

import React from "react";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import { ICity, IState, IArea } from "@/types/location";
import { buildAreaSEO } from "./seoEngine";
import { buildCitySEO, buildStateSEO } from "./seoEngine";

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
          canonicalUrl: city.canonicalUrl || undefined,
          robots: city.robots || undefined,
          redirectUrl: city.redirectUrl || undefined,
          redirectType: city.redirectType || undefined,
          customSchema: city.customSchema || undefined,
          pageContent: city.pageContent || undefined,
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
  const pageTitle = city?.ogTitle || city?.metaTitle || `Verified Escorts in ${cityName} | ${brandName}`;
  const pageDesc = city?.metaDescription || `Browse verified escort profiles in ${cityName} with authentic photos and contact details. High class VIP companions available 24/7.`;

  // 1. WebPage Schema
  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    "url": canonicalUrl,
    "name": pageTitle,
    "description": pageDesc,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `https://${domain}/#website`,
      "name": brandName,
      "url": `https://${domain}`
    },
    "breadcrumb": {
      "@id": `${canonicalUrl}#breadcrumb`
    },
    "inLanguage": "en-IN"
  };

  // 2. BreadcrumbList Schema
  const breadcrumbListSchema = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://${domain}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Escorts Service",
        "item": `https://${domain}/escorts-service`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cityName,
        "item": canonicalUrl
      }
    ]
  };

  // 3. ItemList Schema
  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${canonicalUrl}#itemlist`,
    "name": `Verified Escort Companion Listings in ${cityName}`,
    "description": `Directory listing of verified independent escort models and call girls in ${cityName}.`,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": 10
  };

  // 4. Service Schema
  const serviceSchema = {
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    "name": `Escort & Companionship Services in ${cityName}`,
    "serviceType": "Adult Companionship & Escort Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": `${brandName} ${cityName}`
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": cityName
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Companionship Service Options",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Hotel Incall Meetings",
          "description": "Private incall appointment at 5-star luxury hotels"
        },
        {
          "@type": "Offer",
          "name": "Doorstep Outcall Visits",
          "description": "Verified companion visits to private residence or hotel"
        }
      ]
    }
  };

  // 5. LocalBusiness Schema
  const areasList = Array.from(
    new Set([
      cityName,
      ...(city?.microServiceAreas || []),
      ...(city?.areas?.map((a) => a.name) || []),
    ])
  );

  const localBusinessSchema: Record<string, any> = {
    "@type": "LocalBusiness",
    "@id": `${canonicalUrl}#localbusiness`,
    "name": pageTitle,
    "description": pageDesc,
    "url": canonicalUrl,
    "image": city?.ogImage || `https://${domain}/images/logo.png`,
    "telephone": "+91-9999999999",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Card",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": typeof city?.stateId === "object" ? city?.stateId?.name : "India",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.9124",
      "longitude": "75.7873",
    },
    "areaServed": areasList.map((area) => ({
      "@type": "AdministrativeArea",
      "name": area,
    })),
  };

  // 6. FAQPage Schema
  const fallbackFaqs = [
    {
      question: `How to book verified escorts in ${cityName}?`,
      answer: `You can browse 100% verified escort profiles on our directory in ${cityName} and connect directly via WhatsApp or phone call without any advance booking charges.`,
    },
    {
      question: `Are incall and outcall services available in ${cityName}?`,
      answer: `Yes, independent companions and verified call girls provide both incall at luxury 5-star hotels/apartments and outcall doorstep visits across ${cityName}.`,
    },
    {
      question: `What are the payment options for escort service in ${cityName}?`,
      answer: `Payment can be made directly in cash or via secure UPI upon meeting in person. Always verify the profile selfie-verification badge before scheduling.`,
    },
    {
      question: `Is customer privacy protected in ${cityName}?`,
      answer: `Yes, 100% discreet and private companionship is assured. No client data is logged or shared with third parties.`,
    },
  ];

  const candidateFaqs = (city?.faqs && city.faqs.length > 0)
    ? city.faqs.filter((f) => f.question && f.answer)
    : fallbackFaqs;

  const faqPageSchema: Record<string, any> = {
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faqs`,
    "name": `${cityName} Escorts FAQs`,
    "mainEntity": candidateFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return {
    webPageSchema,
    breadcrumbListSchema,
    itemListSchema,
    serviceSchema,
    localBusinessSchema,
    faqPageSchema,
  };
}

export function CityJsonLd({
  city,
  cityName,
  canonicalUrl,
}: {
  city: ICity | null;
  cityName: string;
  canonicalUrl?: string;
}) {
  if (city?.customSchema && city.customSchema.trim()) {
    let clean = city.customSchema.trim();
    if (clean.startsWith("<script") && clean.endsWith("</script>")) {
      clean = clean.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
    }
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }
  const domain = SITE_CONFIG.domain;
  const targetCanonical =
    canonicalUrl ||
    `https://${domain}/escorts-service/${
      city?.customSlug || city?.slug || cityName.toLowerCase().replace(/\s+/g, "-")
    }`;

  const {
    webPageSchema,
    breadcrumbListSchema,
    itemListSchema,
    serviceSchema,
    localBusinessSchema,
    faqPageSchema,
  } = generateCityJsonLd(city, cityName, targetCanonical);

  // Unified Google-compliant @graph with all 6 required schemas: WebPage, BreadcrumbList, ItemList, Service, LocalBusiness, FAQs
  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema,
      breadcrumbListSchema,
      itemListSchema,
      serviceSchema,
      localBusinessSchema,
      faqPageSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
    />
  );
}

/**
 * Fetch State SEO data dynamically from backend API by ID, slug, customSlug, or name
 */
export async function fetchStateSeoData(stateOrSlug: string): Promise<IState | null> {
  if (!stateOrSlug) return null;

  const candidateUrls = [
    `${BACKEND_URL}/locations/states/${encodeURIComponent(stateOrSlug)}`,
    `http://localhost:4000/api/locations/states/${encodeURIComponent(stateOrSlug)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.state) {
          return data.state as IState;
        }
      }
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Build dynamic Next.js Metadata for State URLs
 */
export async function getStatePageMetadata(
  stateOrSlug: string,
  fallbackStateName?: string
): Promise<Metadata> {
  const state = await fetchStateSeoData(stateOrSlug);

  const stateName =
    state?.name ||
    fallbackStateName ||
    (stateOrSlug
      ? stateOrSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "India");

  return buildStateSEO(
    stateName,
    state
      ? {
          metaTitle: state.metaTitle || undefined,
          metaDescription: state.metaDescription || undefined,
          customSlug: state.customSlug || state.slug || undefined,
          ogImage: state.ogImage || undefined,
          ogTitle: state.ogTitle || undefined,
          ogDescription: state.ogDescription || undefined,
          focusKeywords:
            state.focusKeywords && state.focusKeywords.length > 0
              ? state.focusKeywords
              : undefined,
          microServiceAreas:
            state.popularDistricts && state.popularDistricts.length > 0
              ? state.popularDistricts
              : undefined,
          faqs: state.faqs && state.faqs.length > 0 ? state.faqs : undefined,
          canonicalUrl: state.canonicalUrl || undefined,
          robots: state.robots || undefined,
          redirectUrl: state.redirectUrl || undefined,
          redirectType: state.redirectType || undefined,
          customSchema: state.customSchema || undefined,
          pageContent: state.pageContent || undefined,
        }
      : undefined
  );
}

/**
 * Generate Structured JSON-LD Schemas for State
 */
export function generateStateJsonLd(
  state: IState | null,
  stateName: string,
  canonicalUrl: string
) {
  const domain = SITE_CONFIG.domain;
  const brandName = SITE_CONFIG.name;
  const pageTitle = state?.ogTitle || state?.metaTitle || `Verified Escorts across ${stateName} | ${brandName}`;
  const pageDesc = state?.metaDescription || `Browse verified escort profiles in ${stateName} with photos and contact details. High class VIP companions available 24/7.`;

  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    "url": canonicalUrl,
    "name": pageTitle,
    "description": pageDesc,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `https://${domain}/#website`,
      "name": brandName,
      "url": `https://${domain}`
    },
    "breadcrumb": {
      "@id": `${canonicalUrl}#breadcrumb`
    },
    "inLanguage": "en-IN"
  };

  const breadcrumbListSchema = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://${domain}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Escorts Service",
        "item": `https://${domain}/escorts-service`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": stateName,
        "item": canonicalUrl
      }
    ]
  };

  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${canonicalUrl}#itemlist`,
    "name": `Verified Escort Companions in ${stateName}`,
    "description": `Directory listing of verified independent escort models across ${stateName}.`,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": 10
  };

  const serviceSchema = {
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    "name": `Escort & Companionship Services across ${stateName}`,
    "serviceType": "Adult Companionship & Escort Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": `${brandName} ${stateName}`
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": stateName
    }
  };

  const citiesList = Array.from(
    new Set([
      stateName,
      ...(state?.popularDistricts || []),
      ...(state?.cities?.map((c) => c.name) || []),
    ])
  );

  const localBusinessSchema: Record<string, any> = {
    "@type": "LocalBusiness",
    "@id": `${canonicalUrl}#localbusiness`,
    "name": pageTitle,
    "description": pageDesc,
    "url": canonicalUrl,
    "image": state?.ogImage || `https://${domain}/images/logo.png`,
    "telephone": "+91-9999999999",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Card",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": stateName,
      "addressCountry": "IN",
    },
    "areaServed": citiesList.map((area) => ({
      "@type": "AdministrativeArea",
      "name": area,
    })),
  };

  const fallbackFaqs = [
    {
      question: `How to book verified escorts in ${stateName}?`,
      answer: `You can browse 100% verified escort profiles across ${stateName} and connect directly via WhatsApp or phone call without any advance booking charges.`,
    },
    {
      question: `Are incall and outcall services available in ${stateName}?`,
      answer: `Yes, independent companions provide both incall at luxury 5-star hotels/apartments and outcall doorstep visits across ${stateName}.`,
    },
  ];

  const candidateFaqs = (state?.faqs && state.faqs.length > 0)
    ? state.faqs.filter((f) => f.question && f.answer)
    : fallbackFaqs;

  const faqPageSchema: Record<string, any> = {
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faqs`,
    "name": `${stateName} Escorts FAQs`,
    "mainEntity": candidateFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return {
    webPageSchema,
    breadcrumbListSchema,
    itemListSchema,
    serviceSchema,
    localBusinessSchema,
    faqPageSchema,
  };
}

export function StateJsonLd({
  state,
  stateName,
  canonicalUrl,
}: {
  state: IState | null;
  stateName: string;
  canonicalUrl?: string;
}) {
  if (state?.customSchema && state.customSchema.trim()) {
    let clean = state.customSchema.trim();
    if (clean.startsWith("<script") && clean.endsWith("</script>")) {
      clean = clean.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
    }
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }
  const domain = SITE_CONFIG.domain;
  const targetCanonical =
    canonicalUrl ||
    `https://${domain}/escorts-service/${
      state?.customSlug || state?.slug || stateName.toLowerCase().replace(/\s+/g, "-")
    }`;

  const {
    webPageSchema,
    breadcrumbListSchema,
    itemListSchema,
    serviceSchema,
    localBusinessSchema,
    faqPageSchema,
  } = generateStateJsonLd(state, stateName, targetCanonical);

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema,
      breadcrumbListSchema,
      itemListSchema,
      serviceSchema,
      localBusinessSchema,
      faqPageSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
    />
  );
}

/**
 * Universal lookup for slug that could be City or State
 */
export async function fetchLocationSeoData(
  slug: string
): Promise<{ type: "city" | "state"; data: ICity | IState } | null> {
  const city = await fetchCitySeoData(slug);
  if (city) return { type: "city", data: city };
  const state = await fetchStateSeoData(slug);
  if (state) return { type: "state", data: state };
  return null;
}

/**
 * Fetch Area / Sub-page SEO data dynamically from backend API by ID, slug, customSlug, or name
 */
export async function fetchAreaSeoData(areaOrSlug: string): Promise<IArea | null> {
  if (!areaOrSlug) return null;

  const candidateUrls = [
    `${BACKEND_URL}/locations/areas/${encodeURIComponent(areaOrSlug)}`,
    `http://localhost:4000/api/locations/areas/${encodeURIComponent(areaOrSlug)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.area) {
          return data.area as IArea;
        }
      }
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Build dynamic Next.js Metadata for Area / Sub-page URLs
 */
export async function getAreaPageMetadata(
  cityName: string,
  areaOrSlug: string,
  fallbackAreaName?: string
): Promise<Metadata> {
  const area = await fetchAreaSeoData(areaOrSlug);

  const areaName =
    area?.name ||
    fallbackAreaName ||
    (areaOrSlug
      ? areaOrSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "All Areas");

  return buildAreaSEO({
    areaName,
    cityName,
    dbOverride: area
      ? {
          metaTitle: area.metaTitle || undefined,
          metaDescription: area.metaDescription || undefined,
          customSlug: area.customSlug || area.slug || undefined,
          ogImage: area.ogImage || undefined,
          ogTitle: area.ogTitle || undefined,
          ogDescription: area.ogDescription || undefined,
          focusKeywords: area.focusKeywords && area.focusKeywords.length > 0 ? area.focusKeywords : undefined,
          faqs: area.faqs && area.faqs.length > 0 ? area.faqs : undefined,
          canonicalUrl: area.canonicalUrl || undefined,
          robots: area.robots || undefined,
          redirectUrl: area.redirectUrl || undefined,
          redirectType: area.redirectType || undefined,
          customSchema: area.customSchema || undefined,
          pageContent: area.pageContent || undefined,
        }
      : undefined,
  });
}

/**
 * Server-rendered React component that injects JSON-LD script for Area
 */
export function AreaJsonLd({
  area,
  cityName,
  areaName,
  canonicalUrl,
}: {
  area: IArea | null;
  cityName: string;
  areaName: string;
  canonicalUrl?: string;
}) {
  // Developer Manual Custom Schema Override
  if (area?.customSchema && area.customSchema.trim()) {
    let clean = area.customSchema.trim();
    if (clean.startsWith("<script") && clean.endsWith("</script>")) {
      clean = clean.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
    }
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  const domain = SITE_CONFIG.domain;
  const brandName = SITE_CONFIG.name;
  const targetCanonical =
    canonicalUrl ||
    `https://${domain}/escorts-service/${cityName.toLowerCase().replace(/\s+/g, "-")}/${
      area?.customSlug || area?.slug || areaName.toLowerCase().replace(/\s+/g, "-")
    }`;

  const pageTitle = area?.ogTitle || area?.metaTitle || `Verified ${areaName} Escorts & Call Girls in ${cityName} | ${brandName}`;
  const pageDesc = area?.metaDescription || `Discover verified independent escort companions and call girls in ${areaName}, ${cityName}. High class models available 24/7 for hotel incall and doorstep outcall.`;

  // 1. WebPage Schema
  const webPageSchema = {
    "@type": "WebPage",
    "@id": `${targetCanonical}#webpage`,
    "url": targetCanonical,
    "name": pageTitle,
    "description": pageDesc,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `https://${domain}/#website`,
      "name": brandName,
      "url": `https://${domain}`
    },
    "breadcrumb": {
      "@id": `${targetCanonical}#breadcrumb`
    },
    "inLanguage": "en-IN"
  };

  // 2. BreadcrumbList Schema
  const breadcrumbListSchema = {
    "@type": "BreadcrumbList",
    "@id": `${targetCanonical}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://${domain}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Escorts Service",
        "item": `https://${domain}/escorts-service`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cityName,
        "item": `https://${domain}/escorts-service/${cityName.toLowerCase().replace(/\s+/g, "-")}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": areaName,
        "item": targetCanonical
      }
    ]
  };

  // 3. ItemList Schema
  const itemListSchema = {
    "@type": "ItemList",
    "@id": `${targetCanonical}#itemlist`,
    "name": `Verified Escort Listings in ${areaName}, ${cityName}`,
    "description": `Directory listing of verified independent companions and models in ${areaName}, ${cityName}.`,
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": 10
  };

  // 4. Service Schema
  const serviceSchema = {
    "@type": "Service",
    "@id": `${targetCanonical}#service`,
    "name": `Escort & Companionship Services in ${areaName}`,
    "serviceType": "Adult Companionship & Escort Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": `${brandName} ${areaName}`
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `${areaName}, ${cityName}`
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Companionship Service Options",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Hotel Incall Meetings",
          "description": "Private incall appointment at 5-star luxury hotels"
        },
        {
          "@type": "Offer",
          "name": "Doorstep Outcall Visits",
          "description": "Verified companion visits to private residence or hotel"
        }
      ]
    }
  };

  // 5. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${targetCanonical}#localbusiness`,
    "name": pageTitle,
    "description": pageDesc,
    "url": targetCanonical,
    "image": area?.ogImage || `https://${domain}/logo.png`,
    "telephone": "+91-9999999999",
    "priceRange": "₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, UPI, Card",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": areaName,
      "addressRegion": cityName,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.9124",
      "longitude": "75.7873"
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": areaName
      },
      {
        "@type": "AdministrativeArea",
        "name": cityName
      }
    ]
  };

  // 6. FAQPage Schema
  const fallbackFaqs = [
    {
      question: `How to book verified escorts in ${areaName}, ${cityName}?`,
      answer: `Browse 100% verified profiles on MyCityQueen in ${areaName} and contact directly via WhatsApp or phone call without any advance booking charges.`,
    },
    {
      question: `Are incall and outcall services available in ${areaName}?`,
      answer: `Yes, verified independent companions provide both incall at premium hotels/apartments and outcall doorstep service across ${areaName}.`,
    },
    {
      question: `What payment methods are accepted in ${areaName}?`,
      answer: `Payment can be made directly in cash or secure UPI upon meeting in person. Never pay advance fees.`,
    },
    {
      question: `Is client confidentiality guaranteed in ${areaName}?`,
      answer: `Yes, 100% discreet and private companionship is assured. No client information is ever stored or shared.`,
    },
  ];

  const candidateFaqs =
    area?.faqs && area.faqs.length > 0
      ? area.faqs.filter((f) => f.question && f.answer)
      : fallbackFaqs;

  const faqPageSchema = {
    "@type": "FAQPage",
    "@id": `${targetCanonical}#faqs`,
    "name": `${areaName} Escorts FAQs`,
    "mainEntity": candidateFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema,
      breadcrumbListSchema,
      itemListSchema,
      serviceSchema,
      localBusinessSchema,
      faqPageSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
    />
  );
}

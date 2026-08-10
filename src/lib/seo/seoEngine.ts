/**
 * Dynamic SEO Engine Facade for Next.js 15 App Router
 */
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import {
  IDBSEOOverride,
  ICitySEOParams,
  IAreaSEOParams,
  ICategorySEOParams,
  IProfileSEOParams,
} from "./seoTypes";
import {
  resolveHomeSEO,
  resolveStateSEO,
  resolveCitySEO,
  resolveAreaSEO,
  resolveCategorySEO,
  resolveProfileSEO,
} from "./seoResolver";

/**
 * Transforms resolved ISEOData into Next.js Metadata object
 */
/**
 * Transforms resolved ISEOData into Next.js Metadata object
 */
export const toNextMetadata = (seoData: ReturnType<typeof resolveHomeSEO>): Metadata => {
  return {
    metadataBase: new URL(`https://${SITE_CONFIG.domain}`),
    title: seoData.title,
    description: seoData.description,
    authors: [{ name: SITE_CONFIG.name }],
    publisher: SITE_CONFIG.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: seoData.canonical,
    },
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      url: seoData.ogUrl,
      type: seoData.ogType as any,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: seoData.ogImage,
          width: 1200,
          height: 630,
          alt: seoData.title,
        },
      ],
    },
    twitter: {
      card: seoData.twitterCard,
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: [seoData.twitterImage],
    },
  };
};

/**
 * High-Level Metadata Generators for Next.js Pages
 */
export const buildHomeSEO = (override?: IDBSEOOverride): Metadata => {
  return toNextMetadata(resolveHomeSEO(override));
};

export const buildEscortsSEO = (override?: IDBSEOOverride): Metadata => {
  const data = resolveHomeSEO(override);
  data.title = `Verified Escorts Directory in India | ${SITE_CONFIG.name}`;
  data.description = `Browse 100% verified escort companions & female models available for incall & outcall meetings across India.`;
  data.canonical = `https://${SITE_CONFIG.domain}/escorts`;
  data.ogUrl = data.canonical;
  return toNextMetadata(data);
};

export const buildStateSEO = (stateName: string, override?: IDBSEOOverride): Metadata => {
  return toNextMetadata(resolveStateSEO(stateName, override));
};

export const buildCitySEO = (params: ICitySEOParams): Metadata => {
  return toNextMetadata(resolveCitySEO(params));
};

export const buildAreaSEO = (params: IAreaSEOParams): Metadata => {
  return toNextMetadata(resolveAreaSEO(params));
};

export const buildCategorySEO = (params: ICategorySEOParams): Metadata => {
  return toNextMetadata(resolveCategorySEO(params));
};

export const buildCategoriesSEO = (override?: IDBSEOOverride): Metadata => {
  const data = resolveHomeSEO(override);
  data.title = `Escort Categories Directory | ${SITE_CONFIG.name}`;
  data.description = `Explore independent companions, VIP escorts, call girls, college models, and massage services by category.`;
  data.canonical = `https://${SITE_CONFIG.domain}/categories`;
  data.ogUrl = data.canonical;
  return toNextMetadata(data);
};

export const buildCitiesSEO = (override?: IDBSEOOverride): Metadata => {
  const data = resolveHomeSEO(override);
  data.title = `Pan-India Cities Escort Directory | ${SITE_CONFIG.name}`;
  data.description = `Select your city to browse verified companions in Jaipur, Delhi, Mumbai, Bangalore, Hyderabad, Goa & more.`;
  data.canonical = `https://${SITE_CONFIG.domain}/cities`;
  data.ogUrl = data.canonical;
  return toNextMetadata(data);
};

export const buildContactSEO = (override?: IDBSEOOverride): Metadata => {
  const data = resolveHomeSEO(override);
  data.title = `Contact Us & Help Center | ${SITE_CONFIG.name}`;
  data.description = `Get 24/7 customer support, advertisement assistance, and directory help for ${SITE_CONFIG.name}.`;
  data.canonical = `https://${SITE_CONFIG.domain}/contact`;
  data.ogUrl = data.canonical;
  return toNextMetadata(data);
};

export const buildVipSEO = (override?: IDBSEOOverride): Metadata => {
  const data = resolveHomeSEO(override);
  data.title = `VIP Featured Escorts & Luxury Companions | ${SITE_CONFIG.name}`;
  data.description = `Exclusive VIP companions and 5-star hotel luxury escort models in India with 100% selfie verification.`;
  data.canonical = `https://${SITE_CONFIG.domain}/vip`;
  data.ogUrl = data.canonical;
  return toNextMetadata(data);
};

export const buildProfileSEO = (params: IProfileSEOParams): Metadata => {
  return toNextMetadata(resolveProfileSEO(params));
};

// Export all modules
export * from "./seoTypes";
export * from "./seoHelpers";
export * from "./seoTemplates";
export * from "./seoResolver";

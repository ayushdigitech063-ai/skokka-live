/**
 * SEO Engine Priority Resolver (DB Overrides vs Templates)
 */
import {
  IDBSEOOverride,
  ISEOData,
  ICitySEOParams,
  IAreaSEOParams,
  ICategorySEOParams,
  IProfileSEOParams,
} from "./seoTypes";
import {
  appendSiteBranding,
  buildCanonicalPath,
  DEFAULT_OG_IMAGE,
  slugifyPath,
} from "./seoHelpers";
import {
  getHomeTemplates,
  getStateTemplates,
  getCityTemplates,
  getAreaTemplates,
  getCategoryTemplates,
  getProfileTemplates,
} from "./seoTemplates";

/**
 * Resolves SEO for Home Page
 */

/**
 * Automatically replaces dynamic tokens like {city}, {area}, {location}
 */
export function replaceLocationTokens(text: string, cityName: string, areaName?: string): string {
  if (!text) return "";
  return text
    .replace(/\{city\}/gi, cityName)
    .replace(/\[city\]/gi, cityName)
    .replace(/\{location\}/gi, areaName ? `${areaName}, ${cityName}` : cityName)
    .replace(/\[location\]/gi, areaName ? `${areaName}, ${cityName}` : cityName)
    .replace(/\{area\}/gi, areaName || cityName)
    .replace(/\[area\]/gi, areaName || cityName);
}

/**
 * Auto-generates high-intent SEO keywords dynamically based on city and optional area
 */
export function generateAutoKeywords(cityName: string, areaName?: string): string[] {
  const c = (cityName || "India").trim();
  const a = areaName ? areaName.trim() : "";
  if (a) {
    return [
      `${a} escorts`,
      `call girls in ${a}`,
      `${a} call girls`,
      `escort service in ${a} ${c}`,
      `${a} independent escorts`,
      `vip escorts in ${a}`,
      `${c} escorts`,
      `call girls in ${c}`,
      `verified companions in ${a}`
    ];
  }
  return [
    `${c} escorts`,
    `call girls in ${c}`,
    `${c} call girls`,
    `escort service in ${c}`,
    `independent escorts in ${c}`,
    `vip escorts in ${c}`,
    `russian escorts in ${c}`,
    `${c} companion services`,
    `verified call girls ${c}`
  ];
}

export const resolveHomeSEO = (override?: IDBSEOOverride): ISEOData => {
  const fallback = getHomeTemplates();
  const title = appendSiteBranding(override?.metaTitle || fallback.title);
  const description = override?.metaDescription || fallback.description;
  const shortDescription = override?.shortDescription || fallback.shortDescription;
  const canonical = buildCanonicalPath(override?.canonicalUrl || "/");
  const ogImage = override?.ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    shortDescription,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogType: "website",
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    keywords: override?.focusKeywords && override.focusKeywords.length > 0 ? override.focusKeywords : undefined,
    faqs: override?.faqs,
    robots: override?.robots,
    redirectUrl: override?.redirectUrl,
    redirectType: override?.redirectType,
    customSchema: override?.customSchema,
    pageContent: override?.pageContent,
  };
};

/**
 * Resolves SEO for State Page
 */
export const resolveStateSEO = (stateName: string, override?: IDBSEOOverride): ISEOData => {
  const fallback = getStateTemplates(stateName);
  const title = appendSiteBranding(override?.metaTitle || fallback.title);
  const description = override?.metaDescription || fallback.description;
  const shortDescription = override?.shortDescription || fallback.shortDescription;
  const slugPath = override?.customSlug || slugifyPath(stateName);
  const canonical = buildCanonicalPath(override?.canonicalUrl || `/escorts-service/${slugPath}`);
  const ogImage = override?.ogImage || DEFAULT_OG_IMAGE;
  const ogTitle = override?.ogTitle || title;
  const ogDescription = override?.ogDescription || description;

  return {
    title,
    description,
    shortDescription,
    canonical,
    keywords: override?.focusKeywords && override.focusKeywords.length > 0 ? override.focusKeywords : undefined,
    ogTitle,
    ogDescription,
    ogUrl: canonical,
    ogType: "website",
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: ogImage,
    faqs: override?.faqs,
    microServiceAreas: override?.microServiceAreas,
    robots: override?.robots,
    redirectUrl: override?.redirectUrl,
    redirectType: override?.redirectType,
    customSchema: override?.customSchema,
    pageContent: override?.pageContent,
  };
};

/**
 * Resolves SEO for City Page
 */
export const resolveCitySEO = (params: ICitySEOParams): ISEOData => {
  const { cityName, stateName, dbOverride } = params;
  const fallback = getCityTemplates(cityName, stateName);
  const rawTitle = dbOverride?.metaTitle ? replaceLocationTokens(dbOverride.metaTitle, cityName) : fallback.title;
  const title = appendSiteBranding(rawTitle);
  const rawDesc = dbOverride?.metaDescription ? replaceLocationTokens(dbOverride.metaDescription, cityName) : fallback.description;
  const description = rawDesc;
  const shortDescription = dbOverride?.shortDescription ? replaceLocationTokens(dbOverride.shortDescription, cityName) : fallback.shortDescription;
  const slugPath = dbOverride?.customSlug || slugifyPath(cityName);
  const canonical = buildCanonicalPath(dbOverride?.canonicalUrl || `/escorts-service/${slugPath}`);
  const ogImage = dbOverride?.ogImage || DEFAULT_OG_IMAGE;
  const ogTitle = dbOverride?.ogTitle ? replaceLocationTokens(dbOverride.ogTitle, cityName) : title;
  const ogDescription = dbOverride?.ogDescription ? replaceLocationTokens(dbOverride.ogDescription, cityName) : description;

  // Dynamic Keywords: if admin specified keywords, replace tokens in them; otherwise auto-fetch standard high-intent keywords for this city
  const keywords = dbOverride?.focusKeywords && dbOverride.focusKeywords.length > 0
    ? dbOverride.focusKeywords.map((k) => replaceLocationTokens(k, cityName))
    : generateAutoKeywords(cityName);

  const rawPageContent = dbOverride?.pageContent ? replaceLocationTokens(dbOverride.pageContent, cityName) : undefined;

  return {
    title,
    description,
    shortDescription,
    canonical,
    keywords,
    ogTitle,
    ogDescription,
    ogUrl: canonical,
    ogType: "website",
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: ogImage,
    faqs: dbOverride?.faqs?.map(f => ({
      question: replaceLocationTokens(f.question, cityName),
      answer: replaceLocationTokens(f.answer, cityName),
    })),
    microServiceAreas: dbOverride?.microServiceAreas,
    robots: dbOverride?.robots,
    redirectUrl: dbOverride?.redirectUrl,
    redirectType: dbOverride?.redirectType,
    customSchema: dbOverride?.customSchema ? replaceLocationTokens(dbOverride.customSchema, cityName) : undefined,
    pageContent: rawPageContent,
  };
};

/**
 * Resolves SEO for Area Page
 */
export const resolveAreaSEO = (params: IAreaSEOParams): ISEOData => {
  const { areaName, cityName, dbOverride } = params;
  const fallback = getAreaTemplates(areaName, cityName);
  const rawTitle = dbOverride?.metaTitle ? replaceLocationTokens(dbOverride.metaTitle, cityName, areaName) : fallback.title;
  const title = appendSiteBranding(rawTitle);
  const rawDesc = dbOverride?.metaDescription ? replaceLocationTokens(dbOverride.metaDescription, cityName, areaName) : fallback.description;
  const description = rawDesc;
  const shortDescription = dbOverride?.shortDescription ? replaceLocationTokens(dbOverride.shortDescription, cityName, areaName) : fallback.shortDescription;
  const slugPath = dbOverride?.customSlug || slugifyPath(areaName);
  const canonical = buildCanonicalPath(dbOverride?.canonicalUrl || `/escorts-service/${slugifyPath(cityName)}/${slugPath}`);
  const ogImage = dbOverride?.ogImage || DEFAULT_OG_IMAGE;
  const ogTitle = dbOverride?.ogTitle ? replaceLocationTokens(dbOverride.ogTitle, cityName, areaName) : title;
  const ogDescription = dbOverride?.ogDescription ? replaceLocationTokens(dbOverride.ogDescription, cityName, areaName) : description;

  const keywords = dbOverride?.focusKeywords && dbOverride.focusKeywords.length > 0
    ? dbOverride.focusKeywords.map((k) => replaceLocationTokens(k, cityName, areaName))
    : generateAutoKeywords(cityName, areaName);

  const rawPageContent = dbOverride?.pageContent ? replaceLocationTokens(dbOverride.pageContent, cityName, areaName) : undefined;

  return {
    title,
    description,
    shortDescription,
    canonical,
    ogTitle,
    ogDescription,
    ogUrl: canonical,
    ogType: "website",
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: ogImage,
    keywords,
    faqs: dbOverride?.faqs?.map(f => ({
      question: replaceLocationTokens(f.question, cityName, areaName),
      answer: replaceLocationTokens(f.answer, cityName, areaName),
    })),
    robots: dbOverride?.robots,
    redirectUrl: dbOverride?.redirectUrl,
    redirectType: dbOverride?.redirectType,
    customSchema: dbOverride?.customSchema ? replaceLocationTokens(dbOverride.customSchema, cityName, areaName) : undefined,
    pageContent: rawPageContent,
  };
};

/**
 * Resolves SEO for Category Page
 */
export const resolveCategorySEO = (params: ICategorySEOParams): ISEOData => {
  const { categoryName, cityName, dbOverride } = params;
  const fallback = getCategoryTemplates(categoryName, cityName);
  const title = appendSiteBranding(dbOverride?.metaTitle || fallback.title);
  const description = dbOverride?.metaDescription || fallback.description;
  const shortDescription = dbOverride?.shortDescription || fallback.shortDescription;
  const canonical = buildCanonicalPath(
    dbOverride?.canonicalUrl ||
      (cityName ? `/escorts/${slugifyPath(cityName)}?category=${slugifyPath(categoryName)}` : `/categories?cat=${slugifyPath(categoryName)}`)
  );
  const ogImage = dbOverride?.ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    shortDescription,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogType: "website",
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
  };
};

/**
 * Resolves SEO for Escort Profile Page
 */
export const resolveProfileSEO = (params: IProfileSEOParams): ISEOData => {
  const { name, cityName, category, photoUrl, dbOverride } = params;
  const fallback = getProfileTemplates(name, cityName, category);
  const title = appendSiteBranding(dbOverride?.metaTitle || fallback.title);
  const description = dbOverride?.metaDescription || fallback.description;
  const shortDescription = dbOverride?.shortDescription || fallback.shortDescription;
  const canonical = buildCanonicalPath(dbOverride?.canonicalUrl || `/profile/${slugifyPath(name)}`);
  const ogImage = dbOverride?.ogImage || photoUrl || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    shortDescription,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogType: "profile",
    ogImage,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
  };
};

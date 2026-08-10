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
  const canonical = buildCanonicalPath(override?.canonicalUrl || `/escorts/${slugifyPath(stateName)}`);
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
  };
};

/**
 * Resolves SEO for City Page
 */
export const resolveCitySEO = (params: ICitySEOParams): ISEOData => {
  const { cityName, stateName, dbOverride } = params;
  const fallback = getCityTemplates(cityName, stateName);
  const title = appendSiteBranding(dbOverride?.metaTitle || fallback.title);
  const description = dbOverride?.metaDescription || fallback.description;
  const shortDescription = dbOverride?.shortDescription || fallback.shortDescription;
  const canonical = buildCanonicalPath(dbOverride?.canonicalUrl || `/escorts/${slugifyPath(cityName)}`);
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
 * Resolves SEO for Area Page
 */
export const resolveAreaSEO = (params: IAreaSEOParams): ISEOData => {
  const { areaName, cityName, dbOverride } = params;
  const fallback = getAreaTemplates(areaName, cityName);
  const title = appendSiteBranding(dbOverride?.metaTitle || fallback.title);
  const description = dbOverride?.metaDescription || fallback.description;
  const shortDescription = dbOverride?.shortDescription || fallback.shortDescription;
  const canonical = buildCanonicalPath(dbOverride?.canonicalUrl || `/escorts/${slugifyPath(cityName)}/${slugifyPath(areaName)}`);
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

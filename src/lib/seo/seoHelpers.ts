import { SITE_CONFIG } from "@/config/site";

export const SITE_NAME = SITE_CONFIG.name;
export const DEFAULT_OG_IMAGE = SITE_CONFIG.defaultOgImage;

/**
 * Capitalizes first letter of words
 */
export const capitalizeWords = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Normalizes slug to clean path format
 */
export const slugifyPath = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

/**
 * Appends site branding to page title if not present
 */
export const appendSiteBranding = (title: string): string => {
  if (!title) return SITE_NAME;
  if (title.includes("|") || title.includes("-")) return title;
  return `${title} | ${SITE_NAME}`;
};

/**
 * Generates relative canonical URL path
 */
export const buildCanonicalPath = (path: string): string => {
  if (!path) return "/";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath.replace(/\/+/g, "/");
};

/**
 * Generates SEO-friendly profile slug e.g. priya-sharma-sk-103
 */
export const getProfileSlug = (name: string, id: string): string => {
  const cleanName = slugifyPath(name || "escort");
  const cleanId = (id || "").toLowerCase();
  if (cleanName.endsWith(cleanId)) return cleanName;
  return `${cleanName}-${cleanId}`;
};

/**
 * Generates full profile URL e.g. /escorts/jaipur/priya-sharma-sk-103
 */
export const getProfileUrl = (p: { id?: string; skId?: string; name?: string; stageName?: string; city?: string; location?: string }): string => {
  const targetId = p.skId || p.id || "SK-101";
  const name = p.name || p.stageName || "escort";
  const rawCity = p.city || p.location || "india";
  // Extract just the city name (remove area suffix like "Jaipur (Bani Park)" → "jaipur")
  const citySlug = slugifyPath(rawCity.split("(")[0].trim());
  const slug = getProfileSlug(name, targetId);
  return `/escorts/${citySlug}/${slug}`;
};

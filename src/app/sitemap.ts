import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { getProfileUrl } from "@/lib/seo/seoHelpers";

export const revalidate = 3600; // Revalidate dynamic sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${SITE_CONFIG.domain}`;
  const now = new Date();
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

  const sitemapList: MetadataRoute.Sitemap = [];
  const addedUrls = new Set<string>();

  const addUrl = (
    path: string,
    priority: number,
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "daily"
  ) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = `${baseUrl}${cleanPath}`;
    if (!addedUrls.has(fullUrl)) {
      addedUrls.add(fullUrl);
      sitemapList.push({
        url: fullUrl,
        lastModified: now,
        changeFrequency,
        priority,
      });
    }
  };

  // 1. Core Platform Pages
  addUrl("/", 1.0, "daily");
  addUrl("/escorts-service", 0.9, "daily");
  addUrl("/call-girls", 0.9, "daily");
  addUrl("/vip", 0.9, "daily");
  addUrl("/verified", 0.8, "daily");
  addUrl("/cities", 0.8, "weekly");
  addUrl("/categories", 0.8, "weekly");
  addUrl("/contact", 0.5, "monthly");

  // 2. High-Intent Category Landing Pages
  const TOP_CATEGORIES = [
    "call-girls",
    "vip-escorts",
    "massages",
    "male-escorts",
    "transsexual",
    "adult-meetings",
    "russian-escorts",
    "independent-girls",
  ];

  for (const cat of TOP_CATEGORIES) {
    addUrl(`/escorts-service/${cat}`, 0.9, "daily");
  }

  // 3. Dynamic Location Tree (States, Cities, City+Categories, Areas) & Escort Profiles
  try {
    const [locRes, escRes] = await Promise.allSettled([
      fetch(`${BACKEND_URL}/locations/tree?includeDeleted=false`, {
        next: { revalidate: 3600 },
      }).then((r) => r.json()),
      fetch(`${BACKEND_URL}/escorts`, {
        next: { revalidate: 3600 },
      }).then((r) => r.json()),
    ]);

    // Parse Location Tree
    if (locRes.status === "fulfilled" && locRes.value?.success && Array.isArray(locRes.value.tree)) {
      for (const state of locRes.value.tree) {
        if (state.slug) {
          addUrl(`/escorts-service/${state.slug}`, 0.8, "daily");
        }

        if (Array.isArray(state.cities)) {
          for (const city of state.cities) {
            if (!city.slug) continue;
            const citySlug = city.slug;

            // City page (e.g. /escorts-service/jaipur)
            addUrl(`/escorts-service/${citySlug}`, 0.85, "daily");

            // High-Value City + Category Combinations (e.g. /escorts-service/jaipur/call-girls)
            addUrl(`/escorts-service/${citySlug}/call-girls`, 0.8, "daily");
            addUrl(`/escorts-service/${citySlug}/vip-escorts`, 0.75, "daily");
            addUrl(`/escorts-service/${citySlug}/massages`, 0.7, "weekly");

            // City Areas (e.g. /escorts-service/jaipur/malviya-nagar)
            if (Array.isArray(city.areas)) {
              for (const area of city.areas) {
                if (area.slug) {
                  addUrl(`/escorts-service/${citySlug}/${area.slug}`, 0.7, "weekly");
                }
              }
            }
          }
        }
      }
    }

    // Parse Live Profiles (700+ Escort Listings)
    if (escRes.status === "fulfilled" && escRes.value?.success && Array.isArray(escRes.value.data)) {
      for (const p of escRes.value.data) {
        try {
          const profilePath = getProfileUrl(p);
          if (profilePath) {
            addUrl(profilePath, 0.75, "daily");
          }
        } catch {}
      }
    }
  } catch (err) {
    console.error("Auto sitemap generation error:", err);
  }

  return sitemapList;
}

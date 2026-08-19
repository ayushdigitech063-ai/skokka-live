import { AdCmsConfig } from "../types/adCms";

export const AD_CMS_STORAGE_KEY = "skokka_ad_cms_config";
export const AD_CMS_UPDATE_EVENT = "skokka_ad_cms_updated";

export const DEFAULT_AD_CMS_CONFIG: AdCmsConfig = {
  superAdminUpiId: "skokka@upi",
  upiHolderName: "Skokka Official Concierge",
  verificationRequired: true,
  documentTypes: ["Aadhaar Card", "Passport", "Voter ID Card"],
  packages: [
    {
      id: "FREE_STANDARD",
      title: "Free Standard Listing",
      price: 0,
      badge: "FREE 🆓",
      description: "Main Escorts Directory (/escorts) bottom position",
      enabled: true,
    },
    {
      id: "HOMEPAGE_STANDARD",
      title: "Homepage Standard",
      price: 999,
      badge: "POPULAR ⭐",
      description: "Homepage Escorts List + Priority Directory Placement",
      enabled: true,
    },
    {
      id: "CITY_FEATURED",
      title: "City Top Escort Package",
      price: 1499,
      badge: "CITY TOP 🌆",
      description: "Featured on City Top Escorts Page & Category Search",
      enabled: true,
    },
    {
      id: "VERIFIED_HOMEPAGE",
      title: "Verified Escort Package",
      price: 2499,
      badge: "VERIFIED ✅",
      description: "Homepage Verified Escorts Section + ✅ Verified Badge Icon",
      enabled: true,
    },
    {
      id: "VIP_PAGE_ONLY",
      title: "VIP Page Feature",
      price: 3499,
      badge: "VIP PAGE 👑",
      description: "Dedicated /vip High-Class Escorts Showcase Page",
      enabled: true,
    },
    {
      id: "VIP_HOMEPAGE_ALL",
      title: "VIP Homepage + /vip Page",
      price: 4999,
      badge: "5-STAR VIP 🔥",
      description: "BOTH Homepage VIP Showcase Section AND Dedicated /vip Page",
      enabled: true,
    },
  ],
  creditPackages: [
    {
      id: "cred_500",
      price: 500,
      credits: 5,
      bonusText: "Standard Pack",
      enabled: true,
    },
    {
      id: "cred_1000",
      price: 1000,
      credits: 12,
      bonusText: "2 FREE Credits",
      enabled: true,
    },
    {
      id: "cred_2500",
      price: 2500,
      credits: 32,
      bonusText: "7 FREE VIP Credits",
      enabled: true,
    },
    {
      id: "cred_5000",
      price: 5000,
      credits: 70,
      bonusText: "20 FREE VIP Pro Credits",
      enabled: true,
    },
  ],
  coupons: [
    {
      id: "coup_50",
      code: "WELCOME50",
      discountPercent: 50,
      description: "50% OFF on First Classified Ad Campaign",
      validUntil: "2026-12-31",
      enabled: true,
    },
    {
      id: "coup_100",
      code: "SKOKKA100",
      discountPercent: 20,
      description: "20% Discount on VIP Placement Slots",
      validUntil: "2026-12-31",
      enabled: true,
    },
    {
      id: "coup_bonus",
      code: "BOOSTVIP",
      discountPercent: 30,
      description: "30% Extra Bonus Credits on ₹2,500+ Packs",
      validUntil: "2026-12-31",
      enabled: true,
    },
  ],
  categories: [
    {
      id: "business_products",
      label: "🛍️ Products, Healthcare & Business (e.g. Shilajit, Ayurvedic)",
      iconEmoji: "🛍️",
      enabled: true,
    },
    {
      id: "call_girls",
      label: "💋 Call Girls & Female Escorts",
      iconEmoji: "💋",
      enabled: true,
    },
    {
      id: "luxury_massage",
      label: "💆 Massage Centers & Spas",
      iconEmoji: "💆",
      enabled: true,
    },
    {
      id: "male_escorts",
      label: "🧔 Male Escorts & Companions",
      iconEmoji: "🧔",
      enabled: true,
    },
    {
      id: "transsexual",
      label: "👠 Transsexual & Dating",
      iconEmoji: "👠",
      enabled: true,
    },
    {
      id: "adult_meetings",
      label: "🍸 Adult Meetings & Nightlife",
      iconEmoji: "🍸",
      enabled: true,
    },
  ],
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

export function getAdCmsConfig(): AdCmsConfig {
  if (typeof window === "undefined") return DEFAULT_AD_CMS_CONFIG;
  try {
    const raw = localStorage.getItem(AD_CMS_STORAGE_KEY);
    if (!raw) {
      // Async background fetch from MongoDB Atlas
      fetch(`${BACKEND_URL}/settings/adCmsConfig`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json && json.data) {
            localStorage.setItem(AD_CMS_STORAGE_KEY, JSON.stringify(json.data));
            window.dispatchEvent(new Event(AD_CMS_UPDATE_EVENT));
          }
        })
        .catch(() => {});
      return DEFAULT_AD_CMS_CONFIG;
    }
    const parsed = JSON.parse(raw);
    const hasNewPackages = Array.isArray(parsed.packages) && parsed.packages.length >= 5;
    return {
      ...DEFAULT_AD_CMS_CONFIG,
      ...parsed,
      packages: hasNewPackages ? parsed.packages : DEFAULT_AD_CMS_CONFIG.packages,
      creditPackages: parsed.creditPackages || DEFAULT_AD_CMS_CONFIG.creditPackages,
      coupons: parsed.coupons || DEFAULT_AD_CMS_CONFIG.coupons,
      categories: parsed.categories || DEFAULT_AD_CMS_CONFIG.categories,
    };
  } catch (e) {
    console.error("Failed to load Ad CMS config:", e);
    return DEFAULT_AD_CMS_CONFIG;
  }
}

export function saveAdCmsConfig(config: AdCmsConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AD_CMS_STORAGE_KEY, JSON.stringify(config));
    localStorage.setItem("skokka_superadmin_upi_id", config.superAdminUpiId);
    window.dispatchEvent(new Event(AD_CMS_UPDATE_EVENT));

    // Save to MongoDB Atlas via backend API
    fetch(`${BACKEND_URL}/settings/adCmsConfig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    }).catch((err) => console.error("Failed to sync Ad CMS config with MongoDB:", err));
  } catch (e) {
    console.error("Failed to save Ad CMS config:", e);
  }
}

export function resetAdCmsConfig(): AdCmsConfig {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AD_CMS_STORAGE_KEY);
    localStorage.setItem("skokka_superadmin_upi_id", DEFAULT_AD_CMS_CONFIG.superAdminUpiId);
    window.dispatchEvent(new Event(AD_CMS_UPDATE_EVENT));

    // Reset in MongoDB Atlas
    fetch(`${BACKEND_URL}/settings/adCmsConfig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULT_AD_CMS_CONFIG),
    }).catch(() => {});
  }
  return DEFAULT_AD_CMS_CONFIG;
}

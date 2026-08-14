import { HomePageCmsConfig } from "../types/homepageCms";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const DEFAULT_HOMEPAGE_CMS_CONFIG: HomePageCmsConfig = {
  hero: {
    badgeText: "100% VERIFIED INDEPENDENT MODELS & ESCORT DIRECTORY",
    titlePrefix: "Connect with Genuine",
    titleHighlight: "Independent Escorts",
    titleSuffix: "",
    subtitle:
      "India's most trusted classified directory for independent escorts, high-class VIP companions & massage parlors.",
    bgImage: "", 
    // Yahan se Natasha wala bada box ka data hata diya hai, sirf chota text rakh sakte ho ya empty chhod do
    floatingModelName: "", 
    floatingModelRate: "", 
    floatingModelBadge: "", 
  },
  verifiedProfiles: {
    enabled: true,
    badge: "100% Aadhaar & Selfie Verified",
    title: "Verified Escorts & Independent Companions",
    subtitle: "Every profile badge is identity-checked with live face matching & official verification.",
  },
  vipEscorts: {
    enabled: true,
    badge: "5-Star Hotel Outcalls & Luxury Escorts",
    title: "VIP High-Class Companions",
    subtitle: "Premium models available for corporate events, luxury travel & elite hotel outcalls.",
  },
  categories: {
    enabled: true,
    badge: "Browse By Category",
    title: "Find Escorts by Category",
    subtitle: "Select a category and your city to browse verified listings",
    categories: [
      {
        id: "call_girls",
        label: "Call Girls",
        emoji: "💋",
        image: "/images/cat-call-girls.jpg",
        accent: "from-rose-600 to-pink-600",
        border: "border-rose-500/40",
        glow: "shadow-rose-600/20",
        cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai", "All cities"],
      },
      {
        id: "massages",
        label: "Massages",
        emoji: "💆",
        image: "/images/cat-massage.jpg",
        accent: "from-violet-600 to-purple-600",
        border: "border-violet-500/40",
        glow: "shadow-violet-600/20",
        cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
      },
      {
        id: "male_escorts",
        label: "Male Escorts",
        emoji: "🧔",
        image: "/images/cat-male-escorts.jpg",
        accent: "from-cyan-600 to-blue-600",
        border: "border-cyan-500/40",
        glow: "shadow-cyan-600/20",
        cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
      },
      {
        id: "transsexual",
        label: "Transsexual",
        emoji: "👠",
        image: "/images/cat-transsexual.jpg",
        accent: "from-fuchsia-600 to-pink-600",
        border: "border-fuchsia-500/40",
        glow: "shadow-fuchsia-600/20",
        cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
      },
      {
        id: "adult_meetings",
        label: "Adult Meetings",
        emoji: "🍸",
        image: "/images/cat-adult-meetings.jpg",
        accent: "from-amber-500 to-orange-500",
        border: "border-amber-500/40",
        glow: "shadow-amber-500/20",
        cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
      },
      {
        id: "vip_escorts",
        label: "VIP Escorts",
        emoji: "👑",
        image: "/images/cat-vip.jpg",
        accent: "from-amber-400 to-rose-500",
        border: "border-amber-400/40",
        glow: "shadow-amber-500/20",
        cities: ["Bangalore", "Delhi", "Mumbai", "Goa", "Jaipur"],
      },
    ],
  },
  topCities: {
    enabled: true,
    badge: "Pan-India Escort Network",
    title: "Top Escort Cities Directory in India",
    subtitle: "Select your city to connect with verified independent escorts and 5-Star hotel companions.",
    buttonText: "View All 28+ Cities →",
    cities: [
      { name: "Jaipur Escorts", count: "128 Listings", highlight: "POPULAR" },
      { name: "Delhi Escorts", count: "340 Listings", highlight: "HOT" },
      { name: "Mumbai Call Girls", count: "410 Listings", highlight: "VIP" },
      { name: "Bangalore Escorts", count: "215 Listings", highlight: "POPULAR" },
      { name: "Goa VIP Companions", count: "180 Listings", highlight: "LUXURY" },
      { name: "Pune Call Girls", count: "145 Listings", highlight: "ACTIVE" },
      { name: "Hyderabad Escorts", count: "195 Listings", highlight: "POPULAR" },
      { name: "Kolkata Escorts", count: "160 Listings", highlight: "ACTIVE" },
      { name: "Chandigarh Call Girls", count: "110 Listings", highlight: "HOT" },
      { name: "Ahmedabad Escorts", count: "135 Listings", highlight: "ACTIVE" },
      { name: "Chennai Escorts", count: "155 Listings", highlight: "POPULAR" },
      { name: "Lucknow Call Girls", count: "95 Listings", highlight: "HOT" },
      { name: "Surat Escorts", count: "105 Listings", highlight: "ACTIVE" },
      { name: "Indore Escorts", count: "88 Listings", highlight: "POPULAR" },
      { name: "Kochi Escorts", count: "72 Listings", highlight: "ACTIVE" },
      { name: "Patna Call Girls", count: "65 Listings", highlight: "HOT" },
      { name: "Guwahati Escorts", count: "55 Listings", highlight: "ACTIVE" },
      { name: "Dehradun Escorts", count: "90 Listings", highlight: "POPULAR" },
      { name: "Agra Escorts", count: "78 Listings", highlight: "HOT" },
      { name: "Udaipur Escorts", count: "85 Listings", highlight: "LUXURY" },
      { name: "Bhopal Escorts", count: "60 Listings", highlight: "ACTIVE" },
      { name: "Ranchi Escorts", count: "50 Listings", highlight: "NEW" },
    ],
  },
  premierNetwork: {
    enabled: true,
    badge: "Premier Classifieds Advantage",
    title: "India's Most Trusted Escort Network",
    subtitle: "India's safest, fastest & most reliable direct adult directory with genuine verified profiles and instant WhatsApp booking.",
    buttonText: "Learn Verification Standards →",
    stats: [
      { label: "SATISFIED CLIENTS", value: "50,000+", color: "text-rose-400" },
      { label: "ACTIVE VERIFIED LISTINGS", value: "1,280+", color: "text-amber-400" },
      { label: "INDIAN CITIES COVERED", value: "28+", color: "text-emerald-400" },
      { label: "CLIENT RATING SCORE", value: "99.8%", color: "text-purple-400" },
    ],
  },
  footer: {
    brandName: "SKOKKA INDIA",
    brandLogoUrl: "",
    brandBadgeText: "Classifieds",
    brandTagline: "India's No. 1 Adult Escort Classifieds Directory. 100% AI Verified Profiles, Direct WhatsApp & Phone contact.",
    sslBadgeText: "256-Bit SSL Encrypted Channel",

    col2Heading: "EXPLORE CATEGORIES",
    col2Links: [
      { id: "1", emoji: "🔞", label: "Escorts Directory", url: "/escorts" },
      { id: "2", emoji: "📍", label: "Pan-India Escort Cities", url: "/cities" },
      { id: "3", emoji: "👑", label: "VIP Luxury Showcase", url: "/vip-profiles" },
      { id: "4", emoji: "✓", label: "AI Verified Standard", url: "/verified" },
    ],

    col3Heading: "HELP & SUPPORT",
    col3Links: [
      { id: "1", emoji: "💬", label: "24/7 Helpline Support Desk", url: "/contact" },
      { id: "2", emoji: "🔐", label: "Admin Security Portal", url: "/admin" },
    ],

    col4Heading: "NEWSLETTER & VIP DEALS",
    col4Desc: "Get latest listing highlights & promotion discounts delivered directly.",
    newsletterButtonText: "Subscribe Now",

    supportEmail: "support@skokka.in",
    whatsappNumber: "+91 98765 00000",
    telegramHandle: "@skokkaindia",
    disclaimerText: "Disclaimer: All escort profiles listed are 18+ adult providers. Skokka enforces strict compliance, AI face verification, and 256-bit SSL encryption.",
    copyrightText: "© 2026 Skokka India Classifieds • 18+ Adult Escort Directory • All Rights Reserved",
  },
  searchModalFilters: {
    nationalities: [
      { id: "Indian", label: "IN Indian" },
      { id: "Albanian", label: "AL Albanian" },
      { id: "American", label: "US American" },
      { id: "Arabic", label: "SA Arabic" },
      { id: "Russian", label: "RU Russian" },
    ],
    breasts: [
      { id: "Natural Boobs", label: "Natural Boobs" },
      { id: "Busty", label: "Busty" },
      { id: "Enhanced", label: "Enhanced" },
    ],
    hairs: [
      { id: "Blond Hair", label: "Blond Hair" },
      { id: "Brown Hair", label: "Brown Hair" },
      { id: "Black Hair", label: "Black Hair" },
      { id: "Red Hair", label: "Red Hair" },
    ],
    bodyTypes: [
      { id: "Slim", label: "Slim" },
      { id: "Curvy", label: "Curvy" },
      { id: "Athletic", label: "Athletic" },
      { id: "Petite", label: "Petite" },
    ],
    services: [
      { id: "GFE", label: "GFE" },
      { id: "Dinner Date", label: "Dinner Date" },
      { id: "Massage", label: "Massage" },
      { id: "Overnight", label: "Overnight" },
      { id: "Outcall", label: "Outcall" },
      { id: "Incall", label: "Incall" },
    ],
    attentionTo: [
      { id: "Men", label: "Men" },
      { id: "Women", label: "Women" },
      { id: "Couples", label: "Couples" },
    ],
    placesOfService: [
      { id: "Hotel", label: "Hotel" },
      { id: "Private Apartment", label: "Private Apartment" },
      { id: "Clubs", label: "Clubs" },
      { id: "Events", label: "Events" },
    ],
  },
};

const STORAGE_KEY = "skokka_homepage_cms_config";
export const CMS_UPDATE_EVENT = "skokka_cms_config_updated";

export function getHomePageCmsConfig(): HomePageCmsConfig {
  if (typeof window === "undefined") {
    return DEFAULT_HOMEPAGE_CMS_CONFIG;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_CMS_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_HOMEPAGE_CMS_CONFIG,
      ...parsed,
      hero: { ...DEFAULT_HOMEPAGE_CMS_CONFIG.hero, ...parsed?.hero },
      footer: { ...DEFAULT_HOMEPAGE_CMS_CONFIG.footer, ...parsed?.footer },
    };
  } catch (e) {
    console.error("Failed to load CMS config, using defaults:", e);
    return DEFAULT_HOMEPAGE_CMS_CONFIG;
  }
}

export async function fetchHomePageCmsConfigAsync(): Promise<HomePageCmsConfig> {
  const local = getHomePageCmsConfig();
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings/homepageCmsConfig`);
    if (res.ok) {
      const json = await res.json();
      if (json?.success && json?.data) {
        const merged = {
          ...DEFAULT_HOMEPAGE_CMS_CONFIG,
          ...json.data,
          hero: { ...DEFAULT_HOMEPAGE_CMS_CONFIG.hero, ...json.data?.hero },
          footer: { ...DEFAULT_HOMEPAGE_CMS_CONFIG.footer, ...json.data?.footer },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event(CMS_UPDATE_EVENT));
        }
        return merged;
      }
    }
  } catch (e) {
    console.error("Failed to fetch CMS config from backend:", e);
  }
  return local;
}

export function saveHomePageCmsConfig(config: HomePageCmsConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event(CMS_UPDATE_EVENT));

    fetch(`${BACKEND_URL}/api/settings/homepageCmsConfig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    }).catch((err) => console.error("Failed to sync Homepage CMS config with MongoDB:", err));
  } catch (e) {
    console.error("Failed to save CMS config:", e);
  }
}

export function resetHomePageCmsConfig(): HomePageCmsConfig {
  if (typeof window === "undefined") return DEFAULT_HOMEPAGE_CMS_CONFIG;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(CMS_UPDATE_EVENT));

    fetch(`${BACKEND_URL}/api/settings/homepageCmsConfig`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(DEFAULT_HOMEPAGE_CMS_CONFIG),
    }).catch(() => {});
  } catch (e) {
    console.error("Failed to reset CMS config:", e);
  }
  return DEFAULT_HOMEPAGE_CMS_CONFIG;
}

export function registerNewCityIfMissing(rawCityName: string): void {
  if (typeof window === "undefined" || !rawCityName) return;
  const cleanCity = rawCityName.split("(")[0].trim();
  if (!cleanCity || cleanCity.length < 3) return;

  const currentCms = getHomePageCmsConfig();
  const existingCities = currentCms.topCities.cities || [];

  const alreadyExists = existingCities.some((c) =>
    c.name.toLowerCase().includes(cleanCity.toLowerCase())
  );

  if (!alreadyExists) {
    const updatedCities = [
      ...existingCities,
      { name: `${cleanCity} Escorts`, count: "1 Listing", highlight: "NEW 🔥" },
    ];
    const updatedCms = {
      ...currentCms,
      topCities: {
        ...currentCms.topCities,
        cities: updatedCities,
      },
    };
    saveHomePageCmsConfig(updatedCms);
  }
}
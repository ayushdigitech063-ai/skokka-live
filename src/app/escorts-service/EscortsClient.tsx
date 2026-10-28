"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { CityCategoryAccordion, getCityBaseAreas } from "@/components/CityCategoryAccordion";
import {
  Search,
  Check,
  Heart,
  Star,
  MapPin,
  Filter,
  Crown,
  ShieldCheck,
  Flame,
  Sparkles,
  Phone,
  MessageCircle,
  Layers,
  UserCheck,
  X,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  Send,
  HelpCircle,
} from "lucide-react";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { getProfileUrl, slugifyPath } from "@/lib/seo/seoEngine";
import { ICity, IState, IArea } from "@/types/location";

interface EscortsPageProps {
  defaultCity?: string;
  defaultState?: string;
  defaultArea?: string;
  defaultTag?: string;
  baseRoute?: string;
  citySeo?: ICity;
  stateSeo?: IState;
  areaSeo?: IArea;
  customPageContent?: string;
  customFaqs?: Array<{ question: string; answer: string }>;
}

const ITEMS_PER_PAGE = 8;

export default function EscortsClient({ defaultCity, defaultState, defaultArea, defaultTag, baseRoute = "/escorts-service", citySeo, stateSeo, areaSeo, customPageContent, customFaqs }: EscortsPageProps = {}) {
  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchLocation, setSearchLocation] = useState(defaultArea || areaSeo?.name || "");
  const [selectedTag, setSelectedTag] = useState(defaultTag || "All Escorts");
  const [selectedState, setSelectedState] = useState(defaultState || stateSeo?.name || "All States");
  const [selectedCity, setSelectedCity] = useState(
    stateSeo && defaultCity === stateSeo.name ? "All Cities" : defaultCity || "All Cities"
  );
  const [cms, setCms] = useState<HomePageCmsConfig | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCitySeo, setCurrentCitySeo] = useState<ICity | undefined>(citySeo);
  const [currentStateSeo, setCurrentStateSeo] = useState<IState | undefined>(stateSeo);

  const updateUrl = (city: string, state: string, area: string, tag: string) => {
    if (typeof window === "undefined") return;
    const cleanCity = city && city !== "All Cities" ? slugifyPath(city) : "";
    const cleanState = state && state !== "All States" ? slugifyPath(state) : "";
    const cleanArea = area && area !== "Select Area" ? slugifyPath(area) : "";
    const cleanTag = tag && tag !== "All Escorts" ? slugifyPath(tag) : "";

    let newUrl = baseRoute;

    if (cleanCity) {
      if (cleanArea && cleanTag) {
        newUrl = `${baseRoute}/${cleanCity}/${cleanArea}/${cleanTag}`;
      } else if (cleanArea) {
        newUrl = `${baseRoute}/${cleanCity}/${cleanArea}`;
      } else if (cleanTag) {
        newUrl = `${baseRoute}/${cleanCity}/${cleanTag}`;
      } else {
        newUrl = `${baseRoute}/${cleanCity}`;
      }
    } else if (cleanState) {
      if (cleanTag) {
        newUrl = `${baseRoute}/${cleanState}/${cleanTag}`;
      } else {
        newUrl = `${baseRoute}/${cleanState}`;
      }
    } else if (cleanTag) {
      newUrl = `${baseRoute}/${cleanTag}`;
    }

    window.history.pushState({}, "", newUrl);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    updateUrl(selectedCity, selectedState, searchLocation, tag);
  };

  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity("All Cities");
    setSearchLocation("");
    setCurrentPage(1);
    updateUrl("All Cities", stateName, "", selectedTag);

    if (stateName && stateName !== "All States") {
      const stObj = locationTree.find(
        (st) => st.name?.toLowerCase() === stateName.toLowerCase()
      );
      if (stObj) {
        setCurrentStateSeo(stObj);
        setCurrentCitySeo(undefined);
      }
    } else {
      setCurrentStateSeo(undefined);
    }
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setSearchLocation("");
    setCurrentPage(1);

    let parentStateName = selectedState;
    if (city && city !== "All Cities") {
      const parentState = locationTree.find((st) =>
        (st.cities || []).some(
          (c: any) => c.name?.toLowerCase() === city.toLowerCase()
        )
      );
      if (parentState && selectedState === "All States") {
        parentStateName = parentState.name;
        setSelectedState(parentState.name);
        setCurrentStateSeo(parentState);
      }

      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
      fetch(`${BACKEND_URL}/locations/cities/${encodeURIComponent(slugifyPath(city))}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.city) {
            setCurrentCitySeo(data.city);
          }
        })
        .catch(() => {});
    } else {
      setCurrentCitySeo(undefined);
    }

    updateUrl(city, parentStateName, "", selectedTag);
  };

  const handleSelectArea = (area: string) => {
    setSearchLocation(area);
    setCurrentPage(1);
    updateUrl(selectedCity, selectedState, area, selectedTag);

    if (area && selectedCity && selectedCity !== "All Cities") {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
      fetch(`${BACKEND_URL}/locations/areas/${encodeURIComponent(slugifyPath(area))}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.area) {
            // loaded area SEO if needed
          }
        })
        .catch(() => {});
    }
  };

  const [locationTree, setLocationTree] = useState<any[]>([]);

  useEffect(() => {
    setCms(getHomePageCmsConfig());
    fetchEscortProfiles().then(setProfiles);

    const urlParams = new URLSearchParams(window.location.search);
    const queryCity = urlParams.get("city");
    const queryState = urlParams.get("state");
    const queryArea = urlParams.get("area");
    const queryTag = urlParams.get("tag");

    if (queryState) setSelectedState(queryState);
    else if (defaultState) setSelectedState(defaultState);
    else if (stateSeo?.name) setSelectedState(stateSeo.name);

    if (queryCity) setSelectedCity(queryCity);
    else if (defaultCity && defaultCity !== stateSeo?.name) setSelectedCity(defaultCity);

    if (queryArea) setSearchLocation(queryArea);
    else if (defaultArea) setSearchLocation(defaultArea);
    else if (areaSeo?.name) setSearchLocation(areaSeo.name);

    if (queryTag) setSelectedTag(queryTag);
    else if (defaultTag) setSelectedTag(defaultTag);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
    fetch(`${BACKEND_URL}/locations/tree?includeDeleted=false`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tree) {
          setLocationTree(data.tree);
          if (defaultCity && defaultCity !== "All Cities") {
            const isStateMatch = data.tree.find((st: any) =>
              st.name?.toLowerCase() === defaultCity.toLowerCase() ||
              st.slug?.toLowerCase() === defaultCity.toLowerCase()
            );
            if (isStateMatch && (!defaultState || defaultState === "All States")) {
              setSelectedState(isStateMatch.name);
              setSelectedCity("All Cities");
              setCurrentStateSeo(isStateMatch);
            }
          }
        }
      })
      .catch(err => console.error(err));

    const handleCmsUpdate = () => setCms(getHomePageCmsConfig());
    const handleEscortsUpdate = () => fetchEscortProfiles().then(setProfiles);

    window.addEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
    window.addEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);

    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
      window.removeEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);
    };
  }, [defaultCity, defaultState, defaultArea, defaultTag, stateSeo, areaSeo]);

  // Sync props changes to state
  useEffect(() => {
    if (citySeo) setCurrentCitySeo(citySeo);
  }, [citySeo]);

  useEffect(() => {
    if (stateSeo) setCurrentStateSeo(stateSeo);
  }, [stateSeo]);

  // Dynamically resolve SEO when selectedCity changes or locationTree arrives
  useEffect(() => {
    if (!selectedCity || selectedCity === "All Cities") {
      setCurrentCitySeo(undefined);
      setCurrentStateSeo(undefined);
      return;
    }

    if (locationTree.length > 0) {
      let foundCity: ICity | undefined;
      let foundState: IState | undefined;

      for (const st of locationTree) {
        if (
          st.name?.toLowerCase() === selectedCity.toLowerCase() ||
          st.slug?.toLowerCase() === selectedCity.toLowerCase()
        ) {
          foundState = st;
          break;
        }
        const matchC = st.cities?.find(
          (c: any) =>
            c.name?.toLowerCase() === selectedCity.toLowerCase() ||
            c.slug?.toLowerCase() === selectedCity.toLowerCase() ||
            c.customSlug?.toLowerCase() === selectedCity.toLowerCase()
        );
        if (matchC) {
          foundCity = matchC;
          break;
        }
      }

      if (foundCity) {
        setCurrentCitySeo(foundCity);
      } else if (foundState) {
        setCurrentStateSeo(foundState);
      }
    } else {
      // Direct API fetch if locationTree hasn't populated yet
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
      fetch(`${BACKEND_URL}/locations/cities/${encodeURIComponent(slugifyPath(selectedCity))}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.city) {
            setCurrentCitySeo(data.city);
          }
        })
        .catch(() => {});
    }
  }, [selectedCity, locationTree]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [
    { name: "All Escorts", emoji: "✨" },
    { name: "VIP Escorts", emoji: "⭐" },
    { name: "Call Girls", emoji: "💃" },
    { name: "Independent Girls", emoji: "👑" },
    { name: "College Escorts", emoji: "🎓" },
    { name: "Russian Escorts", emoji: "👱‍♀️" },
    { name: "Massages", emoji: "💆‍♀️" },
  ];

  const citiesList = Array.from(
    new Set([
      "All Cities",
      "Bangalore",
      "Chennai",
      "Delhi",
      "Mumbai",
      "Hyderabad",
      "Kolkata",
      "Pune",
      "Jaipur",
      "Goa",
      "Ahmedabad",
      "Chandigarh",
      "Lucknow",
      "Patna",
      "Surat",
      "Indore",
      "Bhopal",
      "Coimbatore",
      "Kochi",
      "Nagpur",
      "Vadodara",
      "Ludhiana",
      "Agra",
      "Nashik",
      "Varanasi",
      "Gurgaon",
      "Noida",
      "Ghaziabad",
      "Faridabad",
      "Amritsar",
      "Udaipur",
      "Ranchi",
      "Dehradun",
      "Visakhapatnam",
    ])
  );

  const rawFilteredProfiles = profiles.filter((p) => {
    if (!p) return false;
    const catStr = p.category ? String(p.category).toLowerCase() : "";
    const nameStr = p.name ? String(p.name).toLowerCase() : "";
    const cityStr = p.city ? String(p.city).toLowerCase() : "";
    const locStr = p.location ? String(p.location).toLowerCase() : "";
    const locSearch = searchLocation ? String(searchLocation).toLowerCase() : "";
    const citySearch = selectedCity ? String(selectedCity).toLowerCase() : "";
    const stateSearch = selectedState ? String(selectedState).toLowerCase() : "";

    if (p.status && p.status !== "APPROVED") return false;

    if (
      p.age === 0 ||
      catStr.includes("product") ||
      catStr.includes("healthcare") ||
      nameStr.includes("shilajit")
    ) {
      return false;
    }

    const matchesLoc = locSearch ? cityStr.includes(locSearch) || locStr.includes(locSearch) || nameStr.includes(locSearch) : true;
    const matchesTag =
      selectedTag === "All Escorts"
        ? true
        : catStr.includes(String(selectedTag).toLowerCase()) ||
          (Array.isArray(p.tags) &&
            p.tags.some((t) => {
              if (!t) return false;
              const tStr = String(t).toLowerCase();
              const selTagStr = String(selectedTag).toLowerCase();
              return selTagStr.includes(tStr) || tStr.includes(selTagStr);
            }));

    const matchesCity =
      selectedCity === "All Cities" ? true : cityStr.includes(citySearch) || locStr.includes(citySearch);

    let matchesState = true;
    if (selectedState !== "All States") {
      const stateObj = locationTree.find(
        (st) => (st.name || "").trim().toLowerCase() === stateSearch
      );
      const stateCities = (stateObj?.cities || []).map((c: any) => (c.name || "").toLowerCase());
      matchesState =
        cityStr.includes(stateSearch) ||
        locStr.includes(stateSearch) ||
        stateCities.some((sc: string) => sc && (cityStr.includes(sc) || locStr.includes(sc)));
    }

    return matchesLoc && matchesTag && matchesCity && matchesState;
  });

  const getPackagePriority = (p: EscortProfileItem) => {
    const pkg = (p.packageType || "").toUpperCase();
    const name = (p.name || "").toUpperCase();
    
    if (p.isSuperTop || pkg.includes("SUPER_TOP") || pkg.includes("SUPER TOP")) return 0;
    if (p.isVip || pkg.includes("VIP")) return 1;
    if (p.isVerified || pkg.includes("VERIFIED")) return 2;
    return 999;
  };

  const filteredProfiles = rawFilteredProfiles.sort((a, b) => getPackagePriority(a) - getPackagePriority(b));

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE) || 1;
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetAllFilters = () => {
    setSelectedTag("All Escorts");
    setSelectedState("All States");
    setSelectedCity("All Cities");
    setSearchLocation("");
    setCurrentPage(1);
    updateUrl("All Cities", "All States", "", "All Escorts");
  };

  const isFiltered =
    selectedTag !== "All Escorts" ||
    selectedState !== "All States" ||
    selectedCity !== "All Cities" ||
    searchLocation.trim() !== "";

  // Available States
  const fallbackStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Delhi", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", 
    "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const availableStates = Array.from(
    new Set([
      ...locationTree.map((st) => st.name).filter(Boolean),
      ...fallbackStates
    ])
  )
    .map((s: string) => s.trim())
    .sort((a, b) => a.localeCompare(b));

  const selectedStateObj = locationTree.find(
    (st) => (st.name || "").trim().toLowerCase() === selectedState.trim().toLowerCase()
  );

  let availableCities: string[] = [];
  if (selectedState && selectedState !== "All States") {
    if (selectedStateObj && Array.isArray(selectedStateObj.cities) && selectedStateObj.cities.length > 0) {
      availableCities = selectedStateObj.cities.map((c: any) => c.name);
    } else {
      // Fallback if tree has no cities for this state yet
      availableCities = citiesList.filter(c => c !== "All Cities");
    }
  } else {
    const treeCities = locationTree.flatMap((st) => (st.cities || []).map((c: any) => c.name));
    availableCities = Array.from(new Set([...treeCities, ...citiesList]))
      .filter((c: string) => c && c !== "All Cities")
      .map((c: string) => c.trim())
      .sort((a, b) => a.localeCompare(b));
  }

  // Derive available areas for selected city
  let availableAreas: string[] = [];
  if (selectedCity && selectedCity !== "All Cities") {
    const normSelected = selectedCity.trim().toLowerCase();
    const selectedCityObj = locationTree
      .flatMap((st) => st.cities || [])
      .find((c: any) => {
        const cName = (c.name || "").toString().trim().toLowerCase();
        return (
          cName === normSelected ||
          (normSelected === "bangalore" && cName === "bengaluru") ||
          (normSelected === "bengaluru" && cName === "bangalore") ||
          (normSelected === "gurgaon" && cName === "gurugram") ||
          (normSelected === "gurugram" && cName === "gurgaon")
        );
      });
    const treeAreas = selectedCityObj ? (selectedCityObj.areas || []).map((a: any) => a.name) : [];
    const fallbackAreas = getCityBaseAreas(selectedCity);
    availableAreas = Array.from(new Set([...treeAreas, ...fallbackAreas]))
      .filter(Boolean)
      .map((a: string) => a.trim())
      .sort((a, b) => a.localeCompare(b));
  }

  return (
    <div className="min-h-screen bg-[#030614] text-white font-sans selection:bg-rose-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden w-full bg-gradient-to-b from-[#0B0F24] via-[#070919] to-[#030614] border-b border-slate-800/80 pt-28 sm:pt-32 lg:pt-36 pb-14 px-4 sm:px-8 lg:px-16 text-center">
          {/* Ambient Lighting & Glow effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f43f5e18_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-rose-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto space-y-6">
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-300 font-bold text-xs uppercase tracking-wider border border-rose-500/30 backdrop-blur-md inline-flex items-center gap-2 shadow-lg shadow-rose-950/40">
                <ShieldCheck className="h-4 w-4 text-rose-400" />
                100% Verified Companions Directory
              </span>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>24/7 Direct WhatsApp Connect</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Verified {selectedTag !== "All Escorts" ? selectedTag : "Escorts"}{" "}
                {selectedCity !== "All Cities" ? (
                  <>
                    in{" "}
                    <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                      {selectedCity}
                    </span>
                  </>
                ) : selectedState !== "All States" ? (
                  <>
                    in{" "}
                    <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                      {selectedState}
                    </span>
                  </>
                ) : (
                  <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                    in India
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Browse authentic verified female companions &amp; independent models for incall &amp; outcall meetings{selectedCity !== "All Cities" ? ` in ${selectedCity}` : selectedState !== "All States" ? ` in ${selectedState}` : " across top Indian cities"}.
              </p>
            </div>

            {/* SEARCH INPUT BAR */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center rounded-2xl bg-slate-900/90 border border-slate-700/80 p-1.5 shadow-2xl focus-within:border-rose-500/60 focus-within:ring-2 focus-within:ring-rose-500/20 transition duration-300">
                <Search className="h-5 w-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by area, model name, or location (e.g. Bani Park, Malviya Nagar)..."
                  value={searchLocation}
                  onChange={(e) => handleSelectArea(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                />
                {searchLocation && (
                  <button
                    type="button"
                    onClick={() => handleSelectArea("")}
                    className="p-1.5 text-slate-400 hover:text-white transition mr-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* DROPDOWNS: CATEGORY, STATE, CITY, AREA */}
            <div className="max-w-5xl mx-auto pt-2 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Category Dropdown */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Sparkles className="h-4 w-4 text-rose-400" />
                  </div>
                  <select
                    value={selectedTag}
                    onChange={(e) => handleSelectTag(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white font-semibold focus:border-rose-500 focus:outline-none appearance-none cursor-pointer text-sm shadow-md transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* 2. State Dropdown */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-amber-400" />
                  </div>
                  <select
                    value={selectedState}
                    onChange={(e) => handleSelectState(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white font-semibold focus:border-rose-500 focus:outline-none appearance-none cursor-pointer text-sm shadow-md transition"
                  >
                    <option value="All States">All States</option>
                    {availableStates.map((stName: string) => (
                      <option key={stName} value={stName}>
                        {stName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* 3. City Dropdown */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-rose-400" />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      handleSelectCity(e.target.value);
                    }}
                    className="w-full pl-9 pr-10 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white font-semibold focus:border-rose-500 focus:outline-none appearance-none cursor-pointer text-sm shadow-md transition"
                  >
                    <option value="All Cities">All Cities</option>
                    {availableCities.map((cityName: string) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* 4. Area Dropdown */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-rose-400" />
                  </div>
                  <select
                    value={searchLocation}
                    disabled={selectedCity === "All Cities"}
                    onChange={(e) => handleSelectArea(e.target.value)}
                    className={`w-full pl-9 pr-10 py-3 rounded-2xl border text-sm shadow-md appearance-none transition truncate ${
                      selectedCity !== "All Cities"
                        ? "bg-slate-900/80 border-slate-700/80 text-white font-semibold cursor-pointer focus:border-rose-500 focus:outline-none"
                        : "bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed font-medium"
                    }`}
                  >
                    <option value="">Select Area</option>
                    {availableAreas.map((areaName: string) => (
                      <option key={areaName} value={areaName}>
                        {areaName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTAINER */}
        <main className="w-full px-4 sm:px-8 lg:px-16 py-8 sm:py-12 space-y-8">
          <h2 className="sr-only">Available Escort Companions Directory</h2>

          {/* CONTROL STRIP */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30 shadow-inner">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-base font-black text-white block">
                  {selectedTag !== "All Escorts" ? selectedTag : "All Verified Profiles"}{" "}
                  {selectedCity !== "All Cities" ? `• ${selectedCity}` : selectedState !== "All States" ? `• ${selectedState}` : ""}
                </strong>
                <span className="text-xs text-slate-400 font-medium">
                  Showing <strong className="text-rose-400 font-bold">{filteredProfiles.length}</strong> available companion listings
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded-2xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
              <div className="text-xs text-slate-400 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800 font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-rose-400" />
                <span>Sorted by VIP Tier</span>
              </div>
            </div>
          </div>

          {/* EMPTY STATE */}
          {filteredProfiles.length === 0 ? (
            <div className="max-w-md mx-auto text-center p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 my-12">
              <div className="h-16 w-16 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Filter className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white">No Profiles Found</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No verified companion profiles match your current search criteria ({selectedTag !== "All Escorts" ? selectedTag : ""}{selectedState !== "All States" ? ` • ${selectedState}` : ""}{selectedCity !== "All Cities" ? ` • ${selectedCity}` : ""}).
                </p>
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs hover:from-rose-500 hover:to-pink-500 transition shadow-lg cursor-pointer"
              >
                Clear Filters & Show All
              </button>
            </div>
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* ESCORTS CARDS LIST — SINGLE ROW FULL WIDTH CLASSIFIED LAYOUT */}
              <div className="space-y-6">
              {paginatedProfiles.map((profile) => {
                const isFav = favorites.has(profile.id);
                const isSuperTop = profile.isSuperTop || (profile.packageType || "").toUpperCase().includes("SUPER_TOP");
                const isVip = profile.isVip || (profile.packageType || "").toUpperCase().includes("VIP");
                const isVerified = profile.isVerified || (profile.packageType || "").toUpperCase().includes("VERIFIED");
                const photoCount = profile.gallery && profile.gallery.length > 0 ? profile.gallery.length + 1 : 7;
                const displayTitle = profile.title || `✳️ Call ${profile.name} ${(profile.phone || '').replace('+91', '').trim()} Only Cash ✳️ Genuine High Profile ${profile.city} Escorts Services 100% Safe`;

                return (
                  <div
                    key={profile.id}
                    className={`group relative rounded-2xl border overflow-hidden shadow-xl transition-all duration-300 flex flex-col md:flex-row backdrop-blur-xl ${
                      isSuperTop
                        ? "bg-[#0b1636] border-sky-400/80 ring-2 ring-sky-400/30 shadow-[0_0_35px_rgba(56,189,248,0.25)]"
                        : "bg-[#090E24] border-slate-800 hover:border-rose-500/60"
                    }`}
                  >
                    {/* SUPER TOP / VIP BADGE AT TOP RIGHT */}
                    <div className="absolute top-0 right-0 z-20">
                      {isSuperTop ? (
                        <div className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-3.5 py-1 text-[11px] font-black text-white rounded-bl-xl shadow-lg border-b border-l border-sky-300/50 flex items-center gap-1.5 animate-pulse">
                          <span>⚡ SUPER TOP</span>
                        </div>
                      ) : isVip ? (
                        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-3 py-1 text-[11px] font-black text-slate-950 rounded-bl-xl shadow-lg border-b border-l border-amber-300/40 flex items-center gap-1">
                          <span>👑 VIP FEATURED</span>
                        </div>
                      ) : isVerified ? (
                        <div className="bg-emerald-600 px-3 py-1 text-[11px] font-black text-white rounded-bl-xl shadow-lg flex items-center gap-1">
                          <span>🛡️ VERIFIED</span>
                        </div>
                      ) : (
                        <div className="bg-rose-600/90 px-3 py-1 text-[11px] font-bold text-white rounded-bl-xl shadow-lg">
                          <span>CLASSIFIED</span>
                        </div>
                      )}
                    </div>

                    {/* Left Column: Photo Container (Taller height for rich visual appeal) */}
                    {(() => {
                      const isValidUrl =
                        typeof profile.photoUrl === "string" &&
                        profile.photoUrl.trim().length > 0 &&
                        !profile.photoUrl.startsWith("data:");
                      
                      let displayPhoto = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
                      if (isValidUrl) {
                        let pUrl = profile.photoUrl.replace(/\\/g, '/');
                        if (!pUrl.startsWith('http') && !pUrl.startsWith('data:')) {
                           if (!pUrl.startsWith('/')) pUrl = '/' + pUrl;
                           pUrl = 'https://mycityqueen.com/x' + pUrl;
                        }
                        displayPhoto = pUrl;
                      }

                      return (
                        <Link href={getProfileUrl(profile)} className="block relative w-full md:w-72 lg:w-80 h-72 sm:h-80 md:h-[260px] shrink-0 overflow-hidden bg-slate-950">
                          <img 
                            src={displayPhoto}
                            alt={profile.title || profile.name}
                            title={profile.title || profile.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
                            }}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                          />

                          {/* Photo Navigation Arrows */}
                          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
                            <span className="h-8 w-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center backdrop-blur-sm">
                              <ChevronLeft className="h-4 w-4" />
                            </span>
                            <span className="h-8 w-8 rounded-full bg-slate-950/70 text-white flex items-center justify-center backdrop-blur-sm">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </div>

                          {/* Photo Count Badge (Bottom Left) */}
                          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white border border-slate-700 flex items-center gap-1 z-10 shadow">
                            <span>📷 {photoCount}</span>
                          </div>

                          
                        </Link>
                      );
                    })()}

                    {/* Right Column: Listing Info & Action Buttons */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Catchy Main Title Headline (Bold Pink / Rose Font - Line Clamped to 1-2 lines) */}
                        <Link href={getProfileUrl(profile)} className="block group-hover:text-rose-400 transition">
                          <h3 className="text-base sm:text-lg font-black text-[#f43f5e] hover:text-pink-300 leading-snug tracking-tight line-clamp-1 sm:line-clamp-2">
                            {displayTitle}
                          </h3>
                        </Link>

                        {/* Description Snippet */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium line-clamp-3">
                          {profile.description || `✳️ Call And WhatsApp ${profile.name} ${profile.phone} ((Only Cash Payment)) ✳️ My Name Is ${profile.name} High Profile Hot Sexy Call Girl Service In ${profile.city}. My Service Available In Incall And Outcall On 24x7 Available In All ${profile.city} Etc.`}
                        </p>

                        {/* Meta Tags: Age & Location */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-bold">
                          <span className="flex items-center gap-1.5 text-slate-200">
                            <span className="text-rose-400">📷</span> {profile.age || 23} years
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-200">
                            <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            <strong>{profile.location || profile.city}</strong> / ALL {profile.city?.toUpperCase()}...
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Rate + Action Buttons */}
                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
                            {profile.rate || "₹5,000 / hr"}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                            24/7 Incall &amp; Outcall
                          </span>
                        </div>

                        {/* Circular Action Buttons (Call, WhatsApp & Telegram) */}
                        <div className="flex items-center gap-2.5">
                          {profile.phone && (
                            <a
                              href={`tel:${profile.phone}`}
                              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white hover:bg-rose-50 text-rose-600 flex items-center justify-center shadow-lg transition hover:scale-110 border border-slate-200"
                              title="Call Now"
                            >
                              <Phone className="h-5 w-5 fill-rose-600" />
                            </a>
                          )}
                          <a
                            href={`https://wa.me/${(profile.whatsapp || profile.phone || "919876500000").replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg transition hover:scale-110"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="h-5 w-5 fill-white" />
                          </a>
                          <a
                            href={
                              profile.telegram
                                ? profile.telegram.startsWith("http")
                                  ? profile.telegram
                                  : `https://t.me/${profile.telegram.replace("@", "")}`
                                : `https://t.me/+91${(profile.phone || "").replace(/[^0-9]/g, "")}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white flex items-center justify-center shadow-lg transition hover:scale-110"
                            title="Chat on Telegram"
                          >
                            <Send className="h-4.5 w-4.5 fill-white text-white -ml-0.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-8 border-t border-slate-800/60">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(p - 1, 1));
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-rose-500/50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <ChevronLeft className="h-4 w-4 text-rose-400" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-2">
                    {(() => {
                      const pages: (number | string)[] = [];
                      const maxVisible = 5;

                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        let start = Math.max(2, currentPage - 1);
                        let end = Math.min(totalPages - 1, currentPage + 1);

                        if (currentPage <= 3) {
                          start = 2;
                          end = 4;
                        } else if (currentPage >= totalPages - 2) {
                          start = totalPages - 3;
                          end = totalPages - 1;
                        }

                        if (start > 2) pages.push("...");
                        for (let i = start; i <= end; i++) pages.push(i);
                        if (end < totalPages - 1) pages.push("...");
                        pages.push(totalPages);
                      }

                      return pages.map((p, idx) => {
                        if (p === "...") {
                          return (
                            <span key={`dots-${idx}`} className="px-2 text-xs font-bold text-slate-500">
                              ...
                            </span>
                          );
                        }
                        const pageNum = p as number;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 350, behavior: "smooth" });
                            }}
                            className={`h-9 w-9 rounded-2xl text-xs font-black transition cursor-pointer flex items-center justify-center shadow-md ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-600/30 scale-105 border border-rose-400/40"
                                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                      window.scrollTo({ top: 350, behavior: "smooth" });
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-rose-500/50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4 text-rose-400" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ALWAYS RENDER ACCORDION, LOCALITIES & FAQS (EVEN WHEN ZERO PROFILES FOUND) */}
          <div className="space-y-8 max-w-6xl mx-auto mt-8">
            {/* DYNAMIC CITY AREA / PAN-INDIA STATES ACCORDION */}
            <CityCategoryAccordion
              currentCity={selectedCity}
              selectedArea={searchLocation}
              selectedTag={selectedTag}
              locationTree={locationTree}
              onSelectCity={(city) => {
                handleSelectCity(city);
                window.scrollTo({ top: 350, behavior: "smooth" });
              }}
              onSelectArea={(area, tag) => {
                handleSelectArea(area);
                if (tag && tag !== "All Escorts") {
                  setSelectedTag(tag);
                  updateUrl(selectedCity, selectedState, area, tag);
                }
                setCurrentPage(1);
                window.scrollTo({ top: 350, behavior: "smooth" });
              }}
            />

            {/* RICH SEO EDITORIAL CONTENT SECTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090d1f] border border-slate-800/80 shadow-2xl space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 font-bold text-[11px] uppercase tracking-wider border border-rose-500/25 inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />
                    Verified Companion Guide
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-bold text-[11px] uppercase tracking-wider border border-cyan-500/25">
                    {selectedCity !== "All Cities" ? selectedCity : "Pan-India"}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Verified Independent Escorts &amp; Call Girls in {selectedCity !== "All Cities" ? selectedCity : "India"}
                </h2>
                {(() => {
                  const normalizedTagSlug = selectedTag && selectedTag !== "All Escorts" ? slugifyPath(selectedTag) : "";
                  const catOverride = currentCitySeo?.categorySeo?.find(
                    (c) =>
                      c.categorySlug === normalizedTagSlug ||
                      c.categorySlug === selectedTag.toLowerCase().replace(/\s+/g, "-")
                  );

                  const rawContent =
                    catOverride?.pageContent ||
                    customPageContent ||
                    currentCitySeo?.pageContent ||
                    areaSeo?.pageContent ||
                    currentStateSeo?.pageContent ||
                    currentCitySeo?.metaDescription ||
                    currentStateSeo?.metaDescription ||
                    `Welcome to the premier verified adult classifieds directory for {city}. Discover 100% genuine independent female companions, VIP models, and high-class call girls offering discretion, privacy, and exceptional hospitality. Connect directly with verified companions for hotel incall meetings and private doorstep outcalls across top colonies in {city}.`;

                  const currentCityLabel =
                    selectedCity !== "All Cities"
                      ? selectedCity
                      : currentCitySeo?.name || currentStateSeo?.name || "India";
                  const renderedText = rawContent
                    .replace(/\{city\}/gi, currentCityLabel)
                    .replace(/\{location\}/gi, currentCityLabel)
                    .replace(/\[city\]/gi, currentCityLabel)
                    .replace(/\[location\]/gi, currentCityLabel)
                    .replace(/\{area\}/gi, areaSeo?.name || currentCityLabel);

                  const hasHtml = /<[a-z][\s\S]*>/i.test(renderedText);

                  if (hasHtml) {
                    return (
                      <div
                        className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2 [&_a]:text-rose-400 [&_a]:underline [&_a:hover]:text-rose-300 [&_strong]:text-white [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-slate-300"
                        dangerouslySetInnerHTML={{ __html: renderedText }}
                      />
                    );
                  }

                  return (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {renderedText}
                    </p>
                  );
                })()}
              </div>

              {/* TRUST & SAFETY HIGHLIGHTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-white">100% Selfie-Verified Profiles</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Every companion profile is verified with live selfie identification so you meet real companions without photo fraud.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-white">Incall &amp; Outcall Services</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enjoy safe, private incall rendezvous at luxury hotels or flexible outcall visits directly to your accommodation in {selectedCity}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-white">Zero Advance Payment Policy</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Connect directly via WhatsApp or phone call. Always pay directly upon meeting — never transfer advance booking fees to anyone.
                  </p>
                </div>
              </div>

              {/* BOOKING GUIDE IN CITY */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  How to Connect with Companions in {selectedCity}
                </h4>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed pl-1">
                  <li>Browse verified listings above and filter by your preferred locality or package tier.</li>
                  <li>Click on the WhatsApp or Call button to reach out directly to the independent companion.</li>
                  <li>Confirm meeting location (5-star hotel incall or private apartment outcall) and timing.</li>
                  <li>Maintain mutual respect and clear communications for a safe, discreet companionship experience.</li>
                </ol>
              </div>
            </div>

            {/* MICRO SERVICE LOCALITIES & PINCODES (LOCAL SEO) FOR CITY OR REGIONAL HUBS FOR STATE */}
            {citySeo?.microServiceAreas && citySeo.microServiceAreas.length > 0 ? (
              <div className="p-6 rounded-3xl bg-[#090d1f] border border-slate-800/80 shadow-xl space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-tight">
                      Popular Localities &amp; Areas in {selectedCity}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Direct incall &amp; outcall companion services available in these prime colonies
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {citySeo.microServiceAreas.map((area, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchLocation(area);
                        setCurrentPage(1);
                        window.scrollTo({ top: 350, behavior: "smooth" });
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        searchLocation.toLowerCase() === area.toLowerCase()
                          ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30"
                          : "bg-slate-900/90 text-purple-300 border-purple-500/20 hover:border-purple-400/50 hover:bg-slate-800"
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{area}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : stateSeo?.popularDistricts && stateSeo.popularDistricts.length > 0 ? (
              <div className="p-6 rounded-3xl bg-[#090d1f] border border-slate-800/80 shadow-xl space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-tight">
                      Major Cities &amp; Regional Hubs across {stateSeo.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Direct incall &amp; outcall companion services across top districts in {stateSeo.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {stateSeo.popularDistricts.map((district, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedCity(district);
                        setCurrentPage(1);
                        window.scrollTo({ top: 350, behavior: "smooth" });
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedCity.toLowerCase() === district.toLowerCase()
                          ? "bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30"
                          : "bg-slate-900/90 text-rose-300 border-rose-500/20 hover:border-rose-400/50 hover:bg-slate-800"
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{district}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* DYNAMIC GOOGLE FAQS SECTION (RICH SNIPPETS ON-PAGE) FOR CITY OR STATE */}
            {(() => {
              const normalizedTagSlug = selectedTag && selectedTag !== "All Escorts" ? slugifyPath(selectedTag) : "";
              const catOverride = currentCitySeo?.categorySeo?.find(
                (c) =>
                  c.categorySlug === normalizedTagSlug ||
                  c.categorySlug === selectedTag.toLowerCase().replace(/\s+/g, "-")
              );

              const currentCityLabel =
                selectedCity !== "All Cities"
                  ? selectedCity
                  : currentCitySeo?.name || currentStateSeo?.name || "India";

              const rawCandidateFaqs =
                catOverride?.faqs && catOverride.faqs.length > 0
                  ? catOverride.faqs
                  : customFaqs && customFaqs.length > 0
                  ? customFaqs
                  : currentCitySeo?.faqs && currentCitySeo.faqs.length > 0
                  ? currentCitySeo.faqs
                  : areaSeo?.faqs && areaSeo.faqs.length > 0
                  ? areaSeo.faqs
                  : currentStateSeo?.faqs && currentStateSeo.faqs.length > 0
                  ? currentStateSeo.faqs
                  : [
                      {
                        question: `How to book verified escorts in ${currentCityLabel}?`,
                        answer: `You can browse 100% verified escort profiles on our directory in ${currentCityLabel} and connect directly via WhatsApp or phone call without any advance booking charges.`,
                      },
                      {
                        question: `Are incall and outcall services available in ${currentCityLabel}?`,
                        answer: `Yes, independent companions and verified call girls provide both incall at luxury 5-star hotels/apartments and outcall doorstep visits across ${currentCityLabel}.`,
                      },
                      {
                        question: `What are the payment options for escort service in ${currentCityLabel}?`,
                        answer: `Payment can be made directly in cash or via secure UPI upon meeting in person. Always verify the profile selfie-verification badge before scheduling.`,
                      },
                      {
                        question: `Is customer privacy protected in ${currentCityLabel}?`,
                        answer: `Yes, 100% discreet and private companionship is assured. No client data is logged or shared with third parties.`,
                      },
                    ];

              const activeFaqs = rawCandidateFaqs
                .filter((f) => f && (f.question?.trim() || f.answer?.trim()))
                .map((f) => ({
                  question: (f.question || "")
                    .replace(/\{city\}/gi, currentCityLabel)
                    .replace(/\{location\}/gi, currentCityLabel)
                    .replace(/\[city\]/gi, currentCityLabel)
                    .replace(/\[location\]/gi, currentCityLabel)
                    .replace(/\{area\}/gi, areaSeo?.name || currentCityLabel),
                  answer: (f.answer || "")
                    .replace(/\{city\}/gi, currentCityLabel)
                    .replace(/\{location\}/gi, currentCityLabel)
                    .replace(/\[city\]/gi, currentCityLabel)
                    .replace(/\[location\]/gi, currentCityLabel)
                    .replace(/\{area\}/gi, areaSeo?.name || currentCityLabel),
                }));

              const locationLabel = areaSeo
                ? `${areaSeo.name}, ${currentCityLabel}`
                : selectedCity && selectedCity !== "All Cities"
                ? currentCityLabel
                : "Pan-India";
              return (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#090d1f] border border-slate-800/80 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white tracking-tight">
                          Frequently Asked Questions - {locationLabel} Escorts
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Everything you need to know about booking verified companions in {locationLabel}
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Sparkles className="h-2.5 w-2.5" /> Schema Verified
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeFaqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      const hasHtml = /<[a-z][\s\S]*>/i.test(faq.answer);
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden transition"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-white hover:text-amber-300 transition cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-amber-400 font-mono">Q{idx + 1}.</span>
                              <span>{faq.question}</span>
                            </span>
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4 text-amber-400 shrink-0 rotate-180 transition-transform" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/30 whitespace-pre-line">
                              {hasHtml ? (
                                <div
                                  className="space-y-1 [&_a]:text-rose-400 [&_a]:underline [&_strong]:text-white [&_p]:mb-1"
                                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                              ) : (
                                faq.answer
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

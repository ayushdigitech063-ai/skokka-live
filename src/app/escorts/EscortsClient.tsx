"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
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
  RefreshCw
} from "lucide-react";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { getProfileUrl, slugifyPath } from "@/lib/seo/seoEngine";

interface EscortsPageProps {
  defaultCity?: string;
  defaultTag?: string;
}

const ITEMS_PER_PAGE = 8;

export default function EscortsClient({ defaultCity, defaultTag }: EscortsPageProps = {}) {
  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedTag, setSelectedTag] = useState(defaultTag || "All Escorts");
  const [selectedCity, setSelectedCity] = useState(defaultCity || "All Cities");
  const [cms, setCms] = useState<HomePageCmsConfig | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    updateUrlParams(selectedCity, tag);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
    updateUrlParams(city, selectedTag);
  };

  const updateUrlParams = (city: string, tag: string) => {
    if (typeof window === "undefined") return;
    const cleanCity = city && city !== "All Cities" ? slugifyPath(city) : "";
    const cleanTag = tag && tag !== "All Escorts" ? slugifyPath(tag) : "";

    let newUrl = "/escorts";
    if (cleanCity && cleanTag) {
      newUrl = `/escorts/${cleanCity}/${cleanTag}`;
    } else if (cleanCity) {
      newUrl = `/escorts/${cleanCity}`;
    } else if (cleanTag) {
      newUrl = `/escorts/${cleanTag}`;
    }
    window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    setCms(getHomePageCmsConfig());
    fetchEscortProfiles().then(setProfiles);

    const urlParams = new URLSearchParams(window.location.search);
    const queryCity = urlParams.get("city");
    const queryTag = urlParams.get("tag");
    if (queryCity) setSelectedCity(queryCity);
    else if (defaultCity) setSelectedCity(defaultCity);
    if (queryTag) setSelectedTag(queryTag);
    else if (defaultTag) setSelectedTag(defaultTag);

    const handleCmsUpdate = () => setCms(getHomePageCmsConfig());
    const handleEscortsUpdate = () => fetchEscortProfiles().then(setProfiles);

    window.addEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
    window.addEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);

    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
      window.removeEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);
    };
  }, [defaultCity, defaultTag]);

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
      "Jaipur",
      "Delhi",
      "Mumbai",
      "Bangalore",
      "Hyderabad",
      "Goa",
      "Pune",
      "Kolkata",
      "Ahmedabad",
      "Chandigarh",
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

    return matchesLoc && matchesTag && matchesCity;
  });

  const getPackagePriority = (p: EscortProfileItem) => {
    const pkg = (p.packageType || "").toUpperCase();
    const name = (p.name || "").toUpperCase();
    
    if (name.includes("REGER") || p.price === 0 || pkg.includes("FREE") || pkg === "FREE_STANDARD" || (!p.isVip && !p.isVerified && !pkg.includes("VIP") && !pkg.includes("VERIFIED"))) {
      return 999;
    }
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
    setSelectedCity("All Cities");
    setSearchLocation("");
    setCurrentPage(1);
  };

  const isFiltered = selectedTag !== "All Escorts" || selectedCity !== "All Cities" || searchLocation.trim() !== "";

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
                ) : (
                  <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                    in India
                  </span>
                )}
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Browse authentic verified female companions &amp; independent models for incall &amp; outcall meetings{selectedCity !== "All Cities" ? ` in ${selectedCity}` : " across top Indian cities"}.
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
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                />
                {searchLocation && (
                  <button
                    type="button"
                    onClick={() => setSearchLocation("")}
                    className="p-1.5 text-slate-400 hover:text-white transition mr-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* CATEGORIES HORIZONTAL SCROLLING PILLS */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-rose-400" />
                <span>Categories</span>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
                {categories.map((cat) => {
                  const isActive = selectedTag === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => handleSelectTag(cat.name)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer flex items-center gap-1.5 shadow-md ${
                        isActive
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-600/30 scale-105 border border-rose-400/40"
                          : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CITIES HORIZONTAL PILLS */}
            <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1 max-w-4xl mx-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-rose-400" /> City:
              </span>
              {citiesList.map((c) => {
                const isActive = selectedCity === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectCity(c)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold"
                        : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
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
                  {selectedCity !== "All Cities" ? `• ${selectedCity}` : ""}
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
                  No verified companion profiles match your current search criteria ({selectedTag !== "All Escorts" ? selectedTag : ""} {selectedCity !== "All Cities" ? selectedCity : ""}).
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
            /* ESCORTS CARDS GRID - ULTRA LUXURY STYLING */
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
                {paginatedProfiles.map((profile) => {
                  const isFav = favorites.has(profile.id);
                  const isVip = profile.isVip || (profile.packageType || "").toUpperCase().includes("VIP");
                  const isVerified = profile.isVerified || (profile.packageType || "").toUpperCase().includes("VERIFIED");

                  return (
                    <div
                      key={profile.id}
                      className="group relative rounded-3xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-xl hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
                    >
                      <div>
                        {/* Photo Container */}
                        <Link href={getProfileUrl(profile)} className="block relative h-72 sm:h-80 w-full overflow-hidden bg-slate-950">
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-108 transition-transform duration-700 opacity-90"
                            style={{
                              backgroundImage: `url('${profile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}')`
                            }}
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                            {isVip ? (
                              <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-3 py-1 text-[11px] font-black text-slate-950 shadow-lg border border-amber-300/60">
                                <Crown className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                                <span>VIP FEATURED ⭐</span>
                              </div>
                            ) : isVerified ? (
                              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/95 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white shadow-lg border border-emerald-400/40">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                                <span>VERIFIED 🛡️</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-slate-300 border border-slate-700">
                                <span>Standard</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-400/40 shadow-md flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span>{profile.rating || 4.9}</span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => toggleFavorite(e, profile.id)}
                                className={`h-8 w-8 rounded-full bg-slate-950/80 backdrop-blur-md border flex items-center justify-center transition hover:scale-110 cursor-pointer shadow-md ${
                                  isFav ? "border-rose-500 text-rose-500 bg-rose-500/20" : "border-slate-700 text-slate-400 hover:text-rose-400"
                                }`}
                              >
                                <Heart className={`h-4 w-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                              </button>
                            </div>
                          </div>

                          {/* Image Gradient & Overlay Info */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#090D1E] via-[#090D1E]/80 to-transparent p-4 pt-14 space-y-1 z-10">
                            <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition leading-tight truncate">
                              {profile.name}{profile.age > 0 ? `, ${profile.age}` : ""}
                            </h3>
                            <p className="text-xs font-bold text-rose-300 flex items-center gap-1 truncate">
                              <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                              <span>{profile.location || profile.city}</span>
                            </p>
                            <div className="pt-1.5 flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-400/40 shrink-0">
                                {profile.rate || "₹4,000 / hr"}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                                {profile.availability?.includes("Incall") || profile.availability?.includes("Outcall")
                                  ? "Incall & Outcall"
                                  : profile.availability || "Available 24/7"}
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Description & Tag Pill list */}
                        <div className="p-4 space-y-3">
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-medium">
                            {profile.description || profile.title || `${profile.name} - Premium verified companion available for meetings.`}
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {(profile.tags && profile.tags.length > 0 ? profile.tags : [profile.category || "VIP Escorts"]).slice(0, 3).map((tag) => (
                              <span key={tag} className="rounded-lg bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700 flex items-center gap-0.5">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Details & WhatsApp */}
                      <div className="p-3.5 pt-0 grid grid-cols-2 gap-2 z-10">
                        <Link
                          href={getProfileUrl(profile)}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 text-center border border-slate-700 cursor-pointer"
                        >
                          📄 Details
                        </Link>
                        <a
                          href={(profile.whatsapp || profile.phone) ? `https://wa.me/${(profile.whatsapp || profile.phone || "").replace(/[^0-9]/g, "")}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 text-center"
                        >
                          💬 WhatsApp
                        </a>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
                    ))}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}

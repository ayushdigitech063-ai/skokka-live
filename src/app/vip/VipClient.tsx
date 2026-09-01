"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import {
  Crown,
  Star,
  Check,
  MapPin,
  Heart,
  UserCheck,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { getProfileUrl } from "@/lib/seo/seoEngine";

export default function VipClientPage() {
  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);
  const [cms, setCms] = useState<HomePageCmsConfig | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  useEffect(() => {
    setCms(getHomePageCmsConfig());
    fetchEscortProfiles().then(setProfiles);

    const handleCmsUpdate = () => setCms(getHomePageCmsConfig());
    const handleEscortsUpdate = () => fetchEscortProfiles().then(setProfiles);

    window.addEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
    window.addEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);

    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
      window.removeEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);
    };
  }, []);

  // Filter VIP Escorts (isVip or packageType includes VIP, fallback to all if none explicitly flagged)
  const allVipProfiles = profiles.filter((p) => {
    if (!p) return false;
    if (p.status && p.status !== "APPROVED") return false;
    const catStr = p.category ? String(p.category).toLowerCase() : "";
    const nameStr = p.name ? String(p.name).toLowerCase() : "";
    if (p.age === 0 || catStr.includes("product") || nameStr.includes("shilajit")) return false;

    return p.isVip || p.packageType?.includes("VIP") || catStr.includes("vip");
  });

  // If no explicit VIP flag in dataset, show top profiles as VIP showcase
  const displayProfilesList = allVipProfiles.length > 0 ? allVipProfiles : profiles;

  const filteredVipProfiles = displayProfilesList.filter((p) => {
    const locSearch = searchLocation.toLowerCase();
    const citySearch = selectedCity.toLowerCase();
    const cityStr = (p.city || p.location || "").toLowerCase();

    const matchesLoc = locSearch ? cityStr.includes(locSearch) : true;
    const matchesCity = selectedCity === "All Cities" ? true : cityStr.includes(citySearch);

    return matchesLoc && matchesCity;
  });

  const availableCities = Array.from(
    new Set(["All Cities", ...displayProfilesList.map((p) => p.city || p.location || "Jaipur")])
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* LUXURY VIP HERO BANNER */}
        <section className="relative overflow-hidden w-full bg-slate-950 border-b border-amber-500/30 py-16 lg:py-24 px-6 sm:px-12 lg:px-16 text-center space-y-6 shadow-2xl flex flex-col justify-center items-center">
          {/* BLURRED MODEL BACKGROUND WITH GOLDEN GLOW */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[14px] opacity-20 scale-105 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/75 to-slate-950 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-gradient-to-b from-amber-500/20 via-yellow-600/10 to-transparent blur-[150px] animate-pulse pointer-events-none" />

          {/* BADGES ROW */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider border border-amber-500/40 inline-flex items-center gap-1.5 shadow-lg">
              <Crown className="h-4 w-4 text-amber-400" />
              {cms?.vipEscorts.badge || "5-Star Hotel Outcalls & Luxury Escorts"}
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/90 px-4 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md shadow-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>100% VERIFIED HIGH-CLASS MODELS</span>
            </div>
          </div>

          {/* TITLE & SUBTITLE */}
          <div className="relative z-10 space-y-4 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              {cms?.vipEscorts.title || "VIP High-Class Companions"}{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent block sm:inline">
                Showcase
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              {cms?.vipEscorts.subtitle ||
                "Premium models available for corporate events, luxury travel & elite 5-star hotel outcall meetings across India."}
            </p>
          </div>

          {/* QUICK SEARCH & CITY FILTER STRIP */}
          <div className="relative z-10 pt-4 w-full max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-amber-400" />
              <input
                type="text"
                placeholder="Search area (e.g. Bani Park, Malviya Nagar)..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-medium shadow-xl"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {availableCities.slice(0, 5).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
                    selectedCity === city
                      ? "bg-amber-500 text-slate-950 shadow-lg border border-amber-400"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN VIP CARDS GRID CONTAINER (100% FULL SCREEN WIDTH) */}
        <main className="w-full px-6 sm:px-12 lg:px-16 py-12 space-y-8">
          <h2 className="sr-only">VIP Featured Listings</h2>

          {/* HEADER STRIP */}
          <div className="flex flex-wrap items-center justify-between bg-slate-900/90 border border-amber-500/30 p-5 rounded-3xl gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <strong className="text-base font-extrabold text-white block">
                  VIP Elite Listings Directory {selectedCity !== "All Cities" ? `• ${selectedCity}` : ""}
                </strong>
                <span className="text-xs text-slate-400 font-medium">
                  Showing <strong className="text-amber-400">{filteredVipProfiles.length}</strong> 5-Star VIP high-class models
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1.5 bg-amber-950/80 px-4 py-2 rounded-2xl border border-amber-500/30 shadow-md">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>100% Verified Private Hotel Meetings</span>
              </span>
            </div>
          </div>

          {/* VIP CARDS GRID (LUXURY HORIZONTAL & VERTICAL 3-COLUMN CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredVipProfiles.map((vipProfile) => (
              <div
                key={vipProfile.id}
                className="group rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 overflow-hidden shadow-2xl hover:border-amber-400 transition duration-500 flex flex-col justify-between relative"
              >
                <div>
                  {/* VIP Photo Container (h-80 / 320px) */}
                  <div className="h-80 w-full bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950 relative overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700 opacity-95"
                      style={{
                        backgroundImage: `url('${
                          vipProfile.photoUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                        }')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <div className="px-3.5 py-1.5 rounded-full bg-amber-500/95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-amber-400/40">
                        <Crown className="h-3.5 w-3.5" />
                        <span>{vipProfile.category || "VIP Featured"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md text-amber-400 font-bold text-xs border border-amber-400/40 shadow-md flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{vipProfile.rating || 5.0}</span>
                        </div>

                        <div className="h-8 w-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-md">
                          <Heart className="h-4.5 w-4.5 fill-rose-500" />
                        </div>
                      </div>
                    </div>

                    {/* Gradient Overlay with Name, Location, Rates */}
                    <div className="absolute inset-x-0 bottom-0 p-4.5 pt-12 space-y-1 z-10">
                      <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition leading-tight">
                        {vipProfile.name}
                        {vipProfile.age > 0 ? `, ${vipProfile.age}` : ""}
                      </h3>
                      <p className="text-xs font-bold text-rose-300 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        <span>{vipProfile.location || vipProfile.city}</span>
                      </p>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-400/40 inline-block">
                          {vipProfile.rate}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                          {vipProfile.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4.5 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-medium">
                      {vipProfile.description || vipProfile.title}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(vipProfile.tags || ["VIP", "Independent", "5-Star Outcalls"]).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1"
                        >
                          ⭐ #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="p-4.5 pt-0 grid grid-cols-2 gap-2">
                  <Link
                    href={getProfileUrl(vipProfile)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    📞 View Details
                  </Link>
                  <a
                    href={`https://wa.me/${
                      vipProfile.whatsapp || "919876500000"
                    }?text=${encodeURIComponent(`Hi ${vipProfile.name}, I found your VIP High-Class listing on MyCityQueen!`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1 text-center cursor-pointer"
                  >
                    💬 WhatsApp VIP
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

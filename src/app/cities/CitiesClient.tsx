"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { MapPin, ShieldCheck, Zap, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";

const ITEMS_PER_PAGE = 8;

export default function CitiesClientPage() {
  const [cmsConfig, setCmsConfig] = useState<HomePageCmsConfig | null>(null);
  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCmsConfig(getHomePageCmsConfig());
      fetchEscortProfiles().then(setProfiles);

      const handleUpdate = () => {
        setCmsConfig(getHomePageCmsConfig());
        fetchEscortProfiles().then(setProfiles);
      };

      window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.addEventListener(ESCORTS_UPDATE_EVENT, handleUpdate);
      window.addEventListener("storage", handleUpdate);

      return () => {
        window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
        window.removeEventListener(ESCORTS_UPDATE_EVENT, handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      };
    }
  }, []);

  const citiesList = cmsConfig?.topCities?.cities || [
    { name: "Jaipur Escorts", count: "Popular Escorts", highlight: "Popular" },
    { name: "Delhi Escorts", count: "High Class Models", highlight: "Hot" },
    { name: "Mumbai Call Girls", count: "VIP Russian Escorts", highlight: "VIP" },
    { name: "Bangalore Escorts", count: "5-Star Companions", highlight: "Popular" },
    { name: "Goa VIP Companions", count: "Beach Resorts", highlight: "Luxury" },
    { name: "Pune Call Girls", count: "Koregaon Park", highlight: "Active" },
    { name: "Hyderabad Escorts", count: "Banjara Hills VIP", highlight: "Popular" },
    { name: "Kolkata Escorts", count: "Park Street VIP", highlight: "Active" },
  ];

  const totalLive = profiles.filter((p) => !p.status || p.status === "APPROVED").length;

  const totalPages = Math.ceil(citiesList.length / ITEMS_PER_PAGE) || 1;
  const paginatedCities = citiesList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#030614] text-white font-sans selection:bg-rose-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* TOP TICKER BAR */}
        <div className="w-full bg-rose-600 py-2 px-4 text-center text-[11px] font-black uppercase tracking-widest text-white overflow-hidden">
          <span className="inline-flex items-center gap-6 animate-none">
            🔥 No.1 Adult Classifieds Portal in India &nbsp;•&nbsp; ✅ 100% Verified Profiles &nbsp;•&nbsp; 💬 Direct WhatsApp &amp; Phone Contact
          </span>
        </div>

        {/* HERO BANNER */}
        <section className="relative overflow-hidden w-full bg-[#030614] pt-28 sm:pt-32 pb-16 lg:pb-24 px-4 sm:px-8 text-center">
          {/* bg glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f43f5e22_0%,transparent_60%)] pointer-events-none" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm scale-110 pointer-events-none"
            style={{ backgroundImage: `url('${cmsConfig?.hero?.bgImage || "/images/hero-sofa-model.png"}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030614]/60 to-[#030614] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-5">
            {/* Badge row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[11px] font-black uppercase tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Verified City Directory
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-widest">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                {totalLive} Live Listings Active
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              {cmsConfig?.topCities?.title || "Browse Escorts"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
                By City
              </span>
            </h1>
            <p className="text-[15px] sm:text-[17px] text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {cmsConfig?.topCities?.subtitle ||
                "Select your city to connect with verified independent escorts, call girls & VIP companions nearby."}
            </p>
          </div>
        </section>

        {/* BREADCRUMB + META BAR */}
        <div className="w-full border-y border-slate-800/60 bg-[#080d1f] px-4 sm:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-bold">All Cities</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Direct WhatsApp Booking
              </span>
              <Link
                href="/categories"
                className="text-rose-400 hover:text-white border border-rose-500/40 hover:border-rose-500 px-3 py-1 rounded-full transition-colors"
              >
                View All Categories →
              </Link>
            </div>
          </div>
        </div>

        {/* CITIES GRID */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <h2 className="sr-only">Top Indian Cities Directory</h2>
          <p className="text-[13px] text-slate-500 mb-8 font-medium">
            Showing <span className="text-white font-bold">{citiesList.length}</span> cities with active verified companions
          </p>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedCities.map((c, idx) => {
                const pureCityName = c.name.replace(/ Escorts| Call Girls| VIP Companions/g, "").trim();
                const cleanLower = pureCityName.toLowerCase();
                const liveCount = profiles.filter((p) => {
                  if (!p || (p.status && p.status !== "APPROVED")) return false;
                  const pCity = (p.city || p.location || "").toLowerCase();
                  return pCity.includes(cleanLower) || cleanLower.includes(pCity);
                }).length;

                return (
                  <Link
                    key={c.name || idx}
                    href={`/escorts/${pureCityName.toLowerCase().replace(/\s+/g, "-")}/`}
                    className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0e1225] border border-slate-800/80 hover:border-rose-500/40 transition-all duration-300 shadow-lg hover:shadow-rose-900/10 hover:-translate-y-0.5"
                  >
                    {/* Top row: icon + badge */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="flex items-center justify-center h-11 w-11 rounded-xl bg-rose-700 text-white shadow-lg shadow-rose-900/40">
                        <MapPin className="h-5 w-5 fill-white/20 stroke-white stroke-2" />
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 bg-rose-500/15 border border-rose-500/25 px-3 py-1 rounded-full">
                        {c.highlight || "Popular"}
                      </span>
                    </div>

                    {/* City name + live count */}
                    <div className="mb-3">
                      <h3 className="text-[17px] font-black text-white leading-snug group-hover:text-rose-300 transition-colors">
                        {pureCityName} Escorts
                      </h3>
                      <span className="text-[13px] font-bold text-amber-400 mt-1 block">
                        {liveCount} Live Listing{liveCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[12px] text-slate-400 leading-relaxed mb-5">
                      Verified independent escorts &amp; high class companions in {pureCityName}.
                    </p>

                    {/* CTA button */}
                    <span className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 group-hover:border-rose-500/50 group-hover:text-white text-slate-300 font-extrabold text-[11px] uppercase tracking-widest transition-colors block text-center">
                      View {pureCityName} Escorts →
                    </span>
                  </Link>
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

          {/* BOTTOM TRUST SECTION */}
          <div className="mt-16 rounded-2xl bg-[#0e1225] border border-slate-800 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-1">Can&apos;t find your city?</h3>
              <p className="text-[13px] text-slate-400">
                Browse all verified escorts across India by category or use the search to find companions near you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/escorts"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-[12px] uppercase tracking-wider transition-colors"
              >
                <Zap className="h-4 w-4" /> All Escorts
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black text-[12px] uppercase tracking-wider transition-colors"
              >
                <ArrowRight className="h-4 w-4" /> Categories
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

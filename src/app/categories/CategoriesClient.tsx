"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { slugifyPath } from "@/lib/seo/seoEngine";

const ITEMS_PER_PAGE = 8;

export default function CategoriesClientPage() {
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

  const rawCategories = cmsConfig?.categories?.categories || [
    {
      label: "Independent Escorts",
      emoji: "💋",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      accent: "from-rose-600 to-pink-600",
      border: "border-rose-500/40",
      cities: ["Jaipur", "Delhi", "Mumbai", "Bangalore", "Goa"],
    },
    {
      label: "VIP Companions",
      emoji: "👑",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      accent: "from-amber-500 to-rose-600",
      border: "border-amber-500/40",
      cities: ["Delhi", "Mumbai", "Bangalore", "Goa", "Pune"],
    },
    {
      label: "College Girls",
      emoji: "🎓",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      accent: "from-purple-600 to-pink-600",
      border: "border-purple-500/40",
      cities: ["Jaipur", "Delhi", "Pune", "Kolkata"],
    },
    {
      label: "Celebrity Models",
      emoji: "⭐",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      accent: "from-emerald-600 to-teal-600",
      border: "border-emerald-500/40",
      cities: ["Mumbai", "Delhi", "Bangalore"],
    },
  ];

  // Deduplicate categories by label
  const categoriesList = Array.from(
    new Map(rawCategories.map((item) => [item.label, item])).values()
  );

  const totalPages = Math.ceil(categoriesList.length / ITEMS_PER_PAGE) || 1;
  const paginatedCategories = categoriesList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-rose-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* HERO BANNER WITH BLURRED MODEL BACKGROUND */}
        <section className="relative overflow-hidden w-full bg-slate-950 border-b border-rose-800/40 pt-28 sm:pt-32 pb-16 lg:pb-24 px-6 sm:px-12 lg:px-16 text-center space-y-6 shadow-2xl flex flex-col justify-center items-center">
          <div
            className="absolute inset-0 bg-cover bg-center blur-[12px] opacity-25 scale-105 pointer-events-none"
            style={{
              backgroundImage: `url('${cmsConfig?.hero?.bgImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80"}')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-gradient-to-b from-rose-600/20 via-pink-600/15 to-transparent blur-[140px] animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider border border-rose-500/40 inline-flex items-center gap-2">
              🔥 {cmsConfig?.categories?.badge || "Browse By Category"}
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/50 bg-rose-950/90 px-4.5 py-1.5 text-xs font-extrabold text-rose-300 backdrop-blur-md shadow-lg shadow-rose-950/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span>✨ {categoriesList.length} CATEGORIES AVAILABLE</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              {cmsConfig?.categories?.title || "Find Escorts by Category"}
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              {cmsConfig?.categories?.subtitle || "Explore verified independent escort companions, VIP models & college companions filtered by category and top cities."}
            </p>
          </div>
        </section>

        {/* MAIN CATEGORIES GRID */}
        <main className="w-full px-6 sm:px-12 lg:px-16 py-12 space-y-8">
          <h2 className="sr-only">All Escort Categories</h2>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCategories.map((cat, idx) => {
                const cleanCategoryLabel = cat.label.toLowerCase();
                const liveCount = profiles.filter((p) => {
                  if (!p || (p.status && p.status !== "APPROVED")) return false;
                  const pCat = (p.category || "").toLowerCase();
                  return pCat.includes(cleanCategoryLabel) || cleanCategoryLabel.includes(pCat);
                }).length;

                const countLabel = `${liveCount} Live Listing${liveCount === 1 ? "" : "s"}`;

                return (
                  <div
                    key={cat.label || idx}
                    className="group rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition duration-500 shadow-2xl flex flex-col justify-between"
                  >
                    <Link href={`/escorts/${slugifyPath(cat.label)}`} className="relative h-52 w-full overflow-hidden block cursor-pointer">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                        alt={cat.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-95 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-black border border-slate-700 shadow-md">
                          {cat.emoji} Category
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                        <div>
                          <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition leading-tight">
                            {cat.label}
                          </h3>
                          <span className="text-xs font-bold text-amber-400 block mt-0.5">{countLabel}</span>
                        </div>
                        <span className="h-8 w-8 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center text-xs shadow-lg group-hover:translate-x-1 transition shrink-0">
                          →
                        </span>
                      </div>
                    </Link>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <p className="text-[11px] text-slate-400 font-medium">Browse verified {cat.label} companions in top locations:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(cat.cities || ["Jaipur", "Delhi", "Mumbai", "Bangalore"]).slice(0, 5).map((city: string) => (
                          <Link
                            key={city}
                            href={`/escorts/${slugifyPath(city)}/${slugifyPath(cat.label)}`}
                            className={`px-3 py-1 rounded-xl border ${cat.border || "border-rose-500/40"} text-slate-200 hover:text-white text-[11px] font-bold bg-slate-800/80 hover:bg-rose-600 transition duration-200 shadow-sm`}
                          >
                            {city}
                          </Link>
                        ))}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}

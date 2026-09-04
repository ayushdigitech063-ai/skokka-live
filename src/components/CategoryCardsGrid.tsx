"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { slugifyPath } from "@/lib/seo/seoEngine";
import { Sparkles } from "lucide-react";

interface CategoryCardsGridProps {
  onSelectCategory?: (category: string) => void;
  onSelectCityCategory?: (city: string, category: string) => void;
}

export function CategoryCardsGrid({
  onSelectCategory,
  onSelectCityCategory,
}: CategoryCardsGridProps) {
  const [cms, setCms] = useState<HomePageCmsConfig | null>(null);
  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);

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

  const categories = cms?.categories?.categories || [
    {
      id: "call_girls",
      label: "Call Girls",
      emoji: "💋",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
    },
    {
      id: "massages",
      label: "Massages",
      emoji: "💆",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
      cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
    },
    {
      id: "male_escorts",
      label: "Male Escorts",
      emoji: "🧔",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
    },
    {
      id: "transsexual",
      label: "Transsexual",
      emoji: "👠",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
    },
    {
      id: "adult_meetings",
      label: "Adult Meetings",
      emoji: "🍸",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      cities: ["Bangalore", "Hyderabad", "Delhi", "Pune", "Mumbai"],
    },
    {
      id: "vip_escorts",
      label: "VIP Escorts",
      emoji: "👑",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      cities: ["Bangalore", "Delhi", "Mumbai", "Goa", "Jaipur"],
    },
  ];

  return (
    <section className="w-full py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 inline-inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-rose-400 inline" />
            <span>{cms?.categories?.badge || "Browse By Category"}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {cms?.categories?.title || "Find Escorts by Category"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {cms?.categories?.subtitle || "Select a category and your city to browse verified listings"}
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => {
            const catLower = cat.label.toLowerCase();
            const liveCount = profiles.filter((p) => {
              if (p.status && p.status !== "APPROVED") return false;
              const tags = (p.tags || []).map((t) => String(t).toLowerCase());
              const category = (p.category || "").toLowerCase();
              return (
                tags.some((t) => t.includes(catLower) || catLower.includes(t)) ||
                category.includes(catLower)
              );
            }).length;

            return (
              <div
                key={cat.label}
                className="group flex flex-col justify-between bg-[#090E24] border border-slate-800 hover:border-rose-500/60 rounded-3xl p-3 shadow-2xl transition duration-300"
              >
                {/* Main Image Box */}
                <Link
                  href={`/escorts/${slugifyPath(cat.label)}`}
                  onClick={(e) => {
                    if (onSelectCategory) {
                      e.preventDefault();
                      onSelectCategory(cat.label);
                    }
                  }}
                  className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden block cursor-pointer"
                >
                  <img
                    src={cat.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                    alt={cat.label}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top-Left Category Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black border border-slate-700 shadow-md flex items-center gap-1">
                      <span className="text-rose-400 font-bold">{cat.emoji || "🔴"}</span>
                      <span>Category</span>
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight drop-shadow-md group-hover:text-rose-400 transition">
                        {cat.label}
                      </h3>
                      <span className="text-xs font-black text-amber-400 block mt-0.5 drop-shadow">
                        {liveCount} Live Listing{liveCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <span className="h-8 w-8 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center text-xs font-black shadow-lg group-hover:scale-110 transition shrink-0">
                      →
                    </span>
                  </div>
                </Link>

                {/* Below Card: Top Location Pills */}
                {cat.cities && cat.cities.length > 0 && (
                  <div className="pt-3 px-2 pb-1 space-y-2">
                    <p className="text-[11px] text-slate-400 font-medium">
                      Browse verified {cat.label} companions in top locations:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.cities.slice(0, 5).map((city) => (
                        <Link
                          key={city}
                          href={`/escorts/${slugifyPath(city)}/${slugifyPath(cat.label)}`}
                          onClick={(e) => {
                            if (onSelectCityCategory) {
                              e.preventDefault();
                              onSelectCityCategory(city, cat.label);
                            }
                          }}
                          className="px-2.5 py-1 rounded-full border border-slate-700/80 hover:border-rose-500/60 text-slate-300 hover:text-white text-[11px] font-bold bg-slate-900/80 hover:bg-rose-600/30 transition duration-200 shadow-sm"
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

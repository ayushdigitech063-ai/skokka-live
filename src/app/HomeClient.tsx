"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { PostAdAuthModal } from "@/components/PostAdAuthModal";
import { HeroSearchModal } from "@/components/HeroSearchModal";
import { Crown, Check, Star, MapPin, Search, ArrowRight, ShieldCheck, Phone, MessageCircle, Sparkles } from "lucide-react";
import { getHomePageCmsConfig, fetchHomePageCmsConfigAsync, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { slugifyPath } from "@/lib/seo/seoEngine";

export default function HomeClient() {
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);
  const [cms, setCms] = useState<HomePageCmsConfig | null>(null);

  useEffect(() => {
    setCms(getHomePageCmsConfig());
    fetchHomePageCmsConfigAsync().then(setCms);
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

  const vipProfiles = profiles
    .filter((p) => {
      if (p.status && p.status !== "APPROVED") return false;
      const pkg = (p.packageType || "").toUpperCase();
      const tags = (p.tags || []).map((t) => String(t).toUpperCase());
      return p.isVip || pkg.includes("VIP") || tags.includes("VIP");
    })
    .slice(0, 3);

  const verifiedProfiles = profiles
    .filter((p) => {
      if (p.status && p.status !== "APPROVED") return false;
      const pkg = (p.packageType || "").toUpperCase();
      const tags = (p.tags || []).map((t) => String(t).toUpperCase());
      const isVipProfile = p.isVip || pkg.includes("VIP") || tags.includes("VIP");
      if (isVipProfile) return false;
      return p.isVerified || pkg.includes("VERIFIED") || tags.includes("VERIFIED");
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#030614] text-white font-sans overflow-x-hidden flex flex-col justify-between w-full selection:bg-rose-500/30 selection:text-rose-200">
      <div className="w-full">
        {/* Header Navbar Component */}
        <HeaderNavbar onPostAdClick={() => setIsPostAdModalOpen(true)} />

        {/* POST AD AUTHENTICATION MODAL */}
        <PostAdAuthModal
          isOpen={isPostAdModalOpen}
          onClose={() => setIsPostAdModalOpen(false)}
          onSuccessActivate={() => {
            setIsPostAdModalOpen(false);
            window.location.href = "/dashboard";
          }}
        />

        {/* DYNAMIC SEARCH MODAL */}
        <HeroSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />

        <main className="w-full">
          {/* Section 1: Hero Banner */}
          <section className="relative min-h-[auto] sm:min-h-[80vh] lg:min-h-[calc(100vh-90px)] flex flex-col items-center justify-center overflow-hidden bg-[#030614] pt-28 sm:pt-36 pb-12 sm:pb-20 px-3 sm:px-6 lg:px-8 text-center shadow-2xl">
            {cms?.hero?.bgImage ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-[center_top_15%] sm:bg-center bg-no-repeat opacity-100 transition-all duration-1000"
                  style={{ backgroundImage: `url('${cms.hero.bgImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#030614]/60 via-[#030614]/20 to-[#030614]/80 sm:hidden pointer-events-none" />
              </>
            ) : (
              <>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-rose-600/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
                <div className="absolute bottom-10 left-1/3 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />
              </>
            )}

            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-4 sm:space-y-7 flex flex-col items-center px-2 sm:px-4 backdrop-blur-[2px] sm:backdrop-blur-none bg-[#030614]/40 sm:bg-transparent p-3 sm:p-0 rounded-3xl border border-white/5 sm:border-none">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/70 px-3 py-1.5 sm:px-5 sm:py-2 text-[9px] sm:text-xs font-extrabold uppercase tracking-wider text-rose-200 backdrop-blur-md shadow-lg shadow-rose-900/30 hover:border-rose-400/60 transition-colors text-center max-w-[95vw]">
                <span className="text-amber-400 animate-pulse shrink-0">✨</span>
                <span className="truncate">{cms?.hero?.badgeText || "100% VERIFIED INDEPENDENT MODELS & ESCORT DIRECTORY"}</span>
              </div>

              <h1 className="text-[40px] xs:text-[48px] sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl px-1">
                {cms?.hero?.titlePrefix || "Connect with Genuine"}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-amber-300 block sm:inline mt-1 sm:mt-0">
                  {cms?.hero?.titleHighlight || "Independent Escorts"}
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl font-semibold drop-shadow-lg px-2">
                {cms?.hero?.subtitle || "India's most trusted classified directory for independent escorts, high-class VIP companions & massage parlors on MyCityQueen."}
              </p>

              {/* SEARCH BAR */}
              <div
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full max-w-2xl mt-4 sm:mt-6 cursor-pointer group rounded-full border border-rose-500/40 bg-slate-900/90 hover:bg-slate-900 p-1.5 sm:p-2.5 shadow-[0_0_40px_-10px_rgba(225,29,72,0.3)] hover:shadow-[0_0_50px_-5px_rgba(225,29,72,0.4)] backdrop-blur-xl transition-all duration-300 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 flex-1 overflow-hidden">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400 shrink-0 group-hover:scale-110 group-hover:text-rose-300 transition-all" />
                  <span className="text-[11px] sm:text-[15px] text-slate-300 font-semibold truncate text-left">
                    Search by Nationality, Category, City, Service or Filters...
                  </span>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 px-4 sm:px-8 py-2.5 sm:py-3.5 text-[11px] sm:text-[14px] font-black uppercase tracking-wider text-white shadow-lg group-hover:scale-105 transition-transform shrink-0 flex items-center gap-1.5"
                >
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                  <span>SEARCH</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Verified Profiles */}
          {cms?.verifiedProfiles?.enabled !== false && verifiedProfiles.length > 0 && (
            <section className="w-full border-t border-slate-800/80 bg-[#070b1a] py-16 lg:py-24 relative">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-8">
                  <div>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-[11px] uppercase tracking-widest border border-emerald-500/20 inline-flex items-center gap-1.5">
                      <Check className="h-3 w-3 stroke-[3]" /> {cms?.verifiedProfiles?.badge || "100% Aadhaar & Selfie Verified"}
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {cms?.verifiedProfiles?.title || "Verified Escorts & Independent Companions"}
                    </h2>
                    <p className="mt-3 text-[14px] sm:text-[16px] text-slate-400 font-medium">
                      {cms?.verifiedProfiles?.subtitle || "Every profile badge is identity-checked with live face matching & official verification."}
                    </p>
                  </div>
                  <Link href="/escorts" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/50 hover:bg-slate-800 text-sm font-bold text-rose-400 transition-all shadow-md">
                    View All Verified <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* PROPER CARDS GRID */}
                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {verifiedProfiles.map((p) => (
                    <div
                      key={p.id}
                      className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:shadow-rose-900/30 hover:border-rose-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                    >
                      <Link href={`/profile/${p.id}`} className="flex-1 flex flex-col">
                        <div className="h-[280px] w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 opacity-90"
                            style={{ backgroundImage: `url('${(p as any).photo || (p as any).photoUrl || (p as any).photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}')` }}
                          />
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-extrabold text-white shadow-lg border border-emerald-400/40">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                              <span>Verified</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-400/30 shadow-md">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span>{(p as any).rating || 5.0}</span>
                            </div>
                          </div>
                          {/* Center Tilted Watermark Overlay */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-sm sm:text-base font-black text-white/55 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] tracking-widest uppercase pointer-events-none z-10 whitespace-nowrap">
                            mycityqueen
                          </div>
                          {/* Gradient fade into the card body */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                        </div>

                        {/* Card Body */}
                        <div className="px-6 py-5 space-y-4 bg-slate-900 flex-1 z-20 -mt-8 relative">
                          <div>
                            <h3 className="text-[22px] font-black text-white group-hover:text-rose-400 transition-colors leading-tight truncate drop-shadow-md">
                              {p.name}{p.age && p.age > 0 ? `, ${p.age}` : ""}
                            </h3>
                            <p className="text-[13px] font-bold text-rose-400/90 flex items-center gap-1.5 mt-1.5 truncate">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span>{p.location || p.city}</span>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {((p as any).tags || []).slice(0, 3).map((tag: string) => (
                              <span key={tag} className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-[11px] font-bold text-slate-300 border border-slate-700/50 flex items-center">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 mt-4">
                            <span className="text-[13px] font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
                              {p.rate}
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest truncate bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                              {(p as any).availability?.includes("Incall") || (p as any).availability?.includes("Outcall")
                                ? "24/7 In/Outcall"
                                : (p as any).availability || "24/7 Available"}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Card Footer (Buttons) */}
                      <div className="px-5 py-4 bg-slate-950 border-t border-slate-800/80 grid grid-cols-2 gap-3 shrink-0">
                        <Link href={`/profile/${p.id}`} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[12px] uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 text-center border border-slate-700">
                          <Phone className="w-3.5 h-3.5" /> Details
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const phoneNum = (p as any).whatsapp || (p as any).phone || "919876500000"; 
                            window.open(`https://wa.me/${phoneNum}?text=Hi, I saw your profile on MyCityQueen India.`, '_blank');
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-[12px] uppercase tracking-wider transition-all shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 text-center cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 3: VIP Escorts */}
          {cms?.vipEscorts?.enabled !== false && vipProfiles.length > 0 && (
            <section className="w-full border-t border-slate-800/80 bg-gradient-to-b from-[#0B0F19] to-[#030614] py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-8">
                  <div>
                    <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-black text-[11px] uppercase tracking-widest border border-amber-500/20 inline-flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 stroke-[3]" /> {cms?.vipEscorts?.badge || "5-Star Hotel Outcalls & Luxury Escorts"}
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {cms?.vipEscorts?.title || "VIP High-Class Companions"}
                    </h2>
                    <p className="mt-3 text-[14px] sm:text-[16px] text-slate-400 font-medium">
                      {cms?.vipEscorts?.subtitle || "Premium models available for corporate events, luxury travel & elite hotel outcalls."}
                    </p>
                  </div>
                  <Link href="/vip" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 hover:bg-slate-800 text-sm font-bold text-amber-400 transition-all shadow-md">
                    View All VIP <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* PROPER CARDS GRID */}
                <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {vipProfiles.map((p) => (
                    <div
                      key={p.id}
                      className="group rounded-3xl bg-slate-900 border border-amber-900/40 overflow-hidden shadow-xl hover:shadow-amber-900/30 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                    >
                      <Link href={`/profile/${p.id}`} className="flex-1 flex flex-col">
                        <div className="h-[280px] w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 opacity-90"
                            style={{ backgroundImage: `url('${(p as any).photo || (p as any).photoUrl || (p as any).photos?.[0] || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"}')` }}
                          />
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-extrabold text-slate-950 shadow-lg border border-amber-300/40">
                              <Crown className="h-3.5 w-3.5 stroke-[3]" />
                              <span>VIP</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-amber-400 border border-amber-400/30 shadow-md">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span>{(p as any).rating || 5.0}</span>
                            </div>
                          </div>
                          {/* Center Tilted Watermark Overlay */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-sm sm:text-base font-black text-white/55 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] tracking-widest uppercase pointer-events-none z-10 whitespace-nowrap">
                            mycityqueen
                          </div>
                          {/* Gradient fade into the card body */}
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                        </div>

                        {/* Card Body */}
                        <div className="px-6 py-5 space-y-4 bg-slate-900 flex-1 z-20 -mt-8 relative">
                          <div>
                            <h3 className="text-[22px] font-black text-white group-hover:text-amber-400 transition-colors leading-tight truncate drop-shadow-md">
                              {p.name}{p.age && p.age > 0 ? `, ${p.age}` : ""}
                            </h3>
                            <p className="text-[13px] font-bold text-amber-500/90 flex items-center gap-1.5 mt-1.5 truncate">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span>{p.location || p.city}</span>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {((p as any).tags || []).slice(0, 3).map((tag: string) => (
                              <span key={tag} className="rounded-lg bg-slate-800/80 px-3 py-1.5 text-[11px] font-bold text-slate-300 border border-slate-700/50 flex items-center">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 mt-4">
                            <span className="text-[13px] font-black text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
                              {p.rate}
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest truncate bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                              {(p as any).availability?.includes("Incall") || (p as any).availability?.includes("Outcall")
                                ? "24/7 In/Outcall"
                                : (p as any).availability || "24/7 Available"}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Card Footer (Buttons) */}
                      <div className="px-5 py-4 bg-slate-950 border-t border-slate-800/80 grid grid-cols-2 gap-3 shrink-0">
                        <Link href={`/profile/${p.id}`} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[12px] uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 text-center border border-slate-700">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Details
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const phoneNum = (p as any).whatsapp || (p as any).phone || "919876500000"; 
                            window.open(`https://wa.me/${phoneNum}?text=Hi, I saw your VIP profile on MyCityQueen India.`, '_blank');
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-[12px] uppercase tracking-wider transition-all shadow-md shadow-amber-900/30 flex items-center justify-center gap-1.5 text-center cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Category Cards */}
          {cms?.categories?.enabled !== false && (
            <section className="w-full border-t border-slate-800/60 bg-[#030614] py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                  <span className="text-[11px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 inline-block">
                    🔥 {cms?.categories?.badge || "Browse By Category"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
                    {cms?.categories?.title || "Find Escorts by Category"}
                  </h2>
                  <p className="text-[14px] sm:text-[16px] text-slate-400 mt-3 font-medium">
                    {cms?.categories?.subtitle || "Select a category and your city to browse verified listings"}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {(cms?.categories?.categories || []).map((cat) => {
                    const catLower = cat.label.toLowerCase();
                    const liveCount = profiles.filter((p) => {
                      if (p.status && p.status !== "APPROVED") return false;
                      const tags = (p.tags || []).map((t) => String(t).toLowerCase());
                      const category = (p.category || "").toLowerCase();
                      return tags.some((t) => t.includes(catLower) || catLower.includes(t)) || category.includes(catLower);
                    }).length;

                    return (
                      <div key={cat.label} className="group flex flex-col">
                        {/* Card */}
                        <Link
                          href={`/escorts/${slugifyPath(cat.label)}`}
                          className="relative rounded-2xl overflow-hidden block"
                          style={{ aspectRatio: "16/10" }}
                        >
                          {/* Background photo */}
                          <img
                            src={cat.image || "/images/cat-call-girls.jpg"}
                            alt={cat.label}
                            className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />

                          {/* Dark overlay gradients */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />


                          {/* Bottom section: name + listings + arrow */}
                          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex items-end justify-between">
                            <div>
                              <h3 className="text-[22px] font-black text-white leading-tight drop-shadow-lg">
                                {cat.label}
                              </h3>
                              <span className="text-[13px] font-bold text-amber-400 mt-0.5 block drop-shadow">
                                {liveCount} Live Listing{liveCount !== 1 ? "s" : ""}
                              </span>
                            </div>

                            {/* Arrow button */}
                            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white font-bold text-base shadow-lg transition-all duration-300 group-hover:scale-110 flex-shrink-0 mb-1">
                              →
                            </span>
                          </div>
                        </Link>

                        {/* Below card: city tags */}
                        {cat.cities && cat.cities.length > 0 && (
                          <div className="mt-3 px-1">
                            <p className="text-[11px] text-slate-400 mb-2 font-medium">
                              Browse verified {cat.label} companions in top locations:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.cities.slice(0, 5).map((city) => (
                                <Link
                                  key={city}
                                  href={`/escorts/${slugifyPath(city)}/${slugifyPath(cat.label)}`}
                                  className="text-[11px] font-semibold text-slate-300 border border-slate-600 hover:border-rose-500/60 hover:text-white px-2.5 py-1 rounded-full transition-colors duration-200 bg-slate-900/60"
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
          )}

          {/* Section 5: Top Cities */}
          {cms?.topCities?.enabled !== false && (
            <section className="w-full border-t border-slate-800/80 bg-[#070b1a] py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block">
                    📍 {cms?.topCities?.badge || "Pan-India Escort Network"}
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
                    {cms?.topCities?.title || "Browse Escorts By City"}
                  </h2>
                  <p className="text-[14px] sm:text-[16px] text-slate-400 mt-3 font-medium">
                    {cms?.topCities?.subtitle || "Select your city to connect with verified independent escorts, call girls & VIP companions."}
                  </p>
                </div>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {(cms?.topCities?.cities || []).slice(0, 8).map((c, idx) => {
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
              </div>
            </section>
          )}

          {/* Section 6: Trust Network / Premier Network */}
          {cms?.premierNetwork?.enabled !== false && (
            <section className="w-full border-t border-slate-800/60 bg-[#030614] py-16 lg:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-[2.5rem] border border-slate-800 bg-gradient-to-br from-slate-900 to-[#0a0f25] p-8 sm:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500"></div>
                  
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {cms?.premierNetwork?.title || "About MyCityQueen India Escort Portal"}
                  </h2>
                  <p className="mt-5 text-[15px] sm:text-[17px] leading-relaxed text-slate-300 max-w-4xl font-medium">
                    {cms?.premierNetwork?.subtitle || "MyCityQueen India is a trusted online classifieds destination connecting clients with verified escort agencies, independent call girls, and VIP companions across major metropolitan cities in India. All listings are curated for privacy, discretion, and luxury service standards."}
                  </p>
                  
                  <div className="mt-10 flex flex-wrap gap-4 text-sm font-extrabold text-slate-200">
                    <span className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 px-5 py-3 rounded-2xl shadow-sm hover:border-emerald-500/50 transition-colors">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" /> 100% Privacy Guaranteed
                    </span>
                    <span className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 px-5 py-3 rounded-2xl shadow-sm hover:border-rose-500/50 transition-colors">
                      <Check className="h-5 w-5 text-rose-400 stroke-[3]" /> Verified Photos & Contacts
                    </span>
                    <span className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 px-5 py-3 rounded-2xl shadow-sm hover:border-amber-500/50 transition-colors">
                      <Star className="h-5 w-5 text-amber-400" /> 24/7 Hotel & Home Delivery
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

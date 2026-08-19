"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Plus, MapPin, Menu, X } from "lucide-react";
import { DEFAULT_NAVBAR_ITEMS, NavbarMenuItem } from "@/components/admin/AdminPaidAdsTab";
import { PostAdAuthModal } from "@/components/PostAdAuthModal";
import { CreateAdModal } from "@/components/CreateAdModal";
import { getHomePageCmsConfig, fetchHomePageCmsConfigAsync, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";

interface HeaderNavbarProps {
  onPostAdClick?: () => void;
}

export function HeaderNavbar({ onPostAdClick }: HeaderNavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbarItems, setNavbarItems] = useState<NavbarMenuItem[]>(DEFAULT_NAVBAR_ITEMS);
  const [cmsConfig, setCmsConfig] = useState<any>(null);
  const [currentCity, setCurrentCity] = useState<string>("Jaipur, RJ");
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skokka_user_detected_city");
      if (saved) setCurrentCity(saved.includes(",") ? saved : `${saved}, RJ`);
    }
    const handleCityDetected = (e: any) => {
      if (e.detail) {
        const c = e.detail;
        setCurrentCity(c.includes(",") ? c : `${c}, RJ`);
      }
    };
    window.addEventListener("skokka_city_detected", handleCityDetected);
    return () => window.removeEventListener("skokka_city_detected", handleCityDetected);
  }, []);

  useEffect(() => {
    const loadCms = () => setCmsConfig(getHomePageCmsConfig());
    loadCms();
    fetchHomePageCmsConfigAsync().then(setCmsConfig);
    window.addEventListener(CMS_UPDATE_EVENT, loadCms);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, loadCms);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNavbar = localStorage.getItem("skokka_navbar_menu_items");
      if (savedNavbar) {
        try {
          setNavbarItems(JSON.parse(savedNavbar));
        } catch {
          setNavbarItems(DEFAULT_NAVBAR_ITEMS);
        }
      }
    }
  }, []);

  const handlePostAdTrigger = () => {
    setIsMobileMenuOpen(false);
    if (onPostAdClick) {
      onPostAdClick();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const defaultNavLinks = [
    { label: "Home", href: "/" },
    { label: "Escorts", href: "/escorts" },
    { label: "Cities", href: "/cities" },
    { label: "Categories", href: "/categories" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <CreateAdModal
        isOpen={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
      />

      <PostAdAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessActivate={() => {
          setIsAuthModalOpen(false);
          window.location.href = "/dashboard";
        }}
      />

      <div className="fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-300">
        
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            isScrolled ? "h-0 opacity-0" : "opacity-100"
          }`}
        >
          <div className="bg-gradient-to-r from-rose-950 via-rose-700 to-pink-700 border-b border-rose-800/50 px-2 sm:px-3 py-1 sm:py-1.5 text-center text-[9px] sm:text-xs font-black uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-1 sm:gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-amber-300">🔥</span>
            <span>NO. 1 ADULT CLASSIFIEDS PORTAL IN INDIA</span>
            <span className="text-rose-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline">100% VERIFIED PROFILES</span>
            <span className="text-rose-300">•</span>
            <span className="text-amber-300">DIRECT CONTACT</span>
          </div>
        </div>

        {/* BORDER/LINE ISSUE FIXED HERE -> changed to border-none & shadow-none when on top */}
        <header 
          className={`w-full transition-all duration-300 ${
            isScrolled 
              ? "bg-[#060B1E]/95 backdrop-blur-xl border-b border-rose-900/40 shadow-2xl" 
              : "bg-transparent border-none shadow-none" 
          }`}
        >
          <div className={`w-full flex items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-2 sm:py-3.5" : "py-3 sm:py-5"}`}>
            
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 group">
              {cmsConfig?.footer?.brandLogoUrl ? (
                <img
                  src={cmsConfig.footer.brandLogoUrl}
                  alt="Brand Logo"
                  className="h-8 sm:h-12 object-contain transition group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg shadow-rose-600/30 flex items-center justify-center">
                    <span className="text-base sm:text-2xl font-black tracking-wider text-white">
                      {cmsConfig?.footer?.brandName ? cmsConfig.footer.brandName.split(" ")[0] : "SKOKKA"}
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] sm:text-sm font-black text-amber-400 tracking-widest uppercase">
                      {cmsConfig?.footer?.brandName ? cmsConfig.footer.brandName.split(" ").slice(1).join(" ") || "INDIA" : "INDIA"}
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">
                      {cmsConfig?.footer?.brandBadgeText || "CLASSIFIEDS"}
                    </span>
                  </div>
                </>
              )}
            </Link>

            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {defaultNavLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="whitespace-nowrap text-[14px] xl:text-[16px] font-extrabold uppercase tracking-widest text-slate-300 hover:text-rose-400 transition-colors flex items-center group"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <Link
                href="/cities"
                className="hidden xl:flex items-center gap-2 rounded-full bg-slate-900/60 backdrop-blur-sm px-4 py-2 text-[14px] xl:text-[15px] font-extrabold text-slate-200 hover:bg-slate-900/90 hover:text-rose-400 transition cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-rose-500" />
                <span>{currentCity}</span>
              </Link>

              <Link
                href="/admin"
                title="Super Admin"
                className="hidden sm:flex items-center justify-center p-2.5 rounded-xl bg-rose-950/50 text-amber-400 hover:bg-rose-900/70 transition shadow-sm hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                <Crown className="h-5 w-5" />
              </Link>

              <button
                onClick={handlePostAdTrigger}
                className="whitespace-nowrap rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 px-3 py-2 sm:px-6 sm:py-2.5 text-[11px] sm:text-[13px] xl:text-[14px] font-black uppercase tracking-wider text-white shadow-lg shadow-rose-600/40 transition duration-300 hover:from-rose-500 hover:to-pink-500 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                <span>+ POST FREE AD</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-slate-900/80 backdrop-blur-sm border-none text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6 text-rose-400" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-rose-400" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-800 bg-[#060B1E] px-4 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {defaultNavLinks.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3.5 rounded-xl bg-slate-900/50 text-[15px] font-extrabold text-slate-300 hover:text-rose-400 hover:bg-slate-900 transition flex items-center justify-center"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-950/60 text-rose-300 font-extrabold text-sm uppercase hover:bg-rose-900/60 transition"
                >
                  <Crown className="h-4 w-4 text-amber-400" />
                  <span>Super Admin</span>
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>
    </>
  );
}
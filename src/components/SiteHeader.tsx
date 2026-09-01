"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Crown,
  Menu,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { PostAdAuthModal } from "@/components/PostAdAuthModal";
import { DEFAULT_NAVBAR_ITEMS, NavbarMenuItem } from "@/components/admin/AdminPaidAdsTab";

function normalizeMenuLink(label: string, link: string) {
  const trimmed = link.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("/#") || trimmed.startsWith("#")) {
    const anchor = trimmed.replace("/#", "#");
    const key = label.toLowerCase();
    const mapping: Record<string, string> = {
      "#profiles": "/escorts",
      "#cities": "/cities",
      "#vip": "/vip-profiles",
      "#verified": "/verified",
      "#contact": "/contact",
    };

    if (mapping[anchor]) return mapping[anchor];
    if (key.includes("escort")) return "/escorts";
    if (key.includes("cities")) return "/cities";
    if (key.includes("vip")) return "/vip-profiles";
    if (key.includes("verified")) return "/verified";
    if (key.includes("contact")) return "/contact";
    return "/";
  }

  return trimmed;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isPostAdModalOpen, setIsPostAdModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navbarItemsRaw = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      if (typeof window === "undefined") return "";
      return localStorage.getItem("skokka_navbar_menu_items") || "";
    },
    () => ""
  );

  const navbarItems = useMemo<NavbarMenuItem[]>(() => {
    const base = (() => {
      if (!navbarItemsRaw) return DEFAULT_NAVBAR_ITEMS;
      try {
        const parsed = JSON.parse(navbarItemsRaw);
        return Array.isArray(parsed) ? parsed : DEFAULT_NAVBAR_ITEMS;
      } catch {
        return DEFAULT_NAVBAR_ITEMS;
      }
    })();

    return base.map((item) => ({
      ...item,
      link: normalizeMenuLink(item.label, item.link),
    }));
  }, [navbarItemsRaw]);

  return (
    <>
      <PostAdAuthModal
        isOpen={isPostAdModalOpen}
        onClose={() => setIsPostAdModalOpen(false)}
        onSuccessActivate={() => {
          setIsPostAdModalOpen(false);
          window.location.href = "/dashboard";
        }}
      />

      <div className="bg-gradient-to-r from-rose-950 via-rose-700 to-pink-700 border-b border-rose-800/50 px-4 py-2 text-center text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white shadow-md flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-200" />
        <span>India’s Premium Classified Listings</span>
        <span className="hidden sm:inline text-rose-200/70">•</span>
        <span className="hidden sm:inline">Verified Profiles</span>
        <span className="hidden md:inline text-rose-200/70">•</span>
        <span className="hidden md:inline text-amber-200">Direct WhatsApp & Phone</span>
      </div>

      <header className="sticky top-0 z-50 border-b border-rose-900/50 bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-black/60 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3.5">
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition duration-300 group-hover:scale-105">
                MYCITYQUEEN
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
              {navbarItems
                .filter((item) => item.enabled)
                .map((item) => {
                  const href = item.link || "/";
                  const isActive = href !== "/" ? pathname.startsWith(href) : pathname === "/";

                  return (
                    <Link
                      key={item.id}
                      href={href}
                      className={[
                        "whitespace-nowrap rounded-xl px-3.5 py-2 text-xs xl:text-sm font-extrabold uppercase tracking-wider border transition",
                        isActive
                          ? "bg-rose-950/70 text-rose-200 border-rose-500/30"
                          : "text-slate-200 border-transparent hover:bg-rose-950/60 hover:text-rose-200 hover:border-rose-900/40",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-rose-500/40 hover:text-white transition"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link
                href="/admin"
                className="hidden md:flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-rose-500/70 bg-gradient-to-r from-rose-950/70 via-pink-950/60 to-purple-950/70 px-4.5 sm:px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-rose-200 hover:text-white transition shadow-lg shadow-rose-950/50 hover:border-pink-500 hover:scale-105 active:scale-95"
                title="Super Admin Control Panel"
              >
                <Crown className="h-4.5 w-4.5 text-amber-400 shrink-0 animate-pulse" />
                <span>Super Admin</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsPostAdModalOpen(true)}
                className="whitespace-nowrap rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 px-5 sm:px-6 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-rose-600/40 transition duration-300 hover:from-rose-500 hover:to-pink-500 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Post Listing</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute right-0 top-0 h-full w-[340px] max-w-[88vw] border-l border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/70">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 px-3 py-1.5 text-lg font-black tracking-wider text-white">
                  MYCITYQUEEN
                </span>
                <span className="text-sm font-black tracking-widest text-amber-400">INDIA</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:border-rose-500/40 hover:text-white transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-2">
              {navbarItems
                .filter((item) => item.enabled)
                .map((item) => (
                  <Link
                    key={item.id}
                    href={item.link || "/"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-slate-200 hover:border-rose-500/50 hover:text-white transition"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
            </div>

            <div className="p-5 pt-0 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPostAdModalOpen(true);
                }}
                className="w-full rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-rose-600/30 hover:from-rose-500 hover:to-pink-500 transition flex items-center justify-center gap-2"
              >
                Post listing
                <Plus className="h-4 w-4 stroke-[3]" />
              </button>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-rose-200 hover:border-rose-500/70 hover:text-white transition flex items-center justify-center gap-2"
              >
                Super admin
                <Crown className="h-4 w-4 text-amber-300" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


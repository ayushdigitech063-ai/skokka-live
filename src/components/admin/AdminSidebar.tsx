"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  LayoutTemplate,
  Megaphone,
  Wallet,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Crown,
  Grid,
  MapPin,
  Award,
  CreditCard,
  Globe,
} from "lucide-react";
import { AdminUserData } from "./AdminLoginForm";

export type AdminTab =
  | "overview"
  | "access_control"
  | "locations"
  | "homepage_cms"
  | "cms_hero"
  | "cms_verified"
  | "cms_vip"
  | "cms_categories"
  | "cms_cities"
  | "cms_premier"
  | "cms_footer"
  | "listings"
  | "ads"
  | "ads_approval"
  | "ads_review"
  | "ads_packages"
  | "ads_categories"
  | "ads_coupons"
  | "ads_settings"
  | "wallet"
  | "coupon"
  | "inquiries"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  collapsed: boolean;
  currentUser: AdminUserData;
  onLogout?: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  currentUser,
  onLogout,
}: AdminSidebarProps) {
  const isSuperAdmin = currentUser.role === "Super Admin";
  const [cmsDropdownOpen, setCmsDropdownOpen] = useState(true);
  const [adsDropdownOpen, setAdsDropdownOpen] = useState(true);

  const isCmsActive =
    activeTab === "homepage_cms" ||
    activeTab === "cms_hero" ||
    activeTab === "cms_verified" ||
    activeTab === "cms_vip" ||
    activeTab === "cms_categories" ||
    activeTab === "cms_cities" ||
    activeTab === "cms_premier" ||
    activeTab === "cms_footer";

  const isAdsActive =
    activeTab === "ads" ||
    activeTab === "ads_approval" ||
    activeTab === "ads_review" ||
    activeTab === "ads_packages" ||
    activeTab === "ads_categories" ||
    activeTab === "ads_coupons" ||
    activeTab === "ads_settings";

  const cmsSubItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: "cms_hero", label: "Hero Banner", icon: <Sparkles className="h-4 w-4 text-rose-400" /> },
    { id: "cms_verified", label: "Verified Profiles", icon: <ShieldCheck className="h-4 w-4 text-emerald-400" /> },
    { id: "cms_vip", label: "VIP Escorts", icon: <Crown className="h-4 w-4 text-amber-400" /> },
    { id: "cms_categories", label: "Category Cards", icon: <Grid className="h-4 w-4 text-violet-400" /> },
    { id: "cms_cities", label: "Top Cities", icon: <MapPin className="h-4 w-4 text-cyan-400" /> },
    { id: "cms_premier", label: "Trust Network", icon: <Award className="h-4 w-4 text-purple-400" /> },
    { id: "cms_footer", label: "Footer Settings", icon: <Globe className="h-4 w-4 text-pink-400" /> },
  ];

  const adsSubItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: "ads_approval", label: "Approval for Ads ⏳", icon: <ShieldCheck className="h-4 w-4 text-amber-400" /> },
    { id: "ads_review", label: "Submitted Ads Review", icon: <Megaphone className="h-4 w-4 text-emerald-400" /> },
    { id: "ads_packages", label: "Packages & UPI Pricing", icon: <CreditCard className="h-4 w-4 text-rose-400" /> },
    { id: "ads_categories", label: "Ad Categories Manager", icon: <Tag className="h-4 w-4 text-amber-400" /> },
    { id: "ads_coupons", label: "Coupons & Discounts", icon: <Tag className="h-4 w-4 text-pink-400" /> },
    { id: "ads_settings", label: "Form & ID Settings", icon: <Settings className="h-4 w-4 text-cyan-400" /> },
  ];

  return (
    <>
      {/* MOBILE OVERLAY BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR NAVIGATION PANEL */}
      <aside
        className={`fixed top-16 sm:top-20 bottom-0 left-0 z-40 bg-[#050B1F] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl font-['Plus_Jakarta_Sans',sans-serif] ${
          collapsed ? "w-20" : "w-80"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* NAV ITEMS CONTAINER */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {!collapsed && (isSuperAdmin ? "SUPER ADMIN NAVIGATION" : "ADMIN NAVIGATION")}
          </div>

          <nav className="space-y-1.5">
            {/* 1. OVERVIEW */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className={`shrink-0 ${activeTab === "overview" ? "text-white" : "text-slate-400 group-hover:text-rose-400"}`}>
                  <LayoutDashboard className="h-5 w-5" />
                </span>
                {!collapsed && <span className="truncate">Overview</span>}
              </div>
              {!collapsed && <ChevronRight className={`h-4 w-4 transition ${activeTab === "overview" ? "text-white" : "text-slate-600"}`} />}
            </button>

            {/* 2. SUPER ADMIN CONTROL */}
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("access_control");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                  activeTab === "access_control"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                    : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <span className={`shrink-0 ${activeTab === "access_control" ? "text-white" : "text-rose-500"}`}>
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  {!collapsed && <span className="truncate">Super Admin Control</span>}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      ROOT
                    </span>
                    <ChevronRight className={`h-4 w-4 transition ${activeTab === "access_control" ? "text-white" : "text-slate-600"}`} />
                  </div>
                )}
              </button>
            )}

            {/* LOCATION MANAGEMENT MODULE */}
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("locations");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                  activeTab === "locations"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
                    : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <span className={`shrink-0 ${activeTab === "locations" ? "text-white" : "text-cyan-400"}`}>
                    <MapPin className="h-5 w-5" />
                  </span>
                  {!collapsed && <span className="truncate">Location Hierarchy</span>}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      INDIA
                    </span>
                    <ChevronRight className={`h-4 w-4 transition ${activeTab === "locations" ? "text-white" : "text-slate-600"}`} />
                  </div>
                )}
              </button>
            )}

            {/* 3. HOMEPAGE MANAGER DROPDOWN MENU */}
            {isSuperAdmin && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setCmsDropdownOpen((prev) => !prev);
                    setActiveTab("homepage_cms");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                    isCmsActive
                      ? "bg-rose-950/60 border border-rose-500/40 text-white shadow-lg"
                      : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <span className={`shrink-0 ${isCmsActive ? "text-pink-400" : "text-slate-400 group-hover:text-pink-400"}`}>
                      <LayoutTemplate className="h-5 w-5" />
                    </span>
                    {!collapsed && <span className="truncate">Homepage Manager</span>}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                        CMS
                      </span>
                      {cmsDropdownOpen ? (
                        <ChevronDown className="h-4 w-4 text-pink-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                  )}
                </button>

                {/* SUB-MENU DROPDOWN ITEMS */}
                {!collapsed && cmsDropdownOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-5 my-1">
                    {cmsSubItems.map((sub) => {
                      const isSubActive = activeTab === sub.id;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(sub.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                            isSubActive
                              ? "bg-rose-600 text-white shadow-md font-bold"
                              : "text-slate-400 hover:bg-slate-900 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {sub.icon}
                            <span>{sub.label}</span>
                          </div>
                          {isSubActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3.5. ESCORTS LISTINGS & AD BOOST */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("listings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                activeTab === "listings"
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className={`shrink-0 ${activeTab === "listings" ? "text-white" : "text-amber-400"}`}>
                  <Megaphone className="h-5 w-5" />
                </span>
                {!collapsed && <span className="truncate">Escorts & Ad Boost</span>}
              </div>
              {!collapsed && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  BOOST
                </span>
              )}
            </button>

            {/* 3.6. INQUIRIES & CONTACT MESSAGES */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("inquiries");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                activeTab === "inquiries"
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className={`shrink-0 ${activeTab === "inquiries" ? "text-white" : "text-cyan-400"}`}>
                  <Globe className="h-5 w-5" />
                </span>
                {!collapsed && <span className="truncate">Contact Inquiries</span>}
              </div>
              {!collapsed && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  MESSAGES
                </span>
              )}
            </button>

            {/* 4. ADS & CAMPAIGN MANAGER DROPDOWN */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setAdsDropdownOpen(!adsDropdownOpen);
                  if (!isAdsActive) {
                    setActiveTab("ads");
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                  isAdsActive
                    ? "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white shadow-lg shadow-rose-600/30"
                    : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <span className={`shrink-0 ${isAdsActive ? "text-white" : "text-emerald-400"}`}>
                    <Megaphone className="h-5 w-5" />
                  </span>
                  {!collapsed && <span className="truncate">Ads Manager</span>}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                    {adsDropdownOpen ? (
                      <ChevronDown className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                )}
              </button>

              {/* SUB-MENU DROPDOWN ITEMS FOR ADS */}
              {!collapsed && adsDropdownOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-5 my-1">
                  {adsSubItems.map((sub) => {
                    const isSubActive = activeTab === sub.id;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(sub.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isSubActive
                            ? "bg-rose-600 text-white shadow-md font-bold"
                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {sub.icon}
                          <span>{sub.label}</span>
                        </div>
                        {isSubActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. WALLET (Admin Only) */}
            {!isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("wallet");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                  activeTab === "wallet"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                    : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <span className="shrink-0 text-violet-400">
                    <Wallet className="h-5 w-5" />
                  </span>
                  {!collapsed && <span className="truncate">Wallet</span>}
                </div>
              </button>
            )}

            {/* 6. COUPON (Admin Only) */}
            {!isSuperAdmin && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("coupon");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                  activeTab === "coupon"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                    : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <span className="shrink-0 text-orange-400">
                    <Tag className="h-5 w-5" />
                  </span>
                  {!collapsed && <span className="truncate">Coupon</span>}
                </div>
              </button>
            )}

            {/* 7. SETTINGS */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition group text-xs sm:text-sm font-medium ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-slate-300 hover:bg-[#0B1437] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className={`shrink-0 ${activeTab === "settings" ? "text-white" : "text-slate-400 group-hover:text-rose-400"}`}>
                  <Settings className="h-5 w-5" />
                </span>
                {!collapsed && <span className="truncate">Settings</span>}
              </div>
              {!collapsed && <ChevronRight className={`h-4 w-4 transition ${activeTab === "settings" ? "text-white" : "text-slate-600"}`} />}
            </button>
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1437]/50">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
                  {currentUser.avatar}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-rose-400 font-medium truncate">{currentUser.role}</span>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition border border-rose-500/20 shrink-0"
                  title="Logout Session"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              )}
            </div>
          ) : (
            onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition border border-rose-500/20"
                title="Logout Session"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )
          )}
        </div>
      </aside>
    </>
  );
}

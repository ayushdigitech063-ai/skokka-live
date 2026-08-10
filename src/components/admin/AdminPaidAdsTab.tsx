"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Plus,
  Lock,
  Edit,
  QrCode,
  Save,
  DollarSign,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  Settings,
  Megaphone,
  Sparkles,
  RotateCcw,
  ExternalLink,
  X,
} from "lucide-react";
import { PostAdWizardModal } from "@/components/PostAdWizardModal";
import { AdminUserData } from "./AdminLoginForm";
import { AdCmsConfig, AdPackageConfig, AdCategoryOptionConfig } from "../../types/adCms";
import {
  getAdCmsConfig,
  saveAdCmsConfig,
  resetAdCmsConfig,
} from "../../utils/adCmsStore";
import { fetchAllEscortsAdmin, setEscortStatus, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";

export interface PaidAdItem {
  id: string;
  stageName?: string;
  adTitle?: string;
  category: string;
  cityArea: string;
  packageType: "STANDARD" | "VIP_SLOT" | "HERO_BANNER";
  amountPaid: number;
  utrTransactionId: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
  submittedAt: string;
  photoUrl: string;
}

export interface NavbarMenuItem {
  id: string;
  label: string;
  link: string;
  enabled: boolean;
}

export const DEFAULT_NAVBAR_ITEMS: NavbarMenuItem[] = [
  { id: "1", label: "Home", link: "/", enabled: true },
  { id: "2", label: "Escorts", link: "/escorts", enabled: true },
  { id: "3", label: "Cities", link: "/cities", enabled: true },
  { id: "4", label: "Categories", link: "/categories", enabled: true },
  { id: "5", label: "Contact Us", link: "/contact", enabled: true },
];

interface AdminPaidAdsTabProps {
  currentUser: AdminUserData;
  activeTab?: string;
}

export function AdminPaidAdsTab({ currentUser, activeTab = "ads" }: AdminPaidAdsTabProps) {
  const isSuperAdmin = currentUser.role === "Super Admin";
  const [config, setConfig] = useState<AdCmsConfig | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<
    "ads_approval" | "ads_review" | "ads_packages" | "ads_categories" | "ads_coupons" | "ads_settings"
  >("ads_approval");

  const [isSaved, setIsSaved] = useState(false);
  const [showPostAdModal, setShowPostAdModal] = useState(false);

  // Submitted Ads State
  const [submittedAds, setSubmittedAds] = useState<PaidAdItem[]>([]);
  const [escortProfilesList, setEscortProfilesList] = useState<EscortProfileItem[]>([]);

  // Modal Form States for Adding Category, Package, Credit Pack & Coupon
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("💋");

  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState(2499);
  const [newPkgBadge, setNewPkgBadge] = useState("POPULAR ⭐");
  const [newPkgDesc, setNewPkgDesc] = useState("");

  const [showAddCreditPackModal, setShowAddCreditPackModal] = useState(false);
  const [newCreditPrice, setNewCreditPrice] = useState(1500);
  const [newCreditAmount, setNewCreditAmount] = useState(20);
  const [newCreditBonus, setNewCreditBonus] = useState("5 FREE Credits");

  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(20);
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponExpiry, setNewCouponExpiry] = useState("2026-12-31");

  useEffect(() => {
    setConfig(getAdCmsConfig());
    const loadAll = () => fetchAllEscortsAdmin().then(setEscortProfilesList);
    loadAll();
    window.addEventListener(ESCORTS_UPDATE_EVENT, loadAll);
    return () => window.removeEventListener(ESCORTS_UPDATE_EVENT, loadAll);
  }, []);

  useEffect(() => {
    if (activeTab.startsWith("ads_")) {
      const section = activeTab as any;
      if (["ads_approval", "ads_review", "ads_packages", "ads_categories", "ads_coupons", "ads_settings"].includes(section)) {
        setActiveSectionTab(section);
      }
    } else {
      setActiveSectionTab("ads_approval");
    }
  }, [activeTab]);

  if (!config) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        Loading Ad Campaign Manager Configuration...
      </div>
    );
  }

  const handleSaveConfig = () => {
    saveAdCmsConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Ad Manager Settings Saved!",
      text: "Packages, prices, categories, coupons, and UPI ID are updated live across Post Ad wizard & Dashboard.",
      showConfirmButton: false,
      timer: 2200,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  const handleResetConfig = () => {
    Swal.fire({
      title: "Reset Ad Configuration?",
      text: "This will restore default UPI ID, package prices, coupons, and category options.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reset All",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#334155",
      background: "#0B1437",
      color: "#ffffff",
    }).then((result) => {
      if (result.isConfirmed) {
        const fresh = resetAdCmsConfig();
        setConfig(fresh);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "Restored Default Ad Config",
          showConfirmButton: false,
          timer: 1800,
          background: "#0B1437",
          color: "#ffffff",
        });
      }
    });
  };

  const handleApproveAd = async (id: string, title: string) => {
    setSubmittedAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, status: "APPROVED" } : ad))
    );
    await setEscortStatus(id, "APPROVED");
    fetchAllEscortsAdmin().then(setEscortProfilesList);
    Swal.fire({ toast: true, position: "top-end", icon: "success", title: `Approval Done! ✅`, text: `${title} (${id}) is now APPROVED & LIVE.`, showConfirmButton: false, timer: 2000, background: "#0B1437", color: "#ffffff" });
  };

  const handleRejectAd = async (id: string, title: string) => {
    setSubmittedAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, status: "REJECTED" } : ad))
    );
    await setEscortStatus(id, "REJECTED");
    fetchAllEscortsAdmin().then(setEscortProfilesList);
    Swal.fire({ toast: true, position: "top-end", icon: "info", title: `Ad Rejected`, text: `${title} (${id}) rejected.`, showConfirmButton: false, timer: 2000, background: "#0B1437", color: "#ffffff" });
  };


  // Combine submitted paid ads + user submitted escort profiles
  const rawApprovalItems = [
    ...submittedAds.map((ad) => ({
      id: ad.id,
      title: ad.adTitle || ad.stageName || "Advertiser Campaign",
      category: ad.category || "Classified Ad",
      location: ad.cityArea || "Jaipur",
      amountPaid: ad.amountPaid || 0,
      utrOrPhone: ad.utrTransactionId ? `UTR: ${ad.utrTransactionId}` : "Payment Submitted",
      status: ad.status || "PENDING_APPROVAL",
      photoUrl: ad.photoUrl,
      submittedAt: ad.submittedAt || new Date().toISOString(),
    })),
    ...escortProfilesList
      .filter((p) => !submittedAds.some((s) => s.id === p.id))
      .filter((p) => {
        const defaultDemoIds = ["SK-101", "SK-102", "SK-103", "SK-104", "SK-105"];
        const isDefaultDemo = defaultDemoIds.includes(p.id) && (p.status === "APPROVED" || !p.status);
        return !isDefaultDemo;
      })
      .map((p) => ({
        id: p.id,
        title: p.name || p.title || "Escort Profile Ad",
        category: p.category || "Escort Listing",
        location: p.location || p.city || "Jaipur",
        amountPaid: p.price || 0,
        utrOrPhone: p.phone ? `Phone: ${p.phone}` : "Free Submission",
        status: p.status || "PENDING_APPROVAL",
        photoUrl: p.photoUrl,
        submittedAt: p.submittedAt || new Date().toISOString(),
      })),
  ];

  // Sort: PENDING_APPROVAL at the VERY TOP, then REJECTED, then APPROVED
  const allApprovalItems = [...rawApprovalItems].sort((a, b) => {
    if (a.status === "PENDING_APPROVAL" && b.status !== "PENDING_APPROVAL") return -1;
    if (a.status !== "PENDING_APPROVAL" && b.status === "PENDING_APPROVAL") return 1;
    return 0;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* TOP HEADER STRIP */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1437] via-slate-900 to-[#121B3B] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <Megaphone className="h-4 w-4 text-emerald-400" /> Super Admin Ads Manager
            </span>
            {isSaved && (
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved Live!
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {activeSectionTab === "ads_approval" && "Approval for Ads Hub 🔒"}
            {activeSectionTab === "ads_review" && "Submitted Advertiser Ads Review"}
            {activeSectionTab === "ads_packages" && "Ad Packages & Dynamic UPI Payment Settings"}
            {activeSectionTab === "ads_categories" && "Post Ad Categories Manager"}
            {activeSectionTab === "ads_coupons" && "Coupons & Promo Codes Manager"}
            {activeSectionTab === "ads_settings" && "Form & Identity Verification Settings"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Dynamically edit UPI ID, package prices, form categories, and approve advertiser campaigns.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetConfig}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
          >
            <RotateCcw className="h-4 w-4 text-rose-400" /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSaveConfig}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
          >
            <Save className="h-4 w-4" /> Save All Ad Configs
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1437] border border-slate-800 shadow-xl space-y-6">

        {/* 0. APPROVAL FOR ADS HUB */}
        {activeSectionTab === "ads_approval" && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-400" /> Approval for Ads Hub 🔒
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">All advertiser campaigns & escort profiles submitted for Super Admin review and approval.</p>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs uppercase tracking-wider border border-amber-500/30 animate-pulse">
                ⏳ Super Admin Verification Queue
              </span>
            </div>

            {allApprovalItems.length === 0 ? (
              <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                <ShieldCheck className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm font-extrabold text-slate-300">No pending approval requests in queue.</p>
                <p className="text-xs text-slate-500">Newly submitted classified ads by users will appear at the top here instantly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {allApprovalItems.map((ad) => {
                  const isApproved = ad.status === "APPROVED";

                  return (
                    <div key={ad.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-slate-700 transition shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                          <img src={ad.photoUrl} alt={ad.title} className="h-full w-full object-cover" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-rose-400">{ad.id}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                              {ad.category}
                            </span>
                            <span
                              className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                isApproved
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : ad.status === "REJECTED"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                              }`}
                            >
                              {isApproved ? "Approval Done ✅" : ad.status === "REJECTED" ? "Rejected ❌" : "Pending Approval ⏳"}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-white">{ad.title}</h3>
                          <p className="text-xs text-slate-400">
                            Location: <span className="text-slate-200">{ad.location}</span> • Amount: <strong className="text-emerald-400">₹{ad.amountPaid.toLocaleString("en-IN")}</strong>
                          </p>
                          <p className="text-[11px] text-amber-400 font-mono">
                            {ad.utrOrPhone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {!isApproved && (
                          <button
                            type="button"
                            onClick={() => handleApproveAd(ad.id, ad.title || "Ad Campaign")}
                            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Approval Done ✅
                          </button>
                        )}

                        {ad.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() => handleRejectAd(ad.id, ad.title || "Ad Campaign")}
                            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 font-extrabold text-xs border border-slate-700 transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 1. SUBMITTED ADS REVIEW */}
        {activeSectionTab === "ads_review" && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-emerald-400" /> Advertiser Submitted Campaigns ({submittedAds.length})
              </h2>
              <p className="text-xs text-slate-400">Review pending UTR transactions and approve or reject advertiser ads.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {submittedAds.map((ad) => (
                <div key={ad.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${ad.photoUrl}')` }}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-rose-400">{ad.id}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                          {ad.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ad.status === "APPROVED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : ad.status === "REJECTED"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-white">{ad.adTitle || ad.stageName}</h3>
                      <p className="text-xs text-slate-400">
                        Location: <span className="text-slate-200">{ad.cityArea}</span> • Amount: <strong className="text-emerald-400">₹{ad.amountPaid.toLocaleString("en-IN")}</strong>
                      </p>
                      <p className="text-[11px] text-amber-400 font-mono">
                        Payment UTR Transaction ID: <strong>{ad.utrTransactionId}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    {ad.status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => handleApproveAd(ad.id, ad.adTitle || ad.stageName || ad.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve Ad
                      </button>
                    )}

                    {ad.status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => handleRejectAd(ad.id, ad.adTitle || ad.stageName || ad.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. AD PACKAGES & DYNAMIC UPI PRICING */}
        {activeSectionTab === "ads_packages" && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-rose-400" /> Super Admin UPI ID & Ad Package Pricing
              </h2>
              <p className="text-xs text-slate-400">
                Change Super Admin UPI ID and package prices (Standard, VIP Top Slot, Hero Banner). Dynamic QR codes update live!
              </p>
            </div>

            {/* SUPER ADMIN UPI ID INPUT */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <QrCode className="h-4 w-4" /> Super Admin Official UPI ID & Holder Name
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Super Admin UPI ID</label>
                  <input
                    type="text"
                    value={config.superAdminUpiId}
                    onChange={(e) => setConfig({ ...config, superAdminUpiId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs focus:border-rose-500 focus:outline-none"
                    placeholder="skokka@upi"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Account Holder Name</label>
                  <input
                    type="text"
                    value={config.upiHolderName}
                    onChange={(e) => setConfig({ ...config, upiHolderName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                    placeholder="Skokka Official Concierge"
                  />
                </div>
              </div>
            </div>

            {/* AD PACKAGES EDITORS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-rose-400" /> Ad Placement Packages ({config.packages.length})
                  </h3>
                  <p className="text-xs text-slate-400">Add new placement packages or edit existing prices and badges.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <Plus className="h-4 w-4" /> Add New Placement Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {config.packages.map((pkg, idx) => (
                  <div key={pkg.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-rose-400 font-mono">{pkg.id}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...config.packages];
                            updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                            setConfig({ ...config, packages: updated });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition ${
                            pkg.enabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {pkg.enabled ? "Enabled" : "Disabled"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = config.packages.filter((_, i) => i !== idx);
                            setConfig({ ...config, packages: updated });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 transition"
                          title="Delete Package"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Package Title</label>
                      <input
                        type="text"
                        value={pkg.title}
                        onChange={(e) => {
                          const updated = [...config.packages];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setConfig({ ...config, packages: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-rose-400 uppercase">Price (INR ₹)</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => {
                          const updated = [...config.packages];
                          updated[idx] = { ...updated[idx], price: Number(e.target.value) || 0 };
                          setConfig({ ...config, packages: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-black text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Badge Label</label>
                      <input
                        type="text"
                        value={pkg.badge}
                        onChange={(e) => {
                          const updated = [...config.packages];
                          updated[idx] = { ...updated[idx], badge: e.target.value };
                          setConfig({ ...config, packages: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AD CREDITS BUY PACKAGES MANAGER */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-amber-400" /> "Buy Ad Credits" Dropdown Packages ({config.creditPackages?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-400">These credit packages appear in the Advertiser Private Area Dashboard "BUY CREDITS" modal dropdown.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCreditPackModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Credit Pack
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(config.creditPackages || []).map((cred, cIdx) => (
                  <div key={cred.id || cIdx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 font-mono">₹{cred.price}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...config.creditPackages];
                          updated[cIdx] = { ...updated[cIdx], enabled: !updated[cIdx].enabled };
                          setConfig({ ...config, creditPackages: updated });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cred.enabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {cred.enabled ? "Active" : "Hidden"}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Price (₹)</label>
                      <input
                        type="number"
                        value={cred.price}
                        onChange={(e) => {
                          const updated = [...config.creditPackages];
                          updated[cIdx] = { ...updated[cIdx], price: Number(e.target.value) || 0 };
                          setConfig({ ...config, creditPackages: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-400 uppercase">Ad Credits Amount</label>
                      <input
                        type="number"
                        value={cred.credits}
                        onChange={(e) => {
                          const updated = [...config.creditPackages];
                          updated[cIdx] = { ...updated[cIdx], credits: Number(e.target.value) || 0 };
                          setConfig({ ...config, creditPackages: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Bonus Tagline</label>
                      <input
                        type="text"
                        value={cred.bonusText}
                        onChange={(e) => {
                          const updated = [...config.creditPackages];
                          updated[cIdx] = { ...updated[cIdx], bonusText: e.target.value };
                          setConfig({ ...config, creditPackages: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. POST AD CATEGORIES MANAGER */}
        {activeSectionTab === "ads_categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-amber-400" /> Post Ad Form Categories Manager ({config.categories.length})
                </h2>
                <p className="text-xs text-slate-400">Add, edit, enable, or disable form categories (e.g. Products/Shilajit, Call Girls, Spas, Male Escorts, Transsexual).</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCategoryModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Plus className="h-4 w-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.categories.map((cat, idx) => (
                <div key={cat.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative group">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={cat.iconEmoji}
                      onChange={(e) => {
                        const updated = [...config.categories];
                        updated[idx] = { ...updated[idx], iconEmoji: e.target.value };
                        setConfig({ ...config, categories: updated });
                      }}
                      className="w-12 text-center py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-base"
                    />
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => {
                        const updated = [...config.categories];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setConfig({ ...config, categories: updated });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = config.categories.filter((_, i) => i !== idx);
                        setConfig({ ...config, categories: updated });
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3.5. COUPONS & PROMO CODES MANAGER */}
        {activeSectionTab === "ads_coupons" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-pink-400" /> Promo Coupons & Discounts ({config.coupons?.length || 0})
                </h2>
                <p className="text-xs text-slate-400">Add, edit, enable, or disable discount coupon codes for advertisers.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Plus className="h-4 w-4" /> Add Coupon Code
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(config.coupons || []).map((cp, idx) => (
                <div key={cp.id || idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={cp.code}
                      onChange={(e) => {
                        const updated = [...config.coupons];
                        updated[idx] = { ...updated[idx], code: e.target.value.toUpperCase() };
                        setConfig({ ...config, coupons: updated });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-pink-400 font-mono font-black text-sm uppercase"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...config.coupons];
                          updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                          setConfig({ ...config, coupons: updated });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition ${
                          cp.enabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {cp.enabled ? "Active" : "Disabled"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = config.coupons.filter((_, i) => i !== idx);
                          setConfig({ ...config, coupons: updated });
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Discount %</label>
                      <input
                        type="number"
                        value={cp.discountPercent}
                        onChange={(e) => {
                          const updated = [...config.coupons];
                          updated[idx] = { ...updated[idx], discountPercent: Number(e.target.value) || 0 };
                          setConfig({ ...config, coupons: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Valid Until</label>
                      <input
                        type="text"
                        value={cp.validUntil}
                        onChange={(e) => {
                          const updated = [...config.coupons];
                          updated[idx] = { ...updated[idx], validUntil: e.target.value };
                          setConfig({ ...config, coupons: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Coupon Description</label>
                    <input
                      type="text"
                      value={cp.description}
                      onChange={(e) => {
                        const updated = [...config.coupons];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setConfig({ ...config, coupons: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. FORM & IDENTITY VERIFICATION SETTINGS */}
        {activeSectionTab === "ads_settings" && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-cyan-400" /> Mandatory Identity Verification & Form Rules
              </h2>
              <p className="text-xs text-slate-400">Configure mandatory age verification requirements before advertisers post ads.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-bold text-white block">Mandatory 1-Time Identity Verification</strong>
                  <p className="text-xs text-slate-400">Requires advertisers to verify Aadhaar/ID before unlocking Post Ad form.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, verificationRequired: !config.verificationRequired })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    config.verificationRequired
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {config.verificationRequired ? "Verification Mandatory" : "Verification Optional"}
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Accepted ID Document Types (comma separated)
                </label>
                <input
                  type="text"
                  value={config.documentTypes.join(", ")}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      documentTypes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* POST AD WIZARD MODAL FOR TESTING */}
      <PostAdWizardModal
        isOpen={showPostAdModal}
        onClose={() => setShowPostAdModal(false)}
        onAdSubmitted={(ad) => {
          setShowPostAdModal(false);
          setSubmittedAds((prev) => [ad, ...prev]);
        }}
      />

      {/* 1. ADD NEW CATEGORY MODAL */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1437] border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-rose-500" /> Add New Ad Category
              </h3>
              <button onClick={() => setShowAddCategoryModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCatLabel) return;
                const newCat: AdCategoryOptionConfig = {
                  id: `cat_${Date.now()}`,
                  label: `${newCatEmoji} ${newCatLabel}`,
                  iconEmoji: newCatEmoji,
                  enabled: true,
                };
                setConfig({ ...config, categories: [...config.categories, newCat] });
                setShowAddCategoryModal(false);
                setNewCatLabel("");
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Category Added!", timer: 1500, showConfirmButton: false, background: "#0B1437", color: "#fff" });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Category Emoji</label>
                <input
                  type="text"
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Category Label *</label>
                <input
                  type="text"
                  placeholder="e.g. Products / Healthcare, Massages"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD PLACEMENT PACKAGE MODAL */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1437] border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-rose-500" /> Add Placement Package
              </h3>
              <button onClick={() => setShowAddPackageModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPkgTitle) return;
                const newPkg: AdPackageConfig = {
                  id: `PKG_${Date.now().toString().slice(-4)}`,
                  title: newPkgTitle,
                  price: Number(newPkgPrice) || 0,
                  badge: newPkgBadge,
                  description: newPkgDesc || "Custom placement slot",
                  enabled: true,
                };
                setConfig({ ...config, packages: [...config.packages, newPkg] });
                setShowAddPackageModal(false);
                setNewPkgTitle("");
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Placement Package Added!", timer: 1500, showConfirmButton: false, background: "#0B1437", color: "#fff" });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Package Title *</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Homepage Showcase"
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-rose-400 font-bold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={newPkgBadge}
                    onChange={(e) => setNewPkgBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Featured at top position of city search"
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow"
                >
                  Add Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD CREDIT PACK MODAL */}
      {showAddCreditPackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1437] border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" /> Add Buy Credit Pack
              </h3>
              <button onClick={() => setShowAddCreditPackModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newPack = {
                  id: `cred_${Date.now()}`,
                  price: Number(newCreditPrice) || 1000,
                  credits: Number(newCreditAmount) || 10,
                  bonusText: newCreditBonus,
                  enabled: true,
                };
                setConfig({ ...config, creditPackages: [...(config.creditPackages || []), newPack] });
                setShowAddCreditPackModal(false);
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Credit Pack Added!", timer: 1500, showConfirmButton: false, background: "#0B1437", color: "#fff" });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    value={newCreditPrice}
                    onChange={(e) => setNewCreditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-amber-400 font-bold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Credits Amount *</label>
                  <input
                    type="number"
                    value={newCreditAmount}
                    onChange={(e) => setNewCreditAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 font-bold text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Bonus Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. 5 FREE Bonus Credits"
                  value={newCreditBonus}
                  onChange={(e) => setNewCreditBonus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCreditPackModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow"
                >
                  Add Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD COUPON CODE MODAL */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1437] border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-pink-400" /> Add Promo Coupon Code
              </h3>
              <button onClick={() => setShowAddCouponModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCouponCode) return;
                const newCoup = {
                  id: `coup_${Date.now()}`,
                  code: newCouponCode.toUpperCase(),
                  discountPercent: Number(newCouponDiscount) || 10,
                  description: newCouponDesc || `${newCouponDiscount}% Special Promo Discount`,
                  validUntil: newCouponExpiry,
                  enabled: true,
                };
                setConfig({ ...config, coupons: [...(config.coupons || []), newCoup] });
                setShowAddCouponModal(false);
                setNewCouponCode("");
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Coupon Code Created!", timer: 1500, showConfirmButton: false, background: "#0B1437", color: "#fff" });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. FESTIVE50"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-pink-400 font-mono font-bold text-sm uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Discount % *</label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 font-bold text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 50% discount on first ad campaign"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Valid Until Date</label>
                <input
                  type="text"
                  value={newCouponExpiry}
                  onChange={(e) => setNewCouponExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B1F] border border-slate-800 text-slate-100 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

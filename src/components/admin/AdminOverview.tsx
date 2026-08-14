"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  TrendingUp,
  Inbox,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Globe,
  ArrowUpRight,
  IndianRupee,
  Megaphone,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Crown,
  ShoppingBag,
} from "lucide-react";
import { AdminUserData } from "./AdminLoginForm";
import { getAdCmsConfig } from "../../utils/adCmsStore";
import { fetchAllEscortsAdmin, setEscortStatus, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";

interface AdminOverviewProps {
  currentUser?: AdminUserData;
}

export function AdminOverview({ currentUser }: AdminOverviewProps) {
  const displayName = currentUser?.name || "Super Admin";

  const [profiles, setProfiles] = useState<EscortProfileItem[]>([]);

  const loadProfiles = () => {
    fetchAllEscortsAdmin().then(setProfiles);
  };

  useEffect(() => {
    loadProfiles();
    if (typeof window !== "undefined") {
      window.addEventListener(ESCORTS_UPDATE_EVENT, loadProfiles);
      window.addEventListener("storage", loadProfiles);
      return () => {
        window.removeEventListener(ESCORTS_UPDATE_EVENT, loadProfiles);
        window.removeEventListener("storage", loadProfiles);
      };
    }
  }, []);

  // Compute Live Dynamics from real MongoDB profiles
  const totalAdsCount = profiles.length;
  const approvedAds = profiles.filter((a) => !a.status || a.status === "APPROVED");
  const pendingAds = profiles.filter((a) => a.status === "PENDING_APPROVAL");
  const rejectedAds = profiles.filter((a) => a.status === "REJECTED");
  
  // Total Revenue Calculation (Sum of all approved paid ad amounts in INR ₹)
  const totalApprovedRevenue = approvedAds.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalPendingRevenue = pendingAds.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const grandTotalAdPipeline = profiles.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const handleApprove = async (id: string, title: string, price: number) => {
    await setEscortStatus(id, "APPROVED");
    loadProfiles();
    Swal.fire({
      title: "Ad Approved & Live! 🎉",
      text: `"${title}" is now LIVE on Skokka India. Revenue of ₹${price || 0} collected!`,
      icon: "success",
      background: "#0B1437",
      color: "#ffffff",
      confirmButtonColor: "#10b981",
    });
  };

  const handleReject = async (id: string, title: string) => {
    const res = await Swal.fire({
      title: "Reject Classified Ad?",
      text: `Are you sure you want to reject "${title}"?`,
      input: "select",
      inputOptions: {
        utr_invalid: "Invalid / Fake Payment UTR ID",
        policy: "Violates Content Policy",
        spam: "Spam / Duplicate Ad Listing",
      },
      showCancelButton: true,
      confirmButtonText: "Reject Ad",
      confirmButtonColor: "#f43f5e",
      background: "#0B1437",
      color: "#ffffff",
    });
    if (res.isConfirmed) {
      await setEscortStatus(id, "REJECTED");
      loadProfiles();
      Swal.fire({
        title: "Ad Rejected",
        text: `Ad "${title}" has been rejected.`,
        icon: "info",
        background: "#0B1437",
        color: "#ffffff",
      });
    }
  };

  return (
    <div className="space-y-7 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. WELCOME HERO BANNER - Dynamic Admin Name & Revenue Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1B4A] via-[#0B1437] to-[#160B29] p-5 sm:p-8 lg:p-10 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SKOKKA INDIA CLASSIFIED REVENUE DASHBOARD
            </div>
            
            {/* Dynamic Welcome Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">{displayName}</span> 👋
            </h1>
            
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
              Collected <span className="font-extrabold text-emerald-400">₹{totalApprovedRevenue.toLocaleString("en-IN")} INR</span> from approved paid ads. You have <span className="font-semibold text-amber-300">{pendingAds.length} pending ads</span> (worth <span className="text-amber-400 font-bold">₹{totalPendingRevenue.toLocaleString("en-IN")}</span>) waiting for UTR payment review.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#pending_ads_section"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs sm:text-sm hover:scale-105 transition shadow-lg flex items-center gap-2"
              >
                Review Pending Ads ({pendingAds.length}) <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Revenue Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full lg:w-auto lg:min-w-[300px]">
            <div className="p-4 rounded-2xl bg-[#050B1F]/90 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                <IndianRupee className="h-4 w-4 text-emerald-400" /> Collected Revenue
              </div>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                ₹{totalApprovedRevenue.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B1F]/90 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                <Clock className="h-4 w-4 text-amber-400" /> Pending Revenue
              </div>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                ₹{totalPendingRevenue.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B1F]/90 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                <Megaphone className="h-4 w-4 text-cyan-400" /> Total Ads Submitted
              </div>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{totalAdsCount}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B1F]/90 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                <CheckCircle2 className="h-4 w-4 text-rose-400" /> Active Live Ads
              </div>
              <span className="text-xl sm:text-2xl font-black text-rose-300 font-mono">{approvedAds.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REVENUE KPI STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI CARD 1: TOTAL REVENUE */}
        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl backdrop-blur-xl hover:border-slate-700 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Approved Revenue
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <IndianRupee className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              ₹{totalApprovedRevenue.toLocaleString("en-IN")}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> Approved Campaign Payments
            </div>
          </div>
        </div>

        {/* KPI CARD 2: TOTAL CLASSIFIED ADS */}
        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl backdrop-blur-xl hover:border-slate-700 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Ads Received
            </span>
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Megaphone className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white font-mono">
              {totalAdsCount}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-cyan-400">
              <TrendingUp className="h-3.5 w-3.5" /> Products, Services & Escorts
            </div>
          </div>
        </div>

        {/* KPI CARD 3: ACTIVE LIVE ADS */}
        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl backdrop-blur-xl hover:border-slate-700 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Live Ads
            </span>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-rose-300 font-mono">
              {approvedAds.length}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Live Directory Slots
            </div>
          </div>
        </div>

        {/* KPI CARD 4: PENDING REVIEW */}
        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl backdrop-blur-xl hover:border-slate-700 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Review (UTR)
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {pendingAds.length}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-400">
              <Clock className="h-3.5 w-3.5" /> Pending UTR Payment Verification
            </div>
          </div>
        </div>

      </div>

      {/* 3. REVENUE BREAKDOWN & CATEGORY CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* REVENUE BREAKDOWN BAR CHART */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0B1437] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-emerald-400" /> Revenue Earnings Calculation
              </h2>
              <p className="text-xs text-slate-400">Breakdown of revenue earnings collected by package tier in Indian Rupees (₹)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs">
              ₹{grandTotalAdPipeline.toLocaleString("en-IN")} Total Pipeline
            </span>
          </div>

          {/* SIMULATED DYNAMIC REVENUE BARS */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Hero Banner 🔥 (₹10,000 / ad)</span>
                <span className="text-emerald-400 font-mono">₹10,000 INR (1 Ad)</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 w-[65%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>VIP Top Slot ⭐ (₹5,000 / ad)</span>
                <span className="text-emerald-400 font-mono">₹10,000 INR (2 Ads)</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 w-[65%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Standard Ad (₹2,000 / ad)</span>
                <span className="text-emerald-400 font-mono">₹2,000 INR (1 Ad)</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[25%]" />
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY DISTRIBUTION */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#0B1437] border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-purple-400" /> Ad Categories Breakdown
            </h2>
            <p className="text-xs text-slate-400">Distribution of live ads across categories</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
              <span>🛍️ Products & Shilajit</span>
              <span className="text-purple-400 font-mono font-black">1 Ad (25%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
              <span>💋 Call Girls & Escorts</span>
              <span className="text-rose-400 font-mono font-black">1 Ad (25%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
              <span>💆 Massage Centers & Spas</span>
              <span className="text-cyan-400 font-mono font-black">1 Ad (25%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
              <span>🧔 Male Escorts</span>
              <span className="text-amber-400 font-mono font-black">1 Ad (25%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. MODERATION TABLE FOR SUBMITTED CLASSIFIED ADS */}
      <div id="pending_ads_section" className="p-6 sm:p-8 rounded-3xl bg-[#0B1437] border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Inbox className="h-5 w-5 text-rose-400" /> Incoming Classified Ads Moderation Inbox
            </h2>
            <p className="text-xs text-slate-400">Review payment UTR numbers and approve or reject incoming advertiser ads.</p>
          </div>
        </div>

        <div className="space-y-4">
          {profiles.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <Inbox className="h-8 w-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Submitted Ads In Moderation Inbox</h3>
              <p className="text-xs text-slate-400">All submitted classified listings have been reviewed or non are pending right now.</p>
            </div>
          ) : (
            profiles.map((profile) => {
              const statusText = profile.status || "APPROVED";
              const isApproved = statusText === "APPROVED";
              const isRejected = statusText === "REJECTED";
              const isPending = statusText === "PENDING_APPROVAL";

              return (
                <div
                  key={profile.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-rose-400">{profile.id}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                        {profile.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                        {profile.packageType || "Standard Ad"}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isApproved
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : isRejected
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                        }`}
                      >
                        {statusText}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{profile.name}</h3>
                    <p className="text-xs text-slate-400">
                      By <strong className="text-slate-200">{profile.submittedBy || profile.name}</strong> • Location: <span className="text-slate-200">{profile.location || profile.city}</span> • Phone: <span className="text-slate-200">{profile.phone}</span>
                    </p>
                    <p className="text-[11px] text-amber-400 font-mono">
                      Price: <strong className="text-emerald-400">₹{(profile.price || 0).toLocaleString("en-IN")}</strong> • UTR ID: <strong>{profile.utrNumber || "DIRECT_SUBMISSION"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-end w-full md:w-auto">
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(profile.id, profile.name, profile.price || 0)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve Ad &amp; Collect ₹{profile.price || 0}
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => handleReject(profile.id, profile.name)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

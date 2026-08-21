"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Wallet,
  Tag,
  Settings,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  MessageCircle,
  Send,
  User,
  CreditCard,
  Plus,
  HelpCircle,
  Info,
  CheckCircle2,
  Lock,
  LogOut,
  Sparkles,
  X,
  QrCode,
  Copy,
} from "lucide-react";
import Swal from "sweetalert2";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { PostAdWizardModal } from "@/components/PostAdWizardModal";
import { getAdCmsConfig, AD_CMS_UPDATE_EVENT } from "@/utils/adCmsStore";
import { CreditPackageConfig, CouponConfig, AdCmsConfig } from "@/types/adCms";
import { fetchAllEscortsAdmin, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { getProfileUrl } from "@/lib/seo/seoEngine";

interface UserDashboardProps {
  initialEmail?: string;
  initialVerifyLogin?: boolean;
}

export function UserDashboard({
  initialEmail,
  initialVerifyLogin,
}: UserDashboardProps) {
  const [userEmail, setUserEmail] = useState<string>(initialEmail || "");
  const [customerCode, setCustomerCode] = useState<string>("IN2B2SQX");
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true);
  const [showAgeVerifyModal, setShowAgeVerifyModal] = useState<boolean>(false);
  const [showPostAdModal, setShowPostAdModal] = useState<boolean>(false);
  const [showAdsManagerModal, setShowAdsManagerModal] = useState<boolean>(false);
  const [postAdInitialStep, setPostAdInitialStep] = useState<number>(1);
  const [selectedAdToBoost, setSelectedAdToBoost] = useState<EscortProfileItem | null>(null);
  const [adsFilterTab, setAdsFilterTab] = useState<"ALL" | "ACTIVE" | "PENDING" | "REJECTED">("ALL");
  const [userAds, setUserAds] = useState<EscortProfileItem[]>([]);

  const handleOpenBoostAdModal = (ad: EscortProfileItem) => {
    setSelectedAdToBoost(ad);
    setPostAdInitialStep(4);
    setShowAdsManagerModal(false);
    setShowPostAdModal(true);
  };
  const [walletCredits, setWalletCredits] = useState<number>(0);

  // Dynamic Ad CMS Store Config
  const [adCmsConfig, setAdCmsConfig] = useState<AdCmsConfig | null>(null);

  // Buy Credits Custom Modal State
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState<boolean>(false);
  const [selectedCreditPack, setSelectedCreditPack] = useState<CreditPackageConfig | null>(null);
  const [buyCreditsUtrId, setBuyCreditsUtrId] = useState<string>("");
  const [submittingCredits, setSubmittingCredits] = useState<boolean>(false);

  // Coupons Custom Modal State
  const [showCouponsModal, setShowCouponsModal] = useState<boolean>(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [couponInputText, setCouponInputText] = useState<string>("");
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Age Verification Form State
  const [idDocumentType, setIdDocumentType] = useState<string>("Aadhaar Card");
  const [idNumber, setIdNumber] = useState<string>("");
  const [verifyingAge, setVerifyingAge] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cms = getAdCmsConfig();
      setAdCmsConfig(cms);
      if (cms.creditPackages && cms.creditPackages.length > 0) {
        setSelectedCreditPack(cms.creditPackages[0]);
      }

      const handleCmsUpdate = () => {
        const fresh = getAdCmsConfig();
        setAdCmsConfig(fresh);
      };

      const params = new URLSearchParams(window.location.search);
      const paramEmail = params.get("email") || initialEmail;
      
      if (paramEmail && paramEmail !== "user@skokka.com") {
        setUserEmail(paramEmail);
        localStorage.setItem("skokka_user_email", paramEmail);

        fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x"}/auth/activate-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: paramEmail }),
        }).catch((err) => console.warn("Activation request error:", err));
      } else {
        const stored = localStorage.getItem("skokka_user_email");
        if (stored && stored !== "user@skokka.com") setUserEmail(stored);
      }

      const activeUserEmail = (paramEmail || localStorage.getItem("skokka_user_email") || userEmail || "").toLowerCase().trim();

      // Fetch user's posted ads from backend (strictly filtered to active user's email, ignoring dummy/seed email)
      const loadUserAds = () => {
        fetchAllEscortsAdmin().then((allProfiles) => {
          const currentEmail = (localStorage.getItem("skokka_user_email") || activeUserEmail).toLowerCase().trim();
          const isDummyEmail = !currentEmail || currentEmail === "user@skokka.com" || currentEmail === "admin@skokka.com";

          const myAds = (!isDummyEmail)
            ? allProfiles.filter((p) => p.submittedBy && p.submittedBy.toLowerCase().trim() === currentEmail)
            : [];
          setUserAds(myAds);
        });
      };

      loadUserAds();

      const handleEscortsUpdate = () => {
        loadUserAds();
      };

      window.addEventListener(AD_CMS_UPDATE_EVENT, handleCmsUpdate);
      window.addEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);
      window.addEventListener("storage", handleCmsUpdate);
      window.addEventListener("storage", handleEscortsUpdate);



      let code = localStorage.getItem("skokka_customer_code");
      if (!code) {
        code = "IN2" + Math.random().toString(36).substring(2, 7).toUpperCase();
        localStorage.setItem("skokka_customer_code", code);
      }
      setCustomerCode(code);

      setIsAgeVerified(true);
      localStorage.setItem("skokka_age_verified", "true");

      return () => {
        window.removeEventListener(AD_CMS_UPDATE_EVENT, handleCmsUpdate);
        window.removeEventListener(ESCORTS_UPDATE_EVENT, handleEscortsUpdate);
        window.removeEventListener("storage", handleCmsUpdate);
        window.removeEventListener("storage", handleEscortsUpdate);
      };
    }
  }, [initialEmail, initialVerifyLogin]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (showBuyCreditsModal || showCouponsModal || showAgeVerifyModal || showAdsManagerModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [showBuyCreditsModal, showCouponsModal, showAgeVerifyModal, showAdsManagerModal]);

  const activeAdsCount = userAds.filter((a) => !a.status || a.status === "APPROVED").length;
  const notPublishedAdsCount = userAds.filter((a) => a.status === "PENDING_APPROVAL" || a.status === "REJECTED").length;
  const pendingApprovalAdsCount = userAds.filter((a) => a.status === "PENDING_APPROVAL").length;

  const handleStartAgeVerification = () => {
    setShowAgeVerifyModal(true);
  };

  const handleSubmitAgeVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber || idNumber.length < 6) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Please enter valid ID document number",
        showConfirmButton: false,
        timer: 2000,
        background: "#0B1437",
        color: "#ffffff",
      });
      return;
    }

    setVerifyingAge(true);
    setTimeout(() => {
      setVerifyingAge(false);
      setIsAgeVerified(true);
      localStorage.setItem("skokka_age_verified", "true");
      setShowAgeVerifyModal(false);

      Swal.fire({
        title: "Age & Identity Verified! 🎉",
        text: "Your advertiser private area features are now fully unlocked.",
        icon: "success",
        background: "#0B1437",
        color: "#ffffff",
        confirmButtonColor: "#3B82F6",
      });
    }, 1200);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Log out of Advertiser Private Area?",
      text: "You can log back in anytime using your email link.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#334155",
      background: "#0B1437",
      color: "#ffffff",
    }).then((res) => {
      if (res.isConfirmed) {
        window.location.href = "/";
      }
    });
  };

  const handleBuyCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyCreditsUtrId || buyCreditsUtrId.length < 6) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Please enter 12-digit Payment UTR ID",
        showConfirmButton: false,
        timer: 2000,
        background: "#0B1437",
        color: "#ffffff",
      });
      return;
    }

    setSubmittingCredits(true);
    setTimeout(() => {
      setSubmittingCredits(false);
      const addedCredits = selectedCreditPack?.credits || 10;
      setWalletCredits((prev) => prev + addedCredits);
      setShowBuyCreditsModal(false);
      setBuyCreditsUtrId("");

      Swal.fire({
        title: "Ad Credits Added! 🎉",
        text: `${addedCredits} credits added to your wallet for UTR ${buyCreditsUtrId}. Super Admin review initiated.`,
        icon: "success",
        background: "#0B1437",
        color: "#ffffff",
        confirmButtonColor: "#10b981",
      });
    }, 1200);
  };

  const superAdminUpiId = adCmsConfig?.superAdminUpiId || "skokka@upi";
  const activeCreditPacks = (adCmsConfig?.creditPackages || []).filter((p) => p.enabled);
  const activeCoupons = (adCmsConfig?.coupons || []).filter((c) => c.enabled);
  const appliedCoupon = activeCoupons.find((c) => c.code === appliedCouponCode);

  const rawPrice = selectedCreditPack?.price || 500;
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const finalPrice = Math.max(0, Math.round(rawPrice * (1 - discountPercent / 100)));

  const upiUrl = `upi://pay?pa=${encodeURIComponent(superAdminUpiId)}&pn=Skokka%20Ad%20Credits&am=${finalPrice}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between">
      {/* MAIN ADVERTISER PRIVATE AREA CONTAINER */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">

        {/* TOP WARNING BANNER (AGE VERIFICATION) */}
        {!isAgeVerified && (
          <div className="p-4 sm:p-5 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-700 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-amber-900 block">
                  ATTENTION: Age verification!
                </strong>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  Complete identity verification to activate your advertiser account and publish classified ads.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartAgeVerification}
              className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm shrink-0"
            >
              Start Now →
            </button>
          </div>
        )}

        {/* ADVERTISER WELCOME HEADER BANNER */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>Advertiser Private Area</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {userEmail}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              CUSTOMER CODE: <strong className="text-slate-900 font-bold">{customerCode}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowPostAdModal(true)}
              className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-[#D946EF] hover:bg-[#C026D3] text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-pink-500/20 transition flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> POST NEW AD
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT 7 COLUMNS: CARDS GRID */}
          <div className="lg:col-span-7 space-y-6">

            {/* 2x2 MAIN ACTION CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* CARD 1: ADS */}
              <div className="bg-white p-5.5 rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-4">
                <div
                  onClick={() => setShowAdsManagerModal(true)}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 font-extrabold text-slate-900 text-sm group-hover:text-pink-600 transition">
                    <FileText className="h-5 w-5 text-slate-700 group-hover:text-pink-600" />
                    <span>Ads</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-slate-600 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="bg-rose-100/80 text-rose-600 px-2 py-0.5 rounded-md font-extrabold text-[11px]">Active</span>
                    <strong className="text-slate-900 text-sm font-black">{activeAdsCount}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Not published</span>
                    <strong className="text-slate-900 text-sm font-bold">{notPublishedAdsCount}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdsManagerModal(true)}
                  className="w-full py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs border border-slate-200 transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  Create & Manage Ads
                </button>
              </div>

              {/* CARD 2: WALLET */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Wallet className="h-5 w-5 text-slate-600" />
                    <span>Wallet</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>

                <div className="space-y-1 text-xs font-semibold text-slate-500 pt-1">
                  <div className="flex justify-between">
                    <span>Currents</span>
                    <strong className="text-slate-900">{walletCredits} Credits</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Used</span>
                    <strong className="text-slate-900">0 Credits</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBuyCreditsModal(true)}
                  className="w-full py-2.5 rounded-full bg-[#D946EF] hover:bg-[#C026D3] text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition"
                >
                  BUY CREDITS
                </button>
              </div>

              {/* CARD 3: COUPONS */}
              <div
                onClick={() => setShowCouponsModal(true)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-pink-300 hover:shadow-md transition space-y-4 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm group-hover:text-pink-600 transition">
                    <Tag className="h-5 w-5 text-slate-600 group-hover:text-pink-600" />
                    <span>Coupons</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>

                <p className="text-xs text-slate-500 font-medium">Manage your coupons ({activeCoupons.length} Active)</p>
              </div>

              {/* CARD 4: SETTINGS */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Settings className="h-5 w-5 text-slate-600" />
                    <span>Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>

                <p className="text-xs text-slate-500 font-medium">Manage your personal info.</p>
              </div>

            </div>

            {/* SKOKKA NEWS CARD */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
                <Info className="h-4 w-4" />
                <span>Skokka Official Notice</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Enhance your listing visibility with VIP Top Slots & Hero Banners
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Keep your ads active and boosted. High rank VIP listings receive up to 10x higher customer calls and WhatsApp inquiries daily across Jaipur and India.
              </p>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: AGE VERIFICATION & SECURITY BANNER */}
          <div className="lg:col-span-5 space-y-6">

            {/* VERIFY YOUR AGE BOX */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>Verify your age</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
                <p>
                  To post an ad on Skokka, we need to be sure that everyone using the platform is of age.
                </p>
                <div className="pt-1">
                  <strong className="text-slate-900 font-extrabold block uppercase tracking-wide text-[11px]">
                    VERIFIED ADVERTISER STATUS
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    {isAgeVerified ? "✅ Verified Active Advertiser" : "⚠️ Identity verification pending"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  You can see more information about the process check out our Privacy Policy on{" "}
                  <a href="/" className="text-rose-600 font-bold hover:underline">
                    skokkaindia.com
                  </a>
                  . We&apos;ll get back to you soon!
                </p>
              </div>

              {/* START NOW BLUE BUTTON */}
              <button
                type="button"
                onClick={handleStartAgeVerification}
                disabled={isAgeVerified}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition shadow-md ${
                  isAgeVerified
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-blue-500/20"
                }`}
              >
                {isAgeVerified ? "✓ AGE VERIFIED" : "START NOW"}
              </button>
            </div>

            {/* STAND OUT WITH THE NEW STAR CARD */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-900">Stand out with the new Star!</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Catch attention like never before. Promote your ad in a premium format that always puts you front and center.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM NEED HELP BOX */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Need help?</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Contact us through one of our channels from Monday to Friday from 2pm to 8pm.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-2 border border-emerald-200 transition"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp
            </a>
            <a
              href="https://t.me/skokkaindia"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center gap-2 border border-sky-200 transition"
            >
              <Send className="h-4 w-4 text-sky-600" /> Telegram
            </a>
          </div>
        </div>

      </main>

      {/* SLEEK CUSTOM BUY CREDITS MODAL (WOW DARK UI - NO SELECT BUG) */}
      {showBuyCreditsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="bg-[#0B1437] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-slate-100 my-8 animate-in fade-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setShowBuyCreditsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-pink-500/20 px-3 py-0.5 text-xs font-bold text-pink-300 border border-pink-500/30">
                  OFFICIAL AD CREDITS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-pink-500" /> Buy Ad Credits 💳
              </h2>
              <p className="text-xs text-slate-400 mt-1">Select a credit pack to boost your classified ad campaigns on Skokka.</p>
            </div>

            <form onSubmit={handleBuyCreditsSubmit} className="space-y-6">
              
              {/* CREDIT PACKAGES SELECTION CARDS GRID */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-pink-400 uppercase tracking-wider block">
                  Select Credit Package Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCreditPacks.map((pkg) => {
                    const isSelected = selectedCreditPack?.price === pkg.price;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedCreditPack(pkg)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? "border-pink-500 bg-pink-500/10 ring-2 ring-pink-500 shadow-lg"
                            : "border-slate-800 bg-[#050B1F] hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-rose-400 text-base">₹{pkg.price.toLocaleString("en-IN")}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            {pkg.bonusText}
                          </span>
                        </div>
                        <div className="mt-2 text-xs font-bold text-white">
                          {pkg.credits} Ad Credits
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PROMO COUPON CODE INPUT & APPLY BUTTON */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-pink-400 uppercase tracking-wider block">
                  Promo Coupon Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter or paste coupon code (e.g. WELCOME50)"
                    value={couponInputText}
                    onChange={(e) => {
                      setCouponInputText(e.target.value.toUpperCase());
                      setCouponMessage(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-pink-400 font-mono text-xs font-bold uppercase focus:border-pink-500 focus:outline-none"
                  />
                  {appliedCouponCode ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCouponCode("");
                        setCouponInputText("");
                        setCouponMessage({ type: "info", text: "Coupon removed." });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-rose-400 font-bold text-xs hover:bg-slate-700 transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = couponInputText.trim().toUpperCase();
                        if (!trimmed) {
                          setCouponMessage({ type: "error", text: "Please enter a coupon code." });
                          return;
                        }
                        const found = activeCoupons.find((c) => c.code.toUpperCase() === trimmed);
                        if (found) {
                          setAppliedCouponCode(found.code);
                          setCouponMessage({ type: "success", text: `Coupon '${found.code}' applied! ${found.discountPercent}% OFF` });
                        } else {
                          setCouponMessage({ type: "error", text: `Invalid or expired coupon code '${trimmed}'.` });
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs transition shadow"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p className={`text-[11px] font-bold flex items-center gap-1 ${
                    couponMessage.type === "success" ? "text-emerald-400" : couponMessage.type === "error" ? "text-rose-400" : "text-slate-400"
                  }`}>
                    <Tag className="h-3.5 w-3.5" /> {couponMessage.text}
                  </p>
                )}
              </div>

              {/* DYNAMIC UPI QR PAYMENT BOX */}
              {selectedCreditPack && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <QrCode className="h-4 w-4 text-pink-400" /> Super Admin UPI Payment QR
                    </span>
                    <div className="text-right">
                      {appliedCoupon ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-slate-500 text-xs font-mono">₹{rawPrice.toLocaleString("en-IN")}</span>
                          <span className="font-black text-emerald-400 text-base font-mono">₹{finalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      ) : (
                        <span className="font-black text-pink-400 text-base font-mono">₹{finalPrice.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 border-2 border-pink-500/40 relative">
                      <img
                        src={qrImageUrl}
                        alt={`UPI QR for ₹${finalPrice}`}
                        className="w-36 h-36 object-contain"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                        ₹{finalPrice.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="space-y-1">
                        <strong className="text-xs font-bold text-white block">
                          Scan & Pay ₹{finalPrice.toLocaleString("en-IN")}
                        </strong>
                        <p className="text-[11px] text-slate-400">
                          Scan using Google Pay, PhonePe, Paytm, or BHIM.
                        </p>
                      </div>

                      <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                        <span className="text-[11px] text-slate-400">UPI ID:</span>
                        <code className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-amber-400 text-xs font-bold">
                          {superAdminUpiId}
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(superAdminUpiId);
                            Swal.fire({
                              toast: true,
                              position: "top-end",
                              icon: "success",
                              title: "UPI ID Copied!",
                              showConfirmButton: false,
                              timer: 1500,
                              background: "#0B1437",
                              color: "#ffffff",
                            });
                          }}
                          className="text-[10px] font-bold text-pink-400 hover:underline cursor-pointer"
                        >
                          Copy UPI
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Enter 12-Digit UPI Payment UTR Transaction ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 324156789012"
                      value={buyCreditsUtrId}
                      onChange={(e) => setBuyCreditsUtrId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:border-pink-500 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingCredits}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {submittingCredits ? "Submitting Payment..." : `Submit UTR & Claim ${selectedCreditPack?.credits || 10} Credits`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* SLEEK CUSTOM PROMO COUPONS MODAL */}
      {showCouponsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="bg-[#0B1437] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-100 animate-in fade-in duration-200 space-y-5">
            <button
              onClick={() => setShowCouponsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-pink-400" /> Active Promo Coupons ({activeCoupons.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Use promo codes to get extra discounts on classified ad boosts.</p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activeCoupons.map((cp) => (
                <div key={cp.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-pink-400 font-mono font-black text-sm">{cp.code}</strong>
                      <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                        {cp.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{cp.description}</p>
                    <span className="text-[10px] text-slate-500 block">Valid until {cp.validUntil}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(cp.code);
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: `Coupon ${cp.code} Copied!`,
                        showConfirmButton: false,
                        timer: 1500,
                        background: "#0B1437",
                        color: "#ffffff",
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-pink-950/60 text-pink-300 font-bold text-xs border border-slate-700 shrink-0 flex items-center gap-1 transition"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCouponsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* AGE VERIFICATION MODAL */}
      {showAgeVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" /> Identity & Age Verification
              </h3>
              <button
                type="button"
                onClick={() => setShowAgeVerifyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Mandatory identity verification required before posting classified ads on Skokka India.
            </p>

            <form onSubmit={handleSubmitAgeVerification} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Type</label>
                <select
                  value={idDocumentType}
                  onChange={(e) => setIdDocumentType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="Aadhaar Card">12-Digit Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{idDocumentType} Number</label>
                <input
                  type="text"
                  placeholder="e.g. 5432-8765-1092"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifyingAge}
                className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg"
              >
                {verifyingAge ? "Verifying Document..." : "Submit Identity Verification"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADS MANAGER & ENDING STATS MODAL */}
      {showAdsManagerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="bg-[#0B1437] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-slate-100 my-auto animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Ads Management & Expiration Stats
                  </h3>
                  <p className="text-xs text-slate-400">Track pending approval status, active campaigns, and expiration stats.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdsManagerModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics Strip — Clickable Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setAdsFilterTab("ALL")}
                className={`p-4 rounded-2xl border text-left transition ${
                  adsFilterTab === "ALL"
                    ? "bg-rose-500/10 border-rose-500 text-white shadow-lg ring-1 ring-rose-500/50"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Ads</span>
                <span className="text-xl font-black text-white">{userAds.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setAdsFilterTab("ACTIVE")}
                className={`p-4 rounded-2xl border text-left transition ${
                  adsFilterTab === "ACTIVE"
                    ? "bg-emerald-500/20 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/50"
                    : "bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-500/60 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Active & Live</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-xl font-black text-emerald-300">{activeAdsCount}</span>
              </button>

              <button
                type="button"
                onClick={() => setAdsFilterTab("PENDING")}
                className={`p-4 rounded-2xl border text-left transition ${
                  adsFilterTab === "PENDING"
                    ? "bg-amber-500/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/50"
                    : "bg-amber-950/40 border-amber-500/30 hover:border-amber-500/60 text-slate-300"
                }`}
              >
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Pending Review</span>
                <span className="text-xl font-black text-amber-300">{pendingApprovalAdsCount}</span>
              </button>

              <button
                type="button"
                onClick={() => setAdsFilterTab("REJECTED")}
                className={`p-4 rounded-2xl border text-left transition ${
                  adsFilterTab === "REJECTED"
                    ? "bg-slate-800 border-rose-500 text-white shadow-lg ring-1 ring-rose-500/50"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Not Published</span>
                <span className="text-xl font-black text-slate-300">{notPublishedAdsCount}</span>
              </button>
            </div>

            {/* Section Header & Status Filter Pills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setAdsFilterTab("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition tracking-wider shrink-0 ${
                    adsFilterTab === "ALL"
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                  }`}
                >
                  All Ads ({userAds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdsFilterTab("ACTIVE")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition tracking-wider shrink-0 flex items-center gap-1.5 ${
                    adsFilterTab === "ACTIVE"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Active & Live ({activeAdsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAdsFilterTab("PENDING")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition tracking-wider shrink-0 ${
                    adsFilterTab === "PENDING"
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-amber-950/40 hover:bg-amber-900/40 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  ⏳ Pending ({pendingApprovalAdsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAdsFilterTab("REJECTED")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition tracking-wider shrink-0 ${
                    adsFilterTab === "REJECTED"
                      ? "bg-slate-700 text-white shadow-md"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                  }`}
                >
                  ❌ Not Published ({notPublishedAdsCount})
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAdsManagerModal(false);
                  setShowPostAdModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> Post New Ad
              </button>
            </div>

            {/* User Ads List Filtered */}
            <div className="space-y-4">
              {(() => {
                const filtered = userAds.filter((ad) => {
                  if (adsFilterTab === "ACTIVE") return !ad.status || ad.status === "APPROVED";
                  if (adsFilterTab === "PENDING") return ad.status === "PENDING_APPROVAL";
                  if (adsFilterTab === "REJECTED") return ad.status === "REJECTED";
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                      {adsFilterTab === "ACTIVE" ? (
                        <>
                          <CheckCircle2 className="h-10 w-10 text-emerald-500/60 mx-auto animate-bounce" />
                          <h5 className="text-base font-extrabold text-white">No Active & Live Ads Right Now</h5>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Submitted ads are currently pending Super Admin review. Once approved, your campaign will instantly go LIVE across the site with active phone and WhatsApp leads!
                          </p>
                        </>
                      ) : (
                        <>
                          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
                          <p className="text-sm text-slate-300 font-medium">No ads found in this tab.</p>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdsManagerModal(false);
                          setShowPostAdModal(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition"
                      >
                        + Post New Classified Ad
                      </button>
                    </div>
                  );
                }

                return filtered.map((ad) => {
                  const isApproved = !ad.status || ad.status === "APPROVED";
                  const isPending = ad.status === "PENDING_APPROVAL";
                  const isRejected = ad.status === "REJECTED";

                  // Calculate Campaign Expiry Stats (30 Days from submission)
                  const submittedDate = ad.submittedAt ? new Date(ad.submittedAt) : new Date();
                  const expiryDate = new Date(submittedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

                  return (
                    <div
                      key={ad.id}
                      className={`p-5 rounded-2xl border space-y-4 transition shadow-lg ${
                        isApproved
                          ? "bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500 ring-1 ring-emerald-500/20"
                          : "bg-slate-900 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-slate-700 shrink-0 relative">
                            <img src={ad.photoUrl} alt={ad.name} className="h-full w-full object-cover" />
                            {isApproved && (
                              <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ping" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-rose-400">{ad.id}</span>
                              <span className="text-xs text-slate-400">• {ad.category}</span>
                            </div>
                            <h5 className="text-base font-extrabold text-white flex items-center gap-2">
                              {ad.name}
                              {isApproved && (
                                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE &amp; ACTIVE
                                </span>
                              )}
                            </h5>
                            <p className="text-xs text-slate-400 font-medium">{ad.location || ad.city}</p>
                          </div>
                        </div>

                        {/* Approval Status Badge */}
                        <div>
                          {isPending && (
                            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider border border-amber-500/40 inline-flex items-center gap-1.5 animate-pulse">
                              ⏳ Pending Super Admin Approval
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs uppercase tracking-wider border border-emerald-500/40 inline-flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> LIVE &amp; APPROVED ✅
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 font-black text-xs uppercase tracking-wider border border-rose-500/40 inline-flex items-center gap-1.5">
                              ❌ Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Active Lead Metrics for Live Ads */}
                      {isApproved && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
                          <div className="flex items-center gap-2 text-emerald-300 font-bold">
                            <PhoneCall className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>Direct Phone Leads: <strong className="text-white font-mono">Active 🟢</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-300 font-bold">
                            <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>WhatsApp Enquiries: <strong className="text-white font-mono">Active 🟢</strong></span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-300 font-bold col-span-2 sm:col-span-1">
                            <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
                            <span>Search Placement: <strong className="text-amber-300 uppercase">{ad.packageType || "VIP / Standard"}</strong></span>
                          </div>
                        </div>
                      )}

                      {/* Approval Explanation Note */}
                      {isPending && (
                        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs font-medium space-y-1">
                          <strong className="font-extrabold text-amber-300 block">🔒 Super Admin Review In Progress:</strong>
                          <p>Your listing has been submitted for approval. Once Super Admin verifies the ad details, it will automatically go LIVE across the site with active phone and WhatsApp leads.</p>
                        </div>
                      )}

                      {/* Campaign Ending Stats & Expiration Analytics */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                          <span className="text-slate-400 font-bold">
                            Package: <strong className="text-white">{ad.packageType || "Standard Listing"}</strong>
                          </span>
                          <span className="text-slate-400 font-bold">
                            Rate: <strong className="text-amber-400">{ad.rate || `₹${ad.price} / hr`}</strong>
                          </span>
                          <span className="text-slate-400 font-bold">
                            Ending Date: <strong className="text-rose-300">{expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                          </span>
                        </div>

                        {/* Progress Bar for Days Remaining */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400">Campaign Duration</span>
                            <span className="text-emerald-400">{daysRemaining} Days Remaining (Active)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                              style={{ width: `${Math.min(100, (daysRemaining / 30) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-end gap-3 pt-1">
                        {isApproved && (
                          <Link
                            href={getProfileUrl(ad)}
                            target="_blank"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-white" /> View Live Listing
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenBoostAdModal(ad)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-1"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Boost / Extend Ad
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}

      {/* POST AD WIZARD / BOOST AD MODAL */}
      <PostAdWizardModal
        isOpen={showPostAdModal}
        initialStep={postAdInitialStep}
        initialAd={selectedAdToBoost}
        onClose={() => {
          setShowPostAdModal(false);
          setPostAdInitialStep(1);
          setSelectedAdToBoost(null);
        }}
        onAdSubmitted={() => {
          setShowPostAdModal(false);
          setPostAdInitialStep(1);
          setSelectedAdToBoost(null);
          fetchAllEscortsAdmin().then((allProfiles) => {
            const uEmail = (localStorage.getItem("skokka_user_email") || "").toLowerCase().trim();
            const myAds = uEmail
              ? allProfiles.filter((p) => p.submittedBy && p.submittedBy.toLowerCase().trim() === uEmail)
              : [];
            setUserAds(myAds);
          });
        }}
      />
    </div>
  );
}

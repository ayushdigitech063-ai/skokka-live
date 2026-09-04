"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  X,
  Upload,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Star,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Camera,
  Image as ImageIcon,
  DollarSign,
  QrCode,
  ArrowRight,
  Check,
  Lock
} from "lucide-react";
import { getHomePageCmsConfig, saveHomePageCmsConfig, registerNewCityIfMissing, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { createEscortProfile, EscortProfileItem } from "@/utils/escortsStore";

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAdModal({ isOpen, onClose }: CreateAdModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cmsCategories, setCmsCategories] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    stageName: "",
    category: "Call Girls",
    age: 22,
    cityArea: "Jaipur (Bani Park)",
    phone: "",
    whatsapp: "",
    incallRate: "₹4,500 / hr",
    outcallRate: "₹8,000 / night",
    tagline: "",
    description: "",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    galleryPhotos: [] as string[],
    selfieVerifiedPhoto: "",
    packageType: "VERIFIED" as "STANDARD" | "VERIFIED" | "VIP",
    price: 2499,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const syncCategories = () => {
        const cms = getHomePageCmsConfig();
        const list = (cms?.categories?.categories || []).map((c) => c.label);
        const defaults = [
          "VIP Escorts",
          "Call Girls",
          "Independent Girls",
          "Russian Escorts",
          "Massages",
          "Male Escorts",
          "Transsexual",
          "Adult Meetings",
        ];
        setCmsCategories(Array.from(new Set([...defaults, ...list])));
      };
      syncCategories();

      window.addEventListener(CMS_UPDATE_EVENT, syncCategories);
      window.addEventListener("storage", syncCategories);
      return () => {
        window.removeEventListener(CMS_UPDATE_EVENT, syncCategories);
        window.removeEventListener("storage", syncCategories);
      };
    }
  }, []);

  if (!isOpen) return null;

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploading(false);
      const dataUrl = event.target?.result as string;
      if (dataUrl) onSuccess(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishAd = async () => {
    if (!formData.stageName || !formData.phone) {
      Swal.fire({
        title: "Required Fields Missing",
        text: "Please enter Stage Name and Phone Number.",
        icon: "warning",
        background: "#0B1437",
        color: "#ffffff",
        confirmButtonColor: "#e11d48",
      });
      return;
    }

    const newId = `SK-${Date.now().toString().slice(-4)}`;
    const isVip = formData.packageType === "VIP";
    const isVerified = formData.packageType === "VERIFIED" || formData.packageType === "VIP";

    const newProfile: EscortProfileItem = {
      id: newId,
      name: formData.stageName,
      title: formData.tagline || `Top rated ${formData.category} companion in ${formData.cityArea}`,
      category: formData.category,
      age: formData.age || 22,
      location: formData.cityArea,
      city: formData.cityArea.split("(")[0].trim() || "Jaipur",
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      rate: formData.incallRate,
      price: parseInt(formData.incallRate.replace(/[^0-9]/g, "")) || 5000,
      availability: formData.outcallRate,
      rating: 5.0,
      photoUrl: formData.photoUrl,
      isVerified: isVerified,
      isVip: isVip,
      packageType: isVip ? "VIP Featured Package" : isVerified ? "Verified Package" : "Standard Package",
      description: formData.description || `High-class ${formData.category} available for outcalls and 5-star hotel appointments in ${formData.cityArea}.`,
      tags: [formData.category, "Independent", "Verified"],
      gallery: formData.galleryPhotos.length > 0 ? formData.galleryPhotos : [formData.photoUrl],
      status: "APPROVED",
      submittedAt: new Date().toISOString(),
    };

    // Submit to MongoDB backend
    await createEscortProfile(newProfile, false);
    registerNewCityIfMissing(formData.cityArea);

    // Close Modal and Show Success
    onClose();
    Swal.fire({
      title: "🎉 Ad Published Successfully!",
      html: `
        <div class="space-y-3 text-center">
          <p class="text-sm text-slate-300">Your escort ad for <strong class="text-rose-400">${newProfile.name}</strong> is now live and published!</p>
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400">
            Profile ID: ${newProfile.id} • Status: APPROVED & LIVE
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Awesome 👍",
      confirmButtonColor: "#3b82f6",
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-[#0B1437] text-white rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-2 rounded-full hover:bg-slate-900 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER BADGE */}
        <div className="space-y-1 text-center border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Post Classified Escort Ad</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your Escort Profile Ad 💃
          </h2>
          <p className="text-xs text-slate-400">
            Step {step} of 3 • {step === 1 ? "Profile Details" : step === 2 ? "Select Promotion Package" : "Instant Payment & Publish"}
          </p>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="grid grid-cols-3 gap-2 my-5">
          <div className={`h-1.5 rounded-full transition ${step >= 1 ? "bg-rose-500" : "bg-slate-800"}`} />
          <div className={`h-1.5 rounded-full transition ${step >= 2 ? "bg-rose-500" : "bg-slate-800"}`} />
          <div className={`h-1.5 rounded-full transition ${step >= 3 ? "bg-rose-500" : "bg-slate-800"}`} />
        </div>

        {/* STEP 1: ESCORT PROFILE DETAILS */}
        {step === 1 && (
          <div className="space-y-5">
            {/* NAME & CATEGORY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Stage Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={formData.stageName}
                  onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                >
                  {cmsCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AGE & LOCATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 22 })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">City & Area Location *</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 pb-1 max-h-24 overflow-y-auto pr-1">
                    {Array.from(
                      new Set(
                        (getHomePageCmsConfig()?.topCities?.cities || [])
                          .map((c) => c.name.split(" ")[0].trim())
                          .filter(Boolean)
                      )
                    ).map((cityName) => (
                      <button
                        key={cityName}
                        type="button"
                        onClick={() => setFormData({ ...formData, cityArea: `${cityName} (Central)` })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                          formData.cityArea.includes(cityName)
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        📍 {cityName}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur (Bani Park), Delhi (CP), Mumbai (Bandra)"
                    value={formData.cityArea}
                    onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* PHONE & WHATSAPP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Phone Number (10 Digits Only) *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    const numericVal = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: numericVal });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">WhatsApp Number (10 Digits Only)</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.whatsapp}
                  onChange={(e) => {
                    const numericVal = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                    setFormData({ ...formData, whatsapp: numericVal });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* RATES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Incall Rate</label>
                <input
                  type="text"
                  placeholder="e.g. ₹5,000 / hr"
                  value={formData.incallRate}
                  onChange={(e) => setFormData({ ...formData, incallRate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Outcall Rate</label>
                <input
                  type="text"
                  placeholder="e.g. ₹10,000 / night"
                  value={formData.outcallRate}
                  onChange={(e) => setFormData({ ...formData, outcallRate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* TAGLINE & DESCRIPTION (MAX 50 WORDS / 150 CHARS) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 block">Tagline / Title</label>
                <span className="text-[10px] text-amber-400 font-semibold">
                  {formData.tagline.trim() ? `${formData.tagline.trim().split(/\s+/).filter(Boolean).length}/50 words` : "Max 50 words"} ({formData.tagline.length}/150 chars)
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. High class VIP companion in Jaipur. Available 24/7 for 5-star hotel outcalls."
                value={formData.tagline}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.length > 150) val = val.slice(0, 150);
                  const words = val.trim().split(/\s+/).filter(Boolean);
                  if (words.length > 50) val = words.slice(0, 50).join(" ");
                  setFormData({ ...formData, tagline: val });
                }}
                maxLength={150}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                ⚠️ Title is limited to 1 line (Max 50 words / 150 chars).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Description / About</label>
              <textarea
                rows={3}
                placeholder="Write a detailed description about your services, availability, and preferences..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* MAIN PHOTO UPLOAD */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">Main Profile Cover Photo</label>
              <div className="flex items-center gap-4">
                <div
                  className="h-20 w-20 rounded-2xl bg-slate-900 border border-slate-800 bg-cover bg-center shrink-0 relative overflow-hidden"
                  style={{ backgroundImage: `url('${formData.photoUrl}')` }}
                />
                <div className="flex-1 space-y-2">
                  <label className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition w-fit shadow-lg">
                    <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (dataUrl) => setFormData({ ...formData, photoUrl: dataUrl }))}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">Or paste image URL below:</p>
                  <input
                    type="text"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!formData.stageName || !formData.phone) {
                  Swal.fire({
                    title: "Missing Name or Phone",
                    text: "Please fill Stage Name and Phone Number to continue.",
                    icon: "warning",
                    background: "#0B1437",
                    color: "#ffffff",
                    confirmButtonColor: "#e11d48",
                  });
                  return;
                }
                setStep(2);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Continue To Select Promotion Package</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 2: CHOOSE PROMOTION PACKAGE */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-white">Select Your Ad Promotion Package 🚀</h3>
              <p className="text-xs text-slate-400">Choose placement for Homepage, Verified Section, or Dedicated /vip Page</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* FREE STANDARD PACKAGE */}
              <div
                onClick={() => setFormData({ ...formData, packageType: "STANDARD", price: 0 })}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  formData.price === 0
                    ? "bg-slate-900 border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-300 uppercase">Free Standard</span>
                    {formData.price === 0 && <CheckCircle2 className="h-4 w-4 text-rose-500" />}
                  </div>
                  <div className="text-xl font-black text-emerald-400">₹0 <span className="text-xs text-slate-400 font-normal">/ Free</span></div>
                  <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> Main Escorts Directory (/escorts)</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> Direct WhatsApp & Phone</li>
                  </ul>
                </div>
              </div>

              {/* HOMEPAGE FEATURED PACKAGE */}
              <div
                onClick={() => setFormData({ ...formData, packageType: "STANDARD", price: 999 })}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  formData.price === 999
                    ? "bg-slate-900 border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-rose-500/40"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-400 uppercase">Homepage Standard</span>
                    {formData.price === 999 && <CheckCircle2 className="h-4 w-4 text-rose-500" />}
                  </div>
                  <div className="text-xl font-black text-white">₹999 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> Homepage Escorts List</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> Priority Directory Ranking</li>
                  </ul>
                </div>
              </div>

              {/* VERIFIED ESCORT PACKAGE */}
              <div
                onClick={() => setFormData({ ...formData, packageType: "VERIFIED", price: 2499 })}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  formData.price === 2499
                    ? "bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-emerald-500/40"
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase">
                  VERIFIED ✅
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Escort
                    </span>
                    {formData.price === 2499 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <div className="text-xl font-black text-white">₹2,499 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> Homepage Verified Section</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400" /> ✅ Verified Badge Icon</li>
                  </ul>
                </div>
              </div>

              {/* VIP PAGE ONLY PACKAGE */}
              <div
                onClick={() => setFormData({ ...formData, packageType: "VIP", price: 3499 })}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  formData.price === 3499
                    ? "bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-amber-400/40"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase flex items-center gap-1">
                      <Crown className="h-3.5 w-3.5" /> /vip Page Feature
                    </span>
                    {formData.price === 3499 && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div className="text-xl font-black text-white">₹3,499 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <ul className="text-[11px] text-slate-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400" /> Dedicated /vip Showcase Page</li>
                    <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400" /> 👑 Crown Badge</li>
                  </ul>
                </div>
              </div>

              {/* VIP HOMEPAGE + /VIP PAGE PACKAGE */}
              <div
                onClick={() => setFormData({ ...formData, packageType: "VIP", price: 4999 })}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-3 relative sm:col-span-2 lg:col-span-2 ${
                  formData.price === 4999
                    ? "bg-slate-900 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/30 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-amber-400/40"
                }`}
              >
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] uppercase">
                  5-STAR VIP TOP FEATURE 🔥
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase flex items-center gap-1">
                      <Crown className="h-4 w-4" /> VIP Homepage + /vip Page Feature
                    </span>
                    {formData.price === 4999 && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div className="text-2xl font-black text-white">₹4,999 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <ul className="text-xs text-slate-300 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-amber-400" /> <strong>BOTH Homepage VIP Showcase AND Dedicated /vip Page</strong></li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-amber-400" /> 👑 Crown Badge + Golden Glow Border + Top 1 Priority Placement</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Back to Details
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to {formData.price === 0 ? "Publish Free" : `Payment (₹${formData.price.toLocaleString("en-IN")})`}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INSTANT UPI PAYMENT & PUBLISH */}
        {step === 3 && (
          <div className="space-y-5 text-center">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white">
                {formData.price === 0 ? "Publish Free Escort Ad 🆓" : "Scan UPI QR & Pay to Publish"}
              </h3>
              <p className="text-xs text-slate-300">
                Package: <strong className="text-rose-400">{formData.packageType} Package</strong> • Total:{" "}
                <strong className="text-emerald-400 text-sm">
                  {formData.price === 0 ? "₹0 (FREE AD)" : `₹${formData.price.toLocaleString("en-IN")}`}
                </strong>
              </p>

              {/* UPI QR CODE SIMULATION (HIDDEN FOR FREE AD) */}
              {formData.price > 0 ? (
                <div className="p-4 bg-white rounded-2xl max-w-[200px] mx-auto shadow-xl">
                  <div className="h-40 w-40 bg-slate-950 rounded-xl flex flex-col items-center justify-center text-white space-y-2 p-2">
                    <QrCode className="h-16 w-16 text-emerald-400" />
                    <span className="text-[10px] font-mono text-slate-300">UPI: mycityqueen@upi</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl max-w-md mx-auto text-emerald-300 text-xs font-bold space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                  <p>₹0 Free Standard Listing Selected! No payment required.</p>
                </div>
              )}

              {formData.price > 0 && (
                <p className="text-[11px] text-slate-400">
                  Accepts Google Pay, PhonePe, Paytm, BHIM & All Indian Bank UPI Apps.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePublishAd}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm uppercase tracking-wider transition shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>{formData.price === 0 ? "Publish Free Ad Now 🚀" : "Complete Payment & Publish Ad Now"}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

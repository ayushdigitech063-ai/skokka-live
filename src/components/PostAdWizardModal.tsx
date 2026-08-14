"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  X,
  User,
  MapPin,
  Phone,
  Camera,
  Upload,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  QrCode,
  ListFilter,
  Lock,
  Building2,
  ShoppingBag,
  Video,
  Play,
  Package,
} from "lucide-react";
import { getAdCmsConfig, AD_CMS_UPDATE_EVENT } from "@/utils/adCmsStore";
import { getHomePageCmsConfig, registerNewCityIfMissing } from "@/utils/homepageCmsStore";
import { AdCmsConfig } from "@/types/adCms";
import { createEscortProfile, updateEscortProfile, EscortProfileItem } from "@/utils/escortsStore";

interface PostAdWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdSubmitted: (ad: any) => void;
  initialStep?: number;
  initialAd?: EscortProfileItem | null;
}

export function PostAdWizardModal({
  isOpen,
  onClose,
  onAdSubmitted,
  initialStep = 1,
  initialAd = null,
}: PostAdWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [adCms, setAdCms] = useState<AdCmsConfig | null>(null);

  // Age Verification Gate Form State
  const [idDocumentType, setIdDocumentType] = useState<string>("Aadhaar Card");
  const [idNumber, setIdNumber] = useState<string>("");
  const [verifyingAge, setVerifyingAge] = useState<boolean>(false);

  // Dynamic Super Admin UPI ID
  const [superAdminUpiId, setSuperAdminUpiId] = useState("skokka@upi");

  // Dynamic Location Hierarchy State
  const [locationTree, setLocationTree] = useState<any[]>([]);
  const [dbCities, setDbCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://skokka-backend-live.onrender.com";
    Promise.all([
      fetch(`${BACKEND_URL}/api/locations/tree`).then((r) => r.json()).catch(() => null),
      fetch(`${BACKEND_URL}/api/locations/cities`).then((r) => r.json()).catch(() => null),
    ]).then(([treeRes, citiesRes]) => {
      if (treeRes && treeRes.success) setLocationTree(treeRes.tree || []);
      if (citiesRes && citiesRes.success) setDbCities(citiesRes.cities || []);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cms = getAdCmsConfig();
      setAdCms(cms);
      setSuperAdminUpiId(cms.superAdminUpiId);

      const handleCmsUpdate = () => {
        const fresh = getAdCmsConfig();
        setAdCms(fresh);
        setSuperAdminUpiId(fresh.superAdminUpiId);
      };

      window.addEventListener(AD_CMS_UPDATE_EVENT, handleCmsUpdate);
      window.addEventListener("storage", handleCmsUpdate);

      const ageVerified = localStorage.getItem("skokka_age_verified") === "true";
      setIsAgeVerified(ageVerified);

      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        window.removeEventListener(AD_CMS_UPDATE_EVENT, handleCmsUpdate);
        window.removeEventListener("storage", handleCmsUpdate);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Universal Multi-Step Ad Form Data
  const [formData, setFormData] = useState({
    adTitle: "",
    category: "Call Girls",
    age: 22,
    cityArea: "Jaipur (Bani Park)",
    tagline: "",
    priceRate: "₹5,000 / hr",
    offerDiscount: "₹10,000 / night",
    phone: "",
    whatsapp: "",
    telegram: "",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    galleryPhotos: [] as string[],
    videoUrl: "",
    packageType: "VIP_HOMEPAGE", // STANDARD, VIP_SLOT, VIP_HOMEPAGE, VERIFIED
    price: 4999,
    paymentMethod: "UPI_QR",
    utrTransactionId: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialStep) setCurrentStep(initialStep);
      if (initialAd) {
        setFormData({
          adTitle: initialAd.name || "",
          category: initialAd.category || "Call Girls",
          age: initialAd.age || 22,
          cityArea: initialAd.location || initialAd.city || "Jaipur (Bani Park)",
          tagline: initialAd.title || initialAd.description || "",
          priceRate: initialAd.rate || "₹5,000 / hr",
          offerDiscount: initialAd.availability || "24/7 Incall & Outcall",
          phone: initialAd.phone || "",
          whatsapp: initialAd.whatsapp || initialAd.phone || "",
          telegram: initialAd.telegram || "",
          photoUrl: initialAd.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
          galleryPhotos: initialAd.gallery || [],
          videoUrl: initialAd.videoUrl || "",
          packageType: (initialAd.packageType as any) || "VIP_HOMEPAGE",
          price: initialAd.price || 4999,
          paymentMethod: "UPI_QR",
          utrTransactionId: "",
        });
      }
    }
  }, [isOpen, initialStep, initialAd]);

  if (!isOpen) return null;

  // Handle Age Verification Submission inside Modal Gate
  const handleVerifyGateSubmit = (e: React.FormEvent) => {
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

      Swal.fire({
        title: "Verification Successful! 🎉",
        text: "Age & identity verified. You can now post your ad campaign.",
        icon: "success",
        background: "#0B1437",
        color: "#ffffff",
        confirmButtonColor: "#3B82F6",
      });
    }, 1200);
  };

  // Image Upload File Picker Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, photoUrl: event.target?.result as string }));
        setUploadingImage(false);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Ad Cover Image Uploaded!",
          showConfirmButton: false,
          timer: 1800,
          background: "#0B1437",
          color: "#ffffff",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Video Upload File Picker Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingVideo(true);
      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, videoUrl: event.target?.result as string }));
        setUploadingVideo(false);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Product Video Uploaded Successfully!",
          showConfirmButton: false,
          timer: 1800,
          background: "#0B1437",
          color: "#ffffff",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Final Ad Campaign to Super Admin
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.price > 0 && !formData.utrTransactionId) {
      Swal.fire({
        title: "Missing Payment Reference UTR",
        text: "Please enter 12-digit UPI UTR Transaction ID after scanning Super Admin QR code.",
        icon: "warning",
        background: "#0B1437",
        color: "#ffffff",
        confirmButtonColor: "#f43f5e",
      });
      return;
    }

    const pendingAd = {
      id: `AD-${Math.floor(1000 + Math.random() * 9000)}`,
      adTitle: formData.adTitle || "Classified Promotion",
      category: formData.category,
      cityArea: formData.cityArea,
      tagline: formData.tagline,
      priceRate: formData.priceRate,
      offerDiscount: formData.offerDiscount,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      photoUrl: formData.photoUrl,
      videoUrl: formData.videoUrl,
      packageType: formData.packageType,
      amountPaid: formData.price,
      superAdminUpiId: superAdminUpiId,
      utrTransactionId: formData.utrTransactionId,
      status: "PENDING_APPROVAL" as const,
      submittedAt: new Date().toISOString(),
    };

    const isVip = formData.packageType?.includes("VIP") || formData.packageType === "VIP_SLOT" || formData.price >= 4999;
    const isVerified = formData.packageType?.includes("VERIFIED") || isVip;

    // Auto add to dynamic Escort Store
    const currentUserEmail = (typeof window !== "undefined" ? localStorage.getItem("skokka_user_email") : null) || "";
    const newProfile: EscortProfileItem = {
      id: pendingAd.id,
      name: formData.adTitle || "Independent Escort",
      title: formData.tagline || `Top rated ${formData.category} companion in ${formData.cityArea}`,
      city: formData.cityArea.split("(")[0].trim() || "Jaipur",
      location: formData.cityArea || "Jaipur (Bani Park)",
      category: formData.category || "Call Girls",
      age: formData.age || 22,
      rating: 5.0,
      rate: formData.priceRate || `₹5,000 / hr`,
      availability: formData.offerDiscount || "24/7 Incall & Outcall",
      tags: ["Verified", formData.category, "Independent"],
      phone: formData.phone || "+91 98765 00000",
      whatsapp: (formData.whatsapp || formData.phone || "919876500000").replace(/[^0-9]/g, ""),
      telegram: formData.telegram || formData.whatsapp || formData.phone,
      photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      videoUrl: formData.videoUrl,
      gallery: [formData.photoUrl].filter(Boolean) as string[],
      description: formData.tagline || `Independent high-class ${formData.category} companion available for 5-star hotel appointments in ${formData.cityArea}.`,
      packageType: formData.packageType || "FREE_STANDARD",
      isVerified: isVerified,
      isVip: isVip,
      price: formData.price || 0,
      status: "PENDING_APPROVAL",
      submittedAt: pendingAd.submittedAt,
      submittedBy: currentUserEmail, // ✅ Link ad to current user's account
    };


    // Submit to MongoDB via backend API (Update existing profile if initialAd provided, otherwise create)
    if (initialAd && initialAd.id) {
      newProfile.id = initialAd.id;
      await updateEscortProfile(initialAd.id, newProfile);
    } else {
      await createEscortProfile(newProfile, false); // false = advertiser submitted (PENDING_APPROVAL)
    }
    
    // Auto-register new City & Area into MongoDB Atlas Location Database
    try {
      const city = selectedCity || formData.cityArea.split("(")[0].trim() || "Jaipur";
      const area = selectedArea || (formData.cityArea.includes("(") ? formData.cityArea.split("(")[1].replace(")", "").trim() : "");
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://skokka-backend-live.onrender.com";
      await fetch(`${BACKEND_URL}/api/locations/auto-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateName: "Rajasthan",
          cityName: city,
          areaName: area,
        }),
      });
    } catch (err) {
      console.error("Auto location register error:", err);
    }

    registerNewCityIfMissing(formData.cityArea);
    onAdSubmitted(pendingAd);
    onClose();

    Swal.fire({
      title: "⏳ Submitted for Super Admin Approval!",
      html: `
        <div class="space-y-3 text-center">
          <p class="text-sm text-slate-300">Escort ad for <strong class="text-rose-400">${newProfile.name}</strong> (${newProfile.category}) has been submitted successfully!</p>
          <p class="text-xs text-amber-300 font-semibold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            🔒 Super Admin Approval Required: Your listing will be reviewed by Super Admin and published live once approved.
          </p>
          <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-400">
            Ad ID: ${newProfile.id} • Status: PENDING_APPROVAL
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Got It 👍",
      confirmButtonColor: "#3b82f6",
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#0B1437] border border-slate-800 rounded-3xl p-4 sm:p-8 max-w-xl w-full shadow-2xl relative text-slate-100 my-auto animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* MANDATORY AGE VERIFICATION LOCK GATE */}
        {!isAgeVerified ? (
          <div className="space-y-5 text-center py-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Mandatory Verification Required
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Age & identity verification is mandatory for all advertisers on Skokka India before posting classified ad campaigns.
              </p>
            </div>

            <form onSubmit={handleVerifyGateSubmit} className="space-y-4 text-left p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Identity Document Type</label>
                <select
                  value={idDocumentType}
                  onChange={(e) => setIdDocumentType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                >
                  <option value="Aadhaar Card">12-Digit Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Voter ID">Voter ID Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{idDocumentType} Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 5432-8765-1092"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifyingAge}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                {verifyingAge ? "Verifying Document..." : "Verify Identity & Unlock Ad Creation"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* WIZARD HEADER */}
            <div className="border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-rose-500/20 px-3 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                  STEP {currentStep} OF 4
                </span>
                <span className="text-xs text-slate-400 font-medium">Universal Classified Ad Campaign</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {currentStep === 1 && "1. Ad Category & Product/Service Name"}
                {currentStep === 2 && "2. Price, Offers & Description"}
                {currentStep === 3 && "3. Contact, Photos & Video Upload"}
                {currentStep === 4 && "4. Select Placement & Payment"}
              </h2>
            </div>

            {/* STEP PROGRESS BAR */}
            <div className="flex items-center justify-between gap-2 mb-6">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    stepNum <= currentStep
                      ? "bg-gradient-to-r from-rose-600 to-pink-600 shadow-md"
                      : "bg-slate-800"
                  }`}
                />
              ))}
            </div>

            {/* STEP 1: AD CATEGORY, ESCORT STAGE NAME & LOCATION */}
            {currentStep === 1 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Select Ad Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:border-rose-500 focus:outline-none"
                  >
                    {Array.from(
                      new Set([
                        "VIP Escorts",
                        "Call Girls",
                        "Independent Girls",
                        "Russian Escorts",
                        "Massages",
                        "Male Escorts",
                        "Transsexual",
                        "Adult Meetings",
                        ...(getHomePageCmsConfig()?.categories?.categories || []).map((c) => c.label),
                      ])
                    ).map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CATCHY AD TITLE HEADLINE (FULL LINE) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block flex items-center justify-between">
                    <span>Ad Catchy Title / Listing Headline *</span>
                    <span className="text-[10px] text-slate-400 font-normal">Displayed as main bold title on escort listings</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ✳️ Call Ritika 63671-57118 Only Cash ✳️ Genuine High Profile Jaipur Escorts Services 100% Safe"
                    value={formData.adTitle}
                    onChange={(e) => setFormData({ ...formData, adTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:border-rose-500 focus:outline-none placeholder:text-slate-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Escort Companion Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ritika Sharma, Ananya"
                      value={formData.tagline ? formData.tagline.split("•")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Escort Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 23"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 22 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* DYNAMIC LOCATION (SELECT CITY -> SELECT AREA) */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 block mb-1">Select City *</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => {
                          const cName = e.target.value;
                          setSelectedCity(cName);
                          setSelectedArea("");
                          const full = cName ? cName : formData.cityArea;
                          setFormData({ ...formData, cityArea: full });
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                      >
                        <option value="">-- Choose City --</option>
                        {(() => {
                          const defaultList = [
                            { name: "Jaipur", tier: "Tier 2" },
                            { name: "Delhi", tier: "Tier 1" },
                            { name: "Mumbai", tier: "Tier 1" },
                            { name: "Bangalore", tier: "Tier 1" },
                            { name: "Goa", tier: "Tier 2" },
                            { name: "Pune", tier: "Tier 2" },
                            { name: "Udaipur", tier: "Tier 2" },
                            { name: "Ajmer", tier: "Tier 2" },
                          ];
                          const treeCities = locationTree.flatMap((st) => st.cities || []);
                          const allRaw = [...dbCities, ...treeCities, ...defaultList];
                          const uniqueMap = new Map(allRaw.map((c) => [c.name, c]));
                          return Array.from(uniqueMap.values()).map((ct: any) => (
                            <option key={ct._id || ct.name} value={ct.name}>
                              {ct.name} ({ct.tier || "City"})
                            </option>
                          ));
                        })()}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-400 block mb-1">Select Area / Locality</label>
                      <select
                        value={selectedArea}
                        onChange={(e) => {
                          const aName = e.target.value;
                          setSelectedArea(aName);
                          const full = selectedCity ? (aName ? `${selectedCity} (${aName})` : selectedCity) : aName;
                          setFormData({ ...formData, cityArea: full });
                        }}
                        disabled={!selectedCity}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500/50 cursor-pointer disabled:opacity-40"
                      >
                        <option value="">-- Choose Area (Optional) --</option>
                        {(() => {
                          const defaultAreasMap: Record<string, string[]> = {
                            Jaipur: ["Bani Park", "Malviya Nagar", "C-Scheme", "Mansarovar", "Vaishali Nagar"],
                            Delhi: ["Connaught Place", "South Extension", "Vasant Kunj", "Rohini"],
                            Mumbai: ["Bandra West", "Juhu", "Andheri West", "Powai"],
                            Bangalore: ["Koramangala", "Indiranagar", "Whitefield"],
                            Goa: ["Calangute", "Baga", "Panjim"],
                            Pune: ["Koregaon Park", "Viman Nagar"],
                            Udaipur: ["Fateh Sagar", "Sukher"],
                            Ajmer: ["Pushkar Road", "Vaishali Nagar"],
                          };
                          const treeCity = locationTree.flatMap((st) => st.cities || []).find((c: any) => c.name === selectedCity);
                          const dbCity = dbCities.find((c: any) => c.name === selectedCity);
                          const liveAreas = (treeCity?.areas || dbCity?.areas || []).map((a: any) => typeof a === "string" ? { name: a } : a);
                          const defaultAreaObjs = (defaultAreasMap[selectedCity] || []).map((name) => ({ name }));
                          const combined = [...liveAreas, ...defaultAreaObjs];
                          const uniqueMap = new Map(combined.map((a) => [a.name, a]));

                          return Array.from(uniqueMap.values()).map((ar: any) => (
                            <option key={ar._id || ar.name} value={ar.name}>
                              {ar.name} {ar.pincode ? `(${ar.pincode})` : ""}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Final Location Tag (Auto-generated or custom)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaipur (Bani Park), Delhi (CP), Mumbai (Bandra)"
                      value={formData.cityArea}
                      onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-rose-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.adTitle || !formData.cityArea) {
                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          icon: "warning",
                          title: "Please enter Stage Name and Location",
                          showConfirmButton: false,
                          timer: 2000,
                          background: "#0B1437",
                          color: "#ffffff",
                        });
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 font-bold text-white text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRICE, OFFERS & DESCRIPTION */}
            {currentStep === 2 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    City & Delivery Location / Area *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur / All India Free Delivery"
                    value={formData.cityArea}
                    onChange={(e) => setFormData({ ...formData, cityArea: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Product Price / Service Rate *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹1,499 / pack or ₹5,000 / hr"
                      value={formData.priceRate}
                      onChange={(e) => setFormData({ ...formData, priceRate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Special Offer / Discount Info
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Buy 1 Get 1 Free • Free COD"
                      value={formData.offerDiscount}
                      onChange={(e) => setFormData({ ...formData, offerDiscount: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Product / Service Description & Highlights *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe product benefits, ingredients, usage instructions, or service highlights..."
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 font-bold text-white text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & 5 GALLERY PHOTOS UPLOAD */}
            {currentStep === 3 && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Direct Phone (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => {
                        const numericVal = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                        setFormData({
                          ...formData,
                          phone: numericVal,
                          whatsapp: formData.whatsapp || numericVal,
                          telegram: formData.telegram || numericVal,
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      WhatsApp Number
                    </label>
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
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                      Telegram Username / No.
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      placeholder="e.g. @username or 10-digit number"
                      value={formData.telegram}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (/^\d+$/.test(val) && val.length > 10) {
                          val = val.slice(0, 10);
                        }
                        setFormData({ ...formData, telegram: val });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                    />
                  </div>
                </div>

                {/* AD MAIN COVER PHOTO UPLOAD */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                    📷 Main Profile Cover Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${formData.photoUrl}')` }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        placeholder="Image URL or upload file below"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                      <label className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition">
                        <Upload className="h-4 w-4" /> Upload Main Cover Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 5 GALLERY PHOTOS UPLOAD SECTION */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                      🖼️ Upload Up To 5 Gallery Photos
                    </label>
                    
                    {/* BATCH 5 PHOTO SELECTOR BUTTON */}
                    <label className="px-3 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition shadow w-fit">
                      <Upload className="h-3.5 w-3.5" /> 📸 Select 5 Photos At Once
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []).slice(0, 5);
                          if (files.length === 0) return;

                          const newPhotoUrls: string[] = [];
                          let processedCount = 0;

                          files.forEach((file, idx) => {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const url = ev.target?.result as string;
                              if (url) {
                                newPhotoUrls[idx] = url;
                              }
                              processedCount++;
                              if (processedCount === files.length) {
                                setFormData((prev) => ({
                                  ...prev,
                                  galleryPhotos: newPhotoUrls.filter(Boolean),
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((slotIdx) => {
                      const photoUrl = (formData.galleryPhotos || [])[slotIdx];
                      return (
                        <div
                          key={slotIdx}
                          className="h-20 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-slate-500 hover:border-rose-500/50 transition group"
                        >
                          {photoUrl ? (
                            <>
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${photoUrl}')` }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (formData.galleryPhotos || []).filter((_: string, i: number) => i !== slotIdx);
                                  setFormData({ ...formData, galleryPhotos: updated });
                                }}
                                className="absolute top-1 right-1 h-5 w-5 bg-rose-600 rounded-full text-white text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <label className="inset-0 absolute flex flex-col items-center justify-center cursor-pointer p-1 text-center">
                              <Camera className="h-4 w-4 text-slate-400 mb-0.5" />
                              <span className="text-[9px] font-bold text-slate-400">+ Add #{slotIdx + 1}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const resultUrl = ev.target?.result as string;
                                    if (resultUrl) {
                                      const currentList = [...(formData.galleryPhotos || [])];
                                      currentList[slotIdx] = resultUrl;
                                      setFormData({ ...formData, galleryPhotos: currentList.filter(Boolean) });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.phone) {
                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          icon: "warning",
                          title: "Please enter direct phone number",
                          showConfirmButton: false,
                          timer: 2000,
                          background: "#0B1437",
                          color: "#ffffff",
                        });
                        return;
                      }
                      setCurrentStep(4);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 font-bold text-white text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PLACEMENT PACKAGE & SUPER ADMIN UPI PAYMENT */}
            {currentStep === 4 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs sm:text-sm">
                
                {/* PACKAGE SELECTION (5 TIERS: FREE TO VIP HOMEPAGE) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                    Choose Ad Placement & Promotion Package
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "SUPER_TOP", title: "⚡ SUPER TOP BOOSTER", price: 6999, desc: "#1 Rank At Very Top Of All Listings ⚡" },
                      { id: "VIP_HOMEPAGE", title: "VIP Homepage + /vip Page", price: 4999, desc: "BOTH Homepage VIP + /vip 🔥" },
                      { id: "VIP_PAGE", title: "VIP Page Feature", price: 3499, desc: "Dedicated /vip Page 👑" },
                      { id: "VERIFIED", title: "Verified Escort Package", price: 2499, desc: "Homepage Verified + Badge ✅" },
                      { id: "HOMEPAGE_STANDARD", title: "Homepage Standard", price: 999, desc: "Homepage Escorts List" },
                      { id: "FREE_STANDARD", title: "Free Standard Listing", price: 0, desc: "Directory Only" },
                    ].map((pkg) => {
                      const isSelected = formData.price === pkg.price;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              packageType: pkg.id as any,
                              price: pkg.price,
                            })
                          }
                          className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-rose-500/20 border-rose-500 text-white font-bold ring-1 ring-rose-500 scale-[1.02]"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <div className="text-[11px] font-bold leading-tight">{pkg.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{pkg.desc}</div>
                          <div className={`font-black text-sm mt-1.5 ${pkg.price === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {pkg.price === 0 ? "FREE (₹0)" : `₹${pkg.price.toLocaleString("en-IN")}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SUPER ADMIN QR PAYMENT BOX */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                      <QrCode className="h-4 w-4 text-rose-400" /> {formData.price === 0 ? "Free Listing Selected" : "Dynamic UPI Payment QR Code"}
                    </span>
                    <span className={`font-black text-base ${formData.price === 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {formData.price === 0 ? "₹0 FREE" : `₹${formData.price.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  {/* DYNAMIC QR CODE DISPLAY OR FREE NOTICE */}
                  {formData.price > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 border-2 border-rose-500/40 relative group">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            `upi://pay?pa=${superAdminUpiId}&pn=Skokka%20Ad%20Payment&am=${formData.price}&cu=INR`
                          )}`}
                          alt={`UPI QR for ₹${formData.price}`}
                          className="w-36 h-36 object-contain"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                          ₹{formData.price.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="space-y-2 text-center sm:text-left flex-1">
                        <div className="space-y-1">
                          <strong className="text-xs font-bold text-white block">
                            Scan to Pay ₹{formData.price.toLocaleString("en-IN")}
                          </strong>
                          <p className="text-[11px] text-slate-400">
                            Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI App.
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
                                title: "UPI ID Copied to Clipboard!",
                                showConfirmButton: false,
                                timer: 1500,
                                background: "#0B1437",
                                color: "#ffffff",
                              });
                            }}
                            className="text-[10px] font-bold text-rose-400 hover:underline cursor-pointer"
                          >
                            Copy UPI
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1" />
                      <p>₹0 Free Standard Listing Selected! No Payment Required.</p>
                    </div>
                  )}

                  {/* UTR INPUT (OPTIONAL FOR FREE) */}
                  {formData.price > 0 && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Enter 12-Digit UPI Payment UTR Transaction ID *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 324156789012"
                        value={formData.utrTransactionId}
                        onChange={(e) => setFormData({ ...formData, utrTransactionId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-2 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 font-extrabold text-white text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{formData.price === 0 ? "Publish Free Ad Now 🚀" : "Complete Payment & Publish Ad Now"}</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}

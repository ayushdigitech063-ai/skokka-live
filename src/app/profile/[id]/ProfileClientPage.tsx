"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Check,
  Star,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  Send,
  AlertTriangle,
  Globe,
  Sparkles,
  Building2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Crown,
  Tag,
  UserCheck,
  SendHorizontal
} from "lucide-react";
import Swal from "sweetalert2";
import { fetchEscortById, fetchEscortProfiles, ESCORTS_UPDATE_EVENT, EscortProfileItem } from "@/utils/escortsStore";
import { getHomePageCmsConfig, fetchHomePageCmsConfigAsync, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";
import { getProfileUrl, slugifyPath } from "@/lib/seo/seoEngine";

export default function ProfileClientPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const rawId = resolvedParams?.id ? String(resolvedParams.id) : "";

  const [profile, setProfile] = useState<EscortProfileItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [similarProfilesList, setSimilarProfilesList] = useState<EscortProfileItem[]>([]);
  const [cmsConfig, setCmsConfig] = useState<HomePageCmsConfig | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("Hello, I'd like to book an appointment with you.");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCmsConfig(getHomePageCmsConfig());
      fetchHomePageCmsConfigAsync().then(setCmsConfig);
      setLoading(true);

      const loadProfile = async () => {
        let found = await fetchEscortById(rawId);
        if (!found) {
          const allProfiles = await fetchEscortProfiles();
          const cleanId = rawId.toLowerCase();
          found = allProfiles.find(
            (p) =>
              (p.id && p.id.toLowerCase() === cleanId) ||
              (p.skId && p.skId.toLowerCase() === cleanId) ||
              getProfileUrl(p).toLowerCase().includes(cleanId)
          ) || null;
        }
        setProfile(found);
        setLoading(false);
      };

      loadProfile();

      fetchEscortProfiles().then(setSimilarProfilesList);

      const handleUpdate = () => {
        setCmsConfig(getHomePageCmsConfig());
        loadProfile();
        fetchEscortProfiles().then(setSimilarProfilesList);
      };

      window.addEventListener(ESCORTS_UPDATE_EVENT, handleUpdate);
      window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.addEventListener("storage", handleUpdate);

      return () => {
        window.removeEventListener(ESCORTS_UPDATE_EVENT, handleUpdate);
        window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      };
    }
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex flex-col justify-between">
        <HeaderNavbar />
        <div className="pt-32 pb-16 text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-semibold">Loading Profile Details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050B1F] text-slate-100 flex flex-col justify-between">
        <HeaderNavbar />
        <div className="pt-32 pb-16 text-center space-y-4 max-w-md mx-auto px-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <UserCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-white">Profile Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested escort profile could not be found or may have expired.
          </p>
          <Link
            href="/escorts"
            className="inline-block px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg hover:from-rose-500 hover:to-pink-500 transition"
          >
            Explore Available Escorts
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const profileData: EscortProfileItem = profile;
  const currentGallery = profileData.gallery && profileData.gallery.length > 0 ? profileData.gallery : [profileData.photoUrl].filter(Boolean);

  const handleToggleBookmark = () => {
    setIsSaved(!isSaved);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: isSaved ? "Removed from Favorites" : "Saved to Favorites ❤️",
      showConfirmButton: false,
      timer: 1500,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile link copied to clipboard! 📋",
        showConfirmButton: false,
        timer: 2000,
        background: "#0B1437",
        color: "#ffffff",
      });
    }
  };

  const handleBookNowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone) {
      Swal.fire({ title: "Phone Required", text: "Please enter your phone number to proceed.", icon: "warning", background: "#0B1437", color: "#fff" });
      return;
    }
    const cleanWhatsApp = (profileData.whatsapp || profileData.phone || "919876543210").replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(`Hi ${profileData.name}, I am ${contactName || "a client"} (${contactPhone}). ${contactMessage}`);
    window.open(`https://wa.me/${cleanWhatsApp.startsWith("91") ? cleanWhatsApp : "91" + cleanWhatsApp}?text=${encodedText}`, "_blank");
  };

  const cleanPhone = (profileData.phone || "").replace(/\s+/g, "");
  const cleanWhatsApp = (profileData.whatsapp || profileData.phone || "").replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 font-sans selection:bg-rose-500/30">
      <HeaderNavbar />

      <div className="pt-28 lg:pt-32 pb-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumb Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/escorts" className="hover:text-white transition">Escorts</Link>
            <span>/</span>
            <Link href={`/escorts?city=${profileData.city}`} className="hover:text-rose-400 transition">{profileData.city}</Link>
            <span>/</span>
            <span className="text-rose-400 font-bold">{profileData.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Gallery & Main Image */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
                <img
                  src={currentGallery[activePhoto] || profileData.photoUrl}
                  alt={profileData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {profileData.isVip ? (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full border border-amber-300 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                    <Crown className="h-4 w-4 fill-slate-950 text-slate-950" /> VIP FEATURED ⭐
                  </div>
                ) : profileData.isVerified ? (
                  <div className="absolute top-4 left-4 bg-emerald-500/90 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-emerald-400 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> 100% VERIFIED MODEL
                  </div>
                ) : null}

                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-400/40 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {profileData.rating || 4.9} / 5.0
                </div>
              </div>

              {/* Thumbnails Row */}
              {currentGallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {currentGallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(idx)}
                      className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        activePhoto === idx ? "border-rose-500 scale-95 shadow-md shadow-rose-500/30" : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* About & Description Box */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-4 shadow-xl">
                <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="h-5 w-5 text-rose-400" /> About {profileData.name}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                  {profileData.description || profileData.title}
                </p>

                {profileData.tags && profileData.tags.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {profileData.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 flex items-center gap-1">
                        <Tag className="h-3 w-3 text-rose-400" /> #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Listing Details & Contact Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Header Box */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 font-extrabold text-xs border border-rose-500/30 uppercase tracking-wider">
                    {profileData.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleBookmark}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition cursor-pointer"
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                    <button
                      onClick={handleShareProfile}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {profileData.name} <span className="text-slate-400 text-xl font-normal">({profileData.age || 23} yrs)</span>
                  </h1>
                  <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <MapPin className="h-4 w-4 shrink-0" /> {profileData.location || profileData.city}
                  </p>
                </div>

                {profileData.title && (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                    "{profileData.title}"
                  </p>
                )}

                {/* FULL SPECIFICATIONS TABLE (All details entered during creation) */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pb-1">
                    Listing Specifications
                  </h2>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Stage Name</span>
                      <strong className="text-white font-extrabold">{profileData.name}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                      <strong className="text-rose-400 font-extrabold">{profileData.category}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Age</span>
                      <strong className="text-white font-extrabold">{profileData.age || 23} Years</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">City / Location</span>
                      <strong className="text-white font-extrabold">{profileData.location || profileData.city}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 col-span-2">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Incall Rate</span>
                      <strong className="text-amber-400 text-sm font-black">{profileData.rate || "₹6,000 / hr"}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 col-span-2 flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">Placement Package</span>
                      <span className="text-rose-400 font-extrabold uppercase">
                        {profileData.packageType || (profileData.isVip ? "VIP Featured ⭐" : profileData.isVerified ? "Verified Package 🛡️" : "Free Standard")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: Call, WhatsApp & Telegram */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 shadow-md transition text-center"
                  >
                    <Phone className="h-4 w-4 text-emerald-400" /> Call Direct
                  </a>
                  <a
                    href={`https://wa.me/${cleanWhatsApp.startsWith("91") ? cleanWhatsApp : "91" + cleanWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition text-center"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" /> WhatsApp
                  </a>
                  {profileData.telegram && (
                    <a
                      href={profileData.telegram.startsWith("http") ? profileData.telegram : `https://t.me/${profileData.telegram.replace("@", "").replace(/[^a-zA-Z0-9_]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition text-center"
                    >
                      <SendHorizontal className="h-4 w-4 text-white" /> Telegram
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Appointment Form */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 space-y-4 shadow-xl">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-rose-400" /> Send Appointment Inquiry
                </h2>

                <form onSubmit={handleBookNowSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Your Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold block mb-1">Message / Requirements</label>
                    <textarea
                      rows={2}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <SendHorizontal className="h-4 w-4" /> Send Inquiry via WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* SECTION 1: SIMILAR ESCORTS IN THIS LOCATION */}
          <div className="pt-10 border-t border-slate-800/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-rose-400" />
                  Similar Escorts in {profileData.city || "this location"}
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Browse other verified companions available for meetings in {profileData.city}
                </p>
              </div>
              <Link
                href={`/escorts?city=${encodeURIComponent(profileData.city)}`}
                className="px-4 py-2 rounded-2xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 transition flex items-center gap-1.5"
              >
                <span>View All {profileData.city} Escorts</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProfilesList
                .filter((p) => p && p.id !== profileData.id && (p.city?.toLowerCase().includes(profileData.city.toLowerCase()) || profileData.city.toLowerCase().includes(p.city?.toLowerCase() || "")))
                .slice(0, 4)
                .map((simProfile) => {
                  const simPhoneClean = (simProfile.whatsapp || simProfile.phone || "").replace(/[^0-9]/g, "");
                  const simWhatsappUrl = simPhoneClean ? `https://wa.me/${simPhoneClean.startsWith("91") ? simPhoneClean : "91" + simPhoneClean}` : "#";

                  return (
                    <div
                      key={simProfile.id}
                      className="group rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] transition duration-300 flex flex-col justify-between"
                    >
                      <Link href={getProfileUrl(simProfile)} className="block relative h-64 w-full overflow-hidden bg-slate-950">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                          style={{
                            backgroundImage: `url('${simProfile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}')`
                          }}
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          {simProfile.isVip ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase border border-amber-300">
                              ⭐ VIP
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] uppercase border border-emerald-400">
                              🛡️ Verified
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-400 font-bold text-[10px] border border-amber-400/40 flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400" /> {simProfile.rating || 4.9}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 pt-10 z-10">
                          <h3 className="text-base font-black text-white group-hover:text-rose-400 transition truncate">
                            {simProfile.name}{simProfile.age > 0 ? `, ${simProfile.age}` : ""}
                          </h3>
                          <p className="text-[11px] font-bold text-rose-300 flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
                            <span>{simProfile.location || simProfile.city}</span>
                          </p>
                        </div>
                      </Link>

                      <div className="p-3 pt-2 grid grid-cols-2 gap-2 z-10">
                        <Link
                          href={getProfileUrl(simProfile)}
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] uppercase tracking-wider text-center border border-slate-700 transition"
                        >
                          📄 Details
                        </Link>
                        <a
                          href={simWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[10px] uppercase tracking-wider text-center shadow-md transition"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* SECTION 2: POPULAR CATEGORIES IN THIS LOCATION */}
          <div className="pt-8 border-t border-slate-800/80 space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Popular Escort Categories in {profileData.city}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Explore companion categories available in {profileData.city}
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {((cmsConfig?.categories?.categories && cmsConfig.categories.categories.length > 0)
                ? cmsConfig.categories.categories
                : [
                    { label: "VIP Escorts", emoji: "👑" },
                    { label: "Call Girls", emoji: "💋" },
                    { label: "Independent Girls", emoji: "👑" },
                    { label: "College Escorts", emoji: "🎓" },
                    { label: "Russian Escorts", emoji: "👱‍♀️" },
                    { label: "Massages", emoji: "💆‍♀️" },
                    { label: "Male Escorts", emoji: "🧔" },
                    { label: "Adult Meetings", emoji: "🍸" },
                  ]
              ).map((catItem, idx) => {
                const label = typeof catItem === "string" ? catItem : catItem.label;
                const emoji = typeof catItem === "object" && catItem.emoji ? catItem.emoji : "✨";
                return (
                  <Link
                    key={label || idx}
                    href={`/escorts/${slugifyPath(profileData.city)}/${slugifyPath(label)}`}
                    className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-rose-600/20 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 text-xs font-extrabold transition shadow-md flex items-center gap-2 group"
                  >
                    <span className="text-rose-400 font-bold group-hover:scale-110 transition">{emoji}</span>
                    <span>{label} in {profileData.city}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: NEARBY AREAS & REGIONS IN THIS LOCATION */}
          <div className="pt-8 border-t border-slate-800/80 space-y-4 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <MapPin className="h-5 w-5 text-rose-400" />
              Nearby Areas &amp; Locations in {profileData.city}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Find verified companions in key neighborhoods &amp; regions across {profileData.city}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {Array.from(
                new Set([
                  ...(similarProfilesList
                    .filter((p) => p && (p.city || p.location || "").toLowerCase().includes((profileData.city || "").toLowerCase()))
                    .map((p) => {
                      const loc = p.location || p.city || "";
                      const match = loc.match(/\(([^)]+)\)/);
                      return match ? match[1].trim() : loc.split(",")[0].trim();
                    })
                    .filter((a) => a && a.toLowerCase() !== (profileData.city || "").toLowerCase() && a.length > 2)),
                  "Bani Park",
                  "Malviya Nagar",
                  "C-Scheme",
                  "Mansarovar",
                  "Vaishali Nagar",
                  "Raja Park",
                  "Tonk Road",
                  "Airport Road",
                  "Sodala",
                  "Civil Lines",
                  "Nirman Nagar",
                  "Jagatpura",
                ])
              )
                .slice(0, 14)
                .map((areaName) => (
                  <Link
                    key={areaName}
                    href={`/escorts/${slugifyPath(profileData.city)}/${slugifyPath(areaName)}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    <span>{areaName}, {profileData.city}</span>
                  </Link>
                ))}
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}

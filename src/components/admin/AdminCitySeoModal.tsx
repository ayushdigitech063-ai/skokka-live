"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Share2,
  MapPin,
  HelpCircle,
  Eye,
  Plus,
  Trash2,
  X,
  Sparkles,
  Check,
  AlertCircle,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Copy,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Swal from "sweetalert2";
import { ICity, ICityFAQ } from "@/types/location";
import { getAuthHeaders } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

interface AdminCitySeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: ICity | null;
  onSaved: () => void;
}

export function AdminCitySeoModal({
  isOpen,
  onClose,
  city,
  onSaved,
}: AdminCitySeoModalProps) {
  const [activeTab, setActiveTab] = useState<"meta" | "social" | "local" | "faqs" | "preview">("meta");
  const [saving, setSaving] = useState(false);

  // Form State
  const [customSlug, setCustomSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [ogImage, setOgImage] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");

  const [microServiceAreas, setMicroServiceAreas] = useState<string[]>([]);
  const [areaInput, setAreaInput] = useState("");

  const [faqs, setFaqs] = useState<ICityFAQ[]>([]);

  // FAQ Accordion preview state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Initialize form when city changes
  useEffect(() => {
    if (city && isOpen) {
      const cityName = city.name || "";
      const stateName = typeof city.stateId === "object" ? city.stateId?.name : "India";

      setCustomSlug(city.customSlug || city.slug || "");
      setMetaTitle(
        city.metaTitle ||
          `${cityName} Escorts - 100% Verified Female Companions | MyCityQueen`
      );
      setMetaDescription(
        city.metaDescription ||
          `Browse verified female escorts & independent companions in ${cityName}, ${stateName}. Genuine photos, phone numbers, and WhatsApp contact. 24/7 incall & outcall meetings.`
      );

      setFocusKeywords(
        city.focusKeywords && city.focusKeywords.length > 0
          ? city.focusKeywords
          : [
              `${cityName.toLowerCase()} escorts`,
              `call girls in ${cityName.toLowerCase()}`,
              `vip escorts ${cityName.toLowerCase()}`,
              `independent models ${cityName.toLowerCase()}`,
            ]
      );
      setKeywordInput("");

      setOgImage(
        city.ogImage || "https://mycityqueen.com/images/hero-sofa-model.png"
      );
      setOgTitle(
        city.ogTitle || `${cityName} Escorts & Independent Companions | MyCityQueen`
      );
      setOgDescription(
        city.ogDescription ||
          `Connect directly with verified independent companions in ${cityName}. 100% selfie-verified profiles available 24/7.`
      );

      // Micro service areas: prefill from existing areas or city.microServiceAreas
      if (city.microServiceAreas && city.microServiceAreas.length > 0) {
        setMicroServiceAreas(city.microServiceAreas);
      } else if (city.areas && city.areas.length > 0) {
        setMicroServiceAreas(city.areas.map((a) => a.name));
      } else {
        setMicroServiceAreas([]);
      }
      setAreaInput("");

      // FAQs
      if (city.faqs && city.faqs.length > 0) {
        setFaqs(city.faqs.map((f) => ({ question: f.question, answer: f.answer })));
      } else {
        setFaqs([
          {
            question: `How to book verified escorts in ${cityName}?`,
            answer: `You can browse 100% verified escort profiles on our directory in ${cityName} and connect directly via WhatsApp or phone call without any advance booking charges.`,
          },
          {
            question: `Are incall and outcall services available in ${cityName}?`,
            answer: `Yes, independent companions and verified call girls provide both incall at luxury 5-star hotels/apartments and outcall doorstep visits across ${cityName}.`,
          },
          {
            question: `What are the payment options for escort service in ${cityName}?`,
            answer: `Payment can be made directly in cash or via secure UPI upon meeting. Always verify the profile selfie-verification badge before scheduling.`,
          },
          {
            question: `Is customer privacy protected in ${cityName}?`,
            answer: `Yes, 100% discreet and private companionship is assured. No client data is logged or shared with third parties.`,
          },
        ]);
      }

      setActiveTab("meta");
    }
  }, [city, isOpen]);

  if (!isOpen || !city) return null;

  const cityName = city.name;
  const effectiveSlug = customSlug.trim() || city.slug || cityName.toLowerCase().replace(/\s+/g, "-");
  const fullPreviewUrl = `https://mycityqueen.com/escorts-service/${effectiveSlug}`;

  // Keyword Helpers
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !focusKeywords.includes(trimmed)) {
      setFocusKeywords([...focusKeywords, trimmed]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setFocusKeywords(focusKeywords.filter((_, i) => i !== index));
  };

  const handleAddPresetKeyword = (kw: string) => {
    if (!focusKeywords.includes(kw)) {
      setFocusKeywords([...focusKeywords, kw]);
    }
  };

  // Micro Service Area Helpers
  const handleAddArea = () => {
    const trimmed = areaInput.trim();
    if (trimmed && !microServiceAreas.includes(trimmed)) {
      setMicroServiceAreas([...microServiceAreas, trimmed]);
      setAreaInput("");
    }
  };

  const handleRemoveArea = (index: number) => {
    setMicroServiceAreas(microServiceAreas.filter((_, i) => i !== index));
  };

  const handleImportHierarchyAreas = () => {
    if (!city.areas || city.areas.length === 0) {
      Swal.fire("Info", "No sub-areas registered under this city yet in hierarchy.", "info");
      return;
    }
    const existingNames = city.areas.map((a) => a.name);
    const combined = Array.from(new Set([...microServiceAreas, ...existingNames]));
    setMicroServiceAreas(combined);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Imported ${existingNames.length} areas from hierarchy!`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // FAQ Helpers
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
    setOpenFaqIndex(faqs.length);
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleLoadDefaultFaqs = () => {
    setFaqs([
      {
        question: `How to book verified escorts in ${cityName}?`,
        answer: `You can browse 100% verified escort profiles on our directory in ${cityName} and connect directly via WhatsApp or phone call without any advance booking charges.`,
      },
      {
        question: `Are incall and outcall services available in ${cityName}?`,
        answer: `Yes, independent companions and verified call girls provide both incall at luxury 5-star hotels/apartments and outcall doorstep visits across ${cityName}.`,
      },
      {
        question: `What are the payment options for escort service in ${cityName}?`,
        answer: `Payment can be made directly in cash or via secure UPI upon meeting. Always verify the profile selfie-verification badge before scheduling.`,
      },
      {
        question: `Is customer privacy protected in ${cityName}?`,
        answer: `Yes, 100% discreet and private companionship is assured. No client data is logged or shared with third parties.`,
      },
    ]);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Recommended FAQs loaded!",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Save Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanFaqs = faqs.filter((f) => f.question.trim() || f.answer.trim());

      const payload = {
        customSlug: customSlug.trim(),
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        focusKeywords,
        ogImage: ogImage.trim(),
        ogTitle: ogTitle.trim(),
        ogDescription: ogDescription.trim(),
        microServiceAreas,
        faqs: cleanFaqs,
      };

      const res = await fetch(`${BACKEND_URL}/locations/cities/${city._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to save SEO settings", "error");
        return;
      }

      Swal.fire({
        title: "SEO Configured Successfully! 🚀",
        text: `Advanced SEO, Social Sharing tags & JSON-LD Schemas have been updated for ${cityName}.`,
        icon: "success",
        confirmButtonColor: "#06B6D4",
      });

      onSaved();
      onClose();
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b1022] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Configure SEO &amp; Social Sharing
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {cityName}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Google Search Meta, Open Graph (WhatsApp/FB/X), Local Micro Areas &amp; Rich FAQs Schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950/80 border-b border-slate-800 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("meta")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "meta"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Search Engine Meta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "social"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Social Sharing (OG / X)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("local")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "local"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Local Ranking ({microServiceAreas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "faqs"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Google FAQs ({faqs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Live Previews 👁️</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ==================================================== */}
          {/* TAB 1: SEARCH ENGINE META */}
          {/* ==================================================== */}
          {activeTab === "meta" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Custom Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    Custom URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomSlug(cityName.toLowerCase().replace(/\s+/g, "-"))}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Reset to default slug
                  </button>
                </div>
                <div className="flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-cyan-500">
                  <span className="px-3 py-2.5 bg-slate-900 text-slate-500 font-mono text-xs select-none border-r border-slate-800">
                    /escorts-service/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder={cityName.toLowerCase().replace(/\s+/g, "-")}
                    className="w-full px-3 py-2.5 bg-transparent text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Target Live URL: <span className="text-cyan-400 font-mono">{fullPreviewUrl}</span>
                </p>
              </div>

              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Meta Title (Google SERP) *
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      metaTitle.length >= 40 && metaTitle.length <= 60
                        ? "text-emerald-400"
                        : metaTitle.length > 60
                        ? "text-amber-400"
                        : "text-slate-400"
                    }`}
                  >
                    {metaTitle.length}/60 characters {metaTitle.length <= 60 ? "(Optimal)" : "(May truncate)"}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={`e.g. ${cityName} Escorts - 100% Verified Female Companions | MyCityQueen`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Meta Description (Search Snippet) *
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      metaDescription.length >= 120 && metaDescription.length <= 160
                        ? "text-emerald-400"
                        : metaDescription.length > 160
                        ? "text-amber-400"
                        : "text-slate-400"
                    }`}
                  >
                    {metaDescription.length}/160 characters {metaDescription.length <= 160 ? "(Optimal)" : "(May truncate)"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={`e.g. Browse verified independent female escorts & call girls in ${cityName}. Genuine photos, direct contact, 24/7 incall & outcall meetings.`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* Focus Keywords */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                  Focus Keywords &amp; Search Queries
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder={`e.g. ${cityName.toLowerCase()} escorts, call girls in ${cityName.toLowerCase()}`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>

                {/* Keyword Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {focusKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-medium"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="text-cyan-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Presets suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] text-slate-400">
                  <span>Quick Add:</span>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`${cityName.toLowerCase()} escorts`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50"
                  >
                    + {cityName} Escorts
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`call girls in ${cityName.toLowerCase()}`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50"
                  >
                    + Call Girls {cityName}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`vip russian escorts in ${cityName.toLowerCase()}`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50"
                  >
                    + Russian Escorts {cityName}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`independent models ${cityName.toLowerCase()}`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50"
                  >
                    + Independent Models {cityName}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: SOCIAL SHARING (WHATSAPP, FACEBOOK, X) */}
          {/* ==================================================== */}
          {activeTab === "social" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3">
                <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200 leading-relaxed">
                  These Open Graph (OG) tags control the banner card when users share the City URL on WhatsApp, Facebook, LinkedIn, Telegram, and X (Twitter Large Card).
                </p>
              </div>

              {/* Social Preview Image (Banner Photo) */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                  Social Preview Image (Banner Photo URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://mycityqueen.com/images/hero-sofa-model.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setOgImage("https://mycityqueen.com/images/hero-sofa-model.png")}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Default
                  </button>
                </div>

                {/* Image Preview Box */}
                {ogImage && (
                  <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-44 flex items-center justify-center">
                    <img
                      src={ogImage}
                      alt="Social Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/hero-sofa-model.png";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[10px] text-white font-mono">
                      Recommended: 1200 x 630 px (1.91:1)
                    </div>
                  </div>
                )}
              </div>

              {/* OG Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Social Title (og:title / twitter:title)
                  </label>
                  <button
                    type="button"
                    onClick={() => setOgTitle(metaTitle)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Same as Meta Title
                  </button>
                </div>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder={`e.g. ${cityName} Escorts & Independent Companions`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* OG Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Social Description (og:description / twitter:description)
                  </label>
                  <button
                    type="button"
                    onClick={() => setOgDescription(metaDescription)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Same as Meta Description
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder={`e.g. Browse 100% verified escort companion profiles in ${cityName}. Direct WhatsApp connection without advance payment.`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: LOCAL RANKING (MICRO SERVICE AREAS / PINCODES) */}
          {/* ==================================================== */}
          {activeTab === "local" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Local Micro Service Areas &amp; Geo-Targeting</h4>
                  <p className="text-xs text-purple-200 leading-relaxed">
                    Add prominent colonies, sectors, business districts, and PIN codes. These are automatically injected into Google&apos;s <strong>LocalBusiness Schema (areaServed)</strong> to boost local &quot;near me&quot; ranking!
                  </p>
                </div>
              </div>

              {/* Add Area Tag */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Add Micro Service Colony / Pincode
                  </label>
                  <button
                    type="button"
                    onClick={handleImportHierarchyAreas}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Auto-import from Existing Sub-Areas
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddArea();
                      }
                    }}
                    placeholder={`e.g. Vaishali Nagar, Malviya Nagar, C-Scheme, 302017`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Tag
                  </button>
                </div>

                {/* Area Chips */}
                <div className="flex flex-wrap gap-2 pt-2 min-h-16 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  {microServiceAreas.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-2">
                      No micro service areas added yet. Add colonies or click &quot;Auto-import from Existing Sub-Areas&quot; above.
                    </p>
                  ) : (
                    microServiceAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold"
                      >
                        <MapPin className="h-3 w-3 text-purple-400" />
                        <span>{area}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(idx)}
                          className="text-purple-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: GOOGLE FAQS (RICH SNIPPETS REPEATER) */}
          {/* ==================================================== */}
          {activeTab === "faqs" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">
                      Dynamic Google FAQPage Schema ({faqs.length} Questions)
                    </h4>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      Google parses these Q&amp;As as rich snippets with expandable arrows right below your link on Google search results!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadDefaultFaqs}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Load Template
                  </button>

                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-md shadow-amber-600/20"
                  >
                    <Plus className="h-4 w-4" /> Add FAQ
                  </button>
                </div>
              </div>

              {/* FAQ Repeater List */}
              <div className="space-y-3">
                {faqs.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                    No FAQs added yet. Click &quot;+ Add FAQ&quot; or &quot;Load Template&quot; to populate.
                  </div>
                ) : (
                  faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400">
                          Question #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete this FAQ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 block">Question:</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                          placeholder={`e.g. How to book verified escorts in ${cityName}?`}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 block">Answer:</label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                          placeholder="Provide a clear, helpful answer that answers user intent..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: LIVE SERP & SOCIAL PREVIEWS */}
          {/* ==================================================== */}
          {activeTab === "preview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* GOOGLE SEARCH SNIPPET PREVIEW */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Google Search Results Preview (SERP Card)
                  </h4>
                </div>

                <div className="p-5 rounded-2xl bg-white text-slate-900 font-sans shadow-xl max-w-2xl space-y-2">
                  {/* URL Row */}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="h-4 w-4 rounded-full bg-rose-600 flex items-center justify-center text-[9px] text-white font-bold">
                      Q
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">MyCityQueen</span>
                      <span className="text-slate-400 mx-1">›</span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        escorts-service › {effectiveSlug}
                      </span>
                    </div>
                  </div>

                  {/* Title Link */}
                  <h3 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                    {metaTitle || `${cityName} Escorts - 100% Verified Female Companions`}
                  </h3>

                  {/* Meta description */}
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {metaDescription ||
                      `Browse verified female escorts & independent companions in ${cityName}. Genuine photos, phone numbers, and WhatsApp contact.`}
                  </p>

                  {/* Rich FAQ Snippet Dropdowns preview */}
                  {faqs.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rich FAQs Preview ({faqs.length}):
                      </span>
                      {faqs.slice(0, 3).map((f, i) => (
                        <div key={i} className="text-xs text-[#1a0dab] flex items-center gap-1.5 py-0.5">
                          <span>▾</span>
                          <span className="hover:underline">{f.question || "Frequently Asked Question"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* WHATSAPP / FACEBOOK PREVIEW */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    WhatsApp &amp; Facebook Open Graph Preview
                  </h4>
                </div>

                <div className="max-w-md rounded-2xl overflow-hidden bg-[#0a101d] border border-slate-800 shadow-xl">
                  {ogImage && (
                    <div className="h-48 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={ogImage}
                        alt="Social"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/hero-sofa-model.png";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-1 bg-slate-900/90">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      MYCITYQUEEN.COM
                    </span>
                    <h5 className="text-sm font-bold text-white line-clamp-1">
                      {ogTitle || metaTitle || `${cityName} Escorts`}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ogDescription || metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL FOOTER */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              City: <span className="text-white font-bold">{cityName}</span> • Target Slug:{" "}
              <span className="text-cyan-400 font-mono">{effectiveSlug}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Saving SEO...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Save &amp; Deploy SEO</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

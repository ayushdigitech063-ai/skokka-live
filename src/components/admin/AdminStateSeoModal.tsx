"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Share2,
  Map,
  HelpCircle,
  Eye,
  Plus,
  Trash2,
  X,
  Sparkles,
  Check,
  Info,
  Copy,
  Upload,
  ArrowRightLeft,
  Code2,
} from "lucide-react";
import Swal from "sweetalert2";
import { IState, IStateFAQ } from "@/types/location";
import { getAuthHeaders } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

interface AdminStateSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: IState | null;
  onSaved: () => void;
}

export function AdminStateSeoModal({
  isOpen,
  onClose,
  state,
  onSaved,
}: AdminStateSeoModalProps) {
  const [activeTab, setActiveTab] = useState<"meta" | "indexing" | "schema" | "social" | "local" | "content" | "faqs" | "preview">("meta");
  const [saving, setSaving] = useState(false);

  // Form State
  const [customSlug, setCustomSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [ogImage, setOgImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");

  const [popularDistricts, setPopularDistricts] = useState<string[]>([]);
  const [districtInput, setDistrictInput] = useState("");

  // Technical SEO Controls (Developer Manual Override)
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectType, setRedirectType] = useState<"none" | "301" | "302">("none");

  // Custom Raw Schema (JSON-LD)
  const [customSchema, setCustomSchema] = useState("");
  const [schemaValid, setSchemaValid] = useState<boolean | null>(null);

  const [pageContent, setPageContent] = useState("");
  const [faqs, setFaqs] = useState<IStateFAQ[]>([]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "unset";
      };
    }
  }, [isOpen]);

  // Validate custom schema whenever it changes
  useEffect(() => {
    if (!customSchema.trim()) {
      setSchemaValid(null);
      return;
    }
    try {
      let clean = customSchema.trim();
      if (clean.startsWith("<script") && clean.endsWith("</script>")) {
        clean = clean.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
      }
      JSON.parse(clean);
      setSchemaValid(true);
    } catch {
      setSchemaValid(false);
    }
  }, [customSchema]);

  // Initialize form when state changes
  useEffect(() => {
    if (state && isOpen) {
      const stateName = state.name || "";

      setCustomSlug(state.customSlug || state.slug || "");
      setMetaTitle(
        state.metaTitle ||
          `${stateName} Escorts - 100% Verified Female Companions | MyCityQueen`
      );
      setMetaDescription(
        state.metaDescription ||
          `Browse verified female escorts & independent companions across ${stateName}. Genuine photos, phone numbers, and WhatsApp contact. 24/7 incall & outcall meetings in top cities.`
      );

      setFocusKeywords(
        state.focusKeywords && state.focusKeywords.length > 0
          ? state.focusKeywords
          : [
              `${stateName.toLowerCase()} escorts`,
              `call girls in ${stateName.toLowerCase()}`,
              `vip escorts in ${stateName.toLowerCase()}`,
              `${stateName.toLowerCase()} escort service`,
            ]
      );
      setKeywordInput("");

      setOgImage(
        state.ogImage || "https://mycityqueen.com/images/hero-sofa-model.png"
      );
      setOgTitle(
        state.ogTitle || `${stateName} Escorts & Independent Companions | MyCityQueen`
      );
      setOgDescription(
        state.ogDescription ||
          `Connect directly with verified independent companions across ${stateName}. 100% selfie-verified profiles available 24/7.`
      );

      // Popular districts / major cities
      if (state.popularDistricts && state.popularDistricts.length > 0) {
        setPopularDistricts(state.popularDistricts);
      } else if (state.cities && state.cities.length > 0) {
        setPopularDistricts(state.cities.map((c) => c.name));
      } else {
        setPopularDistricts([]);
      }
      setDistrictInput("");

      // FAQs
      if (state.faqs && state.faqs.length > 0) {
        setFaqs(state.faqs.map((f) => ({ question: f.question, answer: f.answer })));
      } else {
        setFaqs([
          {
            question: `How to book verified escorts in ${stateName}?`,
            answer: `You can browse 100% verified escort profiles across ${stateName} cities on our directory and connect directly via WhatsApp or phone call without any advance booking charges.`,
          },
          {
            question: `Which cities in ${stateName} have escort services available?`,
            answer: `Verified companions and independent models are available in all major tier-1 and tier-2 cities across ${stateName} with both incall and outcall services.`,
          },
          {
            question: `What are the payment options for escort service in ${stateName}?`,
            answer: `Payment can be made directly in cash or via secure UPI upon meeting. Always verify the selfie-verification badge before scheduling.`,
          },
          {
            question: `Is customer privacy protected across ${stateName}?`,
            answer: `Yes, 100% discreet and private companionship is assured. No client data is logged or shared with third parties.`,
          },
        ]);
      }

      setPageContent(state.pageContent || "");

      setActiveTab("meta");
    }
  }, [state, isOpen]);

  if (!isOpen || !state) return null;

  const stateName = state.name;
  const effectiveSlug = customSlug.trim() || state.slug || stateName.toLowerCase().replace(/\s+/g, "-");
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

  // District / City Tag Helpers
  const handleAddDistrict = () => {
    const trimmed = districtInput.trim();
    if (trimmed && !popularDistricts.includes(trimmed)) {
      setPopularDistricts([...popularDistricts, trimmed]);
      setDistrictInput("");
    }
  };

  const handleRemoveDistrict = (index: number) => {
    setPopularDistricts(popularDistricts.filter((_, i) => i !== index));
  };

  // Image Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid Format", "Please select an image file (PNG, JPG, WebP)", "warning");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire("File Too Large", "Image size must be less than 10 MB", "warning");
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) {
        setUploadingImage(false);
        return;
      }

      setOgImage(base64);

      try {
        const res = await fetch(`${BACKEND_URL}/locations/upload-banner`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          setOgImage(data.url);
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "State banner uploaded & optimized (1200x630 WebP)!",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: "Local image preview loaded",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (err) {
        console.warn("Backend state banner upload failed, using local data URL preview:", err);
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleImportHierarchyCities = () => {
    if (!state.cities || state.cities.length === 0) {
      Swal.fire("Info", "No cities registered under this state yet in hierarchy.", "info");
      return;
    }
    const existingNames = state.cities.map((c) => c.name);
    const combined = Array.from(new Set([...popularDistricts, ...existingNames]));
    setPopularDistricts(combined);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Imported ${existingNames.length} cities from hierarchy!`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // FAQ Helpers
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
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
        question: `How to book verified escorts in ${stateName}?`,
        answer: `You can browse 100% verified escort profiles across ${stateName} cities on our directory and connect directly via WhatsApp or phone call without any advance booking charges.`,
      },
      {
        question: `Which cities in ${stateName} have escort services available?`,
        answer: `Verified companions and independent models are available in all major tier-1 and tier-2 cities across ${stateName} with both incall and outcall services.`,
      },
      {
        question: `What are the payment options for escort service in ${stateName}?`,
        answer: `Payment can be made directly in cash or via secure UPI upon meeting. Always verify the selfie-verification badge before scheduling.`,
      },
      {
        question: `Is customer privacy protected across ${stateName}?`,
        answer: `Yes, 100% discreet and private companionship is assured. No client data is logged or shared with third parties.`,
      },
    ]);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Recommended State FAQs loaded!",
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
        popularDistricts,
        pageContent: pageContent.trim(),
        canonicalUrl: canonicalUrl.trim(),
        robots: robots.trim(),
        redirectUrl: redirectUrl.trim(),
        redirectType,
        customSchema: customSchema.trim(),
        faqs: cleanFaqs,
      };

      const res = await fetch(`${BACKEND_URL}/locations/states/${state._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to save state SEO settings", "error");
        return;
      }

      Swal.fire({
        title: "State SEO Configured Successfully! 🚀",
        text: `Advanced SEO, Social Sharing tags & JSON-LD Schemas have been updated for ${stateName}.`,
        icon: "success",
        confirmButtonColor: "#f43f5e",
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
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Configure State SEO &amp; Social Sharing
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {stateName} {state.code ? `(${state.code})` : ""}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                State-Level Google Search Meta, Open Graph (WhatsApp/FB/X), Regional Hubs &amp; FAQPage Schema
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
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Search Engine Meta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("indexing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "indexing"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Canonical &amp; Redirects</span>
            {(canonicalUrl || redirectType !== "none" || robots !== "index, follow") && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schema")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "schema"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>Custom Schema (JSON-LD)</span>
            {customSchema && (
              <span className={`h-1.5 w-1.5 rounded-full ${schemaValid ? "bg-emerald-400" : "bg-rose-400"}`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "social"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
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
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Regional Hubs ({popularDistricts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "content"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Page Content / Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "faqs"
                ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30"
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
          {/* TAB 1: META */}
          {activeTab === "meta" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-rose-400" />
                    Custom State URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomSlug(stateName.toLowerCase().replace(/\s+/g, "-"))}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    Reset to default slug
                  </button>
                </div>
                <div className="flex rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-rose-500">
                  <span className="px-3 py-2.5 bg-slate-900 text-slate-500 font-mono text-xs select-none border-r border-slate-800">
                    /escorts-service/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder={stateName.toLowerCase().replace(/\s+/g, "-")}
                    className="w-full px-3 py-2.5 bg-transparent text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Target Live URL: <span className="text-rose-400 font-mono">{fullPreviewUrl}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    State Meta Title (Google SERP) *
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
                  placeholder={`e.g. ${stateName} Escorts - 100% Verified Female Companions | MyCityQueen`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    State Meta Description (Search Snippet) *
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
                  placeholder={`e.g. Browse verified female escorts & independent companions across ${stateName}. Genuine photos, direct contact, 24/7 incall & outcall meetings.`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                  State Focus Keywords &amp; Search Queries
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
                    placeholder={`e.g. ${stateName.toLowerCase()} escorts, call girls in ${stateName.toLowerCase()}`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {focusKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-medium"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="text-rose-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] text-slate-400">
                  <span>Quick Add:</span>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`${stateName.toLowerCase()} escorts`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-rose-500/50"
                  >
                    + {stateName} Escorts
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`call girls in ${stateName.toLowerCase()}`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-rose-500/50"
                  >
                    + Call Girls {stateName}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetKeyword(`vip escorts ${stateName.toLowerCase()}`)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-rose-500/50"
                  >
                    + VIP Escorts {stateName}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL SHARING */}
          {activeTab === "social" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
                <Info className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-200 leading-relaxed">
                  These Open Graph tags generate rich link preview banners when anyone shares this State URL on WhatsApp, Facebook, LinkedIn, Telegram, and Twitter/X.
                </p>
              </div>

              {/* Social Preview Image (Banner Photo) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                    State Social Preview Image (Banner Photo)
                  </label>
                  <span className="text-[11px] text-rose-400 font-medium">
                    Upload from device or enter URL
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://mycityqueen.com/images/hero-sofa-model.png or Upload file"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />

                  {/* UPLOAD FILE BUTTON */}
                  <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20 shrink-0">
                    {uploadingImage ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setOgImage("https://mycityqueen.com/images/hero-sofa-model.png")}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition shrink-0"
                  >
                    Default
                  </button>
                  {ogImage && (
                    <button
                      type="button"
                      onClick={() => setOgImage("")}
                      className="px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold transition shrink-0"
                      title="Clear image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Image Preview Box */}
                {ogImage ? (
                  <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-48 flex items-center justify-center group">
                    <img
                      src={ogImage}
                      alt="State Social Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/hero-sofa-model.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 shadow-xl transition">
                        <Upload className="h-3.5 w-3.5 text-rose-600" />
                        <span>Change Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setOgImage("")}
                        className="px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-xl flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[10px] text-white font-mono">
                      Recommended: 1200 x 630 px (1.91:1)
                    </div>
                  </div>
                ) : (
                  <label className="mt-2 rounded-2xl border-2 border-dashed border-slate-800 hover:border-rose-500/50 bg-slate-950/40 p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition">
                    <div className="h-10 w-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Click to upload State Banner Photo or enter URL above
                      </p>
                      <p className="text-[11px] text-slate-500">
                        PNG, JPG, WebP up to 10MB (Auto-resized to 1200x630)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    State Social Title (og:title / twitter:title)
                  </label>
                  <button
                    type="button"
                    onClick={() => setOgTitle(metaTitle)}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Same as Meta Title
                  </button>
                </div>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder={`e.g. ${stateName} Escorts & Independent Companions`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    State Social Description (og:description / twitter:description)
                  </label>
                  <button
                    type="button"
                    onClick={() => setOgDescription(metaDescription)}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Same as Meta Description
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder={`e.g. Browse 100% verified escort companion profiles across ${stateName}. Direct WhatsApp connection.`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 3: REGIONAL HUBS */}
          {activeTab === "local" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
                <Map className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Regional Hubs &amp; Major Districts</h4>
                  <p className="text-xs text-purple-200 leading-relaxed">
                    Add top cities and districts for {stateName}. These populate the <strong>LocalBusiness Schema areaServed</strong> array for comprehensive state-wide Google ranking!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Add District / Major City
                  </label>
                  <button
                    type="button"
                    onClick={handleImportHierarchyCities}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Auto-import from Existing Cities
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={districtInput}
                    onChange={(e) => setDistrictInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDistrict();
                      }
                    }}
                    placeholder={`e.g. Jaipur, Jodhpur, Udaipur, Kota`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddDistrict}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 min-h-16 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  {popularDistricts.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-2">
                      No regional hubs added yet. Click &quot;Auto-import from Existing Cities&quot; above.
                    </p>
                  ) : (
                    popularDistricts.map((dst, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold"
                      >
                        <Map className="h-3 w-3 text-purple-400" />
                        <span>{dst}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDistrict(idx)}
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
          {/* TAB: PAGE CONTENT / EDITORIAL GUIDE (CUSTOM & AUTO) */}
          {/* ==================================================== */}
          {activeTab === "content" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    State Editorial Guide &amp; SEO Page Content
                  </h4>
                  <p className="text-xs text-rose-200 leading-relaxed">
                    Aap is box mein custom state verified escorts guide ya unique content likh sakte hain. <strong>Agar aap isko khali (blank) chhod dete hain</strong>, toh website automatic standard safety guide, trust badges, aur booking tips mein <em>{stateName}</em> ka naam dynamic replace karke auto-show karegi!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Custom Editorial Content (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPageContent(
                          `Welcome to the premier verified adult classifieds directory for ${stateName}. Discover 100% genuine independent female companions, VIP models, and high-class call girls offering discretion, privacy, and exceptional hospitality across all top districts and cities in ${stateName}.`
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-rose-300" />
                      Load Default Template
                    </button>
                    {pageContent && (
                      <button
                        type="button"
                        onClick={() => setPageContent("")}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-xs font-bold transition cursor-pointer"
                      >
                        Reset to Auto Dynamic
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder={`Leave blank to auto-generate default dynamic companion guide for ${stateName}...`}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Status:{" "}
                    {pageContent.trim() ? (
                      <strong className="text-emerald-400">Custom Content Active (Overrides Default)</strong>
                    ) : (
                      <strong className="text-rose-400">Auto Dynamic Mode (Auto State Replacement)</strong>
                    )}
                  </span>
                  <span>{pageContent.length} characters</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FAQS */}
          {activeTab === "faqs" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">
                      State Google FAQPage Schema ({faqs.length} Questions)
                    </h4>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      Google Rich Snippets for state searches, enabling expandable Q&amp;A rich results.
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
                          placeholder={`e.g. How to book verified escorts in ${stateName}?`}
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

          {/* TAB 5: PREVIEWS */}
          {activeTab === "preview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-rose-400" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Google Search Results Preview (State SERP Card)
                  </h4>
                </div>

                <div className="p-5 rounded-2xl bg-white text-slate-900 font-sans shadow-xl max-w-2xl space-y-2">
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

                  <h3 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                    {metaTitle || `${stateName} Escorts - 100% Verified Female Companions`}
                  </h3>

                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {metaDescription ||
                      `Browse verified female escorts & independent companions across ${stateName}. Genuine photos, phone numbers, and WhatsApp contact.`}
                  </p>

                  {faqs.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rich State FAQs Preview ({faqs.length}):
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
                        alt="State Social"
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
                      {ogTitle || metaTitle || `${stateName} Escorts`}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ogDescription || metaDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              State: <span className="text-white font-bold">{stateName}</span> • Target Slug:{" "}
              <span className="text-rose-400 font-mono">{effectiveSlug}</span>
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
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Saving State SEO...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Save &amp; Deploy State SEO</span>
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

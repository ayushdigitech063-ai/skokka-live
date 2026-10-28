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
  Code2,
  ArrowRightLeft,
  Image as ImageIcon,
  Copy,
  Info,
  ChevronDown,
  ChevronUp,
  Upload,
} from "lucide-react";
import Swal from "sweetalert2";
import { IArea, IAreaFAQ } from "@/types/location";
import { getAuthHeaders } from "@/lib/auth";
import { RichContentEditor } from "./RichContentEditor";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

interface AdminAreaSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: IArea | null;
  onSaved: () => void;
}

export function AdminAreaSeoModal({
  isOpen,
  onClose,
  area,
  onSaved,
}: AdminAreaSeoModalProps) {
  const [activeTab, setActiveTab] = useState<
    "meta" | "indexing" | "schema" | "content" | "social" | "faqs" | "preview"
  >("meta");
  const [saving, setSaving] = useState(false);

  // Form State
  const [customSlug, setCustomSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeywords, setFocusKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  // Technical SEO Controls (Developer Manual Override)
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectType, setRedirectType] = useState<"none" | "301" | "302">("none");

  // Custom Raw Schema (JSON-LD)
  const [customSchema, setCustomSchema] = useState("");
  const [schemaValid, setSchemaValid] = useState<boolean | null>(null);

  // Social & Visuals
  const [ogImage, setOgImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");

  // Content with Internal Links
  const [pageContent, setPageContent] = useState("");

  // FAQs
  const [faqs, setFaqs] = useState<IAreaFAQ[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Background scroll lock
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
      // Allow raw JSON or JSON wrapped in script tag
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

  // Initialize form when area changes
  useEffect(() => {
    if (area && isOpen) {
      const areaName = area.name || "";
      const cityName = typeof area.cityId === "object" ? area.cityId?.name : "City";

      setCustomSlug(area.customSlug || area.slug || "");
      setMetaTitle(
        area.metaTitle ||
          `${areaName} Escorts - Top Call Girls in ${cityName} | MyCityQueen`
      );
      setMetaDescription(
        area.metaDescription ||
          `Book verified escorts & call girls in ${areaName}, ${cityName}. Direct WhatsApp and phone contact, genuine photos, 24/7 hotel & home service.`
      );

      setFocusKeywords(
        area.focusKeywords && area.focusKeywords.length > 0
          ? area.focusKeywords
          : [
              `${areaName.toLowerCase()} escorts`,
              `call girls in ${areaName.toLowerCase()}`,
              `${cityName.toLowerCase()} escorts in ${areaName.toLowerCase()}`,
            ]
      );
      setKeywordInput("");

      // Technical SEO
      setCanonicalUrl(area.canonicalUrl || "");
      setRobots(area.robots || "index, follow");
      setRedirectUrl(area.redirectUrl || "");
      setRedirectType(area.redirectType || "none");

      // Custom Schema
      setCustomSchema(area.customSchema || "");

      // Social
      setOgImage(area.ogImage || "https://mycityqueen.com/images/hero-sofa-model.png");
      setOgTitle(area.ogTitle || `${areaName} Escorts & Verified Companions`);
      setOgDescription(
        area.ogDescription ||
          `Find the most charming, verified female escorts in ${areaName}, ${cityName}.`
      );

      // Page Content
      setPageContent(area.pageContent || "");

      // FAQs
      if (area.faqs && area.faqs.length > 0) {
        setFaqs(area.faqs.map((f) => ({ question: f.question, answer: f.answer })));
      } else {
        setFaqs([
          {
            question: `How to book verified escorts in ${areaName}, ${cityName}?`,
            answer: `Browse verified profiles on MyCityQueen in ${areaName} and contact directly via WhatsApp or phone call without advance fee.`,
          },
          {
            question: `Are incall and outcall services available in ${areaName}?`,
            answer: `Yes, verified companions provide incall at premium hotels/residences and outcall doorstep service across ${areaName}.`,
          },
        ]);
      }

      setActiveTab("meta");
    }
  }, [area, isOpen]);

  if (!isOpen || !area) return null;

  const areaName = area.name;
  const cityName = typeof area.cityId === "object" ? area.cityId?.name : "city";
  const citySlug = typeof area.cityId === "object" ? area.cityId?.slug : "city";
  const effectiveSlug = customSlug.trim() || area.slug || areaName.toLowerCase().replace(/\s+/g, "-");
  const fullPreviewUrl = `https://mycityqueen.com/escorts-service/${citySlug}/${effectiveSlug}`;

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

  // Image Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid File", "Please select an image file (PNG, JPG, WebP)", "error");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setOgImage(base64Data);

      try {
        const res = await fetch(`${BACKEND_URL}/locations/upload-banner`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            image: base64Data,
            fileName: `area_${effectiveSlug}_og.webp`,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          setOgImage(data.url);
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Banner photo uploaded & optimized!",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (err) {
        console.warn("Banner upload error, using local data URL preview:", err);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
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
        canonicalUrl: canonicalUrl.trim(),
        robots: robots.trim(),
        redirectUrl: redirectUrl.trim(),
        redirectType,
        customSchema: customSchema.trim(),
        ogImage: ogImage.trim(),
        ogTitle: ogTitle.trim(),
        ogDescription: ogDescription.trim(),
        pageContent: pageContent.trim(),
        faqs: cleanFaqs,
      };

      const res = await fetch(`${BACKEND_URL}/locations/areas/${area._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to save Area SEO settings", "error");
        return;
      }

      Swal.fire({
        title: "Area SEO Saved! 🚀",
        text: `Manual SEO settings, Canonical, Meta Robots & Custom Schema saved for ${areaName}.`,
        icon: "success",
        confirmButtonColor: "#A855F7",
      });

      onSaved();
      onClose();
    } catch (err: any) {
      Swal.fire("Network Error", err.message || "Could not connect to backend server", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0b1022] border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Configure Sub-Page / Area SEO
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {areaName} ({cityName})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manual Developer Override: Meta Tags, Canonical URL, Meta Robots, 301 Redirect, Schema &amp; Content
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
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/80 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("meta")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "meta"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Search Meta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("indexing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "indexing"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
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
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
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
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "content"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Page Content &amp; Links</span>
            {pageContent && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "social"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Social Sharing (OG)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "faqs"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>FAQs ({faqs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Live SERP Preview</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: META SETTINGS */}
          {activeTab === "meta" && (
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Custom URL Sub-Slug
                  </label>
                  <span className="text-[11px] text-purple-400 font-mono">
                    /escorts-service/{citySlug}/{effectiveSlug}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={`e.g. ${area.slug || "call-girls"}`}
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Allows matching exact keyword slugs like <code className="text-purple-300">call-girls</code> or specific area slugs.
                </p>
              </div>

              {/* Meta Title */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Page Meta Title (Google SERP) *
                  </label>
                  <span className={`text-[11px] font-bold ${metaTitle.length > 65 ? "text-rose-400" : "text-emerald-400"}`}>
                    {metaTitle.length} / 60-65 chars
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={`e.g. ${areaName} Escorts - Top Call Girls in ${cityName}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              {/* Meta Description */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Page Meta Description *
                  </label>
                  <span className={`text-[11px] font-bold ${metaDescription.length > 160 ? "text-rose-400" : "text-emerald-400"}`}>
                    {metaDescription.length} / 155-160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Compelling SERP description with target keywords and call to action..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Focus Keywords */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Focus Target Keywords
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
                    placeholder={`e.g. ${areaName.toLowerCase()} escorts`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {focusKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-medium"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="hover:text-rose-400 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 font-bold">Quick Keyword Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      `${areaName} escorts`,
                      `call girls in ${areaName}`,
                      `${areaName} call girls`,
                      `independent girls in ${areaName}`,
                      `vip escorts in ${areaName}`,
                      `${areaName} ${cityName} escorts`,
                    ].map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => {
                          if (!focusKeywords.includes(kw)) {
                            setFocusKeywords([...focusKeywords, kw]);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-slate-700 hover:border-purple-500/50 text-[11px] font-bold transition cursor-pointer"
                      >
                        + {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INDEXING & REDIRECTS (DEVELOPER CONTROLS) */}
          {activeTab === "indexing" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
                <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-indigo-300">Manual Developer Controls: </span>
                  Nothing here is forced or automatic. You can set a manual Canonical URL, select exact Meta Robots directives, or configure 301/302 redirects.
                </div>
              </div>

              {/* Canonical URL */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Custom Canonical URL (Rel=&quot;canonical&quot;)
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={`https://mycityqueen.com/escorts-service/${citySlug}/${effectiveSlug}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Leave empty to default to the page URL, or enter a custom canonical if this page consolidates ranking signals elsewhere.
                </p>
              </div>

              {/* Meta Robots */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Meta Robots Tag
                </label>
                <select
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                >
                  <option value="index, follow">index, follow (Default - Index page &amp; follow links)</option>
                  <option value="noindex, follow">noindex, follow (Do not index in Google, follow links)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Complete block from search engine)</option>
                  <option value="index, nofollow">index, nofollow (Index in Google, do not follow links)</option>
                </select>
              </div>

              {/* 301 / 302 Redirect */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    URL Redirect (301 Permanent / 302 Temporary)
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${redirectType !== "none" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-slate-800 text-slate-400"}`}>
                    {redirectType === "none" ? "No Redirect" : `${redirectType} Active`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Redirect Type</label>
                    <select
                      value={redirectType}
                      onChange={(e) => setRedirectType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                    >
                      <option value="none">None (Standard Page)</option>
                      <option value="301">301 - Moved Permanently</option>
                      <option value="302">302 - Found / Temporary</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Target Redirect URL</label>
                    <input
                      type="text"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="e.g. /escorts-service/bangalore or https://mycityqueen.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>
                {redirectType !== "none" && (
                  <p className="text-[11px] text-amber-400/90 font-medium">
                    ⚠️ When enabled, users and search engine bots visiting this sub-page will be redirected immediately to <span className="font-mono text-white">{redirectUrl || "(enter target URL)"}</span> with HTTP status {redirectType}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM SCHEMA (JSON-LD) */}
          {activeTab === "schema" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Code2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-purple-300">Raw JSON-LD Schema: </span>
                    Paste your own custom schema directly. When provided, the system injects this exact script tag into the page header, giving you 100% control over FAQPage, BreadcrumbList, or LocalBusiness structured data.
                  </div>
                </div>

                {customSchema.trim() && (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                      schemaValid
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {schemaValid ? "Valid JSON ✓" : "Invalid JSON ✕"}
                  </span>
                )}
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Paste JSON-LD Schema Script or Object
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const template = {
                          "@context": "https://schema.org",
                          "@type": "Service",
                          name: `${areaName} Escorts Service`,
                          areaServed: {
                            "@type": "AdministrativeArea",
                            name: areaName,
                          },
                          provider: {
                            "@type": "Organization",
                            name: "MyCityQueen",
                            url: "https://mycityqueen.com",
                          },
                          description: metaDescription,
                        };
                        setCustomSchema(JSON.stringify(template, null, 2));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 hover:text-white text-[11px] font-bold transition cursor-pointer"
                    >
                      Insert Service Schema Template
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const faqTemplate = {
                          "@context": "https://schema.org",
                          "@type": "FAQPage",
                          mainEntity: faqs.map((f) => ({
                            "@type": "Question",
                            name: f.question,
                            acceptedAnswer: {
                              "@type": "Answer",
                              text: f.answer,
                            },
                          })),
                        };
                        setCustomSchema(JSON.stringify(faqTemplate, null, 2));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 hover:text-white text-[11px] font-bold transition cursor-pointer"
                    >
                      Sync Current FAQs Schema
                    </button>
                  </div>
                </div>

                <textarea
                  rows={12}
                  value={customSchema}
                  onChange={(e) => setCustomSchema(e.target.value)}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [...]\n}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-200 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PAGE CONTENT & INTERNAL LINKING */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Editorial Content &amp; Internal Linking (HTML)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPageContent(
                          `<h3>Verified Escort Companions & Call Girls in ${areaName}, ${cityName}</h3>\n<p>Looking for top-rated, discreet and verified female companions in <strong>${areaName}</strong>? MyCityQueen connects you with 100% verified independent escort models, VIP companions, and call girls available 24/7 for hotel incall and doorstep outcall meetings in ${areaName}, ${cityName}.</p>\n<h4>Available Services in ${areaName}:</h4>\n<ul>\n  <li><a href="/escorts-service/${citySlug}/${effectiveSlug}" class="text-rose-600 font-bold hover:underline">Call Girls in ${areaName}</a> — 100% authentic independent female companions.</li>\n  <li><a href="/escorts-service/${citySlug}" class="text-rose-600 font-bold hover:underline">${cityName} Escorts</a> — Explore top escorts across the entire city.</li>\n</ul>\n<p>Connect directly via WhatsApp or phone call. Always pay directly upon meeting — zero advance booking charges in ${areaName}.</p>`
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Insert Area Template ({'{area}'} &amp; Links)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleLink = `<p>Explore top-rated <a href="/escorts-service/${citySlug}" class="text-rose-500 hover:underline font-bold">${cityName} escorts</a> and surrounding localities including <a href="/escorts-service/${citySlug}/${effectiveSlug}" class="text-purple-400 font-bold">${areaName} call girls</a> for 24/7 companions.</p>`;
                        setPageContent((prev) => (prev ? prev + "\n" + sampleLink : sampleLink));
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 hover:text-white text-[11px] font-bold transition cursor-pointer"
                    >
                      + Insert Sample Link
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

                <RichContentEditor
                  value={pageContent}
                  onChange={setPageContent}
                  locationName={`${areaName}, ${cityName}`}
                  placeholder={`Write custom SEO guide, headings, categories, or links for ${areaName}, ${cityName}...`}
                  showAreaToken={true}
                  minHeight="280px"
                />
                <p className="text-[11px] text-slate-500">
                  Full HTML is supported: <code className="text-purple-300">&lt;a href=&quot;...&quot;&gt;anchor&lt;/a&gt;</code>, <code className="text-purple-300">&lt;h2&gt;</code>, <code className="text-purple-300">&lt;p&gt;</code>, <code className="text-purple-300">&lt;ul&gt;</code> for complete SEO internal link architecture.
                </p>
              </div>

              {pageContent && (
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                    Live HTML Render Preview:
                  </span>
                  <div
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 prose prose-invert max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SOCIAL SHARING (OG) */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Open Graph Social Image (WhatsApp / Facebook / X Preview)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {ogImage && (
                    <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
                      <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://mycityqueen.com/images/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white text-xs font-bold transition cursor-pointer">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingImage ? "Uploading & Optimizing..." : "Upload Banner Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Open Graph Title
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Open Graph Description
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 6: FAQS */}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-slate-400">
                  Add high-converting frequently asked questions to boost Google SERP rich results.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const recommendedFaqs = [
                        {
                          question: `How can I book verified escorts in ${areaName}?`,
                          answer: `You can browse independent verified call girls and escort agencies in ${areaName}, ${cityName} directly through MyCityQueen. Browse profiles, check real photos, verify contact numbers, and connect via direct WhatsApp or call.`,
                        },
                        {
                          question: `Are independent call girls available in ${areaName}, ${cityName}?`,
                          answer: `Yes, verified independent models, college call girls, and premium high-class VIP escorts provide genuine in-call and out-call hotel services in and around ${areaName}.`,
                        },
                        {
                          question: `What are the average rates for escorts service in ${areaName}?`,
                          answer: `Escort rates in ${areaName} vary based on duration, profile, and service preferences. Check individual profile listings for transparent pricing and direct terms.`,
                        },
                        {
                          question: `Is privacy and discretion guaranteed when booking escorts in ${areaName}?`,
                          answer: `Yes, 100% discretion and confidentiality are prioritized for all clients and verified companion models in ${areaName}, ${cityName}.`,
                        },
                      ];
                      setFaqs(recommendedFaqs);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-purple-500/30"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Load Recommended Area FAQs
                  </button>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
                    <div
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {faq.question || "Untitled Question"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFaq(idx);
                          }}
                          className="p-1 hover:text-rose-400 text-slate-500 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {openFaqIndex === idx ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {openFaqIndex === idx && (
                      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                            placeholder="Enter FAQ Question..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-400 block mb-1">Answer</label>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                            placeholder="Enter detailed answer..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: LIVE SERP PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              {/* Google SERP Snippet */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Google Search Result (SERP Card):
                </span>
                <div className="p-4 rounded-xl bg-white text-slate-900 font-sans space-y-1 shadow-lg max-w-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="h-4 w-4 rounded-full bg-purple-600 text-[10px] text-white flex items-center justify-center font-bold">
                      Q
                    </span>
                    <span className="font-medium truncate">{fullPreviewUrl}</span>
                  </div>
                  <h3 className="text-blue-800 text-base font-semibold hover:underline cursor-pointer leading-snug line-clamp-1">
                    {metaTitle || "Page Meta Title"}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                    {metaDescription || "Page Meta Description..."}
                  </p>
                </div>
              </div>

              {/* Technical Directives Status Card */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Active Directives Summary:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Canonical Tag</span>
                    <p className="font-mono text-purple-300 truncate">{canonicalUrl || fullPreviewUrl}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Robots Directive</span>
                    <p className="font-mono text-emerald-400">{robots}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Redirect Status</span>
                    <p className="font-mono text-amber-300">
                      {redirectType === "none" ? "None (Serving Page Normally)" : `${redirectType} -> ${redirectUrl}`}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Custom Schema</span>
                    <p className="font-mono text-cyan-300">
                      {customSchema.trim() ? (schemaValid ? "Valid JSON-LD Schema Set ✓" : "Invalid JSON Syntax ✕") : "Default Auto Schema"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold uppercase tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{saving ? "Saving Area SEO..." : "Save Area SEO"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

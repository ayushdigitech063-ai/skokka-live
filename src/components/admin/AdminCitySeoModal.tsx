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
  Upload,
  ArrowRightLeft,
  Code2,
} from "lucide-react";
import Swal from "sweetalert2";
import { ICity, ICityFAQ, ICategorySeo } from "@/types/location";
import { getAuthHeaders } from "@/lib/auth";
import { RichContentEditor } from "./RichContentEditor";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

interface AdminCitySeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: ICity | null;
  onSaved: () => void;
}

const TARGET_PAGE_OPTIONS = [
  { slug: "main", label: "🌐 Main City Page (/escorts-service/[city])" },
  { slug: "call-girls", label: "💃 Call Girls (/escorts-service/[city]/call-girls)" },
  { slug: "vip-escorts", label: "👑 VIP Escorts (/escorts-service/[city]/vip-escorts)" },
  { slug: "independent-girls", label: "✨ Independent Girls (/escorts-service/[city]/independent-girls)" },
  { slug: "college-escorts", label: "🎓 College Escorts (/escorts-service/[city]/college-escorts)" },
  { slug: "russian-escorts", label: "🇷🇺 Russian Escorts (/escorts-service/[city]/russian-escorts)" },
  { slug: "massages", label: "💆 Massages (/escorts-service/[city]/massages)" },
  { slug: "adult-meetings", label: "🥂 Adult Meetings (/escorts-service/[city]/adult-meetings)" },
];

export function AdminCitySeoModal({
  isOpen,
  onClose,
  city,
  onSaved,
}: AdminCitySeoModalProps) {
  const [activeTab, setActiveTab] = useState<"meta" | "indexing" | "schema" | "social" | "local" | "content" | "faqs" | "preview">("meta");
  const [saving, setSaving] = useState(false);

  // Target Page Selector: "main" (City) or Category slug (e.g. "call-girls")
  const [selectedTarget, setSelectedTarget] = useState<string>("main");
  const [categorySeoList, setCategorySeoList] = useState<ICategorySeo[]>([]);
  const [mainCityState, setMainCityState] = useState<any>(null);

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

  const [microServiceAreas, setMicroServiceAreas] = useState<string[]>([]);
  const [areaInput, setAreaInput] = useState("");

  // Technical SEO Controls (Developer Manual Override)
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectType, setRedirectType] = useState<"none" | "301" | "302">("none");

  // Custom Raw Schema (JSON-LD)
  const [customSchema, setCustomSchema] = useState("");
  const [schemaValid, setSchemaValid] = useState<boolean | null>(null);

  const [pageContent, setPageContent] = useState("");
  const [faqs, setFaqs] = useState<ICityFAQ[]>([]);

  // FAQ Accordion preview state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Background scroll lock when modal is open
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

      // Page Content / Editorial
      setPageContent(city.pageContent || "");

      // Technical SEO
      setCanonicalUrl(city.canonicalUrl || "");
      setRobots(city.robots || "index, follow");
      setRedirectUrl(city.redirectUrl || "");
      setRedirectType(city.redirectType || "none");
      setCustomSchema(city.customSchema || "");

      setActiveTab("meta");
      setSelectedTarget("main");
      setCategorySeoList(city.categorySeo || []);
      setMainCityState(null);
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
            title: "Banner photo uploaded & optimized (1200x630 WebP)!",
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
        console.warn("Backend banner upload failed, using local data URL preview:", err);
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
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

    // Switch Target Page (Main City vs Call Girls / Categories)
  const handleSwitchTarget = (newTarget: string) => {
    if (newTarget === selectedTarget) return;

    // 1. Snapshot current form data
    const currentFormData = {
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      focusKeywords,
      canonicalUrl: canonicalUrl.trim(),
      robots: robots.trim(),
      redirectUrl: redirectUrl.trim(),
      redirectType,
      customSchema: customSchema.trim(),
      pageContent: pageContent.trim(),
      faqs: faqs.filter((f) => f.question.trim() || f.answer.trim()),
    };

    let updatedCatList = [...categorySeoList];

    if (selectedTarget === "main") {
      setMainCityState({
        ...currentFormData,
        customSlug,
        ogImage,
        ogTitle,
        ogDescription,
        microServiceAreas,
      });
    } else {
      const idx = updatedCatList.findIndex((c) => c.categorySlug === selectedTarget);
      const catEntry: ICategorySeo = {
        categorySlug: selectedTarget,
        ...currentFormData,
      };
      if (idx >= 0) {
        updatedCatList[idx] = catEntry;
      } else {
        updatedCatList.push(catEntry);
      }
      setCategorySeoList(updatedCatList);
    }

    // 2. Load data for newTarget
    setSelectedTarget(newTarget);

    if (newTarget === "main") {
      const src = mainCityState || {
        metaTitle: city?.metaTitle || "",
        metaDescription: city?.metaDescription || "",
        focusKeywords: city?.focusKeywords || [],
        canonicalUrl: city?.canonicalUrl || "",
        robots: city?.robots || "index, follow",
        redirectUrl: city?.redirectUrl || "",
        redirectType: city?.redirectType || "none",
        customSchema: city?.customSchema || "",
        pageContent: city?.pageContent || "",
        faqs: city?.faqs || [],
      };
      setMetaTitle(src.metaTitle || "");
      setMetaDescription(src.metaDescription || "");
      setFocusKeywords(src.focusKeywords || []);
      setCanonicalUrl(src.canonicalUrl || "");
      setRobots(src.robots || "index, follow");
      setRedirectUrl(src.redirectUrl || "");
      setRedirectType(src.redirectType || "none");
      setCustomSchema(src.customSchema || "");
      setPageContent(src.pageContent || "");
      setFaqs(src.faqs || []);
    } else {
      const existing = updatedCatList.find((c) => c.categorySlug === newTarget);
      if (existing) {
        setMetaTitle(existing.metaTitle || "");
        setMetaDescription(existing.metaDescription || "");
        setFocusKeywords(existing.focusKeywords || []);
        setCanonicalUrl(existing.canonicalUrl || "");
        setRobots(existing.robots || "index, follow");
        setRedirectUrl(existing.redirectUrl || "");
        setRedirectType(existing.redirectType || "none");
        setCustomSchema(existing.customSchema || "");
        setPageContent(existing.pageContent || "");
        setFaqs(existing.faqs || []);
      } else {
        const targetOption = TARGET_PAGE_OPTIONS.find((t) => t.slug === newTarget);
        const catName = targetOption ? targetOption.label.split(" ")[1] : newTarget;
        setMetaTitle(
          newTarget === "call-girls"
            ? `Call Girls in ${cityName} | MyCityQueen India`
            : `${catName} in ${cityName} | MyCityQueen India`
        );
        setMetaDescription(
          newTarget === "call-girls"
            ? `Browse verified call girls profiles in ${cityName} with authentic photos and contact details. Premium high-class VIP independent companions available 24/7.`
            : `Browse verified ${catName} companion profiles in ${cityName} with authentic photos and contact details. Available 24/7.`
        );
        setFocusKeywords([
          `${newTarget.replace(/-/g, " ")} in ${cityName.toLowerCase()}`,
          `verified ${newTarget.replace(/-/g, " ")} ${cityName.toLowerCase()}`,
          `${cityName.toLowerCase()} ${newTarget.replace(/-/g, " ")}`,
        ]);
        setCanonicalUrl(`https://mycityqueen.com/escorts-service/${effectiveSlug}/${newTarget}`);
        setRobots("index, follow");
        setRedirectUrl("");
        setRedirectType("none");
        setCustomSchema("");
        setPageContent("");
        setFaqs([
          {
            question: `How to book verified ${newTarget.replace(/-/g, " ")} in ${cityName}?`,
            answer: `You can browse 100% verified ${newTarget.replace(/-/g, " ")} companion profiles on our directory in ${cityName} and connect directly via WhatsApp or phone call.`,
          },
          {
            question: `Are incall and outcall services available in ${cityName}?`,
            answer: `Yes, independent companions provide both incall at luxury 5-star hotels/apartments and outcall doorstep visits across ${cityName}.`,
          },
        ]);
      }
    }
  };

// Save Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Flush active category if currently editing one
      let finalCategorySeo = [...categorySeoList];
      if (selectedTarget !== "main") {
        const catEntry: ICategorySeo = {
          categorySlug: selectedTarget,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          focusKeywords,
          canonicalUrl: canonicalUrl.trim(),
          robots: robots.trim(),
          redirectUrl: redirectUrl.trim(),
          redirectType,
          customSchema: customSchema.trim(),
          pageContent: pageContent.trim(),
          faqs: faqs.filter((f) => f.question.trim() || f.answer.trim()),
        };
        const idx = finalCategorySeo.findIndex((c) => c.categorySlug === selectedTarget);
        if (idx >= 0) finalCategorySeo[idx] = catEntry;
        else finalCategorySeo.push(catEntry);
      }

      const mainData = selectedTarget === "main"
        ? {
            customSlug: customSlug.trim(),
            metaTitle: metaTitle.trim(),
            metaDescription: metaDescription.trim(),
            focusKeywords,
            ogImage: ogImage.trim(),
            ogTitle: ogTitle.trim(),
            ogDescription: ogDescription.trim(),
            microServiceAreas,
            pageContent: pageContent.trim(),
            canonicalUrl: canonicalUrl.trim(),
            robots: robots.trim(),
            redirectUrl: redirectUrl.trim(),
            redirectType,
            customSchema: customSchema.trim(),
            faqs: faqs.filter((f) => f.question.trim() || f.answer.trim()),
          }
        : (mainCityState || {
            customSlug: city.customSlug || "",
            metaTitle: city.metaTitle || "",
            metaDescription: city.metaDescription || "",
            focusKeywords: city.focusKeywords || [],
            ogImage: city.ogImage || "",
            ogTitle: city.ogTitle || "",
            ogDescription: city.ogDescription || "",
            microServiceAreas: city.microServiceAreas || [],
            pageContent: city.pageContent || "",
            canonicalUrl: city.canonicalUrl || "",
            robots: city.robots || "index, follow",
            redirectUrl: city.redirectUrl || "",
            redirectType: city.redirectType || "none",
            customSchema: city.customSchema || "",
            faqs: city.faqs || [],
          });

      const payload = {
        ...mainData,
        categorySeo: finalCategorySeo,
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

        {/* TARGET SELECTOR BAR (CUSTOM TEXT INPUT + QUICK CHIPS) */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Target Page / Sub-Slug:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-cyan-400 transition">
              <span className="text-xs text-slate-500 font-mono select-none">/escorts-service/{effectiveSlug}/</span>
              <input
                type="text"
                value={selectedTarget === "main" ? "" : selectedTarget}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "");
                  handleSwitchTarget(val || "main");
                }}
                placeholder="(main page or write custom e.g. call-girls)"
                className="bg-transparent text-xs font-bold text-cyan-300 placeholder:text-slate-600 focus:outline-none font-mono w-44 sm:w-56"
              />
              {selectedTarget !== "main" && (
                <button
                  type="button"
                  onClick={() => handleSwitchTarget("main")}
                  className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer"
                  title="Reset to Main Page"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Quick:</span>
              {[
                { slug: "main", label: "Main" },
                { slug: "call-girls", label: "call-girls" },
                { slug: "vip-escorts", label: "vip-escorts" },
                { slug: "independent-girls", label: "independent-girls" },
                { slug: "massages", label: "massages" },
              ].map((chip) => (
                <button
                  key={chip.slug}
                  type="button"
                  onClick={() => handleSwitchTarget(chip.slug)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    selectedTarget === chip.slug
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Active Target:</span>
            <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1">
              {selectedTarget === "main" || !selectedTarget
                ? `https://mycityqueen.com/escorts-service/${effectiveSlug}`
                : `https://mycityqueen.com/escorts-service/${effectiveSlug}/${selectedTarget}`}
            </span>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/80 border-b border-slate-800">
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
            onClick={() => setActiveTab("indexing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "indexing"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
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
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
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
            onClick={() => setActiveTab("content")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "content"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
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
                  maxLength={60}
                  onChange={(e) => setMetaTitle(e.target.value.slice(0, 60))}
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
                    {metaDescription.length}/120 characters {metaDescription.length <= 120 ? "(Optimal)" : "(Max limit)"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={metaDescription}
                  maxLength={120}
                  onChange={(e) => setMetaDescription(e.target.value.slice(0, 120))}
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

          {/* TAB: INDEXING & REDIRECTS (DEVELOPER MANUAL CONTROLS) */}
          {activeTab === "indexing" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-cyan-300">Manual Developer Controls: </span>
                  Nothing here is forced or automatic. You have full manual override over Canonical URLs, Meta Robots indexing directives, and 301/302 HTTP redirects.
                </div>
              </div>

              {/* Canonical URL */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Custom Canonical URL (Rel="canonical")
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={`https://mycityqueen.com/escorts-service/${effectiveSlug}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Leave blank to default to page URL, or specify a custom URL if consolidating signals elsewhere.
                </p>
              </div>

              {/* Meta Robots (Custom Editable Input) */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Meta Robots Tag Directive (Custom Editable)
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">HTML &lt;meta name="robots" ...&gt;</span>
                </div>
                <input
                  type="text"
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  placeholder="e.g. index, follow"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Quick Presets:</span>
                  {["index, follow", "noindex, follow", "noindex, nofollow", "index, nofollow"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRobots(val)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition cursor-pointer ${
                        robots === val
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
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
                      placeholder="e.g. /escorts-service/new-city or https://mycityqueen.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
                {redirectType !== "none" && (
                  <p className="text-[11px] text-amber-400/90 font-medium">
                    ⚠️ When enabled, users and search engine bots visiting this city page will be redirected immediately to <span className="font-mono text-white">{redirectUrl || "(enter target URL)"}</span> with HTTP status {redirectType}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: CUSTOM SCHEMA (JSON-LD) */}
          {activeTab === "schema" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Code2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-purple-300">Raw JSON-LD Schema: </span>
                    Paste your own custom schema directly. When provided, the system injects this exact script tag into the page header, overriding any auto-generated schema.
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
                          name: `${cityName} Escorts Service`,
                          areaServed: {
                            "@type": "City",
                            name: cityName,
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
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 hover:text-white text-[11px] font-bold transition cursor-pointer"
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
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 hover:text-white text-[11px] font-bold transition cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-purple-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                />
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
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                    Social Preview Image (Banner Photo)
                  </label>
                  <span className="text-[11px] text-cyan-400 font-medium">
                    Upload from device or enter URL
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://mycityqueen.com/images/hero-sofa-model.png or Upload file"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />

                  {/* UPLOAD FILE BUTTON */}
                  <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/20 shrink-0">
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
                      alt="Social Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/hero-sofa-model.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 shadow-xl transition">
                        <Upload className="h-3.5 w-3.5 text-cyan-600" />
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
                  <label className="mt-2 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition">
                    <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Click to upload Banner Photo or enter URL above
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
          {/* TAB: PAGE CONTENT / EDITORIAL GUIDE (CUSTOM & AUTO) */}
          {/* ==================================================== */}
          {activeTab === "content" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    Custom Editorial Guide &amp; SEO Page Content
                  </h4>
                  <p className="text-xs text-cyan-200 leading-relaxed">
                    Aap is box mein custom verified escorts guide ya unique content likh sakte hain. <strong>Agar aap isko khali (blank) chhod dete hain</strong>, toh website automatic standard safety guide, trust badges, aur booking tips mein <em>{cityName}</em> ka naam dynamic replace karke auto-show karegi!
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
                          `<h3>Verified Escort Companions & Call Girls in {city}</h3>\n<p>Looking for top-rated, discreet and verified female companions in <strong>{city}</strong>? MyCityQueen connects you with 100% selfie-verified independent escort models, VIP companions, and college call girls available 24/7 for private incall and outcall meetings across all prime colonies in {city}.</p>\n<h4>Available Companion Categories in {city}:</h4>\n<ul>\n  <li><a href="/escorts-service/{city}/call-girls">Call Girls in {city}</a> — 100% authentic independent female companions.</li>\n  <li><a href="/escorts-service/{city}/vip-escorts">VIP Escorts in {city}</a> — High-class 5-star hotel luxury rendezvous.</li>\n  <li><a href="/escorts-service/{city}/independent-girls">Independent Girls in {city}</a> — Discreet direct contact without agents.</li>\n  <li><a href="/escorts-service/{city}/massages">Massage Services in {city}</a> — Rejuvenating therapy and full body relaxation.</li>\n</ul>\n<p>Connect directly via WhatsApp or phone call. Always pay directly upon meeting — zero advance booking charges in {city}.</p>`
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                      Insert Dynamic Template ({'{city}'} &amp; Links)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPageContent(
                          `Welcome to the premier verified adult classifieds directory for ${cityName}. Discover 100% genuine independent female companions, VIP models, and high-class call girls offering discretion, privacy, and exceptional hospitality. Connect directly with providers for hotel incall meetings and private doorstep outcalls across top colonies.`
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
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

                <RichContentEditor
                  value={pageContent}
                  onChange={setPageContent}
                  locationName={cityName}
                  placeholder={`Write custom SEO guide, headings, categories, or links for ${cityName}...`}
                  minHeight="280px"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Status:{" "}
                    {pageContent.trim() ? (
                      <strong className="text-emerald-400">Custom Content Active (Overrides Default)</strong>
                    ) : (
                      <strong className="text-cyan-400">Auto Dynamic Mode (Auto City Replacement)</strong>
                    )}
                  </span>
                  <span>{pageContent.length} characters</span>
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

              {/* Technical Directives Status Card */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Active Directives Summary:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Canonical Tag</span>
                    <p className="font-mono text-cyan-300 truncate">{canonicalUrl || fullPreviewUrl}</p>
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
                    <p className="font-mono text-purple-300">
                      {customSchema.trim() ? (schemaValid ? "Valid JSON-LD Schema Set ✓" : "Invalid JSON Syntax ✕") : "Default Auto Schema"}
                    </p>
                  </div>
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

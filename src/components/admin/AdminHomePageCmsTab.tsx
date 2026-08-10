"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  LayoutTemplate,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Crown,
  Grid,
  MapPin,
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Globe,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";
import { HomePageCmsConfig, CityDirectoryCardConfig, CategoryCardConfig } from "../../types/homepageCms";
import {
  getHomePageCmsConfig,
  saveHomePageCmsConfig,
  resetHomePageCmsConfig,
} from "../../utils/homepageCmsStore";

interface AdminHomePageCmsTabProps {
  activeTab?: string;
}

export function AdminHomePageCmsTab({ activeTab = "homepage_cms" }: AdminHomePageCmsTabProps) {
  const [config, setConfig] = useState<HomePageCmsConfig | null>(null);
  const [activeSectionTab, setActiveSectionTab] = useState<
    "hero" | "verified" | "vip" | "categories" | "cities" | "premier" | "footer"
  >("hero");
  const [isSaved, setIsSaved] = useState(false);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please select an image file",
        showConfirmButton: false,
        timer: 2000,
        background: "#0B1437",
        color: "#ffffff",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSuccess(event.target.result as string);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Image Uploaded Successfully!",
          showConfirmButton: false,
          timer: 1800,
          background: "#0B1437",
          color: "#ffffff",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setConfig(getHomePageCmsConfig());
  }, []);

  useEffect(() => {
    if (activeTab.startsWith("cms_")) {
      const section = activeTab.replace("cms_", "") as any;
      if (["hero", "verified", "vip", "categories", "cities", "premier", "footer"].includes(section)) {
        setActiveSectionTab(section);
      }
    }
  }, [activeTab]);

  if (!config) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        Loading Homepage CMS Configuration...
      </div>
    );
  }

  const handleSave = () => {
    saveHomePageCmsConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Homepage & Footer CMS Updated!",
      text: "Changes are live on the main website & footer.",
      showConfirmButton: false,
      timer: 2000,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  const handleReset = () => {
    Swal.fire({
      title: "Reset Homepage to Default?",
      text: "This will restore original section headers, images, titles, and layout settings.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reset All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#334155",
      background: "#0B1437",
      color: "#ffffff",
    }).then((result) => {
      if (result.isConfirmed) {
        const fresh = resetHomePageCmsConfig();
        setConfig(fresh);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "Restored Default Homepage Settings",
          showConfirmButton: false,
          timer: 1800,
          background: "#0B1437",
          color: "#ffffff",
        });
      }
    });
  };

  const sectionTitles: Record<string, string> = {
    hero: "Hero Banner & Model Image Manager",
    verified: "Verified Profiles Section Manager",
    vip: "VIP High-Class Escorts Section Manager",
    categories: "Category Cards & Cover Images Manager",
    cities: "Top Escort Cities Directory Manager",
    premier: "Premier Escort Network Trust Manager",
    footer: "Global Website Footer Settings Manager",
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* TOP CMS HEADER STRIP */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1437] via-slate-900 to-[#121B3B] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5">
              <LayoutTemplate className="h-4 w-4 text-rose-400" /> Super Admin CMS
            </span>
            {isSaved && (
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved & Live!
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {sectionTitles[activeSectionTab] || "Homepage Manager"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Dynamically edit images, titles, subtitles, category covers, and section visibility for live website.
          </p>
        </div>

        {/* CMS ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 font-bold text-xs flex items-center gap-2 border border-slate-700 hover:border-rose-500/30 transition shadow-md"
          >
            <RotateCcw className="h-4 w-4 text-rose-400" /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-[1.02] transition"
          >
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* MAIN TAB CONTENT EDITORS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1437] border border-slate-800 shadow-xl space-y-6">
        
        {/* 1. HERO BANNER & MODEL IMAGE CONFIG */}
        {activeSectionTab === "hero" && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-rose-400" /> Hero Section & Background Model Image
              </h2>
              <p className="text-xs text-slate-400">
                Customize main homepage hero title, background sofa model image, and floating model card details.
              </p>
            </div>

            {/* HERO BACKGROUND MODEL IMAGE PREVIEW & INPUT */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <ImageIcon className="h-4 w-4" /> Hero Background Model Image URL
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="h-24 w-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${config.hero.bgImage || "/images/hero-sofa-model.png"}')` }}
                  />
                </div>
                <div className="flex-1 space-y-2.5 w-full">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.hero.bgImage || ""}
                      onChange={(e) => setConfig({ ...config, hero: { ...config.hero, bgImage: e.target.value } })}
                      placeholder="/images/hero-sofa-model.png or https://..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                    />
                    <label className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition shrink-0 shadow-lg shadow-rose-600/20">
                      <Upload className="h-4 w-4" /> Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) =>
                            setConfig({ ...config, hero: { ...config.hero, bgImage: dataUrl } })
                          )
                        }
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports direct file upload, local relative image paths (e.g. <code className="text-rose-300">/images/hero-sofa-model.png</code>), or any external HTTP photo URL.
                  </p>
                </div>
              </div>
            </div>

            {/* FLOATING MODEL CARD EDIT */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Floating VIP Model Card Details (Hero Right Badge)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Badge Header</label>
                  <input
                    type="text"
                    value={config.hero.floatingModelBadge || ""}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingModelBadge: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Model Name</label>
                  <input
                    type="text"
                    value={config.hero.floatingModelName || ""}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingModelName: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Rate & Booking Info</label>
                  <input
                    type="text"
                    value={config.hero.floatingModelRate || ""}
                    onChange={(e) => setConfig({ ...config, hero: { ...config.hero, floatingModelRate: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* HERO TEXT INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Badge Text</label>
                <input
                  type="text"
                  value={config.hero.badgeText}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, badgeText: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Title Prefix</label>
                <input
                  type="text"
                  value={config.hero.titlePrefix}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, titlePrefix: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">Title Highlight Word</label>
                <input
                  type="text"
                  value={config.hero.titleHighlight}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, titleHighlight: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-300 text-xs sm:text-sm focus:border-rose-500 focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Title Suffix</label>
                <input
                  type="text"
                  value={config.hero.titleSuffix}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, titleSuffix: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={config.hero.subtitle}
                  onChange={(e) => setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* DYNAMIC SEARCH MODAL FILTER OPTIONS MANAGER */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-rose-400" /> Search Modal Dynamic Filters Manager
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add, edit, or remove options for Nationality, Breast, Hair, Body Type, Services, Attention to & Place of Service.
                </p>
              </div>

              {/* 1. NATIONALITY EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">🏳️ Nationality Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.nationalities || [];
                      const updated = [...current, { id: `Custom_${Date.now()}`, label: "New Nationality" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          nationalities: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.nationalities || []).map((nat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={nat.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.nationalities || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              nationalities: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.nationalities || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              nationalities: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. BREAST OPTIONS EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">👙 Breast Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.breasts || [];
                      const updated = [...current, { id: `Option_${Date.now()}`, label: "New Size" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          breasts: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.breasts || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.breasts || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              breasts: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.breasts || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              breasts: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. HAIR OPTIONS EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">👩 Hair Color Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.hairs || [];
                      const updated = [...current, { id: `Hair_${Date.now()}`, label: "New Hair Option" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          hairs: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.hairs || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.hairs || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              hairs: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.hairs || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              hairs: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. BODY TYPE OPTIONS EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">💃 Body Type Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.bodyTypes || [];
                      const updated = [...current, { id: `Body_${Date.now()}`, label: "New Body Type" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          bodyTypes: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.bodyTypes || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.bodyTypes || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              bodyTypes: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.bodyTypes || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              bodyTypes: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. SERVICES OPTIONS EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">💖 Services Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.services || [];
                      const updated = [...current, { id: `Svc_${Date.now()}`, label: "New Service" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          services: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.services || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.services || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              services: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.services || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              services: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. ATTENTION TO OPTIONS EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">👤 Attention To Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.attentionTo || [];
                      const updated = [...current, { id: `Attn_${Date.now()}`, label: "New Target Audience" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          attentionTo: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.attentionTo || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.attentionTo || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              attentionTo: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.attentionTo || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              attentionTo: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. PLACE OF SERVICE OPTIONS EDITOR */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">📍 Place Of Service Options</span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = config.searchModalFilters?.placesOfService || [];
                      const updated = [...current, { id: `Place_${Date.now()}`, label: "New Location Option" }];
                      setConfig({
                        ...config,
                        searchModalFilters: {
                          ...(config.searchModalFilters || {
                            nationalities: [],
                            breasts: [],
                            hairs: [],
                            bodyTypes: [],
                            services: [],
                            attentionTo: [],
                            placesOfService: []
                          }),
                          placesOfService: updated
                        }
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {(config.searchModalFilters?.placesOfService || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...(config.searchModalFilters?.placesOfService || [])];
                          updated[idx] = { ...updated[idx], label: e.target.value, id: e.target.value };
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              placesOfService: updated
                            }
                          });
                        }}
                        className="flex-1 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-white text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (config.searchModalFilters?.placesOfService || []).filter((_, i) => i !== idx);
                          setConfig({
                            ...config,
                            searchModalFilters: {
                              ...config.searchModalFilters!,
                              placesOfService: updated
                            }
                          });
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. VERIFIED PROFILES SECTION CONFIG */}
        {activeSectionTab === "verified" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" /> Verified Profiles Section
                </h2>
                <p className="text-xs text-slate-400">Toggle visibility and customize header for verified profiles grid.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    verifiedProfiles: {
                      ...config.verifiedProfiles,
                      enabled: !config.verifiedProfiles.enabled,
                    },
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  config.verifiedProfiles.enabled
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {config.verifiedProfiles.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {config.verifiedProfiles.enabled ? "Visible on Homepage" : "Hidden from Homepage"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Badge Label</label>
                <input
                  type="text"
                  value={config.verifiedProfiles.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      verifiedProfiles: { ...config.verifiedProfiles, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Heading</label>
                <input
                  type="text"
                  value={config.verifiedProfiles.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      verifiedProfiles: { ...config.verifiedProfiles, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={config.verifiedProfiles.subtitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      verifiedProfiles: { ...config.verifiedProfiles, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. VIP ESCORTS SECTION CONFIG */}
        {activeSectionTab === "vip" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" /> VIP Escorts Section
                </h2>
                <p className="text-xs text-slate-400">Toggle visibility and customize title/subtitle for VIP high-class models section.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    vipEscorts: {
                      ...config.vipEscorts,
                      enabled: !config.vipEscorts.enabled,
                    },
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  config.vipEscorts.enabled
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {config.vipEscorts.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {config.vipEscorts.enabled ? "Visible on Homepage" : "Hidden from Homepage"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Badge Label</label>
                <input
                  type="text"
                  value={config.vipEscorts.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      vipEscorts: { ...config.vipEscorts, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Heading</label>
                <input
                  type="text"
                  value={config.vipEscorts.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      vipEscorts: { ...config.vipEscorts, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={config.vipEscorts.subtitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      vipEscorts: { ...config.vipEscorts, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. CATEGORIES SECTION CONFIG WITH IMAGE EDITING */}
        {activeSectionTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Grid className="h-5 w-5 text-violet-400" /> Category Cards & Cover Images
                </h2>
                <p className="text-xs text-slate-400">Change cover image URLs, category names, emojis, and city tag pills.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    categories: {
                      ...config.categories,
                      enabled: !config.categories.enabled,
                    },
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  config.categories.enabled
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {config.categories.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {config.categories.enabled ? "Visible on Homepage" : "Hidden from Homepage"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Badge</label>
                <input
                  type="text"
                  value={config.categories.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      categories: { ...config.categories, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Heading</label>
                <input
                  type="text"
                  value={config.categories.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      categories: { ...config.categories, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subtitle</label>
                <input
                  type="text"
                  value={config.categories.subtitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      categories: { ...config.categories, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* CATEGORY CARDS LIST WITH IMAGE EDIT & THUMBNAIL PREVIEW */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Categories & Cover Photos ({config.categories.categories.length})</h3>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Add New Category Card 💃",
                      html: `
                        <div class="space-y-4 text-left font-sans">
                          <div>
                            <label class="text-xs font-bold text-slate-300 block mb-1">Category Title / Name *</label>
                            <input id="swal-cat-name" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" placeholder="e.g. Russian Escorts, College Girls, Spa & Massage" />
                          </div>
                          <div>
                            <label class="text-xs font-bold text-slate-300 block mb-1">Emoji Icon</label>
                            <input id="swal-cat-emoji" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" value="💋" placeholder="e.g. 👱‍♀️, 💃, 💋, 👑" />
                          </div>
                          <div>
                            <label class="text-xs font-bold text-slate-300 block mb-1">Cover Image Path / Photo URL *</label>
                            <input id="swal-cat-image" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono text-xs" value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" placeholder="e.g. /images/cat-call-girls.jpg or http://..." />
                          </div>
                          <div>
                            <label class="text-xs font-bold text-slate-300 block mb-1">City Tags (Comma Separated)</label>
                            <input id="swal-cat-cities" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" value="Bangalore, Hyderabad, Delhi, Pune, Mumbai, All cities" placeholder="Bangalore, Hyderabad, Delhi, Pune, Mumbai, All cities" />
                          </div>
                        </div>
                      `,
                      focusConfirm: false,
                      showCancelButton: true,
                      confirmButtonText: "Create Category Now",
                      confirmButtonColor: "#8b5cf6",
                      background: "#0B1437",
                      color: "#ffffff",
                      preConfirm: () => {
                        const name = (document.getElementById("swal-cat-name") as HTMLInputElement)?.value;
                        const emoji = (document.getElementById("swal-cat-emoji") as HTMLInputElement)?.value || "✨";
                        const image = (document.getElementById("swal-cat-image") as HTMLInputElement)?.value || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
                        const rawCities = (document.getElementById("swal-cat-cities") as HTMLInputElement)?.value || "Bangalore, Hyderabad, Delhi, Pune, Mumbai, All cities";

                        if (!name || !name.trim()) {
                          Swal.showValidationMessage("Please enter a category title!");
                          return false;
                        }
                        const cities = rawCities.split(",").map((c) => c.trim()).filter(Boolean);
                        return { name: name.trim(), emoji: emoji.trim(), image: image.trim(), cities };
                      },
                    }).then((result) => {
                      if (result.isConfirmed && result.value) {
                        const newCategory: CategoryCardConfig = {
                          id: `cat_${Date.now()}`,
                          label: result.value.name,
                          emoji: result.value.emoji,
                          image: result.value.image,
                          accent: "from-rose-600 to-pink-600",
                          border: "border-rose-500/40",
                          glow: "shadow-rose-600/20",
                          cities: result.value.cities,
                        };
                        const updatedConfig = {
                          ...config,
                          categories: {
                            ...config.categories,
                            categories: [...config.categories.categories, newCategory],
                          },
                        };
                        setConfig(updatedConfig);
                        saveHomePageCmsConfig(updatedConfig);

                        Swal.fire({
                          toast: true,
                          position: "top-end",
                          icon: "success",
                          title: `Category "${result.value.name}" created with all entries!`,
                          showConfirmButton: false,
                          timer: 2200,
                          background: "#0B1437",
                          color: "#ffffff",
                        });
                      }
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Category Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.categories.categories.map((cat, idx) => (
                  <div key={cat.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Image Thumbnail Preview */}
                      <div className="h-16 w-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${cat.image}')` }}
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-2 flex-1">
                            <input
                              type="text"
                              value={cat.emoji}
                              onChange={(e) => {
                                const updated = [...config.categories.categories];
                                updated[idx] = { ...updated[idx], emoji: e.target.value };
                                setConfig({ ...config, categories: { ...config.categories, categories: updated } });
                              }}
                              className="w-10 text-center py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm"
                            />
                            <input
                              type="text"
                              value={cat.label}
                              onChange={(e) => {
                                const updated = [...config.categories.categories];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setConfig({ ...config, categories: { ...config.categories, categories: updated } });
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = config.categories.categories.filter((_, i) => i !== idx);
                              setConfig({ ...config, categories: { ...config.categories, categories: updated } });
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1 transition"
                            title="Delete Category Card"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image URL Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        Cover Image Path/URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cat.image}
                          onChange={(e) => {
                            const updated = [...config.categories.categories];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setConfig({ ...config, categories: { ...config.categories, categories: updated } });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-rose-500 focus:outline-none"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shrink-0 border border-slate-700">
                          <Upload className="h-3.5 w-3.5 text-rose-400" /> Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (dataUrl) => {
                                const updated = [...config.categories.categories];
                                updated[idx] = { ...updated[idx], image: dataUrl };
                                setConfig({ ...config, categories: { ...config.categories, categories: updated } });
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>

                    {/* Cities Tag Pills */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        City Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={cat.cities.join(", ")}
                        onChange={(e) => {
                          const updated = [...config.categories.categories];
                          updated[idx] = {
                            ...updated[idx],
                            cities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          };
                          setConfig({ ...config, categories: { ...config.categories, categories: updated } });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TOP CITIES DIRECTORY CONFIG */}
        {activeSectionTab === "cities" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-400" /> Top Escort Cities Directory
                </h2>
                <p className="text-xs text-slate-400">Manage dark city cards, highlights, and total listing counts.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    topCities: {
                      ...config.topCities,
                      enabled: !config.topCities.enabled,
                    },
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  config.topCities.enabled
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {config.topCities.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {config.topCities.enabled ? "Visible on Homepage" : "Hidden from Homepage"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Badge Label</label>
                <input
                  type="text"
                  value={config.topCities.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      topCities: { ...config.topCities, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Heading</label>
                <input
                  type="text"
                  value={config.topCities.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      topCities: { ...config.topCities, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subtitle</label>
                <input
                  type="text"
                  value={config.topCities.subtitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      topCities: { ...config.topCities, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* CITIES CARDS GRID EDITOR */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">City Cards ({config.topCities.cities.length})</h3>
                <button
                  type="button"
                  onClick={() => {
                    const newCity: CityDirectoryCardConfig = {
                      name: "New City Escorts",
                      count: "100 Listings",
                      highlight: "POPULAR",
                    };
                    setConfig({
                      ...config,
                      topCities: {
                        ...config.topCities,
                        cities: [...config.topCities.cities, newCity],
                      },
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> Add City Card
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {config.topCities.cities.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 relative group">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="text-[10px] font-black text-rose-400 font-mono">#{idx + 1} Position</span>
                      <div className="flex items-center gap-1">
                        {/* Move to Top */}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.topCities.cities];
                              const [moved] = updated.splice(idx, 1);
                              updated.unshift(moved);
                              setConfig({ ...config, topCities: { ...config.topCities, cities: updated } });
                            }}
                            className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-extrabold text-[10px] flex items-center gap-0.5 border border-rose-500/30 transition"
                            title="Bring this city to Top #1 position on Homepage"
                          >
                            <ArrowUpRight className="h-3 w-3" /> Top #1
                          </button>
                        )}
                        {/* Move Up */}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.topCities.cities];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setConfig({ ...config, topCities: { ...config.topCities, cities: updated } });
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {/* Move Down */}
                        {idx < config.topCities.cities.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.topCities.cities];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setConfig({ ...config, topCities: { ...config.topCities, cities: updated } });
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = config.topCities.cities.filter((_, i) => i !== idx);
                            setConfig({ ...config, topCities: { ...config.topCities, cities: updated } });
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 ml-1"
                          title="Delete City"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => {
                          const updated = [...config.topCities.cities];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setConfig({ ...config, topCities: { ...config.topCities, cities: updated } });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                        placeholder="City Name"
                      />

                      <div>
                        <input
                          type="text"
                          value={c.highlight}
                          onChange={(e) => {
                            const updated = [...config.topCities.cities];
                            updated[idx] = { ...updated[idx], highlight: e.target.value };
                            setConfig({ ...config, topCities: { ...config.topCities, cities: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-rose-300 text-[11px] font-bold uppercase"
                          placeholder="POPULAR / HOT / VIP"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. PREMIER NETWORK ADVANTAGE CONFIG */}
        {activeSectionTab === "premier" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" /> Premier Escort Network Advantage
                </h2>
                <p className="text-xs text-slate-400">Manage footer-level trust stats, satisfaction scores, and benefit headings.</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    premierNetwork: {
                      ...config.premierNetwork,
                      enabled: !config.premierNetwork.enabled,
                    },
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  config.premierNetwork.enabled
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {config.premierNetwork.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {config.premierNetwork.enabled ? "Visible on Homepage" : "Hidden from Homepage"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Badge Label</label>
                <input
                  type="text"
                  value={config.premierNetwork.badge}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      premierNetwork: { ...config.premierNetwork, badge: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Heading</label>
                <input
                  type="text"
                  value={config.premierNetwork.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      premierNetwork: { ...config.premierNetwork, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={config.premierNetwork.subtitle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      premierNetwork: { ...config.premierNetwork, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* STATS STRIP EDITOR */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Trust Statistics Strip</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {config.premierNetwork.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Stat Value
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...config.premierNetwork.stats];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setConfig({ ...config, premierNetwork: { ...config.premierNetwork, stats: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-extrabold text-white text-sm"
                    />

                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">
                      Label Text
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...config.premierNetwork.stats];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setConfig({ ...config, premierNetwork: { ...config.premierNetwork, stats: updated } });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. GLOBAL FOOTER SETTINGS MANAGER (100% DYNAMIC 4 COLUMNS & LINKS) */}
        {activeSectionTab === "footer" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-pink-400" /> Full Dynamic Footer Manager (All 4 Columns & Legal Bar)
                </h2>
                <p className="text-xs text-slate-400">Dynamically add, edit, or delete footer headings, link columns, buttons, contact info, disclaimer & copyright.</p>
              </div>
            </div>

            {/* COLUMN 1: BRAND INFO & TAGLINE */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                1️⃣ Column 1: Brand Info & Tagline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Brand Title</label>
                  <input
                    type="text"
                    value={config.footer?.brandName || "SKOKKA"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, brandName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">SSL Badge Text</label>
                  <input
                    type="text"
                    value={config.footer?.sslBadgeText || "256-Bit SSL Encrypted Channel"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, sslBadgeText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-xs"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Brand Tagline / Description Subtitle</label>
                  <textarea
                    rows={2}
                    value={config.footer?.brandTagline || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, brandTagline: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              {/* BRAND CUSTOM LOGO IMAGE UPLOAD */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">
                  Custom Brand Logo Image URL / Upload (Replaces default text logo on Navbar & Footer)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {config.footer?.brandLogoUrl ? (
                    <img
                      src={config.footer.brandLogoUrl}
                      alt="Brand Logo Preview"
                      className="h-10 px-3 py-1 object-contain bg-slate-950 rounded-xl border border-slate-800"
                    />
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-bold text-xs">
                      Default Text Logo Active ({config.footer?.brandName || "SKOKKA"})
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png or Upload below"
                    value={config.footer?.brandLogoUrl || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, brandLogoUrl: e.target.value },
                      })
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow shrink-0">
                    <Upload className="h-4 w-4" /> Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) =>
                          setConfig({
                            ...config,
                            footer: { ...config.footer, brandLogoUrl: dataUrl },
                          })
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...config,
                        footer: { ...config.footer, brandLogoUrl: "" },
                      };
                      setConfig(updated);
                      saveHomePageCmsConfig(updated);
                      Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Reset to Default Text Logo!",
                        showConfirmButton: false,
                        timer: 1500,
                        background: "#0B1437",
                        color: "#ffffff",
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 border border-slate-700 text-rose-400 hover:text-rose-300 font-bold text-xs shrink-0 flex items-center gap-1.5 transition"
                    title="Remove custom logo image and restore default text logo"
                  >
                    <Trash2 className="h-4 w-4" /> Clear & Reset Logo
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 2: CATEGORY LINKS MANAGER */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-violet-400 uppercase tracking-wider">
                  2️⃣ Column 2: Category Links Column
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newLink = {
                      id: `link_${Date.now()}`,
                      emoji: "⭐",
                      label: "New Custom Link",
                      url: "/escorts",
                    };
                    setConfig({
                      ...config,
                      footer: {
                        ...config.footer,
                        col2Links: [...(config.footer?.col2Links || []), newLink],
                      },
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Link Item
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Column 2 Heading</label>
                <input
                  type="text"
                  value={config.footer?.col2Heading || "EXPLORE CATEGORIES"}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      footer: { ...config.footer, col2Heading: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                />
              </div>

              <div className="space-y-3">
                {(config.footer?.col2Links || []).map((link, idx) => (
                  <div key={link.id || idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      value={link.emoji}
                      onChange={(e) => {
                        const updated = [...(config.footer?.col2Links || [])];
                        updated[idx] = { ...updated[idx], emoji: e.target.value };
                        setConfig({ ...config, footer: { ...config.footer, col2Links: updated } });
                      }}
                      className="w-10 text-center py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Link Text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...(config.footer?.col2Links || [])];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setConfig({ ...config, footer: { ...config.footer, col2Links: updated } });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="URL Path (/escorts)"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...(config.footer?.col2Links || [])];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setConfig({ ...config, footer: { ...config.footer, col2Links: updated } });
                      }}
                      className="w-44 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (config.footer?.col2Links || []).filter((_, i) => i !== idx);
                        setConfig({ ...config, footer: { ...config.footer, col2Links: updated } });
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: HELP & SUPPORT LINKS MANAGER */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider">
                  3️⃣ Column 3: Help & Support Links & Contact Desk
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newLink = {
                      id: `link_${Date.now()}`,
                      emoji: "💬",
                      label: "New Helpline Item",
                      url: "/contact",
                    };
                    setConfig({
                      ...config,
                      footer: {
                        ...config.footer,
                        col3Links: [...(config.footer?.col3Links || []), newLink],
                      },
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Support Link Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Column 3 Heading</label>
                  <input
                    type="text"
                    value={config.footer?.col3Heading || "HELP & SUPPORT"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, col3Heading: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Support Email</label>
                  <input
                    type="text"
                    value={config.footer?.supportEmail || "support@skokka.in"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, supportEmail: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">WhatsApp Number</label>
                  <input
                    type="text"
                    value={config.footer?.whatsappNumber || "+91 98765 00000"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, whatsappNumber: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {(config.footer?.col3Links || []).map((link, idx) => (
                  <div key={link.id || idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      value={link.emoji}
                      onChange={(e) => {
                        const updated = [...(config.footer?.col3Links || [])];
                        updated[idx] = { ...updated[idx], emoji: e.target.value };
                        setConfig({ ...config, footer: { ...config.footer, col3Links: updated } });
                      }}
                      className="w-10 text-center py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Link Text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...(config.footer?.col3Links || [])];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        setConfig({ ...config, footer: { ...config.footer, col3Links: updated } });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="URL Path (/contact)"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...(config.footer?.col3Links || [])];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setConfig({ ...config, footer: { ...config.footer, col3Links: updated } });
                      }}
                      className="w-44 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (config.footer?.col3Links || []).filter((_, i) => i !== idx);
                        setConfig({ ...config, footer: { ...config.footer, col3Links: updated } });
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 4: NEWSLETTER & VIP DEALS */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
                4️⃣ Column 4: Newsletter & VIP Deals Block
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Column 4 Heading</label>
                  <input
                    type="text"
                    value={config.footer?.col4Heading || "NEWSLETTER & VIP DEALS"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, col4Heading: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Subscribe Button Text</label>
                  <input
                    type="text"
                    value={config.footer?.newsletterButtonText || "Subscribe Now"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, newsletterButtonText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-pink-400 font-bold text-xs"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Newsletter Description Text</label>
                  <textarea
                    rows={2}
                    value={config.footer?.col4Desc || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, col4Desc: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* BOTTOM LEGAL BAR: DISCLAIMER & COPYRIGHT */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-rose-400 uppercase tracking-wider">
                ⚖️ Bottom Legal Bar & Copyright Line
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Copyright Line</label>
                  <input
                    type="text"
                    value={config.footer?.copyrightText || "© 2026 Skokka India Classifieds • 18+ Adult Escort Directory • All Rights Reserved"}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, copyrightText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">18+ Compliance Disclaimer Text</label>
                  <textarea
                    rows={2}
                    value={config.footer?.disclaimerText || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        footer: { ...config.footer, disclaimerText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

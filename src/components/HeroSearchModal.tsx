"use client";

import React, { useState, useEffect } from "react";
import { X, Search, SlidersHorizontal, MapPin, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialLocation?: string;
}

export function HeroSearchModal({ isOpen, onClose, initialCategory = "Call Girls", initialLocation = "" }: SearchModalProps) {
  // Primary inputs
  const [category, setCategory] = useState(initialCategory || "Call Girls");
  const [keyword, setKeyword] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialLocation || "");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // CMS Config State for Dynamic Cities & Filters created by Super Admin
  const [dynamicCities, setDynamicCities] = useState<string[]>([]);
  const [cmsFilters, setCmsFilters] = useState<any>(null);

  // Filters State
  const [nationality, setNationality] = useState("Indian");
  const [breast, setBreast] = useState("");
  const [hair, setHair] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [attentionTo, setAttentionTo] = useState<string[]>([]);
  const [placeOfService, setPlaceOfService] = useState<string[]>([]);

  // Accordion open sections
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    nationality: true,
    breast: true,
    hair: true,
    bodyType: false,
    services: false,
    attentionTo: false,
    placeOfService: false,
  });

  // Load Super Admin Dynamic Cities & Filters from CMS store
  useEffect(() => {
    const loadCmsData = () => {
      const cms = getHomePageCmsConfig();
      if (cms?.topCities?.cities) {
        const cleanNames = cms.topCities.cities.map((c) =>
          c.name.replace(/ Escorts| Call Girls| VIP Companions/g, "").trim()
        );
        setDynamicCities(Array.from(new Set(cleanNames.filter(Boolean))));
      }
      if (cms?.searchModalFilters) {
        setCmsFilters(cms.searchModalFilters);
      }
    };

    loadCmsData();

    if (typeof window !== "undefined") {
      window.addEventListener(CMS_UPDATE_EVENT, loadCmsData);
      window.addEventListener("storage", loadCmsData);
      return () => {
        window.removeEventListener(CMS_UPDATE_EVENT, loadCmsData);
        window.removeEventListener("storage", loadCmsData);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearAll = () => {
    setCategory("Call Girls");
    setKeyword("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedDistrict("");
    setNationality("");
    setBreast("");
    setHair("");
    setBodyType("");
    setServices([]);
    setAttentionTo([]);
    setPlaceOfService([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category && category !== "All Categories") params.set("tag", category);
    if (selectedCity) params.set("city", selectedCity);
    else if (selectedDistrict) params.set("city", selectedDistrict);
    else if (selectedState) params.set("city", selectedState);

    if (keyword) params.set("q", keyword);
    if (nationality) params.set("nationality", nationality);
    if (breast) params.set("breast", breast);
    if (hair) params.set("hair", hair);
    if (bodyType) params.set("bodyType", bodyType);
    if (services.length > 0) params.set("services", services.join(","));

    window.location.href = `/escorts?${params.toString()}`;
    onClose();
  };

  const toggleArrayItem = (list: string[], item: string, setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-200">
        
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-sm">
          
          {/* TOP FILTER CONTROLS */}
          <div className="space-y-3">
            {/* Row 1: Category & Keyword */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium focus:border-rose-500 focus:outline-none appearance-none cursor-pointer text-sm shadow-sm"
                >
                  <option value="Call Girls">Call Girls</option>
                  <option value="VIP Escorts">VIP Escorts</option>
                  <option value="Independent Girls">Independent Girls</option>
                  <option value="Russian Escorts">Russian Escorts</option>
                  <option value="College Girls">College Girls</option>
                  <option value="Massage Parlors">Massage Parlors</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Search here..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium placeholder-slate-400 focus:border-rose-500 focus:outline-none text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Row 2: City & District Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Dynamic City Selection from Super Admin CMS */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium focus:border-rose-500 focus:outline-none appearance-none cursor-pointer text-sm shadow-sm truncate"
                >
                  <option value="">All the cities</option>
                  {dynamicCities.map((cityName) => (
                    <option key={`dynamic-${cityName}`} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* District Selection */}
              <div className="relative">
                <select
                  value={selectedDistrict}
                  disabled={!selectedCity}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`w-full px-3.5 py-3 rounded-lg border text-sm shadow-sm appearance-none truncate ${
                    selectedCity
                      ? "bg-white border-slate-200 text-slate-800 cursor-pointer focus:border-rose-500 focus:outline-none"
                      : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <option value="">Select District</option>
                  {selectedCity && (
                    <option value={`${selectedCity} Central`}>
                      {selectedCity} Central
                    </option>
                  )}
                  {selectedCity && (
                    <option value={`${selectedCity} Suburbs`}>
                      {selectedCity} Suburbs
                    </option>
                  )}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* FILTERS SECTION HEADER */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <SlidersHorizontal className="h-4 w-4 text-slate-700" />
            <span className="font-bold text-slate-800 text-sm">Filters</span>
          </div>

          {/* ACCORDION FILTER OPTIONS */}
          <div className="space-y-4">
            
            {/* 1. Nationality */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("nationality")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">🏳️</span> Nationality
                </span>
                <ChevronDown className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.nationality ? "rotate-180" : ""}`} />
              </button>

              {openSections.nationality && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.nationalities || [
                    { id: "Indian", label: "IN Indian" },
                    { id: "Albanian", label: "AL Albanian" },
                    { id: "American", label: "US American" },
                    { id: "Arabic", label: "SA Arabic" },
                    { id: "Russian", label: "RU Russian" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNationality(nationality === item.id ? "" : item.id)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        nationality === item.id
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Breast */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("breast")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">👙</span> Breast
                </span>
                <ChevronDown className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.breast ? "rotate-180" : ""}`} />
              </button>

              {openSections.breast && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.breasts || [
                    { id: "Natural Boobs", label: "Natural Boobs" },
                    { id: "Busty", label: "Busty" },
                    { id: "Enhanced", label: "Enhanced" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBreast(breast === item.id ? "" : item.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        breast === item.id
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Hair */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("hair")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">👩</span> Hair
                </span>
                <ChevronDown className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.hair ? "rotate-180" : ""}`} />
              </button>

              {openSections.hair && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.hairs || [
                    { id: "Blond Hair", label: "Blond Hair" },
                    { id: "Brown Hair", label: "Brown Hair" },
                    { id: "Black Hair", label: "Black Hair" },
                    { id: "Red Hair", label: "Red Hair" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHair(hair === item.id ? "" : item.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        hair === item.id
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Body Type */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("bodyType")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">💃</span> Body type
                </span>
                <ChevronRight className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.bodyType ? "rotate-90" : ""}`} />
              </button>

              {openSections.bodyType && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.bodyTypes || [
                    { id: "Slim", label: "Slim" },
                    { id: "Curvy", label: "Curvy" },
                    { id: "Athletic", label: "Athletic" },
                    { id: "Petite", label: "Petite" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBodyType(bodyType === item.id ? "" : item.id)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        bodyType === item.id
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Services */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("services")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">💖</span> Services
                </span>
                <ChevronRight className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.services ? "rotate-90" : ""}`} />
              </button>

              {openSections.services && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.services || [
                    { id: "GFE", label: "GFE" },
                    { id: "Dinner Date", label: "Dinner Date" },
                    { id: "Massage", label: "Massage" },
                    { id: "Overnight", label: "Overnight" },
                    { id: "Outcall", label: "Outcall" },
                    { id: "Incall", label: "Incall" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleArrayItem(services, item.id, setServices)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        services.includes(item.id)
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Attention to */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("attentionTo")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">👤</span> Attention to
                </span>
                <ChevronRight className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.attentionTo ? "rotate-90" : ""}`} />
              </button>

              {openSections.attentionTo && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.attentionTo || [
                    { id: "Men", label: "Men" },
                    { id: "Women", label: "Women" },
                    { id: "Couples", label: "Couples" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleArrayItem(attentionTo, item.id, setAttentionTo)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        attentionTo.includes(item.id)
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 7. Place of service */}
            <div className="border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => toggleSection("placeOfService")}
                className="w-full flex items-center justify-between py-1 text-left font-semibold text-slate-800 hover:text-rose-600 transition"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs">📍</span> Place of service
                </span>
                <ChevronRight className={`h-4 w-4 text-rose-500 transition-transform duration-200 ${openSections.placeOfService ? "rotate-90" : ""}`} />
              </button>

              {openSections.placeOfService && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cmsFilters?.placesOfService || [
                    { id: "Hotel", label: "Hotel" },
                    { id: "Private Apartment", label: "Private Apartment" },
                    { id: "Clubs", label: "Clubs" },
                    { id: "Events", label: "Events" },
                  ]).map((item: any) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleArrayItem(placeOfService, item.id, setPlaceOfService)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        placeOfService.includes(item.id)
                          ? "border-rose-500 text-rose-600 bg-rose-50/50 shadow-sm"
                          : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* MODAL FOOTER BUTTONS */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 tracking-wider uppercase flex items-center gap-1.5 transition cursor-pointer px-2 py-1"
          >
            DELETE ALL
          </button>

          <button
            type="button"
            onClick={handleSearchSubmit}
            className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/30 flex items-center gap-2 transition hover:scale-[1.02] cursor-pointer"
          >
            <Search className="h-4 w-4" /> SEARCH
          </button>
        </div>

      </div>
    </div>
  );
}

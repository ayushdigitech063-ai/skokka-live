"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Map,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Sparkles,
  Layers,
  Check,
  AlertTriangle,
} from "lucide-react";
import Swal from "sweetalert2";
import { IState, ICity, IArea, ILocationTreeState } from "@/types/location";
import { getAuthHeaders as getCentralAuthHeaders, getAuthToken } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

export function AdminLocationTab() {
  const [activeSubTab, setActiveSubTab] = useState<"all_tree" | "states" | "cities" | "areas">("all_tree");
  const [locationTree, setLocationTree] = useState<ILocationTreeState[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [areas, setAreas] = useState<IArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>("all");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("all");

  // Modal States
  const [showStateModal, setShowStateModal] = useState(false);
  const [editingState, setEditingState] = useState<IState | null>(null);
  const [stateForm, setStateForm] = useState({ name: "", code: "", sortOrder: 0, metaTitle: "", metaDescription: "" });

  const [showCityModal, setShowCityModal] = useState(false);
  const [editingCity, setEditingCity] = useState<ICity | null>(null);
  const [cityForm, setCityForm] = useState({ name: "", stateId: "", tier: "Tier 2", isPopular: false, sortOrder: 0 });

  const [showAreaModal, setShowAreaModal] = useState(false);
  const [editingArea, setEditingArea] = useState<IArea | null>(null);
  const [areaForm, setAreaForm] = useState({ name: "", cityId: "", pincode: "", isPopular: false, sortOrder: 0 });

  // Unified Single Location Form State
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [unifiedForm, setUnifiedForm] = useState({
    stateName: "Rajasthan",
    isCustomState: false,
    customStateName: "",
    cityName: "",
    areaName: "",
    pincode: "",
  });

  const handleSaveUnifiedLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalState = unifiedForm.isCustomState ? unifiedForm.customStateName : unifiedForm.stateName;
    if (!finalState.trim() || !unifiedForm.cityName.trim()) {
      Swal.fire("Missing Input", "State and City names are required", "warning");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/locations/auto-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stateName: finalState,
          cityName: unifiedForm.cityName,
          areaName: unifiedForm.areaName,
          pincode: unifiedForm.pincode,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to register location", "error");
        return;
      }

      Swal.fire({
        title: "Location Hierarchy Saved! 🎉",
        text: `State: ${data.state?.name}, City: ${data.city?.name}${data.area ? `, Area: ${data.area?.name}` : ""}`,
        icon: "success",
        confirmButtonColor: "#3B82F6",
      });

      setShowUnifiedModal(false);
      setUnifiedForm({ stateName: "Rajasthan", isCustomState: false, customStateName: "", cityName: "", areaName: "", pincode: "" });
      fetchLocations();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Fetch All Location Data
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const [resTree, resStates, resCities, resAreas] = await Promise.all([
        fetch(`${BACKEND_URL}/locations/tree`).then((r) => r.json()),
        fetch(`${BACKEND_URL}/locations/states?includeDeleted=false`).then((r) => r.json()),
        fetch(`${BACKEND_URL}/locations/cities?includeDeleted=false`).then((r) => r.json()),
        fetch(`${BACKEND_URL}/locations/areas?includeDeleted=false`).then((r) => r.json()),
      ]);

      if (resTree.success) setLocationTree(resTree.tree || []);
      if (resStates.success) setStates(resStates.states || []);
      if (resCities.success) setCities(resCities.cities || []);
      if (resAreas.success) setAreas(resAreas.areas || []);
    } catch (error: any) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Admin Auth Headers helper
  const getAuthHeaders = () => {
    return getCentralAuthHeaders();
  };

  // ==========================================
  // STATE CRUD HANDLERS
  // ==========================================
  const handleSaveState = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateForm.name.trim()) return;

    try {
      const url = editingState
        ? `${BACKEND_URL}/locations/states/${editingState._id}`
        : `${BACKEND_URL}/locations/states`;
      const method = editingState ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(stateForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to save state", "error");
        return;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: editingState ? "State updated!" : "State created!",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowStateModal(false);
      setEditingState(null);
      setStateForm({ name: "", code: "", sortOrder: 0, metaTitle: "", metaDescription: "" });
      fetchLocations();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleToggleState = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/locations/states/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) fetchLocations();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteState = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Delete ${name}?`,
      text: "This will soft-delete the state and all its cities and areas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BACKEND_URL}/locations/states/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted", "State deleted successfully", "success");
          fetchLocations();
        }
      } catch (err: any) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // ==========================================
  // CITY CRUD HANDLERS
  // ==========================================
  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.name.trim() || !cityForm.stateId) {
      Swal.fire("Warning", "City name and State selection are required", "warning");
      return;
    }

    try {
      const url = editingCity
        ? `${BACKEND_URL}/locations/cities/${editingCity._id}`
        : `${BACKEND_URL}/locations/cities`;
      const method = editingCity ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(cityForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to save city", "error");
        return;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: editingCity ? "City updated!" : "City created!",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowCityModal(false);
      setEditingCity(null);
      setCityForm({ name: "", stateId: states[0]?._id || "", tier: "Tier 2", isPopular: false, sortOrder: 0 });
      fetchLocations();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleToggleCity = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/locations/cities/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) fetchLocations();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteCity = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Delete City '${name}'?`,
      text: "This will soft-delete the city and its sub-areas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BACKEND_URL}/locations/cities/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted", "City deleted successfully", "success");
          fetchLocations();
        }
      } catch (err: any) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // ==========================================
  // AREA CRUD HANDLERS
  // ==========================================
  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaForm.name.trim() || !areaForm.cityId) {
      Swal.fire("Warning", "Area name and City selection are required", "warning");
      return;
    }

    try {
      const url = editingArea
        ? `${BACKEND_URL}/locations/areas/${editingArea._id}`
        : `${BACKEND_URL}/locations/areas`;
      const method = editingArea ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(areaForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire("Error", data.message || "Failed to save area", "error");
        return;
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: editingArea ? "Area updated!" : "Area created!",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowAreaModal(false);
      setEditingArea(null);
      setAreaForm({ name: "", cityId: cities[0]?._id || "", pincode: "", isPopular: false, sortOrder: 0 });
      fetchLocations();
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleToggleArea = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/locations/areas/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) fetchLocations();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteArea = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Delete Area '${name}'?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BACKEND_URL}/locations/areas/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted", "Area deleted successfully", "success");
          fetchLocations();
        }
      } catch (err: any) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // Filtered views
  const filteredCities = cities.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.slug.includes(searchTerm.toLowerCase());
    const matchesState = selectedStateFilter === "all" || (typeof c.stateId === "object" ? c.stateId?._id === selectedStateFilter : c.stateId === selectedStateFilter);
    return matchesSearch && matchesState;
  });

  const filteredAreas = areas.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (a.pincode && a.pincode.includes(searchTerm));
    const matchesCity = selectedCityFilter === "all" || (typeof a.cityId === "object" ? a.cityId?._id === selectedCityFilter : a.cityId === selectedCityFilter);
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">Location Management</h1>
              <p className="text-xs text-slate-400">Hierarchy: State ➔ City ➔ Area (India Only)</p>
            </div>
          </div>
        </div>

        {/* ALL CREATION BUTTONS ALWAYS VISIBLE TOGETHER */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setUnifiedForm({ stateName: states[0]?.name || "Rajasthan", isCustomState: false, customStateName: "", cityName: "", areaName: "", pincode: "" });
              setShowUnifiedModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer border border-emerald-400/30 animate-pulse"
          >
            <Sparkles className="h-4 w-4 text-amber-200" /> + Add Complete Location (Single Form)
          </button>

          <button
            onClick={() => {
              setEditingState(null);
              setStateForm({ name: "", code: "", sortOrder: 0, metaTitle: "", metaDescription: "" });
              setShowStateModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4 text-rose-400" /> Add State
          </button>

          <button
            onClick={() => {
              setEditingCity(null);
              setCityForm({ name: "", stateId: states[0]?._id || "", tier: "Tier 2", isPopular: false, sortOrder: 0 });
              setShowCityModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4 text-cyan-400" /> Add City
          </button>

          <button
            onClick={() => {
              setEditingArea(null);
              setAreaForm({ name: "", cityId: cities[0]?._id || "", pincode: "", isPopular: false, sortOrder: 0 });
              setShowAreaModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4 text-purple-400" /> Add Area
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveSubTab("states")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeSubTab === "states"
              ? "bg-slate-900 border-rose-500 shadow-lg shadow-rose-500/10"
              : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">States & UTs</span>
            <Map className="h-5 w-5 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{states.length}</p>
          <span className="text-[11px] text-slate-500">{states.filter((s) => s.isActive).length} Active States</span>
        </div>

        <div
          onClick={() => setActiveSubTab("cities")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeSubTab === "cities"
              ? "bg-slate-900 border-rose-500 shadow-lg shadow-rose-500/10"
              : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Cities</span>
            <Building2 className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{cities.length}</p>
          <span className="text-[11px] text-slate-500">{cities.filter((c) => c.isPopular).length} Popular Tier Cities</span>
        </div>

        <div
          onClick={() => setActiveSubTab("areas")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeSubTab === "areas"
              ? "bg-slate-900 border-rose-500 shadow-lg shadow-rose-500/10"
              : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sub-Areas & Locality</span>
            <MapPin className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{areas.length}</p>
          <span className="text-[11px] text-slate-500">{areas.filter((a) => a.isActive).length} Active Locations</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* SUB TAB TOGGLE */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab("all_tree")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeSubTab === "all_tree" ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            All Hierarchy Tree 🌳
          </button>
          <button
            onClick={() => setActiveSubTab("states")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeSubTab === "states" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            States ({states.length})
          </button>
          <button
            onClick={() => setActiveSubTab("cities")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeSubTab === "cities" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Cities ({cities.length})
          </button>
          <button
            onClick={() => setActiveSubTab("areas")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              activeSubTab === "areas" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Areas ({areas.length})
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50"
          />
        </div>
      </div>

      {/* DATA TABLES / CARDS VIEW */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-bold text-sm">
          Loading Locations Database...
        </div>
      ) : activeSubTab === "all_tree" ? (
        /* UNIFIED HIERARCHY TREE VIEW */
        <div className="space-y-4">
          {locationTree.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500 font-bold text-sm">
              No locations added yet. Use the "+ Add State" / "+ Add City" / "+ Add Area" buttons above to populate.
            </div>
          ) : (
            locationTree.map((st) => (
              <div key={st._id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                {/* STATE ROW */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-xs">
                      {st.code || "ST"}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        {st.name}
                        <span className="text-[11px] font-mono text-slate-400 font-normal">({st.slug})</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {st.cities?.length || 0} Cities Configured
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCity(null);
                        setCityForm({ name: "", stateId: st._id, tier: "Tier 2", isPopular: false, sortOrder: 0 });
                        setShowCityModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add City in {st.name}
                    </button>
                    <button
                      onClick={() => {
                        setEditingState(st);
                        setStateForm({
                          name: st.name,
                          code: st.code || "",
                          sortOrder: st.sortOrder || 0,
                          metaTitle: st.metaTitle || "",
                          metaDescription: st.metaDescription || "",
                        });
                        setShowStateModal(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* CITIES & AREAS LIST IN STATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(st.cities || []).length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-2">No cities added in {st.name} yet.</p>
                  ) : (
                    (st.cities || []).map((ct: any) => (
                      <div key={ct._id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-cyan-400 shrink-0" />
                            <span className="font-bold text-xs text-white">{ct.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">{ct.tier}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingArea(null);
                                setAreaForm({ name: "", cityId: ct._id, pincode: "", isPopular: false, sortOrder: 0 });
                                setShowAreaModal(true);
                              }}
                              title={`Add Area in ${ct.name}`}
                              className="p-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500 hover:text-white text-[10px] transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingCity(ct);
                                setCityForm({
                                  name: ct.name,
                                  stateId: st._id,
                                  tier: ct.tier || "Tier 2",
                                  isPopular: ct.isPopular || false,
                                  sortOrder: ct.sortOrder || 0,
                                });
                                setShowCityModal(true);
                              }}
                              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* AREAS SUB-PILLS */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(ct.areas || []).length === 0 ? (
                            <span className="text-[10px] text-slate-600 italic">No areas yet</span>
                          ) : (
                            (ct.areas || []).map((ar: any) => (
                              <span
                                key={ar._id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20"
                              >
                                <MapPin className="h-2.5 w-2.5" />
                                {ar.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeSubTab === "states" ? (
        /* STATES LIST */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
              <tr>
                <th className="p-4">State Name</th>
                <th className="p-4">Code</th>
                <th className="p-4">SEO Slug</th>
                <th className="p-4">Cities Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {states.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No states created yet. Click "+ Add New State" above.
                  </td>
                </tr>
              ) : (
                states.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Map className="h-4 w-4 text-rose-400" />
                      {st.name}
                    </td>
                    <td className="p-4 font-mono text-xs text-rose-300">{st.code || "-"}</td>
                    <td className="p-4 text-slate-400 font-mono">{st.slug}</td>
                    <td className="p-4 font-extrabold text-cyan-400">{st.cities?.length || 0} Cities</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleState(st._id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          st.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {st.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingState(st);
                          setStateForm({
                            name: st.name,
                            code: st.code || "",
                            sortOrder: st.sortOrder || 0,
                            metaTitle: st.metaTitle || "",
                            metaDescription: st.metaDescription || "",
                          });
                          setShowStateModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteState(st._id, st.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : activeSubTab === "cities" ? (
        /* CITIES LIST */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
              <tr>
                <th className="p-4">City Name</th>
                <th className="p-4">Parent State</th>
                <th className="p-4">SEO Slug</th>
                <th className="p-4">Tier / Category</th>
                <th className="p-4">Popular</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredCities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No cities found. Click "+ Add New City" above to create one.
                  </td>
                </tr>
              ) : (
                filteredCities.map((ct) => {
                  const stateName = typeof ct.stateId === "object" ? ct.stateId?.name : "Unknown State";
                  return (
                    <tr key={ct._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-cyan-400" />
                        {ct.name}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{stateName}</td>
                      <td className="p-4 text-slate-400 font-mono">{ct.slug}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-slate-300">
                          {ct.tier}
                        </span>
                      </td>
                      <td className="p-4">
                        {ct.isPopular ? (
                          <span className="text-amber-400 font-extrabold text-[11px] flex items-center gap-1">
                            ⭐ Popular
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Normal</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleCity(ct._id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ct.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {ct.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingCity(ct);
                            setCityForm({
                              name: ct.name,
                              stateId: typeof ct.stateId === "object" ? ct.stateId?._id : ct.stateId,
                              tier: ct.tier || "Tier 2",
                              isPopular: ct.isPopular || false,
                              sortOrder: ct.sortOrder || 0,
                            });
                            setShowCityModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCity(ct._id, ct.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* AREAS LIST */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
              <tr>
                <th className="p-4">Area Locality</th>
                <th className="p-4">Parent City</th>
                <th className="p-4">State</th>
                <th className="p-4">PIN Code</th>
                <th className="p-4">SEO Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No sub-areas found. Click "+ Add New Area" above to create one.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((ar) => {
                  const cityName = typeof ar.cityId === "object" ? ar.cityId?.name : "Unknown City";
                  const stateName = typeof ar.stateId === "object" ? ar.stateId?.name : "Unknown State";
                  return (
                    <tr key={ar._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        {ar.name}
                      </td>
                      <td className="p-4 text-cyan-300 font-medium">{cityName}</td>
                      <td className="p-4 text-slate-400">{stateName}</td>
                      <td className="p-4 font-mono text-slate-300">{ar.pincode || "-"}</td>
                      <td className="p-4 text-slate-400 font-mono">{ar.slug}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleArea(ar._id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ar.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {ar.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingArea(ar);
                            setAreaForm({
                              name: ar.name,
                              cityId: typeof ar.cityId === "object" ? ar.cityId?._id : ar.cityId,
                              pincode: ar.pincode || "",
                              isPopular: ar.isPopular || false,
                              sortOrder: ar.sortOrder || 0,
                            });
                            setShowAreaModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteArea(ar._id, ar.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT STATE MODAL */}
      {showStateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">{editingState ? "Edit State" : "Add New State"}</h3>
            <form onSubmit={handleSaveState} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">State Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajasthan"
                  value={stateForm.name}
                  onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">State Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. RJ"
                  value={stateForm.code}
                  onChange={(e) => setStateForm({ ...stateForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white uppercase"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Save State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CITY MODAL */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">{editingCity ? "Edit City" : "Add New City"}</h3>
            <form onSubmit={handleSaveCity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Parent State *</label>
                <select
                  required
                  value={cityForm.stateId}
                  onChange={(e) => setCityForm({ ...cityForm, stateId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="">-- Choose State --</option>
                  {states.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} ({st.code || "STATE"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur"
                  value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">City Tier</label>
                  <select
                    value={cityForm.tier}
                    onChange={(e) => setCityForm({ ...cityForm, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="Tier 1">Tier 1 (Metro)</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3">Tier 3</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cityForm.isPopular}
                      onChange={(e) => setCityForm({ ...cityForm, isPopular: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-rose-600"
                    />
                    ⭐ Popular City
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Save City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT AREA MODAL */}
      {showAreaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">{editingArea ? "Edit Area" : "Add New Area"}</h3>
            <form onSubmit={handleSaveArea} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Parent City *</label>
                <select
                  required
                  value={areaForm.cityId}
                  onChange={(e) => setAreaForm({ ...areaForm, cityId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="">-- Choose City --</option>
                  {cities.map((ct) => (
                    <option key={ct._id} value={ct._id}>
                      {ct.name} ({typeof ct.stateId === "object" ? ct.stateId?.name : "State"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Area / Locality Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bani Park"
                  value={areaForm.name}
                  onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pincode (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 302016"
                  value={areaForm.pincode}
                  onChange={(e) => setAreaForm({ ...areaForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAreaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Save Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE UNIFIED COMPLETE LOCATION CREATION MODAL */}
      {showUnifiedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Add Complete Location (Single Form)</h3>
              </div>
              <button onClick={() => setShowUnifiedModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnifiedLocation} className="space-y-4">
              {/* STEP 1: STATE SELECTION OR TYPE NEW */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-rose-400 uppercase tracking-wider">1. State Name *</label>
                  <button
                    type="button"
                    onClick={() => setUnifiedForm({ ...unifiedForm, isCustomState: !unifiedForm.isCustomState })}
                    className="text-[11px] font-bold text-cyan-400 hover:underline"
                  >
                    {unifiedForm.isCustomState ? "← Choose Existing State" : "+ Type New State"}
                  </button>
                </div>

                {unifiedForm.isCustomState ? (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan, Maharashtra, Punjab"
                    value={unifiedForm.customStateName}
                    onChange={(e) => setUnifiedForm({ ...unifiedForm, customStateName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-500/50 text-xs text-white focus:outline-none"
                  />
                ) : (
                  <select
                    value={unifiedForm.stateName}
                    onChange={(e) => setUnifiedForm({ ...unifiedForm, stateName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    {states.map((st) => (
                      <option key={st._id} value={st.name}>
                        {st.name} ({st.code || "STATE"})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* STEP 2: CITY NAME */}
              <div>
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1.5">2. City Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Delhi, Mumbai, Pune"
                  value={unifiedForm.cityName}
                  onChange={(e) => setUnifiedForm({ ...unifiedForm, cityName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              {/* STEP 3: AREA NAME & PINCODE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1.5">3. Area / Locality (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Bani Park, Malviya Nagar"
                    value={unifiedForm.areaName}
                    onChange={(e) => setUnifiedForm({ ...unifiedForm, areaName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">PIN Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 302016"
                    value={unifiedForm.pincode}
                    onChange={(e) => setUnifiedForm({ ...unifiedForm, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <strong className="text-white">Single Click Creation:</strong> This single form automatically links State, City, and Area in MongoDB Atlas.
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnifiedModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30"
                >
                  Save Complete Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

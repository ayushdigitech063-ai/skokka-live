"use client";

import React, { useState, useEffect } from "react";
import { Settings, Shield, Sliders, DollarSign, Save, CheckCircle2, Globe, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { DEFAULT_NAVBAR_ITEMS, NavbarMenuItem } from "./AdminPaidAdsTab";

export function AdminSettingsTab() {
  const [siteLive, setSiteLive] = useState(true);
  const [autoApproveListings, setAutoApproveListings] = useState(false);
  const [requirePhoneVerification, setRequirePhoneVerification] = useState(true);
  const [allowWhatsappDirect, setAllowWhatsappDirect] = useState(true);
  const [vipPrice, setVipPrice] = useState("1499");
  const [featuredPrice, setFeaturedPrice] = useState("799");
  const [saved, setSaved] = useState(false);

  // Super Admin Dynamic Navbar Items State
  const [navbarItems, setNavbarItems] = useState<NavbarMenuItem[]>(DEFAULT_NAVBAR_ITEMS);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemLink, setNewItemLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNavbar = localStorage.getItem("skokka_navbar_menu_items");
      if (savedNavbar) {
        try {
          setNavbarItems(JSON.parse(savedNavbar));
        } catch {
          setNavbarItems(DEFAULT_NAVBAR_ITEMS);
        }
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("skokka_navbar_menu_items", JSON.stringify(navbarItems));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Toggle Navbar Item Visibility
  const handleToggleNavbarItem = (id: string) => {
    const updated = navbarItems.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setNavbarItems(updated);
    localStorage.setItem("skokka_navbar_menu_items", JSON.stringify(updated));
  };

  // Delete Navbar Item
  const handleDeleteNavbarItem = (id: string) => {
    const updated = navbarItems.filter((item) => item.id !== id);
    setNavbarItems(updated);
    localStorage.setItem("skokka_navbar_menu_items", JSON.stringify(updated));
  };

  // Add New Navbar Item
  const handleAddNavbarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim() || !newItemLink.trim()) {
      Swal.fire({ title: "Label & Link Required", icon: "warning", background: "#0B1437", color: "#ffffff" });
      return;
    }

    const newItem: NavbarMenuItem = {
      id: Date.now().toString(),
      label: newItemLabel.trim(),
      link: newItemLink.trim(),
      enabled: true,
    };

    const updated = [...navbarItems, newItem];
    setNavbarItems(updated);
    localStorage.setItem("skokka_navbar_menu_items", JSON.stringify(updated));
    setNewItemLabel("");
    setNewItemLink("");

    Swal.fire({
      title: "New Navbar Item Added!",
      text: `Added "${newItem.label}" to Website Header Navbar!`,
      icon: "success",
      background: "#0B1437",
      color: "#ffffff",
      confirmButtonColor: "#10b981",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans text-white">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-rose-500" /> System Settings & Website Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure site controls, header navbar menu items, prices, and security policies.</p>
      </div>

      {/* SECTION: SUPER ADMIN DYNAMIC HEADER NAVBAR CONFIGURATOR */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                🌐 Super Admin Dynamic Navbar Menu Manager
              </h2>
              <p className="text-xs text-slate-400">
                Manage live website header menu items (Home, Escorts, Cities, Categories, Contact Us)!
              </p>
            </div>
          </div>
        </div>

        {/* EXISTING MENU ITEMS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {navbarItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                item.enabled
                  ? "bg-slate-900/90 border-indigo-500/40 text-white"
                  : "bg-slate-950/50 border-slate-800 text-slate-500 opacity-60"
              }`}
            >
              <div>
                <span className="font-extrabold text-sm block">{item.label}</span>
                <span className="text-[11px] font-mono text-indigo-300">{item.link}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleToggleNavbarItem(item.id)}
                  className={`p-2 rounded-xl border transition ${
                    item.enabled
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                  title={item.enabled ? "Disable Item" : "Enable Item"}
                >
                  {item.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteNavbarItem(item.id)}
                  className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30 transition"
                  title="Delete Menu Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD NEW MENU ITEM FORM */}
        <form onSubmit={handleAddNavbarItem} className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Menu Label</label>
            <input
              type="text"
              placeholder="e.g. VIP Models"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Link / Anchor</label>
            <input
              type="text"
              placeholder="e.g. /#vip or /#verified"
              value={newItemLink}
              onChange={(e) => setNewItemLink(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Menu Item
          </button>
        </form>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Platform Control */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <Sliders className="h-4 w-4" /> Operational Controls
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white">Platform Live Status</h3>
              <p className="text-[11px] text-slate-400">Toggle website online or maintenance mode.</p>
            </div>
            <button
              type="button"
              onClick={() => setSiteLive(!siteLive)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                siteLive
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {siteLive ? "LIVE ONLINE" : "MAINTENANCE MODE"}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white">Auto-Approve Classified Ads</h3>
              <p className="text-[11px] text-slate-400">If enabled, new listings publish automatically without admin queue.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoApproveListings(!autoApproveListings)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                autoApproveListings
                  ? "bg-rose-600 text-white"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {autoApproveListings ? "ENABLED" : "DISABLED (Manual Review)"}
            </button>
          </div>
        </div>

        {/* Section 2: Security Controls */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Verification & Security
          </h2>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white">Require Mobile Phone OTP</h3>
              <p className="text-[11px] text-slate-400">Escorts must verify phone number before posting ads.</p>
            </div>
            <input
              type="checkbox"
              checked={requirePhoneVerification}
              onChange={(e) => setRequirePhoneVerification(e.target.checked)}
              className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white">Direct WhatsApp Button</h3>
              <p className="text-[11px] text-slate-400">Allow clients to click-to-chat via WhatsApp on profile cards.</p>
            </div>
            <input
              type="checkbox"
              checked={allowWhatsappDirect}
              onChange={(e) => setAllowWhatsappDirect(e.target.checked)}
              className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Section 3: VIP Pricing Rules */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Ad Package Pricing (INR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200">VIP Top Banner Package (₹ / Month)</label>
              <input
                type="number"
                value={vipPrice}
                onChange={(e) => setVipPrice(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200">Featured Highlight Ad (₹ / Month)</label>
              <input
                type="number"
                value={featuredPrice}
                onChange={(e) => setFeaturedPrice(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 font-black text-white text-xs shadow-xl shadow-rose-600/30 hover:scale-105 transition"
          >
            <Save className="h-4 w-4" /> Save System Configuration
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="h-4 w-4" /> System Settings & Navbar updated successfully!
            </span>
          )}
        </div>

      </form>
    </div>
  );
}

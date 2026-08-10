"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  Radio,
  Server
} from "lucide-react";

export function AdminAccessControlTab() {
  const [jwtLifetime, setJwtLifetime] = useState("24 Hours");
  const [requireSmsOtp, setRequireSmsOtp] = useState(true);
  const [ipWhiteList, setIpWhiteList] = useState("All Authorized Super Admin IPs");

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Super Admin Security Settings Saved!",
      showConfirmButton: false,
      timer: 2000,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* HEADER STRIP */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B1437] via-slate-900 to-[#121B3B] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-rose-400" /> Root Super Admin Access
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Secure Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Super Admin Control & Security Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            System root authentication, JWT security tokens, SSL encryption & platform control parameters.
          </p>
        </div>
      </div>

      {/* SYSTEM STATUS GRID (3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-white">Active Role Level</h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Root Super Admin (Unrestricted Master Platform Authority).
          </p>
          <div className="pt-2 text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            ROOT AUTHORIZED
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <KeyRound className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-white">Session Security</h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            256-Bit SHA-256 JWT Bearer Token Session Protocol.
          </p>
          <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> ACTIVE ENCRYPTED
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Server className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold text-white">API & Database Health</h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Next.js App Router API Routes & CMS Local Storage Store.
          </p>
          <div className="pt-2 text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Radio className="h-4 w-4 animate-pulse" /> 100% OPERATIONAL
          </div>
        </div>
      </div>

      {/* SECURITY PROTOCOL SETTINGS FORM */}
      <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-rose-500" /> Super Admin Security Controls
          </h2>
          <p className="text-xs text-slate-400">Configure global authentication timeout, token expiration & root parameters.</p>
        </div>

        <form onSubmit={handleSaveSecurity} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">JWT Session Token Expiration</label>
              <select
                value={jwtLifetime}
                onChange={(e) => setJwtLifetime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
              >
                <option value="12 Hours">12 Hours</option>
                <option value="24 Hours">24 Hours (Recommended)</option>
                <option value="7 Days">7 Days</option>
                <option value="30 Days">30 Days</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Allowed Super Admin IP Range</label>
              <input
                type="text"
                value={ipWhiteList}
                onChange={(e) => setIpWhiteList(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              Save Security Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

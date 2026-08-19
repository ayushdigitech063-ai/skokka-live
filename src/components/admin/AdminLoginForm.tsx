"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, KeyRound, ArrowLeft } from "lucide-react";

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: "Super Admin";
  avatar: string;
  jwtToken?: string;
}

interface AdminLoginFormProps {
  onLoginSuccess: (user: AdminUserData) => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter Super Admin Email Address and Password.");
      return;
    }

    setLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoading(false);
        setError(data.message || data.error || "Invalid Super Admin Credentials.");
        return;
      }

      localStorage.setItem("skokka_jwt_token", data.token);
      localStorage.setItem("skokka_admin_session", JSON.stringify(data.user));

      const loggedUser: AdminUserData = {
        id: data.user.id || data.user._id,
        name: data.user.fullName || data.user.name || "Super Admin",
        email: data.user.email,
        role: "Super Admin",
        avatar: data.user.avatar || "S",
        jwtToken: data.token,
      };

      setLoading(false);
      onLoginSuccess(loggedUser);
    } catch (err: any) {
      setLoading(false);
      setError("Network error connecting to JWT Auth Server.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050B1F] text-slate-100 flex items-center justify-center p-4 selection:bg-rose-500/30 selection:text-white font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-[#0B1437]/70 border border-slate-800/80 rounded-[28px] p-8 sm:p-9 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* CARD TOP HEADER */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800/60">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-rose-400 hover:text-rose-300 font-semibold text-xs border border-slate-700 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Website
          </Link>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            SUPER ADMIN PORTAL
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="MyCityQueens Logo"
              className="h-16 sm:h-20 object-contain drop-shadow-xl"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-normal text-white flex items-center justify-center gap-2.5">
            Super Admin Control Access <ShieldCheck className="h-6 w-6 text-rose-500" />
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed flex items-center justify-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-emerald-400" /> Root Authentication & Live System Management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/60 text-rose-200 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
              Super Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mycityqueen.com"
                className="w-full pl-11 pr-4 py-3.5 text-sm font-normal rounded-2xl bg-[#050B1F] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
              Super Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3.5 text-sm font-normal rounded-2xl bg-[#050B1F] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 font-semibold text-white text-xs uppercase tracking-wider shadow-xl shadow-rose-600/30 transition duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating Root Access...
              </span>
            ) : (
              <>
                Super Admin Login <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center text-[11px] font-normal text-slate-500 border-t border-slate-800/80 pt-4">
          © 2026 Skokka India Classifieds • Super Admin Security System
        </div>

      </div>

    </div>
  );
}

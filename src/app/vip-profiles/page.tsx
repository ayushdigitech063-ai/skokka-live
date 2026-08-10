"use client";

import React from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { Crown, Building2, Lock, Sparkles, ShieldCheck } from "lucide-react";

export default function VipProfilesPage() {
  const vipServices = [
    { title: "Russian & European VIP Models", desc: "Genuine foreign models for luxury hotel incall and private travel companionship." },
    { title: "5-Star Luxury Hotel Incall", desc: "Available at Taj, Oberoi, Marriott, ITC, and Leela luxury hotels nationwide." },
    { title: "Corporate & Business Travel", desc: "Discreet high-class companions for business trips, dinners, and events." },
    { title: "100% Confidentiality Protocol", desc: "Strict privacy agreement protecting VIP client identities and transactions." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* ENHANCED HERO BANNER WITH BLURRED MODEL BACKGROUND & LIGHT OVERLAY */}
        <section className="relative overflow-hidden w-full bg-slate-950 border-b border-amber-500/40 py-20 lg:py-28 px-6 sm:px-12 lg:px-16 text-center space-y-6 shadow-2xl flex flex-col justify-center items-center">
          
          {/* BLURRED MODEL BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[12px] opacity-25 scale-105 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-gradient-to-b from-amber-500/20 via-rose-600/15 to-transparent blur-[140px] animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs uppercase tracking-wider border border-amber-500/40 inline-flex items-center gap-1.5">
              <Crown className="h-4 w-4 text-amber-400 animate-pulse" /> VIP Exclusive Showcase
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/90 px-4.5 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span>📡 VIP CONCIERGE DIRECT CONNECT RADAR</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight sm:whitespace-nowrap">
              High-Class VIP Escorts & Models
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Verified premium companions for business executives, celebrities, and VIP guests across India.
            </p>
          </div>
        </section>

        {/* MAIN VIP CONTENT */}
        <main className="w-full px-6 sm:px-12 lg:px-16 py-12 space-y-10">
          {/* Features Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipServices.map((s, i) => (
              <div key={i} className="p-7 rounded-3xl bg-slate-900/80 border border-amber-500/30 space-y-2 shadow-xl">
                <span className="text-amber-400 font-extrabold text-base block flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" /> {s.title}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-white">Book Your Private VIP Companion</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto font-medium">
              Direct 1:1 discreet WhatsApp booking desk available 24/7 for VIP client reservations.
            </p>
            <a
              href="https://wa.me/919876500000"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
            >
              💬 Contact VIP Concierge Desk
            </a>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

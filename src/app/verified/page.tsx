"use client";

import React from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, CheckCircle2, Lock, FileCheck, Camera } from "lucide-react";

export default function VerifiedPage() {
  const steps = [
    { num: "01", icon: Camera, title: "Live Human Selfie Verification", desc: "Our AI facial recognition checks for a live human face and automatically rejects non-human images, stock photos, or vehicles." },
    { num: "02", icon: FileCheck, title: "12-Digit Aadhaar Identification", desc: "Providers submit their 12-digit government Aadhaar number to verify authenticity before posting." },
    { num: "03", icon: ShieldCheck, title: "Super Admin Manual Audit", desc: "Super Admin performs final verification of identity documents before issuing the blue verified badge." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* ENHANCED HERO BANNER WITH BLURRED MODEL BACKGROUND & LIGHT OVERLAY */}
        <section className="relative overflow-hidden w-full bg-slate-950 border-b border-emerald-500/40 py-20 lg:py-28 px-6 sm:px-12 lg:px-16 text-center space-y-6 shadow-2xl flex flex-col justify-center items-center">
          
          {/* BLURRED MODEL BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[12px] opacity-25 scale-105 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-gradient-to-b from-emerald-600/20 via-teal-600/15 to-transparent blur-[140px] animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs uppercase tracking-wider border border-emerald-500/40 inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Genuine Escort Guarantee
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/90 px-4.5 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span>📡 LIVE AI IDENTITY AUDIT RADAR</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight sm:whitespace-nowrap">
              AI Identity & Face-Filter Verification
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Eliminating fake classified ads. Every model listed with the blue verification badge has passed strict identity checks.
            </p>
          </div>
        </section>

        {/* MAIN VERIFIED CONTENT */}
        <main className="w-full px-6 sm:px-12 lg:px-16 py-12 space-y-10">
          {/* 3 Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => {
              const IconComp = s.icon;
              return (
                <div key={s.num} className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-700">{s.num}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

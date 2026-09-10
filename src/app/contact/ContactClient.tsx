"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeaderNavbar } from "@/components/HeaderNavbar";
import { Footer } from "@/components/Footer";
import { Phone, Mail, MessageCircle, ShieldCheck, Send } from "lucide-react";
import Swal from "sweetalert2";

import { getHomePageCmsConfig, CMS_UPDATE_EVENT, BACKEND_URL } from "@/utils/homepageCmsStore";

export default function ContactClientPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("General Support Desk");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cmsConfig, setCmsConfig] = useState<any>(null);

  useEffect(() => {
    const loadCms = () => setCmsConfig(getHomePageCmsConfig());
    loadCms();
    window.addEventListener(CMS_UPDATE_EVENT, loadCms);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, loadCms);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, department, subject, message }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        Swal.fire({
          title: "Inquiry Submitted Successfully! 🚀",
          text: "Your support request has been logged into our MongoDB system and routed to Super Admin.",
          icon: "success",
          background: "#0B1437",
          color: "#ffffff",
          confirmButtonColor: "#e11d48",
        });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error(json.message || "Failed to submit inquiry");
      }
    } catch (err: any) {
      Swal.fire({
        title: "Submission Error",
        text: err.message || "Could not connect to server.",
        icon: "error",
        background: "#0B1437",
        color: "#ffffff",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-rose-500/30 flex flex-col justify-between w-full">
      <div className="w-full">
        <HeaderNavbar />

        {/* ENHANCED HERO BANNER WITH BLURRED MODEL BACKGROUND & LIGHT OVERLAY */}
        <section className="relative overflow-hidden w-full bg-slate-950 border-b border-rose-800/40 py-20 lg:py-28 px-6 sm:px-12 lg:px-16 text-center space-y-6 shadow-2xl flex flex-col justify-center items-center">
          
          {/* BLURRED MODEL BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-[12px] opacity-25 scale-105 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-gradient-to-b from-rose-600/20 via-pink-600/15 to-transparent blur-[140px] animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider border border-rose-500/40 flex items-center gap-1.5">
              💬 24/7 Helpline & Assistance
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-950/90 px-4.5 py-1.5 text-xs font-extrabold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span>📡 24/7 CONCIERGE DIRECT RADAR</span>
            </div>
          </div>

          <div className="relative z-10 space-y-4 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight sm:whitespace-nowrap">
              Contact MyCityQueen Concierge Desk
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Need help with model listing approval, UTR payment verification, or customer inquiries?
            </p>
          </div>
        </section>

        {/* MAIN CONTACT CONTENT */}
        <main className="w-full px-6 sm:px-12 lg:px-16 py-12 space-y-10">
          {/* Grid Form & Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Quick Contact Form */}
            <form onSubmit={handleSubmit} className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-rose-500" /> Send Us a Message
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Select Support Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 focus:outline-none focus:border-rose-500 font-bold"
                >
                  <option value="General Support Desk">📌 General Support Desk</option>
                  <option value="Service Issue / Mistake Report">⚠️ Service Issue / Mistake Report</option>
                  <option value="Model Verification & Listing Approval">🛡️ Model Verification & Listing Approval</option>
                  <option value="Billing & Credit Pack Topup">💳 Billing & UTR Topup</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding listing approval or mistake report"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Message Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Submitting Inquiry..." : "Submit Support Ticket 🚀"}
              </button>
            </form>

            {/* Helpline Info Box */}
            <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-emerald-400" /> Direct Concierge Desks
                </h2>
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">💬 Official WhatsApp Support</span>
                  <a
                    href={`https://wa.me/${cmsConfig?.footer?.whatsappNumber || "919876500000"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-white hover:text-emerald-300"
                  >
                    +{cmsConfig?.footer?.whatsappNumber || "91 98765 00000"}
                  </a>
                  <p className="text-[11px] text-slate-400">Available 24/7 for instant model assistance.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider block">✉️ General Questions Email</span>
                  <a
                    href={`mailto:${cmsConfig?.footer?.supportEmail || "info.mycityqueen@gmail.com"}`}
                    className="text-sm font-bold text-white hover:text-rose-300"
                  >
                    {cmsConfig?.footer?.supportEmail || "info.mycityqueen@gmail.com"}
                  </a>
                  <p className="text-[11px] text-slate-400">Any question or general inquiry.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-1">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">⚠️ Service Mistake / Escalation Email</span>
                  <a
                    href={`mailto:${cmsConfig?.footer?.supportEmail || "info.mycityqueen@gmail.com"}`}
                    className="text-sm font-bold text-white hover:text-amber-300"
                  >
                    {cmsConfig?.footer?.supportEmail || "info.mycityqueen@gmail.com"}
                  </a>
                  <p className="text-[11px] text-slate-400">Dedicated desk for reporting service mistakes or listing errors.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <span className="text-xs font-bold text-rose-300 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Confidential & Encrypted Support
                </span>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

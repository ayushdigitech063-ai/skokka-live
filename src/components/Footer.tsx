"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, ExternalLink, Send } from "lucide-react";
import Swal from "sweetalert2";
import { getHomePageCmsConfig, fetchHomePageCmsConfigAsync, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";
import { HomePageCmsConfig } from "@/types/homepageCms";

export function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [cmsConfig, setCmsConfig] = useState<HomePageCmsConfig | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCmsConfig(getHomePageCmsConfig());
      fetchHomePageCmsConfigAsync().then(setCmsConfig);

      const handleUpdate = () => {
        setCmsConfig(getHomePageCmsConfig());
      };

      window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.addEventListener("storage", handleUpdate);

      return () => {
        window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      };
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    Swal.fire({
      title: "Subscribed! 🎉",
      text: "Thank you for subscribing to MyCityQueen VIP updates.",
      icon: "success",
      background: "#0B1437",
      color: "#ffffff",
      confirmButtonColor: "#10b981",
    });
    setEmailInput("");
  };

  const footerConfig = cmsConfig?.footer;
  const brandTitle = footerConfig?.brandName || "MYCITYQUEEN INDIA";
  const sslBadgeText = footerConfig?.sslBadgeText || "256-Bit SSL Encrypted Channel";
  const footerSubtitle = footerConfig?.brandTagline || cmsConfig?.hero?.subtitle || "India's No. 1 Adult Escort Classifieds Directory. 100% AI Verified Profiles, Direct WhatsApp & Phone contact.";

  const col2Heading = footerConfig?.col2Heading || "EXPLORE CATEGORIES";
  const col2Links = footerConfig?.col2Links || [
    { id: "1", emoji: "🔞", label: "Escorts Directory", url: "/escorts" },
    { id: "2", emoji: "📍", label: "Pan-India Escort Cities", url: "/cities" },
    { id: "3", emoji: "👑", label: "VIP Luxury Showcase", url: "/vip-profiles" },
    { id: "4", emoji: "✓", label: "AI Verified Standard", url: "/verified" },
  ];

  const col3Heading = footerConfig?.col3Heading || "HELP & SUPPORT";
  const col3Links = footerConfig?.col3Links || [
    { id: "1", emoji: "💬", label: "24/7 Helpline Support Desk", url: "/contact" },
    { id: "2", emoji: "🔐", label: "Admin Security Portal", url: "/admin" },
  ];

  const col4Heading = footerConfig?.col4Heading || "NEWSLETTER & VIP DEALS";
  const col4Desc = footerConfig?.col4Desc || "Get latest listing highlights & promotion discounts delivered directly.";
  const btnText = footerConfig?.newsletterButtonText || "Subscribe Now";

  const supportEmail = footerConfig?.supportEmail || "info.mycityqueen@gmail.com";
  const whatsappNum = footerConfig?.whatsappNumber || "+91 98765 00000";
  const copyrightText = footerConfig?.copyrightText || "© 2026 MyCityQueen India Classifieds • 18+ Adult Escort Directory • All Rights Reserved";
  const disclaimerText = footerConfig?.disclaimerText || "Disclaimer: All escort profiles listed are 18+ adult providers. MyCityQueen enforces strict compliance, AI face verification, and 256-bit SSL encryption.";

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-300 font-sans w-full">
      <div className="w-full px-6 sm:px-12 lg:px-16 space-y-12">
        
        {/* Top Footer Grid -> 3 Columns Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src={footerConfig?.brandLogoUrl || "/images/logo.png"}
                alt="MyCityQueens Logo"
                className="h-12 sm:h-16 object-contain transition group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/logo.png";
                }}
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {footerSubtitle}
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 shadow-inner">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>{sslBadgeText}</span>
            </div>
          </div>

          {/* Column 2 Menu Links */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white border-b border-rose-900/50 pb-2">
              {col2Heading}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-bold text-slate-300">
              {col2Links.map((l, idx) => (
                <li key={l.id || idx}>
                  <Link href={l.url || "/escorts"} className="hover:text-rose-400 transition flex items-center gap-2">
                    <span>{l.emoji || "👉"}</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 Help & Support */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white border-b border-rose-900/50 pb-2">
              {col3Heading}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-bold text-slate-300">
              {col3Links.map((l, idx) => (
                <li key={l.id || idx}>
                  <Link href={l.url || "/contact"} className="hover:text-rose-400 transition flex items-center gap-2">
                    <span>{l.emoji || "💬"}</span> {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 text-emerald-400 font-extrabold"
                >
                  💬 WhatsApp Desk ({whatsappNum}) <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li className="text-slate-400 font-mono text-xs sm:text-sm">
                ✉ {supportEmail}
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-10 border-t border-slate-800/80 text-center space-y-2.5 text-xs sm:text-sm font-semibold">
          <p className="text-slate-300">{copyrightText}</p>
          <p className="text-xs text-slate-500 max-w-4xl mx-auto font-normal leading-relaxed">
            {disclaimerText}
          </p>
        </div>

      </div>
    </footer>
  );
}

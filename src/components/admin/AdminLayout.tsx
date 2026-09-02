"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { AdminTopBar } from "./AdminTopBar";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { AdminSettingsTab } from "./AdminSettingsTab";
import { AdminLoginForm, AdminUserData } from "./AdminLoginForm";
import { getAuthToken, setAuthToken, clearAuthToken } from "@/lib/auth";
import { AdminAccessControlTab } from "./AdminAccessControlTab";
import { AdminHomePageCmsTab } from "./AdminHomePageCmsTab";
import { AdminListingsTab } from "./AdminListingsTab";
import { AdminPaidAdsTab } from "./AdminPaidAdsTab";
import { AdminWalletTab } from "./AdminWalletTab";
import { AdminCouponTab } from "./AdminCouponTab";
import { AdminInquiriesTab } from "./AdminInquiriesTab";


import { AdminLocationTab } from "./AdminLocationTab";

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUserData | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paramEmail = params.get("email");
      const isVerifyLogin = params.get("verify_login") === "true";
      const isActivated = params.get("activated") === "true";

      // If opening from email link, force showing login & verification for that specific email!
      if ((isVerifyLogin || isActivated) && paramEmail) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      const token = getAuthToken();
      const storedUserStr = localStorage.getItem("skokka_admin_user") || localStorage.getItem("skokka_admin_session");
      
      if (token && storedUserStr) {
        // Cryptographically verify JWT Security Token with Backend Server API
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";
        fetch(`${BACKEND_URL}/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.valid && data.user) {
              setCurrentUser(data.user);
              setIsAuthenticated(true);
            } else {
              // Token invalid or expired! Force clear session & logout
              clearAuthToken();
              setIsAuthenticated(false);
              setCurrentUser(null);
            }
          })
          .catch(() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
          });
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLoginSuccess = (user: AdminUserData) => {
    if (user.jwtToken) {
      setAuthToken(user.jwtToken, user);
    } else {
      localStorage.setItem("skokka_admin_auth", "true");
      localStorage.setItem("skokka_admin_user", JSON.stringify(user));
    }
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // FULL CLEAN LOGOUT (Clears all JWT security tokens & resets URL)
  const handleLogout = () => {
    Swal.fire({
      title: "Logout Admin Session?",
      text: "Are you sure you want to log out of Skokka Control Panel?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout Now",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      background: "#0B1437",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        clearAuthToken();
        setIsAuthenticated(false);
        setCurrentUser(null);

        // Reset URL query params if any
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1800,
          background: "#0B1437",
          color: "#ffffff",
        });
      }
    });
  };

  const toggleSidebarCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#050B1F] flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
          <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          Loading Admin Security Portal...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-rose-500/30 selection:text-white">
      {/* TOP NAVIGATION BAR */}
      <AdminTopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        toggleSidebarCollapse={toggleSidebarCollapse}
        onLogout={handleLogout}
        collapsed={collapsed}
        currentUser={currentUser}
      />

      <div className="flex pt-16 sm:pt-20">
        {/* SIDEBAR NAVIGATION */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* MAIN CONTENT AREA */}
        <main
          className={`flex-1 transition-all duration-300 px-3 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-5rem)] overflow-x-hidden ${
            collapsed ? "lg:ml-20" : "lg:ml-80"
          }`}
        >
          {/* Full Screen Width Container */}
          <div className="w-full">
            {activeTab === "overview" && <AdminOverview currentUser={currentUser} />}
            {activeTab === "access_control" && <AdminAccessControlTab />}
            {activeTab === "locations" && <AdminLocationTab />}
            {(activeTab === "homepage_cms" || activeTab.startsWith("cms_")) && (
              <AdminHomePageCmsTab activeTab={activeTab} />
            )}
            {activeTab === "listings" && <AdminListingsTab />}
            {activeTab === "inquiries" && <AdminInquiriesTab />}
            {(activeTab === "ads" || activeTab.startsWith("ads_")) && (
              <AdminPaidAdsTab currentUser={currentUser} activeTab={activeTab} />
            )}
            {activeTab === "wallet" && <AdminWalletTab />}
            {activeTab === "coupon" && <AdminCouponTab />}
            {activeTab === "settings" && <AdminSettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

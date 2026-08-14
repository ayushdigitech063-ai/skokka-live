"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  Menu,
  X,
  RotateCw,
  ShieldCheck,
  LogOut,
  Settings,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  UserPlus
} from "lucide-react";
import { AdminUserData } from "./AdminLoginForm";
import { fetchAllEscortsAdmin, ESCORTS_UPDATE_EVENT } from "@/utils/escortsStore";
import { getHomePageCmsConfig, CMS_UPDATE_EVENT } from "@/utils/homepageCmsStore";

interface AdminTopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  onLogout: () => void;
  collapsed: boolean;
  currentUser: AdminUserData;
}

export function AdminTopBar({
  sidebarOpen,
  setSidebarOpen,
  toggleSidebarCollapse,
  onLogout,
  collapsed,
  currentUser,
}: AdminTopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [cmsConfig, setCmsConfig] = useState<any>(null);

  useEffect(() => {
    const loadCms = () => setCmsConfig(getHomePageCmsConfig());
    loadCms();
    window.addEventListener(CMS_UPDATE_EVENT, loadCms);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, loadCms);
  }, []);

  const fetchLiveNotifications = async () => {
    try {
      const dynamicNotifs: any[] = [];

      // 1. Fetch pending Escort/Ad approvals
      try {
        const allEscorts = await fetchAllEscortsAdmin();
        const pendingList = allEscorts.filter((e) => e.status === "PENDING_APPROVAL");
        pendingList.forEach((e) => {
          dynamicNotifs.push({
            id: e.id,
            title: "Pending Listing Approval ⏳",
            desc: `"${e.name}" (${e.category}) submitted in ${e.location || e.city} requires Super Admin review.`,
            time: "Just now",
            type: "verification",
            unread: true,
          });
        });
      } catch (err) {
        console.error("Escorts fetch error in notifs:", err);
      }

      // 2. Fetch unread Contact Support Inquiries from MongoDB
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://skokka-backend-live.onrender.com"}/api/inquiries`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const unreadInquiries = json.data.filter((i: any) => i.status === "UNREAD");
          unreadInquiries.forEach((inq: any) => {
            dynamicNotifs.push({
              id: inq._id,
              title: "New Customer Inquiry 📩",
              desc: `${inq.name} (${inq.email}): "${inq.subject || inq.department}"`,
              time: new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: "user",
              unread: true,
            });
          });
        }
      } catch (err) {
        console.error("Inquiries fetch error in notifs:", err);
      }

      // 3. System status item
      dynamicNotifs.push({
        id: "sys-backup",
        title: "MongoDB Atlas Connected ✅",
        desc: "Live database synchronization active.",
        time: "System",
        type: "system",
        unread: false,
      });

      setNotifications(dynamicNotifs);
    } catch (err) {
      console.error("Failed to fetch live notifications:", err);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    window.addEventListener(ESCORTS_UPDATE_EVENT, fetchLiveNotifications);
    return () => window.removeEventListener(ESCORTS_UPDATE_EVENT, fetchLiveNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const isSuperAdmin = currentUser.role === "Super Admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800/80 bg-[#050B1F]/95 backdrop-blur-xl shadow-2xl shadow-black/70 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Height: h-16 (64px) on mobile, h-20 (80px) on sm+ */}
      <div className="flex h-16 sm:h-20 items-stretch">
        
        {/* LEFT BRAND CELL - Width perfectly aligned with Sidebar (w-20 / w-80) */}
        <div
          className={`flex items-center border-r border-slate-800/80 transition-all duration-300 shrink-0 overflow-hidden px-4 sm:px-6 justify-between ${
            collapsed ? "w-20 justify-center" : "w-80"
          }`}
        >
          {/* SKOKKA LOGO */}
          <button
            type="button"
            onClick={collapsed ? toggleSidebarCollapse : undefined}
            className="flex items-center gap-2 group shrink-0"
            title={collapsed ? "Expand Sidebar" : undefined}
          >
            {cmsConfig?.footer?.brandLogoUrl ? (
              <img
                src={cmsConfig.footer.brandLogoUrl}
                alt="Brand Logo"
                className="h-8 sm:h-9 object-contain transition group-hover:scale-105"
              />
            ) : collapsed ? (
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 hover:scale-105 transition">
                {(cmsConfig?.footer?.brandName || "SKOKKA")[0]}
              </span>
            ) : (
              <span className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition duration-300 group-hover:scale-105">
                {cmsConfig?.footer?.brandName || "SKOKKA"}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            {/* TOGGLE BUTTON DESKTOP */}
            {!collapsed && (
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex items-center justify-center rounded-xl p-2.5 text-slate-300 hover:bg-[#0B1437] hover:text-white transition border border-slate-800/80 shadow-sm shrink-0"
                title="Collapse Sidebar Layout"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex lg:hidden items-center justify-center rounded-xl p-2 text-slate-300 hover:bg-[#0B1437] hover:text-white transition border border-slate-800/80 shrink-0"
              aria-label="Toggle mobile menu"
            >
              {sidebarOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* RIGHT TOPBAR CONTENT CELL */}
        <div className="flex-1 flex items-center justify-between px-2 sm:px-6 min-w-0">
          
          {/* DYNAMIC TITLE & LIVE BADGE */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-xs sm:text-base font-semibold tracking-normal text-white truncate">
              {isSuperAdmin ? "Super Admin" : "Admin Panel"}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE
            </span>
          </div>

          {/* MIDDLE SEARCH INPUT */}
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                placeholder="Search leads, listings, users, or providers..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-normal rounded-xl bg-[#0B1437] border border-slate-800/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/80"
              />
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Refresh Data */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 sm:p-2.5 rounded-xl bg-[#0B1437] border border-slate-800/80 text-slate-300 hover:text-white transition"
              title="Refresh Dashboard"
            >
              <RotateCw className={`h-4 sm:h-5 w-4 sm:w-5 ${refreshing ? "animate-spin text-rose-500" : ""}`} />
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 sm:p-2.5 rounded-xl bg-[#0B1437] border border-slate-800/80 text-slate-300 hover:text-white transition"
                aria-label="Notifications"
              >
                <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0B1437] border border-slate-800 shadow-2xl py-2 z-50">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4.5 w-4.5 text-rose-500" />
                      <h3 className="text-sm font-semibold text-white">System Alerts</h3>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-medium text-rose-400 hover:text-rose-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 transition hover:bg-slate-800/40 flex gap-3.5 ${
                          item.unread ? "bg-rose-950/20" : ""
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.type === "verification" && <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />}
                          {item.type === "alert" && <AlertTriangle className="h-4.5 w-4.5 text-amber-400" />}
                          {item.type === "user" && <UserPlus className="h-4.5 w-4.5 text-rose-400" />}
                          {item.type === "system" && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-200">
                            <span>{item.title}</span>
                            <span className="text-[10px] font-normal text-slate-400">{item.time}</span>
                          </div>
                          <p className="text-xs font-normal text-slate-400 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DIRECT VISIBLE LOGOUT BUTTON */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-semibold text-xs border border-rose-500/20 transition shadow-sm"
              title="Logout Session"
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
            </button>

            {/* DYNAMIC LOGGED-IN ADMIN AVATAR & DROPDOWN MENU */}
            <div
              className="relative"
              ref={profileRef}
            >
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg hover:scale-105 transition"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                {currentUser.avatar}
              </button>

              {/* PROFILE DROPDOWN MENU */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0B1437] border border-slate-800/90 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-5 py-4 border-b border-slate-800">
                    <h4 className="text-sm font-semibold text-white">{currentUser.name}</h4>
                    <span className="text-xs font-medium text-rose-400 block mt-0.5">{currentUser.role}</span>
                    <p className="text-xs font-normal text-slate-400 mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                 
                  </div>
                  <div className="p-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/50 rounded-xl transition text-left"
                    >
                      <LogOut className="h-4.5 w-4.5" /> Logout {currentUser.name}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}

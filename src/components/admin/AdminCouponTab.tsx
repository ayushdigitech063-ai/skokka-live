"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Search,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  Edit2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import Swal from "sweetalert2";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "flat";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: "active" | "expired" | "disabled";
  description: string;
}

const mockCoupons: Coupon[] = [
  {
    id: "CPN001",
    code: "SKOKKA20",
    type: "percentage",
    value: 20,
    minOrder: 1000,
    maxUses: 100,
    usedCount: 45,
    expiryDate: "2026-09-30",
    status: "active",
    description: "20% off on all ad packages",
  },
  {
    id: "CPN002",
    code: "FLAT500",
    type: "flat",
    value: 500,
    minOrder: 2000,
    maxUses: 50,
    usedCount: 50,
    expiryDate: "2026-08-01",
    status: "expired",
    description: "Flat ₹500 off on orders above ₹2000",
  },
  {
    id: "CPN003",
    code: "VIP30",
    type: "percentage",
    value: 30,
    minOrder: 5000,
    maxUses: 25,
    usedCount: 8,
    expiryDate: "2026-10-15",
    status: "active",
    description: "30% off for VIP package buyers",
  },
  {
    id: "CPN004",
    code: "WELCOME15",
    type: "percentage",
    value: 15,
    minOrder: 500,
    maxUses: 200,
    usedCount: 112,
    expiryDate: "2026-12-31",
    status: "active",
    description: "Welcome offer - 15% off for new users",
  },
  {
    id: "CPN005",
    code: "HERO1000",
    type: "flat",
    value: 1000,
    minOrder: 8000,
    maxUses: 30,
    usedCount: 0,
    expiryDate: "2026-11-30",
    status: "disabled",
    description: "₹1000 off on Hero Banner packages",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  expired: {
    label: "Expired",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  disabled: {
    label: "Disabled",
    icon: XCircle,
    color: "text-slate-400",
    bg: "bg-slate-400/10 border-slate-400/20",
  },
};

export function AdminCouponTab() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired" | "disabled">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (showCreateModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [showCreateModal]);

  // New coupon form state
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "flat">("percentage");
  const [newValue, setNewValue] = useState("");
  const [newMinOrder, setNewMinOrder] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const totalUses = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const expiredCoupons = coupons.filter((c) => c.status === "expired").length;

  const filteredCoupons = coupons.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Copied: ${code}`,
      showConfirmButton: false,
      timer: 1500,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  const handleToggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "disabled" : "active" }
          : c
      )
    );
  };

  const handleDelete = (id: string, code: string) => {
    Swal.fire({
      title: `Delete coupon "${code}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#334155",
      background: "#0B1437",
      color: "#ffffff",
    }).then((result) => {
      if (result.isConfirmed) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Coupon deleted",
          showConfirmButton: false,
          timer: 1500,
          background: "#0B1437",
          color: "#ffffff",
        });
      }
    });
  };

  const handleCreateCoupon = () => {
    if (!newCode || !newValue || !newMinOrder || !newMaxUses || !newExpiry) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Please fill all required fields",
        showConfirmButton: false,
        timer: 2000,
        background: "#0B1437",
        color: "#ffffff",
      });
      return;
    }
    const newCoupon: Coupon = {
      id: `CPN${Date.now()}`,
      code: newCode.toUpperCase(),
      type: newType,
      value: Number(newValue),
      minOrder: Number(newMinOrder),
      maxUses: Number(newMaxUses),
      usedCount: 0,
      expiryDate: newExpiry,
      status: "active",
      description: newDesc || "No description",
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setShowCreateModal(false);
    setNewCode(""); setNewType("percentage"); setNewValue("");
    setNewMinOrder(""); setNewMaxUses(""); setNewExpiry(""); setNewDesc("");
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Coupon created successfully!",
      showConfirmButton: false,
      timer: 1800,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Tag className="h-5 w-5 text-white" />
            </div>
            Coupon Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage discount coupons for ad packages</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/30 hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B1437]/60 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Coupons</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-bold text-white">{activeCoupons}</span>
          <p className="text-xs text-slate-400 mt-1">Currently running offers</p>
        </div>
        <div className="bg-[#0B1437]/60 border border-orange-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Total Uses</span>
            <Users className="h-4 w-4 text-orange-400" />
          </div>
          <span className="text-3xl font-bold text-white">{totalUses}</span>
          <p className="text-xs text-slate-400 mt-1">Times coupons were applied</p>
        </div>
        <div className="bg-[#0B1437]/60 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Expired</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-3xl font-bold text-white">{expiredCoupons}</span>
          <p className="text-xs text-slate-400 mt-1">Coupons no longer valid</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B1437] border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "expired" | "disabled")}
          className="px-3 py-2.5 bg-[#0B1437] border border-slate-700/60 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-orange-500/60 transition"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      {/* COUPONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => {
          const statusCfg = statusConfig[coupon.status];
          const StatusIcon = statusCfg.icon;
          const usagePercent = Math.round((coupon.usedCount / coupon.maxUses) * 100);

          return (
            <div
              key={coupon.id}
              className="bg-[#0B1437]/70 border border-slate-700/50 rounded-2xl p-5 hover:border-orange-500/30 transition group"
            >
              {/* Coupon Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono tracking-wider">{coupon.code}</span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-1 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition"
                        title="Copy code"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{coupon.description}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusCfg.label}
                </span>
              </div>

              {/* Discount Value */}
              <div className="bg-slate-800/50 rounded-xl p-3 mb-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">Discount</span>
                <div className="flex items-center gap-1">
                  {coupon.type === "percentage" ? (
                    <Percent className="h-4 w-4 text-orange-400" />
                  ) : (
                    <IndianRupee className="h-4 w-4 text-orange-400" />
                  )}
                  <span className="text-xl font-bold text-orange-400">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    {coupon.type === "percentage" ? "off" : "flat"}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <IndianRupee className="h-3 w-3" />
                  Min: ₹{coupon.minOrder.toLocaleString("en-IN")}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="h-3 w-3" />
                  Exp: {coupon.expiryDate}
                </div>
              </div>

              {/* Usage Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Usage</span>
                  <span className="text-slate-300 font-medium">{coupon.usedCount}/{coupon.maxUses}</span>
                </div>
                <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usagePercent >= 100 ? "bg-rose-500" : usagePercent >= 70 ? "bg-amber-500" : "bg-orange-500"}`}
                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {coupon.status !== "expired" && (
                  <button
                    onClick={() => handleToggleStatus(coupon.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition ${
                      coupon.status === "active"
                        ? "bg-slate-700/50 hover:bg-slate-700 text-slate-300"
                        : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400"
                    }`}
                  >
                    {coupon.status === "active" ? (
                      <><ToggleRight className="h-4 w-4" /> Disable</>
                    ) : (
                      <><ToggleLeft className="h-4 w-4" /> Enable</>
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(coupon.id, coupon.code)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition border border-rose-500/20"
                  title="Delete coupon"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoupons.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <Tag className="h-12 w-12 text-slate-600 mb-3" />
          <p className="text-slate-400 font-medium">No coupons found</p>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or create a new coupon</p>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1437] border border-slate-700/60 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-400" />
              Create New Coupon
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "percentage" | "flat")}
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-orange-500/60 transition"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="flat">Flat ₹</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Value *</label>
                  <input
                    type="number"
                    placeholder={newType === "percentage" ? "e.g. 20" : "e.g. 500"}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Min Order (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Max Uses *</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Expiry Date *</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500/60 transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Description</label>
                <input
                  type="text"
                  placeholder="Brief description of this coupon..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 transition"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold hover:opacity-90 transition shadow-lg shadow-orange-500/30"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  IndianRupee,
  RefreshCw,
  Download,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  reference: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    type: "credit",
    amount: 5000,
    description: "Ad Package Payment - VIP Slot",
    date: "2026-08-05 09:30",
    status: "completed",
    reference: "REF#SK20260805001",
  },
  {
    id: "TXN002",
    type: "credit",
    amount: 2500,
    description: "Standard Ad Package",
    date: "2026-08-04 14:15",
    status: "completed",
    reference: "REF#SK20260804002",
  },
  {
    id: "TXN003",
    type: "debit",
    amount: 800,
    description: "Coupon Discount Applied",
    date: "2026-08-04 11:00",
    status: "completed",
    reference: "REF#SK20260804003",
  },
  {
    id: "TXN004",
    type: "credit",
    amount: 12000,
    description: "Hero Banner Ad - Monthly",
    date: "2026-08-03 16:45",
    status: "completed",
    reference: "REF#SK20260803004",
  },
  {
    id: "TXN005",
    type: "credit",
    amount: 3500,
    description: "VIP Slot Package",
    date: "2026-08-03 10:20",
    status: "pending",
    reference: "REF#SK20260803005",
  },
  {
    id: "TXN006",
    type: "debit",
    amount: 1200,
    description: "Refund - Cancelled Ad",
    date: "2026-08-02 18:00",
    status: "failed",
    reference: "REF#SK20260802006",
  },
  {
    id: "TXN007",
    type: "credit",
    amount: 7500,
    description: "Premium Banner - 2 Weeks",
    date: "2026-08-01 09:00",
    status: "completed",
    reference: "REF#SK20260801007",
  },
];

const statusConfig = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
  },
};

export function AdminWalletTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all");

  const totalBalance = mockTransactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => (t.type === "credit" ? sum + t.amount : sum - t.amount), 0);

  const totalCredits = mockTransactions
    .filter((t) => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = mockTransactions
    .filter((t) => t.type === "debit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = mockTransactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            Wallet & Transactions
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your earnings and payment history</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1437] border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-600 text-sm font-medium transition">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-violet-600/30 hover:opacity-90 transition">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Total Balance</span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-violet-400" />
            </div>
          </div>
          <div className="flex items-end gap-1">
            <IndianRupee className="h-5 w-5 text-white mb-0.5" />
            <span className="text-3xl font-bold text-white">{totalBalance.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Available balance</p>
        </div>

        {/* Total Credits */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/10 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Credits</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-end gap-1">
            <IndianRupee className="h-5 w-5 text-white mb-0.5" />
            <span className="text-3xl font-bold text-white">{totalCredits.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Money received</p>
        </div>

        {/* Total Debits */}
        <div className="bg-gradient-to-br from-rose-600/20 to-pink-600/10 border border-rose-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Total Debits</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-rose-400" />
            </div>
          </div>
          <div className="flex items-end gap-1">
            <IndianRupee className="h-5 w-5 text-white mb-0.5" />
            <span className="text-3xl font-bold text-white">{totalDebits.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Money deducted</p>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-amber-600/20 to-yellow-600/10 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pending</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
          </div>
          <div className="flex items-end gap-1">
            <IndianRupee className="h-5 w-5 text-white mb-0.5" />
            <span className="text-3xl font-bold text-white">{pendingAmount.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Awaiting confirmation</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by description or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B1437] border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as "all" | "credit" | "debit")}
            className="px-3 py-2.5 bg-[#0B1437] border border-slate-700/60 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500/60 transition"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit Only</option>
            <option value="debit">Debit Only</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "pending" | "failed")}
            className="px-3 py-2.5 bg-[#0B1437] border border-slate-700/60 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-violet-500/60 transition"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-[#0B1437]/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-sm font-bold text-white">Transaction History</h2>
          <p className="text-xs text-slate-400 mt-0.5">{filteredTransactions.length} transactions found</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredTransactions.map((txn) => {
                const statusCfg = statusConfig[txn.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={txn.id} className="hover:bg-slate-800/30 transition group">
                    <td className="px-5 py-4">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${txn.type === "credit" ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
                        {txn.type === "credit" ? (
                          <ArrowDownLeft className="h-4.5 w-4.5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="h-4.5 w-4.5 text-rose-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-white font-medium">{txn.description}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400 font-mono">{txn.reference}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400">{txn.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-sm font-bold ${txn.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
                        {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Wallet className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">No transactions found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

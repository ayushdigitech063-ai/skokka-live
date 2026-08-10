"use client";

import React, { useState } from "react";
import { UserCheck, ShieldAlert, Phone, Mail, Ban, Check, Search } from "lucide-react";

export function AdminUsersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "Riya Verma",
      role: "Independent Provider",
      phone: "+91 98765 43210",
      email: "riya.v@gmail.com",
      status: "Active",
      verified: true,
      joinDate: "12 Jan 2026",
    },
    {
      id: "USR-002",
      name: "Royal Escorts Jaipur",
      role: "Agency / Business",
      phone: "+91 98123 99887",
      email: "royal.jaipur@escorts.in",
      status: "Active",
      verified: true,
      joinDate: "05 Feb 2026",
    },
    {
      id: "USR-003",
      name: "Deepa Spa Services",
      role: "Massage Agency",
      phone: "+91 97711 22334",
      email: "info@deepaspa.com",
      status: "Active",
      verified: false,
      joinDate: "20 May 2026",
    },
    {
      id: "USR-004",
      name: "Rajesh Kumar",
      role: "Standard Client",
      phone: "+91 91234 56789",
      email: "rajesh.k@outlook.com",
      status: "Banned",
      verified: false,
      joinDate: "01 Jul 2026",
    },
  ]);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Banned" : "Active" }
          : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-black text-white">User & Provider Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage accounts, permissions, phone verification, and ban status.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by user name, email, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">User ID & Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">ID Proof</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-850/50 transition">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-rose-400">{u.id}</span>
                    <span className="font-bold text-white text-sm">{u.name}</span>
                    <span className="text-[10px] text-slate-500">Joined: {u.joinDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-emerald-400" /> {u.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Mail className="h-3.5 w-3.5 text-slate-500" /> {u.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {u.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <UserCheck className="h-3 w-3" /> ID Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {u.status === "Active" ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      BANNED
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ml-auto ${
                      u.status === "Active"
                        ? "bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {u.status === "Active" ? (
                      <>
                        <Ban className="h-3.5 w-3.5" /> Ban User
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" /> Unban User
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

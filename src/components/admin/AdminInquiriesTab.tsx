"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Mail, CheckCircle2, Trash2, Clock, RefreshCw, MessageCircle, Send, User, Tag, Sparkles } from "lucide-react";
import { BACKEND_URL } from "@/utils/homepageCmsStore";

export function AdminInquiriesTab() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "RESOLVED">("ALL");

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/inquiries`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
      }
    } catch (err) {
      console.error("fetchInquiries error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Inquiry marked as ${newStatus}!`,
          showConfirmButton: false,
          timer: 1500,
          background: "#0B1437",
          color: "#ffffff",
        });
        fetchInquiries();
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Inquiry?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      background: "#0B1437",
      color: "#ffffff",
      confirmButtonColor: "#e11d48",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/inquiries/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchInquiries();
        }
      } catch (err) {
        console.error("Delete inquiry error:", err);
      }
    }
  };

  const filteredList = inquiries.filter((item) => {
    if (filter === "UNREAD") return item.status === "UNREAD";
    if (filter === "RESOLVED") return item.status === "RESOLVED";
    return true;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
              📬 Customer Helpdesk Inbox
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              {inquiries.filter((i) => i.status === "UNREAD").length} Unread
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Contact & Support Inquiries</h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage all support tickets, feedback, and customer inquiry emails submitted from Contact Us page.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 shadow transition cursor-pointer shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh Messages
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(["ALL", "UNREAD", "RESOLVED"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
              filter === tab
                ? "bg-rose-600 text-white shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {tab === "ALL" ? `All Inquiries (${inquiries.length})` : tab === "UNREAD" ? `Unread (${inquiries.filter((i) => i.status === "UNREAD").length})` : `Resolved (${inquiries.filter((i) => i.status === "RESOLVED").length})`}
          </button>
        ))}
      </div>

      {/* INQUIRIES LIST GRID */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-sm bg-slate-900/50 rounded-3xl border border-slate-800">
          Loading contact inquiries from MongoDB Atlas...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-bold text-sm bg-slate-900/50 rounded-3xl border border-slate-800">
          No inquiries found matching selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((item) => (
            <div
              key={item._id}
              className={`p-6 rounded-3xl border transition shadow-xl space-y-4 ${
                item.status === "UNREAD"
                  ? "bg-slate-900 border-rose-500/40"
                  : "bg-slate-950 border-slate-800 opacity-80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-slate-800 text-rose-400 font-bold text-lg flex items-center justify-center border border-slate-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      {item.name}
                      <span className="text-xs font-semibold text-slate-400">&lt;{item.email}&gt;</span>
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">
                      Submitted on {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                      item.status === "UNREAD"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.status === "UNREAD" ? (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item._id, "RESOLVED")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item._id, "UNREAD")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      Mark Unread
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* DEPARTMENT & SUBJECT */}
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300">
                  📌 {item.department || "General Support Desk"}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-rose-300">
                  💬 Subject: {item.subject || "Customer Inquiry"}
                </span>
              </div>

              {/* MESSAGE CONTENT */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-medium">
                {item.message}
              </div>

              {/* QUICK DIRECT EMAIL REPLY LINK */}
              <div className="pt-1 flex items-center justify-end">
                <a
                  href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject || "Support Inquiry")}`}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-black uppercase tracking-wider transition inline-flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" /> Direct Email Reply →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

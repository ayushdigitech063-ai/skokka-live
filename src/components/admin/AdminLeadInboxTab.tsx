"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarCheck,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Send,
  UserCheck,
  Tag,
  DollarSign
} from "lucide-react";

export interface BookingInquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  escortBooked: string;
  location: string;
  serviceType: "Incall 24x7" | "Outcall Hotel/Home" | "VIP Dinner Date";
  duration: "1 Hour" | "2 Hours" | "Full Night";
  offeredPrice: string;
  bookingDate: string;
  timeSlot: string;
  status: "NEW" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  specialRequests: string;
  createdTime: string;
}

export function AdminLeadInboxTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<BookingInquiry | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedBooking) {
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
  }, [selectedBooking]);

  const [bookings, setBookings] = useState<BookingInquiry[]>([
    {
      id: "BK-8001",
      clientName: "Rohan Kapoor",
      clientPhone: "+91 98230 11223",
      clientEmail: "rohan.k@gmail.com",
      escortBooked: "Ananya Sharma (SK-101)",
      location: "Jaipur - Bani Park (Luxury Hotel)",
      serviceType: "Incall 24x7",
      duration: "1 Hour",
      offeredPrice: "₹6,000",
      bookingDate: "Today (04 Aug 2026)",
      timeSlot: "08:00 PM - 09:00 PM",
      status: "NEW",
      specialRequests: "Client requested discrete hotel appointment in Bani Park.",
      createdTime: "10 mins ago",
    },
    {
      id: "BK-8002",
      clientName: "Vikram Malhotra",
      clientPhone: "+91 97110 88990",
      clientEmail: "vikram.m@yahoo.com",
      escortBooked: "Russian Elena (SK-105)",
      location: "Jaipur - Airport Road (VIP Resort)",
      serviceType: "Outcall Hotel/Home",
      duration: "Full Night",
      offeredPrice: "₹25,000",
      bookingDate: "Tomorrow (05 Aug 2026)",
      timeSlot: "10:00 PM - 06:00 AM",
      status: "NEW",
      specialRequests: "Full night VIP companion outcall booking.",
      createdTime: "45 mins ago",
    },
    {
      id: "BK-8003",
      clientName: "Sameer Joshi",
      clientPhone: "+91 99887 22110",
      clientEmail: "sameer.j@outlook.com",
      escortBooked: "Priya Patel (SK-102)",
      location: "Jaipur - Malviya Nagar",
      serviceType: "Incall 24x7",
      duration: "2 Hours",
      offeredPrice: "₹8,000",
      bookingDate: "03 Aug 2026",
      timeSlot: "04:00 PM - 06:00 PM",
      status: "CONFIRMED",
      specialRequests: "Confirmed booking deposit paid.",
      createdTime: "Yesterday",
    },
    {
      id: "BK-8004",
      clientName: "Karan Mehta",
      clientPhone: "+91 98450 33445",
      clientEmail: "karan.m@gmail.com",
      escortBooked: "Simran & Neha Duo (SK-103)",
      location: "Jaipur - C-Scheme",
      serviceType: "VIP Dinner Date",
      duration: "Full Night",
      offeredPrice: "₹15,000",
      bookingDate: "02 Aug 2026",
      timeSlot: "09:00 PM - 07:00 AM",
      status: "COMPLETED",
      specialRequests: "Duo companion dinner date & full night outcall.",
      createdTime: "2 days ago",
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: BookingInquiry["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Booking #${id} status updated to ${newStatus}`,
      showConfirmButton: false,
      timer: 1500,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientPhone.includes(searchTerm) ||
      b.escortBooked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    Swal.fire({
      title: "Exporting Bookings CSV",
      text: "Generating spreadsheet of client booking appointments...",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
      background: "#0B1437",
      color: "#ffffff",
    });
  };

  return (
    <div className="space-y-7 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1437]/70 border border-slate-800/80 p-7 sm:p-8 rounded-2xl backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              REAL-TIME BOOKING INBOX
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white flex items-center gap-2.5">
            <CalendarCheck className="h-7 w-7 text-rose-500" /> Client Booking Appointments
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Manage incoming client escort bookings, confirm appointment time slots, and launch direct WhatsApp chats.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#050B1F] border border-slate-700 text-slate-200 text-xs font-medium hover:bg-slate-800 transition"
        >
          <Download className="h-4 w-4 text-emerald-400" /> Export Bookings CSV
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">TOTAL BOOKINGS</span>
            <span className="text-3xl font-sora font-[700] text-white mt-1 block">8</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block">NEW / PENDING</span>
            <span className="text-3xl font-sora font-[700] text-rose-300 mt-1 block">2 NEW</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">CONFIRMED</span>
            <span className="text-3xl font-sora font-[700] text-amber-300 mt-1 block">4</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">COMPLETED</span>
            <span className="text-3xl font-sora font-[700] text-emerald-400 mt-1 block">2</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "NEW", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition border whitespace-nowrap ${
                statusFilter === st
                  ? "bg-rose-600 text-white border-rose-500 shadow-md"
                  : "bg-[#0B1437] text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              {st === "ALL" ? "All Bookings" : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search client, phone, or escort..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-normal rounded-xl bg-[#0B1437] border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="rounded-2xl bg-[#0B1437]/70 border border-slate-800/80 shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Client Booking Queue ({filteredBookings.length})</h2>
          <span className="text-xs text-slate-400 font-medium">WhatsApp direct messaging active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#050B1F] text-slate-300 font-semibold uppercase text-xs tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-4.5">Booking Ref & Client</th>
                <th className="px-6 py-4.5">Escort Booked</th>
                <th className="px-6 py-4.5">Service & Location</th>
                <th className="px-6 py-4.5">Date & Time Slot</th>
                <th className="px-6 py-4.5">Rate Offered</th>
                <th className="px-6 py-4.5">Booking Status</th>
                <th className="px-6 py-4.5 text-right">Actions & WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-normal">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  
                  {/* Ref & Client */}
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-rose-400 font-semibold">{b.id}</span>
                      <span className="font-semibold text-white text-base mt-0.5">{b.clientName}</span>
                      <span className="text-xs text-slate-400">{b.clientPhone}</span>
                    </div>
                  </td>

                  {/* Escort Booked */}
                  <td className="px-6 py-4.5">
                    <span className="font-semibold text-amber-300 text-xs sm:text-sm bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 inline-block">
                      💖 {b.escortBooked}
                    </span>
                  </td>

                  {/* Service & Location */}
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200 text-xs">{b.serviceType} ({b.duration})</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-rose-400" /> {b.location}
                      </span>
                    </div>
                  </td>

                  {/* Date & Slot */}
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-xs">{b.bookingDate}</span>
                      <span className="text-[11px] text-cyan-300 font-medium">{b.timeSlot}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4.5 font-sora font-[700] text-amber-400 text-base">
                    {b.offeredPrice}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4.5">
                    {b.status === "NEW" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        ● NEW BOOKING
                      </span>
                    )}
                    {b.status === "CONFIRMED" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        ✓ CONFIRMED
                      </span>
                    )}
                    {b.status === "COMPLETED" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ✓ COMPLETED
                      </span>
                    )}
                    {b.status === "CANCELLED" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        ✕ CANCELLED
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition border border-slate-700"
                        title="View Booking Details & Reply"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <a
                        href={`https://wa.me/${b.clientPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(b.clientName)},%20regarding%20your%20escort%20booking%20request%20(${encodeURIComponent(b.escortBooked)})%20on%20Skokka.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition flex items-center gap-1 shadow"
                        title="Direct WhatsApp Chat"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKING DETAILS & RESPONSE DRAWER MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1437] border border-slate-800 rounded-2xl p-7 max-w-xl w-full shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs text-rose-400 font-semibold">{selectedBooking.id}</span>
                <h3 className="text-xl font-semibold text-white">Client Escort Booking Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#050B1F] border border-amber-500/30 space-y-2">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">Escort Model Requested</span>
                <span className="text-lg font-bold text-white block">{selectedBooking.escortBooked}</span>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <span>Service: <strong>{selectedBooking.serviceType}</strong></span>
                  <span>Duration: <strong>{selectedBooking.duration}</strong></span>
                  <span className="font-sora font-[700] text-amber-400">{selectedBooking.offeredPrice}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#050B1F] border border-slate-800">
                  <span className="text-xs text-slate-400 block">Client Name</span>
                  <span className="font-semibold text-white text-sm">{selectedBooking.clientName}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050B1F] border border-slate-800">
                  <span className="text-xs text-slate-400 block">Phone Number</span>
                  <span className="font-semibold text-emerald-400 text-sm">{selectedBooking.clientPhone}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050B1F] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Appointment Date & Time Slot</span>
                <span className="font-semibold text-white block">{selectedBooking.bookingDate} ({selectedBooking.timeSlot})</span>
                <span className="text-xs text-slate-400 block flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-400" /> Location: {selectedBooking.location}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#050B1F] border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Special Client Request Notes</span>
                <p className="text-xs text-slate-200 font-normal leading-relaxed">{selectedBooking.specialRequests}</p>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block">Update Booking Lifecycle Status</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 font-semibold text-xs border border-amber-500/30 hover:bg-amber-500/30 transition"
                  >
                    Mark CONFIRMED
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "COMPLETED")}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                  >
                    Mark COMPLETED
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700 hover:bg-slate-700 transition"
                  >
                    Mark CANCELLED
                  </button>
                </div>
              </div>

              {/* Action WhatsApp direct link */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium"
                >
                  Close
                </button>

                <a
                  href={`https://wa.me/${selectedBooking.clientPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(selectedBooking.clientName)},%20regarding%20your%20escort%20booking%20request%20(${encodeURIComponent(selectedBooking.escortBooked)})%20on%20Skokka.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> WhatsApp Client Now
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

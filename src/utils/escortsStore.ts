// ─────────────────────────────────────────────────────────────────
// escortsStore.ts  — Fully dynamic API-backed store (no seed data)
// All data comes from: https://skokka-backend-live.onrender.com/api/escorts (MongoDB)
// ─────────────────────────────────────────────────────────────────

export interface EscortProfileItem {
  id: string;
  skId?: string;
  _mongoId?: string;
  name: string;
  title: string;
  city: string;
  location: string;
  category: string;
  age: number;
  rating: number;
  rate: string;
  price: number;
  availability: string;
  tags: string[];
  phone: string;
  whatsapp: string;
  telegram?: string;
  photoUrl: string;
  videoUrl?: string;
  gallery: string[];
  description: string;
  packageType: string;
  isVerified: boolean;
  isVip: boolean;
  isSuperTop?: boolean;
  status: "APPROVED" | "PENDING_APPROVAL" | "REJECTED";
  submittedAt: string;
  submittedBy?: string;
  utrNumber?: string;
}

// ── Config ────────────────────────────────────────────────
export const ESCORTS_UPDATE_EVENT = "skokka_escorts_config_updated";
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://skokka-backend-live.onrender.com";

// ── In-memory cache ───────────────────────────────────────
const CACHE_TTL_MS = 60_000; // 60 seconds
let _cachedProfiles: EscortProfileItem[] | null = null;
let _cacheTimestamp = 0;
let _inflight: Promise<EscortProfileItem[]> | null = null;

/** Fetch all APPROVED profiles — cached for 60s, deduplicated in-flight */
export async function fetchEscortProfiles(forceRefresh = false): Promise<EscortProfileItem[]> {
  const now = Date.now();

  // Return cached data if still fresh
  if (!forceRefresh && _cachedProfiles && now - _cacheTimestamp < CACHE_TTL_MS) {
    return _cachedProfiles;
  }

  // Deduplicate: if a request is already in-flight, wait for it
  if (_inflight) return _inflight;

  _inflight = (async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/escorts`, { cache: "no-store" });
      if (res.status === 429) {
        console.warn("fetchEscortProfiles: rate limited (429) — returning cached data");
        return _cachedProfiles || [];
      }
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      const data: EscortProfileItem[] = json.data || [];
      _cachedProfiles = data;
      _cacheTimestamp = Date.now();
      return data;
    } catch (err) {
      console.error("fetchEscortProfiles failed:", err);
      return _cachedProfiles || []; // fall back to last good cache
    } finally {
      _inflight = null;
    }
  })();

  return _inflight;
}

/** Invalidate cache (call after create/update/delete) */
export function invalidateEscortsCache() {
  _cachedProfiles = null;
  _cacheTimestamp = 0;
}


/** Fetch all profiles (admin panel — includes pending & rejected) */
export async function fetchAllEscortsAdmin(): Promise<EscortProfileItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/admin`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("fetchAllEscortsAdmin failed:", err);
    return [];
  }
}

/** Fetch single profile by id */
export async function fetchEscortById(id: string): Promise<EscortProfileItem | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("fetchEscortById failed:", err);
    return null;
  }
}

/** Create new escort profile */
export async function createEscortProfile(data: Partial<EscortProfileItem>, isAdmin = false): Promise<EscortProfileItem | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isAdmin ? { "x-admin-create": "true" } : {}),
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Create failed");
    invalidateEscortsCache();
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ESCORTS_UPDATE_EVENT));
    return json.data || null;
  } catch (err) {
    console.error("createEscortProfile failed:", err);
    return null;
  }
}

/** Update escort profile (admin) */
export async function updateEscortProfile(id: string, data: Partial<EscortProfileItem>): Promise<EscortProfileItem | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Update failed");
    invalidateEscortsCache();
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ESCORTS_UPDATE_EVENT));
    return json.data || null;
  } catch (err) {
    console.error("updateEscortProfile failed:", err);
    return null;
  }
}

/** Approve / Reject profile (admin) */
export async function setEscortStatus(id: string, status: "APPROVED" | "PENDING_APPROVAL" | "REJECTED"): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return false;
    invalidateEscortsCache();
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ESCORTS_UPDATE_EVENT));
    return true;
  } catch (err) {
    console.error("setEscortStatus failed:", err);
    return false;
  }
}

/** Set SUPER_TOP / VIP / Verified / Standard placement (admin) */
export async function setEscortPlacement(id: string, placement: "SUPER_TOP" | "VIP" | "VERIFIED" | "STANDARD"): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/${id}/placement`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placement }),
    });
    if (!res.ok) return false;
    invalidateEscortsCache();
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ESCORTS_UPDATE_EVENT));
    return true;
  } catch (err) {
    console.error("setEscortPlacement failed:", err);
    return false;
  }
}

/** Delete escort profile (admin) */
export async function deleteEscortProfile(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/${id}`, { method: "DELETE" });
    if (!res.ok) return false;
    invalidateEscortsCache();
    if (typeof window !== "undefined") window.dispatchEvent(new Event(ESCORTS_UPDATE_EVENT));
    return true;
  } catch (err) {
    console.error("deleteEscortProfile failed:", err);
    return false;
  }
}

/** Trigger one-time seed of default profiles in MongoDB */
export async function seedDefaultProfiles(): Promise<string> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/escorts/seed`, { method: "POST" });
    const json = await res.json();
    invalidateEscortsCache();
    return json.message || "Done";
  } catch (err) {
    return "Seed failed";
  }
}

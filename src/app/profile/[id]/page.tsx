"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchEscortById } from "@/utils/escortsStore";
import { getProfileUrl } from "@/lib/seo/seoHelpers";

// Old /profile/[id] route → redirect to new /escorts/{city}/{slug} URL
export default function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const resolvedParams = params instanceof Promise ? use(params as Promise<{ id: string }>) : params;
  const rawId = resolvedParams?.id || "";

  useEffect(() => {
    if (!rawId) return;
    fetchEscortById(rawId).then((profile) => {
      if (profile) {
        const newUrl = getProfileUrl(profile);
        router.replace(newUrl);
      }
    });
  }, [rawId, router]);

  return (
    <div className="min-h-screen bg-[#030614] flex items-center justify-center">
      <div className="text-white text-center space-y-3">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Redirecting...</p>
      </div>
    </div>
  );
}

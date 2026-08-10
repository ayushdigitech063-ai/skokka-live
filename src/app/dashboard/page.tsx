"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserDashboard } from "@/components/UserDashboard";

function DashboardContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const verifyLogin = searchParams.get("verify_login") === "true";

  return <UserDashboard initialEmail={email} initialVerifyLogin={verifyLogin} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
            <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            Loading Advertiser Private Area...
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

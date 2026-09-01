'use client';

import { useState, useEffect } from 'react';

export default function AgeVerificationModal() {
  // Step 1: 18+ Age Warning, Step 2: Cookie Consent, Step null: Closed
  const [step, setStep] = useState<number | null>(null);
  const [denied, setDenied] = useState<boolean>(false);
// sadglfasg
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isAgeVerified = sessionStorage.getItem('skokka_age_verified') || localStorage.getItem('skokka_age_verified');
    const isCookieAccepted = sessionStorage.getItem('skokka_cookie_accepted') || localStorage.getItem('skokka_cookie_accepted');

    if (isAgeVerified !== 'true') {
      setStep(1); // ALWAYS 18+ Age Verification FIRST
    } else if (isCookieAccepted !== 'true') {
      setStep(2); // THEN Cookies Modal SECOND
    } else {
      setStep(null); // Both completed
    }
  }, []);

  if (step === null) {
    return null; // Access granted, modal hidden
  }

  const detectUserCity = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      const data = await res.json();
      if (data && data.city) {
        if (typeof window !== "undefined") {
          localStorage.setItem("skokka_user_detected_city", data.city);
          window.dispatchEvent(new CustomEvent("skokka_city_detected", { detail: data.city }));
        }
      }
    } catch {
      // Fallback IP lookup if ipapi rate-limited
      try {
        const res2 = await fetch("https://ip-api.com/json/", { cache: "no-store" });
        const data2 = await res2.json();
        if (data2 && data2.city && typeof window !== "undefined") {
          localStorage.setItem("skokka_user_detected_city", data2.city);
          window.dispatchEvent(new CustomEvent("skokka_city_detected", { detail: data2.city }));
        }
      } catch (err) {
        console.warn("Location detection fallback:", err);
      }
    }
  };

  const handleAgeConfirm = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("skokka_age_verified", "true");
      localStorage.setItem("skokka_age_verified", "true");
    }
    detectUserCity();
    setStep(2); // Move immediately to Step 2: Cookie Modal
  };

  const handleAgeDeny = () => {
    setDenied(true);
  };

  const handleCookieAccept = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("skokka_cookie_accepted", "true");
      localStorage.setItem("skokka_cookie_accepted", "true");
    }
    detectUserCity();
    setStep(null); // Complete
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 selection:bg-pink-500/20">
      {/* Dark Blurred Backdrop Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md transition-all duration-300" />

      {/* White Clean Card Modal Container */}
      <div className="relative w-full max-w-[440px] rounded-2xl bg-white p-7 text-center shadow-2xl transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {denied ? (
          /* DENIED STATE */
          <div className="py-4 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-600 border border-rose-200">
              🚫
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs text-slate-600 leading-relaxed px-2">
              You must be at least 18 years old to access adult classified content on this website.
            </p>
            <a
              href="https://www.google.com"
              className="inline-block w-full rounded-xl bg-[#c2185b] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#a3124e] transition"
            >
              Exit to Google
            </a>
          </div>
        ) : step === 1 ? (
          /* STEP 1: 18+ AGE WARNING MODAL */
          <div className="py-2">
            {/* AVATAR BADGE WITH 18+ */}
            <div className="relative mx-auto mb-5 h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
              <div className="flex items-center -space-x-1.5">
                <div className="h-6 w-6 rounded-full bg-[#c2185b] flex items-center justify-center text-white text-[10px] font-bold">
                  👩
                </div>
                <div className="h-6 w-6 rounded-full bg-[#0284c7] flex items-center justify-center text-white text-[10px] font-bold">
                  👨
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#c2185b] text-[9px] font-black text-white shadow-xs">
                18+
              </span>
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug px-4">
              Please read the following warning before continuing
            </h2>

            {/* BODY TEXT */}
            <div className="mt-5 space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong className="font-bold text-slate-900">I am over 18 years old</strong> and I accept the viewing of explicit texts and images intended for an <strong className="font-bold text-slate-900">adult audience</strong>.
              </p>
              <p>
                I have read and accept the<br />
                <span className="text-[#c2185b] font-medium hover:underline cursor-pointer">
                  Terms and Conditions
                </span>
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleAgeConfirm}
                className="w-auto px-8 py-2.5 rounded-lg bg-[#c2185b] hover:bg-[#a3124e] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                ACCEPT
              </button>

              <button
                type="button"
                onClick={handleAgeDeny}
                className="text-xs text-[#c2185b] font-medium hover:underline cursor-pointer transition py-1"
              >
                Decline
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: COOKIE CONSENT MODAL */
          <div className="py-2 text-left">
            {/* TITLE */}
            <h2 className="text-lg font-bold text-slate-900 text-center tracking-tight mb-4">
              About cookies on this website
            </h2>

            {/* DESCRIPTION */}
            <p className="text-xs text-slate-600 leading-relaxed text-center px-1 mb-6">
              We use cookies to optimize the performance of this website and provide you with a better user experience in a personalized way. In the options you can choose your preferences for the use of cookies:
            </p>

            <hr className="border-slate-100 my-4" />

            {/* BUTTON ACTIONS */}
            <div className="flex flex-col items-center gap-3 my-4">
              <button
                type="button"
                onClick={handleCookieAccept}
                className="w-auto px-8 py-2.5 rounded-lg bg-[#c2185b] hover:bg-[#a3124e] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                ACCEPT ALL
              </button>

              <button
                type="button"
                onClick={handleCookieAccept}
                className="text-xs text-[#c2185b] font-bold uppercase tracking-wider hover:underline cursor-pointer transition py-1"
              >
                MANAGE COOKIES
              </button>
            </div>

            {/* FOOTER COOKIE NOTICE */}
            <p className="mt-6 text-[11px] text-slate-500 text-center leading-relaxed">
              For more information, please visit our{' '}
              <span className="text-[#c2185b] font-medium hover:underline cursor-pointer">
                Cookie Notice
              </span>{' '}
              and our{' '}
              <span className="text-[#c2185b] font-medium hover:underline cursor-pointer">
                Privacy Notice
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}


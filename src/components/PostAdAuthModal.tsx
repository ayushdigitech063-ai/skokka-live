"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  AlertCircle,
  Mail,
  ExternalLink
} from "lucide-react";

import { RecaptchaV2Widget } from "@/components/RecaptchaV2Widget";

interface PostAdAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: () => void;
  onSuccessActivate?: (user: any) => void;
}

export function PostAdAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
  onSuccessActivate,
}: PostAdAuthModalProps) {
  const [authTab, setAuthTab] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [inboxNotice, setInboxNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        setAuthTab("login");
        setInboxNotice(false);
      } else {
        document.body.style.overflow = "unset";
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please enter your email and password.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    if (authTab === "signup" && (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber)) {
      Swal.fire({
        title: "Weak Password",
        text: "Please meet all password checklist requirements.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    if (authTab === "signup" && !acceptedTerms) {
      Swal.fire({
        title: "Terms & Conditions Required",
        text: "Please accept the Terms & Privacy Policy to proceed.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    if (!captchaToken) {
      Swal.fire({
        title: "CAPTCHA Verification Required",
        text: "Please complete the CAPTCHA verification.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    setLoading(true);

    try {
      if (authTab === "signup") {
        // 1. Check duplicate email & Register in MongoDB Atlas with Google reCAPTCHA Token
        const regRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x"}/auth/user-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, captchaToken }),
        });
        const regJson = await regRes.json();

        if (!regRes.ok || !regJson.success) {
          setLoading(false);
          setCaptchaToken(null);
          Swal.fire({
            title: "Registration Failed",
            text: regJson.message || "Please complete the CAPTCHA verification.",
            icon: "warning",
            confirmButtonColor: "#d5639b",
          });
          return;
        }

        localStorage.setItem("skokka_user_email", email);
        setLoading(false);
        setCaptchaToken(null);
        setInboxNotice(true); // Shows clean inbox notice
      } else {
        // Direct Login Flow with Google reCAPTCHA Token
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x"}/auth/user-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, captchaToken }),
        });
        const loginJson = await loginRes.json();

        if (!loginRes.ok || !loginJson.success) {
          setLoading(false);
          setCaptchaToken(null);
          Swal.fire({
            title: "Login Failed",
            text: loginJson.message || "Please complete the CAPTCHA verification.",
            icon: "error",
            confirmButtonColor: "#d5639b",
          });
          return;
        }

        localStorage.setItem("skokka_user_email", email);
        if (loginJson.user?.customerCode) {
          localStorage.setItem("skokka_customer_code", loginJson.user.customerCode);
        }

        setLoading(false);
        if (onAuthenticated) onAuthenticated();
        if (onSuccessActivate) {
          onSuccessActivate({ email });
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      setLoading(false);
      Swal.fire({
        title: "Authentication Error",
        text: err.message || "Could not connect to server.",
        icon: "error",
        confirmButtonColor: "#d5639b",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto selection:bg-[#d5639b]/30">
      
      {/* PREMIUM STYLED CARD */}
      <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-7 max-w-[450px] w-full shadow-2xl relative font-['Plus_Jakarta_Sans',sans-serif] my-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-100/80 max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100/60 hover:bg-slate-100 transition p-2 rounded-full cursor-pointer focus:outline-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* INBOX NOTICE STATE */}
        {inboxNotice ? (
          <div className="text-center py-4 space-y-4">
            <div className="h-16 w-16 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-center mx-auto text-[#d5639b] shadow-sm">
              <Mail className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Check Your Email Inbox! 📩</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed px-2">
                We sent an account activation link to <strong className="text-[#d5639b] font-semibold">{email}</strong> via Nodemailer.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">Next Steps:</span>
              <p className="flex items-start gap-2 text-[12px] text-slate-600">
                <span className="font-bold text-[#d5639b]">1.</span> Open your email client (Gmail/Outlook).
              </p>
              <p className="flex items-start gap-2 text-[12px] text-slate-600">
                <span className="font-bold text-[#d5639b]">2.</span> Click <strong className="text-[#d5639b]">"🚀 VERIFY IDENTITY & ACTIVATE DASHBOARD"</strong>.
              </p>
              <p className="flex items-start gap-2 text-[12px] text-slate-600">
                <span className="font-bold text-[#d5639b]">3.</span> Access your Dashboard to create & post your classified ads instantly!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d5639b] to-[#c2417e] hover:from-[#c2528b] hover:to-[#b1356f] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Open Gmail Inbox <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                disabled={resending}
                onClick={async () => {
                  setResending(true);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x"}/auth/resend-activation`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    const json = await res.json();
                    setResending(false);
                    if (res.ok && json.success) {
                      Swal.fire({
                        title: "Email Resent! 📩",
                        text: "A fresh activation link was dispatched to your inbox.",
                        icon: "success",
                        confirmButtonColor: "#d5639b",
                      });
                    } else {
                      Swal.fire({
                        title: "Resend Failed",
                        text: json.message || "Could not resend activation link.",
                        icon: "error",
                        confirmButtonColor: "#d5639b",
                      });
                    }
                  } catch (e: any) {
                    setResending(false);
                    Swal.fire({
                      title: "Error",
                      text: "Could not connect to backend server.",
                      icon: "error",
                      confirmButtonColor: "#d5639b",
                    });
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer disabled:opacity-50"
              >
                {resending ? "Sending fresh link..." : "Resend Activation Link 🔄"}
              </button>

              <button
                type="button"
                onClick={() => setInboxNotice(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1 cursor-pointer transition"
              >
                Back to Sign Up
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="h-10 w-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-xl shrink-0 shadow-xs">
                🚀
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  Activate our exclusive promotions
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">Quick sign up to boost your ad visibility</p>
              </div>
            </div>

            {/* TAB TOGGLE: SIGN UP vs LOGIN */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl mb-5 text-xs font-bold border border-slate-200/50">
              <button
                type="button"
                onClick={() => setAuthTab("signup")}
                className={`py-2.5 rounded-xl transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                  authTab === "signup"
                    ? "bg-gradient-to-r from-[#d5639b] to-[#c2417e] text-white shadow-md shadow-pink-500/20 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`py-2.5 rounded-xl transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                  authTab === "login"
                    ? "bg-gradient-to-r from-[#d5639b] to-[#c2417e] text-white shadow-md shadow-pink-500/20 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* EMAIL FIELD */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#d5639b] focus:ring-4 focus:ring-[#d5639b]/10 transition"
                />
              </div>

              {/* PASSWORD FIELD */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#d5639b] focus:ring-4 focus:ring-[#d5639b]/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* PASSWORD CHECKLIST (SIGNUP ONLY) */}
              {authTab === "signup" && (
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-3">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider text-slate-500">Password requirements:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <span className={`flex items-center gap-1.5 transition-colors ${hasLowercase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasLowercase ? "text-emerald-500" : "text-slate-300"}`} /> A lowercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${hasUppercase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasUppercase ? "text-emerald-500" : "text-slate-300"}`} /> An uppercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${hasNumber ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasNumber ? "text-emerald-500" : "text-slate-300"}`} /> A number
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasMinLength ? "text-emerald-500" : "text-slate-300"}`} /> Min. 8 characters
                    </span>
                  </div>
                  
                  <hr className="border-slate-200/60" />

                  {/* TERMS & MARKETING TOGGLES */}
                  <div className="space-y-3 pt-0.5">
                    {/* TERMS TOGGLE */}
                    <div className="flex items-start gap-3 select-none">
                      <button
                        type="button"
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 shrink-0 mt-0.5 cursor-pointer focus:outline-none ${
                          acceptedTerms ? "bg-[#d5639b]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                            acceptedTerms ? "translate-x-[18px]" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <p 
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className="text-[11px] text-slate-600 leading-snug cursor-pointer"
                      >
                        <strong className="text-slate-800">Terms & Privacy Policy</strong><br />
                        I agree to the <span onClick={(e) => e.stopPropagation()} className="text-[#d5639b] font-medium hover:underline">Terms & Conditions</span> and <span onClick={(e) => e.stopPropagation()} className="text-[#d5639b] font-medium hover:underline">Privacy Policy</span>.
                      </p>
                    </div>

                    {/* MARKETING TOGGLE */}
                    <div className="flex items-start gap-3 select-none">
                      <button
                        type="button"
                        onClick={() => setAcceptedMarketing(!acceptedMarketing)}
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 shrink-0 mt-0.5 cursor-pointer focus:outline-none ${
                          acceptedMarketing ? "bg-[#d5639b]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${
                            acceptedMarketing ? "translate-x-[18px]" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <p 
                        onClick={() => setAcceptedMarketing(!acceptedMarketing)}
                        className="text-[11px] text-slate-600 leading-snug cursor-pointer"
                      >
                        <strong className="text-slate-800">Marketing Updates</strong><br />
                        Send me promotions, updates & news via email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* GOOGLE RECAPTCHA V2 CHECKBOX WIDGET */}
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs">
                <RecaptchaV2Widget
                  onVerify={(token) => setCaptchaToken(token)}
                  theme="light"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d5639b] to-[#c2417e] hover:from-[#c2528b] hover:to-[#b1356f] font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-xs">
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Mailing Activation Link...
                  </span>
                ) : authTab === "signup" ? (
                  "Create Account & Activate"
                ) : (
                  "Login & Post Ad"
                )}
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
}


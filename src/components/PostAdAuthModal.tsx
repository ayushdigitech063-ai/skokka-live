"use client";

import React, { useState, useEffect, useRef } from "react";
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
  KeyRound,
  Lock,
  ArrowLeft
} from "lucide-react";

import { RecaptchaV2Widget, RecaptchaV2Ref } from "@/components/RecaptchaV2Widget";

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
  // API URL: Live URL active
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

  const [authTab, setAuthTab] = useState<"signup" | "login" | "forgot">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaV2Ref>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inboxNotice, setInboxNotice] = useState(false);

  // Forgot password OTP flow state
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        setAuthTab("login");
        setForgotStep(1);
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
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

  const handleForgotPasswordClick = () => {
    setAuthTab("forgot");
    setForgotStep(1);
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Step 1: Send OTP
  const handleSendResetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      Swal.fire({
        title: "Email Required",
        text: "Please enter a valid email address.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/forgot-password-send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      setForgotLoading(false);

      if (!res.ok || !data.success) {
        Swal.fire({
          title: "Account Not Found",
          text: data.message || "No registered account found with this email.",
          icon: "error",
          confirmButtonColor: "#d5639b",
        });
        return;
      }

      setForgotStep(2);
      Swal.fire({
        title: "OTP Sent!",
        text: "A 6-digit verification code has been sent to your email address.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setForgotLoading(false);
      Swal.fire({
        title: "Connection Error",
        text: err.message || "Could not connect to backend server.",
        icon: "error",
        confirmButtonColor: "#d5639b",
      });
    }
  };

  // Step 2: Verify OTP
  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length < 6) {
      Swal.fire({
        title: "6-Digit OTP Required",
        text: "Please enter the complete 6-digit verification code.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: resetOtp }),
        }
      );
      const data = await res.json();
      setForgotLoading(false);

      if (!res.ok || !data.success) {
        Swal.fire({
          title: "Verification Failed",
          text: data.message || "Invalid or expired OTP code.",
          icon: "error",
          confirmButtonColor: "#d5639b",
        });
        return;
      }

      setForgotStep(3);
      Swal.fire({
        title: "OTP Verified!",
        text: "Please set your new password.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setForgotLoading(false);
      Swal.fire({
        title: "Error",
        text: err.message || "Verification failed.",
        icon: "error",
        confirmButtonColor: "#d5639b",
      });
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasMinLen = newPassword.length >= 8;
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNum = /[0-9]/.test(newPassword);

    if (!hasMinLen || !hasLower || !hasUpper || !hasNum) {
      Swal.fire({
        title: "Weak Password",
        text: "Password must be at least 8 characters long, contain uppercase & lowercase letters and a number.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Passwords Do Not Match",
        text: "New Password and Confirm Password fields must match.",
        icon: "warning",
        confirmButtonColor: "#d5639b",
      });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: resetOtp, newPassword }),
        }
      );
      const data = await res.json();
      setForgotLoading(false);

      if (!res.ok || !data.success) {
        Swal.fire({
          title: "Reset Failed",
          text: data.message || "Could not update password. Please try again.",
          icon: "error",
          confirmButtonColor: "#d5639b",
        });
        return;
      }

      setPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setResetOtp("");
      setForgotStep(1);
      setAuthTab("login");

      Swal.fire({
        title: "Password Reset Successful!",
        text: "Your password has been updated. Please log in with your new password.",
        icon: "success",
        confirmButtonColor: "#d5639b",
      });
    } catch (err: any) {
      setForgotLoading(false);
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to reset password.",
        icon: "error",
        confirmButtonColor: "#d5639b",
      });
    }
  };

  if (!isOpen) return null;

  // Password validation rules for Signup & New Password
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const hasNewMinLength = newPassword.length >= 8;
  const hasNewLowercase = /[a-z]/.test(newPassword);
  const hasNewUppercase = /[A-Z]/.test(newPassword);
  const hasNewNumber = /[0-9]/.test(newPassword);

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
        const regRes = await fetch(`${API_BASE_URL}/auth/user-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, captchaToken }),
        });
        const regJson = await regRes.json();

        if (!regRes.ok || !regJson.success) {
          setLoading(false);
          recaptchaRef.current?.reset();
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
        if (regJson.user?.customerCode) {
          localStorage.setItem("skokka_customer_code", regJson.user.customerCode);
        }
        setLoading(false);
        recaptchaRef.current?.reset();
        setCaptchaToken(null);

        Swal.fire({
          title: "Account Created!",
          text: "Registration successful! You are now logged in.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        if (onAuthenticated) onAuthenticated();
        if (onSuccessActivate) {
          onSuccessActivate({ email });
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        const loginRes = await fetch(`${API_BASE_URL}/auth/user-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, captchaToken }),
        });
        const loginJson = await loginRes.json();

        if (!loginRes.ok || !loginJson.success) {
          setLoading(false);
          recaptchaRef.current?.reset();
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
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
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
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100/60 hover:bg-slate-100 transition p-2 rounded-full cursor-pointer focus:outline-none z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {authTab === "forgot" ? (
          /* FORGOT PASSWORD MULTI-STEP FLOW */
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="h-10 w-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 shadow-xs text-[#d5639b]">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  Reset Password
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  {forgotStep === 1 && "Step 1 of 3: Enter registered email"}
                  {forgotStep === 2 && "Step 2 of 3: Verify 6-digit OTP code"}
                  {forgotStep === 3 && "Step 3 of 3: Set your new password"}
                </p>
              </div>
            </div>

            {/* STEP PROGRESS BAR */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${forgotStep >= 1 ? "bg-[#d5639b]" : "bg-slate-200"}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${forgotStep >= 2 ? "bg-[#d5639b]" : "bg-slate-200"}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${forgotStep === 3 ? "bg-[#d5639b]" : "bg-slate-200"}`}></div>
            </div>

            {/* STEP 1: ENTER EMAIL */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendResetOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Registered Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#d5639b] focus:ring-4 focus:ring-[#d5639b]/10 transition"
                    />
                    <Mail className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d5639b] to-[#c2417e] hover:from-[#c2528b] hover:to-[#b1356f] font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? (
                    <span className="flex items-center gap-2 text-xs">
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Sending OTP...
                    </span>
                  ) : (
                    "Send Verification OTP"
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: VERIFY OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyResetOtp} className="space-y-4">
                <div className="bg-pink-50/60 border border-pink-100 rounded-xl p-3 text-xs text-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">OTP sent to:</span>
                    <strong className="text-slate-900 font-semibold">{email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs font-semibold text-[#d5639b] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">6-Digit Verification OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-center text-lg font-bold tracking-[6px] placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#d5639b] focus:ring-4 focus:ring-[#d5639b]/10 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d5639b] to-[#c2417e] hover:from-[#c2528b] hover:to-[#b1356f] font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? (
                    <span className="flex items-center gap-2 text-xs">
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Verifying OTP...
                    </span>
                  ) : (
                    "Verify OTP Code"
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendResetOtp()}
                    className="text-xs text-[#d5639b] hover:underline font-semibold cursor-pointer"
                  >
                    Didn't get OTP? Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#d5639b] focus:ring-4 focus:ring-[#d5639b]/10 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#d5639b] focus:ring-4 focus:ring-[#d5639b]/10 transition"
                  />
                </div>

                {/* NEW PASSWORD CHECKLIST */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-2">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider text-slate-500">Password requirements:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <span className={`flex items-center gap-1.5 transition-colors ${hasNewLowercase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasNewLowercase ? "text-emerald-500" : "text-slate-300"}`} /> A lowercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${hasNewUppercase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasNewUppercase ? "text-emerald-500" : "text-slate-300"}`} /> An uppercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${hasNewNumber ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasNewNumber ? "text-emerald-500" : "text-slate-300"}`} /> A number
                    </span>
                    <span className={`flex items-center gap-1.5 transition-colors ${hasNewMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                      <CheckCircle2 className={`h-3.5 w-3.5 ${hasNewMinLength ? "text-emerald-500" : "text-slate-300"}`} /> Min. 8 characters
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d5639b] to-[#c2417e] hover:from-[#c2528b] hover:to-[#b1356f] font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-pink-500/25 transition duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? (
                    <span className="flex items-center gap-2 text-xs">
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Updating Password...
                    </span>
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </form>
            )}

            {/* BACK TO LOGIN BUTTON */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* AUTH MODAL CONTENT (SIGNUP / LOGIN) */
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
                onClick={() => {
                  setAuthTab("signup");
                  recaptchaRef.current?.reset();
                  setCaptchaToken(null);
                }}
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
                onClick={() => {
                  setAuthTab("login");
                  recaptchaRef.current?.reset();
                  setCaptchaToken(null);
                }}
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Password</label>
                  {authTab === "login" && (
                    <button
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="text-xs font-semibold text-[#d5639b] hover:underline hover:text-[#b84881] transition cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
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
                  <span className="font-bold text-[#d5639b] font-semibold block text-[11px] uppercase tracking-wider text-slate-500">Password requirements:</span>
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
                  ref={recaptchaRef}
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
                    Processing...
                  </span>
                ) : authTab === "signup" ? (
                  "Create Account"
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

"use client";

import React, { useEffect, useRef } from "react";

interface RecaptchaV2WidgetProps {
  siteKey?: string;
  onVerify: (token: string | null) => void;
  theme?: "dark" | "light";
}

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: string;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
    onloadRecaptchaCallback?: () => void;
  }
}

export function RecaptchaV2Widget({
  siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
  onVerify,
  theme = "dark",
}: RecaptchaV2WidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    let script = document.getElementById("google-recaptcha-v2-script") as HTMLScriptElement;

    const renderWidget = () => {
      if (window.grecaptcha && containerRef.current && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => onVerify(token),
            "expired-callback": () => onVerify(null),
            "error-callback": () => onVerify(null),
            theme: theme,
          });
        } catch (e) {
          console.warn("reCAPTCHA v2 render exception:", e);
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = "google-recaptcha-v2-script";
      script.src = "https://www.google.com/recaptcha/api.js?onload=onloadRecaptchaCallback&render=explicit";
      script.async = true;
      script.defer = true;
      window.onloadRecaptchaCallback = () => {
        renderWidget();
      };
      document.head.appendChild(script);
    } else {
      if (window.grecaptcha) {
        renderWidget();
      } else {
        window.onloadRecaptchaCallback = () => {
          renderWidget();
        };
      }
    }

    return () => {
      if (window.grecaptcha && widgetIdRef.current !== null) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme, onVerify]);

  return <div ref={containerRef} className="my-3 flex justify-center min-h-[78px]" />;
}

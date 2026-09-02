"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";

export interface RecaptchaV2Ref {
  reset: () => void;
}

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

export const RecaptchaV2Widget = forwardRef<RecaptchaV2Ref, RecaptchaV2WidgetProps>(
  (
    {
      siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Ld5O5YtAAAAAEhDx0oFEotCajOOzkE6KQgFO1GH",
      onVerify,
      theme = "dark",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const onVerifyRef = useRef(onVerify);

    useEffect(() => {
      onVerifyRef.current = onVerify;
    }, [onVerify]);

    const resetWidget = useCallback(() => {
      if (window.grecaptcha && widgetIdRef.current !== null) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.warn("reCAPTCHA reset error:", e);
        }
      }
      onVerifyRef.current(null);
    }, []);

    useImperativeHandle(ref, () => ({
      reset: resetWidget,
    }));

    useEffect(() => {
      let script = document.getElementById("google-recaptcha-v2-script") as HTMLScriptElement;

      const renderWidget = () => {
        if (
          window.grecaptcha &&
          containerRef.current &&
          widgetIdRef.current === null &&
          containerRef.current.children.length === 0
        ) {
          try {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => onVerifyRef.current(token),
              "expired-callback": () => onVerifyRef.current(null),
              "error-callback": () => onVerifyRef.current(null),
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
          const oldCallback = window.onloadRecaptchaCallback;
          window.onloadRecaptchaCallback = () => {
            if (oldCallback) oldCallback();
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
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      };
    }, [siteKey, theme]);

    return <div ref={containerRef} className="my-3 flex justify-center min-h-[78px]" />;
  }
);

RecaptchaV2Widget.displayName = "RecaptchaV2Widget";

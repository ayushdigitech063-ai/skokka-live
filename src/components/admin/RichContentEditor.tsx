"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Sparkles, Eye, Edit3, Code, Tag } from "lucide-react";

// Dynamically import ReactQuill to prevent Next.js SSR document is not defined errors
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-xs text-slate-500 font-semibold">
      Loading Quill Editor...
    </div>
  ),
});

interface RichContentEditorProps {
  value: string;
  onChange: (val: string) => void;
  locationName?: string;
  placeholder?: string;
  showAreaToken?: boolean;
  minHeight?: string;
}

export function RichContentEditor({
  value,
  onChange,
  locationName = "City",
  placeholder = "Write your SEO optimized editorial content here...",
  showAreaToken = false,
  minHeight = "280px",
}: RichContentEditorProps) {
  const [mode, setMode] = useState<"visual" | "html" | "preview">("visual");

  // Quill full-featured SEO toolbar modules
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }], // Text Color and Highlight Color
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
  ];

  const insertToken = (token: string) => {
    onChange((value || "") + ` ${token} `);
  };

  // Preview content with token replacement
  const renderedPreview = (value || "")
    .replace(/\{city\}/gi, locationName)
    .replace(/\{location\}/gi, locationName)
    .replace(/\[city\]/gi, locationName)
    .replace(/\[location\]/gi, locationName)
    .replace(/\{area\}/gi, locationName);

  return (
    <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-lg flex flex-col text-slate-800">
      {/* TOP HEADER: MODE TOGGLE & VARIABLES */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-100 border-b border-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            SEO Editor:
          </span>
          <button
            type="button"
            title="Insert {city} token"
            onClick={() => insertToken("{city}")}
            className="px-2 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200 transition text-[11px] font-bold cursor-pointer flex items-center gap-1"
          >
            <Tag className="h-3 w-3" />
            <span>{`{city}`}</span>
          </button>
          {showAreaToken && (
            <button
              type="button"
              title="Insert {area} token"
              onClick={() => insertToken("{area}")}
              className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 transition text-[11px] font-bold cursor-pointer flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              <span>{`{area}`}</span>
            </button>
          )}
        </div>

        {/* View Switcher: Visual / Raw HTML / Live Preview */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-200 rounded-xl border border-slate-300">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === "visual"
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Visual (Quill)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === "html"
                ? "bg-white text-cyan-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>HTML Source</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              mode === "preview"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* EDITOR CONTENT AREA */}
      <div className="p-3 bg-white">
        {mode === "visual" && (
          <div className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={value || ""}
              onChange={onChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              style={{ minHeight }}
            />
            <style jsx global>{`
              .quill-wrapper .ql-toolbar {
                border-top-left-radius: 0.75rem;
                border-top-right-radius: 0.75rem;
                background-color: #f8fafc;
                border-color: #cbd5e1;
              }
              .quill-wrapper .ql-container {
                border-bottom-left-radius: 0.75rem;
                border-bottom-right-radius: 0.75rem;
                border-color: #cbd5e1;
                font-family: inherit;
                font-size: 0.875rem;
                color: #0f172a;
              }
              .quill-wrapper .ql-editor {
                min-height: ${minHeight};
                line-height: 1.6;
              }
              .quill-wrapper .ql-editor a {
                color: #e11d48;
                font-weight: 700;
                text-decoration: underline;
              }
              .quill-wrapper .ql-editor h2 {
                font-size: 1.35rem;
                font-weight: 800;
                margin-top: 1rem;
                margin-bottom: 0.5rem;
                color: #020617;
              }
              .quill-wrapper .ql-editor h3 {
                font-size: 1.15rem;
                font-weight: 700;
                margin-top: 0.75rem;
                margin-bottom: 0.35rem;
                color: #0f172a;
              }
            `}</style>
          </div>
        )}

        {mode === "html" && (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-600 resize-y"
            style={{ minHeight }}
          />
        )}

        {mode === "preview" && (
          <div className="space-y-4 p-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Sparkles className="h-4 w-4" /> Live Render Preview
              </span>
              <span>Tokens replaced with: &quot;{locationName}&quot;</span>
            </div>
            {renderedPreview.trim() ? (
              <div
                className="text-sm text-slate-900 leading-relaxed space-y-3 prose max-w-none [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-950 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_p]:text-slate-800 [&_a]:text-rose-600 [&_a]:font-bold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-slate-800"
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
            ) : (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                Editor is empty. Type in Visual or HTML mode to see live preview.
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER BAR: STATS */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-t border-slate-300 text-[11px] text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            Mode: <strong className="text-slate-900 capitalize">{mode}</strong>
          </span>
          <span>
            Characters:{" "}
            <strong className="text-slate-900">{(value || "").length}</strong>
          </span>
          <span>
            Words:{" "}
            <strong className="text-slate-900">
              {(value || "").trim()
                ? (value || "").trim().split(/\s+/).length
                : 0}
            </strong>
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium">
          Powered by React-Quill &bull; Clean HTML Output for SEO
        </div>
      </div>
    </div>
  );
}

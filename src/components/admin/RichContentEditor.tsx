"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Code,
  Eye,
  Edit3,
  Sparkles,
  RotateCcw,
  Tag,
} from "lucide-react";

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
  placeholder = "Type your custom SEO content here...",
  showAreaToken = false,
  minHeight = "280px",
}: RichContentEditorProps) {
  const [mode, setMode] = useState<"visual" | "html" | "preview">("visual");
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const savedSelectionRef = useRef<Range | null>(null);

  // Synchronize internal visual editor with value when switching to visual or when value changed externally
  useEffect(() => {
    if (visualEditorRef.current && mode === "visual") {
      if (visualEditorRef.current.innerHTML !== value) {
        visualEditorRef.current.innerHTML = value || "";
      }
    }
  }, [value, mode]);

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (mode !== "visual") return;
    visualEditorRef.current?.focus();
    try {
      document.execCommand(command, false, arg);
      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    } catch (e) {
      console.warn("execCommand error:", e);
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      onChange(visualEditorRef.current.innerHTML);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
      const selected = sel.toString();
      if (selected) setLinkText(selected);
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelectionRef.current);
    }
  };

  const handleOpenLinkModal = () => {
    saveSelection();
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    setShowLinkModal(false);
    if (!linkUrl.trim()) return;

    if (mode === "visual") {
      restoreSelection();
      visualEditorRef.current?.focus();

      const href = linkUrl.trim();
      const text = linkText.trim() || href;

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        document.execCommand("createLink", false, href);
      } else {
        const linkHtml = `<a href="${href}" class="text-rose-600 hover:underline font-bold" target="_blank">${text}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
      }

      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    } else {
      const linkHtml = `<a href="${linkUrl.trim()}" class="text-rose-600 hover:underline font-bold" target="_blank">${linkText.trim() || linkUrl.trim()}</a>`;
      onChange(value ? `${value} ${linkHtml}` : linkHtml);
    }

    setLinkUrl("");
    setLinkText("");
  };

  const insertToken = (token: string) => {
    if (mode === "visual") {
      visualEditorRef.current?.focus();
      document.execCommand("insertText", false, token);
      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    } else {
      onChange(value ? `${value} ${token}` : token);
    }
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
      {/* TOOLBAR HEADER - LIGHT THEME (NO BLACK COLOR) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 border-b border-slate-300">
        {/* Left Toolbar Formatting Controls */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            title="Heading 2"
            onClick={() => executeCommand("formatBlock", "<h2>")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition font-bold text-xs cursor-pointer flex items-center gap-0.5"
          >
            <Heading2 className="h-4 w-4 text-slate-800" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => executeCommand("formatBlock", "<h3>")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition font-bold text-xs cursor-pointer flex items-center gap-0.5"
          >
            <Heading3 className="h-4 w-4 text-slate-800" />
          </button>
          <button
            type="button"
            title="Heading 4"
            onClick={() => executeCommand("formatBlock", "<h4>")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition font-bold text-xs cursor-pointer flex items-center gap-0.5"
          >
            <Heading4 className="h-4 w-4 text-slate-800" />
          </button>
          <button
            type="button"
            title="Paragraph"
            onClick={() => executeCommand("formatBlock", "<p>")}
            className="px-2 py-1 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition font-bold text-xs cursor-pointer"
          >
            P
          </button>

          <span className="h-4 w-px bg-slate-300 mx-1" />

          {/* Text Styling */}
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => executeCommand("underline")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => executeCommand("strikeThrough")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <span className="h-4 w-px bg-slate-300 mx-1" />

          {/* Lists */}
          <button
            type="button"
            title="Bullet List"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <span className="h-4 w-px bg-slate-300 mx-1" />

          {/* Links */}
          <button
            type="button"
            title="Insert Link"
            onClick={handleOpenLinkModal}
            className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-100 transition cursor-pointer flex items-center gap-1 font-bold"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Remove Link"
            onClick={() => executeCommand("unlink")}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer"
          >
            <Unlink className="h-4 w-4" />
          </button>

          <span className="h-4 w-px bg-slate-300 mx-1" />

          {/* Dynamic Tags */}
          <button
            type="button"
            title="Insert dynamic {city} variable tag"
            onClick={() => insertToken("{city}")}
            className="px-2 py-1 rounded-lg bg-cyan-100 text-cyan-800 border border-cyan-300 hover:bg-cyan-200 transition text-[11px] font-bold cursor-pointer flex items-center gap-1"
          >
            <Tag className="h-3 w-3" />
            <span>{'{city}'}</span>
          </button>

          {showAreaToken && (
            <button
              type="button"
              title="Insert dynamic {area} variable tag"
              onClick={() => insertToken("{area}")}
              className="px-2 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 transition text-[11px] font-bold cursor-pointer flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              <span>{'{area}'}</span>
            </button>
          )}

          <button
            type="button"
            title="Clear formatting"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Right Mode Toggle (Visual / HTML / Preview) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "visual"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "html"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "preview"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* LINK INSERTION MODAL POPOVER */}
      {showLinkModal && (
        <div className="p-3 bg-slate-50 border-b border-slate-300 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-cyan-800 flex items-center gap-1">
            <LinkIcon className="h-3.5 w-3.5" /> Link:
          </span>
          <input
            type="text"
            placeholder="URL (e.g. /escorts-service/delhi/call-girls or https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 shadow-sm"
          />
          <input
            type="text"
            placeholder="Anchor text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="w-40 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 shadow-sm"
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Insert Link
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* EDITOR WORK AREA - WHITE PAPER CANVAS (NO BLACK COLOR) */}
      <div className="relative flex-1 p-4 bg-white" style={{ minHeight }}>
        {mode === "visual" && (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            data-placeholder={placeholder}
            className="w-full h-full min-h-[240px] text-sm text-slate-900 bg-white focus:outline-none leading-relaxed space-y-3 prose max-w-none [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-950 [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-2 [&_h3]:mb-1 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_p]:text-slate-800 [&_p]:leading-relaxed [&_a]:text-rose-600 [&_a]:font-bold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-slate-800 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
            style={{ color: "#0f172a" }}
          />
        )}

        {mode === "html" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={10}
            className="w-full h-full min-h-[240px] bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-600 resize-y"
          />
        )}

        {mode === "preview" && (
          <div className="space-y-4">
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
            Characters: <strong className="text-slate-900">{value.length}</strong>
          </span>
          <span>
            Words:{" "}
            <strong className="text-slate-900">
              {value.trim() ? value.trim().split(/\s+/).length : 0}
            </strong>
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium">
          Clean HTML Output &bull; Ready for SEO
        </div>
      </div>
    </div>
  );
}

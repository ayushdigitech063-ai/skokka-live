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
  placeholder = "Write or format your custom SEO page content...",
  showAreaToken = false,
  minHeight = "260px",
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
        const linkHtml = `<a href="${href}" class="text-rose-400 hover:underline font-bold" target="_blank">${text}</a>`;
        document.execCommand("insertHTML", false, linkHtml);
      }

      if (visualEditorRef.current) {
        onChange(visualEditorRef.current.innerHTML);
      }
    } else {
      // In HTML mode
      const linkHtml = `<a href="${linkUrl.trim()}" class="text-rose-400 hover:underline font-bold" target="_blank">${linkText.trim() || linkUrl.trim()}</a>`;
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
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl flex flex-col">
      {/* TOOLBAR HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 border-b border-slate-800">
        {/* Left Toolbar Formatting Controls */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            title="Heading 2 (Section Title)"
            onClick={() => executeCommand("formatBlock", "<h2>")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold text-xs cursor-pointer flex items-center gap-0.5"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 3 (Sub-heading)"
            onClick={() => executeCommand("formatBlock", "<h3>")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold text-xs cursor-pointer flex items-center gap-0.5"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Heading 4 (Minor heading)"
            onClick={() => executeCommand("formatBlock", "<h4>")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold text-xs cursor-pointer flex items-center gap-0.5"
          >
            <Heading4 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Paragraph Text"
            onClick={() => executeCommand("formatBlock", "<p>")}
            className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition font-bold text-[11px] cursor-pointer"
          >
            P
          </button>

          <span className="h-4 w-px bg-slate-700/60 mx-1" />

          {/* Text Styling */}
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => executeCommand("underline")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => executeCommand("strikeThrough")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          <span className="h-4 w-px bg-slate-700/60 mx-1" />

          {/* Lists */}
          <button
            type="button"
            title="Bullet List"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>

          <span className="h-4 w-px bg-slate-700/60 mx-1" />

          {/* Links */}
          <button
            type="button"
            title="Insert Link"
            onClick={handleOpenLinkModal}
            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition cursor-pointer flex items-center gap-1"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Remove Link"
            onClick={() => executeCommand("unlink")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <Unlink className="h-3.5 w-3.5" />
          </button>

          <span className="h-4 w-px bg-slate-700/60 mx-1" />

          {/* Dynamic Tags */}
          <button
            type="button"
            title="Insert dynamic {city} variable tag"
            onClick={() => insertToken("{city}")}
            className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition text-[11px] font-bold cursor-pointer flex items-center gap-1"
          >
            <Tag className="h-3 w-3" />
            <span>{'{city}'}</span>
          </button>

          {showAreaToken && (
            <button
              type="button"
              title="Insert dynamic {area} variable tag"
              onClick={() => insertToken("{area}")}
              className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition text-[11px] font-bold cursor-pointer flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              <span>{'{area}'}</span>
            </button>
          )}

          <button
            type="button"
            title="Remove all formatting"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Mode Toggle (Visual / HTML / Preview) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "visual"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "html"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code className="h-3 w-3" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "preview"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* LINK INSERTION MODAL POPOVER */}
      {showLinkModal && (
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
            <LinkIcon className="h-3.5 w-3.5" /> Link:
          </span>
          <input
            type="text"
            placeholder="URL (e.g. /escorts-service/delhi/call-girls or https://...)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <input
            type="text"
            placeholder="Anchor text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="w-40 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Insert Link
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* EDITOR WORK AREA */}
      <div className="relative flex-1 p-4 bg-slate-950/70" style={{ minHeight }}>
        {mode === "visual" && (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            data-placeholder={placeholder}
            className="w-full h-full min-h-[220px] text-xs sm:text-sm text-slate-200 focus:outline-none leading-relaxed space-y-3 prose prose-invert max-w-none [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-white [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-white [&_p]:text-slate-300 [&_a]:text-rose-400 [&_a]:font-bold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-slate-300 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-600 empty:before:pointer-events-none"
          />
        )}

        {mode === "html" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={10}
            className="w-full h-full min-h-[220px] bg-transparent text-xs text-emerald-300 font-mono leading-relaxed focus:outline-none resize-y"
          />
        )}

        {mode === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="h-3.5 w-3.5" /> Live Frontend Render
              </span>
              <span>Dynamic tokens replaced with: &quot;{locationName}&quot;</span>
            </div>
            {renderedPreview.trim() ? (
              <div
                className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 prose prose-invert max-w-none [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-white [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-white [&_p]:text-slate-300 [&_a]:text-rose-400 [&_a]:font-bold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-slate-300"
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
            ) : (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                Editor is empty. Type in Visual or HTML mode to see live preview.
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER BAR: STATS */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Mode: <strong className="text-white capitalize">{mode}</strong>
          </span>
          <span>
            Characters: <strong className="text-white">{value.length}</strong>
          </span>
          <span>
            Words:{" "}
            <strong className="text-white">
              {value.trim() ? value.trim().split(/\s+/).length : 0}
            </strong>
          </span>
        </div>
        <div className="text-[10px] text-slate-500">
          Supports HTML tags, styling, lists, and links
        </div>
      </div>
    </div>
  );
}

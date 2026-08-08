"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  Wand2,
  FileText,
  Check,
  Copy,
  Download,
  Eye,
  Edit3,
  Columns,
  Bold,
  Italic,
  Heading2,
  List,
  ListTodo,
  Code,
  Quote,
  Table,
  Save,
  Loader2,
  Zap,
  Clock,
  Type,
  ChevronDown,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface RoadmapNotesEditorProps {
  notes: string;
  roadmapTitle?: string;
  onSave: (newNotes: string) => Promise<void>;
  saving?: boolean;
}

export default function RoadmapNotesEditor({
  notes,
  roadmapTitle,
  onSave,
  saving = false,
}: RoadmapNotesEditorProps) {
  const [value, setValue] = useState(notes || "");
  const [mode, setMode] = useState<"edit" | "split" | "preview">("split");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync internal state if prop notes change externally
  useEffect(() => {
    setValue(notes || "");
    setIsDirty(false);
  }, [notes]);

  // Handle value change
  const handleChange = (val: string) => {
    setValue(val);
    setIsDirty(true);
  };

  // Keyboard shortcut Ctrl+S / Cmd+S for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value]);

  const handleSave = async () => {
    try {
      await onSave(value);
      setLastSaved(new Date());
      setIsDirty(false);
    } catch {
      // toast error handled in parent
    }
  };

  // Insert markdown tag at current cursor position
  const insertMarkdown = (prefix: string, suffix: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setValue((prev) => prev + `${prefix}${defaultText}${suffix}`);
      setIsDirty(true);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    setValue(newValue);
    setIsDirty(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Run AI Action
  const runAiAction = async (action: "polish" | "summarize" | "expand") => {
    if (!value.trim()) {
      toast.error("Please add some notes before running AI tools.");
      return;
    }

    try {
      setAiLoading(action);
      setAiMenuOpen(false);

      const res = await fetch("/api/ai/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: value,
          action,
          context: roadmapTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI action failed");

      if (action === "summarize") {
        // Append summary to bottom of notes
        setValue((prev) => `${prev.trim()}\n\n${data.result}`);
        toast.success("AI Summary added to notes!");
      } else {
        // Replace or update notes
        setValue(data.result);
        toast.success(
          action === "polish" ? "Notes polished with AI!" : "Notes expanded with AI!"
        );
      }
      setIsDirty(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to execute AI action");
    } finally {
      setAiLoading(null);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Notes copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Export as .md file
  const handleExportMd = () => {
    const filename = `${(roadmapTitle || "roadmap").toLowerCase().replace(/\s+/g, "-")}-notes.md`;
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${filename}`);
  };

  // Stats calculation
  const wordCount = useMemo(() => {
    const trimmed = value.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [value]);

  const charCount = value.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#09090c] shadow-2xl transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-4 z-50 flex flex-col bg-[#09090c]/98 backdrop-blur-2xl"
          : "space-y-0 overflow-hidden"
      }`}
    >
      {/* ── 1. Top Header & Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight font-sora">
                Roadmap Notes & Specs
              </h3>
              <span className="flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-400">
                <Sparkles size={10} /> AI Enhanced
              </span>
            </div>
            <p className="text-[11px] text-[#8a8a93]">
              Rich Markdown notes, architectural specs & AI assistant.
            </p>
          </div>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              onClick={() => setMode("edit")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mode === "edit"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-[#8a8a93] hover:text-white"
              }`}
              title="Edit Mode"
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setMode("split")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mode === "split"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-[#8a8a93] hover:text-white"
              }`}
              title="Split View Mode"
            >
              <Columns size={13} />
              <span>Split</span>
            </button>
            <button
              onClick={() => setMode("preview")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                mode === "preview"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-[#8a8a93] hover:text-white"
              }`}
              title="Preview Rendered Markdown"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>

          {/* AI Tools Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setAiMenuOpen(!aiMenuOpen)}
              disabled={!!aiLoading}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-all shadow-sm"
            >
              {aiLoading ? (
                <Loader2 size={13} className="animate-spin text-amber-400" />
              ) : (
                <Wand2 size={13} className="text-amber-400" />
              )}
              <span>AI Assistant</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {aiMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0d0d12] p-2 shadow-2xl backdrop-blur-xl"
                >
                  <button
                    onClick={() => runAiAction("polish")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-all"
                  >
                    <Wand2 size={14} className="text-orange-400" />
                    <div>
                      <div className="font-semibold">Polish & Format</div>
                      <div className="text-[10px] text-[#8a8a93]">Fix grammar & markdown structure</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runAiAction("summarize")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-all"
                  >
                    <Zap size={14} className="text-amber-400" />
                    <div>
                      <div className="font-semibold">Auto-Summarize</div>
                      <div className="text-[10px] text-[#8a8a93]">Generate action items & executive summary</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runAiAction("expand")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-white hover:bg-white/10 transition-all"
                  >
                    <Sparkles size={14} className="text-purple-400" />
                    <div>
                      <div className="font-semibold">Expand Tech Specs</div>
                      <div className="text-[10px] text-[#8a8a93]">Flesh out rough notes into tech specs</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Copy & Export */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[#8a8a93] hover:border-white/20 hover:text-white transition-all"
            title="Copy Markdown"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          <button
            onClick={handleExportMd}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-[#8a8a93] hover:border-white/20 hover:text-white transition-all"
            title="Export as .md File"
          >
            <Download size={13} />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-all ${
              isDirty
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
                : "bg-white/10 hover:bg-white/20 text-white/90"
            }`}
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span>{saving ? "Saving..." : "Save Notes"}</span>
            <span className="hidden lg:inline-block text-[10px] text-white/60 font-mono">
              (Ctrl+S)
            </span>
          </button>
        </div>
      </div>

      {/* ── 3. Main Workspace Area ── */}
      <div
        className={`grid gap-0 ${
          mode === "split"
            ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10"
            : "grid-cols-1"
        } ${isFullscreen ? "flex-1 min-h-0" : ""}`}
      >
        {/* Editor Area */}
        {mode !== "preview" && (
          <div className="relative flex flex-col h-full bg-[#09090c]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Write down key roadmap notes, architectural decisions, technical specs, links, or draft ideas (Supports GitHub Flavored Markdown)..."
              className={`w-full bg-[#09090c] p-4 sm:p-6 text-xs sm:text-sm font-mono text-white placeholder-[#5a5a63] focus:outline-none resize-none leading-relaxed custom-scrollbar ${
                isFullscreen ? "h-full" : "min-h-[380px] h-full"
              }`}
            />
          </div>
        )}

        {/* Live Rendered Markdown Preview Area */}
        {mode !== "edit" && (
          <div
            className={`flex flex-col bg-[#07070a] p-4 sm:p-6 overflow-y-auto custom-scrollbar ${
              isFullscreen ? "h-full" : "min-h-[380px] max-h-[600px]"
            }`}
          >
            {value.trim() ? (
              <div className="prose prose-invert prose-sm max-w-none space-y-3 text-xs sm:text-sm text-slate-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg sm:text-xl font-extrabold text-white pb-2 border-b border-white/10 font-sora mt-4 mb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base sm:text-lg font-bold text-white mt-4 mb-2 font-sora text-orange-400">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-white mt-3 mb-1 font-sora text-amber-300">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed my-1.5">
                        {children}
                      </div>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 text-slate-300 my-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1 text-slate-300 my-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="my-0.5">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-orange-500/60 bg-orange-500/5 px-4 py-2 rounded-r-xl italic text-slate-300 my-3">
                        {children}
                      </blockquote>
                    ),
                    pre: ({ children }) => (
                      <pre className="rounded-xl border border-white/10 bg-[#040406] p-3 font-mono text-xs text-emerald-300 overflow-x-auto my-3">
                        {children}
                      </pre>
                    ),
                    code: ({ inline, className, children, ...props }: any) => {
                      if (inline) {
                        return (
                          <code
                            className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-amber-300"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return <code className="font-mono text-xs text-emerald-300" {...props}>{children}</code>;
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3 rounded-xl border border-white/10 bg-white/[0.01]">
                        <table className="w-full text-left text-xs border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border-b border-white/10 bg-white/[0.04] p-2.5 font-semibold text-white">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border-b border-white/5 p-2.5 text-slate-300">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-xl">
                <FileText size={32} className="text-[#4a4a52] mb-2" />
                <p className="text-xs font-semibold text-[#8a8a93]">
                  No Notes Content Yet
                </p>
                <p className="text-[11px] text-[#5a5a63] mt-1 max-w-xs">
                  Switch to Edit mode or use AI Assistant to start drafting technical specs and notes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Footer Metadata Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-[11px] text-[#8a8a93]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Type size={12} className="text-[#8a8a93]" />
            <strong className="text-white">{wordCount}</strong> words
          </span>
          <span className="flex items-center gap-1">
            <strong className="text-white">{charCount}</strong> characters
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-[#8a8a93]" />
            ~<strong className="text-white">{readingTimeMin}</strong> min read
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isDirty ? (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium" suppressHydrationWarning>
              <Check size={12} />
              {lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Saved"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

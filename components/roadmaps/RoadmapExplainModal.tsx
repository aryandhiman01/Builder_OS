"use client";

import { X, Sparkles, BookOpen, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RoadmapExplainModalProps {
  open: boolean;
  topic: string;
  explanation: string;
  loading: boolean;
  onClose: () => void;
}

export default function RoadmapExplainModal({
  open,
  topic,
  explanation,
  loading,
  onClose,
}: RoadmapExplainModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#09090c] p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h3
                className="text-base font-bold text-white line-clamp-1"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                AI Explanation: {topic}
              </h3>
              <p className="text-xs text-[#8a8a93]">
                Deep technical breakdown & best practices curated by BuilderOS AI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8a8a93] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6 pr-2 scrollbar-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 size={28} className="animate-spin text-orange-400" />
              <p className="text-xs text-[#8a8a93]">
                Generating technical breakdown for <span className="text-white font-semibold">{topic}</span>...
              </p>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none text-xs leading-relaxed prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-white prose-code:text-blue-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {explanation}
              </ReactMarkdown>
            </article>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

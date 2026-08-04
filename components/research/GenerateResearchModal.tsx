"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Loader2,
  X,
  Sparkles,
  Zap,
} from "lucide-react";

interface GenerateResearchModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export default function GenerateResearchModal({
  open,
  onClose,
  projectId,
}: GenerateResearchModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const quickPrompts = [
    { label: "Competitor Matrix", title: "Competitor Analysis & Market Positioning", prompt: "Perform a deep-dive competitor analysis for this product. Outline top 3 direct competitors, feature matrix, pricing strategy, and competitive advantages." },
    { label: "Target Audience", title: "Target Persona & User Journeys", prompt: "Identify the primary and secondary target user personas. Detail key pain points, core demographics, user motivation, and ideal customer profile (ICP)." },
    { label: "Market Sizing", title: "Market Sizing & Growth Potential", prompt: "Analyze the total addressable market (TAM), serviceable addressable market (SAM), and serviceable obtainable market (SOM) with industry CAGR trends." },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Research title is required.");
      return;
    }

    if (prompt.trim().length < 10) {
      setError("Prompt must contain at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message ?? "Failed to generate research.");
      }

      router.refresh();
      setTitle("");
      setPrompt("");
      onClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const handleApplyQuickPrompt = (item: { title: string; prompt: string }) => {
    setTitle(item.title);
    setPrompt(item.prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#09090c] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <Brain size={20} />
              </div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                Generate AI Research Brief
              </h2>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#8a8a93]">
              Describe your product idea or choose a quick prompt to generate structured market insights.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-[#8a8a93] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Prompts Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a93]">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                type="button"
                onClick={() => handleApplyQuickPrompt(qp)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-[#8a8a93] hover:border-orange-500/30 hover:bg-white/[0.08] hover:text-white transition active:scale-95"
              >
                <Sparkles size={13} className="text-orange-400" />
                <span>{qp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
              Research Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI CRM Market Research & Competitor Analysis"
              className="
              w-full
              rounded-xl
              border
              border-white/15
              bg-black/60
              px-4
              py-3.5
              text-xs sm:text-sm
              text-white
              placeholder-[#8a8a93]
              outline-none
              transition-all
              focus:border-orange-500/60
              focus:ring-2
              focus:ring-orange-500/20
              "
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8a8a93]">
              Product Brief / Research Prompt
            </label>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your product idea, target industry, key features, and specific research questions..."
              className="
              w-full
              resize-none
              rounded-xl
              border
              border-white/15
              bg-black/60
              px-4
              py-3.5
              text-xs sm:text-sm
              text-white
              placeholder-[#8a8a93]
              outline-none
              transition-all
              focus:border-orange-500/60
              focus:ring-2
              focus:ring-orange-500/20
              "
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-[#8a8a93] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-white/10 transition-all hover:bg-zinc-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  <span>Generating AI Research...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-orange-500" />
                  <span>Generate Research Brief</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
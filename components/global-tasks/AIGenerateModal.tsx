"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Loader2, Check, FolderKanban, ChevronRight, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  color: string;
}

interface GeneratedTask {
  title: string;
  description: string;
  priority: string;
  estimatedHours: number;
  tags: string[];
}

interface AIGenerateModalProps {
  open: boolean;
  projects: Project[];
  onClose: () => void;
  onSuccess: () => void;
}

const PRIORITY_CONFIG: Record<string, { bg: string; color: string }> = {
  high: { bg: "bg-orange-500/10 border-orange-500/20", color: "text-orange-400" },
  medium: { bg: "bg-yellow-500/10 border-yellow-500/20", color: "text-yellow-400" },
  low: { bg: "bg-green-500/10 border-green-500/20", color: "text-green-400" },
};

const EXAMPLE_PROMPTS = [
  "Build a SaaS MVP with auth, dashboard and billing",
  "Create a REST API with Prisma and Next.js",
  "Launch a landing page with waitlist",
  "Build a mobile app with React Native",
];

export default function AIGenerateModal({
  open,
  projects,
  onClose,
  onSuccess,
}: AIGenerateModalProps) {
  const [step, setStep] = useState<"input" | "preview">("input");
  const [projectId, setProjectId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");

  const selectedProject = projects.find((p) => p.id === projectId);

  const reset = () => {
    setStep("input"); setPrompt(""); setProjectId(""); setGeneratedTasks([]);
    setSelectedTaskIds(new Set()); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Please enter a prompt"); return; }
    if (!projectId) { setError("Please select a project"); return; }

    setError("");
    setGenerating(true);

    try {
      const res = await fetch("/api/tasks/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), projectTitle: selectedProject?.title }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to generate tasks"); return; }

      setGeneratedTasks(data.tasks || []);
      setSelectedTaskIds(new Set((data.tasks || []).map((_: unknown, i: number) => i)));
      setStep("preview");
    } catch (err) {
      console.error(err);
      setError("AI generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    setSaving(true);
    setError("");

    try {
      const tasksToSave = generatedTasks.filter((_, i) => selectedTaskIds.has(i));

      await Promise.all(
        tasksToSave.map((t) =>
          fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: t.title,
              description: t.description,
              priority: t.priority,
              estimatedHours: t.estimatedHours,
              tags: t.tags,
              projectId,
              status: "todo",
            }),
          })
        )
      );
      reset();
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to save tasks");
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = (i: number) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 overlay-animate-in cursor-pointer"
      />

      <div
        className="modal-animate-in relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#090909] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 sm:h-10 w-9 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Brain size={17} className="text-orange-400/90 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                AI Task Generator
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8a8a93]">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white touch-manipulation cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicator — Subtle dark tabs */}
        <div className="flex border-b border-white/[0.07] bg-white/[0.01]">
          {(["input", "preview"] as const).map((s, i) => (
            <div
              key={s}
              className={`flex flex-1 items-center gap-2 sm:gap-2.5 px-3.5 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold transition ${
                step === s
                  ? "text-orange-400 bg-white/[0.03]"
                  : "text-[#8a8a93]"
              }`}
            >
              <span className={`flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold transition ${
                step === s || (s === "input" && step === "preview")
                  ? "bg-orange-500/20 border border-orange-500/30 text-orange-400"
                  : "bg-white/10 text-[#8a8a93]"
              }`}>
                {s === "input" && step === "preview" ? <Check size={10} /> : i + 1}
              </span>
              <span className="truncate">{s === "input" ? "Describe Goal" : "Review & Approve"}</span>
              {i === 0 && <ChevronRight size={14} className="text-[#8a8a93]/60 ml-auto hidden xs:block" />}
            </div>
          ))}
        </div>

        <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6">
          {step === "input" ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Project selector */}
              <div>
                <label className="mb-1.5 sm:mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
                  <FolderKanban size={12} /> Target Project *
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#111] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white outline-none focus:border-white/20"
                >
                  <option value="" disabled>-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Prompt */}
              <div>
                <label className="mb-1.5 sm:mb-2 block text-xs font-semibold text-[#8a8a93]">
                  Describe what you're building
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Build a SaaS MVP with Next.js, Prisma, NextAuth, and Stripe payment integration..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-[#8a8a93] outline-none focus:border-white/20"
                />
              </div>

              {/* Examples */}
              <div>
                <span className="mb-1.5 sm:mb-2 block text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                  Try an example
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {EXAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs text-[#8a8a93] transition hover:border-orange-500/30 hover:bg-orange-500/[0.04] hover:text-orange-300 text-left touch-manipulation cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 xs:flex-none rounded-2xl border border-white/10 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-[#8a8a93] transition hover:bg-white/[0.05] hover:text-white touch-manipulation cursor-pointer"
                >
                  Cancel
                </button>
                {/* Clean Solid White Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim() || !projectId}
                  className="btn-shimmer flex-1 xs:flex-none flex items-center justify-center gap-2 rounded-2xl bg-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-black shadow-sm transition hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation cursor-pointer"
                >
                  {generating ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Brain size={16} className="text-orange-400" /> Generate Tasks</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-[#8a8a93]">
                  <span className="font-bold text-white">{generatedTasks.length} tasks</span> generated for{" "}
                  <span className="font-bold text-orange-400">{selectedProject?.title}</span>
                </p>
                <button
                  onClick={() => {
                    if (selectedTaskIds.size === generatedTasks.length) {
                      setSelectedTaskIds(new Set());
                    } else {
                      setSelectedTaskIds(new Set(generatedTasks.map((_, i) => i)));
                    }
                  }}
                  className="text-xs text-orange-400 hover:underline font-semibold touch-manipulation cursor-pointer"
                >
                  {selectedTaskIds.size === generatedTasks.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              {/* Task list */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {generatedTasks.map((task, i) => {
                  const isSelected = selectedTaskIds.has(i);
                  const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                  return (
                    <div
                      key={i}
                      onClick={() => toggleTask(i)}
                      className={`flex items-start gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-3.5 transition cursor-pointer touch-manipulation ${
                        isSelected
                          ? "border-orange-500/30 bg-orange-500/[0.04]"
                          : "border-white/[0.06] bg-white/[0.02] opacity-60"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        isSelected ? "border-orange-500/60 bg-orange-500/20 text-orange-400" : "border-white/20"
                      }`}>
                        {isSelected && <Check size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white">{task.title}</p>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-[#8a8a93] line-clamp-2">{task.description}</p>
                        <div className="mt-2 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold capitalize ${pCfg.bg} ${pCfg.color}`}>
                            {task.priority}
                          </span>
                          {task.estimatedHours && (
                            <span className="text-[9px] sm:text-[10px] text-[#8a8a93]">~{task.estimatedHours}h</span>
                          )}
                          {(task.tags || []).map((t) => (
                            <span key={t} className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-[#8a8a93]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => { setStep("input"); setError(""); }}
                  className="text-xs text-[#8a8a93] transition hover:text-white touch-manipulation cursor-pointer"
                >
                  ← Back
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleClose}
                    className="rounded-2xl border border-white/10 px-3.5 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-[#8a8a93] transition hover:bg-white/[0.05] hover:text-white touch-manipulation cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || selectedTaskIds.size === 0}
                    className="btn-shimmer flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-white px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50 active:scale-95 touch-manipulation cursor-pointer"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    <span>{saving ? "Saving..." : `Save ${selectedTaskIds.size} Task${selectedTaskIds.size !== 1 ? "s" : ""}`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

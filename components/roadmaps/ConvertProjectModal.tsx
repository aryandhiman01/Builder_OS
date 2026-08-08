"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  Loader2,
  FolderKanban,
  CheckCircle2,
  ArrowRight,
  Brain,
  FileText,
  CheckSquare,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { RoadmapCardData } from "./RoadmapCard";

interface ConvertProjectModalProps {
  open: boolean;
  roadmap: RoadmapCardData | null;
  onClose: () => void;
}

export default function ConvertProjectModal({
  open,
  roadmap,
  onClose,
}: ConvertProjectModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(roadmap?.title || "");
  const [description, setDescription] = useState(roadmap?.description || "");
  const [category, setCategory] = useState("SaaS");
  const [color, setColor] = useState("#f97316");

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  if (!open || !roadmap) return null;

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    if (!roadmap) return;

    try {
      setLoading(true);
      setActiveStep(1); // Creating project workspace

      // Step animations simulator
      const stepTimer1 = setTimeout(() => setActiveStep(2), 1500); // Research
      const stepTimer2 = setTimeout(() => setActiveStep(3), 3000); // PRD
      const stepTimer3 = setTimeout(() => setActiveStep(4), 4500); // Architecture & Tasks

      const res = await fetch(`/api/roadmaps/${roadmap.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || roadmap.title,
          description: description || roadmap.description,
          category,
          color,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to convert roadmap.");

      setActiveStep(5); // Complete!
      toast.success("Roadmap successfully converted to Project!");
      
      setTimeout(() => {
        onClose();
        router.push(`/projects/${data.projectId}`);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to convert roadmap.");
      setLoading(false);
      setActiveStep(0);
    }
  }

  const stepsList = [
    { text: "Creating Project Workspace", icon: FolderKanban },
    { text: "Generating Technical & Market Research", icon: Brain },
    { text: "Creating PRD (Product Requirements Document)", icon: FileText },
    { text: "Building System Architecture", icon: Sparkles },
    { text: "Converting Roadmap Steps to Active Tasks", icon: CheckSquare },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#09090c] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-orange-400 uppercase tracking-wider">
              ⭐ Killer Feature
            </span>
            <h3
              className="mt-1 text-lg font-bold text-white flex items-center gap-2"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              Convert Roadmap To Project
            </h3>
            <p className="text-xs text-[#8a8a93]">
              Roadmap planning turns directly into an executable BuilderOS workspace.
            </p>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#8a8a93] hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {loading ? (
          /* Live Progress Conversion State */
          <div className="my-8 space-y-4">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 animate-pulse">
                <Sparkles size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">Converting Roadmap...</h4>
              <p className="text-xs text-[#8a8a93]">
                AI is generating Research, PRD, Architecture, and Tasks based on your roadmap.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              {stepsList.map((stepItem, idx) => {
                const stepNum = idx + 1;
                const isDone = activeStep > stepNum;
                const isCurrent = activeStep === stepNum;
                const Icon = stepItem.icon;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-xs transition-all ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : isCurrent
                        ? "border-orange-500/50 bg-orange-500/10 text-white font-semibold"
                        : "border-white/5 bg-white/[0.02] text-[#8a8a93]"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 size={16} className="animate-spin text-orange-400 shrink-0" />
                    ) : (
                      <Icon size={16} className="shrink-0" />
                    )}
                    <span>{stepItem.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Conversion Form */
          <form onSubmit={handleConvert} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8a8a93]">
                Project Name
              </label>
              <input
                type="text"
                defaultValue={roadmap.title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090c] px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8a8a93]">
                Project Description
              </label>
              <textarea
                rows={3}
                defaultValue={roadmap.description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="AI Product Platform..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090c] p-3 text-xs text-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8a8a93]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#09090c] px-3.5 py-2.5 text-xs text-white focus:border-white/30 focus:outline-none cursor-pointer"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="AI Product">AI Product</option>
                  <option value="Web App">Web App</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Internal Tool">Internal Tool</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8a8a93]">
                  Color Accent
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-white/10 bg-[#09090c] p-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-xs text-[#8a8a93] leading-relaxed">
              <p className="font-semibold text-white mb-1">What happens when you click Convert?</p>
              BuilderOS AI automatically generates Research, PRD, Architecture, and converts all roadmap steps into active Kanban tasks inside your new project!
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-[#8a8a93] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-shimmer flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-lg transition hover:bg-zinc-100 active:scale-95"
              >
                <Rocket size={15} />
                <span>Convert To Project</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

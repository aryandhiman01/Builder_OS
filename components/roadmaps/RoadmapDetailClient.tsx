"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  FolderKanban,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  FileText,
  Loader2,
  MapPin,
  Calendar,
  CheckSquare,
  Plus,
  BarChart2,
  StickyNote,
  ExternalLink,
  Wand2,
  Rocket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import RoadmapExplainModal from "./RoadmapExplainModal";
import { ResourceItem } from "./RoadmapResourcesModal";
import ConvertProjectModal from "./ConvertProjectModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import RoadmapNotesEditor from "./RoadmapNotesEditor";

interface RoadmapStepData {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  estimatedHours: number | null;
  order: number;
}

interface RoadmapMilestoneData {
  id: string;
  title: string;
  description: string | null;
  order: number;
  steps: RoadmapStepData[];
}

interface RoadmapDetailData {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  progress: number;
  estimatedDuration: string | null;
  resources: string | null;
  notes: string | null;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string | null;
  project?: {
    id: string;
    title: string;
    color: string;
  } | null;
  milestones: RoadmapMilestoneData[];
}

interface RoadmapDetailClientProps {
  initialRoadmap: RoadmapDetailData;
}

export default function RoadmapDetailClient({
  initialRoadmap,
}: RoadmapDetailClientProps) {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<RoadmapDetailData>(initialRoadmap);

  const [activeTab, setActiveTab] = useState<
    "milestones" | "timeline" | "resources" | "progress" | "notes"
  >("milestones");

  // AI Feature States
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainTopic, setExplainTopic] = useState("");
  const [explainText, setExplainText] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);

  const [resourcesList, setResourcesList] = useState<ResourceItem[]>(() => {
    if (initialRoadmap.resources) {
      try {
        return JSON.parse(initialRoadmap.resources);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [resourcesLoading, setResourcesLoading] = useState(false);

  const [convertOpen, setConvertOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [improving, setImproving] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesText, setNotesText] = useState(initialRoadmap.notes || "");

  // Delete Standalone Roadmap
  async function handleDeleteRoadmap() {
    try {
      setDeleting(true);
      const res = await fetch(`/api/roadmaps/${roadmap.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete roadmap");

      toast.success("Standalone Roadmap deleted successfully!");
      router.push("/roadmaps");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete roadmap");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  // Calculate totals
  let totalSteps = 0;
  let completedSteps = 0;
  let totalHours = 0;

  roadmap.milestones.forEach((m) => {
    totalSteps += m.steps.length;
    m.steps.forEach((s) => {
      if (s.completed) completedSteps++;
      totalHours += s.estimatedHours || 2;
    });
  });

  const progressPercent =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : Math.round(roadmap.progress || 0);

  // Toggle step completed state
  async function handleToggleStep(stepId: string, currentCompleted: boolean) {
    try {
      // Optimistic update
      setRoadmap((prev) => {
        const nextMilestones = prev.milestones.map((m) => ({
          ...m,
          steps: m.steps.map((s) =>
            s.id === stepId ? { ...s, completed: !currentCompleted } : s
          ),
        }));

        let tSteps = 0;
        let cSteps = 0;
        nextMilestones.forEach((m) => {
          tSteps += m.steps.length;
          cSteps += m.steps.filter((s) => s.completed).length;
        });

        const newProg = tSteps > 0 ? Math.round((cSteps / tSteps) * 100) : 0;

        return {
          ...prev,
          milestones: nextMilestones,
          progress: newProg,
        };
      });

      const res = await fetch(`/api/roadmaps/${roadmap.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toggleStepId: stepId,
          completed: !currentCompleted,
        }),
      });

      if (!res.ok) throw new Error("Failed to update step");
    } catch (err) {
      toast.error("Failed to update step");
      router.refresh();
    }
  }

  // Trigger AI Improve / Generate
  async function handleAiImprove() {
    try {
      setImproving(true);
      toast.info(
        roadmap.milestones.length === 0
          ? "AI is generating roadmap milestones and structure..."
          : "AI is analyzing your roadmap and finding missing milestones..."
      );

      const res = await fetch(`/api/roadmaps/${roadmap.id}/improve`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate roadmap content");

      setRoadmap(data.roadmap);
      toast.success(data.summary || "Roadmap generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate roadmap content");
    } finally {
      setImproving(false);
    }
  }

  // Trigger AI Explain Step
  async function handleAiExplain(stepTitle: string, stepDescription?: string | null, milestoneTitle?: string) {
    try {
      setExplainTopic(stepTitle);
      setExplainText("");
      setExplainLoading(true);
      setExplainOpen(true);

      const res = await fetch(`/api/roadmaps/${roadmap.id}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepTitle,
          stepDescription,
          milestoneTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to explain topic");

      setExplainText(data.explanation);
    } catch (err: any) {
      toast.error(err.message || "Failed to explain topic");
    } finally {
      setExplainLoading(false);
    }
  }

  // Trigger AI Resources
  async function handleFetchResources() {
    try {
      setResourcesLoading(true);

      const res = await fetch(`/api/roadmaps/${roadmap.id}/resources`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch resources");

      setResourcesList(data.resources || []);
      toast.success("Resources curated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch resources");
    } finally {
      setResourcesLoading(false);
    }
  }

  // Save Notes
  async function handleSaveNotes(newNotesText?: string) {
    const textToSave = newNotesText !== undefined ? newNotesText : notesText;
    try {
      setSavingNotes(true);
      const res = await fetch(`/api/roadmaps/${roadmap.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: textToSave }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      setNotesText(textToSave);
      toast.success("Notes saved!");
    } catch (err) {
      toast.error("Failed to save notes");
      throw err;
    } finally {
      setSavingNotes(false);
    }
  }

  const isStandalone =
    roadmap.type === "STANDALONE" && !roadmap.projectId && !roadmap.project;

  return (
    <div className="space-y-8 max-w-full pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/roadmaps"
            prefetch={true}
            className="flex items-center gap-1.5 text-xs text-[#8a8a93] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Roadmaps</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              {isStandalone ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                  <Layers size={13} />
                  Standalone
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                  <FolderKanban size={13} />
                  {roadmap.project?.title || "Project Roadmap"}
                </span>
              )}

              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-orange-400">
                {roadmap.status}
              </span>
            </div>

            <h1
              className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {roadmap.title}
            </h1>

            {roadmap.description && (
              <p className="mt-1 text-xs text-[#8a8a93] max-w-3xl leading-relaxed">
                {roadmap.description}
              </p>
            )}
          </div>

          {/* AI Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleAiImprove}
              disabled={improving}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 active:scale-95 disabled:opacity-50"
            >
              {improving ? (
                <Loader2 size={14} className="animate-spin text-purple-400" />
              ) : (
                <Wand2 size={14} className="text-purple-400" />
              )}
              <span>
                {roadmap.milestones.length === 0
                  ? "Generate Roadmap with AI"
                  : "AI Improve"}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("resources");
                if (resourcesList.length === 0 && !resourcesLoading) {
                  handleFetchResources();
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 active:scale-95"
            >
              <BookOpen size={14} className="text-emerald-400" />
              <span>Resources ({resourcesList.length})</span>
            </button>

            {isStandalone && (
              <>
                <button
                  onClick={() => setConvertOpen(true)}
                  className="btn-shimmer flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg transition hover:bg-zinc-100 active:scale-95"
                >
                  <Rocket size={14} />
                  <span>Convert To Project</span>
                </button>

                <button
                  onClick={() => setDeleteOpen(true)}
                  disabled={deleting}
                  title="Delete Standalone Roadmap"
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin text-red-400" />
                  ) : (
                    <Trash2 size={14} className="text-red-400" />
                  )}
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: "milestones", label: "Milestones & Checklist", icon: CheckSquare },
          { id: "timeline", label: "Timeline", icon: Calendar },
          { id: "resources", label: "Resources", icon: BookOpen },
          { id: "progress", label: "Progress", icon: BarChart2 },
          { id: "notes", label: "Notes", icon: StickyNote },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-[#8a8a93] hover:text-white"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Milestones & Checklist Tab */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          {roadmap.milestones.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#09090c] p-10 text-center">
              <p className="text-xs text-[#8a8a93]">No milestones defined yet.</p>
              <button
                onClick={handleAiImprove}
                disabled={improving}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 disabled:opacity-50"
              >
                {improving ? (
                  <Loader2 size={14} className="animate-spin text-purple-400" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>Generate Milestones with AI</span>
              </button>
            </div>
          ) : (
            roadmap.milestones.map((m, mIdx) => (
              <div
                key={m.id}
                className="rounded-2xl border border-white/10 bg-[#09090c] p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">
                      Milestone {mIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{m.title}</h3>
                    {m.description && (
                      <p className="text-xs text-[#8a8a93] mt-0.5">{m.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {m.steps.map((step) => (
                    <div
                      key={step.id}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStep(step.id, step.completed)}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                            step.completed
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                              : "border-white/20 bg-white/5 text-transparent hover:border-white/40"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                        </button>
                        <div>
                          <span
                            className={`text-xs font-semibold transition-all ${
                              step.completed
                                ? "text-[#8a8a93] line-through"
                                : "text-white"
                            }`}
                          >
                            {step.title}
                          </span>
                          {step.description && (
                            <p className="text-[11px] text-[#8a8a93] mt-0.5">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {step.estimatedHours && (
                          <span className="text-[10px] font-mono text-[#8a8a93] bg-white/5 px-2 py-0.5 rounded-full">
                            {step.estimatedHours}h
                          </span>
                        )}

                        {/* Explain Button */}
                        <button
                          onClick={() => handleAiExplain(step.title, step.description, m.title)}
                          title="Explain concept with AI"
                          className="flex items-center gap-1 text-[11px] font-medium text-blue-400 opacity-0 group-hover:opacity-100 hover:underline transition-opacity"
                        >
                          <HelpCircle size={13} />
                          <span>Explain</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="rounded-2xl border border-white/10 bg-[#09090c] p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white">Roadmap Timeline & Phases</h3>
            <p className="text-xs text-[#8a8a93]">Sequential breakdown across estimated duration.</p>
          </div>

          <div className="relative border-l-2 border-orange-500/30 pl-6 space-y-8 my-4 ml-3">
            {roadmap.milestones.map((m, idx) => (
              <div key={m.id} className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-orange-500 bg-[#09090c]" />
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                  <span className="text-[11px] font-mono text-orange-400 font-bold uppercase">
                    Phase {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <div className="space-y-1.5 pt-2">
                    {m.steps.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 text-xs text-[#8a8a93]">
                        <CheckCircle2
                          size={13}
                          className={s.completed ? "text-emerald-400" : "text-zinc-600"}
                        />
                        <span className={s.completed ? "line-through" : ""}>{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Resources Tab */}
      {activeTab === "resources" && (
        <div className="rounded-2xl border border-white/10 bg-[#09090c] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Curated Resources</h3>
              <p className="text-xs text-[#8a8a93]">Documentation, Courses, Videos, and Repositories.</p>
            </div>
            <button
              onClick={handleFetchResources}
              disabled={resourcesLoading}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
            >
              {resourcesLoading ? (
                <Loader2 size={14} className="animate-spin text-emerald-400" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>Fetch AI Resources</span>
            </button>
          </div>

          {resourcesLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 size={28} className="animate-spin text-emerald-400" />
              <p className="text-xs text-[#8a8a93]">
                AI is searching and curating best docs, videos & repositories...
              </p>
            </div>
          ) : resourcesList.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-[#8a8a93]">No resources curated yet.</p>
              <button
                onClick={handleFetchResources}
                disabled={resourcesLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
              >
                <Sparkles size={14} />
                <span>Generate Resources with AI</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourcesList.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <BookOpen size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {res.title}
                        </h4>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-[#8a8a93]">
                          {res.type}
                        </span>
                      </div>
                      {res.description && (
                        <p className="mt-1 text-xs text-[#8a8a93] line-clamp-2">
                          {res.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <ExternalLink size={16} className="text-[#8a8a93] group-hover:text-white shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Progress Tab */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border border-white/10 bg-[#09090c] p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white">Completion Metrics</h3>
            <p className="text-xs text-[#8a8a93]">Overall analytics and step completion performance.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
              <span className="text-3xl font-bold font-mono text-orange-400">{progressPercent}%</span>
              <p className="text-xs text-[#8a8a93] mt-1 font-semibold">Total Progress</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
              <span className="text-3xl font-bold font-mono text-emerald-400">
                {completedSteps}/{totalSteps}
              </span>
              <p className="text-xs text-[#8a8a93] mt-1 font-semibold">Steps Completed</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
              <span className="text-3xl font-bold font-mono text-blue-400">{totalHours}h</span>
              <p className="text-xs text-[#8a8a93] mt-1 font-semibold">Estimated Effort</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Notes Tab */}
      {activeTab === "notes" && (
        <RoadmapNotesEditor
          notes={notesText}
          roadmapTitle={roadmap.title}
          onSave={handleSaveNotes}
          saving={savingNotes}
        />
      )}

      {/* MODALS */}
      <RoadmapExplainModal
        open={explainOpen}
        topic={explainTopic}
        explanation={explainText}
        loading={explainLoading}
        onClose={() => setExplainOpen(false)}
      />

      <ConvertProjectModal
        open={convertOpen}
        roadmap={{
          id: roadmap.id,
          title: roadmap.title,
          description: roadmap.description,
          type: roadmap.type,
          status: roadmap.status,
          progress: roadmap.progress,
          milestonesCount: roadmap.milestones.length,
          stepsCount: totalSteps,
          completedStepsCount: completedSteps,
        }}
        onClose={() => setConvertOpen(false)}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Standalone Roadmap"
        description={`Are you sure you want to permanently delete "${roadmap.title}"? This action cannot be undone.`}
        confirmText="Delete Roadmap"
        cancelText="Cancel"
        danger={true}
        loading={deleting}
        onConfirm={handleDeleteRoadmap}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar, Clock, Tag, FolderKanban, Loader2 } from "lucide-react";
import type { GlobalTask } from "./GlobalTasksClient";

interface Project {
  id: string;
  title: string;
  color: string;
}

interface GlobalCreateTaskModalProps {
  open: boolean;
  projects: Project[];
  onClose: () => void;
  onSuccess: (newTask: GlobalTask) => void;
}

export default function GlobalCreateTaskModal({
  open,
  projects,
  onClose,
  onSuccess,
}: GlobalCreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setTitle(""); setDescription(""); setProjectId("");
    setPriority("medium"); setStatus("todo"); setDueDate("");
    setEstimatedHours(""); setTagsInput(""); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Task title is required"); return; }
    if (!projectId) { setError("Please select a project"); return; }

    setError("");
    setLoading(true);

    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          projectId,
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create task"); return; }

      reset();
      onSuccess(data.task);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 overlay-animate-in cursor-pointer"
      />

      {/* Modal Container — Spacious & Perfectly Proportioned */}
      <div
        className="modal-animate-in relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl border border-white/10 bg-[#090909] p-4 sm:p-6 md:p-7 shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute right-4 sm:right-5 top-4 sm:top-5 rounded-xl p-2 text-[#8a8a93] transition hover:bg-white/5 hover:text-white touch-manipulation cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-3.5 mb-4 sm:mb-5">
          <div className="flex h-10 sm:h-11 w-10 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10">
            <Plus size={18} className="text-orange-400 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
              New Task
            </h2>
            <p className="text-xs text-[#8a8a93]">Add a task to any of your projects.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Project (required) */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
              <FolderKanban size={13} /> Project <span className="text-red-400">*</span>
            </label>
            {projects.length === 0 ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm text-red-400">
                No projects found. Create a project first.
              </div>
            ) : (
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 transition"
              >
                <option value="" disabled>-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Design Landing Page"
              autoFocus
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none transition focus:border-white/20"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 transition"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date & Est. Hours */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
                <Calendar size={12} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
                <Clock size={12} /> Est. Hours
              </label>
              <input
                type="number"
                min="0.5"
                max="40"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g. 2"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none focus:border-white/20 transition"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
              <Tag size={12} /> Tags <span className="font-normal text-[#8a8a93]/60">(comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="frontend, api, testing"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none focus:border-white/20 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-2 sm:pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 xs:flex-none rounded-2xl border border-white/10 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-[#8a8a93] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50 touch-manipulation cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || projects.length === 0}
              className="btn-shimmer flex-1 xs:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:opacity-50 active:scale-95 shadow-sm touch-manipulation cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

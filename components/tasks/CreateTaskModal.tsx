"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Calendar,
  Clock,
  Tag,
  Flag,
  Loader2,
} from "lucide-react";

interface CreateTaskModalProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  projectId,
  open,
  onClose,
}: CreateTaskModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate("");
    setEstimatedHours("");
    setTagsInput("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
          tags,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create task");
      }

      handleClose();
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

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
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute right-4 sm:right-5 top-4 sm:top-5 rounded-xl p-2 text-[#8a8a93] transition hover:bg-white/5 hover:text-white touch-manipulation cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-3.5 mb-4 sm:mb-5">
          <div className="flex h-10 sm:h-11 w-10 sm:w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
            <Plus size={18} className="text-orange-400 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2
              className="text-lg sm:text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              New Task
            </h2>
            <p className="text-xs text-[#8a8a93]">
              Add a task to this project.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
              Task Title *
            </label>
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
            <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 transition cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#8a8a93]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-2.5 text-sm text-white outline-none focus:border-white/20 transition cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date & Estimated Hours */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
                <Calendar size={13} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
                <Clock size={13} /> Est. Hours
              </label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g. 4"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#8a8a93]">
              <Tag size={13} /> Tags{" "}
              <span className="text-[11px] font-normal text-[#8a8a93]/60">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="frontend, api, bug"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-[#8a8a93] outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
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
              disabled={loading}
              className="btn-shimmer flex-1 xs:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-zinc-100 disabled:opacity-50 active:scale-95 shadow-sm touch-manipulation cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
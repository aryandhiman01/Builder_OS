"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Flag,
  Calendar,
  Clock,
  Tag,
  FolderKanban,
  CheckSquare,
  Trash2,
  Pencil,
  CheckCircle2,
  Circle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import type { GlobalTask } from "./GlobalTasksClient";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskDrawerProps {
  task: GlobalTask | null;
  projects: { id: string; title: string; color: string }[];
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<GlobalTask>) => void;
  onDelete: (taskId: string) => void;
}

const PRIORITY_OPTIONS = ["high", "medium", "low"];
const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Done" },
];

const PRIORITY_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  high: { bg: "bg-orange-500/10 border-orange-500/20", color: "text-orange-400", label: "High" },
  medium: { bg: "bg-yellow-500/10 border-yellow-500/20", color: "text-yellow-400", label: "Medium" },
  low: { bg: "bg-green-500/10 border-green-500/20", color: "text-green-400", label: "Low" },
};

export default function TaskDrawer({ task, onClose, onUpdate, onDelete }: TaskDrawerProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
      setEstimatedHours(task.estimatedHours?.toString() || "");
      try {
        setSubtasks(task.subtasks ? JSON.parse(task.subtasks) : []);
      } catch {
        setSubtasks([]);
      }
      setEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!task) return;
    setSaving(true);
    const updates = {
      title: title.trim() || task.title,
      description: description || null,
      status,
      priority,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      subtasks: JSON.stringify(subtasks),
    };
    await onUpdate(task.id, updates as Partial<GlobalTask>);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    await onDelete(task.id);
    setDeleting(false);
  };

  const toggleSubtask = (id: string) => {
    const updated = subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s));
    setSubtasks(updated);
    if (task) {
      onUpdate(task.id, { subtasks: JSON.stringify(updated) } as Partial<GlobalTask>);
    }
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const updated = [...subtasks, { id: Date.now().toString(), title: newSubtask.trim(), completed: false }];
    setSubtasks(updated);
    setNewSubtask("");
    if (task) {
      onUpdate(task.id, { subtasks: JSON.stringify(updated) } as Partial<GlobalTask>);
    }
  };

  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const pCfg = task ? (PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium) : PRIORITY_CONFIG.medium;

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-[480px] flex-col border-l border-white/10 bg-[#09090c] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${pCfg.bg} ${pCfg.color}`}>
                  {pCfg.label}
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-medium text-[#8a8a93]"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: task.project.color || "#8a8a93" }}
                  />
                  {task.project.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
                  >
                    <Pencil size={13} />
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/[0.05] text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#8a8a93] transition hover:text-white hover:bg-white/[0.07]"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-none">
              {/* Title */}
              <div>
                {editing ? (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-lg font-bold text-white outline-none focus:border-orange-500/40"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
                    {task.title}
                  </h2>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                  <CheckSquare size={11} /> Description
                </label>
                {editing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Add a description..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                  />
                ) : (
                  <p className="text-sm text-[#8a8a93] leading-relaxed">
                    {task.description || <span className="italic opacity-50">No description</span>}
                  </p>
                )}
              </div>

              {/* Meta fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                    <Flag size={11} /> Status
                  </label>
                  {editing ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm font-semibold text-white capitalize">
                      {STATUS_OPTIONS.find((s) => s.value === task.status)?.label || task.status}
                    </span>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                    <Flag size={11} /> Priority
                  </label>
                  {editing ? (
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none capitalize"
                    >
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`text-sm font-semibold capitalize ${pCfg.color}`}>
                      {task.priority}
                    </span>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                    <Calendar size={11} /> Due Date
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : <span className="text-[#8a8a93] italic">Not set</span>
                      }
                    </span>
                  )}
                </div>

                {/* Estimated Hours */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                    <Clock size={11} /> Est. Hours
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      min="0.5"
                      max="40"
                      step="0.5"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {task.estimatedHours ? `${task.estimatedHours}h` : <span className="text-[#8a8a93] italic">Not set</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {task.tags && (
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                    <Tag size={11} /> Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(task.tags || "[]").map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-[#8a8a93]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtasks */}
              <div>
                <label className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                  <CheckSquare size={11} /> Subtasks
                  {subtasks.length > 0 && (
                    <span className="ml-auto text-[10px] font-normal">
                      {completedSubtasks}/{subtasks.length}
                    </span>
                  )}
                </label>

                {/* Progress bar */}
                {subtasks.length > 0 && (
                  <div className="mb-3 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                    >
                      <button onClick={() => toggleSubtask(st.id)} className="shrink-0">
                        {st.completed ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : (
                          <Circle size={16} className="text-[#8a8a93]" />
                        )}
                      </button>
                      <span
                        className={`text-sm flex-1 ${st.completed ? "line-through text-[#8a8a93]" : "text-white"}`}
                      >
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add subtask */}
                <div className="mt-2 flex gap-2">
                  <input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                    placeholder="Add subtask..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-[#8a8a93] outline-none focus:border-white/20"
                  />
                  <button
                    onClick={addSubtask}
                    disabled={!newSubtask.trim()}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Activity */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a8a93]">
                  <Clock size={11} /> Activity
                </label>
                <div className="space-y-2 text-xs text-[#8a8a93]">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8a8a93]" />
                    Task created on {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8a8a93]" />
                    Last updated {new Date(task.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="shrink-0 border-t border-white/[0.07] px-6 py-4">
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <p className="flex-1 text-xs text-red-400">Delete this task? This cannot be undone.</p>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-[#8a8a93] hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 rounded-xl bg-red-500/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                  >
                    {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Delete
                  </button>
                </div>
              ) : editing ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-[#8a8a93] transition hover:text-white hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-100 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  <Pencil size={13} /> Edit Task
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

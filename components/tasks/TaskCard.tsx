"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

import {
  CalendarDays,
  Pencil,
  Trash2,
  Loader2,
  Flame,
  Zap,
  CheckCircle2,
} from "lucide-react";

import ActionMenu from "@/components/ui/ActionMenu";

import { Task } from "./TaskBoard";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "../ui/ConfirmModal";

interface TaskCardProps {
  task: Task;
}

const priorityConfig = {
  high: {
    label: "High",
    style: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: Flame,
  },
  medium: {
    label: "Medium",
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Zap,
  },
  low: {
    label: "Low",
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
};

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function deleteTask() {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task.");
      }

      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    {
      label: "Edit Task",
      icon: <Pencil size={13} />,
      onClick: () => setEditOpen(true),
    },
    {
      label: "Delete Task",
      icon: <Trash2 size={13} />,
      danger: true,
      onClick: () => setDeleteOpen(true),
    },
  ];

  const priorityMeta =
    priorityConfig[task.priority as keyof typeof priorityConfig] ||
    priorityConfig.medium;
  const PriorityIcon = priorityMeta.icon;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDueDate =
    mounted && task.dueDate
      ? formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })
      : null;

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#09090c]/90
        p-4
        backdrop-blur-md
        shadow-md
        transition-all
        duration-200
        hover:border-orange-500/30
        hover:bg-[#0c0c10]
        flex
        flex-col
        gap-2.5
        "
      >
        {/* Top Header: Priority Badge + Action Menu */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityMeta.style}`}
          >
            <PriorityIcon size={10} />
            <span>{priorityMeta.label}</span>
          </span>

          <div className="flex items-center gap-1">
            {loading && <Loader2 size={12} className="animate-spin text-orange-400" />}
            <ActionMenu items={menuItems} />
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3
            className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-orange-400 transition-colors"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-[11px] text-[#8a8a93] line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Footer info: Due Date */}
        {formattedDueDate && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-white/[0.06] text-[10px] font-mono text-[#8a8a93]">
            <CalendarDays size={11} className="text-orange-400 shrink-0" />
            <span className="truncate">{formattedDueDate}</span>
          </div>
        )}
      </motion.div>

      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={{
          id: task.id,
          title: task.title,
          description: task.description,
          priority: task.priority as "low" | "medium" | "high",
          dueDate: task.dueDate,
        }}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Cancel"
        loading={loading}
        danger
      />
    </>
  );
}
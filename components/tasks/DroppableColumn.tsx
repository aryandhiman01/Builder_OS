"use client";

import { useDroppable } from "@dnd-kit/core";
import { Clock3, Activity, CheckCircle2, Layers } from "lucide-react";

import { Task } from "./TaskBoard";
import SortableTaskCard from "./SortableTaskCard";

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

const columnMeta = {
  todo: {
    icon: Clock3,
    iconColor: "text-amber-400",
    dotColor: "bg-amber-400",
    badgeStyle: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  "in-progress": {
    icon: Activity,
    iconColor: "text-sky-400",
    dotColor: "bg-sky-400",
    badgeStyle: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  },
  completed: {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    badgeStyle: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
};

export default function DroppableColumn({
  id,
  title,
  tasks,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  });

  const meta = columnMeta[id as keyof typeof columnMeta] || columnMeta.todo;
  const ColumnIcon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex
        min-h-[calc(100vh-295px)]
        flex-col
        rounded-2xl
        border
        border-white/10
        bg-[#09090c]/80
        p-4
        backdrop-blur-xl
        shadow-xl
        transition-all
        duration-300
        ${isOver
          ? "border-orange-500/50 bg-orange-500/[0.04] shadow-orange-500/10 ring-1 ring-orange-500/20"
          : ""
        }
      `}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-inner">
            <ColumnIcon className={`h-4 w-4 ${meta.iconColor}`} />
          </div>
          <div>
            <h2
              className="text-base font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${meta.dotColor} animate-pulse`} />
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold ${meta.badgeStyle}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex flex-1 flex-col gap-3.5">
        {tasks.length === 0 ? (
          <div
            className="
            flex
            flex-1
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-white/15
            bg-white/[0.01]
            p-8
            text-center
            transition-colors
            hover:border-white/25
            "
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-500 mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-white/80">No tasks in {title}</p>
            <p className="mt-1 text-[11px] text-[#8a8a93]">Drop a task card here</p>
          </div>
        ) : (
          tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
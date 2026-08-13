"use client";

import { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { GlobalTask } from "./GlobalTasksClient";

interface KanbanViewProps {
  tasks: GlobalTask[];
  allTasks: GlobalTask[];
  loading: boolean;
  onTaskClick: (task: GlobalTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<GlobalTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh: () => void;
}

const COLUMNS = [
  {
    id: "todo",
    label: "Todo",
    color: "border-white/10 text-[#8a8a93]",
    dot: "bg-zinc-400",
    glow: "hover:border-zinc-500/30",
  },
  {
    id: "in-progress",
    label: "In Progress",
    color: "border-amber-500/30 text-amber-400",
    dot: "bg-amber-400",
    glow: "hover:border-amber-500/40",
  },
  {
    id: "completed",
    label: "Done",
    color: "border-emerald-500/30 text-emerald-400",
    dot: "bg-emerald-400",
    glow: "hover:border-emerald-500/40",
  },
];

const PRIORITY_CONFIG = {
  high: { bg: "bg-amber-500/15 border-amber-500/30", color: "text-amber-400", label: "High" },
  medium: { bg: "bg-yellow-500/15 border-yellow-500/30", color: "text-yellow-400", label: "Medium" },
  low: { bg: "bg-emerald-500/15 border-emerald-500/30", color: "text-emerald-400", label: "Low" },
};

function KanbanCard({ task, onClick }: { task: GlobalTask; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const pCfg = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];

  let subtaskStats = null;
  if (task.subtasks) {
    try {
      const parsed = JSON.parse(task.subtasks);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const done = parsed.filter((s: { completed: boolean }) => s.completed).length;
        subtaskStats = { done, total: parsed.length };
      }
    } catch {
      // ignore
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none select-none">
      <div
        onClick={onClick}
        className="group relative rounded-2xl border border-white/[0.08] bg-[#0d0d12] p-4 transition-all duration-200 hover:border-white/20 hover:bg-[#111116] cursor-grab active:cursor-grabbing shadow-md overflow-hidden"
      >
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-[#52525b] group-hover:text-[#8a8a93] transition shrink-0">
            <GripVertical size={14} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white line-clamp-2 leading-snug">
              {task.title}
            </p>

            {task.description && (
              <p className="mt-1 text-xs text-[#8a8a93] line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {/* Project Badge */}
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#a1a1aa] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-lg">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: task.project?.color || "#8a8a93" }}
                />
                {task.project?.title || "Project"}
              </span>

              {/* Priority Badge */}
              {pCfg && (
                <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${pCfg.bg} ${pCfg.color}`}>
                  {pCfg.label}
                </span>
              )}

              {/* Subtask Stats */}
              {subtaskStats && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#8a8a93]">
                  <CheckCircle2 size={10} className="text-amber-400" />
                  {subtaskStats.done}/{subtaskStats.total}
                </span>
              )}

              {/* Est Hours */}
              {task.estimatedHours && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-[#8a8a93]">
                  <Clock size={10} /> {task.estimatedHours}h
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  id,
  label,
  color,
  dot,
  tasks,
  onTaskClick,
}: {
  id: string;
  label: string;
  color: string;
  dot: string;
  tasks: GlobalTask[];
  onTaskClick: (t: GlobalTask) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column", status: id },
  });

  return (
    <div className="flex flex-col min-w-0 flex-1">
      {/* Column Header */}
      <div className={`mb-2.5 sm:mb-3.5 flex items-center gap-2 sm:gap-2.5 rounded-xl border px-3 sm:px-3.5 py-2 sm:py-2.5 ${color} bg-[#0d0d12]/80 backdrop-blur-md shadow-sm`}>
        <span className={`h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full shadow-sm ${dot}`} />
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest">{label}</span>
        <span className="ml-auto rounded-full bg-white/[0.08] px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white">
          {tasks.length}
        </span>
      </div>

      {/* Column Drop Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[220px] sm:min-h-[380px] space-y-2 sm:space-y-2.5 rounded-2xl border p-2.5 sm:p-3 transition-all duration-200 ${
          isOver
            ? "border-amber-500/50 bg-amber-500/[0.05] shadow-lg shadow-amber-500/5"
            : "border-white/[0.06] bg-[#09090c]"
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex h-28 sm:h-36 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] p-3 text-center">
            <p className="text-xs font-semibold text-[#8a8a93]">No tasks in {label}</p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-[#52525b]">Drag tasks here to change status</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanView({
  tasks,
  loading,
  onTaskClick,
  onTaskUpdate,
  onRefresh,
}: KanbanViewProps) {
  const [localTasks, setLocalTasks] = useState<GlobalTask[]>(tasks);
  const [activeTask, setActiveTask] = useState<GlobalTask | null>(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px drag distance to trigger drag, allowing clean clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoTasks = useMemo(() => localTasks.filter((t) => t.status === "todo"), [localTasks]);
  const inProgressTasks = useMemo(() => localTasks.filter((t) => t.status === "in-progress"), [localTasks]);
  const completedTasks = useMemo(() => localTasks.filter((t) => t.status === "completed"), [localTasks]);

  const findContainer = (id: string) => {
    if (COLUMNS.some((col) => col.id === id)) {
      return id;
    }
    const found = localTasks.find((t) => t.id === id);
    return found ? found.status : null;
  };

  function handleDragStart(e: DragStartEvent) {
    const task = localTasks.find((t) => t.id === String(e.active.id));
    if (task) setActiveTask(task);
  }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setLocalTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return prev;

      const updated = [...prev];
      updated[activeIndex] = { ...updated[activeIndex], status: overContainer };
      return updated;
    });
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    const activeIndex = localTasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    let updated = [...localTasks];
    if (updated[activeIndex].status !== overContainer) {
      updated[activeIndex] = { ...updated[activeIndex], status: overContainer };
    }

    // Re-index tasks for ordering
    const statuses = ["todo", "in-progress", "completed"];
    const finalTasks: GlobalTask[] = [];

    statuses.forEach((st) => {
      const colTasks = updated.filter((t) => t.status === st);
      colTasks.forEach((t, idx) => {
        finalTasks.push({ ...t, order: idx });
      });
    });

    setLocalTasks(finalTasks);

    // Notify parent state immediately for 0ms UI update
    const targetTask = finalTasks.find((t) => t.id === activeId);
    if (targetTask && onTaskUpdate) {
      onTaskUpdate(activeId, { status: targetTask.status, order: targetTask.order });
    }

    // Persist reorder to DB
    try {
      await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: finalTasks.map((t) => ({ id: t.id, status: t.status, order: t.order })),
        }),
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Reorder API failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((c) => (
          <div key={c.id} className="space-y-3">
            <div className="h-10 rounded-xl border border-white/[0.05] bg-white/[0.02] animate-pulse" />
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl border border-white/[0.05] bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full items-start">
        <DroppableColumn
          id="todo"
          label="Todo"
          color="border-white/10 text-[#8a8a93]"
          dot="bg-zinc-400"
          tasks={todoTasks}
          onTaskClick={onTaskClick}
        />
        <DroppableColumn
          id="in-progress"
          label="In Progress"
          color="border-amber-500/30 text-amber-400"
          dot="bg-amber-400"
          tasks={inProgressTasks}
          onTaskClick={onTaskClick}
        />
        <DroppableColumn
          id="completed"
          label="Done"
          color="border-emerald-500/30 text-emerald-400"
          dot="bg-emerald-400"
          tasks={completedTasks}
          onTaskClick={onTaskClick}
        />
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 scale-105 opacity-95 shadow-2xl">
            <div className="rounded-2xl border border-amber-500/40 bg-[#121218] p-4 text-white shadow-2xl backdrop-blur-xl">
              <p className="text-sm font-bold">{activeTask.title}</p>
              {activeTask.project && (
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#a1a1aa] bg-white/[0.05] px-2 py-0.5 rounded-lg border border-white/[0.08]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: activeTask.project.color || "#8a8a93" }} />
                  {activeTask.project.title}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}


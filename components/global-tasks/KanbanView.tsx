"use client";

import { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock } from "lucide-react";
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
  { id: "todo", label: "Todo", color: "border-[#8a8a93]/30 text-[#8a8a93]", dot: "bg-[#8a8a93]" },
  { id: "in-progress", label: "In Progress", color: "border-blue-500/30 text-blue-400", dot: "bg-blue-400" },
  { id: "completed", label: "Done", color: "border-emerald-500/30 text-emerald-400", dot: "bg-emerald-400" },
];

const PRIORITY_CONFIG = {
  high: { bg: "bg-orange-500/10 border-orange-500/20", color: "text-orange-400" },
  medium: { bg: "bg-yellow-500/10 border-yellow-500/20", color: "text-yellow-400" },
  low: { bg: "bg-green-500/10 border-green-500/20", color: "text-green-400" },
};

function KanbanCard({ task, onClick }: { task: GlobalTask; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const pCfg = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG];

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <div
        onClick={onClick}
        className="group rounded-xl border border-white/[0.07] bg-[#0d0d10] p-4 transition hover:border-white/20 hover:bg-white/[0.04] cursor-grab active:cursor-grabbing shadow-sm select-none"
      >
        <div className="flex items-start gap-2">
          <div className="mt-0.5 text-[#8a8a93] opacity-40 group-hover:opacity-100 transition">
            <GripVertical size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white line-clamp-2">{task.title}</p>
            {task.description && (
              <p className="mt-1 text-xs text-[#8a8a93] line-clamp-2">{task.description}</p>
            )}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#8a8a93]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: task.project?.color || "#8a8a93" }}
                />
                {task.project?.title || "Project"}
              </span>
              {pCfg && (
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${pCfg.bg} ${pCfg.color}`}>
                  {task.priority}
                </span>
              )}
              {task.estimatedHours && (
                <span className="flex items-center gap-0.5 text-[10px] text-[#8a8a93]">
                  <Clock size={9} /> {task.estimatedHours}h
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
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: "column" } });

  return (
    <div className="flex flex-col min-w-0">
      <div className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 ${color} bg-white/[0.02]`}>
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-[#8a8a93]">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[280px] space-y-2 rounded-xl border p-2.5 transition ${
          isOver ? "border-orange-500/40 bg-orange-500/[0.03]" : "border-white/[0.05] bg-white/[0.01]"
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-white/[0.05]">
            <p className="text-xs text-[#8a8a93]/50">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanView({ tasks, loading, onTaskClick, onRefresh }: KanbanViewProps) {
  const [localTasks, setLocalTasks] = useState<GlobalTask[]>(tasks);
  const [activeTask, setActiveTask] = useState<GlobalTask | null>(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag, allowing normal clicks
      },
    })
  );

  const todoTasks = useMemo(() => localTasks.filter((t) => t.status === "todo"), [localTasks]);
  const inProgressTasks = useMemo(() => localTasks.filter((t) => t.status === "in-progress"), [localTasks]);
  const completedTasks = useMemo(() => localTasks.filter((t) => t.status === "completed"), [localTasks]);

  function handleDragStart(e: DragStartEvent) {
    const task = localTasks.find((t) => t.id === String(e.active.id));
    if (task) setActiveTask(task);
  }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeIndex = localTasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;
    const activeItem = localTasks[activeIndex];

    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";

    let targetStatus = activeItem.status;
    if (isOverTask) {
      const overIndex = localTasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) targetStatus = localTasks[overIndex].status;
    } else if (isOverColumn) {
      targetStatus = overId;
    }

    if (activeItem.status !== targetStatus) {
      setLocalTasks((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((t) => t.id === activeId);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], status: targetStatus };
        }
        return updated;
      });
    }
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeIndex = localTasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;
    const activeItem = localTasks[activeIndex];

    let targetStatus = activeItem.status;
    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";

    if (isOverTask) {
      const overIndex = localTasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) {
        targetStatus = localTasks[overIndex].status;
      }
    } else if (isOverColumn) {
      targetStatus = overId;
    }

    // Apply status and order updates across all 3 columns
    let updatedList = [...localTasks];
    const currentIdx = updatedList.findIndex((t) => t.id === activeId);
    if (currentIdx !== -1) {
      updatedList[currentIdx] = { ...activeItem, status: targetStatus };
      const [moved] = updatedList.splice(currentIdx, 1);

      const targetOverIdx = updatedList.findIndex((t) => t.id === overId);
      if (targetOverIdx === -1) {
        updatedList.push(moved);
      } else {
        updatedList.splice(targetOverIdx, 0, moved);
      }
    }

    // Reindex per column
    const statuses = ["todo", "in-progress", "completed"];
    const finalTasks: GlobalTask[] = [];
    statuses.forEach((status) => {
      const colTasks = updatedList.filter((t) => t.status === status);
      colTasks.forEach((task, idx) => {
        finalTasks.push({ ...task, order: idx });
      });
    });

    setLocalTasks(finalTasks);

    try {
      await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: finalTasks.map((t) => ({ id: t.id, status: t.status, order: t.order })),
        }),
      });
      onRefresh();
    } catch (err) {
      console.error("Reorder failed:", err);
      setLocalTasks(tasks);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((c) => (
          <div key={c.id} className="space-y-3">
            <div className="h-10 rounded-lg border border-white/[0.05] bg-white/[0.02] animate-pulse" />
            {[1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl border border-white/[0.05] bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DroppableColumn
          id="todo"
          label="Todo"
          color="border-[#8a8a93]/30 text-[#8a8a93]"
          dot="bg-[#8a8a93]"
          tasks={todoTasks}
          onTaskClick={onTaskClick}
        />
        <DroppableColumn
          id="in-progress"
          label="In Progress"
          color="border-blue-500/30 text-blue-400"
          dot="bg-blue-400"
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

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-1 scale-[1.02] opacity-90 shadow-2xl">
            <div className="rounded-xl border border-white/20 bg-[#121217] p-4 text-white shadow-2xl">
              <p className="text-sm font-semibold">{activeTask.title}</p>
              {activeTask.project && (
                <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#8a8a93]">
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

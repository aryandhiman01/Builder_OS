"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

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

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import CreateTaskModal from "./CreateTaskModal";
import DroppableColumn from "./DroppableColumn";
import TaskCard from "./TaskCard";

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    order: number;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
}

interface TaskBoardProps {
    projectId: string;

    tasks: Task[];
}

export default function TaskBoard({ projectId, tasks }: TaskBoardProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Sync local state with prop updates (e.g. from create/edit/delete operations)
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    // Setup sensors with activation constraint to keep buttons and dropdowns interactive
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px drag required to trigger drag start
            },
        })
    );

    const todoTasks = useMemo(() => {
        return localTasks.filter((task) => task.status === "todo");
    }, [localTasks]);

    const inProgressTasks = useMemo(() => {
        return localTasks.filter((task) => task.status === "in-progress");
    }, [localTasks]);

    const completedTasks = useMemo(() => {
        return localTasks.filter((task) => task.status === "completed");
    }, [localTasks]);

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const task = localTasks.find((t) => t.id === String(active.id));
        if (task) {
            setActiveTask(task);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "task";
        const isOverATask = over.data.current?.type === "task";

        if (!isActiveATask) return;

        // Find active task index
        const activeIndex = localTasks.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return;
        const activeTaskItem = localTasks[activeIndex];

        // Dragging over another task card
        if (isOverATask) {
            const overIndex = localTasks.findIndex((t) => t.id === overId);
            if (overIndex === -1) return;
            const overTask = localTasks[overIndex];

            // Moving to a different column or sorting within same column
            if (activeTaskItem.status !== overTask.status) {
                setLocalTasks((prev) => {
                    const updated = [...prev];
                    updated[activeIndex] = {
                        ...activeTaskItem,
                        status: overTask.status,
                    };
                    const [moved] = updated.splice(activeIndex, 1);
                    const newOverIndex = updated.findIndex((t) => t.id === overId);
                    updated.splice(newOverIndex, 0, moved);
                    return updated;
                });
            } else if (activeIndex !== overIndex) {
                setLocalTasks((prev) => {
                    const updated = [...prev];
                    const [moved] = updated.splice(activeIndex, 1);
                    const newOverIndex = updated.findIndex((t) => t.id === overId);
                    updated.splice(newOverIndex, 0, moved);
                    return updated;
                });
            }
        }

        // Dragging over empty column container
        const isOverAColumn = over.data.current?.type === "column";
        if (isOverAColumn) {
            const overStatus = overId;
            if (activeTaskItem.status !== overStatus) {
                setLocalTasks((prev) => {
                    const updated = [...prev];
                    updated[activeIndex] = {
                        ...activeTaskItem,
                        status: overStatus,
                    };
                    const [moved] = updated.splice(activeIndex, 1);
                    
                    const targetColumnTasks = updated.filter((t) => t.status === overStatus);
                    const otherTasks = updated.filter((t) => t.status !== overStatus);
                    
                    targetColumnTasks.push(moved);
                    return [...otherTasks, ...targetColumnTasks];
                });
            }
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeIndex = localTasks.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return;
        const activeTaskItem = localTasks[activeIndex];

        let targetStatus = activeTaskItem.status;
        const isOverATask = over.data.current?.type === "task";
        const isOverAColumn = over.data.current?.type === "column";

        if (isOverATask) {
            const overIndex = localTasks.findIndex((t) => t.id === overId);
            if (overIndex !== -1) {
                targetStatus = localTasks[overIndex].status;
            }
        } else if (isOverAColumn) {
            targetStatus = overId;
        }

        // Apply final status and position in final list
        let finalTasks = [...localTasks];
        const currentActiveIdx = finalTasks.findIndex((t) => t.id === activeId);
        if (currentActiveIdx !== -1) {
            finalTasks[currentActiveIdx] = {
                ...activeTaskItem,
                status: targetStatus,
            };
            const [moved] = finalTasks.splice(currentActiveIdx, 1);
            let newOverIndex = finalTasks.findIndex((t) => t.id === overId);
            
            if (newOverIndex === -1) {
                const otherTasks = finalTasks.filter((t) => t.status !== targetStatus);
                const columnTasks = finalTasks.filter((t) => t.status === targetStatus);
                columnTasks.push(moved);
                finalTasks = [...otherTasks, ...columnTasks];
            } else {
                finalTasks.splice(newOverIndex, 0, moved);
            }
        }

        // Re-index all tasks in every column sequentially
        const updatedTasksWithOrders: Task[] = [];
        const statuses = ["todo", "in-progress", "completed"];

        statuses.forEach((status) => {
            const columnTasks = finalTasks.filter((t) => t.status === status);
            columnTasks.forEach((task, idx) => {
                updatedTasksWithOrders.push({
                    ...task,
                    order: idx,
                });
            });
        });

        setLocalTasks(updatedTasksWithOrders);

        try {
            const payload = updatedTasksWithOrders.map((t) => ({
                id: t.id,
                status: t.status,
                order: t.order,
            }));

            const response = await fetch(`/api/projects/${projectId}/tasks/reorder`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tasks: payload }),
            });

            if (!response.ok) {
                throw new Error("Failed to save reordered tasks");
            }

            router.refresh();
        } catch (error) {
            console.error(error);
            // Revert state on error
            setLocalTasks(tasks);
        }
    }

     return (
    <>

      {/* Header */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Tasks
          </h1>

          <p className="mt-2 text-zinc-500">
            Organize your project using a realtime Kanban board.
          </p>

        </div>

        <button
          onClick={() => setOpen(true)}
          className="
          inline-flex
          items-center
          gap-2
          rounded-2xl
          bg-white
          px-5
          py-3
          font-semibold
          text-black
          transition
          hover:bg-zinc-200
          "
        >
          <Plus size={18} />

          New Task

        </button>

      </div>

      {/* Board */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >

        <section
          className="
          grid
          gap-6
          xl:grid-cols-3
          "
        >

          <SortableContext
            items={todoTasks.map(
              (task) => task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >

            <DroppableColumn
              id="todo"
              title="Todo"
              tasks={todoTasks}
            />

          </SortableContext>

          <SortableContext
            items={inProgressTasks.map(
              (task) => task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >

          <DroppableColumn
            id="in-progress"
            title="In Progress"
            tasks={inProgressTasks}
          />
          
          </SortableContext>

          <SortableContext
            items={completedTasks.map(
              (task) => task.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >

          <DroppableColumn
            id="completed"
            title="Completed"
            tasks={completedTasks}
          />

          </SortableContext>

        </section>

        <CreateTaskModal
          open={open}
          onClose={() => setOpen(false)}
          projectId={projectId}
        />

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-90 shadow-2xl scale-[1.02] rotate-1 transition-transform cursor-grabbing">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>

    </>
  );
}
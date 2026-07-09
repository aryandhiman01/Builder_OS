"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import { Task } from "./TaskBoard";

interface SortableTaskCardProps {
  task: Task;
}

export default function SortableTaskCard({
  task,
}: SortableTaskCardProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
        type: "task",
        task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        touch-none
        select-none
        ${
          isDragging
            ? "z-50 cursor-grabbing"
            : "cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
        }
      `}
    >
      <TaskCard task={task} />
    </div>
  );
}
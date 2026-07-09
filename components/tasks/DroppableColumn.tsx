"use client";

import { useDroppable } from "@dnd-kit/core";

import { Task } from "./TaskBoard";
import SortableTaskCard from "./SortableTaskCard";

interface DroppableColumnProps {
  id: string;

  title: string;

  tasks: Task[];
}

export default function DroppableColumn({
  id,
  title,
  tasks,
}: DroppableColumnProps) {

  const {
    setNodeRef,
    isOver,
  } = useDroppable({

    id,

    data: {

        type:"column",

        status:id,

    },

});

  return (
    <div
      ref={setNodeRef}
      className={`
        flex
        min-h-[550px]
        flex-col
        rounded-3xl
        border
        border-white/10
        bg-[#090909]
        p-5
        transition-colors

        ${
          isOver
            ? "border-blue-500 bg-blue-500/5"
            : ""
        }
      `}
    >

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <h2
          className="
          text-lg
          font-semibold
          text-white
          "
        >
          {title}
        </h2>

        <span
          className="
          rounded-full
          bg-white/5
          px-3
          py-1
          text-xs
          text-zinc-400
          "
        >
          {tasks.length}
        </span>

      </div>

      {/* Tasks */}

      <div className="flex flex-1 flex-col gap-4">

        {tasks.length === 0 ? (

          <div
            className="
            flex
            flex-1
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-white/10
            text-sm
            text-zinc-600
            "
          >
            Drop tasks here
          </div>

        ) : (

          tasks.map((task) => (

            <SortableTaskCard
              key={task.id}
              task={task}
            />

          ))

        )}

      </div>

    </div>
  );
}
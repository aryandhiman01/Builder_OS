import TaskCard from "./TaskCard";
import { Task } from "./TaskBoard";

interface TaskColumnProps {
  title: string;
  status: "todo" | "in-progress" | "completed";
  tasks: Task[];
}

const statusColors = {
  todo: "bg-zinc-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
};

export default function TaskColumn({
  title,
  status,
  tasks,
}: TaskColumnProps) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      p-5
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`
            h-3
            w-3
            rounded-full
            ${statusColors[status]}
            `}
          />

          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

        </div>

        <span
          className="
          rounded-full
          bg-white/10
          px-3
          py-1
          text-xs
          font-medium
          text-zinc-300
          "
        >
          {tasks.length}
        </span>

      </div>

      {/* Tasks */}

      <div className="space-y-4">

        {tasks.length === 0 ? (
          <div
            className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            py-10
            text-center
            "
          >
            <p className="text-sm text-zinc-500">
              No tasks yet.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
        )}

      </div>

    </div>
  );
}
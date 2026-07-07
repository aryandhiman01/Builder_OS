import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import CreateTaskModal from "./CreateTaskModal";
import TaskColumn from "./TaskColumn";

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
    const [ open, setOpen ] = useState(false);

    const todoTasks = useMemo(() => {
        return tasks.filter((task) => task.status === "todo");
    }, [tasks]);

    const inProgressTasks = useMemo(() => {
        return tasks.filter((task) => task.status === "in-progress");
    }, [tasks]);

    const completedTasks = useMemo(() => {
        return tasks.filter((task) => task.status === "completed");
    }, [tasks]);

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

      <section
        className="
        grid
        gap-6
        xl:grid-cols-3
        "
      >

        <TaskColumn
          title="Todo"
          status="todo"
          tasks={todoTasks}
        />

        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
        />

        <TaskColumn
          title="Completed"
          status="completed"
          tasks={completedTasks}
        />

      </section>

      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
      />

    </>
  );
}
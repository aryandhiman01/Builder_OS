"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

import ActionMenu from "@/components/ui/ActionMenu";

import { Task } from "./TaskBoard";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "../ui/ConfirmModal";

interface TaskCardProps {
  task: Task;
}

const priorityStyles = {
  low: "bg-green-500/10 text-green-400 border border-green-500/20",

  medium:
    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

  high:
    "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function TaskCard({
  task,
}: TaskCardProps) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function updateStatus(
    status:
      | "todo"
      | "in-progress"
      | "completed"
  ) {
    try {

      setLoading(true);

      const response = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update task."
        );
      }

      router.refresh();

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function deleteTask() {

    const confirmed =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete task."
        );
      }

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

      icon: <Pencil size={16} />,

      onClick: () =>
        setEditOpen(true),
    },

    {
    label: "Move To",

        children: [

            {
            label: "Todo",

            onClick: () =>
                updateStatus("todo"),
            },

            {
            label: "In Progress",

            onClick: () =>
                updateStatus(
                "in-progress"
                ),
            },

            {
            label: "Completed",

            onClick: () =>
                updateStatus(
                "completed"
                ),
            },

        ],
    },

    {
      label: "Delete Task",

      icon: <Trash2 size={16} />,

      danger: true,

      onClick: () => setDeleteOpen(true),
    },
  ];

    return (
    <>
      <div
        className="
        rounded-2xl
        border
        border-white/10
        bg-[#0D0D0D]
        p-5
        transition
        hover:border-white/20
        hover:bg-[#121212]
        "
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex-1">

            <h3
              className="
              text-base
              font-semibold
              text-white
              "
            >
              {task.title}
            </h3>

            {task.description && (

              <p
                className="
                mt-2
                text-sm
                leading-6
                text-zinc-500
                "
              >
                {task.description}
              </p>

            )}

          </div>

          <div className="ml-3">

            <ActionMenu
              items={menuItems}
            />

          </div>

        </div>

        {/* Footer */}

        <div
          className="
          mt-6
          flex
          items-center
          justify-between
          "
        >

          <span
            className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${
              priorityStyles[
                task.priority as keyof typeof priorityStyles
              ]
            }
            `}
          >
            {task.priority}
          </span>

          <div className="flex items-center gap-3">

            {loading && (

              <Loader2
                size={16}
                className="
                animate-spin
                text-zinc-500
                "
              />

            )}

            {task.dueDate && (

              <div
                className="
                flex
                items-center
                gap-2
                text-sm
                text-zinc-500
                "
              >

                <CalendarDays size={15} />

                {new Date(
                  task.dueDate
                ).toLocaleDateString(
                  "en-IN"
                )}

              </div>

            )}

          </div>

        </div>

      </div>

      <EditTaskModal
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
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
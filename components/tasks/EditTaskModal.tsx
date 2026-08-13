"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2, X } from "lucide-react";

interface EditTaskModalProps {
  open: boolean;

  onClose: () => void;

  task: {
    id: string;
    title: string;
    description: string | null;
    priority: "low" | "medium" | "high";
    dueDate: string | Date | null;
  } | null;
}

export default function EditTaskModal({ open, onClose, task }: EditTaskModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);

    setDescription(task.description ?? "");

    setPriority(task.priority);

    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
  }, [task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!task) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/tasks/${task.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            priority,
            dueDate: dueDate || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to Update Task");
      }

      router.refresh();

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      "
    >

      <div
        className="
        w-full
        max-w-2xl
        rounded-3xl
        border
        border-white/10
        bg-[#090909]
        p-8
        shadow-2xl
        "
      >

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2
              className="
              text-2xl
              font-bold
              text-white
              "
            >
              Edit Task
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Update task details and save your changes.
            </p>

          </div>

          <button
            onClick={onClose}
            className="
            rounded-xl
            p-2
            text-zinc-500
            transition
            hover:bg-white/5
            hover:text-white
            "
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Title */}

          <div>

            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-zinc-300
              "
            >
              Task Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
              className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-4
              py-3
              text-white
              outline-none
              focus:border-white/20
              "
            />

          </div>

          {/* Description */}

          <div>

            <label
              className="
              mb-2
              block
              text-sm
              font-medium
              text-zinc-300
              "
            >
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="
              w-full
              resize-none
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-4
              py-3
              text-white
              outline-none
              focus:border-white/20
              "
            />

          </div>

          {/* Priority + Due Date */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label
                className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-300
                "
              >
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as
                    | "low"
                    | "medium"
                    | "high"
                  )
                }
                className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-3
                text-white
                outline-none
                "
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </div>

            <div>

              <label
                className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-300
                "
              >
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-3
                text-white
                outline-none
                "
              />

            </div>

          </div>

          {/* Footer */}

          <div
            className="
            flex
            justify-end
            gap-4
            pt-4
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
              rounded-2xl
              border
              border-white/10
              px-5
              py-3
              font-medium
              text-zinc-300
              transition
              hover:bg-white/5
              disabled:cursor-not-allowed
              disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-white
              px-6
              py-3
              font-semibold
              text-black
              transition
              hover:bg-zinc-200
              disabled:cursor-not-allowed
              disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                "Save Changes"
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
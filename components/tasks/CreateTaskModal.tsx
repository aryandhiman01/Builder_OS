"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import{
    Plus,
    X,
    Loader2
} from "lucide-react";

interface CreateTaskModalProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
}

export default function CreateTaskModal({ open, onClose, projectId }: CreateTaskModalProps) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(false);
    const[error, setError] = useState("");

    if(!open) {
        return null;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        setError("");

        if(!title.trim()) {
            setError("Task title is required");
            return;
        }

        try{
            setLoading(true);

            const response = await fetch(
                `/api/projects/${projectId}/tasks`,
                {
                    method: "POST",

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

            const data = await response.json();

            if(!response.ok) {
                setError(data.error);
                return;
            }

            router.refresh();

            onClose();

            setTitle("");
            
            setDescription("")

            setPriority("medium");

            setDueDate("");

        } catch (error) {
            console.error(error);

            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (

    <div
      className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-sm
      "
    >

      <div
        className="
        relative
        w-full
        max-w-xl
        rounded-3xl
        border
        border-white/10
        bg-[#090909]
        p-8
        "
      >

        {/* Close */}

        <button
          onClick={onClose}
          disabled={loading}
          className="
          absolute
          right-5
          top-5
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

        {/* Header */}

        <div className="mb-8">

          <div
            className="
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/[0.05]
            "
          >
            <Plus size={24} />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Create Task
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Add a new task to your project.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
        {/* Task Title */}

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Design Landing Page"
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
              transition
              focus:border-white/20
              "
            />

          </div>

          {/* Description */}

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe this task..."
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
              transition
              focus:border-white/20
              "
            />

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Priority */}

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-[#111111]
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

            {/* Due Date */}

            <div>

              <label className="mb-2 block text-sm text-zinc-400">
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
                transition
                focus:border-white/20
                "
              />

            </div>

          </div>
                    {/* Error */}

          {error && (
            <div
              className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* Footer */}

          <div className="flex items-center justify-end gap-3 pt-2">

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
              text-sm
              font-medium
              text-zinc-300
              transition
              hover:bg-white/[0.05]
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
              text-sm
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

                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />

                  Create Task
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
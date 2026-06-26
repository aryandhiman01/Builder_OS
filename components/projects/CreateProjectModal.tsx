"use client";

import { useState } from "react";
import {
  X,
  FolderPlus,
  Loader2,
  Check,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  "Saas",
  "AI Product",
  "Web App",
  "E-commerce",
  "Mobile App",
  "Internal Tool",
  "Portfolio",
  "Other",
];

const colors = [
  "#FFFFFF",
  "#3B82F6",
  "#8B5CF6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
];

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {

  const router = useRouter();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Saas");

  const [color, setColor] = useState(colors[0]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      onClose();

      router.push(`/projects/${data.project.id}`);
      router.refresh();

    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
        bg-[#0A0A0A]
        p-8
        shadow-2xl
        "
      >
        {/* Close */}

        <button
          onClick={onClose}
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
            <FolderPlus size={26} />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Create New Project
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Start building your next amazing
            product with BuilderOS.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Project Name */}

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Project Name
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Food Delivery Platform"
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
              placeholder="Describe your project..."
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

          {/* Category */}

          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
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
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* Color Picker */}

          <div>

            <label className="mb-3 block text-sm text-zinc-400">
              Project Color
            </label>

            <div className="flex flex-wrap gap-3">

              {colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setColor(item)
                  }
                  style={{
                    background: item,
                  }}
                  className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-white/10
                  transition
                  hover:scale-105
                  "
                >
                  {color === item && (
                    <Check
                      size={18}
                      className={
                        item === "#FFFFFF"
                          ? "text-black"
                          : "text-white"
                      }
                    />
                  )}
                </button>
              ))}

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
                    <FolderPlus size={18} />
                    Create Project
                  </>
                )}
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}
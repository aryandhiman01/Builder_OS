"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

interface EditProjectFormProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    color: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
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

const statuses = [
  "Planning",
  "Building",
  "Completed",
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

export default function EditProjectForm({
  project,
}: EditProjectFormProps) {

  const router = useRouter();

  const [title, setTitle] = useState(project.title);

  const [description, setDescription] = useState(
    project.description ?? ""
  );

  const [category, setCategory] = useState(
    project.category
  );

  const [status, setStatus] = useState(
    project.status
  );

  const [color, setColor] = useState(
    project.color
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${project.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
            color,
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setSuccess(
        "Project updated successfully."
      );

      router.refresh();

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleDelete() {

  const confirmed = window.confirm(
    "Delete this project permanently?"
  );

  if (!confirmed) {
    return;
  }

  try {

    setDeleting(true);

    setError("");
    setSuccess("");

    const response = await fetch(
      `/api/projects/${project.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    router.push("/projects");

    router.refresh();

  } catch (error) {

    console.error(error);

    setError("Something went wrong.");

  } finally {

    setDeleting(false);

  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
              {/* Project Name */}

      <div>

        <label className="mb-2 block text-sm text-zinc-400">
          Project Name
        </label>

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
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

      <div className="grid gap-6 md:grid-cols-2">

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

        {/* Status */}

        <div>

          <label className="mb-2 block text-sm text-zinc-400">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
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
            {statuses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* Color */}

      <div>

        <label className="mb-4 block text-sm text-zinc-400">
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
                backgroundColor: item,
              }}
              className={`
              h-11
              w-11
              rounded-full
              border-2
              transition

              ${
                color === item
                  ? "border-white scale-110"
                  : "border-white/10"
              }
              `}
            />

          ))}

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

      {/* Success */}

      {success && (
        <div
          className="
          rounded-2xl
          border
          border-emerald-500/20
          bg-emerald-500/10
          px-4
          py-3
          text-sm
          text-emerald-400
          "
        >
          {success}
        </div>
      )}

      {/* Footer */}

      <div className="flex items-center justify-between">

        <div className="text-sm text-zinc-500">

          Last Updated

          <span className="ml-2 text-white">
            {new Intl.DateTimeFormat("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(project.updatedAt)}
          </span>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="
          inline-flex
          items-center
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
          disabled:opacity-60
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
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>

      </div>

      {/* Danger Zone */}

      <div
        className="
        mt-10
        rounded-3xl
        border
        border-red-500/20
        bg-red-500/[0.04]
        p-6
        "
      >

        <h2 className="text-xl font-semibold text-red-400">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm leading-7 text-zinc-400">
          Permanently delete this project and all related
          ideas, tasks and future AI assets.
          This action cannot be undone.
        </p>

        <button
            type="button"
            disabled={deleting}
            onClick={handleDelete} 
            className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            px-5
            py-3
            text-sm
            font-semibold
            text-red-400
            transition
            hover:bg-red-500/20
            disabled:cursor-not-allowed
            disabled:opacity-60
            "
            >

            {deleting ? (
                <>
                <Loader2
                    size={18}
                    className="animate-spin"
                />
                Deleting...
                </>
            ) : (
                <>
                <Trash2 size={18} />
                Delete Project
                </>
            )}

            </button>

      </div>

    </form>
  );
}
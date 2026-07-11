"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Loader2,
  Pencil,
  X,
} from "lucide-react";

interface EditResearchModalProps {
  open: boolean;

  onClose: () => void;

  research: {
    id: string;
    title: string;
    prompt: string;
    content: string;
  };
}

export default function EditResearchModal({
  open,
  onClose,
  research,
}: EditResearchModalProps) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (!open) return;

    setTitle(research.title);

    setPrompt(research.prompt);

    setContent(research.content);

  }, [open, research]);

  if (!open) {
    return null;
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    if (!title.trim()) {

      setError(
        "Title is required."
      );

      return;

    }

    if (
      prompt.trim().length < 10
    ) {

      setError(
        "Prompt must contain at least 10 characters."
      );

      return;

    }

    if (!content.trim()) {

      setError(
        "Research content is required."
      );

      return;

    }

    try {

      setLoading(true);

      const response =
        await fetch(
          `/api/research/${research.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              title,

              prompt,

              content,

            }),

          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to update research."
        );

      }

      router.refresh();

      onClose();

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  }

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
        max-w-4xl
        rounded-3xl
        border
        border-white/10
        bg-[#090909]
        p-8
        shadow-2xl
        "
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-3">

              <Pencil
                size={24}
                className="text-blue-400"
              />

              <h2
                className="
                text-2xl
                font-bold
                text-white
                "
              >
                Edit Research
              </h2>

            </div>

            <p
              className="
              mt-3
              text-zinc-500
              "
            >
              Update your research details and
              markdown content.
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="
            rounded-xl
            p-2
            text-zinc-500
            transition
            hover:bg-white/5
            hover:text-white
            disabled:opacity-50
            "
          >

            <X size={18} />

          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

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
              Research Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="AI CRM Market Research"
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
              focus:border-blue-500
              "
            />

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
              Prompt
            </label>

            <textarea
              rows={5}
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Describe your product idea..."
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
              focus:border-blue-500
              "
            />

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
              Research Content (Markdown)
            </label>

            <textarea
              rows={14}
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="# Market Research..."
              className="
              min-h-[350px]
              w-full
              resize-y
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-4
              py-3
              font-mono
              text-sm
              leading-7
              text-white
              outline-none
              transition
              focus:border-blue-500
              "
            />

          </div>

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

                <>

                  <Pencil size={18} />

                  Save Changes

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}
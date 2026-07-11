"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Brain,
  Loader2,
  X,
} from "lucide-react";

interface GenerateResearchModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export default function GenerateResearchModal({
  open,
  onClose,
  projectId,
}: GenerateResearchModalProps) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [error, setError] =
    useState("");

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
        "Research title is required."
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

    try {

      setLoading(true);

      const response =
        await fetch(
          `/api/projects/${projectId}/research`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title,
              prompt,

              // Temporary
              content:
                "Research generation will be added in the next phase.",

              model: "BuilderOS AI",

              tokens: 0,

              generationTime: 0,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to create research."
        );
      }

      router.refresh();

      setTitle("");

      setPrompt("");

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

        <div className="flex items-start justify-between">

          <div>

            <div className="flex items-center gap-3">

              <Brain
                size={26}
                className="text-blue-400"
              />

              <h2
                className="
                text-2xl
                font-bold
                text-white
                "
              >
                Generate AI Research
              </h2>

            </div>

            <p
              className="
              mt-3
              text-zinc-500
              "
            >
              Describe your product idea and
              BuilderOS AI will generate
              structured market research.
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
              Product Prompt
            </label>

            <textarea
              rows={8}
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Example: Build an AI-powered CRM for lawyers that automates case management, client communication and document generation."
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

                  Generating...

                </>

              ) : (

                <>

                  <Brain size={18} />

                  Generate Research

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
"use client";

import { useMemo, useState } from "react";

import {
  Brain,
  Plus,
  Search,
} from "lucide-react";

import GenerateResearchModal from "./GenerateResearchModal";
import ResearchCard from "./ResearchCard";

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string;
  color: string;
}

export interface Research {
  id: string;
  title: string;
  prompt: string;
  content: string;
  model: string | null;
  tokens: number | null;
  generationTime: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ResearchClientProps {
  project: Project;
  researches: Research[];
}

export default function ResearchClient({
  project,
  researches,
}: ResearchClientProps) {

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredResearch = useMemo(() => {

    return researches.filter(
      (research) => {

        return (
          research.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          research.prompt
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        );

      }
    );

  }, [researches, search]);

  return (
    <>

      <div className="space-y-10">

        {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <Brain
                size={30}
                className="text-blue-400"
              />

              <h1 className="text-4xl font-bold text-white">
                AI Research
              </h1>

            </div>

            <p className="mt-3 text-zinc-500">
              Generate market research,
              competitor analysis and product insights
              for{" "}
              <span className="font-medium text-white">
                {project.title}
              </span>.
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

            Generate Research

          </button>

        </div>

        {/* Search */}

        <div
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          px-4
          py-3
          "
        >

          <Search
            size={18}
            className="text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search research..."
            className="
            w-full
            bg-transparent
            text-white
            outline-none
            placeholder:text-zinc-600
            "
          />

        </div>

        {/* Research List */}

        {filteredResearch.length === 0 ? (

          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-white/10
            py-24
            text-center
            "
          >

            <Brain
              size={64}
              className="mb-6 text-zinc-700"
            />

            <h2
              className="
              text-2xl
              font-semibold
              text-white
              "
            >
              No Research Found
            </h2>

            <p
              className="
              mt-3
              max-w-lg
              text-zinc-500
              "
            >
              Generate your first AI research
              to start building your product.
            </p>

            <button
              onClick={() =>
                setOpen(true)
              }
              className="
              mt-8
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
              Generate Research
            </button>

          </div>

        ) : (

          <div
            className="
            grid
            gap-6
            lg:grid-cols-2
            "
          >

            {filteredResearch.map(
              (research) => (

                <ResearchCard
                  key={research.id}
                  projectId={project.id}
                  research={research}
                />

              )
            )}

          </div>

        )}

      </div>

      <GenerateResearchModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        projectId={project.id}
      />

    </>
  );
}
import {
  Bot,
  Sparkles,
  BrainCircuit,
  Rocket,
  FileText,
  Blocks,
} from "lucide-react";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Architecture Expert",
    description:
      "Analyze, improve and explain complex software architectures.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description:
      "Generate PRDs, API docs, technical specs and developer guides.",
  },
  {
    icon: Blocks,
    title: "System Design",
    description:
      "Design scalable databases, APIs, services and infrastructure.",
  },
  {
    icon: Rocket,
    title: "Product Builder",
    description:
      "Brainstorm ideas, roadmaps, MVPs and complete SaaS products.",
  },
];

export default function AIWelcome() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">

      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/10 shadow-[0_0_50px_rgba(34,211,238,0.15)]">

        <Bot className="h-10 w-10 text-cyan-400" />

      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">

        <Sparkles className="h-4 w-4" />

        BuilderOS AI Assistant

      </div>

      <h1 className="mt-8 max-w-4xl bg-gradient-to-r from-white via-zinc-200 to-cyan-400 bg-clip-text text-6xl font-bold tracking-tight text-transparent">

        Build Better Software
        <br />
        with AI.

      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">

        Ask anything about your product, architecture,
        roadmap, database, deployment, APIs, testing,
        scaling or software engineering.

      </p>

      <div className="mt-14 grid w-full gap-5 md:grid-cols-2">

        {capabilities.map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80 p-6 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-white/[0.04] hover:shadow-2xl"
            >

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/25 bg-cyan-500/10 shadow-[0_0_25px_rgba(34,211,238,0.12)]">

                <Icon className="h-6 w-6 text-cyan-400" />

              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-400">

                  {item.title}

                </h3>

                <p className="mt-2 text-sm leading-7 text-zinc-400">

                  {item.description}

                </p>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
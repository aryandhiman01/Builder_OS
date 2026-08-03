"use client";

import {
  FileText,
  Map,
  Blocks,
  Database,
  Shield,
  Rocket,
  Bug,
  BrainCircuit,
  Sparkles,
  Code2,
  Server,
  TestTube2,
} from "lucide-react";

interface AIQuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const actions = [
  {
    title: "Generate PRD",
    description: "Create a complete Product Requirement Document.",
    icon: FileText,
    prompt:
      "Generate a complete Product Requirement Document for my current project.",
  },
  {
    title: "Improve Roadmap",
    description: "Optimize milestones and delivery plan.",
    icon: Map,
    prompt:
      "Review my roadmap and suggest improvements with better milestones.",
  },
  {
    title: "Explain Architecture",
    description: "Analyze and explain my system architecture.",
    icon: Blocks,
    prompt:
      "Explain my architecture and recommend improvements for scalability.",
  },
  {
    title: "Design Database",
    description: "Generate optimized database schema.",
    icon: Database,
    prompt:
      "Design a scalable PostgreSQL database schema for this project.",
  },
  {
    title: "Security Review",
    description: "Find security vulnerabilities.",
    icon: Shield,
    prompt:
      "Perform a security review and identify vulnerabilities in my application.",
  },
  {
    title: "Deployment Guide",
    description: "Production deployment strategy.",
    icon: Rocket,
    prompt:
      "Generate a complete production deployment guide for my application.",
  },
  {
    title: "Find Bugs",
    description: "Analyze possible issues.",
    icon: Bug,
    prompt:
      "Review my application and identify possible bugs and edge cases.",
  },
  {
    title: "Brainstorm Features",
    description: "Suggest powerful product ideas.",
    icon: BrainCircuit,
    prompt:
      "Suggest innovative features that can improve my SaaS product.",
  },
  {
    title: "Generate APIs",
    description: "Create REST API endpoints.",
    icon: Code2,
    prompt:
      "Generate REST API endpoints with request and response examples.",
  },
  {
    title: "System Design",
    description: "Design scalable backend services.",
    icon: Server,
    prompt:
      "Design a scalable backend architecture for this application.",
  },
  {
    title: "Write Test Cases",
    description: "Generate testing strategy.",
    icon: TestTube2,
    prompt:
      "Generate comprehensive unit, integration and e2e test cases.",
  },
  {
    title: "Ask Anything",
    description: "General AI engineering assistant.",
    icon: Sparkles,
    prompt: "Help me improve my software project.",
  },
];

export default function AIQuickActions({
  onSelectPrompt,
}: AIQuickActionsProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2.5">

      {actions.map((action) => {

        const Icon = action.icon;

        return (
          <button
            key={action.title}
            onClick={() => onSelectPrompt(action.prompt)}
            title={action.description}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0a0c]/80 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md transition-all duration-200 hover:border-cyan-500/30 hover:bg-white/[0.04] hover:text-cyan-300"
          >
            <Icon className="h-4 w-4 text-cyan-400" />
            {action.title}
          </button>
        );
      })}

    </div>
  );
}
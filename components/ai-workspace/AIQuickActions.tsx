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
    <div className="w-full max-w-3xl">
      <div className="grid grid-cols-2 gap-1.5 min-[480px]:grid-cols-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => onSelectPrompt(action.prompt)}
              title={action.description}
              className="group flex w-full sm:w-auto items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 sm:px-3.5 py-2 text-[11px] sm:text-xs font-semibold text-[#8a8a93] backdrop-blur-md transition-all duration-200 hover:border-orange-500/30 hover:bg-white/[0.07] hover:text-white active:scale-95 cursor-pointer min-w-0"
            >
              <Icon className="h-3.5 w-3.5 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">{action.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
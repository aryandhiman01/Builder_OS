"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
}

// ─── Diagram type validation ──────────────────────────────────────────────────

const SUPPORTED_PREFIXES = [
  "flowchart",
  "graph",
  "sequencediagram",
  "classdiagram",
  "statediagram",
  "erdiagram",
  "journey",
  "gantt",
  "pie",
  "quadrantchart",
  "requirementdiagram",
  "gitgraph",
  "mindmap",
  "timeline",
  "c4context",
  "c4container",
  "c4component",
  "c4dynamic",
  "c4deployment",
  "sankey-beta",
  "xychart-beta",
  "block-beta",
  "packet-beta",
  "kanban",
  "zenuml",
];

function firstToken(chart: string): string {
  return (chart.trim().split(/[\s\n({]/)[0] ?? "").toLowerCase();
}

function isNativelySupported(chart: string): boolean {
  const tok = firstToken(chart);
  return SUPPORTED_PREFIXES.some((p) => tok === p || tok.startsWith(p));
}

// ─── Convert component-style diagrams → flowchart LR ─────────────────────────
// Mermaid does not have a `componentDiagram` type. Older generated documents
// use a PlantUML-like component/package notation, so normalise it into a native
// Mermaid flowchart before attempting to render it.

let _nodeIdx = 0;
const _nodeMap = new Map<string, string>();

function toNodeId(label: string): string {
  if (!_nodeMap.has(label)) {
    // Generate a stable alphanumeric ID
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 24);
    _nodeMap.set(label, `nd_${slug}_${_nodeIdx++}`);
  }
  return _nodeMap.get(label)!;
}

function sanitizeLabel(label: string): string {
  // Escape double-quotes inside labels
  return label.replace(/"/g, "'");
}

function convertComponentToFlowchart(raw: string): string {
  // Reset per-render state
  _nodeIdx = 0;
  _nodeMap.clear();

  const lines = raw.split("\n");
  const out: string[] = ["flowchart LR"];
  let openPackages = 0;

  // Skip the first line (the component diagram keyword).
  for (let i = 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      out.push("");
      continue;
    }

    // package "Name" {  →  subgraph Name
    const pkgMatch = trimmed.match(/^package\s+(?:"([^"]+)"|([^\{]+?))\s*\{$/i);
    if (pkgMatch) {
      out.push(`subgraph ${JSON.stringify((pkgMatch[1] ?? pkgMatch[2]).trim())}`);
      openPackages++;
      continue;
    }

    // Closing brace for package  →  end
    if (trimmed === "}" && openPackages > 0) {
      out.push("end");
      openPackages--;
      continue;
    }

    // subgraph / end pass-through
    if (trimmed.startsWith("subgraph ")) {
      out.push(trimmed);
      continue;
    }

    // PlantUML-style component output sometimes uses a final `end` after all
    // packages are already closed. It has no flowchart equivalent, so ignore it.
    if (trimmed.toLowerCase() === "end" || /^@end\w*$/i.test(trimmed)) {
      continue;
    }

    if (/^@start\w*$/i.test(trimmed)) {
      continue;
    }

    // Arrow:  [A] --> [B]  or  [A] --> [B]: label
    const arrowRe =
      /^\[([^\]]+)\]\s*(<-->|-->|--|->|<-|\.\.>|<\.\.|==>|<==|<==>)\s*\[([^\]]+)\](?:\s*:\s*(.+))?$/;
    const arrowMatch = trimmed.match(arrowRe);
    if (arrowMatch) {
      const [, fromLabel, rawArrow, toLabel, edgeLabel] = arrowMatch;
      const fromId = toNodeId(fromLabel);
      const toId = toNodeId(toLabel);
      const fromDef = `${fromId}["${sanitizeLabel(fromLabel)}"]`;
      const toDef = `${toId}["${sanitizeLabel(toLabel)}"]`;
      const arrow = rawArrow === "->" || rawArrow === "==>" || rawArrow === "..>"
        ? "-->"
        : rawArrow === "<-" || rawArrow === "<==" || rawArrow === "<.."
          ? "<--"
          : rawArrow === "--"
            ? "---"
            : rawArrow;
      if (edgeLabel) {
        out.push(`${fromDef} ${arrow}|"${sanitizeLabel(edgeLabel)}"| ${toDef}`);
      } else {
        out.push(`${fromDef} ${arrow} ${toDef}`);
      }
      continue;
    }

    // Standalone node: [Label]
    const nodeMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (nodeMatch) {
      const id = toNodeId(nodeMatch[1]);
      out.push(`${id}["${sanitizeLabel(nodeMatch[1])}"]`);
      continue;
    }

    // Anything else — pass through but strip leading/trailing whitespace
    out.push(trimmed);
  }

  // Be forgiving of incomplete generated package blocks.
  while (openPackages > 0) {
    out.push("end");
    openPackages--;
  }

  return out.join("\n");
}

// ─── Auto-fix chart before rendering ─────────────────────────────────────────

import { sanitizeMermaidChart } from "@/lib/mermaid";

function prepareChart(raw: string): { chart: string; converted: boolean } {
  const sanitized = sanitizeMermaidChart(raw);
  const tok = firstToken(sanitized);

  if (tok === "component" || tok === "componentdiagram") {
    return { chart: convertComponentToFlowchart(sanitized), converted: true };
  }

  return { chart: sanitized.trim(), converted: true };
}

// ─── Module-level Mermaid initialisation flag ─────────────────────────────────

let mermaidInitialised = false;

// ─── State ────────────────────────────────────────────────────────────────────

type RenderState =
  | { status: "loading" }
  | { status: "success"; svg: string }
  | { status: "unsupported"; type: string }
  | { status: "error"; reason: string };

// ─── Component ────────────────────────────────────────────────────────────────

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RenderState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const { chart: prepared, converted } = prepareChart(chart);

    if (!isNativelySupported(prepared) && !converted) {
      queueMicrotask(() => {
        if (!cancelled) {
          setState({ status: "unsupported", type: firstToken(chart) });
        }
      });
      return;
    }

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;

        if (!mermaidInitialised) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
              darkMode: true,
              background: "#0a0a0c",
              primaryColor: "#22d3ee",
              primaryTextColor: "#f4f4f5",
              primaryBorderColor: "#3f3f46",
              lineColor: "#52525b",
              secondaryColor: "#18181b",
              tertiaryColor: "#27272a",
              edgeLabelBackground: "#18181b",
              clusterBkg: "#18181b",
              titleColor: "#f4f4f5",
              nodeBorder: "#3f3f46",
              mainBkg: "#18181b",
              nodeTextColor: "#f4f4f5",
              fontSize: "14px",
            },
            flowchart: { htmlLabels: true, curve: "basis" },
            securityLevel: "loose",
            suppressErrorRendering: true,
          });
          mermaidInitialised = true;
        }

        // Pre-validate syntax
        try {
          await mermaid.parse(prepared);
        } catch (parseErr) {
          if (!cancelled) {
            setState({
              status: "error",
              reason:
                parseErr instanceof Error
                  ? parseErr.message
                  : "Syntax error in diagram",
            });
          }
          return;
        }

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, prepared);

        if (!cancelled) {
          setState({ status: "success", svg });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            reason:
              err instanceof Error ? err.message : "Failed to render diagram",
          });
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  // ── Loading ──────────────────────────────────────────────────────────
  if (state.status === "loading") {
    return (
      <div className="my-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Rendering diagram…
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────
  if (state.status === "success") {
    return (
      <div
        ref={containerRef}
        className="mermaid-wrapper my-6 overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0d10] p-6 print:border-zinc-200 print:bg-white [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: state.svg }}
      />
    );
  }

  // ── Unsupported diagram type ─────────────────────────────────────────
  if (state.status === "unsupported") {
    return (
      <div className="my-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="mb-3 text-xs font-semibold text-amber-400">
          ℹ Diagram type &ldquo;{state.type}&rdquo; is not renderable inline
        </p>
        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  // ── Render / syntax error ────────────────────────────────────────────
  return (
    <div className="my-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
      <p className="mb-2 text-xs font-semibold text-red-400">
        ⚠ Diagram could not be rendered
      </p>
      <p className="mb-3 text-xs text-zinc-500">{state.reason}</p>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
        <code>{chart}</code>
      </pre>
    </div>
  );
}

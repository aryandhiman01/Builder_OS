/** Converts legacy PlantUML-like component diagrams to GitHub-compatible Mermaid. */
function convertComponentDiagram(source: string): string {
  const identifiers = new Map<string, string>();
  let identifierIndex = 0;
  let openPackages = 0;
  const id = (label: string) => {
    if (!identifiers.has(label)) {
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32) || "node";
      identifiers.set(label, `node_${slug}_${identifierIndex++}`);
    }
    return identifiers.get(label)!;
  };
  const node = (label: string) => `${id(label)}["${label.replace(/"/g, "'")}"]`;
  const output = ["flowchart LR"];

  for (const rawLine of source.trim().split("\n").slice(1)) {
    const line = rawLine.trim();
    if (!line || /^@(?:start|end)\w*$/i.test(line)) continue;

    const packageMatch = line.match(/^package\s+(?:"([^"]+)"|(.+?))\s*\{$/i);
    if (packageMatch) {
      const title = (packageMatch[1] ?? packageMatch[2]).trim();
      output.push(`subgraph ${id(`package_${title}`)}["${title.replace(/"/g, "'")}"]`);
      openPackages++;
      continue;
    }
    if (line === "}") {
      if (openPackages > 0) {
        output.push("end");
        openPackages--;
      }
      continue;
    }
    if (line.toLowerCase() === "end") {
      while (openPackages > 0) {
        output.push("end");
        openPackages--;
      }
      continue;
    }

    const edge = line.match(/^\[([^\]]+)\]\s*(<-->|-->|---|--|->|<-|\.\.>|<\.\.|==>|<==)\s*\[([^\]]+)\](?:\s*:\s*(.+))?$/);
    if (edge) {
      const [, from, rawArrow, to, label] = edge;
      const arrow = rawArrow === "->" || rawArrow === "==>" ? "-->"
        : rawArrow === "<-" || rawArrow === "<==" ? "<--"
          : rawArrow === "..>" ? "-.->"
            : rawArrow === "<.." ? "<-.->"
              : rawArrow === "--" ? "---" : rawArrow;
      output.push(label ? `${node(from)} ${arrow}|"${label.replace(/"/g, "'")}"| ${node(to)}` : `${node(from)} ${arrow} ${node(to)}`);
      continue;
    }

    const standalone = line.match(/^\[([^\]]+)\]$/);
    if (standalone) output.push(node(standalone[1]));
  }

  while (openPackages > 0) {
    output.push("end");
    openPackages--;
  }
  return output.join("\n");
}

/**
 * Robust, production-grade Mermaid Chart Sanitizer and Parser.
 * Automatically fixes common LLM output syntax errors:
 * - erDiagram: Strips non-standard attribute modifiers like SK/UK/INDEX.
 * - flowchart: Fixes node labels containing unquoted \n or parentheses.
 * - subgraphs: Ensures subgraph titles with spaces are properly quoted and assigned IDs.
 */
export function sanitizeMermaidChart(rawChart: string): string {
  let chart = rawChart.trim();

  if (/^\s*componentDiagram\b/i.test(chart)) {
    chart = convertComponentDiagram(chart);
  }

  const lines = chart.split("\n");
  const firstLine = lines[0] || "";
  const isErDiagram = /^\s*erDiagram\b/i.test(firstLine);
  const isFlowchart = /^\s*(flowchart|graph)\b/i.test(firstLine);

  const cleanedLines: string[] = [];

  for (let line of lines) {
    let trimmed = line.trim();
    if (!trimmed) {
      cleanedLines.push("");
      continue;
    }

    // --- 1. ER DIAGRAM SANITIZATION ---
    if (isErDiagram) {
      // Fix non-standard attribute key modifiers: e.g. "string institutional_id SK "Roll No"" -> "string institutional_id "Roll No [SK]""
      const erAttrMatch = trimmed.match(/^(\s*)([A-Za-z0-9_<>]+)\s+([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)(?:\s+"([^"]*)")?/);
      if (erAttrMatch) {
        const [, indent, type, name, modifier, comment] = erAttrMatch;
        const upperMod = modifier.toUpperCase();
        if (upperMod === "PK" || upperMod === "FK") {
          cleanedLines.push(`${indent}${type} ${name} ${upperMod}${comment ? ` "${comment}"` : ""}`);
          continue;
        } else {
          const newComment = comment ? `"${comment} [${modifier}]"` : `"[${modifier}]"`;
          cleanedLines.push(`${indent}${type} ${name} ${newComment}`);
          continue;
        }
      }
    }

    // --- 2. FLOWCHART / GRAPH SANITIZATION ---
    if (isFlowchart) {
      // Fix subgraph titles with unquoted spaces:  subgraph UI Layer  ->  subgraph ui_layer ["UI Layer"]
      const subgraphMatch = trimmed.match(/^subgraph\s+([^\s"\[]+(?:\s+[^\s"\[]+)+)\s*$/i);
      if (subgraphMatch) {
        const title = subgraphMatch[1].trim();
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
        cleanedLines.push(`subgraph ${slug} ["${title}"]`);
        continue;
      }

      // Fix unquoted node labels with \n or special chars: NodeID[Next.js App Router\n(Role Guards)] -> NodeID["Next.js App Router<br/>(Role Guards)"]
      trimmed = trimmed.replace(/([A-Za-z0-9_]+)\[([^\]]+)\]/g, (match, nodeId, label) => {
        if (label.startsWith('"') && label.endsWith('"')) {
          return match;
        }
        const sanitizedLabel = label
          .replace(/\\n/g, "<br/>")
          .replace(/\n/g, "<br/>")
          .replace(/"/g, "'");
        return `${nodeId}["${sanitizedLabel}"]`;
      });
    }

    cleanedLines.push(trimmed);
  }

  return cleanedLines.join("\n");
}

export function normalizeArchitectureMermaid(content: string): string {
  const fenced = content.replace(/```[^\n]*\n([\s\S]*?)```/g, (block, chart) => {
    const normalized = sanitizeMermaidChart(chart);
    return `\`\`\`mermaid\n${normalized}\n\`\`\``;
  });

  return fenced.replace(/(^|\n)(componentDiagram\b[\s\S]*?)(?=\n#{1,6}\s|$)/gi, (_match, prefix, chart) => `${prefix}\`\`\`mermaid\n${convertComponentDiagram(chart)}\n\`\`\``);
}

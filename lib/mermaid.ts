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

export function normalizeArchitectureMermaid(content: string): string {
  const normalize = (chart: string) => /^\s*componentDiagram\b/i.test(chart) ? convertComponentDiagram(chart) : chart.trim();
  const fenced = content.replace(/```[^\n]*\n([\s\S]*?)```/g, (block, chart) => {
    const normalized = normalize(chart);
    return normalized === chart.trim() ? block : `\`\`\`mermaid\n${normalized}\n\`\`\``;
  });
  return fenced.replace(/(^|\n)(componentDiagram\b[\s\S]*?)(?=\n#{1,6}\s|$)/gi, (_match, prefix, chart) => `${prefix}\`\`\`mermaid\n${convertComponentDiagram(chart)}\n\`\`\``);
}

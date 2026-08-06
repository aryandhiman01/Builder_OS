import { generateContentWithRetry, DEFAULT_MODEL } from "../client";
import { architecturePrompt } from "../prompts/architecture";
import { normalizeArchitectureMermaid } from "@/lib/mermaid";

export async function generateArchitecture(
  projectTitle: string,
  roadmapTitle: string,
  roadmapContent: string
) {
  const start = Date.now();

  const { response, usedModel } = await generateContentWithRetry({
    model: DEFAULT_MODEL,
    contents: architecturePrompt(projectTitle, roadmapTitle, roadmapContent),
    config: {
      temperature: 0.3,
      topP: 0.9,
    },
  });

  return {
    content: normalizeArchitectureMermaid(response.text ?? ""),
    model: usedModel,
    tokens: response.usageMetadata?.totalTokenCount ?? 0,
    generationTime: Math.round((Date.now() - start) / 1000),
  };
}

import { ai, DEFAULT_MODEL } from "../client";
import { architecturePrompt } from "../prompts/architecture";
import { normalizeArchitectureMermaid } from "@/lib/mermaid";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export async function generateArchitecture(
  projectTitle: string,
  roadmapTitle: string,
  roadmapContent: string
) {
  const start = Date.now();

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents: architecturePrompt(
          projectTitle,
          roadmapTitle,
          roadmapContent
        ),
        config: {
          temperature: 0.3,
          topP: 0.9,
        },
      });

      return {
        content: normalizeArchitectureMermaid(response.text ?? ""),
        model: DEFAULT_MODEL,
        tokens: response.usageMetadata?.totalTokenCount ?? 0,
        generationTime: Math.round((Date.now() - start) / 1000),
      };
    } catch (error: unknown) {
      lastError = error;

      const status =
        error && typeof error === "object"
          ? (error as { status?: unknown; error?: { code?: unknown } }).status ??
            (error as { error?: { code?: unknown } }).error?.code
          : undefined;

      if (status !== 503 || attempt === MAX_RETRIES) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY)
      );
    }
  }

  throw lastError;
}

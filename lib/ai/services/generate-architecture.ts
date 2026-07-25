import { ai, DEFAULT_MODEL } from "../client";
import { architecturePrompt } from "../prompts/architecture";

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
        content: response.text ?? "",
        model: DEFAULT_MODEL,
        tokens: response.usageMetadata?.totalTokenCount ?? 0,
        generationTime: Math.round((Date.now() - start) / 1000),
      };
    } catch (error: any) {
      lastError = error;

      const status = error?.status ?? error?.error?.code;

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
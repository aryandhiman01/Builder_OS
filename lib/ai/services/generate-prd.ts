import { generateContentWithRetry, DEFAULT_MODEL } from "../client";
import { buildPRDPrompt } from "../prompts/prd";

export async function generatePRD(research: string) {
  const start = Date.now();

  const { response, usedModel } = await generateContentWithRetry({
    model: DEFAULT_MODEL,
    contents: buildPRDPrompt(research),
    config: {
      temperature: 0.3,
      topP: 0.9,
    },
  });

  return {
    content: response.text ?? "",
    model: usedModel,
    tokens: response.usageMetadata?.totalTokenCount ?? 0,
    generationTime: Math.round((Date.now() - start) / 1000),
  };
}
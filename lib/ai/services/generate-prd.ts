import { ai, DEFAULT_MODEL } from "../client";
import { buildPRDPrompt } from "../prompts/prd";

export async function generatePRD(
  research: string
) {
  const start = Date.now();

  const response =
    await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: buildPRDPrompt(research),
    });

  return {
    content: response.text ?? "",
    model: DEFAULT_MODEL,
    tokens:
      response.usageMetadata
        ?.totalTokenCount ?? 0,
    generationTime: Math.round(
      (Date.now() - start) / 1000
    ),
  };
}
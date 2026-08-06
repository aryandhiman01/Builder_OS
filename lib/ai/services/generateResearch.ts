import { generateContentWithRetry, DEFAULT_MODEL } from "../client";
import { buildResearchPrompt } from "../prompts/research";

export interface ResearchResult {
  content: string;
  model: string;
  tokens: number;
  generationTime: number;
}

export async function generateResearch(prompt: string): Promise<ResearchResult> {
  const startTime = Date.now();

  try {
    const { response, usedModel } = await generateContentWithRetry({
      model: DEFAULT_MODEL,
      contents: buildResearchPrompt(prompt),
      config: {
        temperature: 0.4,
        topP: 0.9,
      },
    });

    const generationTime = Math.round((Date.now() - startTime) / 1000);
    const content = response.text?.trim() ?? "";

    if (!content) {
      throw new Error("Gemini returned an empty response.");
    }

    return {
      content,
      model: usedModel,
      tokens: response.usageMetadata?.totalTokenCount ?? 0,
      generationTime,
    };
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    const status = error?.status ?? error?.error?.code;
    if (status === 503 || error?.message?.includes("high demand")) {
      throw new Error("Gemini AI is currently experiencing high demand. Please retry in a few seconds.");
    }
    throw new Error(error?.message || "Failed to generate AI research.");
  }
}
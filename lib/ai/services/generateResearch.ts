import {
  ai,
  DEFAULT_MODEL,
} from "../client";

import {
  buildResearchPrompt,
} from "../prompts/research";

export interface ResearchResult {
  content: string;
  model: string;
  tokens: number;
  generationTime: number;
}

export async function generateResearch(
  prompt: string
): Promise<ResearchResult> {

  const startTime = Date.now();

  try {

    const response =
      await ai.models.generateContent({

        model: DEFAULT_MODEL,

        contents: buildResearchPrompt(
          prompt
        ),

      });

    const generationTime =
      (Date.now() - startTime) / 1000;

    const content =
      response.text?.trim() ?? "";

    if (!content) {

      throw new Error(
        "Gemini returned an empty response."
      );

    }

    return {

      content,

      model: DEFAULT_MODEL,

      tokens:
        response.usageMetadata
          ?.totalTokenCount ?? 0,

      generationTime,

    };

  } catch (error) {

    console.error(
      "Gemini Error:",
      error
    );

    throw new Error(
      "Failed to generate AI research."
    );

  }

}
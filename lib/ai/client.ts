import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const DEFAULT_MODEL = "gemini-3.6-flash";
export const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];

/**
 * Resilient wrapper around Google GenAI generateContent.
 * Retries on 503 / 429 high demand spikes and falls back gracefully to alternate models.
 */
export async function generateContentWithRetry(options: {
  contents: any;
  model?: string;
  config?: any;
  maxRetries?: number;
}) {
  const primaryModel = options.model || DEFAULT_MODEL;
  const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];
  const maxRetries = options.maxRetries ?? 3;

  let lastError: unknown;

  for (const currentModel of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...options,
          model: currentModel,
        });
        return { response, usedModel: currentModel };
      } catch (err: any) {
        lastError = err;
        const status = err?.status ?? err?.error?.code ?? err?.code;
        const msg = typeof err?.message === "string" ? err.message : "";
        const isTemporaryError =
          status === 503 ||
          status === 429 ||
          msg.includes("high demand") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isTemporaryError && attempt < maxRetries) {
          const delay = attempt * 1500;
          console.warn(
            `[Gemini AI Retry] Model ${currentModel} hit 503/429. Retrying attempt ${attempt}/${maxRetries} in ${delay}ms...`
          );
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        if (isTemporaryError) {
          console.warn(
            `[Gemini AI Fallback] Model ${currentModel} unavailable. Trying fallback model...`
          );
          break;
        }

        throw err;
      }
    }
  }

  throw lastError;
}
import { ai, DEFAULT_MODEL } from "../client";
import { aiChatPrompt } from "../prompts/ai-chat";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChat(
  message: string,
  history: ChatMessage[] = []
) {
  const start = Date.now();

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,

        contents: aiChatPrompt(message, history),

        config: {
          temperature: 0.6,
          topP: 0.95,
          topK: 40,
        },
      });

      return {
        message: response.text ?? "",

        model: DEFAULT_MODEL,

        tokens:
          response.usageMetadata?.totalTokenCount ?? 0,

        generationTime: Math.round(
          (Date.now() - start) / 1000
        ),
      };
    } catch (error: any) {
      lastError = error;

      const status =
        error?.status ?? error?.error?.code;

      if (
        status !== 503 ||
        attempt === MAX_RETRIES
      ) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY)
      );
    }
  }

  throw lastError;
}
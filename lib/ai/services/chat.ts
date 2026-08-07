import { generateContentWithRetry, DEFAULT_MODEL } from "../client";
import { aiChatPrompt } from "../prompts/ai-chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChat(
  message: string,
  history: ChatMessage[] = []
) {
  const start = Date.now();

  try {
    const { response, usedModel } = await generateContentWithRetry({
      model: DEFAULT_MODEL,
      contents: aiChatPrompt(message, history),
      config: {
        temperature: 0.25,
        topP: 0.9,
      },
    });

    const generationTime = Math.round((Date.now() - start) / 1000);
    const content = response.text?.trim() ?? "";

    if (!content) {
      throw new Error("AI returned an empty response.");
    }

    return {
      message: content,
      model: usedModel,
      tokens: response.usageMetadata?.totalTokenCount ?? 0,
      generationTime,
    };
  } catch (error: any) {
    console.error("AI Chat Generation Error:", error);
    throw error;
  }
}
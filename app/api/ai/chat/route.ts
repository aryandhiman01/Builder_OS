import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { generateChat } from "@/lib/ai/services/chat";

const aiConversationClient = (prisma as any).aIConversation;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const MODE_INSTRUCTIONS: Record<string, string> = {
  "web-search":
    "Respond as thoroughly and currently as you can. If any part of the answer depends on information that may have changed recently, say so explicitly rather than presenting it as certain.",

  "deep-research":
    "Provide an in-depth, well-structured report. Use clear headings, cover multiple relevant angles (trade-offs, risks, alternatives), and go deeper than a quick answer would.",

  diagram:
    "Respond primarily with a Mermaid diagram inside a ```mermaid code block that visualizes the requested flow or system, followed by a short explanation of the key parts.",
};

function buildTitle(message: string) {
  const clean = message.trim().replace(/\s+/g, " ");
  return clean.length > 60 ? `${clean.slice(0, 60)}...` : clean || "New conversation";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const message: string = body.message?.trim() ?? "";

    const history: ChatMessage[] = body.history ?? [];

    const conversationId: string | undefined = body.conversationId ?? undefined;

    const mode: string | undefined = body.mode ?? undefined;

    const context: string | undefined = body.context?.trim() || undefined;

    if (!message) {
      return NextResponse.json(
        {
          message: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        {
          message: "Message exceeds the maximum allowed length.",
        },
        {
          status: 400,
        }
      );
    }

    let existingConversation = null;

    if (conversationId) {
      existingConversation = await aiConversationClient.findFirst({
        where: {
          id: conversationId,
          user: {
            email: session.user.email,
          },
        },
      });

      if (!existingConversation) {
        return NextResponse.json(
          {
            message: "Conversation not found.",
          },
          {
            status: 404,
          }
        );
      }
    }

    // Compose the actual prompt sent to the model: attached context first,
    // then any active response-mode instruction, then the user's message.
    const promptParts: string[] = [];

    if (context) {
      promptParts.push(
        `Attached context:\n---\n${context}\n---`
      );
    }

    if (mode && MODE_INSTRUCTIONS[mode]) {
      promptParts.push(`Response mode: ${MODE_INSTRUCTIONS[mode]}`);
    }

    promptParts.push(message);

    const composedMessage = promptParts.join("\n\n");

    const result = await generateChat(composedMessage, history);

    // Persist the conversation so it shows up in the AI Workspace history.
    const updatedMessages: ChatMessage[] = [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: result.message },
    ];

    let savedConversationId = conversationId;
    let savedTitle = existingConversation?.title;

    if (existingConversation) {
      await aiConversationClient.update({
        where: {
          id: existingConversation.id,
        },
        data: {
          messages: JSON.stringify(updatedMessages),
        },
      });
    } else {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (user) {
        const title = buildTitle(message);

        const created = await aiConversationClient.create({
          data: {
            title,
            messages: JSON.stringify(updatedMessages),
            userId: user.id,
          },
        });

        savedConversationId = created.id;
        savedTitle = created.title;
      }
    }

    return NextResponse.json(
      {
        message: "Success",

        response: result.message,

        model: result.model,

        tokens: result.tokens,

        generationTime: result.generationTime,

        conversationId: savedConversationId,

        conversationTitle: savedTitle,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);

    if (error?.status === 503) {
      return NextResponse.json(
        {
          message:
            "BuilderOS AI is currently busy. Please try again in a moment.",
        },
        {
          status: 503,
        }
      );
    }

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to generate response.",
      },
      {
        status: 500,
      }
    );
  }
}
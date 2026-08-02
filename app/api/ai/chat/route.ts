import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import { generateChat } from "@/lib/ai/services/chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

    const message =
      body.message?.trim() ?? "";

    const history: ChatMessage[] =
      body.history ?? [];

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
          message:
            "Message exceeds the maximum allowed length.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await generateChat(
      message,
      history
    );

    return NextResponse.json(
      {
        message: "Success",

        response: result.message,

        model: result.model,

        tokens: result.tokens,

        generationTime:
          result.generationTime,
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
        message:
          error?.message ??
          "Failed to generate response.",
      },
      {
        status: 500,
      }
    );
  }
}
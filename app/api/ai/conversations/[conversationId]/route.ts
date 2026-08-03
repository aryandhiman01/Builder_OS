import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    conversationId: string;
  }>;
}

// GET — fetch a single conversation with its full message history
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { conversationId } = await params;

    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          message: "Conversation not found.",
        },
        {
          status: 404,
        }
      );
    }

    let messages: unknown = [];

    try {
      messages = JSON.parse(conversation.messages);
    } catch {
      messages = [];
    }

    return NextResponse.json(
      {
        message: "Success",

        conversation: {
          id: conversation.id,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          messages,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to load conversation.",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE — remove a conversation from history
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { conversationId } = await params;

    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: conversationId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          message: "Conversation not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.aIConversation.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json(
      {
        message: "Success",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to delete conversation.",
      },
      {
        status: 500,
      }
    );
  }
}

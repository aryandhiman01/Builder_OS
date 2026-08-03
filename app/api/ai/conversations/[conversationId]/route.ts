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

    const conversationRows = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        messages: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      SELECT c.id, c.title, c.messages, c."createdAt", c."updatedAt"
      FROM "AIConversation" c
      INNER JOIN "User" u ON c."userId" = u.id
      WHERE c.id = ${conversationId}
        AND u.email = ${session.user.email}
      LIMIT 1
    `;

    const conversation = conversationRows[0] ?? null;

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

    const conversationRows = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        messages: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      SELECT c.id, c.title, c.messages, c."createdAt", c."updatedAt"
      FROM "AIConversation" c
      INNER JOIN "User" u ON c."userId" = u.id
      WHERE c.id = ${conversationId}
        AND u.email = ${session.user.email}
      LIMIT 1
    `;

    const conversation = conversationRows[0] ?? null;

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

    await prisma.$executeRaw`
      DELETE FROM "AIConversation"
      WHERE id = ${conversationId}
        AND "userId" IN (
          SELECT u.id
          FROM "User" u
          WHERE u.email = ${session.user.email}
        )
    `;

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

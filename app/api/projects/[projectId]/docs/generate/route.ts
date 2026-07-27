import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { generateDocument } from "@/lib/ai/services/generate-document";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const { projectId } = await params;

    const body = await request.json();

    const title = body.title?.trim();
    const type = body.type?.trim();
    const prompt = body.prompt?.trim() ?? "";

    if (!title) {
      return NextResponse.json(
        {
          message: "Document title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!type) {
      return NextResponse.json(
        {
          message: "Document type is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (title.length > 120) {
      return NextResponse.json(
        {
          message: "Document title is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    const result = await generateDocument(
      project.title,
      title,
      prompt,
      type
    );

    const document = await prisma.document.create({
      data: {
        title,
        type,
        prompt,
        content: result.content,
        model: result.model,
        tokens: result.tokens,
        generationTime: result.generationTime,
        projectId,
      },
    });

    return NextResponse.json(
      {
        message: "Document generated successfully.",
        document,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);

    if (error?.status === 503) {
      return NextResponse.json(
        {
          message:
            "Gemini AI is currently busy. Please try again in a few moments.",
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
          "Failed to generate document.",
      },
      {
        status: 500,
      }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { generateArchitecture } from "@/lib/ai/services/generate-architecture";

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

    const { title, prompt } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json(
        {
          message: "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!prompt?.trim()) {
      return NextResponse.json(
        {
          message: "Prompt is required.",
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

    const result = await generateArchitecture(
      project.title,
      title,
      prompt
    );

    const architecture = await prisma.architecture.create({
      data: {
        title,
        prompt,
        content: result.content,
        model: result.model,
        tokens: result.tokens,
        generationTime: result.generationTime,
        projectId,

        // Custom Architecture
        roadmapId: null,
      },
    });

    return NextResponse.json(
      {
        message: "Architecture generated successfully.",
        architecture,
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
          "Failed to generate architecture.",
      },
      {
        status: 500,
      }
    );
  }
}
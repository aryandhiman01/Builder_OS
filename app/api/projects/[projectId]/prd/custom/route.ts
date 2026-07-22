import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { generatePRD } from "@/lib/ai";

interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}


// POST 
// Generate Custom PRD

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

    const body = await request.json();

    const { title, prompt } = body;

    if (!title || !prompt) {
      return NextResponse.json(
        {
          message: "Title and prompt are required.",
        },
        {
          status: 400,
        }
      );
    }

    const aiPRD = await generatePRD(prompt);

    const prd = await prisma.pRD.create({
      data: {
        title: title.trim(),

        prompt: prompt.trim(),

        content: aiPRD.content,

        model: aiPRD.model,

        tokens: aiPRD.tokens,

        generationTime: aiPRD.generationTime,

        projectId,

        researchId: null,
      },
    });

    return NextResponse.json(
      {
        message: "Custom PRD generated successfully.",

        prd,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate PRD.",
      },
      {
        status: 500,
      }
    );
  }
}
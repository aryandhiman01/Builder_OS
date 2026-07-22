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
// Generate PRD from Research

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

    const { title, researchId } = body;

    if (!title || !researchId) {
      return NextResponse.json(
        {
          message: "Title and Research ID are required.",
        },
        {
          status: 400,
        }
      );
    }

    const research = await prisma.research.findFirst({
      where: {
        id: researchId,
        projectId,
      },
    });

    if (!research) {
      return NextResponse.json(
        {
          message: "Research not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Prevent duplicate PRD generation
    const existingPRD = await prisma.pRD.findFirst({
      where: {
        researchId,
      },
    });

    if (existingPRD) {
      return NextResponse.json(
        {
          message: "PRD already exists for this research.",
        },
        {
          status: 409,
        }
      );
    }

    // Generate PRD using AI
    const aiPRD = await generatePRD(research.content);

    const prd = await prisma.pRD.create({
      data: {
        title: title.trim(),

        prompt: research.prompt,

        content: aiPRD.content,

        model: aiPRD.model,

        tokens: aiPRD.tokens,

        generationTime: aiPRD.generationTime,

        projectId,

        researchId,
      },
    });

    return NextResponse.json(
      {
        message: "PRD generated successfully.",

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
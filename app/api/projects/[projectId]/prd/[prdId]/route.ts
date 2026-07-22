import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    projectId: string;
    prdId: string;
  }>;
}

// GET single PRD
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, prdId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const prd = await prisma.pRD.findFirst({
      where: {
        id: prdId,
        projectId,
      },
    });

    if (!prd) {
      return NextResponse.json({ message: "PRD not found" }, { status: 404 });
    }

    return NextResponse.json(prd);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH update PRD title and content
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, prdId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content } = body;

    const existingPrd = await prisma.pRD.findFirst({
      where: {
        id: prdId,
        projectId,
      },
    });

    if (!existingPrd) {
      return NextResponse.json({ message: "PRD not found" }, { status: 404 });
    }

    const updatedPrd = await prisma.pRD.update({
      where: {
        id: prdId,
      },
      data: {
        title: title !== undefined ? title.trim() : existingPrd.title,
        content: content !== undefined ? content : existingPrd.content,
      },
    });

    return NextResponse.json(updatedPrd);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update PRD" }, { status: 500 });
  }
}

// DELETE PRD
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, prdId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    await prisma.pRD.delete({
      where: {
        id: prdId,
      },
    });

    return NextResponse.json({ message: "PRD deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to delete PRD" }, { status: 500 });
  }
}

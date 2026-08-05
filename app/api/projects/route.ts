import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects — return all projects accessible to the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownedProjects = await prisma.project.findMany({
      where: { user: { email: session.user.email } },
      select: { id: true, title: true, color: true, status: true },
      orderBy: { updatedAt: "desc" },
    });

    const sharedMemberships = await prisma.projectMember.findMany({
      where: { user: { email: session.user.email } },
      include: { project: { select: { id: true, title: true, color: true, status: true } } },
    });

    const ownedIds = new Set(ownedProjects.map((p) => p.id));
    const sharedProjects = sharedMemberships
      .map((m) => m.project)
      .filter((p) => !ownedIds.has(p.id));

    const projects = [...ownedProjects, ...sharedProjects];
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[GET_PROJECTS]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      title,
      description,
      category,
      color,
    } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        {
          error: "Project title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: user.id,
        category,
        color,
        status: "Planning",
      },
    });

    return NextResponse.json(
      {
        success: true,
        project,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
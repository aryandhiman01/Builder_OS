import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EXCERPT_LENGTH = 1500;

interface DocRecord {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface ProjectWithDocs {
  id: string;
  title: string;
  prds: DocRecord[];
  roadmaps: DocRecord[];
  architectures: DocRecord[];
  researches: DocRecord[];
  documents: DocRecord[];
}

function excerpt(content: string) {
  if (content.length <= EXCERPT_LENGTH) return content;
  return `${content.slice(0, EXCERPT_LENGTH)}...`;
}

// GET — list the user's project documents (PRDs, roadmaps, architecture,
// research & docs) so they can be attached as context in the AI Workspace.
export async function GET() {
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

    const projects = await prisma.project.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },

      select: {
        id: true,
        title: true,

        prds: {
          select: { id: true, title: true, content: true, updatedAt: true },
        },

        roadmaps: {
          select: { id: true, title: true, content: true, updatedAt: true },
        },

        architectures: {
          select: { id: true, title: true, content: true, updatedAt: true },
        },

        researches: {
          select: { id: true, title: true, content: true, updatedAt: true },
        },

        documents: {
          select: { id: true, title: true, content: true, updatedAt: true },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    const results = (projects as ProjectWithDocs[])
      .map((project) => {
        const items = [
          ...project.prds.map((item: DocRecord) => ({
            id: item.id,
            type: "prd" as const,
            title: item.title,
            excerpt: excerpt(item.content),
            updatedAt: item.updatedAt,
          })),
          ...project.roadmaps.map((item: DocRecord) => ({
            id: item.id,
            type: "roadmap" as const,
            title: item.title,
            excerpt: excerpt(item.content),
            updatedAt: item.updatedAt,
          })),
          ...project.architectures.map((item: DocRecord) => ({
            id: item.id,
            type: "architecture" as const,
            title: item.title,
            excerpt: excerpt(item.content),
            updatedAt: item.updatedAt,
          })),
          ...project.researches.map((item: DocRecord) => ({
            id: item.id,
            type: "research" as const,
            title: item.title,
            excerpt: excerpt(item.content),
            updatedAt: item.updatedAt,
          })),
          ...project.documents.map((item: DocRecord) => ({
            id: item.id,
            type: "document" as const,
            title: item.title,
            excerpt: excerpt(item.content),
            updatedAt: item.updatedAt,
          })),
        ].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        );

        return {
          id: project.id,
          title: project.title,
          items,
        };
      })
      .filter((project) => project.items.length > 0);

    return NextResponse.json(
      {
        message: "Success",
        projects: results,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error?.message ?? "Failed to load project files.",
      },
      {
        status: 500,
      }
    );
  }
}

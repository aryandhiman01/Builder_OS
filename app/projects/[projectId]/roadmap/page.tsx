import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import RoadmapPageClient from "./RoadmapPageClient";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function RoadmapsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { projectId } = await params;

  // Single-pass parallel execution for project & roadmaps
  const [project, roadmaps] = await Promise.all([
    prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
      include: {
        prds: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            prompt: true,
            model: true,
            tokens: true,
            generationTime: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.roadmap.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        prd: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
  ]);

  if (!project) {
    redirect("/projects");
  }

  const formattedRoadmaps = roadmaps.map((r) => ({
    ...r,
    content: r.content ?? "",
    prompt: r.prompt ?? "",
  }));

  return (
    <RoadmapPageClient
      projectId={projectId}
      projectTitle={project.title}
      initialRoadmaps={formattedRoadmaps}
      prds={project.prds}
    />
  );
}
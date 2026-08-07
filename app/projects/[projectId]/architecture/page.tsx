import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ArchitecturePageClient from "./ArchitecturePageClient";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ArchitecturePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { projectId } = await params;

  // Single-pass parallel execution for project & architectures
  const [project, architectures] = await Promise.all([
    prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
      include: {
        roadmaps: {
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
    prisma.architecture.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        roadmap: {
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

  const formattedRoadmaps = (project.roadmaps || []).map((r) => ({
    ...r,
    prompt: r.prompt ?? "",
  }));

  return (
    <ArchitecturePageClient
      projectId={projectId}
      projectTitle={project.title}
      initialArchitectures={architectures}
      roadmaps={formattedRoadmaps}
    />
  );
}
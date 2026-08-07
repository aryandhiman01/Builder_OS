import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoadmapDetailClient from "@/components/roadmaps/RoadmapDetailClient";

interface PageProps {
  params: Promise<{
    roadmapId: string;
  }>;
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { roadmapId } = await params;
  const userEmail = session.user.email;

  // Single optimized query with 1-time auto retry for Neon cold starts
  let roadmap = null;
  try {
    roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: userEmail } },
          { project: { user: { email: userEmail } } },
          { project: { members: { some: { user: { email: userEmail } } } } },
        ],
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        milestones: {
          orderBy: { order: "asc" },
          include: {
            steps: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  } catch (dbError) {
    console.warn("[ROADMAP_DETAIL_DB_RETRY]", dbError);
    // Auto retry once after short delay for Neon serverless pooler cold-start
    await new Promise((res) => setTimeout(res, 400));
    roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: userEmail } },
          { project: { user: { email: userEmail } } },
          { project: { members: { some: { user: { email: userEmail } } } } },
        ],
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            color: true,
          },
        },
        milestones: {
          orderBy: { order: "asc" },
          include: {
            steps: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  if (!roadmap) {
    notFound();
  }

  if (roadmap.projectId) {
    redirect(`/projects/${roadmap.projectId}/roadmap/${roadmap.id}`);
  }

  // Calculate progress
  let totalSteps = 0;
  let completedSteps = 0;
  roadmap.milestones.forEach((m) => {
    totalSteps += m.steps.length;
    completedSteps += m.steps.filter((s) => s.completed).length;
  });

  const calculatedProgress =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : roadmap.progress;

  const formattedRoadmap = {
    ...roadmap,
    progress: calculatedProgress,
    createdAt: roadmap.createdAt.toISOString(),
    updatedAt: roadmap.updatedAt.toISOString(),
    milestones: roadmap.milestones.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      steps: m.steps.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
    })),
  };

  return <RoadmapDetailClient initialRoadmap={formattedRoadmap} />;
}

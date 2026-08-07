import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RoadmapsPageClient from "./RoadmapsPageClient";

export default async function RoadmapsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const rawRoadmaps = await prisma.roadmap.findMany({
    where: {
      OR: [
        { userId: user.id },
        { project: { userId: user.id } },
        { project: { members: { some: { userId: user.id } } } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      prompt: true,
      type: true,
      status: true,
      progress: true,
      estimatedDuration: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      projectId: true,
      project: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      milestones: {
        select: {
          id: true,
          steps: {
            select: {
              id: true,
              completed: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const formattedRoadmaps = rawRoadmaps.map((rm) => {
    let milestoneCount = rm.milestones.length;
    let totalSteps = 0;
    let completedSteps = 0;

    if (milestoneCount > 0) {
      rm.milestones.forEach((m) => {
        totalSteps += m.steps.length;
        completedSteps += m.steps.filter((s) => s.completed).length;
      });
    } else if (rm.content) {
      const phaseMatches = rm.content.match(/(Phase|Sprint|Milestone)\s+\d+[:\s—–-]/gi);
      if (phaseMatches && phaseMatches.length > 0) {
        milestoneCount = new Set(phaseMatches.map((s) => s.trim().toLowerCase())).size;
      } else {
        const sectionHeadings = rm.content.match(/^##\s+.+/gm);
        milestoneCount = sectionHeadings ? Math.max(1, sectionHeadings.length) : 1;
      }
    }

    const calculatedProgress =
      totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : rm.progress;

    let duration = rm.estimatedDuration;
    if (!duration && rm.content) {
      const durationMatch = rm.content.match(/(Duration|Timeline|Estimated Duration):\s*([^\n]+)/i);
      if (durationMatch && durationMatch[2]) {
        duration = durationMatch[2].replace(/[\*\_\`]/g, "").trim();
      }
    }

    const displayType = rm.type === "STANDALONE" && !rm.projectId ? "STANDALONE" : "PROJECT";
    const displayDescription = rm.description || rm.prompt || null;

    return {
      id: rm.id,
      title: rm.title,
      description: displayDescription,
      type: displayType,
      status: rm.status,
      progress: calculatedProgress,
      estimatedDuration: duration,
      createdAt: rm.createdAt.toISOString(),
      updatedAt: rm.updatedAt.toISOString(),
      projectId: rm.projectId,
      projectTitle: rm.project?.title ?? null,
      projectColor: rm.project?.color ?? null,
      milestonesCount: Math.max(1, milestoneCount),
      stepsCount: totalSteps,
      completedStepsCount: completedSteps,
    };
  });

  return <RoadmapsPageClient initialRoadmaps={formattedRoadmaps} />;
}

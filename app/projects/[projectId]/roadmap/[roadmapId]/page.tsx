import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import RoadmapViewer from "@/components/roadmap/RoadmapViewer";

interface RouteParams {
  params: Promise<{
    projectId: string;
    roadmapId: string;
  }>;
}

export default async function RoadmapViewerPage({
  params,
}: RouteParams) {
  const { projectId, roadmapId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
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
    notFound();
  }

  const roadmap = await prisma.roadmap.findFirst({
    where: {
      id: roadmapId,
      projectId,
    },
    include: {
      prd: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!roadmap) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <RoadmapViewer
        projectId={projectId}
        roadmap={{
          ...roadmap,
          content: roadmap.content ?? "",
        }}
      />
    </div>
  );
}
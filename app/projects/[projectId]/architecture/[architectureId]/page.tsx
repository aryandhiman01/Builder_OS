import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ArchitectureViewer from "@/components/architecture/ArchitectureViewer";

interface RouteParams {
  params: Promise<{
    projectId: string;
    architectureId: string;
  }>;
}

export default async function ArchitectureViewerPage({
  params,
}: RouteParams) {
  const { projectId, architectureId } = await params;

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

  const architecture = await prisma.architecture.findFirst({
    where: {
      id: architectureId,
      projectId,
    },
    include: {
      roadmap: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!architecture) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ArchitectureViewer
        projectId={projectId}
        architecture={architecture}
      />
    </div>
  );
}
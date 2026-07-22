import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import PRDPageClient from "./PRDPageClient";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function PRDsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user: {
        email: session.user.email,
      },
    },
    include: {
      researches: {
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
  });

  if (!project) {
    redirect("/projects");
  }

  const prds = await prisma.pRD.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PRDPageClient
      projectId={projectId}
      projectTitle={project.title}
      initialPrds={prds}
      researches={project.researches}
    />
  );
}

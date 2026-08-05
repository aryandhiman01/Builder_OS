import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ResearchClient from "@/components/research/ResearchClient";

interface ResearchPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const { projectId } = await params;

  // Single-pass parallel DB queries for project & researches
  const [project, researches] = await Promise.all([
    prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
    }),
    prisma.research.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ResearchClient
      project={{
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        category: project.category,
        color: project.color,
      }}
      researches={researches}
    />
  );
}
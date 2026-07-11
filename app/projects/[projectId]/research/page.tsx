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

export default async function ResearchPage({
  params,
}: ResearchPageProps) {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({

      where: {

        id: projectId,

        user: {
          email:
            session.user.email,
        },

      },

    });

  if (!project) {
    notFound();
  }

  const researches = await prisma.research.findMany({

      where: {
        projectId,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

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
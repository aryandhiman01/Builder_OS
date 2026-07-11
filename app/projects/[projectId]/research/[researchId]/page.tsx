import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import ResearchViewer from "@/components/research/ResearchViewer";

interface ResearchDetailPageProps {
  params: Promise<{
    projectId: string;
    researchId: string;
  }>;
}

export default async function ResearchDetailPage({
  params,
}: ResearchDetailPageProps) {

  const session =
    await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const {
    projectId,
    researchId,
  } = await params;

  const research = await prisma.research.findFirst({

      where: {

        id: researchId,

        projectId,

        project: {

          user: {
            email:
              session.user.email,
          },

        },

      },

    });

  if (!research) {
    notFound();
  }

    return (
    <ResearchViewer
      projectId={projectId}
      research={{
        id: research.id,
        title: research.title,
        prompt: research.prompt,
        content: research.content,
        model: research.model,
        tokens: research.tokens,
        generationTime:
          research.generationTime,
        createdAt:
          research.createdAt,
        updatedAt:
          research.updatedAt,
      }}
    />
  );
}

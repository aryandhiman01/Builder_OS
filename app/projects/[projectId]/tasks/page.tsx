import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import TaskBoard from "@/components/tasks/TaskBoard";

interface TaskPageProps {
    params: Promise<{
        projectId: string;
    }>;
}

export default async function TasksPage({ params }: TaskPageProps) {
    const session = await getServerSession(authOptions);

    if(!session?.user?.email) {
        notFound();
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
            tasks: {
                orderBy: [
                    {
                        order: "asc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
            },
        },
    });

    if(!project) {
        notFound();
    }
    
    return(
        <TaskBoard
        projectId={project.id}
        tasks={project.tasks}
        />
    );
}
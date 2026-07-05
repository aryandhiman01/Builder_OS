import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        projectId: string;
    }>;
}

// GET Function

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401});
        }

        const { projectId }  = await params;

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                user: {
                    email: session.user.email,
                },
            },
            select: {
                id: true,
            },
        });

        if(!project) {
            return NextResponse.json({ error: "Project not found"}, {status: 404});
        }

        const tasks = await prisma.task.findMany({
            where: {
                projectId: project.id
            },
            orderBy: [
                {
                    order: "asc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json({
            success: true,
            tasks,
        });
    } catch (error) {
        console.error("[GET_TASKS", error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}
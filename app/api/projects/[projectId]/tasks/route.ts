import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        projectId: string;
    }>;
}

// GET operation

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


// POST Operation
export async function POST(req: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json(
                {
                    error: "Unauthoized",
                },
                {
                    status: 401,
                }
            );
        }

        const { projectId } = await params;

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                user: {
                    email: session.user.email,
                },
            },
            select: {
                id: true,
            }
        });

        if(!project) {
            return NextResponse.json(
                {
                    error: "Projects not Found",
                },
                {
                    status: 404,
                }
            );
        }

        const body = await req.json();
        const { title, description, priority, dueDate } = body;

        if(!title || title.trim().length === 0) {
            return NextResponse.json(
                {
                    error: "Task title is required",
                },
                {
                    status: 400,
                }
            );
        }

        const lastTask = await prisma.task.findFirst({
            where: {
                projectId: project.id,
            },
            orderBy: {
                order: "desc",
            },
            select: {
                order: true,
            },
        });

        const nextOrder = lastTask ? lastTask.order + 1 : 0;

        const task = await prisma.task.create({
            data: {
                title: title.trim(),
                description: description.trim() || null,
                priority: priority || "medium",
                dueDate: dueDate ? new Date(dueDate) : null,
                status: "todo",
                order: nextOrder,
                projectId: project.id,
            },
        });
        return NextResponse.json(
            {
                success: true,
                task,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("[CREATE_TASK]", error);

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


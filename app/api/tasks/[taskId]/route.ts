import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{
        taskId: string;
    }>;
}


//  PATCH Operation
export async function PATCH(req: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 400,
                }
            );
        }

        const { taskId } = await params;

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    user: {
                        email: session.user.email,
                    },
                },
            },
        });

        if(!task) {
            return NextResponse.json(
                {
                    error: "Task not found",
                },
                {
                    status: 404,
                }
            );
        }

        const body = await req.json();
        const { title, description, priority, status, dueDate, order, estimatedHours, tags, subtasks } = body;

        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                title: title !== undefined ? title.trim() : task.title,
                description: description !== undefined ? description : task.description,
                priority: priority ?? task.priority,
                status: status ?? task.status,
                dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : task.dueDate,
                order: order ?? task.order,
                estimatedHours: estimatedHours !== undefined
                    ? (estimatedHours !== null && estimatedHours !== '' ? parseFloat(String(estimatedHours)) : null)
                    : task.estimatedHours,
                tags: tags !== undefined
                    ? (tags === null ? null : typeof tags === 'string' ? tags : JSON.stringify(tags))
                    : task.tags,
                subtasks: subtasks !== undefined
                    ? (subtasks === null ? null : typeof subtasks === 'string' ? subtasks : JSON.stringify(subtasks))
                    : task.subtasks,
            },
        });

        return NextResponse.json({
            success: true,
            task: updatedTask,
        });

    } catch (error) {
        console.error("[UPDATE_TASK]", error);

        return NextResponse.json(
            {
                error: "Somehting went wrong",
            },
            {
                status: 500,
            }
        );
    }
}


// DELETE Operation
export async function DELETE(req: Request, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { taskId } = await params;

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    user: {
                        email: session.user.email,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        if(!task) {
            return NextResponse.json(
                {
                    error: "Task not found",
                },
                {
                    status: 404,
                }
            );
        }

        await prisma.task.delete({
            where: {
                id: task.id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("[DELETE_TASK]", error);

        return NextResponse.json(
            {
                error: " Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}
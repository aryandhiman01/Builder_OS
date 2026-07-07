import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "console";

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
        const { title, description, priority, status, dueDate, order} = body;

        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                title: title !== undefined ? title.trim() : task.title,
                description: description !== undefined ? description : task.description,
                priority: priority ?? task.priority,
                status: status ?? task.status,
                dueDate: dueDate ? new Date(dueDate) : task.dueDate,
                order: order ?? task.order,
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
    }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{
        projectId: string
    }>;
}

//GET
export async function GET(request: NextRequest, { params }: RouteParams) {
    try{
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
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
        });

        if(!project) {
            return NextResponse.json(
                {
                    message: "Project not found",
                },
                {
                    status: 404,
                }
            );
        }

        const roadmaps = await prisma.roadmap.findMany({
            where: {
                projectId,
            },
            include: {
                prd: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                roadmaps,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                message: error?.message ?? "Failed to fetch roadmaps.",
            },
            {
                status: 500,
            }
        );
    }
}
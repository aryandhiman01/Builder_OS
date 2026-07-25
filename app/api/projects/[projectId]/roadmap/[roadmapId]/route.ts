import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{
        projectId: string;
        roadmapId: string;
    }>;
}

//GET
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
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

        const { projectId, roadmapId } = await params;

        const roadmap = await prisma.roadmap.findFirst({
            where: {
                id: roadmapId,
                projectId,
                project: {
                    user: {
                        email: session.user.email,
                    },
                },
            },
            include: {
                prd: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if(!roadmap) {
            return NextResponse.json(
                {
                    message: "Roadmap not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                roadmap,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                message: error?.message ?? "Failed to fetch roadmap.",
            },
            {
                status: 500,
            }
        );
    }
}


//PATCH
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
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

        const { projectId, roadmapId} = await params;

        const { title, content } = await request.json();

        const roadmap = await prisma.roadmap.findFirst({
            where: {
                id: roadmapId,
                projectId,
                project: {
                    user: {
                        email: session.user.email,
                    },
                },
            },
        });

        if(!roadmap) {
            return NextResponse.json(
                {
                    message: "Roadmap no found.",
                },
                {
                    status: 404,
                }
            );
        }

        const updated = await prisma.roadmap.update({
            where: {
                id: roadmapId,
            },
            data: {
                title: title ?? roadmap.title,
                content: content ?? roadmap.content,
            },
        });

        return NextResponse.json(
            {
                message: "Roadmap Updated Successfully.",
                roadmap: updated,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                message: error?.message ?? "Failed to update roadmap.",
            },
            {
                status: 500,
            }
        );
    }
}


// DELETE
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try { 
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

        const { projectId, roadmapId } = await params;

        const roadmap = await prisma.roadmap.findFirst({
            where: {
                id: roadmapId,
                projectId,
                project: {
                    user: {
                        email: session.user.email,
                    },
                },
            },
        });

        if(!roadmap) {
            return NextResponse.json(
                {
                    message: "Roadmap nor found.",
                },
                {
                    status: 404,
                }
            );
        }

        const deleteRoadmap = await prisma.roadmap.delete({
            where: {
                id: roadmapId,
            },
        });

        return NextResponse.json(
            {
                message: "Roadmap deleted successfully.",
                roadmap: deleteRoadmap,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        console.log(error);

        return NextResponse.json(
            {
                message: error?.message ?? "Failed to delete roadmap.",
            },
            {
                status: 500,
            }
        )
    } 
}
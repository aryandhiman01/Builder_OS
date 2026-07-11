import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{
        projectId: string;
    }>;
}

// GET
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

        const researches = await prisma.research.findMany({
            where: {
                projectId,
            },

            orderBy: {
                createdAt: "desc",
            },

            select: {
                id: true,
                title: true,
                prompt: true,
                model: true,
                tokens: true,
                generationTime: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            researches
        );
    } catch (error) {
        console.error(error);
        
        return NextResponse.json(
            {
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );
    }
}


// POST
export async function POST(request: NextRequest, { params }: RouteParams) {
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
                },
            );
        }

        const body = await request.json();

        const{ title, prompt, content, model, tokens, generationTime } = body;

        if(!title || !prompt || !content) {
            return NextResponse.json(
                {
                    message: "Title, prompt and content are required",
                },
                {
                    status: 400,
                }
            );
        }

        if (prompt.trim().length < 10) {
            return NextResponse.json(
                {
                    message: "Prompt must contain at least 10 characters.",
                },
                {
                    status: 400,
                }
            );
        }

        if (title.trim().length < 3) {
            return NextResponse.json(
                {
                    message: "Title must contain at least 3 characters.",
                },
                {
                    status: 400,
            }
        );
        }

        const research = await prisma.research.create({
            data: {
                title: title.trim(),
                prompt: prompt.trim(),
                content: content.trim(),
                model,
                tokens,
                generationTime,
                projectId,
            },
        });

        return NextResponse.json(
            research,
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Failed to create research",
            },
            {
                status: 500,
            }
        );
    }
}
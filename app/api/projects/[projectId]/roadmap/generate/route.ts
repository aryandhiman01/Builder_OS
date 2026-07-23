import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { generateRoadmap } from "@/lib/ai/services/generate-roadmap";
import { Session } from "inspector/promises";

interface RouteParams {
    params: Promise<{
        projectId: string;
    }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const Session = await getServerSession(authOptions);

        if(!Session?.user?.email) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            )
        }

        const { projectId } = await params;

        const body = await request.json();

        const { prdId } = body;

        if(!prdId) {
            return NextResponse.json(
                {
                    message: "PRD ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                user: {
                    email: Session.user.email,
                },
            },
        });

        if(!project) {
            return NextResponse.json(
                {
                    message: "Project not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const prd = await prisma.pRD.findFirst({
            where: {
                id: prdId,
                projectId,
            },
        });

        if(!prd) {
            return NextResponse.json(
                {
                    message: "PRD not found",
                },
                { 
                    status: 404,
                }
            );
        }

        //Prevent Duplicate roadmap
        const existingRoadmap = await prisma.roadmap.findUnique({
            where: {
                prdId,
            },
        });

        if(existingRoadmap) {
            return NextResponse.json(
                {
                    message: "Roadmap already exists for this PRD.",
                    roadmap: existingRoadmap,
                },
                {
                    status: 200,
                }
            );
        }

        const result = await generateRoadmap(prd.content);

        const roadmap = await prisma.roadmap.create({
            data: {
                title: `${prd.title} Roadmap`,
                prompt: prd.prompt,
                content: result.content,
                model: result.model,
                tokens: result.tokens,
                generationTime: result.generationTime,
                projectId,
                prdId,
            },
        });

        return NextResponse.json(
            {
                message: "Roadmap generated successfully.",
            },
            {
                status: 201,
            }
        );
    } catch (error: any) {
        console.error(error);

        if(error?.status === 503) {
            return NextResponse.json(
                {
                    message: "Gemini AI is currently busy. Please try again in a moment.",
                },
                {
                    status: 503,
                }
            );
        }

        return NextResponse.json(
            {
                messsage: error?.message ?? "Failed to generate roadmap.",
            },
            {
                status: 500,
            }
        );
    }
}
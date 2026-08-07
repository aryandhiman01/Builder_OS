import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContentWithRetry } from "@/lib/ai/client";

interface Params {
  params: Promise<{
    roadmapId: string;
  }>;
}

// POST /api/roadmaps/:id/resources - AI generate suggested resources (Docs, Videos, GitHub, Courses)
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId } = await params;

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: session.user.email } },
          { project: { user: { email: session.user.email } } },
          { project: { members: { some: { user: { email: session.user.email } } } } },
        ],
      },
      include: {
        milestones: {
          select: { title: true },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    const milestoneTitles = roadmap.milestones.map((m) => m.title).join(", ");

    const prompt = `You are BuilderOS AI Resource Curator.
For the roadmap titled "${roadmap.title}" covering topics: ${milestoneTitles || roadmap.title}.

Curate 6 to 10 top-tier learning resources across Docs, Video Tutorials, GitHub Repositories, and Courses.

Return ONLY a valid JSON array of objects strictly matching this format:
[
  {
    "title": "Official Next.js Documentation",
    "url": "https://nextjs.org/docs",
    "type": "Docs", // Docs | Video | GitHub | Course
    "description": "Comprehensive guide for Next.js App Router, Server Components, and Routing."
  }
]

Make sure type is strictly one of: "Docs", "Video", "GitHub", "Course". Provide realistic, highly relevant URLs and descriptions.
Do NOT use code block markers like \`\`\`json. Output raw JSON array only.`;

    const { response } = await generateContentWithRetry({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let cleanJsonStr = rawText.trim();
    if (cleanJsonStr.startsWith("```json")) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const resources = JSON.parse(cleanJsonStr);

    // Save to roadmap DB
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        resources: JSON.stringify(resources),
      },
    });

    return NextResponse.json({
      success: true,
      resources,
      roadmap: updatedRoadmap,
    });
  } catch (error) {
    console.error("[POST_ROADMAP_RESOURCES]", error);
    return NextResponse.json(
      { error: "Failed to generate suggested resources" },
      { status: 500 }
    );
  }
}

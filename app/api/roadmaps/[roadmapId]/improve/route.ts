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

// POST /api/roadmaps/:id/improve - AI analyzes roadmap and injects missing milestones/steps
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
          orderBy: { order: "asc" },
          include: {
            steps: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    const currentStructure = {
      title: roadmap.title,
      description: roadmap.description,
      milestones: roadmap.milestones.map((m) => ({
        title: m.title,
        steps: m.steps.map((s) => s.title),
      })),
    };

    const systemPrompt = `You are BuilderOS AI. Analyze the existing roadmap below and identify critical missing milestones, missing security/scalability/testing steps, or optimization phases.

Current Roadmap:
${JSON.stringify(currentStructure, null, 2)}

Provide an improved and updated set of milestones and steps. Keep existing good milestones and append or insert 1-3 missing critical milestones or steps.

Respond strictly with JSON matching this structure:
{
  "improvedMilestones": [
    {
      "title": "Milestone Name",
      "description": "Milestone description",
      "steps": [
        {
          "title": "Step title",
          "description": "Step description",
          "estimatedHours": 4
        }
      ]
    }
  ],
  "improvementsSummary": "Summary of what missing milestones/steps were added and why"
}

Do NOT output codeblock markers like \`\`\`json. Return raw JSON.`;

    const { response } = await generateContentWithRetry({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let cleanJsonStr = rawText.trim();
    if (cleanJsonStr.startsWith("```json")) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsedData = JSON.parse(cleanJsonStr);

    if (parsedData.improvedMilestones && Array.isArray(parsedData.improvedMilestones)) {
      // Clear old milestones and recreate improved ones
      await prisma.roadmapMilestone.deleteMany({
        where: { roadmapId },
      });

      for (let mIdx = 0; mIdx < parsedData.improvedMilestones.length; mIdx++) {
        const m = parsedData.improvedMilestones[mIdx];
        await prisma.roadmapMilestone.create({
          data: {
            roadmapId,
            title: m.title,
            description: m.description || null,
            order: mIdx,
            steps: {
              create: (m.steps || []).map((s: any, sIdx: number) => ({
                title: typeof s === "string" ? s : s.title,
                description: typeof s === "object" ? s.description : null,
                estimatedHours: typeof s === "object" ? s.estimatedHours || 4 : 4,
                order: sIdx,
              })),
            },
          },
        });
      }
    }

    const updatedRoadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        milestones: {
          orderBy: { order: "asc" },
          include: { steps: { orderBy: { order: "asc" } } },
        },
      },
    });

    return NextResponse.json({
      success: true,
      roadmap: updatedRoadmap,
      summary: parsedData.improvementsSummary || "Roadmap improved with missing milestones and steps.",
    });
  } catch (error) {
    console.error("[POST_ROADMAP_IMPROVE]", error);
    return NextResponse.json(
      { error: "Failed to improve roadmap with AI" },
      { status: 500 }
    );
  }
}

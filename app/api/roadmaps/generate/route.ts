import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContentWithRetry } from "@/lib/ai/client";

// POST /api/roadmaps/generate - AI Generate a complete roadmap
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { prompt, type, projectId } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required for roadmap generation." },
        { status: 400 }
      );
    }

    let projectTitle = "";
    if (type === "PROJECT" && projectId) {
      const proj = await prisma.project.findUnique({
        where: { id: projectId },
        select: { title: true },
      });
      if (proj) projectTitle = proj.title;
    }

    const systemPrompt = `You are BuilderOS AI, an elite technical architect and career strategist.
Generate a comprehensive, production-grade roadmap based on the following user prompt: "${prompt}".
${projectTitle ? `Context: This roadmap is for the Project titled "${projectTitle}".` : ""}

You MUST respond with a single, valid JSON object strictly matching this schema:
{
  "title": "A short, crisp title for the roadmap",
  "description": "A 2-3 sentence overview of the roadmap objectives and target outcomes",
  "estimatedDuration": "e.g., 6 Months, 180 Hours",
  "milestones": [
    {
      "title": "Milestone Name (e.g. Authentication & Authorization)",
      "description": "Milestone goal description",
      "steps": [
        {
          "title": "Step title (e.g. Implement JWT Access and Refresh Tokens)",
          "description": "Brief instruction or detail for this step",
          "estimatedHours": 8
        }
      ]
    }
  ],
  "resources": [
    {
      "title": "Resource Name",
      "url": "https://example.com",
      "type": "Docs | Video | GitHub | Course",
      "description": "Why this resource is recommended"
    }
  ],
  "overviewMarkdown": "Full detailed markdown overview document explaining the roadmap strategy, phase breakdown, key technologies, and best practices."
}

Do NOT wrap the response in markdown codeblock markers like \`\`\`json. Return ONLY the raw JSON string.`;

    const startTime = Date.now();
    const { response, usedModel } = await generateContentWithRetry({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
    });
    const generationTime = Math.round((Date.now() - startTime) / 1000);

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let cleanJsonStr = rawText.trim();
    if (cleanJsonStr.startsWith("```json")) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanJsonStr);
    } catch (e) {
      console.error("[GENERATE_ROADMAP_JSON_PARSE_ERROR]", cleanJsonStr);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    const roadmapType = type === "PROJECT" && projectId ? "PROJECT" : "STANDALONE";

    const createdRoadmap = await prisma.roadmap.create({
      data: {
        title: parsedData.title || prompt.slice(0, 50),
        description: parsedData.description || null,
        type: roadmapType,
        userId: user.id,
        projectId: roadmapType === "PROJECT" ? projectId : null,
        status: "PLANNING",
        progress: 0,
        prompt,
        content: parsedData.overviewMarkdown || null,
        estimatedDuration: parsedData.estimatedDuration || "3 Months",
        resources: parsedData.resources ? JSON.stringify(parsedData.resources) : null,
        model: usedModel,
        generationTime,
        milestones: {
          create: (parsedData.milestones || []).map((m: any, mIdx: number) => ({
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
          })),
        },
      },
      include: {
        milestones: {
          include: {
            steps: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        roadmap: createdRoadmap,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST_GENERATE_ROADMAP]", error);
    return NextResponse.json(
      { error: "Failed to generate AI roadmap" },
      { status: 500 }
    );
  }
}

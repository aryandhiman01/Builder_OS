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

// POST /api/roadmaps/:id/convert - ⭐ KILLER FEATURE: Convert Standalone Roadmap -> Executable BuilderOS Project
export async function POST(req: Request, { params }: Params) {
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

    const { roadmapId } = await params;
    const body = await req.json();

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

    const projectTitle = body.title?.trim() || roadmap.title;
    const projectDescription = body.description?.trim() || roadmap.description || `Converted from Roadmap "${roadmap.title}"`;
    const category = body.category || "SaaS";
    const color = body.color || "#f97316";

    // Step 1: Create Project in DB
    const newProject = await prisma.project.create({
      data: {
        title: projectTitle,
        description: projectDescription,
        category,
        color,
        status: "Planning",
        userId: user.id,
      },
    });

    // Step 2: Link Roadmap to the new Project
    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        type: "PROJECT",
        projectId: newProject.id,
      },
    });

    // Extract milestones & steps text for AI generation prompts
    const milestonesSummary = roadmap.milestones
      .map(
        (m, idx) =>
          `Milestone ${idx + 1}: ${m.title}\nDescription: ${m.description || ""}\nSteps:\n` +
          m.steps.map((s) => `- ${s.title} (${s.estimatedHours || 2}h)`).join("\n")
      )
      .join("\n\n");

    // Step 3: Convert all Roadmap Steps directly into Project Tasks in DB
    let orderIndex = 0;
    const taskPromises = [];

    for (const milestone of roadmap.milestones) {
      for (const step of milestone.steps) {
        taskPromises.push(
          prisma.task.create({
            data: {
              projectId: newProject.id,
              title: step.title,
              description: `[Milestone: ${milestone.title}] ${step.description || ""}`,
              status: step.completed ? "completed" : "todo",
              priority: orderIndex < 3 ? "high" : "medium",
              estimatedHours: step.estimatedHours || 3,
              order: orderIndex++,
              tags: JSON.stringify([milestone.title.slice(0, 15), "Roadmap-Import"]),
            },
          })
        );
      }
    }

    await Promise.all(taskPromises);

    // Step 4: AI Generate Research, PRD, and Architecture artifacts asynchronously or inline
    const aiPrompt = `We are converting a roadmap into a full product suite for project "${projectTitle}".
Roadmap Overview: ${projectDescription}

Milestones & Tasks:
${milestonesSummary}

Generate standard initial product artifacts. Return a JSON object strictly adhering to:
{
  "researchContent": "Detailed markdown technical & market research for this product suite",
  "prdContent": "Comprehensive PRD with core features, user personas, requirements, and scope",
  "architectureContent": "Complete System Architecture document with component breakdown, database schema strategy, and API contracts"
}

Do NOT wrap response in codeblock backticks. Output JSON only.`;

    try {
      const { response, usedModel } = await generateContentWithRetry({
        contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      });

      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let cleanJsonStr = rawText.trim();
      if (cleanJsonStr.startsWith("```json")) {
        cleanJsonStr = cleanJsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (cleanJsonStr.startsWith("```")) {
        cleanJsonStr = cleanJsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const generatedDocs = JSON.parse(cleanJsonStr);

      // Save Research
      const research = await prisma.research.create({
        data: {
          projectId: newProject.id,
          title: `${projectTitle} - Market & Technical Research`,
          prompt: `Auto-generated from Roadmap #${roadmap.id}`,
          content: generatedDocs.researchContent || `# Technical Research for ${projectTitle}\n\nBased on roadmap planning.`,
          model: usedModel,
        },
      });

      // Save PRD
      const prd = await prisma.pRD.create({
        data: {
          projectId: newProject.id,
          researchId: research.id,
          title: `${projectTitle} - Product Requirements Document (PRD)`,
          prompt: `Auto-generated from Roadmap #${roadmap.id}`,
          content: generatedDocs.prdContent || `# PRD for ${projectTitle}\n\nBased on roadmap planning.`,
          model: usedModel,
        },
      });

      // Link PRD to Roadmap
      await prisma.roadmap.update({
        where: { id: roadmapId },
        data: { prdId: prd.id },
      });

      // Save Architecture
      await prisma.architecture.create({
        data: {
          projectId: newProject.id,
          roadmapId: roadmap.id,
          title: `${projectTitle} - System Architecture`,
          prompt: `Auto-generated from Roadmap #${roadmap.id}`,
          content: generatedDocs.architectureContent || `# System Architecture for ${projectTitle}\n\nBased on roadmap planning.`,
          model: usedModel,
        },
      });
    } catch (aiErr) {
      console.warn("[CONVERT_ROADMAP_AI_GENERATION_WARNING]", aiErr);
      // Fallback: create stub artifacts if AI call fails so conversion succeeds guaranteed
      const res = await prisma.research.create({
        data: {
          projectId: newProject.id,
          title: `${projectTitle} - Research`,
          prompt: "Imported from Roadmap",
          content: `# Technical Research\n\nGenerated from roadmap: ${roadmap.title}`,
        },
      });
      const prd = await prisma.pRD.create({
        data: {
          projectId: newProject.id,
          researchId: res.id,
          title: `${projectTitle} - PRD`,
          prompt: "Imported from Roadmap",
          content: `# Product Requirements Document\n\nGenerated from roadmap: ${roadmap.title}`,
        },
      });
      await prisma.architecture.create({
        data: {
          projectId: newProject.id,
          roadmapId: roadmap.id,
          title: `${projectTitle} - Architecture`,
          prompt: "Imported from Roadmap",
          content: `# System Architecture\n\nGenerated from roadmap: ${roadmap.title}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      projectId: newProject.id,
      message: "Successfully converted Roadmap to Project workspace with Research, PRD, Architecture, and Tasks!",
    });
  } catch (error) {
    console.error("[POST_CONVERT_ROADMAP]", error);
    return NextResponse.json(
      { error: "Failed to convert roadmap to project" },
      { status: 500 }
    );
  }
}

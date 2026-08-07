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

// POST /api/roadmaps/:id/explain - AI explain a topic or step in the roadmap
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roadmapId } = await params;
    const { stepTitle, stepDescription, milestoneTitle } = await req.json();

    if (!stepTitle) {
      return NextResponse.json({ error: "stepTitle is required" }, { status: 400 });
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        OR: [
          { user: { email: session.user.email } },
          { project: { user: { email: session.user.email } } },
          { project: { members: { some: { user: { email: session.user.email } } } } },
        ],
      },
      select: { title: true },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    const prompt = `You are a world-class senior engineer and technical mentor at BuilderOS.
The user is working on the roadmap "${roadmap.title}" and needs an in-depth, clear, actionable explanation of the following topic:

Topic/Step: "${stepTitle}"
${milestoneTitle ? `Milestone Context: "${milestoneTitle}"` : ""}
${stepDescription ? `Step Description: "${stepDescription}"` : ""}

Structure your explanation nicely with clear Markdown formatting:
1. **Overview & Concept**: What is this concept and why is it important in building modern software?
2. **Core Architecture / How it Works**: Clear step-by-step breakdown.
3. **Best Practices & Code / Pattern Example**: Real-world implementation details, code snippets, or architectural design pattern.
4. **Key Gotchas / Pitfalls to Avoid**: Common mistakes developers make when implementing this.
5. **Next Steps**: What to do next to master or implement this step.

Provide a comprehensive, high-quality response.`;

    const { response } = await generateContentWithRetry({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const explanation = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({
      success: true,
      topic: stepTitle,
      explanation,
    });
  } catch (error) {
    console.error("[POST_ROADMAP_EXPLAIN]", error);
    return NextResponse.json(
      { error: "Failed to generate topic explanation" },
      { status: 500 }
    );
  }
}

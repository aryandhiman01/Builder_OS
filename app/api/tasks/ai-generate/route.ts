import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ai, DEFAULT_MODEL } from "@/lib/ai";

// POST /api/tasks/ai-generate
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, projectTitle } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `You are a senior software project manager and developer assistant for BuilderOS.
Your task is to break down a development goal into specific, actionable tasks.

Project: ${projectTitle || "Software Project"}
User Goal: ${prompt}

Generate a list of 5-10 concrete development tasks. Return ONLY valid JSON in this exact format:
{
  "tasks": [
    {
      "title": "Task title (short and actionable)",
      "description": "Brief description of what needs to be done",
      "priority": "high" | "medium" | "low",
      "estimatedHours": 1-8,
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- Tasks should be ordered by dependency (foundational tasks first)
- Priorities: authentication/core infra = high, features = medium, polish = low
- estimatedHours should be realistic (0.5–8)
- Tags can include: frontend, backend, database, api, testing, design, devops
- Keep titles concise (under 50 chars)
- Do NOT include markdown or any text outside the JSON`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
    });

    const raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned invalid response" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      tasks: parsed.tasks || [],
    });
  } catch (error) {
    console.error("[AI_GENERATE_TASKS]", error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}

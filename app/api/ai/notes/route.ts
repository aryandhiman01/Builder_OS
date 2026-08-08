import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContentWithRetry } from "@/lib/ai/client";

// POST /api/ai/notes
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { notes, action, context } = body;

    if (!notes?.trim()) {
      return NextResponse.json({ error: "Notes content is required" }, { status: 400 });
    }

    let prompt = "";
    const contextInfo = context ? `\nContext / Roadmap: ${context}` : "";

    switch (action) {
      case "polish":
        prompt = `You are a professional technical editor for BuilderOS.
Refine, clean up, and polish the following user notes into clean, well-formatted GitHub Flavored Markdown.
- Fix grammar, typos, and awkward phrasing while preserving exact technical meaning.
- Use clear markdown headers (##, ###), bullet points, and code blocks where helpful.
- Do NOT alter core requirements or delete important details.
- Return ONLY the polished markdown text without any intro or conversational filler.${contextInfo}

User Notes:
${notes}`;
        break;

      case "summarize":
        prompt = `You are an executive product manager for BuilderOS.
Analyze the following notes and generate a concise Executive Summary & Key Action Items block in clean Markdown.
Structure as:
## 📌 Summary
[2-3 sentence high-level overview]

## 🎯 Key Action Items
- [ ] Task 1
- [ ] Task 2

## 🔑 Key Decisions
- Decision 1

Return ONLY the formatted markdown.${contextInfo}

User Notes:
${notes}`;
        break;

      case "expand":
        prompt = `You are a principal software architect and technical lead for BuilderOS.
Take the following rough notes/thoughts and expand them into detailed, structured technical planning notes.
- Flesh out bullet points with concrete technical implementation guidance.
- Add sections for ## Architecture Considerations, ## Tech Stack Choices, and ## Potential Risks/Tradeoffs.
- Use clean Markdown syntax, code snippets, and checklists where relevant.
- Return ONLY the expanded markdown notes.${contextInfo}

User Notes:
${notes}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action. Use polish, summarize, or expand." }, { status: 400 });
    }

    const { response } = await generateContentWithRetry({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const outputText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return NextResponse.json({
      success: true,
      result: outputText.trim(),
    });
  } catch (error) {
    console.error("AI Notes API error:", error);
    return NextResponse.json(
      { error: "Failed to process AI action on notes" },
      { status: 500 }
    );
  }
}

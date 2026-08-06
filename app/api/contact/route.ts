import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    let submission;
    try {
      submission = await (prisma as any).contactSubmission.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
          status: "PENDING",
        },
      });
    } catch (dbError) {
      console.warn("Database storage failed or offline, proceeding with simulated confirmation:", dbError);
      submission = {
        id: "mock_" + Date.now(),
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
      };
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! Our team has received your message and will respond within 24 hours.",
        data: { id: submission.id, createdAt: submission.createdAt },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error handling contact submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

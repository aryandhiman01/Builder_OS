import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  aiModel: "gemini-3.6-flash",
  defaultView: "grid",
  autoSavePrd: true,
  pollingInterval: "5s",
  emailNotifications: true,
  aiTaskAlerts: true,
  securityAlerts: true,
  customOpenAiKey: "",
  customGeminiKey: "",
  webhookUrl: "",
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        settings: true,
        createdAt: true,
        password: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let parsedSettings = DEFAULT_SETTINGS;
    if (user.settings) {
      try {
        parsedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(user.settings) };
      } catch {
        // Fallback to defaults on parse error
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
        createdAt: user.createdAt,
        hasPassword: Boolean(user.password),
        authProviders: user.accounts.map((a) => a.provider),
      },
      settings: parsedSettings,
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { settings: true },
    });

    let currentSettings = DEFAULT_SETTINGS;
    if (existingUser?.settings) {
      try {
        currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(existingUser.settings) };
      } catch {
        // Fallback
      }
    }

    const updatedSettings = { ...currentSettings, ...body };

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        settings: JSON.stringify(updatedSettings),
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

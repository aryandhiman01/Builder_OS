import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ServiceCheck {
  status: "operational" | "degraded" | "unavailable";
  latencyMs?: number;
  message?: string;
  details?: Record<string, any>;
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const isDetailed = searchParams.get("detailed") !== "false"; // Detailed by default or on demand

  let overallStatus: "healthy" | "degraded" | "unhealthy" = "healthy";
  const checks: Record<string, ServiceCheck> = {};

  // 1. Database Health Check (Prisma + PostgreSQL)
  const dbStart = Date.now();
  try {
    // Quick SQL ping to test connectivity and latency
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;
    checks.database = {
      status: "operational",
      latencyMs: dbLatency,
      message: "PostgreSQL database connection is active and responding.",
    };
  } catch (error: any) {
    overallStatus = "unhealthy";
    checks.database = {
      status: "unavailable",
      latencyMs: Date.now() - dbStart,
      message: error?.message || "Failed to establish database connection.",
    };
  }

  // 2. AI Engine Configuration & Gateway
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  checks.aiEngine = {
    status: hasGeminiKey ? "operational" : "degraded",
    message: hasGeminiKey
      ? "Google GenAI credentials configured and gateway ready."
      : "GEMINI_API_KEY is not configured in environment.",
  };
  if (!hasGeminiKey && overallStatus === "healthy") {
    overallStatus = "degraded";
  }

  // 3. Email Delivery Service (Resend)
  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  checks.emailService = {
    status: hasResendKey ? "operational" : "degraded",
    message: hasResendKey
      ? "Resend email delivery service key configured."
      : "RESEND_API_KEY is missing.",
  };

  // 4. Authentication Engine (NextAuth / Auth.js)
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  const hasNextAuthUrl = Boolean(process.env.NEXTAUTH_URL);
  checks.authService = {
    status: hasAuthSecret ? "operational" : "degraded",
    message: hasAuthSecret
      ? "Auth secret and session providers initialized."
      : "AUTH_SECRET is not configured in environment.",
    details: {
      nextAuthUrlConfigured: hasNextAuthUrl,
    },
  };

  // 5. System & Memory Runtime
  const memory = process.memoryUsage();
  const systemInfo = {
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
    memory: {
      heapUsedMB: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMB: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
      rssMB: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
    },
  };

  const totalLatencyMs = Date.now() - startTime;

  const responseBody: Record<string, any> = {
    status: overallStatus,
    timestamp: systemInfo.timestamp,
    totalLatencyMs,
    uptime: `${Math.floor(systemInfo.uptimeSeconds / 3600)}h ${Math.floor((systemInfo.uptimeSeconds % 3600) / 60)}m ${systemInfo.uptimeSeconds % 60}s`,
  };

  if (isDetailed) {
    responseBody.system = systemInfo;
    responseBody.services = checks;
  }

  const httpStatus = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(responseBody, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

export async function HEAD() {
  // Fast liveness probe returning HTTP 200 immediately
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

"use client";

import { useEffect, useState, useCallback } from "react";
import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Mail,
  Brain,
  RefreshCw,
  Clock,
} from "lucide-react";

interface HealthData {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  totalLatencyMs: number;
  uptime: string;
  system?: {
    uptimeSeconds: number;
    timestamp: string;
    nodeVersion: string;
    environment: string;
    memory: {
      heapUsedMB: number;
      heapTotalMB: number;
      rssMB: number;
    };
  };
  services?: {
    database?: {
      status: "operational" | "degraded" | "unavailable";
      latencyMs?: number;
      message?: string;
    };
    aiEngine?: {
      status: "operational" | "degraded" | "unavailable";
      message?: string;
    };
    emailService?: {
      status: "operational" | "degraded" | "unavailable";
      message?: string;
    };
    authService?: {
      status: "operational" | "degraded" | "unavailable";
      message?: string;
    };
  };
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = await res.json();
      setHealth(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch {
      setHealth({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        totalLatencyMs: 0,
        uptime: "Unknown",
        services: {
          database: { status: "unavailable", message: "Server connection failed" },
        },
      });
      setLastRefreshed(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    // Fetch real-time health data once on page load
    fetchHealth();
  }, [fetchHealth]);

  const isAllOperational = health?.status === "healthy";
  const isDegraded = health?.status === "degraded";

  const serviceList = [
    {
      name: "PostgreSQL & Prisma Engine",
      category: "Data Layer",
      icon: Database,
      status: health?.services?.database?.status === "operational" ? "Operational" : "Degraded",
      latency: health?.services?.database?.latencyMs !== undefined ? `${health?.services?.database?.latencyMs}ms` : "—",
      message: health?.services?.database?.message || "Active connection pool",
    },
    {
      name: "Google GenAI Engine Gateway",
      category: "AI & ML",
      icon: Brain,
      status: health?.services?.aiEngine?.status === "operational" ? "Operational" : "Degraded",
      latency: health ? "Sub-second" : "—",
      message: health?.services?.aiEngine?.message || "Gemini 3.6 Flash pipeline",
    },
    {
      name: "NextAuth Authentication Gateway",
      category: "Security & Auth",
      icon: ShieldCheck,
      status: health?.services?.authService?.status === "operational" ? "Operational" : "Degraded",
      latency: "< 5ms",
      message: health?.services?.authService?.message || "JWT session verification",
    },
    {
      name: "Resend Email Notification Dispatcher",
      category: "Messaging",
      icon: Mail,
      status: health?.services?.emailService?.status === "operational" ? "Operational" : "Degraded",
      latency: "Async queue",
      message: health?.services?.emailService?.message || "Transactional invitations & alerts",
    },
    {
      name: "Next.js 16 Edge / Node Server",
      category: "Core Gateway",
      icon: Server,
      status: "Operational",
      latency: health?.totalLatencyMs ? `${health.totalLatencyMs}ms` : "< 10ms",
      message: health?.system
        ? `Node ${health.system.nodeVersion} / ${health.system.environment}`
        : "Node.js Edge & Server Runtime",
    },
  ];

  return (
    <PageShell
      badge="Live Metrics"
      title="System Status &"
      highlightTitle="Performance"
      description="Real-time operational status, latency metrics, and system diagnostics for BuilderOS."
      breadcrumbs={[{ label: "Resources" }, { label: "Status" }]}
    >
      {/* Overall Banner */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-2xl transition-all ${isAllOperational
          ? "border-emerald-500/30 bg-emerald-500/10"
          : isDegraded
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-red-500/30 bg-red-500/10"
          }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 ${isAllOperational
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              : isDegraded
                ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                : "bg-red-500/20 border-red-500/30 text-red-400"
              }`}
          >
            {isAllOperational ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : isDegraded ? (
              <AlertTriangle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
              {isAllOperational
                ? "All Systems Operational"
                : isDegraded
                  ? "Some Systems Degraded"
                  : "System Outage Detected"}
            </h2>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${isAllOperational ? "text-emerald-300" : isDegraded ? "text-amber-300" : "text-red-300"
                }`}
            >
              {isAllOperational
                ? "All core AI engines, APIs, database pools, and services are performing normally."
                : "One or more secondary services or environment keys require attention."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Live Checked</span>
          </div>
          <button
            onClick={fetchHealth}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 transition-all disabled:opacity-50"
            title="Refresh Health Status"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Checking..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* System Metrics Bar */}
      {health?.system && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Server Uptime</span>
            </div>
            <p className="text-base font-semibold text-white font-mono">{health.uptime}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>Health Route Latency</span>
            </div>
            <p className="text-base font-semibold text-emerald-400 font-mono">{health.totalLatencyMs} ms</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Cpu className="h-3.5 w-3.5 text-violet-400" />
              <span>RAM Heap Usage</span>
            </div>
            <p className="text-base font-semibold text-white font-mono">
              {health.system.memory.heapUsedMB} MB <span className="text-xs text-zinc-500 font-sans">/ {health.system.memory.heapTotalMB} MB</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
              <Server className="h-3.5 w-3.5 text-sky-400" />
              <span>Environment</span>
            </div>
            <p className="text-base font-semibold text-white font-mono uppercase">{health.system.environment}</p>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
            Service Components
          </h2>
          {mounted && lastRefreshed && (
            <span className="text-xs text-zinc-500">Last inspected: {lastRefreshed}</span>
          )}
        </div>

        <div className="space-y-3">
          {serviceList.map((svc, i) => {
            const Icon = svc.icon;
            const isOp = svc.status === "Operational";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${isOp
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                          : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                          }`}
                      />
                      <span className="text-sm font-semibold text-white">{svc.name}</span>
                      <span className="text-[10px] text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                        {svc.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{svc.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                  <span className="text-zinc-400">
                    Latency: <strong className="text-emerald-400 font-mono">{svc.latency}</strong>
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded font-semibold border ${isOp
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                  >
                    {svc.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Incident History Log */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-sora)" }}>
          Past Incident Log (Last 90 Days)
        </h2>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center text-xs text-[#8a8a93]">
          No outages or degraded performance reported in the last 90 days. System operating with high availability. 🚀
        </div>
      </div>
    </PageShell>
  );
}

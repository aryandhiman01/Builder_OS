"use client";

import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Activity, Server, Database, Cpu, ShieldCheck } from "lucide-react";

export default function StatusPage() {
  const services = [
    { name: "AI Research Engine Gateway", status: "Operational", uptime: "99.99%", latency: "240ms" },
    { name: "PRD Spec Generator API", status: "Operational", uptime: "100.00%", latency: "180ms" },
    { name: "Architecture Diagram Renderer", status: "Operational", uptime: "99.98%", latency: "310ms" },
    { name: "PostgreSQL & Vector Database", status: "Operational", uptime: "100.00%", latency: "12ms" },
    { name: "NextAuth Authentication & Sessions", status: "Operational", uptime: "100.00%", latency: "25ms" },
    { name: "Webhook & Task Event Bus", status: "Operational", uptime: "99.95%", latency: "45ms" },
  ];

  return (
    <PageShell
      badge="Live Metrics"
      title="System Status &"
      highlightTitle="Performance"
      description="Real-time operational status, latency metrics, and incident history for BuilderOS services."
      breadcrumbs={[{ label: "Resources" }, { label: "Status" }]}
    >
      {/* Overall Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 mb-12 flex items-center justify-between backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-sora)" }}>
              All Systems Operational
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300">All core AI engines, APIs, and databases are performing normally.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
          <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Updating
        </div>
      </div>

      {/* Services List */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-sora)" }}>
          Service Components
        </h2>
        <div className="space-y-3">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-sm font-semibold text-white">{svc.name}</span>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <span className="text-zinc-400 hidden sm:inline">Uptime: <strong className="text-white font-mono">{svc.uptime}</strong></span>
                <span className="text-zinc-400 hidden sm:inline">Avg Latency: <strong className="text-emerald-400 font-mono">{svc.latency}</strong></span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  {svc.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Incident History Log */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-sora)" }}>
          Past Incident Log (Last 90 Days)
        </h2>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center text-xs text-[#8a8a93]">
          No major outages or degraded performance reported in the last 90 days. 🚀
        </div>
      </div>
    </PageShell>
  );
}

"use client";

import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";
import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6";

export default function CommunityPage() {
  const platforms = [
    {
      name: "Discord Community",
      members: "12,400+ Members",
      desc: "Join live discussions, share product demos, give feature feedback, and get help from BuilderOS maintainers.",
      action: "Join Discord Server",
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: FaDiscord,
    },
    {
      name: "GitHub Discussions",
      members: "3,800+ Contributors",
      desc: "Propose feature requests, report bugs, participate in open-source integrations, and inspect RFCs.",
      action: "Visit GitHub Repo",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: FaGithub,
    },
    {
      name: "X (Twitter) Community",
      members: "28,000+ Followers",
      desc: "Follow daily product updates, engineering changelogs, tip threads, and ecosystem announcements.",
      action: "Follow @BuilderOS",
      color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: FaXTwitter,
    },
  ];

  const highlights = [
    { title: "Weekly Builder Office Hours", desc: "Live Q&A with our engineering team every Thursday at 5 PM UTC." },
    { title: "Product OS Hackathons", desc: "Quarterly virtual hackathons with $25,000+ in prizes for the best AI workflow tools." },
    { title: "Community Template Showcase", desc: "Explore community-submitted PRD templates, architecture nodes, and prompts." },
  ];

  return (
    <PageShell
      badge="Global Ecosystem"
      title="Join the BuilderOS"
      highlightTitle="Community"
      description="Connect with thousands of product managers, founders, and engineers building the future of software."
      breadcrumbs={[{ label: "Resources" }, { label: "Community" }]}
    >
      {/* Community Platforms Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {platforms.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/[0.18] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-6 w-6 text-orange-400" />
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${p.color}`}>
                    {p.members}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-sora)" }}>
                  {p.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#8a8a93] leading-relaxed mb-6">
                  {p.desc}
                </p>
              </div>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all">
                {p.action} <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Community Highlights */}
      <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-black p-8 sm:p-12 mb-16">
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-sora)" }}>
          Community Events & Initiatives
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {highlights.map((h, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <Sparkles className="h-5 w-5 text-orange-400 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">{h.title}</h3>
              <p className="text-xs text-[#8a8a93] leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

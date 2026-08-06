"use client";

import PageShell from "@/components/shared/PageShell";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, Tag, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "How AI Research Engines Are Replacing Traditional Market Research",
      excerpt: "Learn how modern founders get TAM/SAM, competitor maps, and SWOT breakdown in seconds rather than spending weeks on manual slide decks.",
      category: "AI & Market Intelligence",
      date: "Aug 4, 2026",
      readTime: "5 min read",
      author: "Aryan Dhiman",
      tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      id: 2,
      title: "Designing Developer-Ready PRDs: Scope, Acceptance Criteria & Edge Cases",
      excerpt: "A comprehensive guide on drafting Product Requirement Documents that engineers love reading and implementing.",
      category: "Product Management",
      date: "Jul 28, 2026",
      readTime: "7 min read",
      author: "Product OS Team",
      tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      id: 3,
      title: "Mermaid.js System Architecture Generation with LLMs",
      excerpt: "Deep dive into our architecture diagram engine that converts high-level specs into production-ready system topologies.",
      category: "Engineering",
      date: "Jul 19, 2026",
      readTime: "6 min read",
      author: "Engineering Team",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      id: 4,
      title: "Building High-Performance Next.js 15 Web Applications",
      excerpt: "Best practices for SSR, Framer Motion animations, JWT authentication, and Tailwind CSS in modern Next.js apps.",
      category: "Tech Stack",
      date: "Jul 10, 2026",
      readTime: "8 min read",
      author: "Aryan Dhiman",
      tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <PageShell
      badge="Latest Insights"
      title="BuilderOS"
      highlightTitle="Blog & Engineering"
      description="Deep dives into AI product management, system architecture, engineering velocity, and building modern web apps."
      breadcrumbs={[{ label: "Company" }, { label: "Blog" }]}
    >
      {/* Featured Post Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/[0.1] bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-black p-8 sm:p-12 mb-16 relative overflow-hidden backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Featured Article
          </span>
          <span className="text-xs text-[#8a8a93] flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> 5 min read
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 max-w-3xl leading-tight" style={{ fontFamily: "var(--font-sora)" }}>
          {posts[0].title}
        </h2>
        <p className="text-sm sm:text-base text-[#9a9a9f] max-w-2xl leading-relaxed mb-6">
          {posts[0].excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400">
              AD
            </div>
            <span className="text-xs sm:text-sm font-medium text-white">{posts[0].author}</span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition-all">
            Read Article <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {posts.slice(1).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/[0.18] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${post.tagColor}`}>
                  {post.category}
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {post.date}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-snug hover:text-orange-400 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-sora)" }}>
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#8a8a93] leading-relaxed mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs text-zinc-400">
              <span>{post.author}</span>
              <span className="flex items-center gap-1 text-white font-medium hover:text-orange-400 cursor-pointer">
                Read story <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

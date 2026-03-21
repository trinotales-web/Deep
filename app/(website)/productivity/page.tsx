"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";

const frameworks = [
  {
    title: "The Kaizen Method",
    icon: "📈",
    description:
      "Kaizen (改善) means 'continuous improvement.' Rather than dramatic overhauls, kaizen focuses on making small, incremental changes that compound over time. Originally applied in Japanese manufacturing, kaizen has become a powerful framework for personal productivity and self-improvement.",
    keyPoints: [
      "Start with changes so small they feel almost meaningless",
      "Track your 1% improvements daily",
      "Consistency defeats intensity every time",
    ],
    link: "/philosophy/kaizen",
  },
  {
    title: "Ichigyo Zammai: Single-Pointed Focus",
    icon: "🎯",
    description:
      "Ichigyo zammai (一行三昧) is a Zen Buddhist concept meaning 'full concentration on a single act.' In an age of constant multitasking and distraction, this practice invites you to give your complete, undivided attention to one task at a time. The quality of your attention matters more than the quantity of your hours.",
    keyPoints: [
      "One task at a time, fully committed",
      "Close every tab except the one you need",
      "Quality of attention matters more than quantity of hours",
    ],
    link: "/philosophy/ichigyo-zammai",
  },
  {
    title: "Ma: Building Space Into Your Schedule",
    icon: "空",
    description:
      "Ma (間) is the Japanese concept of negative space — the meaningful emptiness between things. Applied to productivity, ma teaches us that the empty spaces in our schedules are not wasted time but essential breathing room. A packed calendar is not a sign of productivity; it's a sign of poor design.",
    keyPoints: [
      "Block empty time in your calendar deliberately",
      "Transitions between tasks need breathing room",
      "Busyness is not productivity",
    ],
    link: "/philosophy/ma",
  },
];

const tools = [
  {
    title: "AXUNE Focus Timer",
    description: "Pomodoro timer with Ensō circle visualization",
    icon: "⏱",
    action: "Open in App",
    href: "/download",
  },
  {
    title: "Daily Intention Template",
    description: "Set your daily focus with this simple template",
    icon: "📋",
    action: "Download PDF",
    href: "#",
  },
  {
    title: "Kaizen Tracking Sheet",
    description: "Track your 1% daily improvements over 30 days",
    icon: "📊",
    action: "Download PDF",
    href: "#",
  },
  {
    title: "Morning Routine Builder",
    description: "Design your ideal morning with guided prompts",
    icon: "🌅",
    action: "Open in App",
    href: "/download",
  },
];

const relatedArticles = [
  {
    slug: "kaizen-approach-productivity",
    title: "The Kaizen Approach to Productivity",
    category: "Productivity",
    readTime: "9 min",
    gradient: "linear-gradient(135deg, #DDD4D8, #CFC4C8)",
  },
  {
    slug: "ma-negative-space-in-schedule",
    title: "Ma: Negative Space in Your Schedule",
    category: "Productivity",
    readTime: "5 min",
    gradient: "linear-gradient(135deg, #E4E0DC, #D4D0CC)",
  },
  {
    slug: "pomodoro-meets-zen-focus",
    title: "The Pomodoro Technique Meets Zen Focus",
    category: "Productivity",
    readTime: "5 min",
    gradient: "linear-gradient(135deg, #DCD8DC, #CCC8CC)",
  },
];

export default function ProductivityPage() {
  return (
    <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[100px]">
      <div className="max-w-site mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-site-heading">
            Intentional Productivity
          </h1>
          <p className="font-body text-[17px] text-site-secondary mt-3">
            Japanese-inspired methods for focused, meaningful work
          </p>
        </motion.div>

        {/* Framework Cards */}
        <div className="space-y-8 mb-16">
          {frameworks.map((fw, i) => (
            <motion.div
              key={fw.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-xl p-8 md:p-10 shadow-site-card"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-site-bg-alt flex items-center justify-center">
                  <span className="text-[40px]">{fw.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-[24px] md:text-[28px] font-medium text-site-heading">
                    {fw.title}
                  </h2>
                  <p className="font-body text-[16px] text-site-secondary leading-[1.7] mt-3">
                    {fw.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {fw.keyPoints.map((point) => (
                      <li
                        key={point}
                        className="font-body text-[15px] text-site-body flex items-start gap-2"
                      >
                        <span className="text-site-amber mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={fw.link}
                    className="inline-block font-body text-[13px] font-semibold text-site-accent mt-5 hover:underline"
                  >
                    Read the full guide →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-6">
            TOOLS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group flex items-center gap-4 bg-site-bg-alt rounded-[10px] p-5 hover:bg-white hover:shadow-site-card transition-all"
              >
                <span className="text-[28px] flex-shrink-0">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-[16px] font-medium text-site-heading">
                    {tool.title}
                  </h4>
                  <p className="font-body text-[14px] text-site-secondary mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <span className="flex-shrink-0 text-site-muted group-hover:text-site-accent transition-colors">
                  {tool.action.includes("Download") ? (
                    <Download size={18} />
                  ) : (
                    <ExternalLink size={18} />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Related Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h3 className="font-heading text-[28px] font-medium text-site-heading mb-8">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/blog/${article.slug}`}
                  className="group block hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="aspect-[16/10] rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: article.gradient }}
                  >
                    <span className="text-site-muted text-sm font-body">
                      Article Image
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mt-4">
                    {article.category.toUpperCase()}
                  </p>
                  <h3 className="font-heading text-[18px] md:text-[20px] font-medium text-site-heading mt-1.5 group-hover:text-site-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-body text-[13px] text-site-muted mt-3">
                    Hiroto Takana · {article.readTime} read
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

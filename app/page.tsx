"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  CheckCircle,
  BookOpen,
  Moon,
  Smartphone,
  BarChart2,
  Leaf,
  ArrowRight,
  Droplets,
  BedDouble,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    color: "#7c9a6e",
    title: "Habit Tracking",
    description:
      "Build small, gentle habits with a simple daily checklist. Watch streaks grow.",
  },
  {
    icon: Heart,
    color: "#9e6b5e",
    title: "Wellness Hub",
    description:
      "Track sleep, water, energy, mood, and body check-ins in one peaceful space.",
  },
  {
    icon: BookOpen,
    color: "#d4a954",
    title: "Mindful Journaling",
    description:
      "Daily prompts, gratitude logs, and monthly goals to nurture self-reflection.",
  },
  {
    icon: Moon,
    color: "#8b7bb5",
    title: "The Void",
    description:
      "Guided breathing, timed silence, and free meditation with ambient particles.",
  },
  {
    icon: Smartphone,
    color: "#6b9bc3",
    title: "Screen Time Control",
    description:
      "Manage social media usage with gentle math-gate friction to build awareness.",
  },
  {
    icon: BarChart2,
    color: "#7c9a6e",
    title: "Analytics",
    description:
      "Beautiful charts and auto-generated insights to understand your patterns.",
  },
];

const container = {
  animate: { transition: { staggerChildren: 0.1 } },
};
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-[#ede9e2] flex items-center justify-center shadow-sm">
            <Leaf size={16} className="text-[#7c9a6e]" />
          </div>
          <span className="font-serif text-xl text-[#3d3a35]">AXUNE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-[#5a5549] hover:text-[#3d3a35] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="bg-[#3d3a35] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#2d2a25] transition-colors"
          >
            Begin
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        variants={container}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center text-center px-6 pt-16 pb-24 max-w-2xl mx-auto"
      >
        <motion.div
          variants={item}
          className="w-20 h-20 rounded-full bg-white border border-[#ede9e2] flex items-center justify-center shadow-card mb-8"
        >
          <Leaf size={32} className="text-[#7c9a6e]" />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-serif text-5xl md:text-6xl text-[#3d3a35] leading-tight mb-6"
        >
          Your sanctuary for
          <br />
          <em>mindful living</em>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg text-[#5a5549] leading-relaxed mb-10 max-w-lg"
        >
          Inspired by Japanese philosophy — wabi-sabi, kaizen, zen simplicity —
          AXUNE helps you build small, gentle habits that compound into a deeply
          meaningful life.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/register"
            className="flex items-center justify-center gap-2 bg-[#3d3a35] text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-[#2d2a25] transition-all active:scale-[0.98]"
          >
            Begin your practice
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-center gap-2 bg-white text-[#3d3a35] px-7 py-3.5 rounded-xl text-sm font-medium border border-[#ede9e2] hover:bg-[#faf8f5] transition-all"
          >
            Learn more
          </Link>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl text-[#3d3a35] mb-3">
            Everything you need to return to yourself
          </h2>
          <p className="text-[#8a8578] text-sm">
            Crafted for those who want to live with more intention
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl border border-[#ede9e2] p-6 shadow-card"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon size={20} style={{ color: feature.color }} />
                </div>
                <h3 className="font-serif text-lg text-[#3d3a35] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8a8578] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Philosophy section */}
      <section className="bg-[#3d3a35] px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-serif italic text-2xl text-white/70 mb-8 leading-relaxed">
              &ldquo;AXUNE is not about productivity. It is not about
              optimization. It is about slowing down enough to notice the beauty
              in your ordinary days.&rdquo;
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              {[
                "Simplicity over complexity",
                "Gentleness over intensity",
                "Consistency over perfection",
                "Presence over productivity",
              ].map((p) => (
                <span
                  key={p}
                  className="bg-white/8 text-white/50 px-4 py-2 rounded-full border border-white/8"
                >
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { icon: CheckCircle, value: "6", label: "Core features", color: "#7c9a6e" },
            { icon: Droplets, value: "∞", label: "Days of practice", color: "#6b9bc3" },
            { icon: BedDouble, value: "1", label: "Calm space, yours", color: "#8b7bb5" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-2"
              >
                <Icon size={24} style={{ color: stat.color }} />
                <p className="font-serif text-3xl text-[#3d3a35]">{stat.value}</p>
                <p className="text-xs text-[#8a8578]">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl text-[#3d3a35] mb-4">
            Begin your practice today
          </h2>
          <p className="text-[#8a8578] text-sm mb-8">
            Free to use. No subscriptions. Just you and your practice.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-[#3d3a35] text-white px-8 py-4 rounded-xl text-sm font-medium hover:bg-[#2d2a25] transition-all active:scale-[0.98]"
          >
            Create your sanctuary
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ede9e2] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-[#7c9a6e]" />
            <span className="font-serif text-[#3d3a35]">AXUNE</span>
          </div>
          <div className="flex gap-6 text-sm text-[#8a8578]">
            <Link href="/about" className="hover:text-[#3d3a35] transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-[#3d3a35] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#3d3a35] transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-[#3d3a35] transition-colors">Disclaimer</Link>
          </div>
          <p className="text-xs text-[#c5bfb4]">
            Made with intention, 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

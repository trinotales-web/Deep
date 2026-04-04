"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Newsletter from "@/components/website/Newsletter";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const philosophyPreviews = [
  {
    slug: "ikigai",
    icon: "🌸",
    title: "Ikigai",
    subtitle: "A reason for being",
    preview:
      "Discover the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.",
    accentColor: "#2D5A3D",
  },
  {
    slug: "wabi-sabi",
    icon: "🍂",
    title: "Wabi-Sabi",
    subtitle: "Beauty in imperfection",
    preview:
      "Learn to see the beauty in transience and imperfection. A worldview centered on acceptance of the incomplete.",
    accentColor: "#C4956B",
  },
  {
    slug: "kaizen",
    icon: "📈",
    title: "Kaizen",
    subtitle: "Continuous improvement",
    preview:
      "The practice of continuous improvement through small, daily changes that compound into extraordinary transformation.",
    accentColor: "#2D5A3D",
  },
  {
    slug: "kintsugi",
    icon: "✨",
    title: "Kintsugi",
    subtitle: "Golden repair",
    preview:
      "The Japanese art of repairing broken pottery with gold. A philosophy that treats breakage as part of the story.",
    accentColor: "#C4956B",
  },
  {
    slug: "shinrin-yoku",
    icon: "🌲",
    title: "Shinrin-yoku",
    subtitle: "Forest bathing",
    preview:
      "The practice of immersing yourself in nature to restore calm, reduce stress, and reconnect with the natural world.",
    accentColor: "#7AAE8B",
  },
];

const productivityCards = [
  {
    icon: "🎯",
    title: "Deep Focus",
    description:
      "The Japanese art of ichigyo zammai — giving yourself fully to one task. Methods, tools, and practices for undistracted work.",
    link: "/productivity",
  },
  {
    icon: "🧘",
    title: "Mindful Routines",
    description:
      "Build morning and evening rituals inspired by Zen monks. Simple habits that compound into extraordinary transformation.",
    link: "/productivity",
  },
  {
    icon: "📖",
    title: "Kaizen Methods",
    description:
      "Continuous improvement frameworks for work, health, and personal growth. Small daily changes that reshape your life.",
    link: "/productivity",
  },
];

const featuredArticles = [
  {
    slug: "ikigai-japanese-secret-life-worth-living",
    category: "PHILOSOPHY",
    title: "Ikigai: The Japanese Secret to a Life Worth Living",
    excerpt:
      "In a culture obsessed with productivity and optimization, the ancient Japanese concept of ikigai offers a radically different approach to finding meaning and purpose in everyday life.",
    author: "Hiroto Takana",
    date: "March 15, 2026",
    readTime: "8 min",
    gradient: "linear-gradient(135deg, #E8E4DC, #D8D0C4)",
  },
  {
    slug: "wabi-sabi-changed-way-i-see-flaws",
    category: "PHILOSOPHY",
    title: "How Wabi-Sabi Changed the Way I See My Flaws",
    excerpt:
      "Embracing imperfection as a path to peace and self-acceptance.",
    author: "Hiroto Takana",
    date: "March 12, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #D8D0C4, #C8BFB0)",
  },
  {
    slug: "7-morning-habits-zen-monks",
    category: "HABITS",
    title: "7 Morning Habits Inspired by Zen Monks",
    excerpt:
      "Simple rituals to start your day with clarity and intention.",
    author: "Hiroto Takana",
    date: "March 10, 2026",
    readTime: "7 min",
    gradient: "linear-gradient(135deg, #D4DDD8, #C4CFC8)",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-site-dark overflow-hidden">
        {/* Decorative kanji */}
        <div
          className="absolute right-[10%] top-1/2 -translate-y-1/2 font-jp text-[200px] leading-none select-none pointer-events-none"
          style={{ opacity: 0.04, color: "#F0EDE6" }}
        >
          道
        </div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative z-10 text-center px-6 max-w-[700px]"
        >
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-[11px] font-semibold tracking-[3px] uppercase text-site-amber mb-5"
          >
            JAPANESE WISDOM FOR MODERN LIFE
          </motion.p>

          <motion.h1
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-[36px] md:text-[56px] font-bold text-site-inverse leading-[1.15]"
          >
            Live deliberately.
            <br />
            Think deeply.
            <br />
            Act simply.
          </motion.h1>

          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-[16px] md:text-[18px] text-white/50 leading-[1.7] mt-5 max-w-[560px] mx-auto"
          >
            AXUNE explores the ancient Japanese philosophies, rituals, and habits
            that help you build a life of clarity, purpose, and peace.
          </motion.p>

          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-9"
          >
            <Link
              href="/blog"
              className="bg-site-accent hover:bg-site-accent-hover text-white px-8 py-3.5 rounded-lg font-body text-[15px] font-semibold transition-all hover:-translate-y-0.5"
            >
              Start Reading
            </Link>
            <Link
              href="/philosophy"
              className="border border-white/20 hover:border-white/40 text-site-inverse px-8 py-3.5 rounded-lg font-body text-[15px] font-semibold transition-all"
            >
              Explore Philosophies
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowDown
            size={20}
            className="text-white/40 animate-bounce-arrow"
          />
        </motion.div>
      </section>

      {/* Featured Articles Section */}
      <section className="bg-site-bg py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-3">
              FEATURED
            </p>
            <h2 className="font-heading text-[28px] md:text-[40px] font-bold text-site-heading">
              Latest from AXUNE
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Large featured article */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <Link href={`/blog/${featuredArticles[0].slug}`} className="group block">
                <div
                  className="aspect-[16/10] rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ background: featuredArticles[0].gradient }}
                >
                  <span className="text-site-muted text-sm font-body">
                    Featured Image
                  </span>
                </div>
                <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mt-5">
                  {featuredArticles[0].category}
                </p>
                <h3 className="font-heading text-[22px] md:text-[28px] font-medium text-site-heading mt-2 group-hover:text-site-accent transition-colors">
                  {featuredArticles[0].title}
                </h3>
                <p className="font-body text-[15px] md:text-[16px] text-site-secondary leading-[1.7] mt-2.5 line-clamp-3">
                  {featuredArticles[0].excerpt}
                </p>
                <p className="font-body text-[13px] text-site-muted mt-3.5">
                  By {featuredArticles[0].author} · {featuredArticles[0].date} ·{" "}
                  {featuredArticles[0].readTime} read
                </p>
              </Link>
            </motion.div>

            {/* Two smaller articles */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {featuredArticles.slice(1).map((article, i) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (i + 1) * 0.08 }}
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group flex gap-4"
                  >
                    <div
                      className="w-[120px] h-[120px] rounded-[10px] flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: article.gradient }}
                    >
                      <span className="text-site-muted text-[10px] font-body">
                        Image
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber">
                        {article.category}
                      </p>
                      <h3 className="font-heading text-[18px] md:text-[20px] font-medium text-site-heading mt-1 group-hover:text-site-accent transition-colors">
                        {article.title}
                      </h3>
                      <p className="font-body text-[13px] text-site-muted mt-2">
                        {article.author} · {article.date} · {article.readTime} read
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Preview Section */}
      <section className="bg-site-bg-alt py-[60px] md:py-[100px] relative overflow-hidden">
        <div
          className="absolute right-[5%] top-[20%] font-jp text-[160px] leading-none select-none pointer-events-none"
          style={{ opacity: 0.03, color: "#1A1814" }}
        >
          禅
        </div>

        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-3">
              JAPANESE WISDOM
            </p>
            <h2 className="font-heading text-[28px] md:text-[40px] font-bold text-site-heading">
              Timeless philosophies for everyday life
            </h2>
            <p className="font-body text-[17px] text-site-secondary mt-3">
              60 Japanese concepts explored in depth — one for every day
            </p>
          </motion.div>

          {/* Horizontal scroll row */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
            {philosophyPreviews.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/philosophy/${p.slug}`}
                  className="group block w-[280px] flex-shrink-0 bg-white rounded-xl p-6 shadow-site-card snap-start hover:-translate-y-1 hover:shadow-site-card-hover transition-all duration-300"
                >
                  <div
                    className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[36px]"
                    style={{ backgroundColor: `${p.accentColor}14` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-heading text-[20px] font-medium text-site-heading mt-3.5">
                    {p.title}
                  </h3>
                  <p
                    className="font-body text-[14px] italic mt-1"
                    style={{ color: p.accentColor }}
                  >
                    {p.subtitle}
                  </p>
                  <p className="font-body text-[14px] text-site-secondary leading-[1.6] mt-2.5 line-clamp-3">
                    {p.preview}
                  </p>
                  <span className="inline-block font-body text-[13px] font-semibold text-site-accent mt-3.5 group-hover:underline">
                    Read more →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/philosophy"
              className="font-body text-[14px] font-semibold text-site-accent hover:underline"
            >
              View all 60 philosophies →
            </Link>
          </div>
        </div>
      </section>

      {/* Productivity Preview Section */}
      <section className="bg-site-bg py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-semibold tracking-[2px] uppercase text-site-amber mb-3">
              INTENTIONAL PRODUCTIVITY
            </p>
            <h2 className="font-heading text-[28px] md:text-[40px] font-bold text-site-heading">
              Work less. Focus more. Create meaning.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productivityCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={card.link}
                  className="group block bg-white rounded-xl p-8 shadow-site-card text-center hover:-translate-y-1 hover:shadow-site-card-hover transition-all duration-300"
                >
                  <span className="text-[40px] block mb-4">{card.icon}</span>
                  <h3 className="font-heading text-[22px] font-medium text-site-heading mb-2">
                    {card.title}
                  </h3>
                  <p className="font-body text-[15px] text-site-secondary leading-[1.6]">
                    {card.description}
                  </p>
                  <span className="inline-block font-body text-[13px] font-semibold text-site-accent mt-4 group-hover:underline">
                    Explore →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Promotion Section */}
      <section className="bg-site-dark py-[60px] md:py-[100px]">
        <div className="max-w-site mx-auto px-5">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-[500px]"
            >
              <p className="text-[11px] font-semibold tracking-[3px] uppercase text-site-amber">
                THE AXUNE APP
              </p>
              <h2 className="font-heading text-[28px] md:text-[36px] font-bold text-site-inverse mt-4">
                Your daily sanctuary in your pocket
              </h2>
              <p className="font-body text-[16px] text-white/50 leading-[1.7] mt-4">
                Track habits inspired by Japanese wisdom. Meditate in the Void
                Space. Learn a new philosophy every day. Build routines that
                bring peace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  href="/download"
                  className="bg-site-accent hover:bg-site-accent-hover text-white px-8 py-3.5 rounded-lg font-body text-[15px] font-semibold transition-all text-center"
                >
                  Get the App
                </Link>
              </div>
              <p className="font-body text-[13px] text-white/30 mt-4">
                Available on iOS and Android
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-shrink-0"
            >
              {/* Phone mockup */}
              <div className="w-[280px] h-[560px] rounded-[32px] bg-[#2A2824] border-2 border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-heading text-[24px] font-bold text-site-inverse">
                    AXUNE
                  </p>
                  <p className="font-body text-[13px] text-white/30 mt-2">
                    App Preview
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-site-bg-alt py-[60px] md:py-[80px]">
        <Newsletter />
      </section>
    </>
  );
}

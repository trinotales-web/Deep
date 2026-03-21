"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  "All",
  "Philosophy",
  "Productivity",
  "Habits",
  "Minimalism",
  "Mindfulness",
  "Culture",
];

const articles = [
  {
    slug: "ikigai-japanese-secret-life-worth-living",
    title: "Ikigai: The Japanese Secret to a Life Worth Living",
    category: "Philosophy",
    excerpt:
      "In a culture obsessed with productivity, ikigai offers a radically different approach to finding meaning and purpose in everyday life.",
    author: "Hiroto Takana",
    date: "Mar 15, 2026",
    readTime: "8 min",
    gradient: "linear-gradient(135deg, #E8E4DC, #D8D0C4)",
  },
  {
    slug: "wabi-sabi-changed-way-i-see-flaws",
    title: "How Wabi-Sabi Changed the Way I See My Flaws",
    category: "Philosophy",
    excerpt:
      "Embracing imperfection as a path to peace, self-acceptance, and a richer experience of life.",
    author: "Hiroto Takana",
    date: "Mar 12, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #D8D0C4, #C8BFB0)",
  },
  {
    slug: "7-morning-habits-zen-monks",
    title: "7 Morning Habits Inspired by Zen Monks",
    category: "Habits",
    excerpt:
      "Simple rituals to start your day with clarity, intention, and a sense of calm purpose.",
    author: "Hiroto Takana",
    date: "Mar 10, 2026",
    readTime: "7 min",
    gradient: "linear-gradient(135deg, #D4DDD8, #C4CFC8)",
  },
  {
    slug: "kaizen-approach-productivity",
    title: "The Kaizen Approach to Productivity: 1% Better Every Day",
    category: "Productivity",
    excerpt:
      "How the Japanese philosophy of continuous improvement can transform your work and personal life.",
    author: "Hiroto Takana",
    date: "Mar 8, 2026",
    readTime: "9 min",
    gradient: "linear-gradient(135deg, #DDD4D8, #CFC4C8)",
  },
  {
    slug: "japanese-minimalism-more-than-decluttering",
    title: "Why Japanese Minimalism Is More Than Decluttering",
    category: "Minimalism",
    excerpt:
      "Beyond tidying up: the philosophical roots of Japanese minimalism and how it reshapes your relationship with things.",
    author: "Hiroto Takana",
    date: "Mar 5, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #E0DDD4, #D0CFC4)",
  },
  {
    slug: "shinrin-yoku-science-behind-forest-bathing",
    title: "Shinrin-yoku: The Science Behind Forest Bathing",
    category: "Mindfulness",
    excerpt:
      "The evidence-based Japanese practice of forest bathing and why it works for stress, immunity, and mental clarity.",
    author: "Hiroto Takana",
    date: "Mar 3, 2026",
    readTime: "8 min",
    gradient: "linear-gradient(135deg, #D4DDD4, #C4CFC4)",
  },
  {
    slug: "morning-routine-that-actually-sticks",
    title: "How to Build a Morning Routine That Actually Sticks",
    category: "Habits",
    excerpt:
      "A practical, forgiving approach to morning routines inspired by Japanese daily practices.",
    author: "Hiroto Takana",
    date: "Feb 28, 2026",
    readTime: "7 min",
    gradient: "linear-gradient(135deg, #DDD8D4, #CFC8C4)",
  },
  {
    slug: "ma-negative-space-in-schedule",
    title: "Ma: The Japanese Art of Negative Space in Your Schedule",
    category: "Productivity",
    excerpt:
      "Why the empty spaces in your calendar are just as important as the filled ones.",
    author: "Hiroto Takana",
    date: "Feb 25, 2026",
    readTime: "5 min",
    gradient: "linear-gradient(135deg, #E4E0DC, #D4D0CC)",
  },
  {
    slug: "kintsugi-beauty-of-being-broken",
    title: "Kintsugi and the Beauty of Being Broken",
    category: "Philosophy",
    excerpt:
      "The Japanese art of golden repair teaches us that our cracks are what make us beautiful.",
    author: "Hiroto Takana",
    date: "Feb 22, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #DCD4D8, #CCC4C8)",
  },
  {
    slug: "digital-minimalism-japanese-approach",
    title: "Digital Minimalism: A Japanese Approach to Screen Time",
    category: "Minimalism",
    excerpt:
      "Applying Japanese principles of intentionality and simplicity to our digital lives.",
    author: "Hiroto Takana",
    date: "Feb 18, 2026",
    readTime: "7 min",
    gradient: "linear-gradient(135deg, #D8DCD4, #C8CCC4)",
  },
  {
    slug: "pomodoro-meets-zen-focus",
    title: "The Pomodoro Technique Meets Zen Focus",
    category: "Productivity",
    excerpt:
      "Combining Western time management with Eastern mindfulness for deeper, more meaningful work.",
    author: "Hiroto Takana",
    date: "Feb 15, 2026",
    readTime: "5 min",
    gradient: "linear-gradient(135deg, #DCD8DC, #CCC8CC)",
  },
  {
    slug: "ichigo-ichie-treasure-every-moment",
    title: "Ichigo Ichie: How to Treasure Every Single Moment",
    category: "Philosophy",
    excerpt:
      "The Japanese philosophy of cherishing each unrepeatable encounter and living fully in the present.",
    author: "Hiroto Takana",
    date: "Feb 12, 2026",
    readTime: "6 min",
    gradient: "linear-gradient(135deg, #E0D8DC, #D0C8CC)",
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[100px]">
      <div className="max-w-site mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-[36px] md:text-[48px] font-bold text-site-heading">
            Blog
          </h1>
          <p className="font-body text-[17px] text-site-secondary mt-3">
            Essays on Japanese philosophy, mindful habits, and intentional
            living
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2.5 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-site-dark text-white"
                  : "bg-transparent border-[1.5px] border-site-border text-site-secondary hover:border-site-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article, i) => (
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
                  className="aspect-[16/10] rounded-xl overflow-hidden flex items-center justify-center group-hover:shadow-site-card-hover transition-shadow"
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
                <p className="font-body text-[15px] text-site-secondary mt-2 line-clamp-2 leading-[1.6]">
                  {article.excerpt}
                </p>
                <p className="font-body text-[13px] text-site-muted mt-3">
                  {article.author} · {article.date} · {article.readTime} read
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="w-full max-w-md bg-site-bg-alt border-[1.5px] border-site-border text-site-body rounded-lg py-3.5 font-body text-[14px] font-semibold hover:bg-white transition-colors">
            Load more articles
          </button>
        </div>
      </div>
    </div>
  );
}

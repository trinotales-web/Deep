"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Article {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  heroGradient?: string;
}

interface ArticleCardProps {
  article: Article;
  variant?: "large" | "small" | "default";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const { slug, title, category, excerpt, author, date, readTime, heroGradient } =
    article;

  const gradient =
    heroGradient || "linear-gradient(135deg, #2D5A3D 0%, #1C1A17 100%)";

  if (variant === "small") {
    return (
      <Link href={`/blog/${slug}`} className="block group">
        <motion.div
          className="flex items-start gap-4"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Thumbnail */}
          <div
            className="w-[120px] h-[120px] rounded-lg shrink-0"
            style={{ background: gradient }}
          />

          {/* Text content */}
          <div className="flex-1 min-w-0 pt-1">
            <span className="text-[11px] font-body font-semibold tracking-wider uppercase text-site-amber">
              {category}
            </span>
            <h3 className="mt-1.5 font-heading text-[18px] font-medium text-site-heading leading-snug group-hover:text-site-accent transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="mt-2 text-[13px] font-body text-site-muted">
              By {author} &middot; {date} &middot; {readTime} read
            </p>
          </div>
        </motion.div>
      </Link>
    );
  }

  const isLarge = variant === "large";

  return (
    <Link href={`/blog/${slug}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-full"
      >
        {/* Image / gradient placeholder */}
        <div
          className="w-full rounded-xl overflow-hidden"
          style={{
            aspectRatio: "16 / 10",
            background: gradient,
          }}
        />

        {/* Content */}
        <div className="mt-5">
          <span className="text-[11px] font-body font-semibold tracking-wider uppercase text-site-amber">
            {category}
          </span>

          <h3
            className={`mt-2 font-heading font-medium text-site-heading leading-snug group-hover:text-site-accent transition-colors ${
              isLarge ? "text-[24px] tablet:text-[28px]" : "text-[20px]"
            }`}
          >
            {title}
          </h3>

          <p
            className={`mt-2.5 font-body text-site-secondary leading-relaxed ${
              isLarge
                ? "text-[15px]"
                : "text-[14px] line-clamp-2"
            }`}
          >
            {excerpt}
          </p>

          <p className="mt-3 text-[13px] font-body text-site-muted">
            By {author} &middot; {date} &middot; {readTime} read
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

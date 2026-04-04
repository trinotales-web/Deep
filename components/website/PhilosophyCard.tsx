"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Philosophy {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  category: string;
  description: string;
}

interface PhilosophyCardProps {
  philosophy: Philosophy;
}

export default function PhilosophyCard({ philosophy }: PhilosophyCardProps) {
  const { slug, title, subtitle, icon, accentColor, description } = philosophy;

  return (
    <Link href={`/philosophy/${slug}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-xl p-6 shadow-site-card hover:shadow-site-card-hover transition-shadow h-full flex flex-col"
      >
        {/* Icon */}
        <div
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[36px] leading-none"
          style={{ backgroundColor: `${accentColor}14` }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="mt-4 font-heading text-[20px] font-medium text-site-heading">
          {title}
        </h3>

        {/* Subtitle */}
        <p
          className="mt-1 font-body text-[14px] italic"
          style={{ color: accentColor }}
        >
          {subtitle}
        </p>

        {/* Description */}
        <p className="mt-3 font-body text-[14px] text-site-secondary leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Read more */}
        <p className="mt-4 font-body text-[13px] font-semibold text-site-accent group-hover:underline">
          Read more &rarr;
        </p>
      </motion.div>
    </Link>
  );
}

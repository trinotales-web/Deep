"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hoverable,
  compact,
  onClick,
}: CardProps) {
  const base = cn(
    "bg-white rounded-xl border border-[#ede9e2]",
    compact ? "p-4" : "p-[22px]",
    "shadow-[0_1px_8px_rgba(0,0,0,0.04)]",
    onClick && "cursor-pointer",
    className
  );

  if (hoverable || onClick) {
    return (
      <motion.div
        className={base}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}

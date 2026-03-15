"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading,
  fullWidth,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#3d3a35] text-white hover:bg-[#2d2a25] active:scale-[0.98]",
    secondary:
      "bg-[#f6f3ee] text-[#3d3a35] border border-[#ede9e2] hover:bg-[#ede9e2] active:scale-[0.98]",
    ghost:
      "text-[#5a5549] hover:bg-[#f6f3ee] active:scale-[0.98] bg-transparent",
    danger: "bg-[#9e6b5e] text-white hover:bg-[#8a5a4e] active:scale-[0.98]",
    outline:
      "bg-transparent border-2 border-[#7c9a6e] text-[#7c9a6e] hover:bg-[#7c9a6e] hover:text-white active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-2 text-13 h-8",
    md: "px-5 py-3 text-sm h-11",
    lg: "px-6 py-4 text-base h-14",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}

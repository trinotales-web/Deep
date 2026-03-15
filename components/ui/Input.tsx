"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#3d3a35]">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl",
            "text-[15px] text-[#3d3a35] placeholder:text-[#c5bfb4]",
            "transition-colors duration-200 outline-none",
            "focus:border-[#7c9a6e] focus:bg-white",
            error && "border-[#9e6b5e] focus:border-[#9e6b5e]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-[#8a8578]">{hint}</span>
        )}
        {error && <span className="text-xs text-[#9e6b5e]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#3d3a35]">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#faf8f5] border border-[#ede9e2] rounded-xl",
            "text-[15px] text-[#3d3a35] placeholder:text-[#c5bfb4]",
            "transition-colors duration-200 outline-none resize-vertical",
            "focus:border-[#7c9a6e] focus:bg-white",
            "min-h-[120px] leading-relaxed",
            error && "border-[#9e6b5e] focus:border-[#9e6b5e]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-[#8a8578]">{hint}</span>
        )}
        {error && <span className="text-xs text-[#9e6b5e]">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

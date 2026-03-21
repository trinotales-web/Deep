"use client";

import { useState } from "react";

interface NewsletterProps {
  variant?: "default" | "compact" | "dark";
}

export default function Newsletter({ variant = "default" }: NewsletterProps) {
  const [email, setEmail] = useState("");

  const isCompact = variant === "compact";
  const isDark = variant === "dark";

  const headingColor = isDark ? "text-site-inverse" : "text-site-heading";
  const subtitleColor = isDark ? "text-site-inverse/60" : "text-site-secondary";
  const metaColor = isDark ? "text-site-inverse/40" : "text-site-muted";
  const inputBg = isDark ? "bg-white/10" : "bg-white";
  const inputBorder = isDark ? "border-white/20" : "border-site-border";
  const inputText = isDark ? "text-white placeholder:text-white/40" : "text-site-body placeholder:text-site-muted";

  return (
    <div className={`text-center ${isCompact ? "py-8" : "py-12"}`}>
      <h3
        className={`font-heading font-medium ${headingColor} ${
          isCompact ? "text-[24px]" : "text-[28px] tablet:text-[32px]"
        }`}
      >
        Receive one Japanese wisdom each week
      </h3>

      <p
        className={`mt-3 font-body ${subtitleColor} ${
          isCompact ? "text-[14px]" : "text-[15px]"
        }`}
      >
        Curated reflections on mindfulness, aesthetics, and intentional living.
      </p>

      <div
        className={`mx-auto flex flex-col tablet:flex-row ${
          isCompact ? "max-w-[400px] mt-5" : "max-w-[480px] mt-8"
        }`}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`flex-1 h-[50px] px-5 font-body text-[14px] rounded-full tablet:rounded-r-none tablet:rounded-l-lg border ${inputBorder} ${inputBg} ${inputText} outline-none focus:border-site-accent transition-colors`}
        />
        <button
          type="button"
          className="h-[50px] px-7 bg-site-accent hover:bg-site-accent-hover text-white font-body text-[14px] font-semibold rounded-full tablet:rounded-l-none tablet:rounded-r-lg transition-colors mt-3 tablet:mt-0 shrink-0"
        >
          Subscribe
        </button>
      </div>

      <p className={`mt-4 font-body text-[13px] ${metaColor}`}>
        Join 2,000+ intentional readers
      </p>
    </div>
  );
}

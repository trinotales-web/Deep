"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search articles...",
}: SearchBarProps) {
  return (
    <div className="relative max-w-[480px] mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-site-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-5 rounded-full border border-site-border bg-white font-body text-[14px] text-site-body placeholder:text-site-muted outline-none focus:border-site-accent transition-colors"
      />
    </div>
  );
}

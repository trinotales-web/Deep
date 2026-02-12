"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Layers,
  BarChart3,
  BookOpen,
  Rocket,
} from "lucide-react";

const navItems = [
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/journey", icon: Rocket, label: "Journey" },
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/stories", icon: BookOpen, label: "Stories" },
  { href: "/pricing", icon: Layers, label: "Plans" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

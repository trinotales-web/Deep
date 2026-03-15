"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  CheckCircle,
  Heart,
  BookOpen,
  Moon,
  Smartphone,
  BarChart2,
  User,
  LogOut,
  Leaf,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/habits", label: "Habits", icon: CheckCircle },
  { href: "/dashboard/wellness", label: "Wellness", icon: Heart },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/void", label: "Void", icon: Moon },
  { href: "/dashboard/screen-time", label: "Screen", icon: Smartphone },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

// Bottom 5 items for mobile
const mobileNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/habits", label: "Habits", icon: CheckCircle },
  { href: "/dashboard/wellness", label: "Wellness", icon: Heart },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/void", label: "Void", icon: Moon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-[#ede9e2] pb-safe">
        <div className="flex items-center justify-around px-2 pt-2 pb-2">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-0 bg-[#f6f3ee] rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  className={cn(
                    "relative z-10 transition-colors",
                    isActive ? "text-[#7c9a6e]" : "text-[#b5ad9e]"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium relative z-10 transition-colors",
                    isActive ? "text-[#7c9a6e]" : "text-[#b5ad9e]"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-[#ede9e2] z-50 shadow-[1px_0_8px_rgba(0,0,0,0.04)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-9 h-9 rounded-full bg-[#f6f3ee] border border-[#ede9e2] flex items-center justify-center">
            <Leaf size={18} className="text-[#7c9a6e]" />
          </div>
          <span className="font-serif text-2xl text-[#3d3a35] tracking-wide">
            AXUNE
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-[#f6f3ee] text-[#7c9a6e]"
                    : "text-[#8a8578] hover:bg-[#faf8f5] hover:text-[#3d3a35]"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-[#7c9a6e]" : "text-current"
                  )}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-[#ede9e2]">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[#8a8578] hover:bg-[#faf8f5] hover:text-[#9e6b5e] transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

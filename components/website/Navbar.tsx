"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { websiteNavLinks } from "@/lib/website-data/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isHeroPage = pathname === "/" || pathname === "/about";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const showSolid = scrolled || !isHeroPage;
  const textColor = showSolid ? "text-site-heading" : "text-white";
  const linkHoverColor = showSolid
    ? "hover:text-site-accent"
    : "hover:text-white/80";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          showSolid
            ? "bg-white shadow-site-nav"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-site mx-auto px-6 flex items-center justify-between h-[60px] desktop:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className={`font-body text-[18px] font-semibold tracking-[3px] uppercase ${textColor}`}
          >
            AXUNE
          </Link>

          {/* Desktop nav links */}
          <div className="hidden desktop:flex items-center gap-8">
            {websiteNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`site-link font-body text-[14px] font-medium transition-colors ${
                    isActive
                      ? "text-site-accent"
                      : `${textColor} ${linkHoverColor}`
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/newsletter"
              className="hidden tablet:inline-flex bg-site-accent text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold font-body hover:bg-site-accent-hover transition-colors"
            >
              Subscribe
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`desktop:hidden flex flex-col justify-center gap-[5px] w-8 h-8 ${textColor}`}
              aria-label="Open menu"
            >
              <div className="w-6 h-[2px] bg-current" />
              <div className="w-6 h-[2px] bg-current" />
              <div className="w-6 h-[2px] bg-current" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6 text-site-heading text-3xl"
            aria-label="Close menu"
          >
            &#10005;
          </button>

          <div className="flex flex-col items-center gap-8">
            {websiteNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-heading text-[28px] font-medium transition-colors ${
                    isActive ? "text-site-accent" : "text-site-heading"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/newsletter"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-site-accent text-white px-8 py-3 rounded-lg text-[14px] font-semibold font-body hover:bg-site-accent-hover transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

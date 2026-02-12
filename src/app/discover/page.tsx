"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  X,
  ChevronUp,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Sparkles,
  Zap,
  Lock,
} from "lucide-react";
import { sampleIdeas } from "@/lib/data";

export default function DiscoverPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAnimation, setSwipeAnimation] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const currentIdea = sampleIdeas[currentIndex % sampleIdeas.length];
  const freeLimit = 15;
  const isLimited = swipeCount >= freeLimit;

  const handleSwipe = useCallback(
    (direction: "left" | "right" | "up") => {
      if (isLimited) return;
      setSwipeAnimation(`swipe-${direction}`);
      setSwipeCount((c) => c + 1);
      if (direction === "right") setSavedCount((c) => c + 1);
      if (direction === "up") {
        setTimeout(() => router.push(`/ideas/${currentIdea.id}`), 300);
      }
      setTimeout(() => {
        setSwipeAnimation(null);
        setCurrentIndex((i) => i + 1);
        setDragX(0);
      }, 400);
    },
    [currentIdea.id, isLimited, router]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    setDragging(false);
    if (dragX > 100) handleSwipe("right");
    else if (dragX < -100) handleSwipe("left");
    else setDragX(0);
  };

  const riskColor = {
    Low: "text-success",
    Medium: "text-warning",
    High: "text-danger",
  };

  return (
    <div className="flex min-h-screen flex-col px-4 pt-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-xs text-muted">
            {freeLimit - swipeCount} swipes remaining today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
            <Heart size={14} /> {savedCount} saved
          </div>
        </div>
      </div>

      {/* Swipe card */}
      <div className="relative mx-auto flex w-full max-w-md flex-1 items-center justify-center">
        {isLimited ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card-border">
              <Lock size={32} className="text-muted" />
            </div>
            <h3 className="text-xl font-bold">Daily limit reached</h3>
            <p className="text-sm text-muted">
              Upgrade to Pro for unlimited swipes
            </p>
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white"
            >
              Upgrade to Pro
            </button>
          </div>
        ) : (
          <div
            ref={cardRef}
            className={`w-full cursor-grab rounded-2xl border border-card-border bg-card-bg p-6 transition-transform active:cursor-grabbing ${
              swipeAnimation || ""
            }`}
            style={{
              transform: dragging
                ? `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`
                : undefined,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* Match badge */}
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {currentIdea.category}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-accent">
                <Sparkles size={14} />
                {currentIdea.aiMatchPercent}% Match
              </div>
            </div>

            <h2 className="mb-2 text-xl font-bold">{currentIdea.title}</h2>
            <p className="mb-4 text-sm text-accent-light font-medium">
              {currentIdea.hook}
            </p>

            {/* Problem / Solution */}
            <div className="mb-4 space-y-3">
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Problem
                </span>
                <p className="mt-1 text-sm text-foreground/80">
                  {currentIdea.problem}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Solution
                </span>
                <p className="mt-1 text-sm text-foreground/80">
                  {currentIdea.solution}
                </p>
              </div>
            </div>

            {/* Metrics row */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-background/50 p-2 text-center">
                <DollarSign size={14} className="mx-auto mb-1 text-success" />
                <p className="text-xs text-muted">Cost</p>
                <p className="text-xs font-semibold">{currentIdea.costRange}</p>
              </div>
              <div className="rounded-lg bg-background/50 p-2 text-center">
                <AlertTriangle
                  size={14}
                  className={`mx-auto mb-1 ${riskColor[currentIdea.riskLevel]}`}
                />
                <p className="text-xs text-muted">Risk</p>
                <p className={`text-xs font-semibold ${riskColor[currentIdea.riskLevel]}`}>
                  {currentIdea.riskLevel}
                </p>
              </div>
              <div className="rounded-lg bg-background/50 p-2 text-center">
                <TrendingUp size={14} className="mx-auto mb-1 text-accent" />
                <p className="text-xs text-muted">Scale</p>
                <p className="text-xs font-semibold">
                  {currentIdea.scalabilityScore}/100
                </p>
              </div>
            </div>

            {/* Revenue model */}
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-xs text-muted">Revenue Model</p>
              <p className="text-sm font-medium">{currentIdea.revenueModel}</p>
            </div>

            {/* Why Now */}
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
              <Zap size={14} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-semibold text-accent">Why Now</p>
                <p className="text-xs text-foreground/70">
                  {currentIdea.whyNow}
                </p>
              </div>
            </div>

            {/* Drag indicator */}
            {dragX !== 0 && (
              <div
                className={`absolute top-6 ${
                  dragX > 0 ? "right-6" : "left-6"
                } rounded-lg border-2 px-4 py-2 text-lg font-bold ${
                  dragX > 0
                    ? "border-success text-success rotate-12"
                    : "border-danger text-danger -rotate-12"
                }`}
              >
                {dragX > 0 ? "SAVE" : "PASS"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isLimited && (
        <div className="mx-auto flex w-full max-w-md items-center justify-center gap-6 py-6">
          <button
            onClick={() => handleSwipe("left")}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-danger/30 bg-danger/10 text-danger transition-all hover:bg-danger/20"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => handleSwipe("up")}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/30 bg-accent/10 text-accent transition-all hover:bg-accent/20"
          >
            <ChevronUp size={28} />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-success/30 bg-success/10 text-success transition-all hover:bg-success/20"
          >
            <Heart size={24} />
          </button>
        </div>
      )}

      {/* Swipe instructions */}
      {!isLimited && (
        <div className="mx-auto flex gap-6 pb-4 text-xs text-muted">
          <span>← Pass</span>
          <span>↑ Deep Dive</span>
          <span>Save →</span>
        </div>
      )}
    </div>
  );
}

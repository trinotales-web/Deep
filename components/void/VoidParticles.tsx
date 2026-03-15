"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  xMove: number;
  yMove: number;
}

export function VoidParticles({ count = 25 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 6,
      xMove: (Math.random() - 0.5) * 40,
      yMove: (Math.random() - 0.5) * 50,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, p.xMove, -p.xMove * 0.5, 0],
            y: [0, p.yMove, -p.yMove * 0.3, 0],
            opacity: [0.06, 0.2, 0.08, 0.06],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

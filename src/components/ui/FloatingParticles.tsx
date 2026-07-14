'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: string;
  size: string;
  delay: string;
  duration: string;
  color: string;
}

interface Props {
  count?: number;
}

export default function FloatingParticles({ count = 15 }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particle parameters on mount to avoid hydration mismatch
    const colors = [
      'bg-[#00FA9A]/[0.03]', // Neon Emerald tint
      'bg-[#E9C46A]/[0.03]', // Warm Gold tint
      'bg-emerald-500/[0.03]'
    ];

    const items: Particle[] = Array.from({ length: count }).map((_, i) => {
      const sizeValue = Math.floor(Math.random() * 5) + 3; // 3px to 8px
      const size = `${sizeValue}px`;
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 8}s`;
      const duration = `${Math.random() * 10 + 22}s`; // 22s to 32s (super slow, average 27s)
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: i,
        left,
        size,
        delay,
        duration,
        color
      };
    });

    setParticles(items);
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute rounded-full animate-drift-up ${p.color}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: '-10px',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
}

const SUNFLOWER_PETAL_COLORS = [
  '#FBBF24', // Golden yellow
  '#F59E0B', // Amber
  '#EAB308', // Radiant yellow
  '#D97706', // Ochre
  '#FCD34D', // Light sunflower yellow
];

export default function FlowerCursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Only run on desktop/laptop with a real mouse/trackpad pointer
    // This prevents any clutter or stuck elements on phone touchscreens
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    let lastTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore touch input
      if (e.pointerType === 'touch') return;

      const now = Date.now();
      if (now - lastTime < 50) return;
      lastTime = now;

      const newParticle: Particle = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 7 + 5,
        rotation: Math.random() * 360,
        color: SUNFLOWER_PETAL_COLORS[Math.floor(Math.random() * SUNFLOWER_PETAL_COLORS.length)]
      };

      setParticles((prev) => [...prev.slice(-10), newParticle]);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Clean old particles automatically
  useEffect(() => {
    if (particles.length === 0) return;
    const timeout = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 350);
    return () => clearTimeout(timeout);
  }, [particles]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out animate-ping"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            borderRadius: '50% 50% 50% 0%',
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            opacity: 0.6,
            boxShadow: `0 0 5px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

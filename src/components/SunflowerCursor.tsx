/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef } from 'react';

export default function SunflowerCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const isRunning = useRef(false);

  useEffect(() => {
    const el = cursorRef.current;
    const icon = iconRef.current;
    if (!el || !icon) return;

    // Check if device supports fine hover (desktop mouse)
    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchOnly) {
      // On touch-only mobile devices, disable continuous touch tracking to prevent scroll lag
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isPointer = false;
    let isPressed = false;

    const stopLoop = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      isRunning.current = false;
    };

    const render = () => {
      if (isVisible) {
        // Fast direct lerp
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * 0.55;
        currentY += dy * 0.55;

        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        el.style.opacity = '1';

        // Stop rAF loop when settled to save 100% CPU/GPU
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          stopLoop();
          return;
        }
      } else {
        el.style.opacity = '0';
        stopLoop();
        return;
      }

      rafId.current = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        rafId.current = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;
      isVisible = true;

      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
        const nextIsPointer = !!clickable;
        if (nextIsPointer !== isPointer) {
          isPointer = nextIsPointer;
          icon.style.transform = isPressed ? 'scale(1.15) rotate(30deg)' : isPointer ? 'scale(1.1) rotate(12deg)' : 'scale(1) rotate(0deg)';
        }
      }

      startLoop();
    };

    const handlePointerDown = () => {
      isPressed = true;
      icon.style.transform = 'scale(1.15) rotate(30deg)';
      startLoop();
    };

    const handlePointerUp = () => {
      isPressed = false;
      icon.style.transform = isPointer ? 'scale(1.1) rotate(12deg)' : 'scale(1) rotate(0deg)';
      startLoop();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      el.style.opacity = '0';
      stopLoop();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      stopLoop();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[999999] opacity-0 transition-opacity duration-150 hidden md:block"
      style={{
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      <div
        ref={iconRef}
        className="flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
      >
        {/* Soft golden aura */}
        <div className="absolute w-8 h-8 rounded-full bg-amber-400/20 blur-2xs pointer-events-none" />

        {/* Crisp Golden Sunflower SVG */}
        <svg
          className="w-7 h-7 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
          viewBox="0 0 36 36"
        >
          <g transform="translate(18,18)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <path
                key={angle}
                d="M0,0 C-2.5,-6 -2.5,-12 0,-16 C2.5,-12 2.5,-6 0,0"
                transform={`rotate(${angle})`}
                fill={i % 2 === 0 ? '#FBBF24' : '#F59E0B'}
                stroke="#D97706"
                strokeWidth="0.6"
              />
            ))}
            <circle cx="0" cy="0" r="5.5" fill="#3B1F0B" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3.5" fill="#451A03" stroke="#F59E0B" strokeDasharray="1,1" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="1.3" fill="#FEF08A" />
          </g>
        </svg>
      </div>
    </div>
  );
}

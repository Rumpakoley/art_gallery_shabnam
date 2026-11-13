/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useRef } from 'react';

export default function SunflowerCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run if cursor DOM element is mounted
    const el = cursorRef.current;
    const icon = iconRef.current;
    if (!el || !icon) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isPointer = false;
    let isPressed = false;
    let isTouchDevice = false;

    // Render loop using requestAnimationFrame (60/120fps hardware sync, 0 React re-renders)
    const render = () => {
      if (isVisible) {
        // Smooth lerp on desktop, instant on touch
        const factor = isTouchDevice ? 1 : 0.45;
        currentX += (targetX - currentX) * factor;
        currentY += (targetY - currentY) * factor;

        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        el.style.opacity = '1';
      } else {
        el.style.opacity = '0';
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    // Desktop pointer move
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      isTouchDevice = false;
      targetX = e.clientX;
      targetY = e.clientY;
      isVisible = true;

      // Fast check for clickable elements without layout thrashing
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
        const nextIsPointer = !!clickable;
        if (nextIsPointer !== isPointer) {
          isPointer = nextIsPointer;
          icon.style.transform = isPressed ? 'scale(1.2) rotate(45deg)' : isPointer ? 'scale(1.15) rotate(15deg)' : 'scale(1) rotate(0deg)';
        }
      }
    };

    // Mobile touch interaction
    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      isTouchDevice = true;
      const t = e.touches[0];
      targetX = t.clientX;
      targetY = t.clientY - 26; // Float slightly above fingertip so finger never blocks artwork
      currentX = targetX;
      currentY = targetY;
      isVisible = true;
      isPressed = true;

      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      icon.style.transform = 'scale(1.2) rotate(35deg)';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      targetX = t.clientX;
      targetY = t.clientY - 26;
      isVisible = true;
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };

    const handleTouchEnd = () => {
      isPressed = false;
      icon.style.transform = 'scale(1) rotate(0deg)';
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        isVisible = false;
      }, 700);
    };

    const handlePointerDown = () => {
      isPressed = true;
      icon.style.transform = 'scale(1.2) rotate(45deg)';
    };

    const handlePointerUp = () => {
      isPressed = false;
      icon.style.transform = isPointer ? 'scale(1.15) rotate(15deg)' : 'scale(1) rotate(0deg)';
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[999999] opacity-0 transition-opacity duration-200"
      style={{
        willChange: 'transform',
        contain: 'layout style paint',
      }}
    >
      <div
        ref={iconRef}
        className="flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
      >
        {/* Soft golden aura */}
        <div className="absolute w-10 h-10 rounded-full bg-amber-400/25 blur-xs pointer-events-none" />

        {/* Crisp Golden Sunflower SVG */}
        <svg
          className="w-8 h-8 sm:w-7 sm:h-7 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
          viewBox="0 0 36 36"
        >
          <g transform="translate(18,18)">
            {/* 12 Radiant Petals */}
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
            {/* Dark Chocolate Seed Center */}
            <circle cx="0" cy="0" r="5.5" fill="#3B1F0B" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3.5" fill="#451A03" stroke="#F59E0B" strokeDasharray="1,1" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="1.3" fill="#FEF08A" />
          </g>
        </svg>
      </div>
    </div>
  );
}

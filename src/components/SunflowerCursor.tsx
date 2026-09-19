/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from 'react';

export default function SunflowerCursor() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    let fadeTimer: NodeJS.Timeout;

    const updatePosition = (clientX: number, clientY: number, touch: boolean) => {
      setIsTouch(touch);
      // On mobile touch, place sunflower slightly above the fingertip so the finger doesn't block it
      const offsetY = touch ? -28 : 0;
      setPos({ x: clientX, y: clientY + offsetY });
      setVisible(true);

      clearTimeout(fadeTimer);
      if (touch) {
        // Softly hide 1.8s after touch ends to keep screen ultra clean
        fadeTimer = setTimeout(() => {
          setVisible(false);
        }, 1800);
      }
    };

    // Desktop Mouse Move
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      updatePosition(e.clientX, e.clientY, false);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
        setIsPointer(!!isClickable);
      }
    };

    // Mobile Phone Touch Start & Move
    const handleTouch = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      updatePosition(t.clientX, t.clientY, true);
      setIsPressed(true);

      const target = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
        setIsPointer(!!isClickable);
      }
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        setVisible(false);
      }, 1200);
    };

    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);

      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[999999] transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        opacity: visible ? 1 : 0,
        willChange: 'transform',
      }}
    >
      <div
        className={`transition-transform duration-200 ease-out flex items-center justify-center ${
          isPressed ? 'scale-125' : isPointer ? 'scale-115' : 'scale-100'
        }`}
      >
        {/* Luminous Glow aura for touch / pointer */}
        {(isPointer || isPressed || isTouch) && (
          <div className="absolute w-12 h-12 rounded-full bg-amber-400/30 blur-xs animate-pulse pointer-events-none" />
        )}

        {/* Single Sunflower SVG Cursor */}
        <svg
          className={`w-9 h-9 sm:w-8 sm:h-8 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-300 ${
            isPressed ? 'rotate-45' : isPointer ? 'rotate-12' : ''
          }`}
          viewBox="0 0 36 36"
        >
          <g transform="translate(18,18)">
            {/* 12 Radiant Golden Sunflower Petals */}
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
            {/* Dark Chocolate Center Seed Disc */}
            <circle cx="0" cy="0" r="5.5" fill="#3B1F0B" stroke="#78350F" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3.5" fill="#451A03" stroke="#F59E0B" strokeDasharray="1,1" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="1.3" fill="#FEF08A" />
          </g>
        </svg>
      </div>
    </div>
  );
}

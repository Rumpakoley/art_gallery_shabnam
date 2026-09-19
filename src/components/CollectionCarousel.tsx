/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Painting } from '../types';
import PaintingCard from './PaintingCard';

interface CollectionCarouselProps {
  title: string;
  description: string;
  paintings: Painting[];
  onViewDetails: (painting: Painting) => void;
  theme?: 'light' | 'dark' | 'funky';
  isAdmin?: boolean;
}

export default function CollectionCarousel({
  title,
  description,
  paintings,
  onViewDetails,
  theme = 'light',
  isAdmin = false,
}: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  if (!paintings || paintings.length === 0) return null;

  return (
    <div className="space-y-6 pt-12 border-t border-stone-200/40 first:border-0 first:pt-0">
      {/* Collection Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-stone-900 uppercase">
              {title}
            </h3>
            <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-stone-200/60 text-stone-700">
              {paintings.length} {paintings.length === 1 ? 'Work' : 'Works'}
            </span>
          </div>
          <p className="font-sans text-[11px] italic text-stone-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Horizontal Navigation Buttons */}
        {paintings.length > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleScrollLeft}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-all cursor-pointer"
              title="Scroll Left"
              aria-label={`Scroll left in ${title}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleScrollRight}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-all cursor-pointer"
              title="Scroll Right"
              aria-label={`Scroll right in ${title}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Single-Row Horizontal Scrolling Track */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-6 pt-3 snap-x snap-mandatory scrollbar-none scroll-smooth px-1"
      >
        <AnimatePresence mode="popLayout">
          {paintings.map((painting) => (
            <div
              key={painting.id}
              className="w-[280px] sm:w-[330px] md:w-[360px] shrink-0 snap-start"
            >
              <PaintingCard
                painting={painting}
                onViewDetails={onViewDetails}
                theme={theme}
                isAdmin={isAdmin}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

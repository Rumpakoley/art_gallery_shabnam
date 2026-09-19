/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRef } from 'react';
import { motion } from 'motion/react';
import { Instagram, ExternalLink, Play, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudioVideo } from '../types';

interface StudioVideoSectionProps {
  videos: StudioVideo[];
  theme?: 'light' | 'dark' | 'funky';
}

export default function StudioVideoSection({
  videos
}: StudioVideoSectionProps) {
  const videoScrollRef = useRef<HTMLDivElement>(null);

  const scrollVideoLeft = () => {
    if (videoScrollRef.current) {
      videoScrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollVideoRight = () => {
    if (videoScrollRef.current) {
      videoScrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  if (!videos || videos.length === 0) return null;

  return (
    <motion.section
      id="studio-videos-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 pt-8 border-t border-stone-200/40"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 max-w-7xl mx-auto px-1">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="font-sans text-[10px] font-bold text-amber-800 uppercase tracking-widest">
              Studio Reels & Movement
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-stone-900">
            Studio In Motion
          </h3>
          <p className="font-sans text-[11px] italic text-stone-500 leading-relaxed max-w-xl">
            Click any reel to watch moving process fragments live on Instagram @themorphiq.
          </p>
        </div>

        {/* Scroll Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={scrollVideoLeft}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-all cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollVideoRight}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white transition-all cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Single Line Horizontal Scroll Track */}
      <div
        ref={videoScrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none scroll-smooth px-1"
      >
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-[280px] sm:w-[340px] md:w-[380px] aspect-video snap-center group relative overflow-hidden bg-stone-900 rounded-2xl cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.14)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Poster / Thumbnail Image */}
            {video.posterUrl ? (
              <img
                src={video.posterUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] opacity-85 group-hover:opacity-95"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 flex items-center justify-center">
                <Film className="w-10 h-10 text-stone-600 opacity-40" />
              </div>
            )}

            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-black/20 group-hover:from-stone-950/95 transition-all duration-300" />

            {/* Top Bar: Instagram Badge */}
            <div className="relative z-10 p-4 flex justify-between items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-xs text-white font-sans text-[9px] font-bold uppercase tracking-widest rounded-full border border-white/15 shadow-xs">
                <Instagram className="w-3 h-3 text-pink-400" />
                <span>Instagram Reel</span>
              </span>

              <span className="p-1.5 rounded-full bg-white/10 backdrop-blur-xs text-white opacity-80 group-hover:opacity-100 group-hover:bg-white/20 transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Center: Glowing Instagram Play Button */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/95 text-stone-900 shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-amber-600 group-hover:to-pink-600 group-hover:text-white">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>

            {/* Bottom Bar: Title & Instagram Link Callout */}
            <div className="relative z-10 p-4 sm:p-5 text-left text-white space-y-1">
              <h4 className="font-serif text-sm font-bold tracking-wide group-hover:text-amber-300 transition-colors flex items-center justify-between">
                <span className="truncate pr-2">{video.title}</span>
                <span className="text-[9px] font-sans uppercase font-bold tracking-widest text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Watch Reel →</span>
              </h4>
              <p className="font-sans text-[10px] text-stone-300 line-clamp-1 leading-relaxed opacity-90">
                {video.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

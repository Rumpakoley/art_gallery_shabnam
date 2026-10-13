/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Painting } from '../types';
import { X, Upload, Check, Image as ImageIcon, Plus, Camera } from 'lucide-react';

interface PostWorkModalProps {
  onClose: () => void;
  onPost: (painting: Painting) => void;
  theme?: 'light' | 'dark' | 'funky';
}

// Preset artwork style mockups for quick testing
const STYLE_PRESETS = [
  {
    name: "Pacific Shoreline",
    genre: "Oil on Linen",
    url: "https://picsum.photos/seed/shoredream/1200/900",
    description: "An atmospheric exploration of moving seawater, coastal sea spray, and grey granite cliffs. Hand-layered with cold wax."
  },
  {
    name: "Golden Wheatfields",
    genre: "Mixed Media",
    url: "https://picsum.photos/seed/goldfield/1200/900",
    description: "A golden-hued, textural study of rolling crop fields basking in midday amber light, using fine marble dust and thick acrylics."
  },
  {
    name: "Crimson Bloom",
    genre: "Acrylic on Panel",
    url: "https://picsum.photos/seed/crimsonbloom/1200/900",
    description: "An expressive floral abstraction centered around heavy cadmium red and crimson brushwork, contrasting sharply with charcoal overlays."
  },
  {
    name: "Celestial Void",
    genre: "Oil & Gilded Gold",
    url: "https://picsum.photos/seed/celestialvoid/1200/900",
    description: "A dark minimal canvas punctuated by genuine gold leaf fractals that reflect dynamic candlelight in personal collections."
  },
  {
    name: "Tuscan Portico",
    genre: "Watercolor & Gouache",
    url: "https://picsum.photos/seed/tuscanport/1200/900",
    description: "Sun-drenched architectural watercolor capturing stucco textures, terra cotta tiles, and sharp violet afternoon shadows."
  }
];

export default function PostWorkModal({ onClose, onPost, theme = 'dark' }: PostWorkModalProps) {
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('Ink & Acrylic on Canvas');
  const [category, setCategory] = useState('Abstract');
  const [year, setYear] = useState(2026);
  const [dimensions, setDimensions] = useState('24 x 36 inches');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('1800');
  const [status, setStatus] = useState<'Available' | 'Sold' | 'In Collection'>('Available');
  const [collection, setCollection] = useState<'Fossils of a Drifting Mind' | 'The Ones I Carry' | 'Whispers of the Subconscious'>('Fossils of a Drifting Mind');
  
  // Image handling
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndSetFile = (file: File) => {
    setIsProcessingImage(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setUploadedImageUrl(dataUrl);
        } else {
          setUploadedImageUrl(objectUrl);
        }
        URL.revokeObjectURL(objectUrl);
        setSelectedPresetIndex(null);
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setIsProcessingImage(false);
      };
      img.src = objectUrl;
    } catch {
      setIsProcessingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndSetFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIndex(idx);
    setUploadedImageUrl(null);
    setCustomUrl('');
    const preset = STYLE_PRESETS[idx];
    if (!title || title.startsWith('Study:')) {
      setTitle(`Study: ${preset.name}`);
      setDescription(preset.description);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Determine final image URL
    let finalImageUrl = 'https://picsum.photos/seed/defaultart/1200/900';
    if (uploadedImageUrl) {
      finalImageUrl = uploadedImageUrl;
    } else if (customUrl) {
      finalImageUrl = customUrl;
    } else if (selectedPresetIndex !== null) {
      finalImageUrl = STYLE_PRESETS[selectedPresetIndex].url;
    }

    const priceNum = price ? parseFloat(price) : null;

    const newPainting: Painting = {
      id: `painting-custom-${Date.now()}`,
      title,
      medium,
      category,
      year: Number(year),
      dimensions,
      description: description || "An original work created in the artist's studio.",
      imageUrl: finalImageUrl,
      price: priceNum,
      status,
      collection,
      createdAt: new Date().toISOString()
    };

    onPost(newPainting);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-start sm:items-center justify-center p-2 sm:p-4 bg-stone-900/75 backdrop-blur-xs">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 cursor-zoom-out"
      />

      {/* Floating Close Button for Mobile & Desktop */}
      <button
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50 p-2.5 sm:p-3 rounded-full bg-stone-900/90 hover:bg-black text-white border border-white/20 shadow-2xl transition-all cursor-pointer flex items-center justify-center backdrop-blur-md active:scale-95"
        aria-label="Close"
        title="Close window"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Main Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative border w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-2xl my-auto transition-all duration-300 shadow-2xl md:max-h-[88vh] md:overflow-hidden ${
          theme === 'dark'
            ? 'bg-[#0E0D0C] border-stone-850 text-stone-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)]' :
          theme === 'funky'
            ? 'bg-[#150d2c] border-purple-900/60 text-purple-200 shadow-[0_25px_50px_-12px_rgba(127,0,255,0.4)]'
            : 'bg-white border-stone-200 shadow-2xl text-stone-900'
        }`}
      >
        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Left Column: Visual Canvas & Instant Photo Upload (5 cols on desktop) */}
        <div className={`md:col-span-5 p-5 sm:p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r md:overflow-y-auto md:max-h-[88vh] transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#121110] border-stone-850' :
          theme === 'funky' ? 'bg-[#0a0418] border-purple-900/40' :
          'bg-stone-50 border-stone-200'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`p-1 px-2.5 font-sans text-[10px] font-semibold tracking-wider rounded-sm border uppercase ${
                  theme === 'dark' ? 'bg-stone-900 text-amber-450 border-stone-850' :
                  theme === 'funky' ? 'bg-purple-950/60 text-fuchsia-400 border-purple-800/40 text-glow-neon' :
                  'bg-amber-50 text-amber-800 border-amber-200/50'
                }`}>
                  Studio Mode
                </span>
                <h3 className="font-serif text-lg font-semibold">Artwork Canvas</h3>
              </div>
            </div>

            {/* Interactive Preview of active visual */}
            <div
              onClick={triggerFileSelect}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group relative aspect-4/3 sm:aspect-3/4 max-h-[220px] sm:max-h-[340px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-inner flex items-center justify-center ${
                isDragOver
                  ? 'border-amber-500 scale-[1.01]'
                  : uploadedImageUrl
                  ? 'border-emerald-500/80 shadow-md'
                  : theme === 'dark'
                  ? 'bg-stone-900 border-stone-800'
                  : theme === 'funky'
                  ? 'bg-purple-950/40 border-purple-900/50'
                  : 'bg-stone-100 border-stone-200'
              }`}
              title="Click to choose or change artwork photo"
            >
              {uploadedImageUrl ? (
                <img src={uploadedImageUrl} alt="Uploaded painting" className="w-full h-full object-cover" />
              ) : customUrl ? (
                <img src={customUrl} alt="Custom URL painting" className="w-full h-full object-cover" />
              ) : selectedPresetIndex !== null ? (
                <img src={STYLE_PRESETS[selectedPresetIndex].url} alt="Preset painting" className="w-full h-full object-cover" />
              ) : (
                <div className="text-stone-400 text-center p-4">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="font-sans text-xs">Tap to Choose Artwork</p>
                </div>
              )}

              {/* Tap to change overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-sans text-xs font-semibold backdrop-blur-2xs">
                <Camera className="w-4 h-4" />
                <span>Tap to change photo</span>
              </div>

              <div className="absolute bottom-2 left-2 bg-black/70 text-[9px] text-white px-2 py-0.5 rounded-sm backdrop-blur-xs font-mono">
                {uploadedImageUrl ? '✓ YOUR ARTWORK' : 'PREVIEW'}
              </div>
            </div>

            {/* Prominent Instant Upload Button for Phone & Desktop */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={triggerFileSelect}
                disabled={isProcessingImage}
                className={`w-full py-3 px-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 ${
                  uploadedImageUrl
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : theme === 'dark'
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold'
                    : theme === 'funky'
                    ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                    : 'bg-stone-900 hover:bg-black text-white'
                }`}
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isProcessingImage
                    ? 'Processing Image...'
                    : uploadedImageUrl
                    ? '✓ Photo Selected (Tap to Change)'
                    : '📷 Upload Photo from Phone'}
                </span>
              </button>
              {uploadedImageUrl && (
                <p className="text-center font-sans text-[10px] font-semibold text-emerald-600 flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> High-res artwork loaded & ready
                </p>
              )}
            </div>

            {/* Preset Selection Grid */}
            <div className="space-y-2 pt-2 border-t border-stone-200/50 dark:border-stone-800">
              <label className="block text-[11px] font-semibold uppercase tracking-wider font-sans text-stone-500">
                Or Select Sample Preset:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {STYLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(idx)}
                    title={`${preset.name} (${preset.genre})`}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                      selectedPresetIndex === idx && !uploadedImageUrl
                        ? theme === 'funky' 
                          ? 'border-fuchsia-500 shadow-md scale-102'
                          : 'border-amber-600 shadow-md scale-102' 
                        : 'border-stone-200 dark:border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    {selectedPresetIndex === idx && !uploadedImageUrl && (
                      <div className="absolute inset-0 bg-amber-900/40 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white stroke-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input Option */}
            <div className="space-y-1 pt-1">
              <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-400">
                Or paste web image link:
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={customUrl}
                onFocus={() => {
                  setSelectedPresetIndex(null);
                  setUploadedImageUrl(null);
                }}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  setSelectedPresetIndex(null);
                  setUploadedImageUrl(null);
                }}
                className={`w-full text-xs font-sans border focus:outline-hidden p-2 rounded-md transition-colors ${
                  theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100' :
                  theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100' :
                  'bg-white border-stone-200'
                }`}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800 hidden md:block">
            <p className="font-sans text-[10px] italic text-stone-400">
              Posting adds the artwork directly to your studio archive.
            </p>
          </div>
        </div>

        {/* Right Column: Data Entry Form (7 cols on desktop) */}
        <form
          onSubmit={handleFormSubmit}
          className={`md:col-span-7 p-5 sm:p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto md:max-h-[88vh] transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#131211] text-stone-250' :
            theme === 'funky' ? 'bg-[#12072b] text-purple-200' :
            'bg-white text-stone-900'
          }`}
        >
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                Artwork Information
              </h2>
              <p className="font-sans text-xs text-stone-500 mt-1">
                Fill in the details below to complete your painting's catalog entry.
              </p>
            </div>

            {/* Core Artwork Metadata */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Artwork Title <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whispers of Crimson"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                    theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                    theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                    'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Medium / Materials
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ink & Acrylic on Canvas"
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                      'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24 x 36 inches"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                      'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                      'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  >
                    <option value="Abstract">Abstract</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Still Life">Still Life</option>
                    <option value="Seascape">Seascape</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Year
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2030"
                    required
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                      theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                      theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                      'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2.5 text-stone-400 font-sans text-xs">$</span>
                    <input
                      type="number"
                      placeholder="e.g. 1800"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full text-sm font-sans pl-6 border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                        theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                        theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                        'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Body of Work / Collection */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Body of Work (Collection)
                </label>
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value as any)}
                  className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                    theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                    theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                    'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                  }`}
                >
                  <option value="Fossils of a Drifting Mind">Fossils of a Drifting Mind</option>
                  <option value="The Ones I Carry">The Ones I Carry</option>
                  <option value="Whispers of the Subconscious">Whispers of the Subconscious</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Availability Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors ${
                    theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                    theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                    'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                  }`}
                >
                  <option value="Available">Available for Purchase</option>
                  <option value="Sold">Sold</option>
                  <option value="In Collection">In Collection</option>
                </select>
              </div>

              {/* Description curator statement */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Description / Statement
                </label>
                <textarea
                  placeholder="Share details about the inspiration behind this piece, materials, textures, or conceptual thoughts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`w-full text-sm font-sans border focus:outline-hidden p-2.5 rounded-lg shadow-2xs transition-colors resize-none ${
                    theme === 'dark' ? 'bg-stone-900 border-stone-800 text-stone-100 focus:border-amber-500' :
                    theme === 'funky' ? 'bg-[#150d2c] border-purple-800 text-purple-100 focus:border-fuchsia-500' :
                    'bg-stone-50 focus:bg-white border-stone-200 focus:border-amber-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 border rounded-xl font-sans text-xs font-semibold transition-colors cursor-pointer text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-full sm:w-auto px-7 py-3 sm:py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 border-0 ${
                theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold' :
                theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' :
                'bg-stone-900 hover:bg-black text-white'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Canvas</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

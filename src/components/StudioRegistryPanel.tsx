/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef } from 'react';
import { FileText, Sparkles, Copy, Check, Download, Upload, CloudCheck, Info } from 'lucide-react';
import { ArtistProfile, Painting } from '../types';
import { INITIAL_PAINTINGS } from '../data';

interface StudioRegistryPanelProps {
  profile: ArtistProfile;
  paintings: Painting[];
  onOpenPostModal: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onImportPaintings?: (imported: Painting[]) => void;
  theme?: 'light' | 'dark' | 'funky';
}

export default function StudioRegistryPanel({
  paintings,
  onOpenPostModal,
  isAdmin,
  onToggleAdmin,
  onImportPaintings,
  theme = 'light'
}: StudioRegistryPanelProps): React.JSX.Element {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalWorks = paintings.length;
  const availableWorks = paintings.filter(p => p.status === 'Available').length;
  const soldWorks = paintings.filter(p => p.status === 'Sold' || p.status === 'In Collection').length;

  // Filter for custom uploaded paintings (not in INITIAL_PAINTINGS default catalog)
  const defaultIds = new Set(INITIAL_PAINTINGS.map(p => p.id));
  const customPaintings = paintings.filter(p => !defaultIds.has(p.id));

  // 1-Click Auto Publish to GitHub + Vercel
  const handlePublishAllToGithub = async () => {
    if (customPaintings.length === 0 || isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('Publishing all artworks directly to GitHub & Vercel...');

    try {
      const res = await fetch('/api/publish-artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: 'morphiq@2026',
          action: 'batch_sync',
          artworks: customPaintings
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSyncStatus('✅ All artworks committed to GitHub! Live on themorphiq.com in ~45s.');
      } else {
        const msg = data.details || data.error || '';
        if (msg.includes('Bad credentials') || msg.includes('401')) {
          setSyncStatus('⚠️ GitHub Token Error (401 Bad credentials): Please re-copy your new token from GitHub and update GITHUB_TOKEN in Vercel Project Settings > Environment Variables, then click Redeploy.');
        } else {
          setSyncStatus(`⚠️ ${msg || 'Check GITHUB_TOKEN in Vercel settings.'}`);
        }
      }
    } catch (err: any) {
      setSyncStatus(`⚠️ Could not connect to publish service: ${err.message || 'offline'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Copy artwork data JSON for developer or assistant to permanently bake into GitHub / Vercel
  const handleCopyCustomCode = () => {
    if (customPaintings.length === 0) return;
    const jsonString = JSON.stringify(customPaintings, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3500);
    });
  };

  // Download all paintings backup JSON
  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paintings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `morphiq_artworks_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import paintings from backup JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && onImportPaintings) {
          onImportPaintings(parsed);
        }
      } catch (err) {
        alert("Invalid backup file format. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div id="studio-registry-panel" className={`p-6 md:p-8 rounded-2xl border transition-colors duration-300 ${
      theme === 'dark'
        ? 'glass-card text-stone-200 shadow-xl shadow-black/40' :
      theme === 'funky'
        ? 'bg-[#150d2c] border-purple-900/40 text-purple-200 shadow-lg shadow-purple-955/20'
        : 'bg-stone-50 border-stone-200/60 text-stone-900 shadow-xs'
    }`}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`font-sans text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
              theme === 'dark' ? 'text-cyan-400' : 
              theme === 'funky' ? 'text-fuchsia-400' : 
              'text-stone-500'
            }`}>
              <FileText className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-400' : 'text-stone-500'}`} />
              Studio Registry Ledger
            </h3>
            {isAdmin && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Admin Access Active
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-sans text-xs">
            <div className={`p-4 border rounded-md ${
              theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
              theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
              'bg-white border-stone-200/50 text-stone-900'
            }`}>
              <span className={`block font-serif text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-400 text-glow-cyan' :
                theme === 'funky' ? 'text-cyan-400 text-glow-cyan' :
                'text-stone-900'
              }`}>{totalWorks}</span>
              <span className="text-[9px] text-stone-500 uppercase tracking-wider">Archived Works</span>
            </div>
            
            <div className={`p-4 border rounded-md ${
              theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
              theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
              'bg-white border-stone-200/50 text-stone-900'
            }`}>
              <span className={`block font-serif text-2xl font-bold ${
                theme === 'dark' ? 'text-amber-400 text-glow-neon animate-pulse' :
                theme === 'funky' ? 'text-fuchsia-400 text-glow-neon animate-pulse' :
                'text-amber-800'
              }`}>{availableWorks}</span>
              <span className="text-[9px] text-stone-500 uppercase tracking-wider">Available pieces</span>
            </div>
            
            <div className={`p-4 border rounded-md flex flex-col justify-center ${
              theme === 'dark' ? 'bg-black/30 border-white/10 text-stone-200' :
              theme === 'funky' ? 'bg-purple-955/30 border-purple-900/50 text-purple-200' :
              'bg-white border-stone-200/50 text-stone-900'
            }`}>
              <span className={`block font-serif text-2xl font-bold ${
                theme === 'dark' ? 'text-stone-300' :
                theme === 'funky' ? 'text-purple-300' :
                'text-stone-800'
              }`}>{soldWorks}</span>
              <span className="text-[9px] text-stone-500 uppercase tracking-wider">Private Collections</span>
            </div>
          </div>
        </div>

        {/* Custom Uploads Detected Banner (e.g. on laptop vs phone) */}
        {customPaintings.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-300/80 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-700/60 text-stone-900 dark:text-amber-100 space-y-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  {customPaintings.length} Custom Artwork{customPaintings.length > 1 ? 's' : ''} Saved On This Device
                </h4>
                <p className="font-sans text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  These artworks are currently saved in this browser. To make them permanently visible to <strong>everyone worldwide across all phones, computers, and Instagram links</strong>, click below to copy the data and send it to your assistant or developer.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-sans text-[10px]">
                  {customPaintings.map((p) => (
                    <span key={p.id} className="px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-900/50 font-medium">
                      • {p.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePublishAllToGithub}
                disabled={isSyncing}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 disabled:opacity-60"
              >
                {isSyncing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Publish All to Live Site</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCopyCustomCode}
                className="px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 stroke-[2]" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-sans text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Backup (.json)</span>
              </button>
            </div>

            {syncStatus && (
              <div className="mt-2 p-2.5 rounded-lg bg-stone-900/80 text-amber-300 text-xs font-sans">
                {syncStatus}
              </div>
            )}
          </div>
        )}

        {/* Registry Admin controls */}
        {isAdmin && (
          <div className={`pt-4 border-t space-y-4 ${
            theme === 'dark' ? 'border-white/10' :
            theme === 'funky' ? 'border-purple-900/30' :
            'border-stone-200/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider border px-2.5 py-0.5 rounded-sm ${
                theme === 'dark' ? 'bg-cyan-955/30 border-cyan-900/30 text-cyan-400' :
                theme === 'funky' ? 'bg-purple-955/30 border-purple-800/40 text-fuchsia-400 text-glow-neon' :
                'bg-amber-50 border-amber-200 text-amber-805'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-cyan-400' : theme === 'funky' ? 'text-fuchsia-500' : 'text-amber-500'}`} />
                Studio Registry Active
              </span>
              <button
                onClick={onToggleAdmin}
                className={`font-sans text-[11px] underline cursor-pointer font-semibold ${
                  theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' :
                  theme === 'funky' ? 'text-purple-400 hover:text-purple-200' :
                  'text-stone-500 hover:text-stone-800'
                }`}
              >
                Lock Registry
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onOpenPostModal}
                className={`font-sans text-[11px] font-bold tracking-widest uppercase py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-98 ${
                  theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold' :
                  theme === 'funky' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' :
                  'bg-stone-900 hover:bg-black text-white'
                }`}
              >
                <span>+ Post New Work</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-sans text-[11px] font-semibold py-3.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>Import Artworks Backup</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Share2, X, Sparkles } from 'lucide-react';
import { IsometricSocialCard } from '../common/IsometricSocialCard';

export const FloatingSocialDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('touchstart', handleOutsideClick, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  return (
    <div ref={dockRef} className="fixed bottom-38 md:bottom-20 right-4 md:right-6 z-40 flex flex-col items-end">
      {/* Expanded Isometric Card Modal / Flyout */}
      {isOpen && (
        <div className="mb-3 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative group">
            {/* Close Button Header */}
            <div className="flex items-center justify-between pb-2 px-1">
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#111827] dark:text-[#F8FAFC]">
                <Sparkles size={12} className="text-[#6366F1] animate-pulse" />
                3D Social Orbit
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Exact Uiverse 3D Isometric Card with Left-pointing Tooltips */}
            <IsometricSocialCard
              orientation="vertical"
              compact={false}
              className="tooltip-left !border-none !shadow-none !bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full glass-card hover:scale-105 active:scale-95 shadow-lg border border-white/40 dark:border-white/20 text-xs font-mono font-medium text-[#111827] dark:text-[#F8FAFC] transition-all cursor-pointer backdrop-blur-md"
        title="Toggle 3D Isometric Social Links"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        <Share2 size={14} className="text-cyan-500 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">3D Socials</span>
      </button>
    </div>
  );
};

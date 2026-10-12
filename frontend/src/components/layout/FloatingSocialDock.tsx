import React, { useState } from 'react';
import { Share2, X, Sparkles } from 'lucide-react';
import { IsometricSocialCard } from '../common/IsometricSocialCard';

export const FloatingSocialDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      {/* Expanded Isometric Card Modal / Flyout */}
      {isOpen && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="relative group">
            {/* Close Button Header */}
            <div className="flex items-center justify-between pb-2 px-1">
              <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#111827] dark:text-[#F8FAFC]">
                <Sparkles size={12} className="text-[#6366F1] animate-pulse" />
                3D Isometric Orbit
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Exact Uiverse 3D Isometric Card */}
            <IsometricSocialCard
              orientation="vertical"
              compact={false}
              className="shadow-2xl border border-white/40 dark:border-white/10"
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

import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Sparkles } from 'lucide-react';

export const MotivationBanners: React.FC = () => {
  const { profile } = useDeveloperStore();
  const notes = profile.motivationNotes;

  if (!notes || notes.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-2.5">
        <span className="p-1.5 rounded-lg bg-[#6366F1] text-white shrink-0">
          <Sparkles size={14} />
        </span>
        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">
          {notes[0]}
        </span>
        <span className="hidden md:inline text-[#94A3B8]">
          • {notes[1]}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          +6.2 Momentum Velocity
        </span>
      </div>
    </div>
  );
};

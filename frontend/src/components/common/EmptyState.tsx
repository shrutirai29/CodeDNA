import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { RetroTv404 } from './RetroTv404';
import { ArrowRight, RotateCcw } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const { searchDeveloper } = useDeveloperStore();

  return (
    <div className="p-8 sm:p-12 rounded-2xl glass-card text-center flex flex-col items-center justify-center space-y-6 my-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      {/* 404 Retro CRT Television Artwork from Uiverse.io */}
      <div className="scale-75 sm:scale-90 -my-14 -mt-10">
        <RetroTv404 displayText="NOT FOUND" code="404" />
      </div>

      <div className="space-y-2 relative z-10 pt-2">
        <h3 className="text-lg font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
          404: Developer Footprint Not Found
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
          The requested GitHub profile could not be found or has not been loaded into the CodeDNA analytics engine yet. Scan a developer username or load our verified benchmark profile.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
        <button
          onClick={() => searchDeveloper('shrutirai29')}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw size={14} />
          LOAD @shrutirai29
        </button>
        <button
          onClick={() => searchDeveloper('torvalds')}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] glass-pill hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-all flex items-center gap-2 cursor-pointer"
        >
          TRY @torvalds
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

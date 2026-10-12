import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Terminal, ArrowRight } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const { searchDeveloper } = useDeveloperStore();

  return (
    <div className="p-12 rounded-2xl glass-card text-center flex flex-col items-center justify-center space-y-4 my-8 max-w-xl mx-auto shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center shadow-xs">
        <Terminal size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
          No GitHub profile loaded yet.
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md leading-relaxed">
          Enter a username and let CodeDNA map the developer behind the repositories, calculate technical DNA, and audit skill momentum.
        </p>
      </div>

      <button
        onClick={() => searchDeveloper('shrutirai29')}
        className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
      >
        ANALYZE PROFILE
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

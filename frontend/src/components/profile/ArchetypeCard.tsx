import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Compass, Sparkles } from 'lucide-react';

export const ArchetypeCard: React.FC = () => {
  const { profile } = useDeveloperStore();
  const arch = profile.archetype;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Developer Archetype
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-[#6366F1] dark:text-[#818CF8]">
            {arch.badge}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono tracking-tight mb-2">
          {arch.title}
        </h3>

        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
          “{arch.description}”
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {arch.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#EEF2F7] dark:bg-[#161B22] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Modern Developer Workspace Illustration (Minimalist SVG) */}
      <div className="pt-2">
        <div className="w-full h-24 rounded-xl bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 dark:from-indigo-950/20 dark:to-cyan-950/20 border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center p-3 relative overflow-hidden">
          {/* Workspace SVG Motif: IDE window + Terminal + Branch flow */}
          <svg className="w-full h-full max-w-xs text-indigo-500/60 dark:text-indigo-400/50" viewBox="0 0 320 80" fill="none">
            {/* Window frame */}
            <rect x="20" y="10" width="280" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="34" cy="22" r="3" fill="#EF4444" />
            <circle cx="44" cy="22" r="3" fill="#F59E0B" />
            <circle cx="54" cy="22" r="3" fill="#10B981" />
            {/* Editor code lines */}
            <line x1="34" y1="36" x2="110" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="46" x2="160" y2="46" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="56" x2="130" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Branch node network on right */}
            <circle cx="240" cy="40" r="5" fill="#6366F1" />
            <circle cx="270" cy="28" r="4" fill="#06B6D4" />
            <circle cx="270" cy="52" r="4" fill="#10B981" />
            <line x1="244" y1="38" x2="266" y2="30" stroke="currentColor" strokeWidth="1.5" />
            <line x1="244" y1="42" x2="266" y2="50" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <span className="absolute bottom-2 right-3 text-[9px] font-mono text-[#94A3B8] flex items-center gap-1">
            <Sparkles size={10} className="text-amber-400" />
            Developer Identity Pattern
          </span>
        </div>
      </div>
    </div>
  );
};

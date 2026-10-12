import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Zap, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

export const NextBestSkill: React.FC = () => {
  const { profile } = useDeveloperStore();
  const nbs = profile.next_best_skill;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TiltCard
      maxTilt={5}
      scale={1.01}
      className="p-6 rounded-2xl relative overflow-hidden group border border-indigo-500/30 dark:border-indigo-500/30"
    >
      {/* Background neon ambient highlight */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 blur-2xl pointer-events-none" />

      {/* Top Tag & Sparkle */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#6366F1] text-white">
            <Zap size={14} className="fill-current animate-pulse" />
          </span>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6366F1] dark:text-[#818CF8]">
            NEXT BEST SKILL RECOMMENDATION
          </h2>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
          +{nbs.potentialImprovement}% Fit Leverage
        </span>
      </div>

      {/* Recommendation Title */}
      <div className="my-2">
        <h3 className="text-2xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC] tracking-tight">
          {nbs.skill}
        </h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mt-1">
          “{nbs.explanation}”
        </p>
      </div>

      {/* Numerical Impact Metrics */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="p-3 rounded-xl glass-panel shadow-2xs">
          <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] block">Current Career Fit</span>
          <span className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">{nbs.currentFit}%</span>
        </div>

        <div className="p-3 rounded-xl glass-panel border border-emerald-500/40 shadow-2xs">
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">Simulated Post-Skill Fit</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {Math.min(99, Math.round(nbs.currentFit + nbs.potentialImprovement))}%
          </span>
        </div>
      </div>

      {/* Roadmap Dropdown (Optional Expansion) */}
      {isExpanded && (
        <div className="mb-4 p-4 rounded-xl glass-panel space-y-2 text-xs font-mono">
          <span className="font-bold text-[#111827] dark:text-[#F8FAFC] block mb-1">
            Accelerated 4-Step Skill Learning Track:
          </span>
          {nbs.roadmap.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[#64748B] dark:text-[#94A3B8]">
              <CheckCircle2 size={13} className="text-indigo-500 shrink-0 mt-0.5" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-1 font-semibold"
        >
          {isExpanded ? 'Hide Learning Track' : 'View Learning Track'}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {isExpanded ? 'LEARNING ROADMAP' : 'EXPLORE SKILL'}
          <ArrowRight size={14} />
        </button>
      </div>
    </TiltCard>
  );
};

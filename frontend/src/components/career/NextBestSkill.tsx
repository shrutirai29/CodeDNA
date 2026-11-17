import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Trophy,
  CheckSquare,
  Square
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { CareerService } from '../../services/careerService';

export const NextBestSkill: React.FC = () => {
  const { profile } = useDeveloperStore();
  const nbs = profile.next_best_skill;
  const topRole = profile.careers[0]?.role || 'Full-Stack Developer';

  const [isExpanded, setIsExpanded] = useState(true);

  const detailedRoadmap = CareerService.getDetailedRoadmap(
    nbs.skill,
    topRole,
    nbs.currentFit
  );

  const storageKey = `codedna_roadmap_${profile.username}_${nbs.skill.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;

  const [currentKey, setCurrentKey] = useState(storageKey);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (currentKey !== storageKey) {
    setCurrentKey(storageKey);
    try {
      const saved = localStorage.getItem(storageKey);
      setCompletedMilestones(saved ? JSON.parse(saved) : []);
    } catch {
      setCompletedMilestones([]);
    }
  }

  const toggleMilestone = (step: number) => {
    const updated = completedMilestones.includes(step)
      ? completedMilestones.filter(s => s !== step)
      : [...completedMilestones, step];
    setCompletedMilestones(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // LocalStorage error handled
    }
  };

  const totalSteps = detailedRoadmap.milestones.length;
  const progressPercent = Math.round((completedMilestones.length / Math.max(1, totalSteps)) * 100);

  return (
    <TiltCard
      maxTilt={4}
      scale={1.008}
      className="p-6 rounded-2xl relative overflow-hidden group border border-indigo-500/30 dark:border-indigo-500/30 space-y-4"
    >
      {/* Background neon ambient highlight */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/15 to-cyan-500/15 blur-2xl pointer-events-none" />

      {/* Top Tag & Sparkle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#6366F1] text-white">
            <Zap size={14} className="fill-current animate-pulse" />
          </span>
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6366F1] dark:text-[#818CF8]">
            ACTIONABLE CAREER ROADMAP & NEXT BEST SKILL
          </h2>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
          +{nbs.potentialImprovement}% Fit Leverage
        </span>
      </div>

      {/* Recommendation Title */}
      <div>
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-2xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            {nbs.skill}
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Targeting: <strong className="text-slate-800 dark:text-slate-200">{topRole}</strong>
          </span>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mt-1">
          “{nbs.explanation}”
        </p>
      </div>

      {/* Numerical Impact Metrics & Roadmap Progress Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl glass-panel shadow-2xs text-xs font-mono">
          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Current Career Fit</span>
          <span className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC]">{nbs.currentFit}%</span>
        </div>

        <div className="p-3 rounded-xl glass-panel border border-emerald-500/40 shadow-2xs text-xs font-mono">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Post-Acquisition Projected Fit</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {Math.min(99, Math.round(nbs.currentFit + nbs.potentialImprovement))}%
          </span>
        </div>

        <div className="p-3 rounded-xl glass-panel shadow-2xs text-xs font-mono">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500">Roadmap Progress</span>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{completedMilestones.length}/{totalSteps} Done</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestone Breakdown with Practice Exercises & Effort Estimates (Feature D) */}
      {isExpanded && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <span>Milestones & Hands-On Practice Exercises</span>
            <span className="text-[11px] font-normal text-slate-500 flex items-center gap-1">
              <Clock size={12} />
              Estimated: ~{detailedRoadmap.estimatedTotalWeeks} weeks total
            </span>
          </div>

          <div className="space-y-2.5">
            {detailedRoadmap.milestones.map((m) => {
              const isDone = completedMilestones.includes(m.step);
              return (
                <div
                  key={m.step}
                  onClick={() => toggleMilestone(m.step)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs font-mono select-none ${
                    isDone
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'glass-panel hover:border-indigo-400/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                    >
                      {isDone ? (
                        <CheckSquare size={16} className="text-emerald-500" />
                      ) : (
                        <Square size={16} className="text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className={`font-bold ${isDone ? 'line-through text-slate-500' : 'text-[#111827] dark:text-[#F8FAFC]'}`}>
                          Step {m.step}: {m.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          ~{m.estimatedHours} hrs effort
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {m.description}
                      </p>

                      <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                          <Code2 size={12} />
                          <span>Hands-On Practice Exercise:</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          {m.practiceExercise}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle View Button */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-mono text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          {isExpanded ? 'Collapse Roadmap' : 'Expand Detailed Roadmap'}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {progressPercent === 100 && (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <Trophy size={14} />
            Roadmap Mastered!
          </span>
        )}
      </div>
    </TiltCard>
  );
};

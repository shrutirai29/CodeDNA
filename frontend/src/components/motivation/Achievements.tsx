import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  Award,
  Flame,
  Layers,
  GitPullRequest,
  Cpu,
  Zap,
  Rocket,
  CheckCircle2,
  Lock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const badgeIcons: { [key: string]: React.ElementType } = {
  Flame,
  Layers,
  GitPullRequest,
  Cpu,
  Zap,
  Rocket
};

export const Achievements: React.FC = () => {
  const { profile } = useDeveloperStore();
  const achievements = profile.achievements || [];
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const inProgressCount = achievements.length - unlockedCount;
  const completionPercent = achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0;

  const filteredAchievements = achievements.filter((b) => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'in_progress') return !b.unlocked;
    return true;
  });

  return (
    <div className="glass-card p-6 rounded-2xl space-y-5">
      {/* Header & Empirical Verification Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/50 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8]">
              <Award size={18} />
            </div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Developer Achievement System
            </h2>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Deterministic milestones verified against public commit history, stack diversity, and code audits.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-white/40 dark:border-white/10">
            <span className="text-xs font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
              {unlockedCount} / {achievements.length}
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Badges Unlocked ({completionPercent}%)
            </span>
            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-[#6366F1] transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'glass-pill text-[#111827] dark:text-[#F8FAFC] shadow-xs'
                : 'text-[#64748B] dark:text-[#8B949E] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
            }`}
          >
            All Badges ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'glass-pill text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-[#64748B] dark:text-[#8B949E] hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'in_progress'
                ? 'glass-pill text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-[#64748B] dark:text-[#8B949E] hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#94A3B8] dark:text-[#64748B]">
          Audited for @{profile.username}
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((b) => {
          const Icon = badgeIcons[b.icon] || Award;

          return (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                b.unlocked
                  ? 'glass-panel border-emerald-300/80 dark:border-emerald-700/60 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500'
                  : 'glass-panel opacity-85 border-slate-200 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-600/60'
              }`}
            >
              <div>
                {/* Top Row: Icon + Category + Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      b.unlocked
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] dark:text-[#64748B]">
                      {b.category}
                    </span>

                    {b.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={11} className="text-emerald-500" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/80">
                        <Lock size={10} className="text-amber-500" />
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Title & Description */}
                <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC] mb-1">
                  {b.title}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                  {b.description}
                </p>
              </div>

              {/* Progress Bar & Evidence Box */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]/60 dark:border-[#1E293B]/60">
                {/* Metric Counter */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#64748B] dark:text-[#8B949E]">Requirement:</span>
                  <span
                    className={`font-semibold ${
                      b.unlocked
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {b.currentValue} / {b.targetValue} {b.unit} ({b.progress}%)
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      b.unlocked
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, b.progress))}%` }}
                  />
                </div>

                {/* Verifiable Proof Callout */}
                <div
                  className={`mt-2.5 p-2 rounded-lg text-[11px] font-mono flex items-start gap-1.5 leading-snug ${
                    b.unlocked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40'
                      : 'bg-slate-100/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {b.unlocked ? (
                    <ShieldCheck size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span>{b.evidence}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

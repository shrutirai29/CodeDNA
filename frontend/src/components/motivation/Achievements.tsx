import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Award, Flame, Layers, GitPullRequest, Cpu, Zap, Rocket, CheckCircle2 } from 'lucide-react';

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
  const achievements = profile.achievements;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Developer Achievement System
          </h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} Badges Unlocked
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((b) => {
          const Icon = badgeIcons[b.icon] || Award;

          return (
            <div
              key={b.id}
              className={`p-4 rounded-xl border transition-all ${
                b.unlocked
                  ? 'bg-[#F7F9FC] dark:bg-[#070A0F] border-[#E2E8F0] dark:border-[#1E293B] hover:border-indigo-500/40'
                  : 'bg-gray-50/50 dark:bg-gray-900/20 border-dashed border-gray-300 dark:border-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>

                {b.unlocked ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={10} />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {b.progress}%
                  </span>
                )}
              </div>

              <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC] mb-1">
                {b.title}
              </h3>

              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { CheckCircle2, GitCommit, Flame, Users, BookOpen, ExternalLink } from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  const { profile } = useDeveloperStore();

  // Generate 52 weeks of mock contribution activity cells
  const contributionWeeks = Array.from({ length: 30 }, (_, w) => 
    Array.from({ length: 7 }, (_, d) => {
      const rand = Math.sin(w * 0.7 + d) * 0.5 + 0.5;
      if (rand > 0.8) return 4;
      if (rand > 0.5) return 3;
      if (rand > 0.25) return 2;
      if (rand > 0.1) return 1;
      return 0;
    })
  );

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 4: return 'bg-[#6366F1] dark:bg-[#818CF8]';
      case 3: return 'bg-indigo-400 dark:bg-indigo-600';
      case 2: return 'bg-indigo-200 dark:bg-indigo-900';
      case 1: return 'bg-indigo-100 dark:bg-indigo-950';
      default: return 'bg-[#EEF2F7] dark:bg-[#161B22]';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs relative overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
        {/* Left: Avatar, Bio, Badges, Stats */}
        <div className="xl:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-md"
            />
            <span
              className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-mono text-[9px] font-bold shadow-xs flex items-center gap-0.5"
              title="Verified Analysis"
            >
              <CheckCircle2 size={10} />
              ANALYZED ✓
            </span>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
                {profile.name}
              </h1>
              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-1 font-medium"
              >
                @{profile.username}
                <ExternalLink size={11} />
              </a>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-semibold text-[#6366F1] dark:text-[#818CF8]">
                {profile.tier}
              </span>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-xl">
              {profile.bio}
            </p>

            {/* Skill / Role Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F1F5F9] dark:bg-[#161B22] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Micro Statistics */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <BookOpen size={13} className="text-[#6366F1]" />
                <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.stats.repositories}</strong> Repositories
              </span>
              <span className="flex items-center gap-1">
                <GitCommit size={13} className="text-emerald-500" />
                <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.stats.contributions}</strong> Contributions
              </span>
              <span className="flex items-center gap-1">
                <Flame size={13} className="text-amber-500" />
                <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.stats.week_streak}</strong> Week Streak
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} className="text-indigo-400" />
                <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.stats.followers}</strong> Followers
              </span>
            </div>
          </div>
        </div>

        {/* Right: GitHub Contribution Activity Heatmap */}
        <div className="xl:col-span-5 p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
            <span className="font-semibold uppercase tracking-wider">GitHub Contribution Rhythm</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{profile.stats.contributions} Year Commits</span>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto pb-1">
            <div className="inline-grid grid-flow-col grid-rows-7 gap-1">
              {contributionWeeks.map((week, wi) =>
                week.map((val, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`w-2.5 h-2.5 rounded-xs ${getHeatmapColor(val)} transition-all hover:scale-125`}
                    title={`Day activity level: ${val}/4`}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>Less Active</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-[#EEF2F7] dark:bg-[#161B22]" />
              <span className="w-2 h-2 rounded-xs bg-indigo-100 dark:bg-indigo-950" />
              <span className="w-2 h-2 rounded-xs bg-indigo-200 dark:bg-indigo-900" />
              <span className="w-2 h-2 rounded-xs bg-indigo-400 dark:bg-indigo-600" />
              <span className="w-2 h-2 rounded-xs bg-[#6366F1] dark:bg-[#818CF8]" />
            </div>
            <span>Peak Velocity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

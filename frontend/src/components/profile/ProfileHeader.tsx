import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { CheckCircle2, GitCommit, Flame, Users, BookOpen, ExternalLink } from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  const { profile } = useDeveloperStore();

  // Authentic 30 weeks of GitHub contribution activity cells
  const contributionWeeks = (profile.contributionWeeks && profile.contributionWeeks.length > 0)
    ? profile.contributionWeeks.slice(-30)
    : Array.from({ length: 30 }, () => Array(7).fill(0));

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 4: return 'bg-[#312E81] dark:bg-[#E0E7FF] shadow-xs';
      case 3: return 'bg-[#6366F1] dark:bg-[#A855F7]';
      case 2: return 'bg-[#818CF8] dark:bg-[#6366F1]';
      case 1: return 'bg-[#38BDF8] dark:bg-[#0284C7] ring-1 ring-sky-300/40 dark:ring-sky-500/30';
      default: return 'bg-[#E2E8F0] dark:bg-[#1E293B]/80';
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
                    title={val > 0 ? `Activity level: ${val}/4 (${val === 1 ? '1-2' : val === 2 ? '3-5' : val === 3 ? '6-9' : '10+'} commits)` : 'No commits recorded'}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] pt-0.5">
            <span>Less Active</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#E2E8F0] dark:bg-[#1E293B]/80" title="0 Commits" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8] dark:bg-[#0284C7]" title="1-2 Commits (Low)" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#818CF8] dark:bg-[#6366F1]" title="3-5 Commits (Medium)" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6366F1] dark:bg-[#A855F7]" title="6-9 Commits (High)" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#312E81] dark:bg-[#E0E7FF]" title="10+ Commits (Peak)" />
            </div>
            <span>Peak Velocity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

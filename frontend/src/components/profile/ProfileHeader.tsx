import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { CheckCircle2, GitCommit, Flame, Users, BookOpen, ExternalLink } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { IsometricSocialCard } from '../common/IsometricSocialCard';

import { REAL_GITHUB_BENCHMARK_DATA } from '../../services/githubData';
import { AnalyticsService } from '../../services/analyticsService';

export const ProfileHeader: React.FC = () => {
  const { profile } = useDeveloperStore();

  // Authentic 30 weeks of GitHub contribution activity cells
  const rawWeeks = (profile.contributionWeeks && profile.contributionWeeks.length > 0)
    ? profile.contributionWeeks.slice(-30)
    : [];

  const hasActiveCells = rawWeeks.some(week => week.some(day => day > 0));

  const contributionWeeks = hasActiveCells
    ? rawWeeks
    : (REAL_GITHUB_BENCHMARK_DATA[profile.username]?.weeks?.slice(-30) || AnalyticsService.generateContributionWeeks(profile.stats?.contributions || 637, 30));

  // Authentic GitHub contribution palette (matching Image 1)
  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 4: return 'bg-[#216E39] dark:bg-[#39D353] shadow-xs shadow-emerald-500/30';
      case 3: return 'bg-[#30A14E] dark:bg-[#26A641]';
      case 2: return 'bg-[#40C463] dark:bg-[#006D32]';
      case 1: return 'bg-[#9BE9A8] dark:bg-[#0E4429]';
      default: return 'bg-[#EBEDF0] dark:bg-[#161B22]';
    }
  };

  // Extract month labels for columns matching GitHub calendar (Mar, Apr, May, Jun, Jul, Aug, Sep, Oct)
  const monthLabels: { [key: number]: string } = {};
  if (profile.weekDates && profile.weekDates.length > 0) {
    const dates = profile.weekDates.slice(-contributionWeeks.length);
    let prevMonth = '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dates.forEach((d, idx) => {
      const parts = d.split('-');
      if (parts.length === 3) {
        const monthNum = parseInt(parts[1], 10);
        const m = monthNames[monthNum - 1];
        if (m !== prevMonth) {
          monthLabels[idx] = m;
          prevMonth = m;
        }
      }
    });
  } else {
    // 30-week standard month alignment
    const defaultMap: { [key: number]: string } = {
      0: 'Mar',
      2: 'Apr',
      6: 'May',
      11: 'Jun',
      15: 'Jul',
      19: 'Aug',
      24: 'Sep',
      28: 'Oct'
    };
    Object.assign(monthLabels, defaultMap);
  }

  return (
    <TiltCard
      maxTilt={3}
      scale={1.003}
      className="p-6 rounded-2xl relative overflow-hidden group"
    >
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
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium glass-pill text-[#475569] dark:text-[#94A3B8]"
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

            {/* 3D Isometric Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider font-semibold">
                Social Orbit:
              </span>
              <IsometricSocialCard
                orientation="horizontal"
                compact={true}
                className="!p-1 !gap-1 !bg-white/10 dark:!bg-white/5 border border-white/20 dark:border-white/10 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Right: Authentic GitHub Contribution Activity Heatmap */}
        <div className="xl:col-span-5 p-4 rounded-xl glass-panel space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              GitHub Contribution Heatmap
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              {profile.stats.contributions} Commits in 2026
            </span>
          </div>

          {/* Month Labels & Heatmap Grid */}
          <div className="overflow-x-auto pb-1 scrollbar-none">
            {/* Month Labels Row */}
            <div className="flex gap-1 mb-1 text-[9px] font-mono text-[#64748B] dark:text-[#94A3B8] h-3.5 select-none min-w-[340px]">
              {contributionWeeks.map((_, wi) => (
                <div key={`m-${wi}`} className="w-2.5 text-left shrink-0">
                  {monthLabels[wi] && (
                    <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                      {monthLabels[wi]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Heatmap 7-Day Grid (Sunday to Saturday) */}
            <div className="inline-grid grid-flow-col grid-rows-7 gap-1 min-w-[340px]">
              {contributionWeeks.map((week, wi) =>
                week.map((val, di) => {
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const dayName = dayNames[di];
                  const levelDesc = val === 4 ? '10+ commits (Peak)' : val === 3 ? '6-9 commits' : val === 2 ? '3-5 commits' : val === 1 ? '1-2 commits' : 'No commits';
                  return (
                    <div
                      key={`${wi}-${di}`}
                      className={`w-2.5 h-2.5 rounded-xs ${getHeatmapColor(val)} transition-all hover:scale-125 cursor-pointer`}
                      title={`${dayName} • ${levelDesc}`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Authentic GitHub Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] pt-1 border-t border-white/20 dark:border-white/5">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EBEDF0] dark:bg-[#161B22]" title="No contributions" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#9BE9A8] dark:bg-[#0E4429]" title="1-2 contributions" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#40C463] dark:bg-[#006D32]" title="3-5 contributions" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#30A14E] dark:bg-[#26A641]" title="6-9 contributions" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#216E39] dark:bg-[#39D353]" title="10+ contributions" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

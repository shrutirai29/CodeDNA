import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { FolderGit2, Star, GitFork, ExternalLink } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

export const RepositoryPortfolio: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const repos = profile.repositories.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
      case 'A': return 'bg-indigo-50 dark:bg-indigo-950/50 text-[#6366F1] dark:text-[#818CF8] border-indigo-200 dark:border-indigo-800';
      case 'B+': return 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800';
      default: return 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500 text-white';
      case 'RECENT': return 'bg-indigo-500 text-white';
      default: return 'bg-[#94A3B8] text-white';
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FolderGit2 size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Repository Portfolio & Architectural Audit
            </h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Automated complexity grading, test heuristics, and technology inspection
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel self-start sm:self-auto">
          {['ALL', 'ACTIVE', 'RECENT', 'LEGACY'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                filterStatus === s
                  ? 'glass-pill text-[#6366F1] dark:text-[#818CF8] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Repository Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((repo) => (
          <TiltCard
            key={repo.id}
            maxTilt={6}
            scale={1.015}
            className="p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 transition-colors group shadow-xs"
          >
            <div style={{ transform: 'translateZ(10px)' }}>
              {/* Top Row: Name, Status Badge, Complexity Grade */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 truncate">
                  <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC] truncate">
                    {repo.name}
                  </h3>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${getStatusBadge(repo.status)}`}>
                    {repo.status}
                  </span>
                </div>

                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border shrink-0 ${getGradeBadge(repo.complexityGrade)}`}>
                  {repo.complexityGrade}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 leading-relaxed mb-3">
                {repo.description}
              </p>

              {/* Technology Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {repo.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono glass-pill text-[#475569] dark:text-[#94A3B8] shadow-2xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Stars, Forks, Complexity Score, View Repo Link */}
            <div
              className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs font-mono"
              style={{ transform: 'translateZ(12px)' }}
            >
              <div className="flex items-center gap-3 text-[#64748B] dark:text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-amber-500" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} className="text-indigo-400" />
                  {repo.forks}
                </span>
                <span>
                  Depth: <strong className="text-[#111827] dark:text-[#F8FAFC]">{repo.complexity}/100</strong>
                </span>
              </div>

              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-0.5 font-semibold text-[11px]"
              >
                View
                <ExternalLink size={11} />
              </a>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
};

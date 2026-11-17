import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText,
  Scale,
  Activity
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { RetroTv404 } from '../common/RetroTv404';

export const RepositoryPortfolio: React.FC = () => {
  const { profile, reviewRepository } = useDeveloperStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const allRepos = profile.repositories || [];
  const repos = allRepos.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  // Feature C: Automated Portfolio Health Audit Calculations
  const totalRepos = Math.max(1, allRepos.length);
  const reposWithReadme = allRepos.filter(r => r.hasReadme !== false).length;
  const reposWithLicense = allRepos.filter(r => r.hasLicense).length;
  const activeRepos = allRepos.filter(r => r.status === 'ACTIVE').length;

  const readmePct = Math.round((reposWithReadme / totalRepos) * 100);
  const licensePct = Math.round((reposWithLicense / totalRepos) * 100);
  const activePct = Math.round((activeRepos / totalRepos) * 100);
  const overallHealth = Math.min(99, Math.round(readmePct * 0.35 + licensePct * 0.30 + activePct * 0.35));

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
              Automated complexity grading, static health indicators, and AI copilot code reviews
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

      {/* Feature C: Repository Health Auditor Executive Panel */}
      <div className="p-4 rounded-xl glass-panel border border-indigo-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Portfolio Health</span>
            <span className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">{overallHealth}/100</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Documentation</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{readmePct}% README</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Scale size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Open Source License</span>
            <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">{licensePct}% Licensed</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Active Cadence</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400">{activePct}% Active</span>
          </div>
        </div>
      </div>

      {/* Grid of Repository Cards or 404 TV Empty State */}
      {repos.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
          <div className="scale-75 -my-14">
            <RetroTv404 displayText="NO REPOS" code="404" />
          </div>
          <div className="space-y-1 relative z-10 pt-4">
            <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
              No {filterStatus} repositories found
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              No repositories match the current filter selection.
            </p>
          </div>
          <button
            onClick={() => setFilterStatus('ALL')}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] flex items-center gap-1.5 cursor-pointer relative z-10 shadow-md shadow-indigo-500/20"
          >
            <RotateCcw size={13} />
            SHOW ALL REPOSITORIES
          </button>
        </div>
      ) : (
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
                    <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC] truncate" title={repo.name}>
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

                {/* Technology Badges & Health Signals */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {repo.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono glass-pill text-[#475569] dark:text-[#94A3B8] shadow-2xs"
                    >
                      {t}
                    </span>
                  ))}
                  {repo.licenseName && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                      {repo.licenseName}
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-slate-500 mb-3 flex items-center gap-2">
                  <span>Pushed: <strong>{repo.lastUpdated}</strong></span>
                  {repo.hasReadme !== false && <span className="text-emerald-500">✓ README</span>}
                </div>
              </div>

              {/* Bottom Row: Stars, Forks, Complexity Score, AI Review, External Link */}
              <div
                className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs font-mono gap-2"
                style={{ transform: 'translateZ(12px)' }}
              >
                <div className="flex items-center gap-2.5 text-[#64748B] dark:text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} className="text-indigo-400" />
                    {repo.forks}
                  </span>
                  <span>
                    Depth: <strong className="text-[#111827] dark:text-[#F8FAFC]">{repo.complexity}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Feature E: AI Repository Review Action */}
                  <button
                    type="button"
                    onClick={() => reviewRepository(repo.name)}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] hover:bg-[#6366F1] hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                    title="Audit this repository with AI Copilot"
                  >
                    <Sparkles size={11} />
                    <span>AI Review</span>
                  </button>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-0.5 font-semibold text-[11px]"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
};

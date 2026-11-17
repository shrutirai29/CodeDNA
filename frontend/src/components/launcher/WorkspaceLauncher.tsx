import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  UserCheck,
  Sparkles,
  Layers,
  FileText,
  MailCheck,
  Search,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const WorkspaceLauncher: React.FC = () => {
  const {
    setCurrentView,
    searchDeveloper,
    isSearching,
    setAnalyzerTab
  } = useDeveloperStore();

  const [inputUsername, setInputUsername] = useState('');
  const [errorText, setErrorText] = useState('');

  const quickHandles = ['shrutirai29', 'torvalds', 'gaearon', 'karpathy', 'sindresorhus'];

  const handleLaunchCodeDNA = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = inputUsername.trim() || 'shrutirai29';
    setErrorText('');
    searchDeveloper(target);
    setCurrentView('codedna');
  };

  const handleQuickSelect = (handle: string) => {
    setInputUsername(handle);
    searchDeveloper(handle);
    setCurrentView('codedna');
  };

  const handleLaunchCareerAnalyzer = (tab: 'match' | 'email' | 'builder' | 'catalog') => {
    setAnalyzerTab(tab);
    setCurrentView('analyzer');
  };

  const handleLaunchWorkspace = () => {
    setCurrentView('workspace');
  };

  return (
    <div className="min-h-screen w-full relative px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto flex flex-col justify-center selection:bg-indigo-500 selection:text-white">
      {/* Top Back Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] glass-pill transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Workspace Router</span>
        </div>
      </div>

      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-indigo-600 dark:text-indigo-400 glass-pill mb-4 border border-indigo-200/50 dark:border-indigo-800/40">
          <Sparkles size={13} className="text-cyan-500" />
          <span>Choose Your Intelligence Track</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#111827] dark:text-[#F8FAFC]">
          What would you like to explore today?
        </h1>
        <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
          Analyze GitHub engineering footprints, evaluate resume compatibility with target jobs, or access your saved workspace.
        </p>
      </div>

      {/* Three Primary Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Track 1: CodeDNA Developer Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between border border-white/60 dark:border-white/10 hover:border-indigo-500/40 transition-all shadow-md group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <GithubIcon size={24} />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-2 border border-indigo-200/60 dark:border-indigo-800/60">
              Track 01 • Engineering Footprint
            </div>

            <h2 className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
              GitHub Intelligence
            </h2>

            <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Scan any public GitHub profile for multidimensional scoring, interactive 3D skill galaxy, repository health, and empirical growth analytics.
            </p>

            {/* Input Form */}
            <form onSubmit={handleLaunchCodeDNA} className="mt-6 space-y-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-[#94A3B8] pointer-events-none" />
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => {
                    setInputUsername(e.target.value);
                    if (errorText) setErrorText('');
                  }}
                  placeholder="e.g. torvalds or your username"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-indigo-500/40 outline-none"
                />
              </div>

              {errorText && (
                <div className="text-[11px] font-mono text-rose-500">{errorText}</div>
              )}

              {/* Quick Handle Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-[#94A3B8]">Demos:</span>
                {quickHandles.map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onClick={() => handleQuickSelect(handle)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] hover:text-indigo-600 dark:hover:text-indigo-400 glass-pill hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
                  >
                    @{handle}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-white/40 dark:border-white/10">
            <button
              onClick={handleLaunchCodeDNA}
              disabled={isSearching}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSearching ? 'Ingesting Profile…' : 'Scan GitHub Profile'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Track 2: Career & Resume Matcher */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between border border-white/60 dark:border-white/10 hover:border-purple-500/40 transition-all shadow-md group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Briefcase size={24} />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 mb-2 border border-purple-200/60 dark:border-purple-800/60">
              Track 02 • SkillBridge Suite
            </div>

            <h2 className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
              Career & Resume Fit
            </h2>

            <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Benchmark your resume against target job descriptions with transparent ATS scoring, identify missing technical skills, inspect rejection emails, and generate clean ATS-ready resumes.
            </p>

            {/* Quick Action Badges */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleLaunchCareerAnalyzer('match')}
                className="w-full text-left p-2.5 rounded-xl glass-pill hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-purple-500" />
                  <span className="text-xs font-mono font-medium text-[#111827] dark:text-[#F8FAFC]">
                    Resume-to-Job Matcher
                  </span>
                </div>
                <ArrowRight size={13} className="text-[#94A3B8] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleLaunchCareerAnalyzer('email')}
                className="w-full text-left p-2.5 rounded-xl glass-pill hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2">
                  <MailCheck size={15} className="text-purple-500" />
                  <span className="text-xs font-mono font-medium text-[#111827] dark:text-[#F8FAFC]">
                    Rejection Email Insights
                  </span>
                </div>
                <ArrowRight size={13} className="text-[#94A3B8] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleLaunchCareerAnalyzer('builder')}
                className="w-full text-left p-2.5 rounded-xl glass-pill hover:border-purple-300 dark:hover:border-purple-700 transition-all flex items-center justify-between cursor-pointer group/btn"
              >
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-purple-500" />
                  <span className="text-xs font-mono font-medium text-[#111827] dark:text-[#F8FAFC]">
                    Structured Resume Builder
                  </span>
                </div>
                <ArrowRight size={13} className="text-[#94A3B8] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/40 dark:border-white/10">
            <button
              onClick={() => handleLaunchCareerAnalyzer('match')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-sm shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Career Analyzer</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Track 3: Personal Workspace */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between border border-white/60 dark:border-white/10 hover:border-cyan-500/40 transition-all shadow-md group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <UserCheck size={24} />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 mb-2 border border-cyan-200/60 dark:border-cyan-800/60">
              Track 03 • Personal Hub
            </div>

            <h2 className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
              My Workspace
            </h2>

            <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Your personalized command center. Maintain target career roles, track saved courses, view prior ATS match history, and maintain your personal progress checklist.
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Isolated profile & career targets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Saved courses & learning bookmarks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Historical ATS scans & match logs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Instant guest mode (no login mandatory)</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/40 dark:border-white/10">
            <button
              onClick={handleLaunchWorkspace}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-sm shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open My Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-2">
        <TrendingUp size={14} className="text-indigo-500" />
        <span>All data processing is read-only and respects GitHub public rate limits.</span>
      </div>
    </div>
  );
};

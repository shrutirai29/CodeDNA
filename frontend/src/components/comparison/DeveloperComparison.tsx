import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { BENCHMARK_PROFILES } from '../../services/githubService';
import { GitCompare, Sparkles, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeveloperComparison: React.FC = () => {
  const { profile, comparisonProfile, setComparisonDeveloper } = useDeveloperStore();
  const [customInput, setCustomInput] = useState('');
  const [isLoadingComp, setIsLoadingComp] = useState(false);
  const [compError, setCompError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(
    Object.keys(BENCHMARK_PROFILES).includes(comparisonProfile.username)
      ? comparisonProfile.username
      : ''
  );

  const handleCustomCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customInput.trim().replace(/^@/, '');
    if (!clean) return;
    setIsLoadingComp(true);
    setCompError(null);
    try {
      await setComparisonDeveloper(clean);
      if (Object.keys(BENCHMARK_PROFILES).includes(clean.toLowerCase())) {
        setSelectedPreset(clean.toLowerCase());
      } else {
        setSelectedPreset('');
      }
      setCustomInput('');
    } catch {
      setCompError(`GitHub user @${clean} not found`);
    } finally {
      setIsLoadingComp(false);
    }
  };

  const handlePresetSelect = async (uname: string) => {
    setSelectedPreset(uname);
    setCompError(null);
    setIsLoadingComp(true);
    try {
      await setComparisonDeveloper(uname);
    } catch {
      setCompError(`Could not load @${uname}`);
    } finally {
      setIsLoadingComp(false);
    }
  };

  const devA = profile;
  const devB = comparisonProfile;

  const metrics = [
    { label: 'Overall Developer Score', a: devA.developer_score, b: devB.developer_score },
    { label: 'Technical Depth', a: devA.dimensions.technical_depth, b: devB.dimensions.technical_depth },
    { label: 'Technical Breadth', a: devA.dimensions.technical_breadth, b: devB.dimensions.technical_breadth },
    { label: 'Consistency & Habit', a: devA.dimensions.consistency, b: devB.dimensions.consistency },
    { label: 'Project Complexity', a: devA.dimensions.project_complexity, b: devB.dimensions.project_complexity },
    { label: 'Collaboration & PRs', a: devA.dimensions.collaboration, b: devB.dimensions.collaboration },
    { label: 'Technology Adaptability', a: devA.dimensions.adaptability, b: devB.dimensions.adaptability },
    { label: 'Project Impact', a: devA.dimensions.impact, b: devB.dimensions.impact },
  ];

  const setB = new Set(devB.tech_dna.map(t => t.name.toLowerCase()));
  const commonTech = devA.tech_dna.filter(t => setB.has(t.name.toLowerCase()));

  return (
    <div className="glass-card p-6 rounded-2xl space-y-6">
      {/* Top Header & Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GitCompare size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Peer Developer Comparison & Benchmark
            </h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Friendly peer intelligence analyzing stack advantages and growth opportunities
            </p>
          </div>
        </div>

        {/* Developer B Custom Username Input + Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8] font-medium whitespace-nowrap">
            Compare against:
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Custom GitHub Username Search Input */}
            <form onSubmit={handleCustomCompareSubmit} className="flex items-center gap-1.5">
              <div className="flex items-center h-8 px-2.5 rounded-xl glass-input gap-1.5 focus-within:ring-2 focus-within:ring-[#6366F1]/40 transition-all">
                <span className="text-xs font-mono text-[#94A3B8] select-none">@</span>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    if (compError) setCompError(null);
                  }}
                  placeholder="Enter any username…"
                  className="w-36 sm:w-44 bg-transparent border-0 outline-none text-xs font-mono font-semibold text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoadingComp || !customInput.trim()}
                className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] disabled:opacity-40 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed shrink-0"
                title="Fetch & compare with this GitHub user"
              >
                {isLoadingComp ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Search size={13} />
                )}
                <span>Compare</span>
              </button>
            </form>

            {/* Quick Benchmark Presets Dropdown */}
            <div className="relative">
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="h-8 px-2.5 rounded-xl glass-input text-xs font-mono font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] focus:outline-none cursor-pointer"
                title="Or pick a benchmark preset"
              >
                <option value="" disabled className="bg-white dark:bg-[#0D1117] text-[#94A3B8]">
                  Presets…
                </option>
                {Object.keys(BENCHMARK_PROFILES).map((u) => (
                  <option key={u} value={u} className="bg-white dark:bg-[#0D1117] text-[#111827] dark:text-[#F8FAFC]">
                    @{u} ({BENCHMARK_PROFILES[u].name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback error badge if username not found */}
          {compError && (
            <span className="text-[11px] font-mono text-rose-500 font-semibold animate-in fade-in">
              {compError}
            </span>
          )}
        </div>
      </div>

      {/* Split-Screen Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Developer A (You) */}
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={devA.avatar_url}
              alt={devA.name}
              className="w-12 h-12 rounded-xl object-cover border border-indigo-400"
            />
            <div>
              <span className="text-[10px] font-mono text-[#6366F1] dark:text-[#818CF8] font-bold block">
                DEVELOPER A (YOU)
              </span>
              <h3 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">{devA.name}</h3>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">@{devA.username}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold font-mono text-[#6366F1] dark:text-[#818CF8]">
              {devA.developer_score}
            </span>
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] block">{devA.tier}</span>
          </div>
        </div>

        {/* Developer B */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={devB.avatar_url}
              alt={devB.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E293B]"
            />
            <div>
              <span className="text-[10px] font-mono text-[#94A3B8] font-bold block">
                DEVELOPER B (PEER BENCHMARK)
              </span>
              <h3 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">{devB.name}</h3>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">@{devB.username}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC]">
              {devB.developer_score}
            </span>
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] block">{devB.tier}</span>
          </div>
        </div>
      </div>

      {/* Advantage & Opportunity Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-emerald-300/60 dark:border-emerald-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="text-xs font-mono">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
              YOUR PRIMARY ADVANTAGE
            </span>
            <strong className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
              Technology Variety & Full-Stack Agility
            </strong>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
              You maintain wider cross-stack agility spanning modern web interfaces and APIs.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-indigo-300/60 dark:border-indigo-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1] text-white flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="text-xs font-mono">
            <span className="text-[10px] font-bold text-[#6366F1] dark:text-[#818CF8] block uppercase">
              GROWTH OPPORTUNITY
            </span>
            <strong className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
              Low-Level Systems Depth & Concurrency
            </strong>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] mt-0.5">
              Deepening C/Rust low-level systems programming will bring parity with Systems Specialists.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dimension Metrics Bars */}
      <div className="space-y-3 font-mono text-xs">
        {metrics.map((m) => {
          const isLeadA = m.a >= m.b;
          return (
            <div
              key={m.label}
              className="p-3 rounded-xl glass-panel space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">{m.label}</span>
                <div className="flex items-center gap-6 font-bold">
                  <span className={isLeadA ? 'text-[#6366F1] dark:text-[#818CF8]' : 'text-[#64748B] dark:text-[#94A3B8]'}>
                    {devA.name.split(' ')[0]}: {m.a}
                  </span>
                  <span className={!isLeadA ? 'text-cyan-600 dark:text-cyan-400' : 'text-[#64748B] dark:text-[#94A3B8]'}>
                    {devB.name.split(' ')[0]}: {m.b}
                  </span>
                </div>
              </div>

              {/* Comparative Dual Progress Bars */}
              <div className="grid grid-cols-2 gap-2 h-2">
                <div className="bg-[#EEF2F7] dark:bg-[#1E293B] rounded-full overflow-hidden flex justify-end">
                  <motion.div
                    className="bg-[#6366F1] h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.a}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="bg-[#EEF2F7] dark:bg-[#1E293B] rounded-full overflow-hidden">
                  <motion.div
                    className="bg-[#06B6D4] h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.b}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Technology Overlap */}
      <div className="p-4 rounded-xl glass-panel text-xs font-mono space-y-2">
        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
          Shared Technology Overlap ({commonTech.length} Shared Stacks):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {commonTech.map((t) => (
            <span
              key={t.id}
              className="px-2.5 py-1 rounded-lg glass-pill font-semibold text-[#6366F1] dark:text-[#818CF8]"
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

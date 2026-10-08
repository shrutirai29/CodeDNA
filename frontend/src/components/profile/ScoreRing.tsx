import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Award, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

export const ScoreRing: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isSurging, setIsSurging] = useState(false);

  const score = isSurging ? Math.min(99.4, Number((profile.developer_score + 4.2).toFixed(1))) : profile.developer_score;
  const radius = 68;
  const stroke = 9;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleSurge = () => {
    setIsSurging(true);
    setTimeout(() => setIsSurging(false), 2400);
  };

  return (
    <TiltCard
      maxTilt={6}
      scale={1.01}
      className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative group"
    >
      {/* 3D Cyber Ambient Light */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-purple-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10" style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8]">
            <Award size={16} />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Developer Intelligence Score
            </h2>
            <p className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
              Quantum Heuristic Core v2.4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSurge}
            disabled={isSurging}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 border ${
              isSurging
                ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                : 'bg-[#F1F5F9] dark:bg-[#161B22] text-[#475569] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#1E293B] hover:text-[#6366F1] hover:border-indigo-400'
            }`}
            title="Simulate Real-time Quantum Verification Surge"
          >
            <Zap size={11} className={isSurging ? 'text-white' : 'text-amber-500'} />
            {isSurging ? 'SURGING' : 'SURGE XP'}
          </button>

          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <TrendingUp size={12} />
            +{profile.score_change}
          </span>
        </div>
      </div>

      {/* Main 3D Quantum Gyroscope Arc Reactor Display */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-8 my-2 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative w-40 h-40 flex items-center justify-center shrink-0 cursor-pointer select-none"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Outer Rotating Cyber Ticks Orbit */}
          <div className="absolute inset-0 rounded-full border border-dashed border-indigo-400/30 dark:border-indigo-500/25 animate-[spin_24s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-dotted border-cyan-400/20 dark:border-cyan-500/20 animate-[spin_16s_linear_infinite_reverse]" />

          {/* SVG Progress Core */}
          <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] drop-shadow-sm">
            <defs>
              <linearGradient id="scoreQuantumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <filter id="neonScoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Inactive Track Ring */}
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="text-[#EEF2F7] dark:text-[#1E293B]"
            />

            {/* Glowing Active Ring */}
            <motion.circle
              stroke="url(#scoreQuantumGrad)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              filter={isSurging ? 'url(#neonScoreGlow)' : undefined}
            />
          </svg>

          {/* Centered Holographic Score Display */}
          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
            style={{ transform: 'translateZ(20px)' }}
          >
            <motion.span
              key={score}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC] tracking-tight leading-none drop-shadow-xs"
            >
              {score}
            </motion.span>
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] font-bold mt-1 tracking-wider uppercase">
              RANK INDEX
            </span>
          </div>

          {/* Pulse Ripple on Surge */}
          {isSurging && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
            />
          )}
        </div>

        {/* Narrative Context & Percentile Benchmark */}
        <div className="space-y-2.5 text-center sm:text-left flex-1" style={{ transform: 'translateZ(15px)' }}>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/30 text-[#6366F1] dark:text-[#818CF8] font-mono text-xs font-bold tracking-wider uppercase shadow-2xs">
              {profile.tier}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck size={11} />
              VERIFIED
            </span>
          </div>

          <p className="text-sm font-semibold text-[#111827] dark:text-[#F8FAFC]">
            “You rank higher than <span className="text-[#6366F1] dark:text-[#818CF8] font-extrabold">{profile.percentile_rank}%</span> of developers worldwide.”
          </p>

          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Multi-dimensional neural scoring evaluating codebase architecture, technical breadth, and genuine commit rhythm.
          </p>

          {/* Mini Interactive Dimension Gauge Preview */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-1.5 rounded-lg bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] block">DEPTH</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{profile.dimensions.technical_depth}</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] block">BREADTH</span>
              <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{profile.dimensions.technical_breadth}</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B]">
              <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] block">RHYTHM</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{profile.dimensions.consistency}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Insight Pill */}
      <div
        className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8] relative z-10"
        style={{ transform: 'translateZ(10px)' }}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500 animate-spin-slow" />
          Percentile Tier:
        </span>
        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
          Top {Math.max(1, 100 - profile.percentile_rank)}% Global Peer Group
        </span>
      </div>

      {/* Hover Floating Details Glass Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-14 right-6 p-3 rounded-xl bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md border border-indigo-500/30 shadow-xl text-xs font-mono space-y-1.5 z-40 pointer-events-none"
          >
            <div className="font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5 pb-1 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <Zap size={12} className="text-indigo-500" />
              Quantum Score Breakdown
            </div>
            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] space-y-0.5">
              <div className="flex justify-between gap-4"><span>Algorithmic Depth:</span> <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.dimensions.technical_depth}/100</strong></div>
              <div className="flex justify-between gap-4"><span>Stack Variety:</span> <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.dimensions.technical_breadth}/100</strong></div>
              <div className="flex justify-between gap-4"><span>Commit Rhythm:</span> <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.dimensions.consistency}/100</strong></div>
              <div className="flex justify-between gap-4"><span>Project Scope:</span> <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.dimensions.project_complexity}/100</strong></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  );
};

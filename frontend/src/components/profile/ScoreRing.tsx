import React from 'react';
import { motion } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { TrendingUp, Award, Sparkles } from 'lucide-react';

export const ScoreRing: React.FC = () => {
  const { profile } = useDeveloperStore();

  const score = profile.developer_score;
  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Developer Intelligence Score
          </h2>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <TrendingUp size={12} />
          +{profile.score_change} vs last audit
        </span>
      </div>

      {/* Main Circular Score Display */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-8 my-2">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
            {/* Background Ring */}
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="text-[#EEF2F7] dark:text-[#1E293B]"
            />
            {/* Animated Gradient Progress Ring */}
            <motion.circle
              stroke="url(#scoreGradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC] tracking-tight leading-none">
              {score}
            </span>
            <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] font-semibold mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Breakdown & Context */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-block px-2.5 py-1 rounded-md bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 text-[#6366F1] dark:text-[#818CF8] font-mono text-xs font-bold tracking-wider uppercase">
            {profile.tier}
          </div>

          <p className="text-sm font-semibold text-[#111827] dark:text-[#F8FAFC]">
            “You rank higher than <span className="text-[#6366F1] dark:text-[#818CF8] font-bold">{profile.percentile_rank}%</span> of developers worldwide.”
          </p>

          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Calculated across six empirical dimensions using anti-burstiness weighting and GitHub codebase inspection.
          </p>
        </div>
      </div>

      {/* Footer Insight Pill */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          Percentile Tier:
        </span>
        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
          Top {100 - profile.percentile_rank}% Global Peer Group
        </span>
      </div>
    </div>
  );
};

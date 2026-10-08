import React from 'react';
import { motion } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Briefcase, Check, AlertCircle } from 'lucide-react';

export const CareerMatch: React.FC = () => {
  const { profile } = useDeveloperStore();
  const careers = profile.careers;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Career Match Intelligence (7 Roles)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
          Ranked by empirical codebase alignment
        </span>
      </div>

      {/* Role list with horizontal animated progress bars */}
      <div className="space-y-4">
        {careers.map((role, idx) => (
          <div
            key={role.role}
            className="p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2.5 transition-all hover:border-indigo-500/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#94A3B8]">
                  0{idx + 1}
                </span>
                <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {role.role.toUpperCase()}
                </h3>
              </div>

              <span className="font-mono text-sm font-bold text-[#6366F1] dark:text-[#818CF8]">
                {role.fit}% Fit
              </span>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full bg-[#EEF2F7] dark:bg-[#1E293B] h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${role.fit}%` }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
              />
            </div>

            {/* Strengths & Missing Gaps */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
              {/* Strengths */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Check size={11} /> Strengths:
                </span>
                {role.strengths.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#1E293B] text-[10px] text-[#475569] dark:text-[#94A3B8]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Gaps */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                  <AlertCircle size={11} /> Missing Gaps:
                </span>
                {role.gaps.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 rounded-md bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-[10px] text-amber-700 dark:text-amber-400"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

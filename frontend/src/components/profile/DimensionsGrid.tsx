import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  Code,
  ShieldCheck,
  Flame,
  Layers,
  Users,
  Sparkles,
  TrendingUp,
  Calculator,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

const iconMap: { [key: string]: React.ElementType } = {
  Code,
  ShieldCheck,
  Flame,
  Layers,
  Users,
  Sparkles
};

export const DimensionsGrid: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [showFormulaInspector, setShowFormulaInspector] = useState(false);

  const dims = profile.dimensions;
  const weights = [
    { label: 'Technical Depth', key: 'technical_depth', weight: 0.20, val: dims.technical_depth },
    { label: 'Technical Breadth', key: 'technical_breadth', weight: 0.15, val: dims.technical_breadth },
    { label: 'Consistency & Habit', key: 'consistency', weight: 0.20, val: dims.consistency },
    { label: 'Project Complexity', key: 'project_complexity', weight: 0.15, val: dims.project_complexity },
    { label: 'Collaboration', key: 'collaboration', weight: 0.15, val: dims.collaboration },
    { label: 'Technology Adaptability', key: 'adaptability', weight: 0.15, val: dims.adaptability },
  ];

  const totalCalculated = Number(
    weights.reduce((sum, w) => sum + w.val * w.weight, 0).toFixed(1)
  );

  return (
    <div className="space-y-4">
      {/* Evidence-Backed Mathematical Inspector Toggle Header (Feature A) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-4 rounded-xl glass-panel">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-[#6366F1] dark:text-[#818CF8]" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Evidence-Backed 6-Dimensional Evaluation (DIS Model)
            </h3>
            <p className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
              Traceable inputs, empirical weights & reproducible calculations
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFormulaInspector(!showFormulaInspector)}
          className="px-3 py-1.5 rounded-lg glass-pill font-mono text-xs font-semibold text-[#6366F1] dark:text-[#818CF8] hover:border-[#6366F1] flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Info size={13} />
          <span>{showFormulaInspector ? 'Hide Mathematical Trace' : 'Inspect Score Formula & Proof'}</span>
          {showFormulaInspector ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expandable Mathematical Breakdown Proof Table (Feature A) */}
      <AnimatePresence>
        {showFormulaInspector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl glass-card border border-indigo-500/30 overflow-hidden space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-mono text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
                DIS Canonical Formula Specification:
              </span>
              <code className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800">
                DIS = 0.20·Depth + 0.15·Breadth + 0.20·Consistency + 0.15·Complexity + 0.15·Collab + 0.15·Adapt
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weights.map((w) => {
                const contribution = Number((w.val * w.weight).toFixed(2));
                return (
                  <div key={w.key} className="p-3 rounded-xl glass-panel space-y-1 text-xs font-mono">
                    <div className="flex justify-between items-center text-[#64748B] dark:text-[#94A3B8]">
                      <span>{w.label}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Weight: {Math.round(w.weight * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[11px] text-slate-500">
                        {w.val} × {w.weight}
                      </span>
                      <strong className="text-sm font-bold text-[#6366F1] dark:text-[#818CF8]">
                        +{contribution} pts
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span className="text-[#111827] dark:text-[#F8FAFC]">
                  Reproducible Weighted Total: <strong>{totalCalculated} / 100</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Statistical Reference Model: <strong>Top {Math.max(1, 100 - profile.percentile_rank)}%</strong> (Calibrated normal distribution &mu;=68.0, &sigma;=12.5; reference cohort model, not an empirical census of all 100M+ GitHub users)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Dimension Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.dimensionMetrics.map((metric) => {
          const IconComponent = iconMap[metric.iconName] || Code;
          const weightLabel = metric.weight ? `${Math.round(metric.weight * 100)}% weight` : undefined;

          return (
            <TiltCard
              key={metric.id}
              maxTilt={7}
              scale={1.015}
              className="p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group"
            >
              {/* Header: Icon, Name, Trend */}
              <div style={{ transform: 'translateZ(10px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50 shadow-2xs">
                      <IconComponent size={16} />
                    </div>
                    {weightLabel && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700">
                        {weightLabel}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-0.5 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                    <TrendingUp size={10} />
                    {metric.trend}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    {metric.name}
                  </h3>
                  <span className="text-2xl font-black font-mono text-[#111827] dark:text-[#F8FAFC]">
                    {metric.score}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#EEF2F7] dark:bg-[#1E293B] h-2 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="bg-gradient-to-r from-[#6366F1] via-[#818CF8] to-[#06B6D4] h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Short Explanation & Evidence Expand/Collapse */}
              <div className="pt-2 border-t border-white/40 dark:border-white/10 space-y-2" style={{ transform: 'translateZ(8px)' }}>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  “{metric.explanation}”
                </p>

                {metric.evidence && (
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Evidence: </span>
                    {metric.evidence}
                  </div>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
};

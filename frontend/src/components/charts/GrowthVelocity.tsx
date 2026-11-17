import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { TrendingUp, Calendar, CheckCircle2, History, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from '../common/TiltCard';

export const GrowthVelocity: React.FC = () => {
  const { profile } = useDeveloperStore();
  const timeline = profile.growth_timeline || [];
  const [currentTimestamp] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedYear, setSelectedYear] = useState<string>(
    timeline[timeline.length - 1]?.year || '2026'
  );

  const selectedItem = timeline.find(t => t.year === selectedYear) || timeline[timeline.length - 1];

  // Distinguish verified longitudinal score snapshots from unmeasured repository emergence milestones
  const measuredPoints = timeline.filter(t => t.hasScoreMeasurement && typeof t.score === 'number');
  const hasMultipleMeasurements = measuredPoints.length >= 2;

  const width = 580;
  const height = 180;
  const paddingX = 50;
  const paddingY = 30;

  const points = measuredPoints.map((item, i) => {
    const x = paddingX + (i / Math.max(1, measuredPoints.length - 1)) * (width - paddingX * 2);
    const scoreVal = item.score ?? 50;
    const normalizedScore = (scoreVal - 30) / 70;
    const y = height - paddingY - Math.max(0, Math.min(1, normalizedScore)) * (height - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <TiltCard
      maxTilt={5}
      scale={1.01}
      className="p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Developer Growth & Repository Emergence
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasMultipleMeasurements ? (
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 size={11} />
              {measuredPoints.length} Verified Score Snapshots
            </span>
          ) : (
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <GitBranch size={11} />
              Repository Emergence History
            </span>
          )}
        </div>
      </div>

      {/* Main Trajectory or Baseline Display */}
      {hasMultipleMeasurements ? (
        /* Interactive Longitudinal Score Trajectory connecting authenticated measurements */
        <div className="w-full overflow-x-auto my-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="velocityArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
              <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366F1" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1.0].map((step) => {
              const y = paddingY + step * (height - paddingY * 2);
              return (
                <line
                  key={step}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="text-[#F1F5F9] dark:text-[#1E293B]"
                />
              );
            })}

            {/* Area fill */}
            {areaD && <path d={areaD} fill="url(#velocityArea)" />}

            {/* Smooth trajectory line */}
            <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

            {/* Measured points */}
            {points.map((p) => {
              const isSelected = p.year === selectedYear;

              return (
                <g
                  key={p.year}
                  className="cursor-pointer group"
                  onClick={() => setSelectedYear(p.year)}
                  onMouseEnter={() => setSelectedYear(p.year)}
                >
                  <text
                    x={p.x}
                    y={height - 8}
                    textAnchor="middle"
                    className={`text-[11px] font-mono select-none ${
                      isSelected
                        ? 'fill-[#6366F1] dark:fill-[#818CF8] font-bold'
                        : 'fill-[#94A3B8] font-medium'
                    }`}
                  >
                    {p.year}
                  </text>

                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    className={`text-[10px] font-mono select-none ${
                      isSelected
                        ? 'fill-[#111827] dark:fill-[#F8FAFC] font-bold'
                        : 'fill-[#64748B] dark:fill-[#94A3B8]'
                    }`}
                  >
                    {p.score} DIS
                  </text>

                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 8 : 5}
                    fill={isSelected ? '#06B6D4' : '#FFFFFF'}
                    stroke="#6366F1"
                    strokeWidth="2.5"
                    filter={isSelected ? 'url(#pointGlow)' : undefined}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        /* Baseline Scan Card: Strictly displays verified measurement without fabricated history */
        <div className="p-4 my-2 rounded-xl glass-panel border border-indigo-200/60 dark:border-indigo-900/50 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Initial Verified DIS Baseline: {profile.developer_score} / 100
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Timestamp: {currentTimestamp}
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Initial profile ingestion baseline recorded. Rather than inventing historical scores from past dates, CodeDNA strictly records authentic score snapshots. Subsequent scans over time will connect into an authenticated longitudinal score line. Repository emergence milestones are shown below.
          </p>
        </div>
      )}

      {/* Chronological Milestone Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-b border-slate-100 dark:border-slate-800/60">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 shrink-0">Milestones:</span>
        {timeline.map((m) => {
          const isSelected = m.year === selectedYear;
          return (
            <button
              key={m.year}
              onClick={() => setSelectedYear(m.year)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{m.year}</span>
              {m.hasScoreMeasurement ? (
                <span className={`text-[9px] px-1 py-0.2 rounded ${isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'}`}>
                  {m.score}
                </span>
              ) : (
                <span className={`text-[9px] px-1 py-0.2 rounded ${isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  Repo
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Milestone Inspection Card */}
      {selectedItem && (
        <motion.div
          key={selectedItem.year}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-4 rounded-xl glass-panel text-xs font-mono space-y-2.5 shadow-2xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-[#6366F1]" />
              <strong className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
                {selectedItem.year}: {selectedItem.milestone}
              </strong>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              {selectedItem.hasScoreMeasurement ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800">
                  Measured DIS: {selectedItem.score} / 100
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <History size={10} />
                  Repository Emergence (Score Unmeasured)
                </span>
              )}
              {typeof selectedItem.complexity === 'number' && (
                <span className="text-[#06B6D4] font-semibold">
                  Complexity: <strong>{selectedItem.complexity}</strong>
                </span>
              )}
            </div>
          </div>

          <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            {selectedItem.description}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-[#94A3B8] font-semibold">Stack:</span>
            {selectedItem.technologies.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md glass-pill text-[10px] font-medium text-[#111827] dark:text-[#F8FAFC]"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </TiltCard>
  );
};

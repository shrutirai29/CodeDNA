import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const GrowthVelocity: React.FC = () => {
  const { profile } = useDeveloperStore();
  const timeline = profile.growth_timeline;
  const [selectedYear, setSelectedYear] = useState<string>(timeline[timeline.length - 1]?.year || '2026');

  const selectedItem = timeline.find(t => t.year === selectedYear) || timeline[timeline.length - 1];

  const width = 580;
  const height = 180;
  const paddingX = 50;
  const paddingY = 30;

  const points = timeline.map((item, i) => {
    const x = paddingX + (i / (timeline.length - 1)) * (width - paddingX * 2);
    const normalizedScore = (item.score - 40) / 60;
    const y = height - paddingY - normalizedScore * (height - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Growth Velocity & Career Milestones
          </h2>
        </div>
        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          2022 → 2026 Trajectory
        </span>
      </div>

      {/* Interactive Velocity SVG Line & Area */}
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
          <path d={areaD} fill="url(#velocityArea)" />

          {/* Smooth line */}
          <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Points */}
          {points.map((p) => {
            const isSelected = p.year === selectedYear;

            return (
              <g
                key={p.year}
                className="cursor-pointer group"
                onClick={() => setSelectedYear(p.year)}
                onMouseEnter={() => setSelectedYear(p.year)}
              >
                {/* Year Label */}
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

                {/* Score Pill on top */}
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
                  {p.score}
                </text>

                {/* Outer Ring */}
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

      {/* Selected Milestone Inspection Card */}
      {selectedItem && (
        <motion.div
          key={selectedItem.year}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-mono space-y-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-[#6366F1]" />
              <strong className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
                {selectedItem.year} Milestone: {selectedItem.milestone}
              </strong>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              <span>Score: <strong className="text-[#6366F1] dark:text-[#818CF8]">{selectedItem.score}</strong></span>
              <span>Complexity: <strong className="text-[#06B6D4]">{selectedItem.complexity}</strong></span>
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
                className="px-2 py-0.5 rounded-md bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#1E293B] text-[10px] font-medium text-[#111827] dark:text-[#F8FAFC]"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

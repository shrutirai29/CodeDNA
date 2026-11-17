import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Clock, Calendar, Flame, Activity } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

export const CodingRhythm: React.FC = () => {
  const { profile } = useDeveloperStore();
  const rhythm = profile.rhythm;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; val: number } | null>(null);

  const getCellColor = (val: number) => {
    switch (val) {
      case 4: return 'bg-[#312E81] dark:bg-[#E0E7FF]';
      case 3: return 'bg-[#6366F1] dark:bg-[#A855F7]';
      case 2: return 'bg-[#818CF8] dark:bg-[#6366F1]';
      case 1: return 'bg-[#38BDF8] dark:bg-[#0284C7]';
      default: return 'bg-[#E2E8F0] dark:bg-[#1E293B]/80';
    }
  };

  return (
    <TiltCard
      maxTilt={5}
      scale={1.01}
      className="p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group border border-slate-200/80 dark:border-slate-800/80 shadow-xs"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Coding Rhythm & 7 × 24 Activity Matrix
          </h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          Anti-Burstiness: High Steady Habit
        </span>
      </div>

      {/* 7x24 Matrix Grid Container */}
      <div className="w-full space-y-1.5 overflow-x-auto pb-1">
        {/* Time Marker Header (Aligned to 24 columns) */}
        <div className="flex items-center gap-2 min-w-[340px]">
          <span className="w-7 shrink-0" />
          <div
            className="flex-1 grid text-[9px] font-mono text-slate-400 dark:text-slate-500 select-none"
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
          >
            <span className="col-start-1 col-span-4 text-left">00:00</span>
            <span className="col-start-5 col-span-4 text-left">04:00</span>
            <span className="col-start-9 col-span-4 text-left">08:00</span>
            <span className="col-start-13 col-span-4 text-left">12:00</span>
            <span className="col-start-17 col-span-4 text-left">16:00</span>
            <span className="col-start-21 col-span-4 text-left">20:00</span>
          </div>
        </div>

        {/* 7 Day Rows */}
        <div className="space-y-1.5 min-w-[340px]">
          {rhythm.matrix.map((row, dayIdx) => (
            <div key={dayIdx} className="flex items-center gap-2">
              <span className="w-7 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0 select-none">
                {days[dayIdx]}
              </span>

              <div
                className="flex-1 grid gap-1"
                style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
              >
                {row.map((val, hour) => (
                  <div
                    key={hour}
                    className={`h-4.5 sm:h-5 rounded-[3px] ${getCellColor(val)} transition-all hover:scale-125 hover:ring-2 hover:ring-indigo-500 hover:z-10 cursor-pointer shadow-2xs`}
                    onMouseEnter={() => setHoveredCell({ day: days[dayIdx], hour, val })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${days[dayIdx]} at ${hour.toString().padStart(2, '0')}:00 - Activity intensity: ${val}/4`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cell Inspection Tooltip & Intensity Legend */}
        <div className="min-h-7 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-2 min-w-[340px]">
          {hoveredCell ? (
            <span className="text-slate-800 dark:text-slate-200">
              Inspecting: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{hoveredCell.day} at {hoveredCell.hour.toString().padStart(2, '0')}:00</strong> • Intensity: <strong className="text-slate-900 dark:text-white">{hoveredCell.val}/4</strong>
            </span>
          ) : (
            <span>Hover over matrix cells to inspect hourly coding patterns.</span>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] text-slate-400">Low</span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#E2E8F0] dark:bg-[#1E293B]/80" title="0: Inactive" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#38BDF8] dark:bg-[#0284C7]" title="Level 1: Light" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#818CF8] dark:bg-[#6366F1]" title="Level 2: Moderate" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#6366F1] dark:bg-[#A855F7]" title="Level 3: High" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#312E81] dark:bg-[#E0E7FF]" title="Level 4: Peak" />
            <span className="text-[9px] text-slate-400">High</span>
          </div>
        </div>
      </div>

      {/* Accompanying Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mt-3 font-mono">
        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Clock size={12} className="text-indigo-500" />
            Peak Time
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate" title={rhythm.peak_time}>
            {rhythm.peak_time}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Calendar size={12} className="text-cyan-500" />
            Active Day
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
            {rhythm.most_active_day}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Flame size={12} className="text-amber-500" />
            Streak
          </div>
          <p className="text-xs font-bold text-amber-500 mt-1">
            🔥 {rhythm.current_streak_weeks} weeks
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Activity size={12} className="text-emerald-500" />
            Consistency
          </div>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {rhythm.consistency_score} / 100
          </p>
        </div>
      </div>
    </TiltCard>
  );
};

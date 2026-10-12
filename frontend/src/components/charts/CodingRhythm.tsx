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
      className="p-6 rounded-2xl relative overflow-hidden group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 7x24 Matrix Grid */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] px-8">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>

          <div className="space-y-1">
            {rhythm.matrix.map((row, dayIdx) => (
              <div key={dayIdx} className="flex items-center gap-1.5">
                <span className="w-6 text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8]">
                  {days[dayIdx]}
                </span>

                <div className="flex-1 grid grid-cols-24 gap-1">
                  {row.map((val, hour) => (
                    <div
                      key={hour}
                      className={`h-4 rounded-xs ${getCellColor(val)} transition-all hover:scale-125 cursor-pointer`}
                      onMouseEnter={() => setHoveredCell({ day: days[dayIdx], hour, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`${days[dayIdx]} at ${hour}:00 - Activity intensity: ${val}/4`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cell Inspection tooltip */}
          <div className="h-5 text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between pt-1">
            {hoveredCell ? (
              <span>
                Inspecting: <strong className="text-[#6366F1] dark:text-[#818CF8]">{hoveredCell.day} at {hoveredCell.hour}:00</strong> • Intensity: {hoveredCell.val}/4
              </span>
            ) : (
              <span>Hover over matrix cells to inspect hourly coding patterns.</span>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8]">Low</span>
              <span className="w-2.5 h-2.5 rounded-xs bg-[#E2E8F0] dark:bg-[#1E293B]/80" title="0" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8] dark:bg-[#0284C7]" title="Level 1" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#818CF8] dark:bg-[#6366F1]" title="Level 2" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6366F1] dark:bg-[#A855F7]" title="Level 3" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#312E81] dark:bg-[#E0E7FF]" title="Level 4" />
              <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8]">High</span>
            </div>
          </div>
        </div>

        {/* Right: Accompanying Metrics Column */}
        <div className="lg:col-span-4 p-4 rounded-xl glass-panel space-y-3 font-mono shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              <Clock size={12} className="text-[#6366F1]" />
              PEAK CODING TIME
            </div>
            <p className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC] mt-0.5">
              {rhythm.peak_time}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              <Calendar size={12} className="text-[#06B6D4]" />
              MOST ACTIVE DAY
            </div>
            <p className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC] mt-0.5">
              {rhythm.most_active_day}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              <Flame size={12} className="text-amber-500" />
              CURRENT STREAK
            </div>
            <p className="text-sm font-bold text-amber-500 mt-0.5">
              🔥 {rhythm.current_streak_weeks} weeks
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              <Activity size={12} className="text-emerald-500" />
              CONSISTENCY INDEX
            </div>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {rhythm.consistency_score} / 100
            </p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

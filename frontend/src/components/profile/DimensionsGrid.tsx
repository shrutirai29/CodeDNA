import React from 'react';
import { motion } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Code, ShieldCheck, Flame, Layers, Users, Sparkles, TrendingUp } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profile.dimensionMetrics.map((metric) => {
        const IconComponent = iconMap[metric.iconName] || Code;

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
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50 shadow-2xs">
                  <IconComponent size={16} />
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

            {/* Short Explanation */}
            <p
              className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed pt-2 border-t border-white/40 dark:border-white/10"
              style={{ transform: 'translateZ(8px)' }}
            >
              “{metric.explanation}”
            </p>
          </TiltCard>
        );
      })}
    </div>
  );
};

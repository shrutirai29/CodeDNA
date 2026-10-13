import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Check, Loader2 } from 'lucide-react';
import { PixelGhost } from '../common/PixelGhost';

const steps = [
  'CONNECTING TO GITHUB',
  'FETCHING PROFILE',
  'SCANNING REPOSITORIES',
  'ANALYZING LANGUAGES',
  'CALCULATING DEVELOPER DNA',
  'ANALYSIS COMPLETE'
];

export const LoadingSequence: React.FC = () => {
  const { isSearching, loadingStep } = useDeveloperStore();

  if (!isSearching && loadingStep === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/75 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-2xl glass-card !bg-white/95 dark:!bg-[#0D1117]/95 !backdrop-blur-xl border border-white/90 dark:border-white/20 shadow-2xl space-y-4"
        >
          {/* Animated Pixel Ghost Scanner Mascot */}
          <div className="h-28 flex flex-col items-center justify-center overflow-visible">
            <PixelGhost scale={0.65} />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <h3 className="font-mono text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                CodeDNA Intelligence Pipeline
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950/90 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
              Step {Math.min(6, loadingStep)} / 6
            </span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {steps.map((st, idx) => {
              const stepNumber = idx + 1;
              const isDone = loadingStep > stepNumber;
              const isCurrent = loadingStep === stepNumber;

              return (
                <div
                  key={st}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/95 dark:bg-indigo-950/85 text-indigo-950 dark:text-white font-extrabold border-2 border-indigo-500 dark:border-indigo-400 shadow-md shadow-indigo-500/15'
                      : isDone
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/45 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-100/85 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/80 dark:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-extrabold ${
                        isCurrent
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : isDone
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      0{stepNumber}
                    </span>
                    <span className="tracking-tight">{st}</span>
                  </div>

                  <div className="flex items-center">
                    {isDone && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    {isCurrent && (
                      <Loader2 size={16} strokeWidth={2.5} className="animate-spin text-indigo-600 dark:text-indigo-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-300/60 dark:border-slate-700">
            <motion.div
              className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(loadingStep / 6) * 100}%` }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

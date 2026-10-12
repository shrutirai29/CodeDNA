import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Check, Loader2 } from 'lucide-react';

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 10 }}
          className="w-full max-w-md p-6 rounded-2xl glass-card shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/50 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] animate-ping" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
                CodeDNA Intelligence Pipeline
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#6366F1] dark:text-[#818CF8]">
              Step {Math.min(6, loadingStep)} / 6
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {steps.map((st, idx) => {
              const stepNumber = idx + 1;
              const isDone = loadingStep > stepNumber;
              const isCurrent = loadingStep === stepNumber;

              return (
                <div
                  key={st}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'glass-panel text-[#6366F1] dark:text-[#818CF8] font-bold border border-indigo-400/50'
                      : isDone
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-[#94A3B8] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] opacity-70">0{stepNumber}</span>
                    <span>{st}</span>
                  </div>

                  <div>
                    {isDone && <Check size={14} className="text-emerald-500" />}
                    {isCurrent && <Loader2 size={14} className="animate-spin text-[#6366F1] dark:text-[#818CF8]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#EEF2F7] dark:bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] h-full"
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

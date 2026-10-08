import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Sparkles, Zap, RotateCcw, Rocket } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

interface SimSkill {
  id: string;
  name: string;
  category: string;
  scoreBonus: number;
  fitBonus: number;
  unlockedRole: string;
  color: string;
}

const AVAILABLE_SIM_SKILLS: SimSkill[] = [
  { id: 'docker_k8s', name: 'Docker + Kubernetes', category: 'DevOps / Cloud', scoreBonus: 2.8, fitBonus: 8.5, unlockedRole: 'Cloud-Native Architect', color: '#2496ED' },
  { id: 'pytorch_ai', name: 'PyTorch + LLM Serving', category: 'Applied AI', scoreBonus: 3.2, fitBonus: 9.4, unlockedRole: 'Applied AI Engineer', color: '#EE4C2C' },
  { id: 'rust_systems', name: 'Rust Systems Core', category: 'Systems Engineering', scoreBonus: 2.6, fitBonus: 7.2, unlockedRole: 'Systems & Kernel Specialist', color: '#DEA584' },
  { id: 'redis_cache', name: 'Redis + Distributed Caching', category: 'Backend Architecture', scoreBonus: 1.8, fitBonus: 5.8, unlockedRole: 'High-Concurrency Backend', color: '#DC382D' },
  { id: 'graphql_apis', name: 'GraphQL + Apollo Federation', category: 'API Architecture', scoreBonus: 1.5, fitBonus: 4.6, unlockedRole: 'Full-Stack Platform Engineer', color: '#E10098' },
  { id: 'cicd_actions', name: 'GitHub Actions CI/CD Pipeline', category: 'Automation', scoreBonus: 1.6, fitBonus: 5.2, unlockedRole: 'DevOps Automation Lead', color: '#10B981' }
];

export const SkillSimulator: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['docker_k8s']);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const resetSkills = () => setSelectedSkills([]);
  const equipAll = () => setSelectedSkills(AVAILABLE_SIM_SKILLS.map(s => s.id));

  // Compute simulated projections
  const totalScoreDelta = Number(
    selectedSkills.reduce((sum, id) => {
      const found = AVAILABLE_SIM_SKILLS.find(s => s.id === id);
      return sum + (found ? found.scoreBonus : 0);
    }, 0).toFixed(1)
  );

  const totalFitDelta = Number(
    selectedSkills.reduce((sum, id) => {
      const found = AVAILABLE_SIM_SKILLS.find(s => s.id === id);
      return sum + (found ? found.fitBonus : 0);
    }, 0).toFixed(1)
  );

  const simulatedScore = Math.min(99.6, Number((profile.developer_score + totalScoreDelta).toFixed(1)));
  const baseFullStackFit = profile.careers[0]?.fit || 89.5;
  const simulatedFit = Math.min(99.2, Number((baseFullStackFit + totalFitDelta).toFixed(1)));

  return (
    <TiltCard
      maxTilt={5}
      scale={1.008}
      className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative group"
    >
      {/* 3D Cyber Ambient Highlights */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-emerald-500/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4" style={{ transform: 'translateZ(12px)' }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8]">
            <Rocket size={16} />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Developer Skill Sandbox & Level-Up Simulator
            </h2>
            <p className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
              Simulate stack acquisitions & project real-time score lifts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSkills}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-[#F1F5F9] dark:bg-[#161B22] text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-1 transition-all"
          >
            <RotateCcw size={10} />
            Reset
          </button>
          <button
            onClick={equipAll}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 transition-all"
          >
            <Zap size={10} />
            Equip Full Tree
          </button>
        </div>
      </div>

      {/* Real-time Projection HUD */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] mb-5 font-mono shadow-2xs"
        style={{ transform: 'translateZ(20px)' }}
      >
        {/* Score Lift */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-semibold block uppercase">
            Projected Intelligence Score
          </span>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={simulatedScore}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-2xl font-black text-[#111827] dark:text-[#F8FAFC]"
            >
              {simulatedScore}
            </motion.span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">/ 100</span>
            {totalScoreDelta > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{totalScoreDelta}
              </span>
            )}
          </div>
        </div>

        {/* Career Fit Lift */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-semibold block uppercase">
            Top Role Fit (Full-Stack)
          </span>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={simulatedFit}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-2xl font-black text-indigo-600 dark:text-indigo-400"
            >
              {simulatedFit}%
            </motion.span>
            {totalFitDelta > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +{totalFitDelta}% Lift
              </span>
            )}
          </div>
        </div>

        {/* Unlocked Potential Tier */}
        <div className="space-y-1">
          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-semibold block uppercase">
            Simulated Tier Insignia
          </span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-emerald-500/10 border border-indigo-400/40 text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
              {simulatedScore >= 92 ? '★ PRINCIPAL ARCHITECT' : profile.tier}
            </span>
            {selectedSkills.length > 0 && (
              <span className="text-[10px] text-emerald-500 font-bold">
                ({selectedSkills.length} Equipped)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Skill Nodes Tree */}
      <div className="space-y-2 mb-2" style={{ transform: 'translateZ(14px)' }}>
        <span className="text-[11px] font-mono font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block mb-2">
          Click any skill to toggle simulation:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {AVAILABLE_SIM_SKILLS.map((skill) => {
            const isEquipped = selectedSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 border-indigo-500/50 dark:border-indigo-500/60 shadow-xs'
                    : 'bg-[#F7F9FC] dark:bg-[#070A0F] border-[#E2E8F0] dark:border-[#1E293B] hover:border-indigo-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5 w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: skill.color }}
                    />
                    <span className="font-mono text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
                      {skill.name}
                    </span>
                  </div>

                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] transition-colors ${
                      isEquipped
                        ? 'bg-indigo-600 text-white'
                        : 'border border-[#CBD5E1] dark:border-[#475569] text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] w-full pt-1 border-t border-[#E2E8F0]/60 dark:border-[#1E293B]/60">
                  <span>{skill.category}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{skill.fitBonus}% fit
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Level-Up Advice */}
      <div
        className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]"
        style={{ transform: 'translateZ(10px)' }}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          Interactive Roadmap Simulation:
        </span>
        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
          {selectedSkills.length > 0
            ? `Achieving these unlocks: ${AVAILABLE_SIM_SKILLS.find(s => selectedSkills.includes(s.id))?.unlockedRole || 'Architect'}`
            : 'Select skills above to view target growth trajectories'}
        </span>
      </div>
    </TiltCard>
  );
};

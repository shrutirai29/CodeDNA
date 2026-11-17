import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Zap, RotateCcw, Rocket, Target } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { ScoringService } from '../../services/scoringService';

interface SimSkill {
  id: string;
  name: string;
  category: string;
  unlockedRole: string;
  color: string;
  roleWeights: Record<string, number>;
}

const AVAILABLE_SIM_SKILLS: SimSkill[] = [
  {
    id: 'docker_k8s',
    name: 'Docker + Kubernetes',
    category: 'DevOps / Cloud',
    unlockedRole: 'Cloud-Native Architect',
    color: '#2496ED',
    roleWeights: {
      'Full-Stack Developer': 7.5,
      'Backend Engineer': 6.0,
      'DevOps & Cloud Engineer': 11.2,
      'Data Scientist / ML Engineer': 5.0,
      'Systems & Software Engineer': 4.5
    }
  },
  {
    id: 'pytorch_ai',
    name: 'PyTorch + LLM Serving',
    category: 'Applied AI',
    unlockedRole: 'Applied AI Engineer',
    color: '#EE4C2C',
    roleWeights: {
      'Data Scientist / ML Engineer': 12.0,
      'Backend Engineer': 5.0,
      'Full-Stack Developer': 5.5,
      'Systems & Software Engineer': 4.0
    }
  },
  {
    id: 'rust_systems',
    name: 'Rust Systems Core',
    category: 'Systems Engineering',
    unlockedRole: 'Systems & Kernel Specialist',
    color: '#DEA584',
    roleWeights: {
      'Systems & Software Engineer': 13.5,
      'Backend Engineer': 6.5,
      'Full-Stack Developer': 4.0,
      'DevOps & Cloud Engineer': 4.0
    }
  },
  {
    id: 'redis_cache',
    name: 'Redis + Distributed Caching',
    category: 'Backend Architecture',
    unlockedRole: 'High-Concurrency Backend',
    color: '#DC382D',
    roleWeights: {
      'Backend Engineer': 8.5,
      'Full-Stack Developer': 6.0,
      'DevOps & Cloud Engineer': 4.5,
      'Data Scientist / ML Engineer': 3.5
    }
  },
  {
    id: 'graphql_apis',
    name: 'GraphQL + Apollo Federation',
    category: 'API Architecture',
    unlockedRole: 'Full-Stack Platform Engineer',
    color: '#E10098',
    roleWeights: {
      'Full-Stack Developer': 7.0,
      'Frontend Engineer': 6.5,
      'Backend Engineer': 5.5
    }
  },
  {
    id: 'cicd_actions',
    name: 'GitHub Actions CI/CD Pipeline',
    category: 'Automation',
    unlockedRole: 'DevOps Automation Lead',
    color: '#10B981',
    roleWeights: {
      'DevOps & Cloud Engineer': 9.5,
      'Full-Stack Developer': 6.5,
      'Backend Engineer': 5.5,
      'Frontend Engineer': 5.0
    }
  }
];

export const SkillSimulator: React.FC = () => {
  const { profile } = useDeveloperStore();
  const availableRoles = profile.careers.map(c => c.role);
  const [targetRole, setTargetRole] = useState<string>(availableRoles[0] || 'Full-Stack Developer');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['docker_k8s']);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const resetSkills = () => setSelectedSkills([]);
  const equipAll = () => setSelectedSkills(AVAILABLE_SIM_SKILLS.map(s => s.id));

  // Base role fit for selected target role
  const targetCareerObj = profile.careers.find(c => c.role === targetRole) || profile.careers[0];
  const baseFit = targetCareerObj ? targetCareerObj.fit : (profile.careers[0]?.fit || 50.0);

  // Dynamic role-requirement recalculation (Phase 5)
  const totalFitDelta = Number(
    selectedSkills.reduce((sum, id) => {
      const found = AVAILABLE_SIM_SKILLS.find(s => s.id === id);
      if (!found) return sum;
      const weightForRole = found.roleWeights[targetRole] ?? 1.0;
      return sum + weightForRole;
    }, 0).toFixed(1)
  );

  const simulatedFit = Math.min(99.0, Number((baseFit + totalFitDelta).toFixed(1)));

  // Recalculate Developer Intelligence Score using canonical DIS formula
  const simulatedBreadth = Math.min(99, profile.dimensions.technical_breadth + selectedSkills.length * 2.5);
  const simulatedComplexity = Math.min(99, profile.dimensions.project_complexity + selectedSkills.length * 1.8);

  const simulatedDimensions = {
    ...profile.dimensions,
    technical_breadth: simulatedBreadth,
    project_complexity: simulatedComplexity
  };

  const simulatedScoring = ScoringService.calculateDeveloperScore(simulatedDimensions);
  const scoreDelta = Number((simulatedScoring.score - profile.developer_score).toFixed(1));

  return (
    <TiltCard
      maxTilt={4}
      scale={1.008}
      className="p-6 rounded-2xl flex flex-col justify-between relative group"
    >
      {/* 3D Cyber Ambient Highlights */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-indigo-500/15 via-cyan-500/15 to-emerald-500/15 blur-3xl pointer-events-none" />

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
              Simulate stack acquisitions & project role-requirement readiness
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSkills}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] flex items-center gap-1 transition-all cursor-pointer"
          >
            <RotateCcw size={10} />
            Reset
          </button>
          <button
            onClick={equipAll}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold glass-pill text-[#6366F1] dark:text-[#818CF8] hover:border-[#6366F1] flex items-center gap-1 transition-all cursor-pointer"
          >
            <Zap size={10} />
            Equip Full Tree
          </button>
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl glass-panel mb-4 text-xs font-mono">
        <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1 font-semibold">
          <Target size={13} className="text-[#6366F1]" />
          Target Career Role:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {availableRoles.slice(0, 5).map(role => (
            <button
              key={role}
              onClick={() => setTargetRole(role)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                targetRole === role
                  ? 'bg-[#6366F1] text-white shadow-xs'
                  : 'glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Available Stack Acquisition Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {AVAILABLE_SIM_SKILLS.map((skill) => {
          const isSelected = selectedSkills.includes(skill.id);
          const roleWeight = skill.roleWeights[targetRole] || 3.5;

          return (
            <div
              key={skill.id}
              onClick={() => toggleSkill(skill.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                isSelected
                  ? 'border-[#6366F1] bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                  : 'glass-panel hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
                  {skill.name}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: skill.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                <span>{skill.category}</span>
                <span className={`font-bold ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                  +{roleWeight}% fit
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Simulated Outcome Cards */}
      <div className="p-4 rounded-xl glass-panel border border-indigo-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase block">
            Projected {targetRole} Fit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {simulatedFit}%
            </span>
            <span className="text-[11px] text-emerald-500 font-semibold">
              (+{totalFitDelta}% from base {baseFit}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {selectedSkills.length > 0
              ? `Acquiring ${selectedSkills.length} target skills satisfies core competency requirements for ${targetRole}.`
              : 'Select skills above to simulate role fit increase.'}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase block">
            Projected Overall DIS Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#6366F1] dark:text-[#818CF8]">
              {simulatedScoring.score}
            </span>
            <span className="text-[11px] text-indigo-500 font-semibold">
              (+{scoreDelta} pts • {simulatedScoring.tier})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Simulated percentile: Top {Math.max(1, 100 - simulatedScoring.percentile)}% based on broader multi-stack footprint.
          </p>
        </div>
      </div>
    </TiltCard>
  );
};

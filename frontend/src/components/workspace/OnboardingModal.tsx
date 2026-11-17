import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { X, Sparkles, Check, User, Briefcase, Target, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { userPreferences, setUserPreferences } = useDeveloperStore();

  const [displayName, setDisplayName] = useState(userPreferences.displayName || 'Developer');
  const [githubUsername, setGithubUsername] = useState(userPreferences.githubUsername || '');
  const [stage, setStage] = useState(userPreferences.stage || 'student');
  const [primaryGoal, setPrimaryGoal] = useState(userPreferences.primaryGoal || 'placement');
  const [targetRole, setTargetRole] = useState(userPreferences.targetRole || 'Full-Stack Developer');
  const [desiredSkills, setDesiredSkills] = useState<string[]>(userPreferences.desiredSkills || ['Docker', 'FastAPI']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const s = newSkill.trim();
    if (s && !desiredSkills.includes(s)) {
      setDesiredSkills([...desiredSkills, s]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setDesiredSkills(desiredSkills.filter((item) => item !== skill));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserPreferences({
      displayName: displayName.trim() || 'Developer',
      githubUsername: githubUsername.trim(),
      stage,
      primaryGoal,
      targetRole: targetRole.trim() || 'Full-Stack Developer',
      desiredSkills,
      isOnboarded: true
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-7"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] glass-pill transition-colors cursor-pointer"
      >
        <X size={16} />
      </button>

      {/* Modal Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-2 border border-indigo-200/60 dark:border-indigo-800/60">
          <Sparkles size={11} className="text-cyan-500" />
          <span>Personal Workspace Settings</span>
        </div>
        <h2 className="text-xl font-bold font-mono tracking-tight text-[#111827] dark:text-[#F8FAFC]">
          Configure Your Profile & Goals
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
          Your preferences tailor career milestones, roadmap recommendations, and benchmark comparisons.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Display Name & GitHub Handle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
              <User size={13} />
              <span>Display Name:</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Shruti Rai"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] border border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
              <Target size={13} />
              <span>Your GitHub Username:</span>
            </label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="e.g. shrutirai29"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] border border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>

        {/* Current Stage */}
        <div>
          <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
            Current Developer Stage:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'student', label: 'Student' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'working_dev', label: 'Working Dev' },
              { id: 'career_switcher', label: 'Career Switcher' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStage(s.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs font-mono text-center transition-all cursor-pointer ${
                  stage === s.id
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Career Goal */}
        <div>
          <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
            Primary Career Objective:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'placement', label: 'Campus Placement' },
              { id: 'internship', label: 'Summer Internship' },
              { id: 'job_change', label: 'Job Switch' },
              { id: 'open_source', label: 'Open Source' },
              { id: 'skill_upgrade', label: 'Upskilling' }
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setPrimaryGoal(g.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs font-mono text-center transition-all cursor-pointer ${
                  primaryGoal === g.id
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Role Title */}
        <div>
          <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5 flex items-center gap-1.5">
            <Briefcase size={13} />
            <span>Target Engineering Role:</span>
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full-Stack Developer, DevOps Engineer, ML Engineer"
            className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] border border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Desired Skills Chips */}
        <div>
          <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
            Target Skills to Master:
          </label>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {desiredSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type a skill (e.g. Kubernetes) and press Enter"
              className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] border border-white/60 dark:border-white/10 outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-3 py-2 rounded-xl glass-pill text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/40 dark:border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-[#64748B] dark:text-[#94A3B8] glass-pill hover:text-[#111827] dark:hover:text-[#F8FAFC] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen } = useDeveloperStore();

  if (!isOnboardingOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm selection:bg-indigo-500 selection:text-white">
        <OnboardingForm onClose={() => setIsOnboardingOpen(false)} />
      </div>
    </AnimatePresence>
  );
};

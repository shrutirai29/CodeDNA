import React, { useEffect } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { CareerService } from '../../services/careerService';
import {
  Settings,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Bookmark,
  Trash2,
  ExternalLink,
  Target,
  Clock,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const PersonalizedHome: React.FC = () => {
  const {
    userPreferences,
    guestToken,
    savedCourses,
    setSavedCourses,
    careerHistory,
    setCareerHistory,
    setIsOnboardingOpen,
    setCurrentView,
    setAnalyzerTab,
    searchDeveloper,
    setCareerMatchResult
  } = useDeveloperStore();

  useEffect(() => {
    // Fetch saved courses & career scan history
    Promise.all([
      CareerService.fetchSavedCourses(guestToken),
      CareerService.fetchHistory(guestToken)
    ]).then(([courses, history]) => {
      setSavedCourses(courses);
      setCareerHistory(history);
    });
  }, [guestToken, setSavedCourses, setCareerHistory]);

  const handleScanMyProfile = () => {
    const handle = userPreferences.githubUsername || 'shrutirai29';
    searchDeveloper(handle);
    setCurrentView('codedna');
  };

  const handleOpenCareerTab = (tab: 'match' | 'email' | 'builder' | 'catalog') => {
    setAnalyzerTab(tab);
    setCurrentView('analyzer');
  };

  const handleDeleteCourse = async (id: number) => {
    await CareerService.deleteCourse(id, guestToken);
    setSavedCourses(savedCourses.filter((c: any) => c.id !== id));
  };

  const handleDeleteHistory = async (id: number) => {
    await CareerService.deleteHistory(id, guestToken);
    setCareerHistory(careerHistory.filter((h: any) => h.id !== id));
  };

  const handleToggleCourseCompleted = (courseId: number) => {
    const updated = savedCourses.map((c: any) => {
      if (c.id === courseId) {
        return { ...c, is_completed: !c.is_completed };
      }
      return c;
    });
    setSavedCourses(updated);
    localStorage.setItem(`codedna_saved_courses_${guestToken}`, JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Hero with User Identity & Controls */}
      <div className="glass-card p-6 sm:p-7 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20 shrink-0">
            {userPreferences.displayName ? userPreferences.displayName.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#111827] dark:text-[#F8FAFC]">
                {userPreferences.displayName}'s Workspace
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {userPreferences.stage.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Target size={13} className="text-purple-500" />
                <span>Target: {userPreferences.targetRole}</span>
              </span>
              <span>•</span>
              {userPreferences.githubUsername && (
                <span className="flex items-center gap-1">
                  <GithubIcon size={13} className="text-slate-500" />
                  <span>@{userPreferences.githubUsername}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-mono text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] glass-pill hover:border-indigo-400/50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings size={14} />
            <span>Edit Goals</span>
          </button>

          <button
            onClick={handleScanMyProfile}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <GithubIcon size={14} />
            <span>Scan My GitHub</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Target Role */}
        <div className="glass-card p-4 rounded-xl border border-white/60 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>Primary Focus</span>
            <Target size={14} className="text-purple-500" />
          </div>
          <div className="text-base font-bold font-mono text-[#111827] dark:text-[#F8FAFC] truncate">
            {userPreferences.targetRole}
          </div>
          <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-1 capitalize">
            Goal: {userPreferences.primaryGoal.replace('_', ' ')}
          </div>
        </div>

        {/* Metric 2: Saved Courses */}
        <div className="glass-card p-4 rounded-xl border border-white/60 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>Bookmarked Courses</span>
            <GraduationCap size={14} className="text-indigo-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
            {savedCourses.length}
          </div>
          <div className="text-[10px] font-mono text-[#94A3B8] mt-1">
            {savedCourses.filter((c: any) => c.is_completed).length} completed
          </div>
        </div>

        {/* Metric 3: ATS Analyses Completed */}
        <div className="glass-card p-4 rounded-xl border border-white/60 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>Resume Matches</span>
            <Briefcase size={14} className="text-cyan-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
            {careerHistory.length}
          </div>
          <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-1">
            Historical scans saved
          </div>
        </div>

        {/* Metric 4: Desired Skills */}
        <div className="glass-card p-4 rounded-xl border border-white/60 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>Skills in Queue</span>
            <Sparkles size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
            {userPreferences.desiredSkills?.length || 0}
          </div>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate">
            {userPreferences.desiredSkills?.slice(0, 2).join(', ') || 'None set'}
          </div>
        </div>
      </div>

      {/* 3. Action Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleOpenCareerTab('match')}
          className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10 hover:border-purple-400/50 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Briefcase size={20} />
          </div>
          <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Match Resume to Job</span>
            <ArrowRight size={14} className="text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Benchmark your resume against any target job description for 4-dimension ATS scoring.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleOpenCareerTab('email')}
          className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10 hover:border-indigo-400/50 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles size={20} />
          </div>
          <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Decode Rejection Email</span>
            <ArrowRight size={14} className="text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Paste corporate rejection emails to discover extracted root causes and strategic pivot recommendations.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => handleOpenCareerTab('catalog')}
          className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10 hover:border-cyan-400/50 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <GraduationCap size={20} />
          </div>
          <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center justify-between">
            <span>Browse Skill Courses</span>
            <ArrowRight size={14} className="text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Explore curated courses from Coursera, Udemy, and fast.ai for missing skills.
          </p>
        </motion.div>
      </div>

      {/* 4. Bookmarked Courses Section */}
      <div className="glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bookmark size={18} className="text-indigo-500" />
            <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
              Saved Courses & Learning Tracker
            </h3>
          </div>
          <button
            onClick={() => handleOpenCareerTab('catalog')}
            className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse More</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {savedCourses.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#94A3B8] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span>No courses bookmarked yet. Browse the Course Catalog to save learning resources.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCourses.map((c: any) => (
              <div
                key={c.id || c.title}
                className="p-4 rounded-xl glass-pill flex flex-col justify-between border border-white/60 dark:border-white/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      {c.provider || 'Online'}
                    </span>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="text-[#94A3B8] hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove course"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h4
                    className={`text-xs font-bold font-mono transition-colors ${
                      c.is_completed
                        ? 'line-through text-[#94A3B8]'
                        : 'text-[#111827] dark:text-[#F8FAFC]'
                    }`}
                  >
                    {c.course_title || c.title}
                  </h4>

                  <div className="mt-2 text-[10px] font-mono text-[#94A3B8] flex items-center gap-1.5">
                    <span>Skill: {c.skill_name || c.skill || 'Tech'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!c.is_completed}
                      onChange={() => handleToggleCourseCompleted(c.id)}
                      className="rounded accent-indigo-600 cursor-pointer"
                    />
                    <span>{c.is_completed ? 'Completed' : 'Mark Done'}</span>
                  </label>

                  <a
                    href={c.course_url || c.url || 'https://coursera.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Historical ATS Resume Matches */}
      <div className="glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-purple-500" />
            <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
              Recent Resume Match Scans
            </h3>
          </div>
          <button
            onClick={() => handleOpenCareerTab('match')}
            className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Run New Match</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {careerHistory.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#94A3B8] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span>No historical match scans yet. Test your resume against a job description in Track 02.</span>
          </div>
        ) : (
          <div className="divide-y divide-white/40 dark:divide-white/10">
            {careerHistory.map((item: any) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
                      {item.job_title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Score: {item.match_score}%
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-2">
                    <Clock size={11} />
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCareerMatchResult(item);
                      handleOpenCareerTab('match');
                    }}
                    className="px-2.5 py-1 rounded-lg glass-pill text-xs font-mono text-purple-600 dark:text-purple-400 hover:border-purple-400 cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    className="p-1 rounded-lg text-[#94A3B8] hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Dna,
  FileText,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { setCurrentView, searchDeveloper } = useDeveloperStore();

  const handleStartAnalysis = () => {
    setCurrentView('launcher');
  };

  const handleExploreBenchmark = () => {
    searchDeveloper('shrutirai29');
    setCurrentView('codedna');
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle glowing pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium glass-pill text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm border border-indigo-200/50 dark:border-indigo-800/40"
        >
          <Sparkles size={14} className="text-cyan-500 animate-pulse" />
          <span>CodeDNA v2.4.0 • Developer Intelligence & Career Companion</span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111827] dark:text-[#F8FAFC] max-w-4xl mx-auto font-mono leading-[1.12]"
        >
          Your code tells a story.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">
            Let's discover what it says about you.
          </span>
        </motion.h1>

        {/* Supporting Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed"
        >
          Understand your engineering footprint, uncover skill strengths, match your resume to industry roles, and build an actionable career roadmap grounded in your actual projects.
        </motion.p>

        {/* Primary and Secondary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={handleStartAnalysis}
            className="px-7 py-3.5 rounded-xl text-sm font-mono font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Your Analysis</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleExploreBenchmark}
            className="px-6 py-3.5 rounded-xl text-sm font-mono font-medium text-[#111827] dark:text-[#F8FAFC] glass-pill hover:border-indigo-400/50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Verified Demos</span>
            <ExternalLink size={15} className="text-slate-400" />
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" /> No signup required to browse
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" /> 100% Zero synthetic data injection
          </span>
          <span className="flex items-center gap-1.5">
            <Lock size={14} className="text-cyan-500" /> Public GitHub metadata only
          </span>
        </motion.div>
      </section>

      {/* 2. DUAL PILLARS PRODUCT SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
            Unified Dual Intelligence Engine
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono">
            Code Footprint Meets Career Placement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: CodeDNA Developer Intelligence */}
          <div className="p-8 rounded-2xl glass-card border border-indigo-200/50 dark:border-indigo-900/40 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-400/50 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                <Dna size={26} />
              </div>
              <h3 className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
                CodeDNA: Developer Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Connect with any public GitHub profile to generate an empirical 6-dimensional Developer Intelligence Score (DIS), 3D technology DNA constellation, repository health audit, and longitudinal growth timeline.
              </p>

              <ul className="space-y-2 text-xs font-mono text-[#475569] dark:text-[#94A3B8] pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Canonical DIS Evaluation (Depth, Breadth, Complexity, Consistency, Collab, Adapt)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Interactive 3D Technology Galaxy with 2D SVG Orbit fallback
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Repository Health Auditor & AI Architecture Review
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => {
                  setCurrentView('launcher');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Launch GitHub Intelligence</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: SkillBridge Career Analyzer */}
          <div className="p-8 rounded-2xl glass-card border border-cyan-200/50 dark:border-cyan-900/40 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-400/50 transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <FileText size={26} />
              </div>
              <h3 className="text-xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
                SkillBridge: Career & Resume Analyzer
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Compare your actual resume against target job descriptions to uncover missing skills, calculate ATS-style dimension readiness, receive actionable resume tips, and access curated courses that bridge the gap.
              </p>

              <ul className="space-y-2 text-xs font-mono text-[#475569] dark:text-[#94A3B8] pt-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  PDF, DOCX & Plain Text Resume Parsing with ATS Match Scoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Curated Course Recommendations (Coursera, Udemy, freeCodeCamp)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Rejection & Interview Email Classifier with tactical next steps
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => {
                  setCurrentView('analyzer');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Launch Career & Resume Match</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR-STEP USER JOURNEY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-slate-200/60 dark:border-slate-800/50 my-10">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
            The Continuous Growth Journey
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono">
            From Public Commits to Industry Hired
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <span className="text-2xl font-black font-mono text-indigo-500">01</span>
            <h4 className="font-mono font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Scan Footprint</h4>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Verify your GitHub account identity and extract multi-language repository architectures.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <span className="text-2xl font-black font-mono text-cyan-500">02</span>
            <h4 className="font-mono font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Audit & Match</h4>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Upload your resume and target job posting to detect exact skill overlaps and missing requirements.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <span className="text-2xl font-black font-mono text-purple-500">03</span>
            <h4 className="font-mono font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Bridge the Gaps</h4>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Access free and certified course recommendations to systematically eliminate missing skills.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <span className="text-2xl font-black font-mono text-emerald-500">04</span>
            <h4 className="font-mono font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Track Milestones</h4>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Persist your verified snapshots and course completions in your private personal workspace.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HONEST DATA LIMITATIONS DISCLOSURE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck size={16} className="text-emerald-500" />
            Transparent Engineering Standards & Public Data Boundaries
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            CodeDNA analyzes public GitHub metadata, repository commit frequencies, licenses, and language mass. It does not access private organization codebases, invent historical scores, or promise employment outcomes. Match scores represent vector ATS alignment approximations to help you focus your preparation.
          </p>
        </div>
      </section>

      {/* 5. FINAL CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-800/40 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
              Ready to decode your developer footprint?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Start in under 10 seconds. Analyze any public GitHub profile or run an ATS match against your dream job.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleStartAnalysis}
                className="px-8 py-3.5 rounded-xl text-sm font-mono font-bold text-[#090D16] bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-400/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Workspace</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setCurrentView('workspace')}
                className="px-6 py-3.5 rounded-xl text-sm font-mono font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
              >
                <span>Open Personal Home</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

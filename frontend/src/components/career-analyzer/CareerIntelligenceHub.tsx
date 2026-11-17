import React, { useState, useEffect, useCallback } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { CareerService } from '../../services/careerService';
import type {
  CareerIntelligenceReport,
  CareerDirectionItem,
  IntelligenceExplanationResult
} from '../../services/careerService';
import {
  Compass,
  Sparkles,
  ShieldAlert,
  Award,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  FolderGit2,
  Send,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  RefreshCw,
  Sliders,
  X,
  History,
  TrendingUp,
  Cpu,
  FileCheck2,
  Trash2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CareerIntelligenceHub: React.FC = () => {
  const {
    profile,
    guestToken,
    userPreferences,
    setUserPreferences,
    intelligenceReport,
    setIntelligenceReport,
    savedCourses,
    setSavedCourses
  } = useDeveloperStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<CareerDirectionItem | null>(null);

  // Q&A State
  const [userQuestion, setUserQuestion] = useState('');
  const [isAskingQA, setIsAskingQA] = useState(false);
  const [qaHistory, setQaHistory] = useState<IntelligenceExplanationResult[]>([]);

  // Preferences Modal State
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [prefRole, setPrefRole] = useState(userPreferences.targetRole || '');
  const [prefStage, setPrefStage] = useState(userPreferences.stage || 'student');
  const [prefGoal, setPrefGoal] = useState(userPreferences.primaryGoal || 'placement');
  const [prefSkills, setPrefSkills] = useState(userPreferences.desiredSkills?.join(', ') || '');

  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastReports, setPastReports] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const handleRunAnalysis = useCallback(async (targetRoleOverride?: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const username = profile?.username && profile.username !== 'unknown' ? profile.username : '';
      const res = await CareerService.analyzeCareerIntelligence({
        username,
        targetRole: targetRoleOverride || userPreferences.targetRole,
        guestToken,
        preferences: {
          stage: userPreferences.stage,
          primaryGoal: userPreferences.primaryGoal,
          targetRole: targetRoleOverride || userPreferences.targetRole,
          desiredSkills: userPreferences.desiredSkills
        }
      });
      if (res && res.report) {
        setIntelligenceReport(res.report);
        if (res.report.section_5_career_directions?.length > 0) {
          setSelectedDirection(res.report.section_5_career_directions[0]);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate career intelligence report.');
    } finally {
      setIsLoading(false);
    }
  }, [profile, userPreferences, guestToken, setIntelligenceReport]);

  // Initial Load / Run Analysis if not yet analyzed
  useEffect(() => {
    if (!intelligenceReport) {
      const timer = setTimeout(() => {
        void handleRunAnalysis();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [intelligenceReport, handleRunAnalysis]);

  const handleSavePreferences = async () => {
    const skillsArray = prefSkills.split(',').map(s => s.trim()).filter(Boolean);
    setUserPreferences({
      targetRole: prefRole,
      stage: prefStage as any,
      primaryGoal: prefGoal as any,
      desiredSkills: skillsArray
    });
    setIsPrefsOpen(false);
    await handleRunAnalysis(prefRole);
  };

  const handleAskQuestion = async (qText?: string) => {
    const q = (qText || userQuestion).trim();
    if (!q || !intelligenceReport) return;
    setIsAskingQA(true);
    try {
      const res = await CareerService.explainCareerIntelligence({
        question: q,
        report: intelligenceReport,
        guestToken
      });
      setQaHistory(prev => [res, ...prev]);
      setUserQuestion('');
    } catch {
      // Fallback
    } finally {
      setIsAskingQA(false);
    }
  };

  const handleOpenHistory = async () => {
    setIsHistoryOpen(true);
    setIsLoadingHistory(true);
    try {
      const list = await CareerService.getIntelligenceHistory(guestToken);
      setPastReports(list);
    } catch {
      setPastReports([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLoadPastReport = async (reportId: number) => {
    setIsLoading(true);
    try {
      const record = await CareerService.getIntelligenceReportById(reportId, guestToken);
      if (record && record.report) {
        setIntelligenceReport(record.report);
        if (record.report.section_5_career_directions?.length > 0) {
          setSelectedDirection(record.report.section_5_career_directions[0]);
        }
        setIsHistoryOpen(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Could not load report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePastReport = async (reportId: number) => {
    try {
      await CareerService.deleteIntelligenceReport(reportId, guestToken);
      setPastReports(prev => prev.filter(r => r.id !== reportId));
    } catch {
      // Ignore
    }
  };

  const handleBookmarkCourse = async (course: any) => {
    const isBookmarked = savedCourses.some((c: any) => c.title === course.title);
    if (isBookmarked) {
      const item = savedCourses.find((c: any) => c.title === course.title);
      if (item?.id) {
        await CareerService.deleteCourse(item.id, guestToken);
        setSavedCourses(savedCourses.filter((c: any) => c.id !== item.id));
      }
    } else {
      const saved = await CareerService.saveCourse({
        ...course,
        user_id: guestToken,
        course_title: course.title,
        course_url: course.url,
        skill_name: course.skill || 'Tech'
      });
      setSavedCourses([saved, ...savedCourses]);
    }
  };

  const isCourseSaved = (title: string) => savedCourses.some((c: any) => c.title === title);

  const report: CareerIntelligenceReport | null = intelligenceReport;
  const topDirection = selectedDirection || (report?.section_5_career_directions?.[0] ?? null);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* 1. TOP HEADER & EVIDENCE CITATION STATUS BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Career Intelligence Engine
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                v2.4.0
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Evidence-based career discovery analyzing your GitHub code, repository depth, parsed experience, and stated goals across an extensible taxonomy.
          </p>

          {/* Evidence Source Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              profile?.username && profile.username !== 'unknown'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <FolderGit2 className="w-3.5 h-3.5" />
              {profile?.username && profile.username !== 'unknown'
                ? `GitHub: @${profile.username} (${profile.stats?.repositories ?? profile.repositories?.length ?? 0} repos)`
                : 'GitHub: Sparse Public Mode'}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              report?.metadata?.evidence_sources?.resume_provided
                ? 'bg-blue-950/40 text-blue-300 border-blue-800/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <FileCheck2 className="w-3.5 h-3.5" />
              {report?.metadata?.evidence_sources?.resume_provided ? 'Resume: Integrated' : 'Resume: Not Attached'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/40 text-purple-300 border border-purple-800/50">
              <TrendingUp className="w-3.5 h-3.5" />
              Confidence: {report?.metadata?.overall_confidence ?? 50}%
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPrefsOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            Preferences & Goals
          </button>
          <button
            onClick={handleOpenHistory}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4 text-amber-400" />
            History
          </button>
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Synthesizing...' : 'Re-Analyze'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 animate-pulse">
            <Compass className="w-10 h-10 animate-spin" />
          </div>
          <h2 className="text-lg font-semibold text-white">Synthesizing Multi-Source Developer Intelligence...</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Correlating repository architectures, technical language density, commit patterns, and skill-gap priorities across our extensible taxonomy.
          </p>
        </div>
      )}

      {!isLoading && report && (
        <>
          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Section 1 • Executive Summary
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                {report.metadata.scoring_methodology}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {report.section_1_executive_summary.headline}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
              {report.section_1_executive_summary.narrative}
            </p>

            {/* Confidence Explanatory Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Evidence Basis: </strong>
                {report.section_1_executive_summary.confidence_note}
              </div>
            </div>

            {/* Quick Strengths & Priorities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Key Demonstrated Strengths
                </span>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  {report.section_1_executive_summary.key_strengths_summary.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> High-Impact Development Priorities
                </span>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  {report.section_1_executive_summary.key_priorities_summary.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 2: DEVELOPER IDENTITY */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> Section 2 • Developer Identity & Architecture
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                {report.section_2_developer_identity.archetype}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Observed Facts */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Observed Facts (Directly Measured)
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {report.section_2_developer_identity.observed_facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Inferred Characteristics */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Inferred Characteristics (Derived Patterns)
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {report.section_2_developer_identity.inferred_characteristics.map((trait, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 5: DISCOVERED CAREER DIRECTIONS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" /> Section 5 • Dynamic Career Directions
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Evaluated Against Extensible Specializations
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Discovering {report.section_5_career_directions.length} directions tailored to your DNA
              </span>
            </div>

            {/* Direction Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {report.section_5_career_directions.map(dir => {
                const isSelected = topDirection?.id === dir.id;
                return (
                  <div
                    key={dir.id}
                    onClick={() => setSelectedDirection(dir)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                            {dir.category}
                          </span>
                          <h3 className="text-base font-bold text-white">{dir.title}</h3>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          dir.current_fit.score >= 75
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : dir.current_fit.score >= 55
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {dir.current_fit.score}% Fit
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{dir.summary}</p>

                      {/* 3 Distinct Assessment Indicators */}
                      <div className="grid grid-cols-3 gap-2 pt-2 pb-1 text-center border-t border-slate-800/80">
                        <div className="p-2 rounded-lg bg-slate-950/50">
                          <span className="text-[10px] text-slate-400 block">Current Fit</span>
                          <span className="text-xs font-bold text-white">{dir.current_fit.score}%</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/50">
                          <span className="text-[10px] text-slate-400 block">Growth</span>
                          <span className="text-xs font-bold text-cyan-400">{dir.growth_potential.score}%</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950/50">
                          <span className="text-[10px] text-slate-400 block">Readiness</span>
                          <span className="text-xs font-bold text-amber-400">{dir.career_readiness.score}%</span>
                        </div>
                      </div>

                      {/* Skills match pill tags */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Supporting Skills:</span>
                          <span className="text-emerald-400 font-medium">{dir.supporting_skills.length} detected</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {dir.supporting_skills.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                              {s}
                            </span>
                          ))}
                          {dir.missing_skills.slice(0, 2).map((m, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/40">
                              +{m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                      <span>{isSelected ? 'Currently Selected' : 'View Deep Dive'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE DIRECTION DEEP DIVE (Sections 3, 4, 7, 8, 9, 10 for Selected Direction) */}
          {topDirection && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Focused Deep Dive
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {topDirection.title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">{topDirection.summary}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Readiness Tier</span>
                    <span className="text-sm font-bold text-amber-400">{topDirection.career_readiness.tier}</span>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-800">
                    <span className="text-xs text-slate-400 block">Confidence</span>
                    <span className="text-sm font-bold text-cyan-400">{topDirection.evidence_confidence.score}%</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: STRENGTHS WITH EVIDENCE */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Section 3 • Strengths with Direct Evidence Citations
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.section_3_strengths_with_evidence.map((str, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{str.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                          {str.provenance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{str.explanation}</p>
                      <div className="text-[11px] p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                        <strong className="text-slate-300">Citation: </strong>
                        {str.evidence_citation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: WEAKNESSES & DEVELOPMENT AREAS */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Section 4 • Development Areas & Gaps (Constructive & Evidence-Based)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.section_4_weaknesses_and_gaps.map((gap, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-amber-300">{gap.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                          {gap.provenance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{gap.gap}</p>
                      <div className="text-[11px] p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-amber-300/90">
                        <strong className="text-amber-200">Why It Matters: </strong>
                        {gap.why_it_matters}
                      </div>
                      <div className="text-[11px] p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30 text-indigo-300/90">
                        <strong className="text-indigo-200">How to Demonstrate: </strong>
                        {gap.how_to_demonstrate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: CAREER COMPARISON MATRIX */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Section 6 • Career Comparison Matrix
                </span>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold">
                      <tr>
                        <th className="p-3">Career Direction</th>
                        <th className="p-3">Current Fit</th>
                        <th className="p-3">Growth Potential</th>
                        <th className="p-3">Readiness Tier</th>
                        <th className="p-3">Confidence</th>
                        <th className="p-3">Missing Requirements</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {report.section_6_career_comparison.directions_compared.map((row, idx) => (
                        <tr key={idx} className={row.direction_id === topDirection.id ? 'bg-indigo-950/20' : ''}>
                          <td className="p-3 font-semibold text-white">{row.title}</td>
                          <td className="p-3 text-emerald-400 font-bold">{row.current_fit_score}%</td>
                          <td className="p-3 text-cyan-400 font-medium">{row.growth_potential_score}%</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {row.readiness_tier}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{row.evidence_confidence}%</td>
                          <td className="p-3 text-amber-400/90">
                            {row.key_missing_skills.join(', ') || 'Minimal Gaps'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 7: PRIORITIZED SKILL GAPS */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Section 7 • Prioritized Skill Gaps
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.section_7_skill_gap_analysis.map((gap, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{gap.skill}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          gap.importance === 'Essential'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {gap.importance}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex justify-between">
                        <span>Difficulty: {gap.difficulty}</span>
                        <span className="text-indigo-400 font-medium">ROI: {gap.expected_career_roi}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Prerequisites: {gap.prerequisites.join(', ') || 'None'}
                      </div>
                      <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">
                        {gap.remediation_summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 8: PERSONALIZED LEARNING ROADMAP */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Section 8 • Personalized Learning Roadmap & Course Catalog
                </span>

                {/* Milestones timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.section_8_personalized_learning_roadmap.structured_milestones.map((m, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{m.timeline}</span>
                      <h4 className="text-sm font-bold text-white">{m.phase}</h4>
                      <p className="text-xs text-slate-300">{m.focus}</p>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 mt-2">
                        <strong className="text-slate-300">Deliverable: </strong>
                        {m.measurement}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Course Recommendations from Catalog */}
                {Object.keys(report.section_8_personalized_learning_roadmap.recommended_courses || {}).length > 0 && (
                  <div className="pt-4 space-y-3">
                    <h3 className="text-sm font-bold text-white">Curated Learning Resources for Missing Skills</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(report.section_8_personalized_learning_roadmap.recommended_courses).flatMap(([skillKey, courses]) =>
                        (courses || []).map((c: any, cIdx: number) => {
                          const saved = isCourseSaved(c.title);
                          return (
                            <div key={`${skillKey}-${cIdx}`} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                              <div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                  <span className="font-semibold text-indigo-400">{c.provider || c.platform || skillKey.toUpperCase()}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.is_free ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                                    {c.is_free ? 'FREE' : 'PAID'}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">{c.title}</h4>
                                <div className="text-[11px] text-slate-400 mt-1">
                                  {c.duration || 'Self-paced'} • {c.level || 'All Levels'}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                                <a
                                  href={c.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                                >
                                  View Course <ExternalLink className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={() => handleBookmarkCourse(c)}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    saved
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                                  }`}
                                  title={saved ? 'Remove Bookmark' : 'Bookmark Course'}
                                >
                                  {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 9: PERSONALIZED PROJECT RECOMMENDATIONS */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" /> Section 9 • Personalized Anchor Project Specifications
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {report.section_9_personalized_project_recommendations.map((proj, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                          Recommended Portfolio Anchor
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{proj.title}</h4>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <div><strong className="text-slate-200">Problem Solved: </strong>{proj.problem_solved}</div>
                        <div><strong className="text-slate-200">Why It Fits You: </strong>{proj.why_it_fits}</div>
                      </div>

                      {/* Difficulty Tiers */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">Tiered Implementation Scope:</span>
                        <div className="space-y-1 text-slate-300">
                          <div><span className="text-emerald-400 font-semibold">MVP: </span>{proj.difficulty_tiers.MVP}</div>
                          <div><span className="text-indigo-400 font-semibold">Intermediate: </span>{proj.difficulty_tiers.Intermediate}</div>
                          <div><span className="text-purple-400 font-semibold">Advanced: </span>{proj.difficulty_tiers.Advanced}</div>
                        </div>
                      </div>

                      <div className="text-[11px] text-cyan-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Demonstrates: {proj.what_it_demonstrates}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 10: FINAL ACTION PLAN */}
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Section 10 • Final Action Plan (High-Impact Next Steps)
                </span>

                <div className="space-y-3">
                  {report.section_10_final_action_plan.map(step => (
                    <div key={step.step_number} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                          {step.step_number}
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">{step.title}</h4>
                          <p className="text-xs text-slate-300">{step.action}</p>
                          <div className="text-[11px] text-slate-400">
                            <strong className="text-slate-300">Measure of Success: </strong>{step.how_to_measure}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-indigo-300 font-semibold whitespace-nowrap self-start sm:self-center">
                        {step.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GROUNDED INTERACTIVE Q&A FEATURE */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <HelpCircle className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Ask Career Intelligence</h3>
                    <p className="text-xs text-slate-400">
                      Grounded AI reasoning strictly based on your report evidence. No hallucinations or made-up scores.
                    </p>
                  </div>
                </div>

                {/* Suggested prompt chips */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Why did you recommend this career?',
                    'Which projects influenced my score?',
                    'What is my biggest weakness?',
                    'What information would make this more accurate?'
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(chip)}
                      className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border border-slate-700/60 transition-all text-[11px]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Question input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={e => setUserQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
                    placeholder="Ask anything about your scores, skill gaps, or evidence..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <button
                    onClick={() => handleAskQuestion()}
                    disabled={isAskingQA || !userQuestion.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ask</span>
                  </button>
                </div>

                {/* Q&A Stream */}
                {qaHistory.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {qaHistory.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs sm:text-sm">
                        <div className="font-semibold text-indigo-300 flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{item.question}</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{item.answer}</p>
                        {item.evidence_citations?.length > 0 && (
                          <div className="text-[11px] p-2 rounded bg-slate-950 border border-slate-800/80 text-slate-400">
                            <strong className="text-slate-300">Evidence Citations: </strong>
                            {item.evidence_citations.join(' • ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* PREFERENCES & GOALS MODAL */}
      <AnimatePresence>
        {isPrefsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Your Career Preferences</h3>
                </div>
                <button
                  onClick={() => setIsPrefsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Help our engine calibrate recommendations by telling us what you enjoy, your current experience level, and where you want to go.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Role or Specialization</label>
                  <input
                    type="text"
                    value={prefRole}
                    onChange={e => setPrefRole(e.target.value)}
                    placeholder="e.g. Backend Engineering, DevSecOps, AppSec"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Career Stage</label>
                    <select
                      value={prefStage}
                      onChange={e => setPrefStage(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="student">Student / Intern</option>
                      <option value="beginner">Self-Taught Beginner</option>
                      <option value="working_dev">Active Software Engineer</option>
                      <option value="career_switcher">Career Switcher</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Primary Goal</label>
                    <select
                      value={prefGoal}
                      onChange={e => setPrefGoal(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="placement">Campus Placement</option>
                      <option value="internship">Find Internship</option>
                      <option value="job_change">Senior Job Transition</option>
                      <option value="open_source">Open Source Growth</option>
                      <option value="skill_upgrade">Upskilling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Desired Skills to Learn (comma-separated)</label>
                  <input
                    type="text"
                    value={prefSkills}
                    onChange={e => setPrefSkills(e.target.value)}
                    placeholder="e.g. Docker, Kubernetes, FastAPI, Redis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsPrefsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-md"
                >
                  Save & Re-Assess
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPORT HISTORY DRAWER */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="bg-slate-900 border-l border-slate-800 h-full max-w-md w-full p-6 space-y-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Analysis History</h3>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingHistory && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Loading saved sessions...
                </div>
              )}

              {!isLoadingHistory && pastReports.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <History className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>No past Career Intelligence reports saved for this session.</p>
                </div>
              )}

              {!isLoadingHistory && pastReports.length > 0 && (
                <div className="space-y-3">
                  {pastReports.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{item.target_direction || 'Engineering Report'}</span>
                          <span className="text-[10px] text-slate-500">{item.created_at?.slice(0, 10)}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {item.summary_excerpt || 'Comprehensive 10-section report.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleLoadPastReport(item.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          Load Report →
                        </button>
                        <button
                          onClick={() => handleDeletePastReport(item.id)}
                          className="p-1 text-slate-500 hover:text-red-400"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

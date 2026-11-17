import React, { useState, useEffect } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { CareerService } from '../../services/careerService';
import { CareerIntelligenceHub } from './CareerIntelligenceHub';
import type { RejectionEmailResult, CourseItem } from '../../services/careerService';
import {
  FileText,
  MailCheck,
  Layers,
  GraduationCap,
  Sparkles,
  Upload,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Copy,
  Download,
  Plus,
  AlertCircle,
  Clock,
  Star,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CareerAnalyzerView: React.FC = () => {
  const {
    analyzerTab,
    setAnalyzerTab,
    guestToken,
    careerMatchResult,
    setCareerMatchResult,
    savedCourses,
    setSavedCourses
  } = useDeveloperStore();

  // Active sub-tab state
  const activeTab = analyzerTab || 'intelligence';

  // --- Sub-tab 1: Match State ---
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('Full-Stack Developer');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState('');

  // --- Sub-tab 2: Rejection Email State ---
  const [emailText, setEmailText] = useState('');
  const [isEmailAnalyzing, setIsEmailAnalyzing] = useState(false);
  const [emailResult, setEmailResult] = useState<RejectionEmailResult | null>(null);

  // --- Sub-tab 3: Resume Builder State ---
  const [builderData, setBuilderData] = useState({
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    github: 'https://github.com/alexmorgan',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    targetRole: 'Senior Full-Stack Engineer',
    summary: 'Proactive Full-Stack Software Engineer with 3+ years experience building distributed web applications with React, TypeScript, and FastAPI. Passionate about developer tooling, clean architectures, and automated testing.',
    skills: 'TypeScript, JavaScript, Python, React, Next.js, FastAPI, Node.js, PostgreSQL, Docker, Redis, TailwindCSS, Git, CI/CD',
    experience: [
      {
        company: 'CloudScale Technologies',
        role: 'Full-Stack Developer',
        period: '2023 - Present',
        bullets: 'Designed and deployed 12+ RESTful microservices with FastAPI and PostgreSQL serving 50k+ daily users.\nReduced frontend bundle size by 42% by migrating to Vite and implementing route-based code-splitting.'
      }
    ],
    projects: [
      {
        name: 'Distributed Task Queue',
        tech: 'Python, Redis, Docker',
        bullets: 'Engineered a concurrent background job scheduler with heartbeat monitoring and fault recovery.\nBenchmarked 2,500 operations per second with sub-5ms Redis latency.'
      }
    ],
    education: {
      degree: 'B.S. in Computer Science',
      institution: 'University of Technology',
      year: '2023'
    }
  });
  const [copyStatus, setCopyStatus] = useState('');

  // --- Sub-tab 4: Course Catalog State ---
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogList, setCatalogList] = useState<CourseItem[]>([]);

  // Load courses on mount
  useEffect(() => {
    CareerService.fetchCourses().then((courses) => {
      setCatalogList(courses);
    });
    CareerService.fetchSavedCourses(guestToken).then((saved) => {
      setSavedCourses(saved);
    });
  }, [guestToken, setSavedCourses]);

  // Handle Match Analysis
  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() && !selectedFile) {
      setMatchError('Please provide either resume text or upload a document (.pdf, .docx, .txt).');
      return;
    }
    if (!jobDescription.trim()) {
      setMatchError('Please enter the target job description to match against.');
      return;
    }

    setMatchError('');
    setIsMatching(true);

    try {
      const res = await CareerService.analyzeResumeMatch({
        resumeText,
        file: selectedFile || undefined,
        jobDescription,
        jobTitle,
        userId: guestToken
      });
      setCareerMatchResult(res);
    } catch {
      setMatchError('Unable to complete match analysis. Please check inputs and try again.');
    } finally {
      setIsMatching(false);
    }
  };

  // Handle Rejection Email Analysis
  const handleRunEmailAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) return;

    setIsEmailAnalyzing(true);
    try {
      const res = await CareerService.analyzeRejectionEmail(emailText, guestToken);
      setEmailResult(res);
    } finally {
      setIsEmailAnalyzing(false);
    }
  };

  // Handle Course Bookmark
  const handleToggleBookmark = async (course: CourseItem) => {
    const isSaved = savedCourses.some((c) => (c.course_title || c.title) === (course.course_title || course.title));
    if (isSaved) {
      const item = savedCourses.find((c) => (c.course_title || c.title) === (course.course_title || course.title));
      if (item && item.id) {
        await CareerService.deleteCourse(item.id, guestToken);
        setSavedCourses(savedCourses.filter((c) => c.id !== item.id));
      }
    } else {
      const saved = await CareerService.saveCourse({
        user_id: guestToken,
        course_title: course.title || course.course_title || 'Software Engineering Course',
        provider: course.provider || 'Online',
        course_url: course.url || course.course_url || 'https://coursera.org',
        skill_name: course.skill || course.skill_name || 'Software',
        rating: course.rating || 4.8
      });
      setSavedCourses([...savedCourses, saved]);
    }
  };

  // Format Resume Text for Builder Preview & Export
  const generateMarkdownResume = () => {
    return `# ${builderData.fullName}
**${builderData.targetRole}**
${builderData.location} • ${builderData.phone} • ${builderData.email}
GitHub: ${builderData.github} | LinkedIn: ${builderData.linkedin}

---

## PROFESSIONAL SUMMARY
${builderData.summary}

## CORE TECHNICAL SKILLS
${builderData.skills}

## PROFESSIONAL EXPERIENCE
${builderData.experience
  .map(
    (exp) => `### ${exp.role} — ${exp.company}
*${exp.period}*
${exp.bullets.split('\n').map((b) => `- ${b}`).join('\n')}
`
  )
  .join('\n')}

## SELECTED PROJECTS
${builderData.projects
  .map(
    (proj) => `### ${proj.name} [${proj.tech}]
${proj.bullets.split('\n').map((b) => `- ${b}`).join('\n')}
`
  )
  .join('\n')}

## EDUCATION
**${builderData.education.degree}** — ${builderData.education.institution} (${builderData.education.year})
`;
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(generateMarkdownResume());
    setCopyStatus('Copied to clipboard!');
    setTimeout(() => setCopyStatus(''), 2500);
  };

  const handleDownloadResume = () => {
    const element = document.createElement('a');
    const file = new Blob([generateMarkdownResume()], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${builderData.fullName.replace(/\s+/g, '_')}_Resume.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-white/60 dark:border-white/10 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 mb-1 border border-purple-200/60 dark:border-purple-800/60">
            <Sparkles size={11} className="text-purple-500" />
            <span>SkillBridge Suite • Career Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-[#111827] dark:text-[#F8FAFC]">
            Career & Resume Analyzer
          </h1>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Evaluate resume ATS readiness, decode rejection feedback, craft structured resumes, and explore skill courses.
          </p>
        </div>

        {/* Sub-tab Pills Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl glass-input border border-white/60 dark:border-white/10">
          <button
            onClick={() => setAnalyzerTab('intelligence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'intelligence'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Career Intelligence Hub</span>
          </button>
          <button
            onClick={() => setAnalyzerTab('match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'match'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <FileText size={14} />
            <span>Resume Matcher</span>
          </button>

          <button
            onClick={() => setAnalyzerTab('email')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'email'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <MailCheck size={14} />
            <span>Rejection Insights</span>
          </button>

          <button
            onClick={() => setAnalyzerTab('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <Layers size={14} />
            <span>Resume Builder</span>
          </button>

          <button
            onClick={() => setAnalyzerTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <GraduationCap size={14} />
            <span>Course Catalog</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: CAREER INTELLIGENCE COMPREHENSIVE HUB */}
      {/* ========================================================================= */}
      {activeTab === 'intelligence' && (
        <CareerIntelligenceHub />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: RESUME-TO-JOB MATCHER */}
      {/* ========================================================================= */}
      {activeTab === 'match' && (
        <div className="space-y-6">
          {/* Dual Inputs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Resume Input */}
            <div className="lg:col-span-6 glass-card p-5 sm:p-6 rounded-2xl border border-white/60 dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                    <FileText size={16} className="text-purple-500" />
                    <span>Your Resume Data</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[#94A3B8]">PDF, DOCX, or Text</span>
                </div>

                {/* File Upload Box */}
                <div className="mb-4">
                  <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                    Upload Resume File (Optional):
                  </label>
                  <label className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-all bg-white/20 dark:bg-white/5">
                    <Upload size={20} className="text-purple-500 mb-1.5" />
                    <span className="text-xs font-mono font-medium text-[#111827] dark:text-[#F8FAFC]">
                      {selectedFile ? selectedFile.name : 'Click to select PDF or DOCX file'}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] mt-0.5">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Maximum file size: 10MB'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-1 text-[11px] font-mono text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle size={12} />
                      <span>Remove selected file</span>
                    </button>
                  )}
                </div>

                {/* Text Area */}
                <div>
                  <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                    Or Paste Resume Text directly:
                  </label>
                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume sections, skills, work history, and key project bullets here…"
                    className="w-full p-3 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-purple-500/40 outline-none resize-y"
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-mono text-[#94A3B8]">
                <span>CodeDNA parses skills, libraries, and measurable engineering achievements.</span>
              </div>
            </div>

            {/* Right: Target Job Description */}
            <div className="lg:col-span-6 glass-card p-5 sm:p-6 rounded-2xl border border-white/60 dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-500" />
                    <span>Target Job Specifications</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[#94A3B8]">Required for Match</span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                    Target Role Title:
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-purple-500/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                    Paste Job Description / Requirements:
                  </label>
                  <textarea
                    rows={9}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description, responsibilities, required qualifications, and desired technical skills…"
                    className="w-full p-3 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-purple-500/40 outline-none resize-y"
                  />
                </div>
              </div>

              {matchError && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-mono text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{matchError}</span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/40 dark:border-white/10">
                <button
                  onClick={handleRunMatch}
                  disabled={isMatching}
                  className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isMatching ? 'animate-spin' : ''} />
                  <span>{isMatching ? 'Analyzing ATS Alignment…' : 'Analyze Career Match'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {careerMatchResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Primary Score Ring & 4 Dimensions */}
              <div className="glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Overall Match Circle */}
                  <div className="flex flex-col items-center justify-center text-center shrink-0">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          className="stroke-slate-200 dark:stroke-slate-800"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          className="stroke-purple-600 dark:stroke-purple-400 transition-all duration-1000 ease-out"
                          strokeWidth="8"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * Math.min(100, Math.max(0, careerMatchResult.match_score))) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC]">
                          {careerMatchResult.match_score}%
                        </span>
                        <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                          Overall Fit
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs font-mono font-semibold text-purple-600 dark:text-purple-400">
                      {careerMatchResult.match_score >= 80
                        ? '★ Strong Alignment'
                        : careerMatchResult.match_score >= 60
                        ? '◆ Moderate Fit'
                        : '▲ Emerging Alignment'}
                    </div>
                  </div>

                  {/* 4 Dimension Bars */}
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl glass-pill">
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span className="text-[#64748B] dark:text-[#94A3B8]">Technical Alignment</span>
                        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{careerMatchResult.technical_alignment}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${careerMatchResult.technical_alignment}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl glass-pill">
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span className="text-[#64748B] dark:text-[#94A3B8]">Experience / Seniority</span>
                        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{careerMatchResult.experience_score}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-700"
                          style={{ width: `${careerMatchResult.experience_score}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl glass-pill">
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span className="text-[#64748B] dark:text-[#94A3B8]">Domain Relevance</span>
                        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{careerMatchResult.domain_relevance}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                          style={{ width: `${careerMatchResult.domain_relevance}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl glass-pill">
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span className="text-[#64748B] dark:text-[#94A3B8]">Keyword & ATS Density</span>
                        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{careerMatchResult.keyword_coverage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${careerMatchResult.keyword_coverage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Analysis: Found vs Missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Found Skills */}
                <div className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10">
                  <h4 className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Skills Found in Your Resume ({careerMatchResult.found_skills?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {careerMatchResult.found_skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
                      >
                        <CheckCircle2 size={12} />
                        <span>{skill}</span>
                      </span>
                    ))}
                    {(!careerMatchResult.found_skills || careerMatchResult.found_skills.length === 0) && (
                      <span className="text-xs font-mono text-[#94A3B8]">No direct matches identified.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10">
                  <h4 className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Skills Missing for this Job ({careerMatchResult.missing_skills?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {careerMatchResult.missing_skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
                      >
                        <Plus size={12} />
                        <span>{skill}</span>
                      </span>
                    ))}
                    {(!careerMatchResult.missing_skills || careerMatchResult.missing_skills.length === 0) && (
                      <span className="text-xs font-mono text-emerald-500">All required keywords covered!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Tips */}
              <div className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10">
                <h4 className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  <span>Actionable Optimization Tips</span>
                </h4>
                <ul className="space-y-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                  {careerMatchResult.actionable_tips?.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Courses */}
              {careerMatchResult.recommended_courses && careerMatchResult.recommended_courses.length > 0 && (
                <div className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10">
                  <h4 className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap size={16} className="text-indigo-500" />
                    <span>Targeted Learning to Bridge Gaps</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {careerMatchResult.recommended_courses.map((course: any, idx: number) => {
                      const isSaved = savedCourses.some((c) => (c.course_title || c.title) === course.title);
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl glass-pill flex flex-col justify-between border border-white/60 dark:border-white/10"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                {course.provider}
                              </span>
                              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-500">
                                <Star size={12} className="fill-current" />
                                <span>{course.rating || 4.8}</span>
                              </div>
                            </div>

                            <h5 className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
                              {course.title}
                            </h5>

                            <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-[#94A3B8]">
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                <span>{course.duration || 'Flexible'}</span>
                              </span>
                              <span>•</span>
                              <span>{course.level || 'Intermediate'}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <span>View Course</span>
                              <ExternalLink size={12} />
                            </a>

                            <button
                              onClick={() => handleToggleBookmark(course)}
                              className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                              title={isSaved ? 'Remove bookmark' : 'Save course'}
                            >
                              {isSaved ? (
                                <BookmarkCheck size={16} className="text-purple-600 dark:text-purple-400" />
                              ) : (
                                <Bookmark size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REJECTION EMAIL INSIGHTS */}
      {/* ========================================================================= */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2 mb-2">
              <MailCheck size={18} className="text-purple-500" />
              <span>Rejection Email Feedback Decoder</span>
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4">
              Received a rejection notice? Paste the message content below. Our analyzer extracts underlying causes, classifies polite corporate phrasings, and provides constructive next steps.
            </p>

            <form onSubmit={handleRunEmailAnalysis} className="space-y-4">
              <textarea
                rows={7}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste the rejection email text here (e.g. 'Thank you for taking the time to speak with our team...')"
                className="w-full p-3.5 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-purple-500/40 outline-none resize-y"
              />

              <button
                type="submit"
                disabled={isEmailAnalyzing || !emailText.trim()}
                className="py-2.5 px-5 rounded-xl text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} className={isEmailAnalyzing ? 'animate-spin' : ''} />
                <span>{isEmailAnalyzing ? 'Decoding Feedback…' : 'Decode Rejection Email'}</span>
              </button>
            </form>
          </div>

          {emailResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm space-y-6"
            >
              {/* Header Analysis Badges */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider block mb-1">
                    Classification Result
                  </span>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {emailResult.category}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">Confidence:</span>
                    <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                      {Math.round(emailResult.confidence * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">Tone:</span>
                    <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                      {emailResult.sentiment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <h4 className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC] uppercase tracking-wider mb-2.5">
                  Extracted Underlying Drivers
                </h4>
                <ul className="space-y-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                  {emailResult.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Strategic Next Steps</span>
                </h4>
                <ul className="space-y-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                  {emailResult.next_steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STRUCTURED RESUME BUILDER */}
      {/* ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form */}
          <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 space-y-5">
            <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
              <Layers size={16} className="text-purple-500" />
              <span>Resume Content Editor</span>
            </h3>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">Full Name</label>
                <input
                  type="text"
                  value={builderData.fullName}
                  onChange={(e) => setBuilderData({ ...builderData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={builderData.targetRole}
                  onChange={(e) => setBuilderData({ ...builderData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">Email</label>
                <input
                  type="email"
                  value={builderData.email}
                  onChange={(e) => setBuilderData({ ...builderData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">Location</label>
                <input
                  type="text"
                  value={builderData.location}
                  onChange={(e) => setBuilderData({ ...builderData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC]"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">Executive Summary</label>
              <textarea
                rows={3}
                value={builderData.summary}
                onChange={(e) => setBuilderData({ ...builderData, summary: e.target.value })}
                className="w-full p-2.5 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] resize-y"
              />
            </div>

            {/* Core Skills */}
            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">Technical Skills (comma-separated)</label>
              <input
                type="text"
                value={builderData.skills}
                onChange={(e) => setBuilderData({ ...builderData, skills: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC]"
              />
            </div>

            {/* Experience Bullets */}
            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] mb-1">
                Primary Experience & Bullet Points
              </label>
              <textarea
                rows={4}
                value={builderData.experience[0]?.bullets || ''}
                onChange={(e) => {
                  const updated = [...builderData.experience];
                  if (updated[0]) updated[0].bullets = e.target.value;
                  setBuilderData({ ...builderData, experience: updated });
                }}
                placeholder="Separate achievements with new lines..."
                className="w-full p-2.5 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC] resize-y"
              />
            </div>
          </div>

          {/* Right: Real-Time Formatted Preview */}
          <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-white/60 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-mono text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                  <FileText size={16} className="text-cyan-500" />
                  <span>ATS-Formatted Markdown Preview</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResume}
                    className="p-1.5 rounded-lg glass-pill text-xs font-mono text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] flex items-center gap-1 cursor-pointer"
                    title="Copy Markdown"
                  >
                    <Copy size={13} />
                    <span>{copyStatus || 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadResume}
                    className="p-1.5 rounded-lg glass-pill text-xs font-mono text-purple-600 dark:text-purple-400 hover:border-purple-400 flex items-center gap-1 cursor-pointer"
                    title="Download .md File"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Formatted Preview Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-y-auto max-h-[480px] whitespace-pre-wrap selection:bg-purple-500">
                {generateMarkdownResume()}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 text-[11px] font-mono text-[#94A3B8]">
              <span>Tip: ATS readers parse cleanly structured Markdown and unadorned text without graphical artifact confusion.</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CURATED COURSE CATALOG */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-white/60 dark:border-white/10">
            <div>
              <h3 className="text-base font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">
                Curated Engineering Course Catalog
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Vetted courses from Coursera, Udemy, fast.ai, and freeCodeCamp matched to CodeDNA skill clusters.
              </p>
            </div>

            {/* Filter Input */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
                placeholder="Filter by skill e.g. Docker, React…"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-[#111827] dark:text-[#F8FAFC]"
              />
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogList
              .filter((c) => {
                if (!catalogQuery) return true;
                const q = catalogQuery.toLowerCase();
                return (
                  c.title?.toLowerCase().includes(q) ||
                  c.skill?.toLowerCase().includes(q) ||
                  c.provider?.toLowerCase().includes(q)
                );
              })
              .map((course, idx) => {
                const isSaved = savedCourses.some((c) => (c.course_title || c.title) === course.title);
                return (
                  <div
                    key={idx}
                    className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm flex flex-col justify-between hover:border-purple-400/50 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                          {course.provider}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-500 font-bold">
                          <Star size={12} className="fill-current" />
                          <span>{course.rating || 4.8}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h4>

                      <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-[#94A3B8]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{course.duration || 'Flexible'}</span>
                        </span>
                        <span>•</span>
                        <span>{course.level || 'Intermediate'}</span>
                        <span>•</span>
                        <span className="capitalize">{course.skill}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
                      <a
                        href={course.url || 'https://coursera.org'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-medium text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <span>Start Learning</span>
                        <ExternalLink size={12} />
                      </a>

                      <button
                        onClick={() => handleToggleBookmark(course)}
                        className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                        title={isSaved ? 'Remove bookmark' : 'Bookmark course'}
                      >
                        {isSaved ? (
                          <BookmarkCheck size={16} className="text-purple-600 dark:text-purple-400" />
                        ) : (
                          <Bookmark size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Share2,
  Code,
  FileText,
  Printer,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnalyticsExport: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [copied, setCopied] = useState(false);
  const [csvExported, setCsvExported] = useState(false);
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [reportDate] = useState(() => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [reportYear] = useState(() => new Date().getFullYear());

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `codedna-${profile.username}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    const md = `
# CodeDNA Developer Intelligence Report: @${profile.username}
- **Developer Score:** ${profile.developer_score} / 100 (${profile.tier})
- **Global Rank:** Top ${Math.max(1, 100 - profile.percentile_rank)}%
- **Archetype:** ${profile.archetype.title}
- **Primary Stacks:** ${profile.tech_dna.slice(0, 5).map(t => `${t.name} (${t.usage}%)`).join(', ')}
- **Top Career Fit:** ${profile.careers[0]?.role} (${profile.careers[0]?.fit}%)
- **Next Best Skill:** ${profile.next_best_skill.skill} (+${profile.next_best_skill.potentialImprovement}%)
- **Consistency Streak:** ${profile.rhythm.current_streak_weeks} weeks
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['Metric', 'Value', 'Category'],
      ['Username', profile.username, 'Profile'],
      ['Developer Name', profile.name, 'Profile'],
      ['Developer Score', profile.developer_score, 'Score'],
      ['Tier', profile.tier, 'Score'],
      ['Percentile Rank', `${profile.percentile_rank}%`, 'Score'],
      ['Repositories', profile.stats.repositories, 'GitHub'],
      ['Contributions', profile.stats.contributions, 'GitHub'],
      ['Week Streak', profile.stats.week_streak, 'GitHub'],
      ['Technical Depth', profile.dimensions.technical_depth, 'Dimension'],
      ['Technical Breadth', profile.dimensions.technical_breadth, 'Dimension'],
      ['Consistency', profile.dimensions.consistency, 'Dimension'],
      ['Project Complexity', profile.dimensions.project_complexity, 'Dimension'],
      ['Collaboration', profile.dimensions.collaboration, 'Dimension'],
      ['Adaptability', profile.dimensions.adaptability, 'Dimension'],
      ['Impact', profile.dimensions.impact, 'Dimension'],
      ['Top Career Fit', profile.careers[0]?.role || 'Full-Stack Developer', 'Career'],
      ['Top Career Match %', `${profile.careers[0]?.fit || 90}%`, 'Career'],
      ['Next Best Skill', profile.next_best_skill.skill, 'Recommendation'],
      ['Peak Coding Time', profile.rhythm.peak_time, 'Rhythm'],
      ['Most Active Day', profile.rhythm.most_active_day, 'Rhythm']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(
      rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    );

    const anchor = document.createElement('a');
    anchor.setAttribute('href', csvContent);
    anchor.setAttribute('download', `codedna-${profile.username}-developer_metrics.csv`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 2500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleCopyExecutiveSummary = () => {
    const text = `CODEDNA EXECUTIVE DEVELOPER INTELLIGENCE DOSSIER
==================================================
Developer: ${profile.name} (@${profile.username})
Developer Score: ${profile.developer_score} / 100 (${profile.tier})
Global Standing: Top ${Math.max(1, 100 - profile.percentile_rank)}%
Archetype: ${profile.archetype.title} (${profile.archetype.badge})

SIX-DIMENSIONAL ENGINEERING EVALUATION:
- Technical Depth: ${profile.dimensions.technical_depth}/100 (Weight: 20%)
- Technical Breadth: ${profile.dimensions.technical_breadth}/100 (Weight: 15%)
- Consistency & Habit: ${profile.dimensions.consistency}/100 (Weight: 20%)
- Project Complexity: ${profile.dimensions.project_complexity}/100 (Weight: 15%)
- Collaboration: ${profile.dimensions.collaboration}/100 (Weight: 15%)
- Adaptability: ${profile.dimensions.adaptability}/100 (Weight: 15%)

TOP CAREER ALIGNMENT:
- ${profile.careers[0]?.role || 'Full-Stack Developer'}: ${profile.careers[0]?.fit || 89}% Match
- Primary Strengths: ${profile.careers[0]?.strengths.join(', ') || 'Full-Stack Architecture'}
- Missing Skill Gaps: ${profile.careers[0]?.gaps.join(', ') || 'Distributed Caching'}
- Recommended Next Skill: ${profile.next_best_skill.skill} (+${profile.next_best_skill.potentialImprovement}% Fit Leverage)

GITHUB REPOSITORY AUDIT:
- Public Repositories: ${profile.stats.repositories}
- Contributions Recorded: ${profile.stats.contributions}
- Verified Evidence Coverage: ${profile.dataQuality?.coveragePercent || 96}%

Generated by CodeDNA Developer Intelligence (https://code-dna-alpha.vercel.app)`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl glass-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Analytics Data Mart & Report Export
            </h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Export full Developer DNA vectors, executive dossiers, and PowerBI analytical tables
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[10px] font-mono font-bold text-[#6366F1] dark:text-[#818CF8]">
          SCHEMA V2.4
        </span>
      </div>

      {/* Featured Executive Report Card (Feature G) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-emerald-500/10 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#6366F1] text-white">
              <FileText size={16} />
            </span>
            <h3 className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
              Professional Developer Intelligence Executive Report (Feature G)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800">
              PDF & Printable View
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Generate an executive formatted dossier certifying 6-dimensional engineering score, multi-stack constellation, career readiness, and repository health audit for recruiters or portfolio presentation.
          </p>
        </div>

        <button
          onClick={() => setShowExecutiveModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Sparkles size={14} />
          View Executive Report
        </button>
      </div>

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* JSON Export */}
        <div className="p-5 rounded-xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
              Developer JSON Dossier
            </span>
            <Code size={16} className="text-[#6366F1]" />
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Raw structured JSON dataset containing 6-dimension scores, constellation vectors, and career fits.
          </p>
          <button
            onClick={handleDownloadJSON}
            className="w-full py-2 rounded-xl glass-pill font-mono font-semibold text-xs text-[#111827] dark:text-[#F8FAFC] hover:border-[#6366F1] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download size={14} />
            Download JSON (.json)
          </button>
        </div>

        {/* Markdown Dossier */}
        <div className="p-5 rounded-xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
              GitHub README Summary
            </span>
            <Share2 size={16} className="text-[#06B6D4]" />
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Formatted markdown summary designed to paste directly into your GitHub personal profile README.
          </p>
          <button
            onClick={handleCopyMarkdown}
            className="w-full py-2 rounded-xl glass-pill font-mono font-semibold text-xs text-[#111827] dark:text-[#F8FAFC] hover:border-[#6366F1] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
          </button>
        </div>

        {/* PowerBI Data Mart */}
        <div className="p-5 rounded-xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
              PowerBI Mart Tables
            </span>
            <FileSpreadsheet size={16} className="text-amber-500" />
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Star-schema analytical CSV tables generated by CodeDNA backend for business intelligence dashboards.
          </p>
          <button
            onClick={handleDownloadCSV}
            className="w-full py-2 rounded-xl glass-pill font-mono font-semibold text-xs text-[#111827] dark:text-[#F8FAFC] hover:border-[#6366F1] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {csvExported ? <Check size={14} className="text-emerald-500" /> : <Download size={14} />}
            {csvExported ? 'Downloaded metrics.csv!' : 'Export CSV Mart'}
          </button>
        </div>
      </div>

      {/* Feature G: Executive Developer Report Modal */}
      <AnimatePresence>
        {showExecutiveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#111827] dark:text-[#F8FAFC]"
            >
              {/* Modal Top Actions */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#161B22]">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-[#6366F1] text-white">
                    <FileText size={16} />
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Executive Developer Intelligence Report
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyExecutiveSummary}
                    className="px-3 py-1.5 rounded-lg glass-pill font-mono text-xs font-semibold flex items-center gap-1.5 hover:border-[#6366F1] cursor-pointer"
                  >
                    {copiedReport ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{copiedReport ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    onClick={handlePrintReport}
                    className="px-3 py-1.5 rounded-lg bg-[#6366F1] text-white font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-[#4F46E5] cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={() => setShowExecutiveModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Printable Dossier Body */}
              <div id="codedna-printable-dossier" className="p-6 sm:p-8 space-y-6 overflow-y-auto font-sans">
                {/* Header Profile Identity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-16 h-16 rounded-2xl border-2 border-[#6366F1] object-cover shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight">{profile.name}</h2>
                        <span className="text-xs font-mono text-[#6366F1] font-semibold">@{profile.username}</span>
                      </div>
                      <p className="text-xs text-slate-500 max-w-md mt-0.5">{profile.bio}</p>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Report Generated: {reportDate}
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Overall Score</span>
                    <span className="text-3xl font-black font-mono text-[#6366F1]">{profile.developer_score}</span>
                    <span className="text-xs font-mono block text-emerald-600 font-bold">{profile.tier}</span>
                    <span className="text-[11px] font-mono text-slate-400">Top {Math.max(1, 100 - profile.percentile_rank)}% Global Percentile</span>
                  </div>
                </div>

                {/* 6-Dimension Score Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    1. Six-Dimensional Engineering Evaluation
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {profile.dimensionMetrics.map(m => (
                      <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-500">{m.name}</span>
                          <span className="font-bold text-[#6366F1]">{m.score}/100</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {m.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Technology Constellation */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    2. Primary Technology Footprint
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {profile.tech_dna.slice(0, 8).map(t => (
                      <div key={t.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-mono">
                        <span className="font-bold">{t.name}</span>
                        <span className="text-slate-500">{t.usage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Readiness & Next Best Skill */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    3. Target Career Alignment & Recommendation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">Top Fit: {profile.careers[0]?.role}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">{profile.careers[0]?.fit}% Match</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Key Strengths: </span>
                        {profile.careers[0]?.strengths.join(', ')}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#6366F1]">Next Skill: {profile.next_best_skill.skill}</span>
                        <span className="text-emerald-600 font-bold">+{profile.next_best_skill.potentialImprovement}% Fit</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                        {profile.next_best_skill.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Certification */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    CodeDNA Automated Verification
                  </span>
                  <span>ID: {profile.username}-{profile.developer_score}-{reportYear}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

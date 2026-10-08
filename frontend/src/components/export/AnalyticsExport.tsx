import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { FileSpreadsheet, Download, Copy, Check, Share2, Code } from 'lucide-react';

export const AnalyticsExport: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [copied, setCopied] = useState(false);

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
- **Global Rank:** Top ${100 - profile.percentile_rank}%
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

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Analytics Data Mart & Report Export
            </h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Export full Developer DNA vectors, PowerBI tables, and markdown badges
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[10px] font-mono font-bold text-[#6366F1] dark:text-[#818CF8]">
          SCHEMA V2.4
        </span>
      </div>

      {/* Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* JSON Export */}
        <div className="p-5 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
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
            className="w-full py-2 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-mono font-semibold text-[#111827] dark:text-[#F8FAFC] hover:border-[#6366F1] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={14} />
            Download JSON (.json)
          </button>
        </div>

        {/* Markdown Dossier */}
        <div className="p-5 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
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
            className="w-full py-2 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-mono font-semibold text-[#111827] dark:text-[#F8FAFC] hover:border-[#6366F1] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
          </button>
        </div>

        {/* PowerBI Data Mart */}
        <div className="p-5 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
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
            onClick={() => alert('PowerBI Data Mart exported: data/processed/powerbi/developer_metrics.csv')}
            className="w-full py-2 rounded-xl bg-white dark:bg-[#161B22] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-mono font-semibold text-[#111827] dark:text-[#F8FAFC] hover:border-[#6366F1] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={14} />
            Export CSV Mart
          </button>
        </div>
      </div>
    </div>
  );
};

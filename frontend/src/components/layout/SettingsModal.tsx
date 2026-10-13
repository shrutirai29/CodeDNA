import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Sun,
  Moon,
  RefreshCw,
  Sparkles,
  Download,
  CheckCircle2,
  Layout,
  Database,
  RotateCcw
} from 'lucide-react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { RockerSwitch } from '../common/RockerSwitch';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    toggleSettings,
    isDarkMode,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebar,
    profile,
    searchDeveloper,
    setActiveTab,
    isCopilotOpen,
    toggleCopilot
  } = useDeveloperStore();

  if (!isSettingsOpen) return null;

  const handleRefreshProfile = () => {
    toggleSettings();
    if (profile?.username) {
      searchDeveloper(profile.username);
    }
  };

  const handleOpenExport = () => {
    setActiveTab('export');
    toggleSettings();
  };

  const handleOpenCopilot = () => {
    if (!isCopilotOpen) {
      toggleCopilot();
    }
    toggleSettings();
  };

  const handleResetDefaults = () => {
    if (isDarkMode) toggleTheme();
    if (isSidebarCollapsed) toggleSidebar();
    setActiveTab('overview');
    toggleSettings();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleSettings}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/75 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 12, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 12, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl glass-card !bg-white/95 dark:!bg-[#0D1117]/95 !backdrop-blur-xl border border-white/90 dark:border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8]">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="font-mono text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Platform Settings & Controls
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Configure appearance, live GitHub sync, and workspace tools
                </p>
              </div>
            </div>

            <button
              onClick={toggleSettings}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Settings"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* 1. Appearance & Layout Section */}
            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                Appearance & Layout
              </div>

              {/* Theme Switch Row */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Cyber Dark Mode
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {isDarkMode
                      ? 'Active: Deep Obsidian Cyber Glass Theme'
                      : 'Active: Luminous Daylight Frosted Glass Theme'}
                  </div>
                </div>
                <RockerSwitch
                  checked={isDarkMode}
                  onChange={() => toggleTheme()}
                  leftLabel="off"
                  rightLabel="on"
                  size="sm"
                  title="Toggle Dark Mode"
                />
              </div>

              {/* Sidebar Collapse Row */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layout size={14} className="text-indigo-500" />
                    Compact Sidebar Navigation
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Collapse left navigation bar to maximize chart canvas width
                  </div>
                </div>
                <RockerSwitch
                  checked={isSidebarCollapsed}
                  onChange={() => toggleSidebar()}
                  leftLabel="off"
                  rightLabel="on"
                  size="sm"
                  title="Toggle Compact Sidebar"
                />
              </div>
            </div>

            {/* 2. Live GitHub Telemetry & Sync */}
            <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Database size={14} />
                  GitHub Live Telemetry
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Connected
                </span>
              </div>

              {profile && (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full border border-indigo-500/40 object-cover"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {profile.name} <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">@{profile.username}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
                        {profile.stats.repositories} Repos • {profile.stats.contributions} Contributions • Score {profile.developer_score}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRefreshProfile}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <RefreshCw size={13} />
                    Re-Scan
                  </button>
                </div>
              )}
            </div>

            {/* 3. Quick Platform Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleOpenCopilot}
                className="p-3.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-3 text-left transition-all cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Launch AI Copilot
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Ask career & skill questions
                  </div>
                </div>
              </button>

              <button
                onClick={handleOpenExport}
                className="p-3.5 rounded-xl bg-cyan-50/90 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800/80 flex items-center gap-3 text-left transition-all cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-cyan-600 text-white shrink-0">
                  <Download size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Power BI & CSV Export
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Download analytics data mart
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-100/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              Reset Defaults
            </button>

            <button
              onClick={toggleSettings}
              className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

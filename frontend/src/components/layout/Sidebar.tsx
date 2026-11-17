import React from 'react';
import {
  LayoutDashboard,
  Dna,
  Briefcase,
  FolderGit2,
  GitCompare,
  TrendingUp,
  FileSpreadsheet,
  Sparkles,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  X
} from 'lucide-react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import type { NavTab } from '../../store/useDeveloperStore';
import { RockerSwitch } from '../common/RockerSwitch';
import { PixelGhost } from '../common/PixelGhost';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'dna', label: 'Developer DNA', icon: Dna },
  { id: 'career', label: 'Career Intelligence', icon: Briefcase },
  { id: 'repositories', label: 'Repositories', icon: FolderGit2 },
  { id: 'comparison', label: 'Comparison', icon: GitCompare },
  { id: 'growth', label: 'Growth Analytics', icon: TrendingUp },
  { id: 'export', label: 'Analytics & Export', icon: FileSpreadsheet },
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    isDarkMode,
    toggleTheme,
    toggleCopilot,
    toggleSettings,
    currentView,
    setCurrentView
  } = useDeveloperStore();

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleTrackClick = (view: 'codedna' | 'analyzer' | 'workspace' | 'landing' | 'launcher') => {
    setCurrentView(view);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {!isSidebarCollapsed && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`glass-nav !fixed top-0 left-0 bottom-0 z-50 md:z-40 border-r transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarCollapsed
            ? '-translate-x-full md:translate-x-0 md:w-20'
            : 'translate-x-0 w-[260px] max-w-[85vw] md:w-[230px] shadow-2xl md:shadow-none'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/50 dark:border-white/10 flex items-center justify-between">
          <div
            onClick={() => handleTrackClick('landing')}
            className="flex items-center gap-3 overflow-hidden cursor-pointer group"
            title="Return to Home Landing"
          >
            {/* Developer Logo: Code brackets + DNA connection motif */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="7 8 3 12 7 16" />
                <polyline points="17 8 21 12 17 16" />
                <circle cx="10" cy="12" r="1.5" fill="currentColor" />
                <circle cx="14" cy="12" r="1.5" fill="currentColor" />
                <line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeDasharray="1 1" />
              </svg>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-base tracking-tight text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5 font-mono">
                  Code<span className="text-[#6366F1] dark:text-[#818CF8]">DNA</span>
                </span>
                <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate leading-tight">
                  Developer Intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Close sidebar'}
          >
            <span className="md:hidden">
              <X size={18} />
            </span>
            <span className="hidden md:inline">
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </span>
          </button>
        </div>

      {/* Main Navigation */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {/* Platform Tracks Section */}
        <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8] dark:text-[#64748B]">
          {!isSidebarCollapsed && 'Platform Tracks'}
        </div>

        <button
          onClick={() => handleTrackClick('codedna')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            currentView === 'codedna'
              ? 'glass-pill text-[#6366F1] dark:text-[#818CF8] font-bold shadow-xs'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10'
          }`}
          title="Track 01: CodeDNA Developer Intelligence"
        >
          <Dna size={18} className={currentView === 'codedna' ? 'text-[#6366F1] dark:text-[#818CF8]' : 'text-[#64748B] dark:text-[#94A3B8]'} />
          {!isSidebarCollapsed && <span className="truncate">Developer DNA</span>}
        </button>

        <button
          onClick={() => handleTrackClick('analyzer')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            currentView === 'analyzer'
              ? 'glass-pill text-purple-600 dark:text-purple-400 font-bold shadow-xs'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10'
          }`}
          title="Track 02: SkillBridge Career & Resume Suite"
        >
          <Briefcase size={18} className={currentView === 'analyzer' ? 'text-purple-500' : 'text-[#64748B] dark:text-[#94A3B8]'} />
          {!isSidebarCollapsed && <span className="truncate">Career Analyzer</span>}
        </button>

        <button
          onClick={() => handleTrackClick('workspace')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            currentView === 'workspace'
              ? 'glass-pill text-cyan-600 dark:text-cyan-400 font-bold shadow-xs'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10'
          }`}
          title="Track 03: Personal Workspace & Saved Goals"
        >
          <UserCheck size={18} className={currentView === 'workspace' ? 'text-cyan-500' : 'text-[#64748B] dark:text-[#94A3B8]'} />
          {!isSidebarCollapsed && <span className="truncate">My Workspace</span>}
        </button>

        {/* Divider */}
        <div className="pt-2 pb-1 px-2">
          <hr className="border-white/40 dark:border-white/10" />
        </div>

        <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8] dark:text-[#64748B]">
          {!isSidebarCollapsed && (currentView === 'codedna' ? 'DNA Sections' : 'Quick Actions')}
        </div>

        {currentView === 'codedna' ? (
          navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all relative group cursor-pointer ${
                  isActive
                    ? 'glass-pill text-[#6366F1] dark:text-[#818CF8] font-bold shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10'
                }`}
              >
                {/* Active Left Accent Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#6366F1] dark:bg-[#818CF8] rounded-r-full" />
                )}

                <Icon
                  size={17}
                  className={`shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-[#6366F1] dark:text-[#818CF8]' : 'text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                />

                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })
        ) : (
          <div className="space-y-1">
            <button
              onClick={() => {
                handleTrackClick('codedna');
                handleNavClick('overview');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LayoutDashboard size={17} />
              {!isSidebarCollapsed && <span>DNA Overview</span>}
            </button>
            <button
              onClick={() => handleTrackClick('launcher')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <FolderGit2 size={17} />
              {!isSidebarCollapsed && <span>Track Selector</span>}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="pt-3 pb-2 px-2">
          <hr className="border-white/40 dark:border-white/10" />
        </div>

        {/* AI Copilot Launch Button */}
        <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8] dark:text-[#64748B]">
          {!isSidebarCollapsed && 'Intelligence'}
        </div>

        <button
          onClick={toggleCopilot}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] shadow-sm shadow-indigo-500/25 transition-all group cursor-pointer"
        >
          <Sparkles size={18} className="shrink-0 animate-pulse" />
          {!isSidebarCollapsed && (
            <span className="truncate font-mono">AI Copilot</span>
          )}
        </button>

        {/* Tools Section */}
        <div className="pt-4 pb-2 px-2">
          <hr className="border-white/40 dark:border-white/10" />
        </div>

        <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8] dark:text-[#64748B]">
          {!isSidebarCollapsed && 'Tools'}
        </div>

        {/* Theme Toggle */}
        <div
          onClick={isSidebarCollapsed ? toggleTheme : undefined}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10 transition-colors ${
            isSidebarCollapsed ? 'cursor-pointer justify-center' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? <Sun size={18} className="text-amber-400 shrink-0" /> : <Moon size={18} className="text-indigo-500 shrink-0" />}
            {!isSidebarCollapsed && (
              <span className="truncate">{isDarkMode ? 'Cyber Dark' : 'Light Mode'}</span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <RockerSwitch
              checked={isDarkMode}
              onChange={() => toggleTheme()}
              leftLabel="off"
              rightLabel="on"
              size="xs"
              title="Toggle Dark Mode"
            />
          )}
        </div>

        {/* Settings */}
        <button
          onClick={toggleSettings}
          title="Platform Settings"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Settings size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Platform Settings</span>}
        </button>

        {/* Help & Support */}
        <button
          onClick={toggleCopilot}
          title="CodeDNA Architecture & Docs"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <HelpCircle size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Help & Docs</span>}
        </button>
      </div>

      {/* Footer Mascot & Tagline */}
      <div className="p-2 border-t border-white/40 dark:border-white/10 flex flex-col items-center justify-center">
        <div className="-my-11">
          <PixelGhost scale={isSidebarCollapsed ? 0.25 : 0.32} />
        </div>
        {!isSidebarCollapsed && (
          <div className="pt-1 text-[10px] text-[#94A3B8] font-mono text-center">
            Build. Learn. Improve. Repeat.
          </div>
        )}
      </div>
      </aside>
    </>
  );
};

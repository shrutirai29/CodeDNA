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
  ChevronRight
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
    toggleSettings
  } = useDeveloperStore();

  return (
    <aside
      className={`glass-nav fixed top-0 left-0 bottom-0 z-40 border-r transition-all duration-300 ease-in-out flex flex-col ${
        isSidebarCollapsed ? 'w-16 sm:w-20' : 'w-[230px]'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-white/50 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Developer Logo: Code brackets + DNA connection motif */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
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
          className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-[#94A3B8] dark:text-[#64748B]">
          {!isSidebarCollapsed && 'Navigation'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative group cursor-pointer ${
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
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#6366F1] dark:text-[#818CF8]' : 'text-[#64748B] dark:text-[#94A3B8]'
                }`}
              />

              {!isSidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          );
        })}

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
  );
};

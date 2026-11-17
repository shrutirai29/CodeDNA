import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon, Settings, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { RockerSwitch } from '../common/RockerSwitch';

export const Header: React.FC = () => {
  const {
    profile,
    searchError,
    searchDeveloper,
    isDarkMode,
    toggleTheme,
    toggleSettings,
    isSettingsOpen,
    isSidebarCollapsed,
    toggleSidebar,
    currentView,
    setCurrentView
  } = useDeveloperStore();

  const [inputVal, setInputVal] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotification(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotification(false);
      }
    };

    if (showNotification) {
      document.addEventListener('mousedown', handleOutsideClick, true);
      document.addEventListener('touchstart', handleOutsideClick, true);
      document.addEventListener('click', handleOutsideClick, true);
      document.addEventListener('keydown', handleKeyDown, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
      document.removeEventListener('click', handleOutsideClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [showNotification]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      searchDeveloper(inputVal);
      setInputVal('');
    }
  };

  const quickProfiles = ['shrutirai29', 'torvalds', 'gaearon', 'karpathy', 'sindresorhus'];

  return (
    <header
      className={`glass-nav !fixed top-0 left-0 right-0 z-30 h-16 border-b flex items-center justify-between px-3 sm:px-4 md:pr-6 transition-all duration-300 pl-3 sm:pl-4 ${
        isSidebarCollapsed ? 'md:pl-24' : 'md:pl-[246px]'
      }`}
    >
      {/* Left: Mobile Menu Trigger + Search Bar & Quick Profile Chips */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2 sm:mr-3">
        {/* Mobile Hamburger Drawer Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          title="Open Navigation Menu"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-xs sm:max-w-sm md:max-w-md min-w-[140px] sm:min-w-[240px]">
          <div className="flex items-center w-full h-9 px-2.5 sm:px-3 rounded-xl glass-input gap-1.5 sm:gap-2 focus-within:ring-2 focus-within:ring-[#6366F1]/40 focus-within:border-[#6366F1]/50 transition-all overflow-hidden">
            <Search size={15} className="text-[#64748B] dark:text-[#94A3B8] shrink-0 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search GitHub…"
              className="flex-1 min-w-[50px] bg-transparent border-0 outline-none text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8]"
            />
            <button
              type="submit"
              className="h-6.5 px-2 sm:px-2.5 rounded-lg text-[11px] font-mono font-medium glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:border-indigo-400/50 flex items-center gap-1 cursor-pointer transition-all shrink-0"
              title="Scan GitHub profile"
            >
              <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="hidden xs:inline sm:inline">Scan</span>
            </button>
          </div>
        </form>

        {/* Quick Benchmark Profile Chips - Shown on 2xl to avoid crowding */}
        <div className="hidden 2xl:flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-[#94A3B8] whitespace-nowrap">Quick:</span>
          {quickProfiles.map((p) => {
            const isCurrent = profile?.username?.toLowerCase() === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => searchDeveloper(p, true)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] font-semibold border border-indigo-200 dark:border-indigo-800'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] border border-transparent'
                }`}
              >
                @{p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Center View / Mode Switcher */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl glass-input shrink-0 mr-2 border border-white/60 dark:border-white/10">
        <button
          onClick={() => setCurrentView('codedna')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
            currentView === 'codedna'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
          }`}
          title="CodeDNA Developer Intelligence"
        >
          CodeDNA
        </button>
        <button
          onClick={() => setCurrentView('analyzer')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
            currentView === 'analyzer'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
          }`}
          title="SkillBridge Career & Resume Suite"
        >
          SkillBridge
        </button>
        <button
          onClick={() => setCurrentView('workspace')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
            currentView === 'workspace'
              ? 'bg-cyan-600 text-white font-bold shadow-xs'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
          }`}
          title="Personal Workspace & Saved Goals"
        >
          Workspace
        </button>
        <button
          onClick={() => setCurrentView('landing')}
          className="px-2 py-1 rounded-lg text-[11px] font-mono text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
          title="Return to Landing Page"
        >
          Home
        </button>
      </div>

      {/* Right Controls: API Status, Notifications, Theme, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* GitHub API Connected Status - Single line non-wrapping */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>GitHub API</span>
          <span className="text-[9px] opacity-75 font-semibold">● Connected</span>
        </div>

        {/* Notification Bell */}
        <div className="relative shrink-0" ref={notificationRef}>
          <button
            onClick={() => {
              if (isSettingsOpen) toggleSettings();
              setShowNotification(!showNotification);
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all relative cursor-pointer ${
              showNotification
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] ring-2 ring-[#6366F1]/40'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B]'
            }`}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={showNotification}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6366F1] ring-2 ring-white dark:ring-[#0D1117]" />
          </button>

          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="!absolute top-full mt-2 -right-16 sm:right-0 w-[calc(100vw-2rem)] max-w-xs sm:w-80 p-3.5 glass-card !bg-white/95 dark:!bg-[#0D1117]/95 !backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-2xl text-xs z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800 font-mono font-bold">
                  <div className="flex items-center gap-2">
                    <Bell size={13} className="text-[#6366F1]" />
                    <span className="text-[#111827] dark:text-[#F8FAFC]">Developer Notifications</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-500 font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10">Live</span>
                    <button
                      onClick={() => setShowNotification(false)}
                      className="p-1 rounded-lg text-[#64748B] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      title="Close"
                      aria-label="Close notifications"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/5 hover:border-indigo-400/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        Consistency Peak
                      </span>
                      <span className="text-[9px] font-mono text-[#94A3B8]">Just now</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] pl-3 leading-relaxed">
                      Streak passed 12 consecutive active weeks!
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/5 hover:border-indigo-400/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                        Next Skill Match
                      </span>
                      <span className="text-[9px] font-mono text-[#94A3B8]">2h ago</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] pl-3 leading-relaxed">
                      Docker containerization unlocks +8.5% career fit.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3D Tactile Theme Rocker Switch */}
        <div
          onClick={toggleTheme}
          className="hidden sm:flex items-center gap-1.5 px-2.5 h-9 rounded-xl glass-panel cursor-pointer select-none shrink-0"
          title={isDarkMode ? 'Dark Mode ON (Click to switch to Light)' : 'Dark Mode OFF (Click to switch to Dark)'}
        >
          <Sun size={13} className={!isDarkMode ? 'text-amber-500 shrink-0' : 'text-[#64748B] shrink-0'} />
          <RockerSwitch
            checked={isDarkMode}
            onChange={() => toggleTheme()}
            leftLabel="off"
            rightLabel="on"
            size="xs"
            title={isDarkMode ? 'Dark Mode ON (Switch to Light)' : 'Dark Mode OFF (Switch to Dark)'}
          />
          <Moon size={13} className={isDarkMode ? 'text-indigo-400 shrink-0' : 'text-[#64748B] shrink-0'} />
        </div>

        {/* Mobile Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors cursor-pointer shrink-0"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
        </button>

        {/* Settings button */}
        <button
          onClick={() => {
            setShowNotification(false);
            toggleSettings();
          }}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer shrink-0 ${
            isSettingsOpen
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] ring-2 ring-[#6366F1]/40'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B]'
          }`}
          title="Platform Settings & Live Status"
          aria-label="Platform Settings"
        >
          <Settings size={18} className={`transition-transform duration-200 ${isSettingsOpen ? 'rotate-45 text-[#6366F1]' : ''}`} />
        </button>

        {/* Active Developer Avatar */}
        {profile && !searchError && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] dark:border-[#1E293B] shrink-0 h-9">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover shadow-2xs shrink-0"
            />
            <div className="hidden xl:flex flex-col text-left justify-center">
              <span className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] leading-none whitespace-nowrap">
                {profile.name}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap mt-0.5">
                @{profile.username}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

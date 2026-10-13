import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Settings } from 'lucide-react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { RockerSwitch } from '../common/RockerSwitch';

export const Header: React.FC = () => {
  const {
    profile,
    searchDeveloper,
    isDarkMode,
    toggleTheme,
    toggleSettings,
    isSettingsOpen,
    isSidebarCollapsed
  } = useDeveloperStore();

  const [inputVal, setInputVal] = useState('');
  const [showNotification, setShowNotification] = useState(false);

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
      className={`glass-nav !fixed top-0 left-0 right-0 z-30 h-16 border-b flex items-center justify-between pr-4 sm:pr-6 transition-all duration-300 ${
        isSidebarCollapsed ? 'pl-20 sm:pl-24' : 'pl-[246px]'
      }`}
    >
      {/* Left: Search Bar & Quick Profile Chips */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
        <form onSubmit={handleSearch} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md shrink-0 sm:shrink">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-[#94A3B8]">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search GitHub username…"
            className="w-full h-9 pl-9 pr-20 rounded-xl text-xs font-mono glass-input text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded-lg text-[11px] font-mono font-medium glass-pill text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] flex items-center gap-1 cursor-pointer transition-all shrink-0"
          >
            <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Scan</span>
          </button>
        </form>

        {/* Quick Benchmark Profile Chips - Shown on 2xl to avoid crowding */}
        <div className="hidden 2xl:flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-[#94A3B8] whitespace-nowrap">Quick:</span>
          {quickProfiles.map((p) => {
            const isCurrent = profile?.username?.toLowerCase() === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => searchDeveloper(p)}
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

      {/* Right Controls: API Status, Notifications, Theme, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* GitHub API Connected Status - Single line non-wrapping */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>GitHub API</span>
          <span className="text-[9px] opacity-75 font-semibold">● Connected</span>
        </div>

        {/* Notification Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6366F1]" />
          </button>

          {showNotification && (
            <div className="absolute right-0 mt-2 w-72 p-3.5 glass-card !bg-white/95 dark:!bg-[#0D1117]/95 !backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl shadow-2xl text-xs z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-800 font-mono font-bold">
                <span className="text-[#111827] dark:text-[#F8FAFC]">Developer Notifications</span>
                <span className="text-[10px] text-emerald-500 font-bold">Live</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl glass-panel">
                  <p className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Consistency Peak</p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Streak passed 12 consecutive active weeks!</p>
                </div>
                <div className="p-2 rounded-xl glass-panel">
                  <p className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Next Skill Match</p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Docker containerization unlocks +8.5% career fit.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Tactile Theme Rocker Switch */}
        <div
          onClick={toggleTheme}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-panel cursor-pointer select-none shrink-0"
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
          className="sm:hidden p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors cursor-pointer shrink-0"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
        </button>

        {/* Settings button */}
        <button
          onClick={toggleSettings}
          className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
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
        {profile && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] dark:border-[#1E293B] shrink-0">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover shadow-2xs shrink-0"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] leading-none whitespace-nowrap">
                {profile.name}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                @{profile.username}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

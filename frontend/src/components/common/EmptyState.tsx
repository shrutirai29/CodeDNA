import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { RetroTv404 } from './RetroTv404';
import { ArrowRight, RotateCcw, AlertTriangle, ShieldAlert, WifiOff } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const { searchDeveloper, searchError } = useDeveloperStore();

  const isRateLimit = searchError?.type === 'RATE_LIMIT_EXCEEDED';
  const isNetwork = searchError?.type === 'NETWORK_ERROR';

  return (
    <div className="p-8 sm:p-12 rounded-2xl glass-card text-center flex flex-col items-center justify-center space-y-6 my-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      {/* 404 Retro CRT Television Artwork from Uiverse.io */}
      <div className="scale-75 sm:scale-90 -my-14 -mt-10">
        <RetroTv404 displayText={isRateLimit ? "RATE LIMIT" : (isNetwork ? "OFFLINE" : "NOT FOUND")} code={isRateLimit ? "429" : (isNetwork ? "503" : "404")} />
      </div>

      <div className="space-y-2 relative z-10 pt-2">
        <div className="flex items-center justify-center gap-2">
          {isRateLimit ? (
            <ShieldAlert size={18} className="text-amber-500" />
          ) : isNetwork ? (
            <WifiOff size={18} className="text-rose-500" />
          ) : (
            <AlertTriangle size={18} className="text-indigo-500" />
          )}
          <h3 className="text-lg font-mono font-bold text-[#111827] dark:text-[#F8FAFC]">
            {isRateLimit
              ? 'GitHub API Rate Limit Reached'
              : isNetwork
              ? 'Connection Unavailable'
              : searchError?.username
              ? `User @${searchError.username} Not Found`
              : '404: Developer Footprint Not Found'}
          </h3>
        </div>

        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
          {searchError?.message || 'The requested GitHub profile could not be found or has not been loaded into the CodeDNA analytics engine yet. Scan a developer username or load our verified benchmark profile.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
        {searchError?.username && !isRateLimit && (
          <button
            onClick={() => searchDeveloper(searchError.username)}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            RETRY @{searchError.username}
          </button>
        )}
        <button
          onClick={() => searchDeveloper('shrutirai29', true)}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw size={14} />
          LOAD @shrutirai29 (BENCHMARK)
        </button>
        <button
          onClick={() => searchDeveloper('torvalds')}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8] glass-pill hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-all flex items-center gap-2 cursor-pointer"
        >
          TRY @torvalds
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

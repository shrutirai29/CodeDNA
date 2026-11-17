import { create } from 'zustand';
import type { DeveloperProfile } from '../types/developer';
import { BENCHMARK_PROFILES, GithubService } from '../services/githubService';
import { AIService } from '../services/aiService';
import type { ChatMessage } from '../services/aiService';

export type NavTab = 
  | 'overview' 
  | 'dna' 
  | 'career' 
  | 'repositories' 
  | 'comparison' 
  | 'growth' 
  | 'export';

export type AppView = 'landing' | 'launcher' | 'codedna' | 'analyzer' | 'workspace';
export type AnalyzerTab = 'intelligence' | 'match' | 'email' | 'builder' | 'catalog';

export interface UserPreferences {
  displayName: string;
  githubUsername: string;
  stage: 'student' | 'beginner' | 'working_dev' | 'career_switcher' | 'other';
  primaryGoal: 'placement' | 'internship' | 'job_change' | 'open_source' | 'skill_upgrade';
  targetRole: string;
  desiredSkills: string[];
  isOnboarded: boolean;
}

interface DeveloperStore {
  profile: DeveloperProfile;
  comparisonProfile: DeveloperProfile;
  activeTab: NavTab;
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isSearching: boolean;
  loadingStep: number;
  loadingMessage: string;
  isCopilotOpen: boolean;
  isSettingsOpen: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  searchError: { type: string; message: string; username: string } | null;
  activeSearchId: number;
  currentView: AppView;
  analyzerTab: AnalyzerTab;
  guestToken: string;
  careerMatchResult: any | null;
  intelligenceReport: any | null;
  setIntelligenceReport: (report: any | null) => void;
  userPreferences: UserPreferences;
  savedCourses: any[];
  careerHistory: any[];
  isOnboardingOpen: boolean;

  // Actions
  clearSearchError: () => void;
  setCurrentView: (view: AppView) => void;
  setAnalyzerTab: (tab: AnalyzerTab) => void;
  setCareerMatchResult: (res: any) => void;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  setSavedCourses: (courses: any[]) => void;
  setCareerHistory: (history: any[]) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setActiveTab: (tab: NavTab) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  toggleCopilot: () => void;
  toggleSettings: () => void;
  setSearchQuery: (query: string) => void;
  searchDeveloper: (username: string, isBenchmarkExplicit?: boolean) => Promise<void>;
  setComparisonDeveloper: (username: string) => Promise<void>;
  sendCopilotMessage: (text: string) => Promise<void>;
  reviewRepository: (repoName: string) => Promise<void>;
}

let searchSeqCounter = 0;

export const useDeveloperStore = create<DeveloperStore>((set, get) => {
  const savedTheme = localStorage.getItem('codedna_theme');
  const isDark = savedTheme === 'dark'; // Defaults to false (Light Mode)

  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      if (document.body) document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      if (document.body) document.body.classList.remove('dark');
    }
  }

  const defaultProfile = BENCHMARK_PROFILES.shrutirai29;
  const defaultComparison = BENCHMARK_PROFILES.torvalds;

  return {
    profile: defaultProfile,
    comparisonProfile: defaultComparison,
    activeTab: 'overview',
    isSidebarCollapsed: typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
    isDarkMode: isDark,
    isSearching: false,
    loadingStep: 0,
    loadingMessage: '',
    isCopilotOpen: false,
    isSettingsOpen: false,
    chatMessages: [
      {
        id: '1',
        sender: 'assistant',
        content: `Hi! I'm your **CodeDNA Copilot**. I've indexed your GitHub footprint. Ask me anything about your scores, skill gaps, or career fit!`,
        timestamp: 'Just now',
        engine: 'gemini'
      }
    ],
    isChatLoading: false,
    searchError: null,
    activeSearchId: 0,
    currentView: (localStorage.getItem('codedna_view') as AppView) || 'landing',
    analyzerTab: 'intelligence',
    intelligenceReport: null,
    setIntelligenceReport: (report) => set({ intelligenceReport: report }),
    guestToken: (() => {
      let token = localStorage.getItem('codedna_guest_token');
      if (!token) {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          token = 'guest_' + crypto.randomUUID();
        } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
          const buf = new Uint8Array(16);
          crypto.getRandomValues(buf);
          token = 'guest_' + Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
        } else {
          token = 'guest_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
        }
        localStorage.setItem('codedna_guest_token', token);
      }
      return token;
    })(),
    careerMatchResult: null,
    userPreferences: (() => {
      try {
        const saved = localStorage.getItem('codedna_user_prefs');
        if (saved) return JSON.parse(saved);
      } catch {
        // Fallback
      }
      return {
        displayName: 'Developer',
        githubUsername: 'shrutirai29',
        stage: 'student',
        primaryGoal: 'placement',
        targetRole: 'Full-Stack Developer',
        desiredSkills: ['Docker', 'FastAPI', 'Kubernetes'],
        isOnboarded: false
      };
    })(),
    savedCourses: [],
    careerHistory: [],
    isOnboardingOpen: false,

    clearSearchError: () => set({ searchError: null }),
    setCurrentView: (view: AppView) => {
      localStorage.setItem('codedna_view', view);
      set({ currentView: view });
    },
    setAnalyzerTab: (tab: AnalyzerTab) => set({ analyzerTab: tab }),
    setCareerMatchResult: (res: any) => set({ careerMatchResult: res }),
    setUserPreferences: (prefs: Partial<UserPreferences>) => {
      const updated = { ...get().userPreferences, ...prefs };
      localStorage.setItem('codedna_user_prefs', JSON.stringify(updated));
      set({ userPreferences: updated });
    },
    setSavedCourses: (courses: any[]) => set({ savedCourses: courses }),
    setCareerHistory: (history: any[]) => set({ careerHistory: history }),
    setIsOnboardingOpen: (open: boolean) => set({ isOnboardingOpen: open }),

    setActiveTab: (tab: NavTab) => set({ activeTab: tab }),

    toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    toggleTheme: () => {
      const nextDark = !get().isDarkMode;
      if (typeof document !== 'undefined') {
        if (nextDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
          if (document.body) document.body.classList.add('dark');
          localStorage.setItem('codedna_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
          if (document.body) document.body.classList.remove('dark');
          localStorage.setItem('codedna_theme', 'light');
        }
      }
      set({ isDarkMode: nextDark });
    },

    toggleCopilot: () => set(state => ({ isCopilotOpen: !state.isCopilotOpen })),

    toggleSettings: () => set(state => ({ isSettingsOpen: !state.isSettingsOpen })),

    setSearchQuery: () => {},

    searchDeveloper: async (username: string, isBenchmarkExplicit: boolean = false) => {
      const cleanU = username.trim().replace(/^@/, '');
      if (!cleanU) return;

      const reqId = ++searchSeqCounter;
      set({
        isSearching: true,
        searchError: null,
        activeSearchId: reqId,
        loadingStep: 1,
        loadingMessage: 'RESOLVING GITHUB IDENTITY...'
      });

      await new Promise(r => setTimeout(r, 120));
      if (get().activeSearchId !== reqId) return;
      set({ loadingStep: 2, loadingMessage: 'FETCHING REPOSITORIES...' });

      await new Promise(r => setTimeout(r, 120));
      if (get().activeSearchId !== reqId) return;
      set({ loadingStep: 3, loadingMessage: 'ANALYZING ARCHITECTURES & TECH...' });

      try {
        const newProfile = await GithubService.fetchProfile(cleanU, isBenchmarkExplicit);

        // Concurrency guard: verify this is still the active search
        if (get().activeSearchId !== reqId) return;

        set({
          profile: newProfile,
          isSearching: false,
          searchError: null,
          loadingStep: 6,
          loadingMessage: 'ANALYSIS COMPLETE'
        });
      } catch (err: any) {
        if (get().activeSearchId !== reqId) return;

        const rawMsg = err?.message || '';
        let errType = 'UNKNOWN';
        let userMessage = `Unable to analyze profile for "@${cleanU}". Please try again.`;

        if (rawMsg.includes('USER_NOT_FOUND') || rawMsg.includes('not found')) {
          errType = 'USER_NOT_FOUND';
          userMessage = `GitHub user "@${cleanU}" does not exist. Please check the spelling.`;
        } else if (rawMsg.includes('RATE_LIMIT_EXCEEDED') || rawMsg.includes('rate limit')) {
          errType = 'RATE_LIMIT_EXCEEDED';
          userMessage = `GitHub API hourly rate limit reached for this IP. Explore verified benchmark profiles or try again shortly.`;
        } else if (rawMsg.includes('NETWORK') || rawMsg.includes('reach')) {
          errType = 'NETWORK_ERROR';
          userMessage = `Unable to connect to GitHub. Please check your internet connection.`;
        }

        set({
          profile: null as any,
          isSearching: false,
          searchError: {
            type: errType,
            message: userMessage,
            username: cleanU
          },
          loadingStep: 0,
          loadingMessage: ''
        });
        return;
      }

      setTimeout(() => {
        if (get().activeSearchId === reqId) {
          set({ loadingStep: 0, loadingMessage: '' });
        }
      }, 300);
    },

    setComparisonDeveloper: async (username: string) => {
      const comp = await GithubService.fetchProfile(username);
      set({ comparisonProfile: comp });
    },

    sendCopilotMessage: async (text: string) => {
      if (!text.trim()) return;
      const currentHistory = get().chatMessages;
      const userMsg: ChatMessage = {
        id: String(Date.now()),
        sender: 'user',
        content: text,
        timestamp: 'Just now'
      };

      set({
        chatMessages: [...currentHistory, userMsg],
        isChatLoading: true
      });

      const res = await AIService.queryCopilot(text, get().profile, [...currentHistory, userMsg]);

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        content: res.response,
        timestamp: 'Just now',
        engine: res.engine
      };

      set(state => ({
        chatMessages: [...state.chatMessages, botMsg],
        isChatLoading: false
      }));
    },

    reviewRepository: async (repoName: string) => {
      set({ isCopilotOpen: true });
      await get().sendCopilotMessage(`Review repository "${repoName}": analyze architecture, security, and maintainability.`);
    }
  };
});

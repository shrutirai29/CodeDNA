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
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Actions
  setActiveTab: (tab: NavTab) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  toggleCopilot: () => void;
  setSearchQuery: (query: string) => void;
  searchDeveloper: (username: string) => Promise<void>;
  setComparisonDeveloper: (username: string) => Promise<void>;
  sendCopilotMessage: (text: string) => Promise<void>;
}

export const useDeveloperStore = create<DeveloperStore>((set, get) => {
  const savedTheme = localStorage.getItem('codedna_theme');
  const isDark = savedTheme ? savedTheme === 'dark' : false;
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const defaultProfile = BENCHMARK_PROFILES.shrutirai29;
  const defaultComparison = BENCHMARK_PROFILES.torvalds;

  return {
    profile: defaultProfile,
    comparisonProfile: defaultComparison,
    activeTab: 'overview',
    isSidebarCollapsed: false,
    isDarkMode: isDark,
    isSearching: false,
    loadingStep: 0,
    loadingMessage: '',
    isCopilotOpen: false,
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

    setActiveTab: (tab: NavTab) => set({ activeTab: tab }),

    toggleSidebar: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    toggleTheme: () => {
      const nextDark = !get().isDarkMode;
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('codedna_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('codedna_theme', 'light');
      }
      set({ isDarkMode: nextDark });
    },

    toggleCopilot: () => set(state => ({ isCopilotOpen: !state.isCopilotOpen })),

    setSearchQuery: () => {},

    searchDeveloper: async (username: string) => {
      if (!username.trim()) return;
      set({ isSearching: true, loadingStep: 1, loadingMessage: 'CONNECTING TO GITHUB...' });

      await new Promise(r => setTimeout(r, 220));
      set({ loadingStep: 2, loadingMessage: 'FETCHING PROFILE...' });

      await new Promise(r => setTimeout(r, 240));
      set({ loadingStep: 3, loadingMessage: 'SCANNING REPOSITORIES...' });

      await new Promise(r => setTimeout(r, 260));
      set({ loadingStep: 4, loadingMessage: 'ANALYZING LANGUAGES...' });

      await new Promise(r => setTimeout(r, 280));
      set({ loadingStep: 5, loadingMessage: 'CALCULATING DEVELOPER DNA...' });

      const newProfile = await GithubService.fetchProfile(username);

      await new Promise(r => setTimeout(r, 220));
      set({
        profile: newProfile,
        isSearching: false,
        loadingStep: 6,
        loadingMessage: 'ANALYSIS COMPLETE'
      });

      setTimeout(() => {
        set({ loadingStep: 0, loadingMessage: '' });
      }, 400);
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
    }
  };
});

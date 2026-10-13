import React, { useEffect } from 'react';
import { useDeveloperStore } from './store/useDeveloperStore';
import { GithubService } from './services/githubService';
import { CyberBackground } from './components/layout/CyberBackground';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoadingSequence } from './components/layout/LoadingSequence';
import { ProfileHeader } from './components/profile/ProfileHeader';
import { ScoreRing } from './components/profile/ScoreRing';
import { DimensionsGrid } from './components/profile/DimensionsGrid';
import { ArchetypeCard } from './components/profile/ArchetypeCard';
import { SkillRadar } from './components/charts/SkillRadar';
import { GrowthVelocity } from './components/charts/GrowthVelocity';
import { CodingRhythm } from './components/charts/CodingRhythm';
import { TechnologyDNA } from './components/tech/TechnologyDNA';
import { CareerMatch } from './components/career/CareerMatch';
import { NextBestSkill } from './components/career/NextBestSkill';
import { SkillSimulator } from './components/career/SkillSimulator';
import { RepositoryPortfolio } from './components/portfolio/RepositoryPortfolio';
import { DeveloperComparison } from './components/comparison/DeveloperComparison';
import { MotivationBanners } from './components/motivation/MotivationBanners';
import { Achievements } from './components/motivation/Achievements';
import { AICopilot } from './components/copilot/AICopilot';
import { FloatingSocialDock } from './components/layout/FloatingSocialDock';
import { FloatingNavDock } from './components/layout/FloatingNavDock';
import { SettingsModal } from './components/layout/SettingsModal';
import { AnalyticsExport } from './components/export/AnalyticsExport';
import { EmptyState } from './components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const { activeTab, isSidebarCollapsed, profile } = useDeveloperStore();

  useEffect(() => {
    // Automatically fetch fresh live profile data from GitHub API
    GithubService.fetchProfile(profile.username).then((live) => {
      if (live && live.username.toLowerCase() === profile.username.toLowerCase()) {
        useDeveloperStore.setState({ profile: live });
      }
    }).catch(() => {
      // Kept on authentic benchmark profile
    });
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-[#111827] dark:text-[#F8FAFC] flex transition-colors duration-200 relative selection:bg-indigo-500 selection:text-white">
      {/* 3D Subtle Three.js Constellation Background */}
      <CyberBackground />

      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10 ml-0 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-[230px]'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Dynamic 6-Step Loading Pipeline */}
        <LoadingSequence />

        {/* Content Area with Narrative Layout */}
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto space-y-6">
          {!profile ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW (Full Narrative Flow) */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* 1. WHO ARE YOU? -> Profile Header */}
                  <ProfileHeader />

                  {/* Motivational Micro-Banner */}
                  <MotivationBanners />

                  {/* 2. HOW STRONG ARE YOU? -> Score Ring + Archetype */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7">
                      <ScoreRing />
                    </div>
                    <div className="lg:col-span-5">
                      <ArchetypeCard />
                    </div>
                  </div>

                  {/* 6-Dimension Scoring Metric Cards */}
                  <DimensionsGrid />

                  {/* 3 & 4. WHAT ARE YOU GOOD AT? & WHAT TECHNOLOGIES DEFINE YOU? */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5">
                      <SkillRadar />
                    </div>
                    <div className="lg:col-span-7">
                      <NextBestSkill />
                    </div>
                  </div>

                  {/* Signature Technology DNA Constellation (3D Neural Galaxy + 2D) */}
                  <TechnologyDNA />

                  {/* Interactive Developer Skill Sandbox & Level-Up Simulator */}
                  <SkillSimulator />

                  {/* 5. WHERE DO YOU FIT? -> Career Match */}
                  <CareerMatch />

                  {/* 7. HOW ARE YOU GROWING? -> Growth Velocity & Coding Rhythm */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6">
                      <GrowthVelocity />
                    </div>
                    <div className="lg:col-span-6">
                      <CodingRhythm />
                    </div>
                  </div>

                  {/* 8. WHAT HAVE YOU BUILT? -> Repository Portfolio */}
                  <RepositoryPortfolio />

                  {/* Achievements Badges */}
                  <Achievements />
                </motion.div>
              )}

              {/* TAB 2: DEVELOPER DNA */}
              {activeTab === 'dna' && (
                <motion.div
                  key="dna"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <ProfileHeader />
                  <TechnologyDNA />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6">
                      <SkillRadar />
                    </div>
                    <div className="lg:col-span-6">
                      <NextBestSkill />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: CAREER INTELLIGENCE */}
              {activeTab === 'career' && (
                <motion.div
                  key="career"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <ProfileHeader />
                  <NextBestSkill />
                  <SkillSimulator />
                  <CareerMatch />
                </motion.div>
              )}

              {/* TAB 4: REPOSITORIES */}
              {activeTab === 'repositories' && (
                <motion.div
                  key="repositories"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <ProfileHeader />
                  <RepositoryPortfolio />
                </motion.div>
              )}

              {/* TAB 5: DEVELOPER COMPARISON */}
              {activeTab === 'comparison' && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <DeveloperComparison />
                </motion.div>
              )}

              {/* TAB 6: GROWTH ANALYTICS */}
              {activeTab === 'growth' && (
                <motion.div
                  key="growth"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <ProfileHeader />
                  <GrowthVelocity />
                  <CodingRhythm />
                  <Achievements />
                </motion.div>
              )}

              {/* TAB 7: ANALYTICS & EXPORT */}
              {activeTab === 'export' && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <ProfileHeader />
                  <AnalyticsExport />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Footer note */}
          <footer className="pt-8 pb-4 text-center font-mono text-[11px] text-[#94A3B8] border-t border-[#E2E8F0] dark:border-[#1E293B]">
            CodeDNA Developer Intelligence & GitHub Analytics Platform • “Understand the developer behind the code.”
          </footer>
        </main>
      </div>

      {/* Liquid Glass Floating Navigation Dock */}
      <FloatingNavDock />

      {/* Floating 3D Isometric Social Dock */}
      <FloatingSocialDock />

      {/* Floating AI Copilot Assistant */}
      <AICopilot />

      {/* Platform Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export default App;

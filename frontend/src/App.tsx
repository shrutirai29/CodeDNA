import React from 'react';
import { useDeveloperStore } from './store/useDeveloperStore';
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
import { RepositoryPortfolio } from './components/portfolio/RepositoryPortfolio';
import { DeveloperComparison } from './components/comparison/DeveloperComparison';
import { MotivationBanners } from './components/motivation/MotivationBanners';
import { Achievements } from './components/motivation/Achievements';
import { AICopilot } from './components/copilot/AICopilot';
import { AnalyticsExport } from './components/export/AnalyticsExport';
import { EmptyState } from './components/common/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const { activeTab, isSidebarCollapsed, profile } = useDeveloperStore();

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#070A0F] text-[#111827] dark:text-[#F8FAFC] flex transition-colors duration-200 relative selection:bg-indigo-500 selection:text-white">
      {/* 3D Subtle Three.js Constellation Background */}
      <CyberBackground />

      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-[230px]'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Dynamic 6-Step Loading Pipeline */}
        <LoadingSequence />

        {/* Content Area with Narrative Layout */}
        <main className="flex-1 mt-16 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
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

                  {/* Signature Technology DNA Constellation */}
                  <TechnologyDNA />

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

      {/* Floating AI Copilot Assistant */}
      <AICopilot />
    </div>
  );
};

export default App;

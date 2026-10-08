import React from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Compass, Sparkles, Terminal, Cpu, Fingerprint } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

export const ArchetypeCard: React.FC = () => {
  const { profile } = useDeveloperStore();
  const arch = profile.archetype;

  return (
    <TiltCard
      maxTilt={7}
      scale={1.01}
      className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative group cursor-pointer"
    >
      {/* 3D Iridescent Foil Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-cyan-500/5 to-purple-500/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Pass Header */}
      <div style={{ transform: 'translateZ(12px)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8]">
              <Compass size={16} />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
                Developer Archetype
              </h2>
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                <Fingerprint size={10} className="text-indigo-400" />
                HOLO-ID #{profile.username.slice(0, 6).toUpperCase()}-94
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 border border-indigo-300 dark:border-indigo-700 text-[10px] font-mono font-extrabold text-[#6366F1] dark:text-[#818CF8] shadow-2xs">
            {arch.badge}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono tracking-tight mb-2 flex items-center gap-2">
          {arch.title}
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
        </h3>

        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
          “{arch.description}”
        </p>

        {/* 3D Elevated Skill Chips */}
        <div className="flex flex-wrap gap-2 mb-4" style={{ transform: 'translateZ(22px)' }}>
          {arch.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#F1F5F9] dark:bg-[#161B22] text-[#334155] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xs hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Cyber Developer Workspace Holographic Terminal Canvas */}
      <div className="pt-2" style={{ transform: 'translateZ(16px)' }}>
        <div className="w-full h-24 rounded-xl bg-gradient-to-r from-indigo-950/5 via-cyan-950/5 to-purple-950/5 dark:from-indigo-950/40 dark:via-[#070A0F] dark:to-cyan-950/30 border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col justify-between p-3 relative overflow-hidden group-hover:border-indigo-500/40 transition-colors">
          {/* Subtle Cyber Grid scanline */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Top Bar of Holographic Terminal */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] relative z-10">
            <div className="flex items-center gap-1.5">
              <Terminal size={11} className="text-[#6366F1]" />
              <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">OCTOKIT // RUNTIME</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">SYNCHRONIZED</span>
            </div>
          </div>

          {/* Animated Syntax Footprint */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px]">
            <div className="space-y-0.5">
              <div className="text-[#64748B] dark:text-[#94A3B8] text-[10px] flex items-center gap-1">
                <Cpu size={10} className="text-cyan-500" />
                <span>ARCHETYPE MATRIX</span>
              </div>
              <div className="font-bold text-[#111827] dark:text-[#F8FAFC] tracking-wide">
                POLYGLOT ARCHITECTURAL SPEC
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] block">STRENGTH INDEX</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">{profile.dimensions.adaptability}/100</strong>
            </div>
          </div>

          {/* Bottom Watermark */}
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8] dark:text-[#64748B] relative z-10 border-t border-[#E2E8F0]/60 dark:border-[#1E293B] pt-1">
            <span className="flex items-center gap-1">
              <Sparkles size={9} className="text-amber-400" />
              Empirical Developer Persona
            </span>
            <span className="tracking-widest opacity-70">
              SHA256://8F9A...
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

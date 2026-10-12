import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Radar, Sparkles } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

interface RadarVertex {
  key: string;
  label: string;
  score: number;
  rating: string;
  peerDiff: string;
}

export const SkillRadar: React.FC = () => {
  const { profile } = useDeveloperStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dims = profile.dimensions;
  const vertices: RadarVertex[] = [
    { key: 'depth', label: 'Code Depth', score: dims.technical_depth, rating: 'Exceptional', peerDiff: '+7.4% vs peer average' },
    { key: 'variety', label: 'Tech Variety', score: dims.technical_breadth, rating: 'Advanced', peerDiff: '+5.2% vs peer average' },
    { key: 'habit', label: 'Habit', score: dims.consistency, rating: 'Very Consistent', peerDiff: '+6.1% vs peer average' },
    { key: 'projects', label: 'Projects', score: dims.project_complexity, rating: 'High Complexity', peerDiff: '+4.8% vs peer average' },
    { key: 'teamwork', label: 'Teamwork', score: dims.collaboration, rating: 'Collaborative', peerDiff: '+3.1% vs peer average' },
    { key: 'learning', label: 'Learning', score: dims.adaptability, rating: 'Rapid Learner', peerDiff: '+8.3% vs peer average' },
    { key: 'impact', label: 'Impact', score: dims.impact, rating: 'High Reach', peerDiff: '+6.9% vs peer average' },
  ];

  const size = 320;
  const center = size / 2;
  const maxRadius = 110;
  const total = vertices.length;

  // Compute polygon points
  const points = vertices.map((v, i) => {
    const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
    const r = (v.score / 100) * maxRadius;
    const x = center + Math.cos(angle) * r;
    const y = center + Math.sin(angle) * r;
    return { x, y, angle };
  });

  const polygonPointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid concentric rings
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <TiltCard
      maxTilt={6}
      scale={1.01}
      className="p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Radar size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Skill Radar (7-Axis Vector)
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
          Hover vertex to inspect
        </span>
      </div>

      {/* Interactive Radar SVG */}
      <div className="relative flex items-center justify-center my-2">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.25" />
            </linearGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366F1" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Concentric Web Rings */}
          {gridLevels.map((lvl) => {
            const r = maxRadius * lvl;
            const ringPts = Array.from({ length: total }, (_, i) => {
              const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
              return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
            }).join(' ');

            return (
              <polygon
                key={lvl}
                points={ringPts}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-[#E2E8F0] dark:text-[#1E293B]"
                strokeDasharray={lvl === 1 ? 'none' : '3 3'}
              />
            );
          })}

          {/* Axis Radial Lines */}
          {vertices.map((_, i) => {
            const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
            const x2 = center + Math.cos(angle) * maxRadius;
            const y2 = center + Math.sin(angle) * maxRadius;
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-[#E2E8F0] dark:text-[#1E293B]"
              />
            );
          })}

          {/* Filled Area Polygon */}
          <polygon
            points={polygonPointsStr}
            fill="url(#radarFill)"
            stroke="#6366F1"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            className="transition-all duration-500 ease-out"
          />

          {/* Vertices Interactive Points & Labels */}
          {vertices.map((v, i) => {
            const p = points[i];
            const labelDist = maxRadius + 20;
            const labelX = center + Math.cos(p.angle) * labelDist;
            const labelY = center + Math.sin(p.angle) * labelDist;
            const isHovered = hoveredIndex === i;

            return (
              <g key={v.key} className="cursor-pointer">
                {/* Vertex Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : 4.5}
                  fill={isHovered ? '#06B6D4' : '#6366F1'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-200"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Text Label */}
                <text
                  x={labelX}
                  y={labelY + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-mono select-none transition-colors ${
                    isHovered
                      ? 'fill-[#6366F1] dark:fill-[#818CF8] font-bold'
                      : 'fill-[#64748B] dark:fill-[#94A3B8] font-medium'
                  }`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {v.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoveredIndex !== null && (
          <div className="absolute top-2 right-2 p-3 rounded-xl glass-panel border border-indigo-500/40 shadow-xl text-xs font-mono z-20 pointer-events-none transition-all">
            <div className="font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center justify-between gap-4">
              <span>{vertices[hoveredIndex].label}</span>
              <span className="text-[#6366F1] dark:text-[#818CF8]">
                {vertices[hoveredIndex].score} / 100
              </span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Rating: {vertices[hoveredIndex].rating}
            </div>
            <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              {vertices[hoveredIndex].peerDiff}
            </div>
          </div>
        )}
      </div>

      {/* Footer Benchmark Note */}
      <div className="pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-amber-500" />
          Balanced Polyglot Profile
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
          High Breadth & Depth
        </span>
      </div>
    </TiltCard>
  );
};

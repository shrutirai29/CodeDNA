import React, { useState } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Dna } from 'lucide-react';
import type { TechnologyNode } from '../../types/developer';

export const TechnologyDNA: React.FC = () => {
  const { profile } = useDeveloperStore();
  const nodes = profile.tech_dna;
  const [hoveredNode, setHoveredNode] = useState<TechnologyNode | null>(null);

  const cx = 310;
  const cy = 180;
  const rx = 220;
  const ry = 125;
  const total = nodes.length;

  const positionedNodes = nodes.map((n, i) => {
    const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;

    const pillW = Math.max(104, n.name.length * 7.5 + 46);
    const pillH = 28;

    return {
      ...n,
      x,
      y,
      pillW,
      pillH
    };
  });

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Dna size={18} className="text-[#6366F1] dark:text-[#818CF8]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
            Technology DNA Constellation
          </h2>
        </div>
        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          {nodes.length} Stacks Audited • Zero "Other" Nodes
        </span>
      </div>

      {/* Live Inspector Strip */}
      <div className="h-14 p-3 px-4 rounded-xl bg-[#F7F9FC] dark:bg-[#070A0F] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-mono flex items-center justify-between mb-2">
        {hoveredNode ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: hoveredNode.color || '#6366F1' }}
              />
              <span className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">
                {hoveredNode.name}
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Code Share: <strong className="text-[#6366F1] dark:text-[#818CF8]">{hoveredNode.usage}%</strong>
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Audited Projects: <strong className="text-[#111827] dark:text-[#F8FAFC]">{hoveredNode.projects}</strong>
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Repos: <strong className="text-[#111827] dark:text-[#F8FAFC]">{hoveredNode.repositories}</strong>
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                hoveredNode.momentum === 'RISING'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : hoveredNode.momentum === 'NEW'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-[#6366F1] dark:text-[#818CF8] border-indigo-200 dark:border-indigo-800'
              }`}
            >
              {hoveredNode.momentum === 'RISING'
                ? '↑ ACCELERATING'
                : hoveredNode.momentum === 'NEW'
                ? '✦ NEW TECH'
                : '→ STABLE'}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-[#64748B] dark:text-[#94A3B8]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-ping" />
              Hover over any technology node to inspect project share, code mass & momentum
            </span>
            <span className="text-[10px] text-[#94A3B8]">INTERACTIVE GRAPH</span>
          </div>
        )}
      </div>

      {/* SVG Interactive Constellation Canvas */}
      <div className="w-full h-88 flex items-center justify-center relative overflow-visible">
        <svg viewBox="0 0 620 360" className="w-full h-full overflow-visible select-none">
          <defs>
            <filter id="dnaNodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Central Developer Core Hub */}
          <circle cx={cx} cy={cy} r="38" fill="none" stroke="#6366F1" strokeOpacity="0.25" strokeWidth="1.5" />
          <circle
            cx={cx}
            cy={cy}
            r="30"
            className="fill-white dark:fill-[#0D1117] stroke-[#6366F1] dark:stroke-[#818CF8]"
            strokeWidth="2.5"
            filter="url(#dnaNodeGlow)"
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            className="font-mono text-[9px] font-bold fill-[#111827] dark:fill-[#F8FAFC] tracking-wider"
          >
            CODEDNA
          </text>

          {/* Connector Lines */}
          {positionedNodes.map((node) => {
            const parentNode = node.parent ? positionedNodes.find(p => p.id === node.parent) : null;
            const targetX = parentNode ? parentNode.x : cx;
            const targetY = parentNode ? parentNode.y : cy;

            return (
              <line
                key={`line-${node.id}`}
                x1={targetX}
                y1={targetY}
                x2={node.x}
                y2={node.y}
                stroke={node.color || '#6366F1'}
                strokeOpacity={parentNode ? '0.45' : '0.25'}
                strokeWidth={parentNode ? '2' : '1.5'}
                strokeDasharray={parentNode ? '4 3' : 'none'}
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* Interactive Technology Node Pills */}
          {positionedNodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const strokeColor = node.color || '#6366F1';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Pill Background Rect */}
                <rect
                  x={-node.pillW / 2}
                  y={-node.pillH / 2}
                  width={node.pillW}
                  height={node.pillH}
                  rx="14"
                  className="fill-white dark:fill-[#161B22] transition-all"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                  filter={isHovered ? 'url(#dnaNodeGlow)' : undefined}
                />

                {/* Status Dot */}
                <circle
                  cx={-node.pillW / 2 + 13}
                  cy="0"
                  r="3.5"
                  fill={strokeColor}
                  style={{ pointerEvents: 'none' }}
                />

                {/* Tech Name */}
                <text
                  x={-node.pillW / 2 + 23}
                  y="3.5"
                  className="text-[10.5px] font-semibold fill-[#111827] dark:fill-[#F8FAFC]"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.name}
                </text>

                {/* Usage Percentage */}
                <text
                  x={node.pillW / 2 - 10}
                  y="3.5"
                  textAnchor="end"
                  className="text-[9px] font-mono font-bold fill-[#64748B] dark:fill-[#94A3B8]"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.usage}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Momentum Legend */}
      <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ↑ Accelerating Momentum
          </span>
          <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            ✦ New Stack Adoption
          </span>
          <span className="flex items-center gap-1.5 text-indigo-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            → Stable Primary
          </span>
        </div>

        <span className="text-[10px] text-[#94A3B8]">Parent-child graph topology</span>
      </div>
    </div>
  );
};

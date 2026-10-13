import React, { useState, useRef, useEffect } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { Dna, Box, CircleDot, RotateCcw } from 'lucide-react';
import type { TechnologyNode } from '../../types/developer';
import { ThreeGalaxyView } from './ThreeGalaxyView';
import { RockerSwitch } from '../common/RockerSwitch';

export const TechnologyDNA: React.FC = () => {
  const { profile } = useDeveloperStore();
  const nodes = profile.tech_dna;
  const [hoveredNode, setHoveredNode] = useState<TechnologyNode | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [custom2DPositions, setCustom2DPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [dragging2DId, setDragging2DId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Reset custom 2D positions when developer profile changes
  useEffect(() => {
    setCustom2DPositions({});
  }, [profile.username]);

  const cx = 310;
  const cy = 180;
  const rx = 220;
  const ry = 125;
  const total = Math.max(1, nodes.length);

  const positionedNodes = nodes.map((n, i) => {
    const angle = ((Math.PI * 2) / total) * i - Math.PI / 2;
    const defaultX = cx + Math.cos(angle) * rx;
    const defaultY = cy + Math.sin(angle) * ry;
    const customPos = custom2DPositions[n.id];

    const pillW = Math.max(114, n.name.length * 7.5 + 54);
    const pillH = 30;

    return {
      ...n,
      x: customPos ? customPos.x : defaultX,
      y: customPos ? customPos.y : defaultY,
      pillW,
      pillH
    };
  });

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging2DId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 620 / (rect.width || 620);
    const scaleY = 360 / (rect.height || 360);
    const nx = Math.max(60, Math.min(560, (e.clientX - rect.left) * scaleX));
    const ny = Math.max(24, Math.min(336, (e.clientY - rect.top) * scaleY));
    setCustom2DPositions(prev => ({
      ...prev,
      [dragging2DId]: { x: nx, y: ny }
    }));
  };

  const handleSvgMouseUp = () => {
    setDragging2DId(null);
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative group">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8]">
            <Dna size={16} />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC]">
              Technology DNA Constellation
            </h2>
            <p className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
              Interactive Movable Multi-Stack Neural Graph
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Audited Count */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl glass-panel">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === '2d'
                  ? 'glass-pill text-[#6366F1] dark:text-[#818CF8] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <CircleDot size={12} />
              2D ORBIT
            </button>
            <RockerSwitch
              checked={viewMode === '3d'}
              onChange={(chk) => setViewMode(chk ? '3d' : '2d')}
              leftLabel="2D"
              rightLabel="3D"
              size="xs"
              title="Toggle 2D Orbit Map vs 3D Neural Galaxy"
            />
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'glass-pill text-[#6366F1] dark:text-[#818CF8] shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <Box size={12} />
              3D GALAXY
            </button>
          </div>

          <span className="hidden md:inline-block text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            {nodes.length} Stacks Audited
          </span>
        </div>
      </div>

      {/* Live Cyber Inspector Strip */}
      <div className="min-h-14 p-3 px-4 rounded-xl glass-panel text-xs font-mono flex items-center justify-between mb-3 shadow-2xs">
        {hoveredNode ? (
          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: hoveredNode.color || '#6366F1' }}
              />
              <span className="font-extrabold text-sm text-[#111827] dark:text-[#F8FAFC]">
                {hoveredNode.name}
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Code Share: <strong className="text-[#6366F1] dark:text-[#818CF8]">{hoveredNode.usage}%</strong>
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Audited Projects: <strong className="text-[#111827] dark:text-[#F8FAFC]">{hoveredNode.projects}</strong>
              </span>
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Repositories: <strong className="text-[#111827] dark:text-[#F8FAFC]">{hoveredNode.repositories}</strong>
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
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
              {viewMode === '3d'
                ? 'Drag any node or label to move it • Drag background to rotate/pan the 3D galaxy'
                : 'Drag any technology node to reposition it • Hover to inspect project share & momentum'}
            </span>
            <span className="text-[10px] text-[#94A3B8] font-bold tracking-wider">
              {viewMode === '3d' ? 'WEBGL ACCELERATED' : 'INTERACTIVE 2D'}
            </span>
          </div>
        )}
      </div>

      {/* Main View Area: 3D Three.js Galaxy or 2D Vector Map */}
      {viewMode === '3d' ? (
        <ThreeGalaxyView
          nodes={nodes}
          selectedNode={hoveredNode}
          onSelectNode={setHoveredNode}
        />
      ) : (
        /* SVG 2D Constellation Canvas (Draggable Nodes) */
        <div className="w-full h-96 flex items-center justify-center relative overflow-hidden rounded-xl glass-panel">
          {Object.keys(custom2DPositions).length > 0 && (
            <button
              onClick={() => setCustom2DPositions({})}
              className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#0D1117]/90 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <RotateCcw size={11} />
              Reset Layout
            </button>
          )}
          <svg
            ref={svgRef}
            viewBox="0 0 620 360"
            className="w-full h-full overflow-visible select-none"
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseUp}
          >
            <defs>
              <filter id="dnaNodeGlow2D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Central Developer Core Hub */}
            <circle cx={cx} cy={cy} r="38" fill="none" stroke="#6366F1" strokeOpacity="0.3" strokeWidth="1.5" />
            <circle
              cx={cx}
              cy={cy}
              r="30"
              className="fill-white dark:fill-[#0D1117] stroke-[#6366F1] dark:stroke-[#818CF8]"
              strokeWidth="2.5"
              filter="url(#dnaNodeGlow2D)"
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              className="font-mono text-[11px] font-extrabold fill-[#6366F1] dark:fill-[#818CF8]"
            >
              CORE DNA
            </text>

            {/* Parent-Child Relationships */}
            {positionedNodes.map((childNode) => {
              if (!childNode.parent) return null;
              const parentNode = positionedNodes.find(
                (p) =>
                  p.id.toLowerCase() === childNode.parent?.toLowerCase() ||
                  p.name.toLowerCase() === childNode.parent?.toLowerCase()
              );
              if (!parentNode) return null;

              return (
                <line
                  key={`dep-${childNode.id}-${parentNode.id}`}
                  x1={parentNode.x}
                  y1={parentNode.y}
                  x2={childNode.x}
                  y2={childNode.y}
                  stroke="#06B6D4"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.75"
                />
              );
            })}

            {/* Core to Node Laser Connections */}
            {positionedNodes.map((node) => {
              const isTargeted = hoveredNode?.id === node.id;
              return (
                <line
                  key={`link-${node.id}`}
                  x1={cx}
                  y1={cy}
                  x2={node.x}
                  y2={node.y}
                  stroke={node.color || '#6366F1'}
                  strokeWidth={isTargeted ? 2.8 : 1.6}
                  strokeOpacity={isTargeted ? 0.95 : 0.45}
                  className="transition-all duration-150"
                />
              );
            })}

            {/* Technology Nodes (Draggable) */}
            {positionedNodes.map((node) => {
              const isHovered = hoveredNode?.id === node.id;
              const rx_pill = node.x - node.pillW / 2;
              const ry_pill = node.y - node.pillH / 2;

              return (
                <g
                  key={node.id}
                  className="cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDragging2DId(node.id);
                    setHoveredNode(node);
                  }}
                  onMouseEnter={() => setHoveredNode(node)}
                >
                  <rect
                    x={rx_pill}
                    y={ry_pill}
                    width={node.pillW}
                    height={node.pillH}
                    rx="15"
                    className={
                      isHovered
                        ? 'fill-white dark:fill-[#161B22]'
                        : 'fill-white/95 dark:fill-[#0D1117]/95'
                    }
                    stroke={node.color || '#6366F1'}
                    strokeWidth={isHovered ? 2.5 : 1.8}
                    filter="url(#dnaNodeGlow2D)"
                  />

                  {/* Brand Color Dot */}
                  <circle
                    cx={rx_pill + 14}
                    cy={node.y}
                    r={isHovered ? 5 : 4.5}
                    fill={node.color || '#6366F1'}
                  />

                  {/* Technology Name */}
                  <text
                    x={rx_pill + 25}
                    y={node.y + 4}
                    className="font-sans text-[11px] font-extrabold fill-slate-900 dark:fill-white"
                  >
                    {node.name}
                  </text>

                  {/* Usage Badge */}
                  <text
                    x={rx_pill + node.pillW - 10}
                    y={node.y + 3.5}
                    textAnchor="end"
                    className="font-mono text-[10px] font-bold fill-indigo-600 dark:fill-indigo-300"
                  >
                    {node.usage}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Footer Stack Depth Bar */}
      <div className="mt-4 pt-3 border-t border-white/40 dark:border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8] gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Accelerating: {nodes.filter(n => n.momentum === 'RISING').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            New Tech: {nodes.filter(n => n.momentum === 'NEW').length}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Stable: {nodes.filter(n => n.momentum === 'STABLE').length}
          </span>
        </div>

        <span className="text-[11px] text-[#94A3B8]">
          Stack Depth: <strong className="text-[#111827] dark:text-[#F8FAFC]">{profile.dimensions.technical_breadth} / 100</strong>
        </span>
      </div>
    </div>
  );
};

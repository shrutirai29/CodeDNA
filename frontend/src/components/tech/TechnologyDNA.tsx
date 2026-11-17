import React, { useState, useRef, Suspense } from 'react';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import {
  Dna,
  Box,
  CircleDot,
  RotateCcw,
  LayoutGrid,
  GitBranch
} from 'lucide-react';
import type { TechnologyNode } from '../../types/developer';

const ThreeGalaxyView = React.lazy(() =>
  import('./ThreeGalaxyView').then((m) => ({ default: m.ThreeGalaxyView }))
);

type TechViewMode = 'orbit' | 'matrix' | '3d';
type MatrixFilter = 'all' | 'primary' | 'framework' | 'supporting';

export const TechnologyDNA: React.FC = () => {
  const { profile, isDarkMode } = useDeveloperStore();
  const nodes = profile.tech_dna;
  const [hoveredNode, setHoveredNode] = useState<TechnologyNode | null>(null);
  const [viewMode, setViewMode] = useState<TechViewMode>('orbit');
  const [matrixFilter, setMatrixFilter] = useState<MatrixFilter>('all');
  const [custom2DPositions, setCustom2DPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [dragging2DId, setDragging2DId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Synchronously reset custom 2D positions when developer profile changes
  const [prevUsername, setPrevUsername] = useState(profile.username);
  if (prevUsername !== profile.username) {
    setPrevUsername(profile.username);
    setCustom2DPositions({});
  }

  // 2D Constellation Geometry
  const cx = 380;
  const cy = 220;
  const total = Math.max(1, nodes.length);

  const positionedNodes = nodes.map((n, i) => {
    const angle = ((Math.PI * 2) / total) * i - Math.PI / 2;

    // Smart radial tiering based on usage and stack role
    let baseRx = 230;
    let baseRy = 145;

    if (n.usage >= 20 || n.type === 'primary') {
      baseRx = 165;
      baseRy = 105;
    } else if (n.usage < 13 || n.type === 'supporting' || n.type === 'secondary') {
      baseRx = 295;
      baseRy = 185;
    } else {
      baseRx = 230;
      baseRy = 145;
    }

    // Stagger adjacent nodes slightly to guarantee zero radial collisions
    const stagger = (i % 2 === 0 ? 1 : -1) * 12;
    const finalRx = baseRx + stagger;
    const finalRy = baseRy + stagger * 0.65;

    const defaultX = Math.round(cx + Math.cos(angle) * finalRx);
    const defaultY = Math.round(cy + Math.sin(angle) * finalRy);
    const customPos = custom2DPositions[n.id];

    const pillW = Math.max(122, Math.round(n.name.length * 8 + 58));
    const pillH = 32;

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
    const scaleX = 760 / (rect.width || 760);
    const scaleY = 440 / (rect.height || 440);
    const nx = Math.max(70, Math.min(690, (e.clientX - rect.left) * scaleX));
    const ny = Math.max(30, Math.min(410, (e.clientY - rect.top) * scaleY));
    setCustom2DPositions(prev => ({
      ...prev,
      [dragging2DId]: { x: Math.round(nx), y: Math.round(ny) }
    }));
  };

  const handleSvgMouseUp = () => {
    setDragging2DId(null);
  };

  const filteredMatrixNodes = nodes.filter(n => {
    if (matrixFilter === 'all') return true;
    if (matrixFilter === 'primary') return n.type === 'primary';
    if (matrixFilter === 'framework') return n.type === 'framework';
    if (matrixFilter === 'supporting') return n.type === 'supporting' || n.type === 'secondary';
    return true;
  });

  const risingCount = nodes.filter(n => n.momentum === 'RISING').length;
  const newCount = nodes.filter(n => n.momentum === 'NEW').length;
  const stableCount = nodes.filter(n => n.momentum === 'STABLE').length;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative group border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8] shadow-2xs">
            <Dna size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Technology DNA
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold">
                2D Architecture
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Developer stack architecture, dependency links & momentum metrics
            </p>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold">
            <button
              onClick={() => setViewMode('orbit')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'orbit'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Clean 2D Radial Constellation Map"
            >
              <CircleDot size={13} />
              Orbit (2D)
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Clean 2D Stack Breakdown Grid"
            >
              <LayoutGrid size={13} />
              Stack Grid
            </button>

            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Experimental 3D WebGL Galaxy"
            >
              <Box size={13} />
              3D Galaxy
            </button>
          </div>

          <span className="hidden lg:inline-block text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
            {nodes.length} Stacks Audited
          </span>
        </div>
      </div>

      {/* Live Inspector Strip */}
      <div className="min-h-13 p-3 px-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono flex items-center justify-between mb-4 shadow-2xs">
        {hoveredNode ? (
          <div className="flex flex-wrap items-center justify-between w-full gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs ring-2 ring-white dark:ring-slate-900"
                style={{ backgroundColor: hoveredNode.color || '#6366F1' }}
              />
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {hoveredNode.name}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Code Share: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{hoveredNode.usage}%</strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Audited Projects: <strong className="text-slate-900 dark:text-white font-bold">{hoveredNode.projects}</strong>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Repositories: <strong className="text-slate-900 dark:text-white font-bold">{hoveredNode.repositories}</strong>
              </span>
              {hoveredNode.parent && (
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <GitBranch size={12} className="text-cyan-500" />
                  Ecosystem of: <strong className="text-cyan-600 dark:text-cyan-400 capitalize">{hoveredNode.parent}</strong>
                </span>
              )}
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
                hoveredNode.momentum === 'RISING'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : hoveredNode.momentum === 'NEW'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
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
          <div className="flex items-center justify-between w-full text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              {viewMode === 'orbit'
                ? 'Hover any technology node to inspect telemetry • Drag to reposition and arrange custom layout'
                : viewMode === 'matrix'
                ? 'Reviewing structured technology stack breakdown • Click any stack to inspect metrics'
                : '3D Neural Galaxy active • Drag to pan and inspect multi-stack spatial architecture'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase">
              {viewMode === 'orbit' ? 'CLEAN 2D ORBIT' : viewMode === 'matrix' ? 'STACK MATRIX' : '3D WEBGL'}
            </span>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {viewMode === 'orbit' ? (
        /* MODE 1: 2D Radial Constellation Canvas */
        <div className="w-full h-[320px] sm:h-[430px] flex items-center justify-center relative overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80">
          {Object.keys(custom2DPositions).length > 0 && (
            <button
              onClick={() => setCustom2DPositions({})}
              className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              Reset Layout
            </button>
          )}

          <svg
            ref={svgRef}
            viewBox="0 0 760 440"
            className="w-full h-full overflow-visible select-none"
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseUp}
          >
            <defs>
              <filter id="dnaPillShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.10" />
              </filter>
              <filter id="dnaCoreShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Concentric Orbital Architecture Guides */}
            <ellipse
              cx={cx}
              cy={cy}
              rx="165"
              ry="105"
              fill="none"
              stroke={isDarkMode ? '#334155' : '#E2E8F0'}
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.75"
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx="230"
              ry="145"
              fill="none"
              stroke={isDarkMode ? '#334155' : '#E2E8F0'}
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.55"
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx="295"
              ry="185"
              fill="none"
              stroke={isDarkMode ? '#334155' : '#E2E8F0'}
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeOpacity="0.4"
            />

            {/* Subtle Orbit Watermark Tier Badges */}
            <text
              x={cx - 165 + 12}
              y={cy - 5}
              className="font-mono text-[9px] font-bold fill-indigo-400/50 dark:fill-indigo-400/40 select-none tracking-wider"
            >
              CORE STACK
            </text>
            <text
              x={cx - 230 + 12}
              y={cy - 5}
              className="font-mono text-[9px] font-bold fill-indigo-400/50 dark:fill-indigo-400/40 select-none tracking-wider"
            >
              FRAMEWORKS
            </text>
            <text
              x={cx - 295 + 12}
              y={cy - 5}
              className="font-mono text-[9px] font-bold fill-indigo-400/50 dark:fill-indigo-400/40 select-none tracking-wider"
            >
              ECOSYSTEM
            </text>

            {/* Parent-Child Architectural Dependency Links (e.g. React -> JavaScript, FastAPI -> Python) */}
            {positionedNodes.map((childNode) => {
              if (!childNode.parent) return null;
              const parentNode = positionedNodes.find(
                (p) =>
                  p.id.toLowerCase() === childNode.parent?.toLowerCase() ||
                  p.name.toLowerCase() === childNode.parent?.toLowerCase()
              );
              if (!parentNode) return null;

              const isConnected =
                hoveredNode?.id === childNode.id || hoveredNode?.id === parentNode.id;

              return (
                <line
                  key={`dep-${childNode.id}-${parentNode.id}`}
                  x1={parentNode.x}
                  y1={parentNode.y}
                  x2={childNode.x}
                  y2={childNode.y}
                  stroke={isConnected ? '#0284C7' : '#0EA5E9'}
                  strokeWidth={isConnected ? 2.4 : 1.6}
                  strokeDasharray="4 4"
                  strokeOpacity={isConnected ? 0.95 : 0.65}
                  className="transition-all duration-150"
                />
              );
            })}

            {/* Laser Vectors from Central Core Hub to Each Node */}
            {positionedNodes.map((node) => {
              const isTargeted = hoveredNode?.id === node.id;
              const nodeColor = node.color || '#6366F1';
              return (
                <line
                  key={`link-${node.id}`}
                  x1={cx}
                  y1={cy}
                  x2={node.x}
                  y2={node.y}
                  stroke={nodeColor}
                  strokeWidth={isTargeted ? 2.6 : 1.4}
                  strokeOpacity={isTargeted ? 0.95 : 0.35}
                  className="transition-all duration-150"
                />
              );
            })}

            {/* Central Developer Core Hub */}
            <g className="select-none">
              <circle
                cx={cx}
                cy={cy}
                r="44"
                fill="none"
                stroke="#6366F1"
                strokeOpacity="0.2"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle
                cx={cx}
                cy={cy}
                r="36"
                fill={isDarkMode ? '#0F172A' : '#FFFFFF'}
                stroke="#6366F1"
                strokeWidth="2.5"
                filter="url(#dnaCoreShadow)"
              />
              <text
                x={cx}
                y={cy - 2}
                textAnchor="middle"
                className="font-mono text-[11px] font-extrabold fill-[#6366F1] dark:fill-[#818CF8]"
              >
                CORE DNA
              </text>
              <text
                x={cx}
                y={cy + 13}
                textAnchor="middle"
                className="font-mono text-[8px] font-bold fill-slate-500 dark:fill-slate-400 tracking-wider"
              >
                {nodes.length} STACKS
              </text>
            </g>

            {/* Technology Node Pills (Draggable & Hoverable) */}
            {positionedNodes.map((node) => {
              const isHovered = hoveredNode?.id === node.id;
              const rx_pill = node.x - node.pillW / 2;
              const ry_pill = node.y - node.pillH / 2;
              const nodeColor = node.color || '#6366F1';

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
                  {/* Pill Background Container */}
                  <rect
                    x={rx_pill}
                    y={ry_pill}
                    width={node.pillW}
                    height={node.pillH}
                    rx="16"
                    fill={isDarkMode ? '#0F172A' : '#FFFFFF'}
                    stroke={isHovered ? nodeColor : isDarkMode ? '#334155' : '#E2E8F0'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    filter="url(#dnaPillShadow)"
                    className="transition-all duration-150"
                  />

                  {/* Brand Color Dot */}
                  <circle
                    cx={rx_pill + 16}
                    cy={node.y}
                    r={isHovered ? 5.5 : 4.5}
                    fill={nodeColor}
                  />

                  {/* Technology Name */}
                  <text
                    x={rx_pill + 28}
                    y={node.y + 4}
                    className="font-sans text-[11px] font-bold fill-slate-900 dark:fill-white"
                  >
                    {node.name}
                  </text>

                  {/* Usage Share Percentage */}
                  <text
                    x={rx_pill + node.pillW - 12}
                    y={node.y + 3.8}
                    textAnchor="end"
                    className="font-mono text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400"
                  >
                    {node.usage}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : viewMode === 'matrix' ? (
        /* MODE 2: Clean 2D Stack Breakdown Grid */
        <div className="w-full flex flex-col gap-4">
          {/* Filter Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMatrixFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                matrixFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Stacks ({nodes.length})
            </button>
            <button
              onClick={() => setMatrixFilter('primary')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                matrixFilter === 'primary'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Primary Languages ({nodes.filter(n => n.type === 'primary').length})
            </button>
            <button
              onClick={() => setMatrixFilter('framework')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                matrixFilter === 'framework'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Frameworks ({nodes.filter(n => n.type === 'framework').length})
            </button>
            <button
              onClick={() => setMatrixFilter('supporting')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                matrixFilter === 'supporting'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Supporting & Tools ({nodes.filter(n => n.type === 'supporting' || n.type === 'secondary').length})
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMatrixNodes.map((tech) => {
              const isHovered = hoveredNode?.id === tech.id;
              const techColor = tech.color || '#6366F1';

              return (
                <div
                  key={tech.id}
                  onMouseEnter={() => setHoveredNode(tech)}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? 'bg-white dark:bg-slate-800/90 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-50/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/70'
                  } border-slate-200/80 dark:border-slate-800`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: techColor }}
                      />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {tech.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tech.momentum === 'RISING'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                          : tech.momentum === 'NEW'
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      {tech.momentum === 'RISING'
                        ? '↑ Accelerating'
                        : tech.momentum === 'NEW'
                        ? '✦ New Tech'
                        : '→ Stable'}
                    </span>
                  </div>

                  {/* Code Share Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                      <span>Code Share</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{tech.usage}%</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, tech.usage * 2.8)}%`,
                          backgroundColor: techColor
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Metrics Footer */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span>{tech.projects} Projects</span>
                    <span>{tech.repositories} Repositories</span>
                    <span className="capitalize">{tech.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODE 3: Optional 3D Galaxy Engine */
        <Suspense
          fallback={
            <div className="w-full h-[430px] flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950/40 text-slate-400 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="font-mono text-xs text-slate-400">Loading 3D Galaxy Engine...</span>
            </div>
          }
        >
          <ThreeGalaxyView
            nodes={nodes}
            selectedNode={hoveredNode}
            onSelectNode={setHoveredNode}
            onWebGLUnavailable={() => setViewMode('orbit')}
          />
        </Suspense>
      )}

      {/* Footer Metrics Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Accelerating: <strong className="text-slate-900 dark:text-white">{risingCount}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            New Tech: <strong className="text-slate-900 dark:text-white">{newCount}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Stable: <strong className="text-slate-900 dark:text-white">{stableCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Stack Breadth:</span>
          <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            {profile.dimensions.technical_breadth} / 100
          </span>
        </div>
      </div>
    </div>
  );
};

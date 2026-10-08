import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { TechnologyNode } from '../../types/developer';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ThreeGalaxyViewProps {
  nodes: TechnologyNode[];
  selectedNode: TechnologyNode | null;
  onSelectNode: (node: TechnologyNode | null) => void;
}

// Universal rounded rectangle drawer for HTML5 Canvas
const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

// Compute high-contrast line color for Light Mode
const getVisibleLineColor = (hex: string, isDark: boolean): number => {
  if (isDark) {
    return parseInt(hex.replace('#', '0x'), 16);
  }
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // Darken bright colors (yellow, light cyan, lime) so lines pop boldly on light backgrounds
  if (brightness > 150) {
    const darkR = Math.round(r * 0.52);
    const darkG = Math.round(g * 0.52);
    const darkB = Math.round(b * 0.52);
    return (darkR << 16) + (darkG << 8) + darkB;
  }
  return parseInt(hex.replace('#', '0x'), 16);
};

export const ThreeGalaxyView: React.FC<ThreeGalaxyViewProps> = ({
  nodes,
  selectedNode,
  onSelectNode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDeveloperStore();
  const [zoomLevelPercent, setZoomLevelPercent] = useState<number>(100);

  // Zoom control refs accessible by external button clicks
  const zoomControlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
  }>({
    zoomIn: () => {},
    zoomOut: () => {},
    resetView: () => {}
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const DEFAULT_ZOOM = 82;
    const MIN_ZOOM = 26;
    const MAX_ZOOM = 160;

    let targetZoom = DEFAULT_ZOOM;
    camera.position.set(0, 0, DEFAULT_ZOOM);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. High-Fidelity 3D Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 1.4 : 1.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDarkMode ? 1.1 : 1.5);
    dirLight.position.set(30, 50, 45);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x6366f1, isDarkMode ? 2.6 : 2.0, 140);
    pointLight.position.set(0, 0, 45);
    scene.add(pointLight);

    // 3. Central Core Node (Developer Identity Core)
    const coreGeo = new THREE.SphereGeometry(3.8, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x6366f1 : 0x4f46e5,
      emissive: isDarkMode ? 0x6366f1 : 0x4338ca,
      emissiveIntensity: isDarkMode ? 0.6 : 0.35,
      roughness: 0.25,
      metalness: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Glowing Central Orbital Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x818cf8 : 0x4f46e5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDarkMode ? 0.45 : 0.4
    });
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(5.4, 5.9, 36), ringMat1);
    scene.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x06b6d4 : 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDarkMode ? 0.35 : 0.3
    });
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(7.4, 7.8, 36), ringMat2);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // Core Identity Label Sprite ("CORE DNA")
    const createCoreLabelSprite = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawRoundRect(ctx, 8, 8, 240, 48, 24);
        ctx.fillStyle = isDarkMode ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isDarkMode ? '#818CF8' : '#6366F1';
        ctx.stroke();

        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.fillStyle = isDarkMode ? '#A5B4FC' : '#4338CA';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CORE DNA', 128, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(10, 2.5, 1);
      return sprite;
    };
    const coreLabel = createCoreLabelSprite();
    coreLabel.position.set(0, 5.8, 0);
    scene.add(coreLabel);

    // 4. Distribute Nodes Across 3 Spatial Tiers
    const nodeMeshes: { mesh: THREE.Mesh; node: TechnologyNode; sprite: THREE.Sprite }[] = [];

    // Helper: Create High-Contrast Glass Capsule Pill Text Sprite
    const createTextSprite = (text: string, usage: number, colorHex?: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 440;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const padX = 12;
        const padY = 12;
        const pillW = canvas.width - padX * 2; // 416
        const pillH = canvas.height - padY * 2; // 72
        const pillR = pillH / 2; // 36
        const x = padX;
        const y = padY;

        // Outer subtle drop shadow for 3D depth
        ctx.save();
        ctx.shadowColor = isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.18)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        // Pill background fill - solid high-opacity for guaranteed readability
        drawRoundRect(ctx, x, y, pillW, pillH, pillR);
        ctx.fillStyle = isDarkMode ? 'rgba(13, 17, 23, 0.94)' : 'rgba(255, 255, 255, 0.97)';
        ctx.fill();
        ctx.restore();

        // Border around pill - brand colored with sharp definition
        drawRoundRect(ctx, x, y, pillW, pillH, pillR);
        ctx.lineWidth = 3;
        ctx.strokeStyle = colorHex || (isDarkMode ? '#818CF8' : '#4F46E5');
        ctx.stroke();

        // Brand indicator dot on the left
        const dotX = x + 24;
        const dotY = y + pillH / 2;
        const dotR = 8;
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = colorHex || '#6366F1';
        ctx.fill();

        // Subtle ring around dot
        ctx.lineWidth = 2;
        ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.12)';
        ctx.stroke();

        // Technology Name: 100% Guaranteed High Contrast
        // Light Mode: #0F172A (Deep Charcoal Slate)
        // Dark Mode: #FFFFFF (Crisp Pure White)
        const nameX = dotX + dotR + 14;
        const fontSize = text.length > 16 ? 22 : (text.length > 11 ? 24 : 26);
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = isDarkMode ? '#FFFFFF' : '#0F172A';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, nameX, dotY);

        // Usage badge on right (e.g. "28%")
        ctx.font = 'bold 22px "JetBrains Mono", monospace';
        ctx.fillStyle = isDarkMode ? '#94A3B8' : '#475569';
        ctx.textAlign = 'right';
        ctx.fillText(`${usage}%`, x + pillW - 18, dotY);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(17.5, 3.8, 1);
      return sprite;
    };

    // Stratify nodes into 3 clean orbital tiers
    const tier1: TechnologyNode[] = []; // Core Languages (Python, JS, C++, HTML)
    const tier2: TechnologyNode[] = []; // Frameworks & Stacks (React, TS, FastAPI, DSA)
    const tier3: TechnologyNode[] = []; // Platforms & Tools (Tailwind, Git)

    nodes.forEach(n => {
      if (n.type === 'primary' && !n.parent) {
        tier1.push(n);
      } else if (n.type === 'framework' || n.parent) {
        tier2.push(n);
      } else {
        tier3.push(n);
      }
    });

    if (tier1.length === 0) tier1.push(...nodes.slice(0, 3));
    if (tier2.length === 0) tier2.push(...nodes.slice(3, 7));
    if (tier3.length === 0) tier3.push(...nodes.slice(7));

    const tiers = [
      { list: tier1, radius: 36, offset: 0 },
      { list: tier2, radius: 50, offset: Math.PI / 4 },
      { list: tier3, radius: 64, offset: Math.PI / 2 }
    ];

    tiers.forEach((tier, tierIdx) => {
      const count = tier.list.length;
      tier.list.forEach((n, j) => {
        const angle = (j / Math.max(1, count)) * Math.PI * 2 + tier.offset;
        const x = Math.cos(angle) * tier.radius;
        const z = Math.sin(angle) * (tier.radius * 0.88);
        // Stagger elevation so labels never vertically collide
        const y = (j % 2 === 0 ? 1 : -1) * (10 + tierIdx * 2.5);

        const sphereSize = Math.max(2.0, Math.min(3.8, (n.usage / 100) * 7.0 + 2.0));
        const geometry = new THREE.SphereGeometry(sphereSize, 24, 24);

        const colorVal = n.color ? parseInt(n.color.replace('#', '0x'), 16) : 0x6366f1;
        const material = new THREE.MeshStandardMaterial({
          color: colorVal,
          emissive: colorVal,
          emissiveIntensity: isDarkMode ? 0.45 : 0.25,
          roughness: 0.25,
          metalness: 0.75
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);

        // High-contrast text pill sprite floating right above node
        const sprite = createTextSprite(n.name, n.usage, n.color || '#6366f1');
        sprite.position.set(x, y + sphereSize + 3.2, z);
        scene.add(sprite);

        nodeMeshes.push({ mesh, node: n, sprite });

        // Laser energy thread connecting to Central Core with high visibility
        const lineColor = getVisibleLineColor(n.color || '#6366f1', isDarkMode);
        const lineMat = new THREE.LineBasicMaterial({
          color: lineColor,
          transparent: true,
          opacity: isDarkMode ? 0.45 : 0.65
        });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, z)
        ]);
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      });
    });

    // 5. Connect Parent-Child Stacks (e.g. React -> JavaScript, FastAPI -> Python)
    nodeMeshes.forEach(child => {
      if (child.node.parent) {
        const parentMatch = nodeMeshes.find(p =>
          p.node.id.toLowerCase() === child.node.parent?.toLowerCase() ||
          p.node.name.toLowerCase() === child.node.parent?.toLowerCase()
        );
        if (parentMatch) {
          const interMat = new THREE.LineBasicMaterial({
            color: isDarkMode ? 0x06b6d4 : 0x0284c7,
            transparent: true,
            opacity: isDarkMode ? 0.75 : 0.85
          });
          const interGeo = new THREE.BufferGeometry().setFromPoints([
            child.mesh.position,
            parentMatch.mesh.position
          ]);
          const interLine = new THREE.Line(interGeo, interMat);
          scene.add(interLine);
        }
      }
    });

    // 6. Interactive Drag & Mouse Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      mount.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / width) * 2 - 1,
        -((e.clientY - rect.top) / height) * 2 + 1
      );

      // Raycasting for node & sprite hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const hitTargets = nodeMeshes.flatMap(nm => [nm.mesh, nm.sprite]);
      const intersects = raycaster.intersectObjects(hitTargets);

      if (intersects.length > 0) {
        mount.style.cursor = 'pointer';
        const hit = nodeMeshes.find(nm => nm.mesh === intersects[0].object || nm.sprite === intersects[0].object);
        if (hit) {
          onSelectNode(hit.node);
        }
      } else {
        mount.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      mount.style.cursor = 'grab';
    };

    // 7. Mouse Wheel Zoom & Touch Pinch-to-Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomStep = e.deltaY * 0.08;
      targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, targetZoom + zoomStep));
      setZoomLevelPercent(Math.round((DEFAULT_ZOOM / targetZoom) * 100));
    };

    // Double-click to Reset
    const onDoubleClick = () => {
      targetZoom = DEFAULT_ZOOM;
      targetRotationX = 0;
      targetRotationY = 0;
      setZoomLevelPercent(100);
      onSelectNode(null);
    };

    mount.addEventListener('mousedown', onMouseDown);
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Zoom Button Helpers
    zoomControlsRef.current = {
      zoomIn: () => {
        targetZoom = Math.max(MIN_ZOOM, targetZoom - 12);
        setZoomLevelPercent(Math.round((DEFAULT_ZOOM / targetZoom) * 100));
      },
      zoomOut: () => {
        targetZoom = Math.min(MAX_ZOOM, targetZoom + 12);
        setZoomLevelPercent(Math.round((DEFAULT_ZOOM / targetZoom) * 100));
      },
      resetView: () => {
        targetZoom = DEFAULT_ZOOM;
        targetRotationX = 0;
        targetRotationY = 0;
        setZoomLevelPercent(100);
        onSelectNode(null);
      }
    };

    // Resize handler
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth camera zoom dampening
      camera.position.z += (targetZoom - camera.position.z) * 0.12;

      // Gentle auto-rotation when user is not dragging
      if (!isDragging) {
        targetRotationY += 0.002;
      }

      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.08;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.08;

      ring1.rotation.z += 0.01;
      ring2.rotation.y += 0.012;

      // Pulse selected node
      nodeMeshes.forEach(nm => {
        if (selectedNode && nm.node.id === selectedNode.id) {
          nm.mesh.scale.set(1.35, 1.35, 1.35);
          nm.sprite.scale.set(19.5, 4.2, 1);
        } else {
          nm.mesh.scale.set(1, 1, 1);
          nm.sprite.scale.set(17.5, 3.8, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown', onMouseDown);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nodes, isDarkMode]);

  const handleZoomIn = useCallback(() => zoomControlsRef.current.zoomIn(), []);
  const handleZoomOut = useCallback(() => zoomControlsRef.current.zoomOut(), []);
  const handleResetView = useCallback(() => zoomControlsRef.current.resetView(), []);

  return (
    <div
      ref={mountRef}
      className="w-full h-[460px] md:h-[480px] relative cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-xl bg-gradient-to-b from-indigo-950/5 via-transparent to-cyan-950/5 dark:from-[#070A0F] dark:to-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B]"
    >
      {/* Floating 3D Navigation & Zoom Controls Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs z-30 font-mono">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors"
          title="Zoom In (Scroll Up)"
        >
          <ZoomIn size={14} />
        </button>

        <span className="px-1.5 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] min-w-11 text-center">
          {zoomLevelPercent}%
        </span>

        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors"
          title="Zoom Out (Scroll Down)"
        >
          <ZoomOut size={14} />
        </button>

        <div className="w-[1px] h-4 bg-[#E2E8F0] dark:bg-[#1E293B] mx-0.5" />

        <button
          onClick={handleResetView}
          className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#EEF2F7] dark:hover:bg-[#1E293B] transition-colors flex items-center gap-1 text-[10px] font-semibold"
          title="Reset View / Center (Double Click)"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Bottom Hint Banner - Elevated frosted glass badge */}
      <div className="absolute bottom-3 left-3 text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs text-[#475569] dark:text-[#94A3B8] flex items-center gap-2 pointer-events-none z-20">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span>Scroll / Pinch to <strong>Zoom</strong> • Drag to <strong>Rotate</strong> • Double-click to <strong>Reset</strong></span>
      </div>
    </div>
  );
};

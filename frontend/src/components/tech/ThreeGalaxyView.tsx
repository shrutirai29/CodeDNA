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
    const height = mount.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const DEFAULT_ZOOM = 70;
    const MIN_ZOOM = 24;
    const MAX_ZOOM = 150;

    let targetZoom = DEFAULT_ZOOM;
    camera.position.set(0, 0, DEFAULT_ZOOM);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 1.4 : 1.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2.8, 140);
    pointLight.position.set(0, 0, 45);
    scene.add(pointLight);

    // 3. Central Core Node (Developer Identity Core)
    const coreGeo = new THREE.SphereGeometry(3.6, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x6366f1 : 0x4f46e5,
      emissive: 0x6366f1,
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Glowing Central Orbital Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDarkMode ? 0.45 : 0.3
    });
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(5.2, 5.7, 36), ringMat1);
    scene.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDarkMode ? 0.35 : 0.2
    });
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(7.2, 7.6, 36), ringMat2);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // 4. Distribute Nodes in 3D Space with Healthy Clearance from Center
    const nodeMeshes: { mesh: THREE.Mesh; node: TechnologyNode; sprite: THREE.Sprite }[] = [];
    const total = nodes.length;

    // Helper: Create Text Sprite
    const createTextSprite = (text: string, colorHex?: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'Bold 24px monospace';
        ctx.fillStyle = colorHex || (isDarkMode ? '#F8FAFC' : '#111827');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(16, 4, 1);
      return sprite;
    };

    nodes.forEach((n, i) => {
      // Stratified Orbital Distribution: Primary vs Frameworks
      const isFramework = n.type === 'framework' || !!n.parent;
      const baseRadius = isFramework ? 38 + (i % 3) * 4 : 26 + (i % 2) * 5;
      const angle = (i / total) * Math.PI * 2 + (i % 2 === 0 ? 0.2 : -0.2);

      const x = Math.cos(angle) * baseRadius;
      const z = Math.sin(angle) * (baseRadius * 0.85);
      const y = Math.sin((i / total) * Math.PI * 4) * 14 + (isFramework ? 4 : -4);

      const sphereSize = Math.max(1.8, Math.min(3.8, (n.usage / 100) * 7.5 + 1.8));
      const geometry = new THREE.SphereGeometry(sphereSize, 22, 22);

      const colorVal = n.color ? parseInt(n.color.replace('#', '0x'), 16) : 0x6366f1;
      const material = new THREE.MeshStandardMaterial({
        color: colorVal,
        emissive: colorVal,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.7
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      // Text sprite floating right above node
      const sprite = createTextSprite(n.name, n.color || '#6366f1');
      sprite.position.set(x, y + sphereSize + 2.6, z);
      scene.add(sprite);

      nodeMeshes.push({ mesh, node: n, sprite });

      // Laser energy thread connecting to Central Core
      const lineMat = new THREE.LineBasicMaterial({
        color: colorVal,
        transparent: true,
        opacity: isDarkMode ? 0.35 : 0.22
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
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
            color: 0x06b6d4,
            transparent: true,
            opacity: isDarkMode ? 0.65 : 0.45
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
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / width) * 2 - 1,
        -((e.clientY - rect.top) / height) * 2 + 1
      );

      // Raycasting for node hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(nm => nm.mesh));

      if (intersects.length > 0) {
        const hit = nodeMeshes.find(nm => nm.mesh === intersects[0].object);
        if (hit) {
          onSelectNode(hit.node);
        }
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
    };

    // 7. Mouse Wheel Zoom & Touch Pinch-to-Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // DeltaY > 0 -> scroll down = zoom out; deltaY < 0 -> scroll up = zoom in
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
        } else {
          nm.mesh.scale.set(1, 1, 1);
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
      className="w-full h-96 relative cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-xl bg-gradient-to-b from-indigo-950/10 via-transparent to-cyan-950/10 dark:from-[#070A0F] dark:to-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B]"
    >
      {/* Floating 3D Navigation & Zoom Controls Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-md border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm z-30 font-mono">
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

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2 pointer-events-none z-20">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span>Scroll / Pinch to <strong>Zoom</strong> • Drag to <strong>Rotate</strong> • Double-click to <strong>Reset</strong></span>
      </div>
    </div>
  );
};

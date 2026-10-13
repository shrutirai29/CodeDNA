import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { TechnologyNode } from '../../types/developer';
import { useDeveloperStore } from '../../store/useDeveloperStore';
import { ZoomIn, ZoomOut, RotateCcw, Move, Orbit, Pause, Play } from 'lucide-react';

interface ThreeGalaxyViewProps {
  nodes: TechnologyNode[];
  selectedNode: TechnologyNode | null;
  onSelectNode: (node: TechnologyNode | null) => void;
}

// Compute high-contrast line color for Light & Dark Modes
const getVisibleLineColor = (hex: string, isDark: boolean): number => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) || 99;
  const g = parseInt(clean.slice(2, 4), 16) || 102;
  const b = parseInt(clean.slice(4, 6), 16) || 241;
  if (isDark) {
    return (r << 16) + (g << 8) + b;
  }
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness > 145) {
    const darkR = Math.round(r * 0.55);
    const darkG = Math.round(g * 0.55);
    const darkB = Math.round(b * 0.55);
    return (darkR << 16) + (darkG << 8) + darkB;
  }
  return (r << 16) + (g << 8) + b;
};

export const ThreeGalaxyView: React.FC<ThreeGalaxyViewProps> = ({
  nodes,
  selectedNode,
  onSelectNode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const coreLabelRef = useRef<HTMLDivElement | null>(null);

  const { isDarkMode } = useDeveloperStore();
  const [zoomLevelPercent, setZoomLevelPercent] = useState<number>(100);
  const [interactionMode, setInteractionMode] = useState<'rotate' | 'pan'>('rotate');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const interactionModeRef = useRef<'rotate' | 'pan'>('rotate');
  const autoRotateRef = useRef<boolean>(true);
  const selectedNodeRef = useRef<TechnologyNode | null>(selectedNode);
  const onSelectNodeRef = useRef(onSelectNode);

  useEffect(() => {
    interactionModeRef.current = interactionMode;
  }, [interactionMode]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  useEffect(() => {
    onSelectNodeRef.current = onSelectNode;
  }, [onSelectNode]);

  const controlsRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    startLabelDrag: (nodeId: string, clientX: number, clientY: number) => void;
  }>({
    zoomIn: () => {},
    zoomOut: () => {},
    resetView: () => {},
    startLabelDrag: () => {}
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 700;
    const height = mount.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    const DEFAULT_ZOOM = 86;
    const MIN_ZOOM = 34;
    const MAX_ZOOM = 165;

    let targetZoom = DEFAULT_ZOOM;
    let targetPanX = 0;
    let targetPanY = 0;
    camera.position.set(0, 0, DEFAULT_ZOOM);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Crisp 3D Lighting (Low metalness so spheres are bright and vibrant in Light & Dark Mode)
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 1.8 : 2.3);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isDarkMode ? 1.6 : 1.9);
    dirLight1.position.set(35, 55, 60);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, isDarkMode ? 1.0 : 0.8);
    dirLight2.position.set(-40, -30, 40);
    scene.add(dirLight2);

    // 3. Central Core Node (Developer Identity Core)
    const coreGeo = new THREE.SphereGeometry(3.8, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x6366f1 : 0x4f46e5,
      emissive: isDarkMode ? 0x4f46e5 : 0x3730a3,
      emissiveIntensity: isDarkMode ? 0.55 : 0.35,
      roughness: 0.25,
      metalness: 0.15
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    galaxyGroup.add(coreMesh);

    // Glowing Central Orbital Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x818cf8 : 0x4f46e5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDarkMode ? 0.55 : 0.45
    });
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(5.5, 6.0, 48), ringMat1);
    galaxyGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0x06b6d4 : 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDarkMode ? 0.45 : 0.38
    });
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(7.3, 7.7, 48), ringMat2);
    ring2.rotation.x = Math.PI / 3;
    galaxyGroup.add(ring2);

    // 4. Distribute Nodes Evenly Without Collisions or Frustum Clipping
    interface NodeEntry {
      mesh: THREE.Mesh;
      halo: THREE.Mesh;
      node: TechnologyNode;
      sphereSize: number;
      initialPos: THREE.Vector3;
      coreLine: THREE.Line;
    }

    const nodeEntries: NodeEntry[] = [];
    const total = Math.max(1, nodes.length);

    nodes.forEach((n, idx) => {
      // Golden-ratio spiral + well-spaced angular distribution inside frustum
      const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
      const radiusBand = idx % 3 === 0 ? 25 : idx % 3 === 1 ? 33 : 40;
      const x = Math.cos(angle) * radiusBand * 1.18;
      const y = Math.sin(angle) * radiusBand * 0.72;
      const z = ((idx % 3) - 1) * 11;

      const sphereSize = Math.max(2.3, Math.min(4.2, (n.usage / 100) * 6.5 + 2.1));
      const geometry = new THREE.SphereGeometry(sphereSize, 28, 28);

      const colorVal = n.color ? parseInt(n.color.replace('#', '0x'), 16) : 0x6366f1;
      const material = new THREE.MeshStandardMaterial({
        color: colorVal,
        emissive: colorVal,
        emissiveIntensity: isDarkMode ? 0.42 : 0.28,
        roughness: 0.28,
        metalness: 0.12
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      galaxyGroup.add(mesh);

      // Subtle outer glow halo around each sphere
      const haloGeo = new THREE.SphereGeometry(sphereSize * 1.28, 20, 20);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorVal,
        transparent: true,
        opacity: isDarkMode ? 0.18 : 0.14,
        depthWrite: false
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(mesh.position);
      galaxyGroup.add(halo);

      // Laser line from Core (0,0,0) to Node
      const lineColor = getVisibleLineColor(n.color || '#6366f1', isDarkMode);
      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: isDarkMode ? 0.55 : 0.72
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        mesh.position.clone()
      ]);
      const coreLine = new THREE.Line(lineGeo, lineMat);
      galaxyGroup.add(coreLine);

      nodeEntries.push({
        mesh,
        halo,
        node: n,
        sphereSize,
        initialPos: new THREE.Vector3(x, y, z),
        coreLine
      });
    });

    // 5. Connect Parent-Child Stacks (e.g. React -> JavaScript, FastAPI -> Python)
    interface ParentChildLink {
      child: NodeEntry;
      parent: NodeEntry;
      line: THREE.Line;
    }
    const parentChildLinks: ParentChildLink[] = [];

    nodeEntries.forEach(child => {
      if (child.node.parent) {
        const parentMatch = nodeEntries.find(
          p =>
            p.node.id.toLowerCase() === child.node.parent?.toLowerCase() ||
            p.node.name.toLowerCase() === child.node.parent?.toLowerCase()
        );
        if (parentMatch) {
          const interMat = new THREE.LineBasicMaterial({
            color: isDarkMode ? 0x22d3ee : 0x0284c7,
            transparent: true,
            opacity: isDarkMode ? 0.8 : 0.85
          });
          const interGeo = new THREE.BufferGeometry().setFromPoints([
            child.mesh.position.clone(),
            parentMatch.mesh.position.clone()
          ]);
          const interLine = new THREE.Line(interGeo, interMat);
          galaxyGroup.add(interLine);
          parentChildLinks.push({ child, parent: parentMatch, line: interLine });
        }
      }
    });

    // Helper to update dynamic line geometries when a node is dragged
    const updateAllLines = () => {
      nodeEntries.forEach(entry => {
        entry.halo.position.copy(entry.mesh.position);
        const posAttr = entry.coreLine.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (posAttr) {
          posAttr.setXYZ(1, entry.mesh.position.x, entry.mesh.position.y, entry.mesh.position.z);
          posAttr.needsUpdate = true;
        }
      });
      parentChildLinks.forEach(link => {
        const posAttr = link.line.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (posAttr) {
          posAttr.setXYZ(0, link.child.mesh.position.x, link.child.mesh.position.y, link.child.mesh.position.z);
          posAttr.setXYZ(1, link.parent.mesh.position.x, link.parent.mesh.position.y, link.parent.mesh.position.z);
          posAttr.needsUpdate = true;
        }
      });
    };

    // 6. Interactive Node Dragging, Scene Orbiting, and Scene Panning
    let isDraggingScene = false;
    let isPanningScene = false;
    let draggedNodeEntry: NodeEntry | null = null;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.12;
    let targetRotationY = 0;

    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane();
    const dragIntersectPoint = new THREE.Vector3();

    const getNormalizedMouse = (clientX: number, clientY: number) => {
      const rect = mount.getBoundingClientRect();
      return new THREE.Vector2(
        ((clientX - rect.left) / (rect.width || width)) * 2 - 1,
        -((clientY - rect.top) / (rect.height || height)) * 2 + 1
      );
    };

    const beginNodeDrag = (entry: NodeEntry, clientX: number, clientY: number) => {
      draggedNodeEntry = entry;
      isDraggingScene = false;
      isPanningScene = false;
      prevMouseX = clientX;
      prevMouseY = clientY;
      onSelectNodeRef.current(entry.node);

      // Set drag plane perpendicular to camera passing through the node's world position
      const worldPos = new THREE.Vector3();
      entry.mesh.getWorldPosition(worldPos);
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      dragPlane.setFromNormalAndCoplanarPoint(camDir, worldPos);
      mount.style.cursor = 'grabbing';
    };

    const onMouseDown = (e: MouseEvent) => {
      const mouse = getNormalizedMouse(e.clientX, e.clientY);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeEntries.map(ne => ne.mesh));

      if (intersects.length > 0) {
        const hitEntry = nodeEntries.find(ne => ne.mesh === intersects[0].object);
        if (hitEntry) {
          beginNodeDrag(hitEntry, e.clientX, e.clientY);
          return;
        }
      }

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      if (e.button === 2 || e.shiftKey || interactionModeRef.current === 'pan') {
        isPanningScene = true;
      } else {
        isDraggingScene = true;
      }
      mount.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (draggedNodeEntry) {
        const mouse = getNormalizedMouse(e.clientX, e.clientY);
        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(dragPlane, dragIntersectPoint)) {
          const localPos = galaxyGroup.worldToLocal(dragIntersectPoint.clone());
          draggedNodeEntry.mesh.position.copy(localPos);
          updateAllLines();
        }
        return;
      }

      if (isPanningScene) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        const panScale = targetZoom * 0.0012;
        targetPanX += deltaX * panScale;
        targetPanY -= deltaY * panScale;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        return;
      }

      if (isDraggingScene) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.0085;
        targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationX + deltaY * 0.0085));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        return;
      }

      // Hover detection when not dragging
      const rect = mount.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const mouse = getNormalizedMouse(e.clientX, e.clientY);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeEntries.map(ne => ne.mesh));
        if (intersects.length > 0) {
          mount.style.cursor = 'pointer';
          const hit = nodeEntries.find(ne => ne.mesh === intersects[0].object);
          if (hit) {
            onSelectNodeRef.current(hit.node);
          }
        } else {
          mount.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      draggedNodeEntry = null;
      isDraggingScene = false;
      isPanningScene = false;
      mount.style.cursor = 'grab';
    };

    // Touch support for mobile dragging
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const mouse = getNormalizedMouse(t.clientX, t.clientY);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeEntries.map(ne => ne.mesh));
        if (intersects.length > 0) {
          const hitEntry = nodeEntries.find(ne => ne.mesh === intersects[0].object);
          if (hitEntry) {
            beginNodeDrag(hitEntry, t.clientX, t.clientY);
            return;
          }
        }
        isDraggingScene = true;
        prevMouseX = t.clientX;
        prevMouseY = t.clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        if (draggedNodeEntry) {
          e.preventDefault();
          const mouse = getNormalizedMouse(t.clientX, t.clientY);
          raycaster.setFromCamera(mouse, camera);
          if (raycaster.ray.intersectPlane(dragPlane, dragIntersectPoint)) {
            const localPos = galaxyGroup.worldToLocal(dragIntersectPoint.clone());
            draggedNodeEntry.mesh.position.copy(localPos);
            updateAllLines();
          }
        } else if (isDraggingScene) {
          const deltaX = t.clientX - prevMouseX;
          const deltaY = t.clientY - prevMouseY;
          targetRotationY += deltaX * 0.0085;
          targetRotationX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationX + deltaY * 0.0085));
          prevMouseX = t.clientX;
          prevMouseY = t.clientY;
        }
      }
    };

    const onTouchEnd = () => {
      draggedNodeEntry = null;
      isDraggingScene = false;
      isPanningScene = false;
    };

    // 7. Mouse Wheel Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomStep = e.deltaY * 0.07;
      targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, targetZoom + zoomStep));
      setZoomLevelPercent(Math.round((DEFAULT_ZOOM / targetZoom) * 100));
    };

    const resetAllPositions = () => {
      targetZoom = DEFAULT_ZOOM;
      targetPanX = 0;
      targetPanY = 0;
      targetRotationX = 0.12;
      targetRotationY = 0;
      nodeEntries.forEach(entry => {
        entry.mesh.position.copy(entry.initialPos);
      });
      updateAllLines();
      setZoomLevelPercent(100);
      onSelectNodeRef.current(null);
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    mount.addEventListener('mousedown', onMouseDown);
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('dblclick', resetAllPositions);
    mount.addEventListener('contextmenu', onContextMenu);
    mount.addEventListener('touchstart', onTouchStart, { passive: true });
    mount.addEventListener('touchmove', onTouchMove, { passive: false });
    mount.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    controlsRef.current = {
      zoomIn: () => {
        targetZoom = Math.max(MIN_ZOOM, targetZoom - 12);
        setZoomLevelPercent(Math.round((DEFAULT_ZOOM / targetZoom) * 100));
      },
      zoomOut: () => {
        targetZoom = Math.min(MAX_ZOOM, targetZoom + 12);
        setZoomLevelPercent(Math.round((DEFAULT_ZOOM / targetZoom) * 100));
      },
      resetView: resetAllPositions,
      startLabelDrag: (nodeId: string, clientX: number, clientY: number) => {
        const entry = nodeEntries.find(ne => ne.node.id === nodeId);
        if (entry) {
          beginNodeDrag(entry, clientX, clientY);
        }
      }
    };

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop + Real-Time 2D Screen-Space Anti-Overlap Label Projection
    let animId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const curW = mount.clientWidth || width;
      const curH = mount.clientHeight || height;

      // Smooth camera zoom & pan
      camera.position.z += (targetZoom - camera.position.z) * 0.14;
      galaxyGroup.position.x += (targetPanX - galaxyGroup.position.x) * 0.14;
      galaxyGroup.position.y += (targetPanY - galaxyGroup.position.y) * 0.14;

      // Gentle auto-rotation when enabled and not dragging
      if (autoRotateRef.current && !isDraggingScene && !isPanningScene && !draggedNodeEntry) {
        targetRotationY += 0.0022;
      }

      galaxyGroup.rotation.y += (targetRotationY - galaxyGroup.rotation.y) * 0.1;
      galaxyGroup.rotation.x += (targetRotationX - galaxyGroup.rotation.x) * 0.1;

      ring1.rotation.z += 0.008;
      ring2.rotation.y += 0.01;

      const activeId = selectedNodeRef.current?.id;
      nodeEntries.forEach(entry => {
        const isSel = activeId === entry.node.id;
        const s = isSel ? 1.28 : 1.0;
        entry.mesh.scale.set(s, s, s);
        entry.halo.scale.set(s, s, s);
      });

      renderer.render(scene, camera);

      // Update Core DNA HTML Badge Position
      if (coreLabelRef.current) {
        coreMesh.getWorldPosition(tempVec);
        tempVec.y -= 5.8;
        tempVec.project(camera);
        const cx = (tempVec.x * 0.5 + 0.5) * curW;
        const cy = (-(tempVec.y * 0.5) + 0.5) * curH;
        coreLabelRef.current.style.transform = `translate3d(${Math.round(cx)}px, ${Math.round(cy)}px, 0) translate(-50%, -50%)`;
      }

      // Compute projected 2D positions for all node labels and resolve any overlaps
      const projected: {
        id: string;
        x: number;
        y: number;
        z: number;
        w: number;
        h: number;
      }[] = [];

      nodeEntries.forEach(entry => {
        entry.mesh.getWorldPosition(tempVec);
        tempVec.y += entry.sphereSize + 2.2;
        tempVec.project(camera);

        const sx = (tempVec.x * 0.5 + 0.5) * curW;
        const sy = (-(tempVec.y * 0.5) + 0.5) * curH;
        const pillW = Math.max(145, entry.node.name.length * 9 + 76);
        const pillH = 36;

        projected.push({
          id: entry.node.id,
          x: sx,
          y: sy,
          z: tempVec.z,
          w: pillW,
          h: pillH
        });
      });

      // 3 passes of 2D screen-space collision repulsion + viewport clamping
      for (let iter = 0; iter < 3; iter++) {
        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const a = projected[i];
            const b = projected[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const minX = (a.w + b.w) * 0.5 + 6;
            const minY = (a.h + b.h) * 0.5 + 6;

            if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
              const overlapX = minX - Math.abs(dx);
              const overlapY = minY - Math.abs(dy);
              if (overlapY < overlapX) {
                const pushY = (overlapY * 0.5) * (dy >= 0 ? 1 : -1);
                a.y -= pushY;
                b.y += pushY;
              } else {
                const pushX = (overlapX * 0.5) * (dx >= 0 ? 1 : -1);
                a.x -= pushX;
                b.x += pushX;
              }
            }
          }
        }

        // Clamp within container bounds so no pill is ever clipped at the edges
        projected.forEach(p => {
          const halfW = p.w * 0.5 + 10;
          const halfH = p.h * 0.5 + 10;
          p.x = Math.max(halfW, Math.min(curW - halfW, p.x));
          p.y = Math.max(halfH + 40, Math.min(curH - halfH - 38, p.y));
        });
      }

      // Apply transforms to HTML pill elements
      projected.forEach(p => {
        const el = labelRefs.current[p.id];
        if (el) {
          const isSel = activeId === p.id;
          const scale = isSel ? 1.08 : 1.0;
          el.style.transform = `translate3d(${Math.round(p.x)}px, ${Math.round(p.y)}px, 0) translate(-50%, -50%) scale(${scale})`;
          el.style.zIndex = isSel ? '35' : p.z < 0.991 ? '25' : '15';
        }
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown', onMouseDown);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('dblclick', resetAllPositions);
      mount.removeEventListener('contextmenu', onContextMenu);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchmove', onTouchMove);
      mount.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nodes, isDarkMode]);

  const handleZoomIn = useCallback(() => controlsRef.current.zoomIn(), []);
  const handleZoomOut = useCallback(() => controlsRef.current.zoomOut(), []);
  const handleResetView = useCallback(() => controlsRef.current.resetView(), []);

  return (
    <div
      ref={mountRef}
      className="w-full h-[470px] md:h-[500px] relative cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-xl glass-panel shadow-inner"
    >
      {/* Crisp HTML Overlay Layer for 100% Legible, Draggable, Zero-Overlap Node Labels */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Central Core DNA Badge */}
        <div
          ref={coreLabelRef}
          className="absolute top-0 left-0 px-2.5 py-0.5 rounded-full bg-indigo-600/95 dark:bg-indigo-500/95 text-white font-mono text-[10px] font-extrabold tracking-wider uppercase shadow-md border border-indigo-300/60 pointer-events-none whitespace-nowrap"
        >
          CORE DNA
        </div>

        {/* Technology Node Pill Badges (Draggable & Clickable) */}
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <div
              key={node.id}
              ref={(el) => {
                labelRefs.current[node.id] = el;
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                controlsRef.current.startLabelDrag(node.id, e.clientX, e.clientY);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                if (e.touches.length === 1) {
                  controlsRef.current.startLabelDrag(
                    node.id,
                    e.touches[0].clientX,
                    e.touches[0].clientY
                  );
                }
              }}
              onMouseEnter={() => onSelectNode(node)}
              className={`absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap transition-shadow duration-150 ${
                isSelected
                  ? 'bg-white dark:bg-[#0D1117] ring-2 ring-indigo-500 shadow-xl'
                  : 'bg-white/95 dark:bg-[#0D1117]/95 hover:bg-white dark:hover:bg-[#161B22] shadow-md'
              }`}
              style={{
                border: `2px solid ${node.color || '#6366F1'}`,
                willChange: 'transform'
              }}
              title={`Drag to move ${node.name} (${node.usage}% code share)`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: node.color || '#6366F1' }}
              />
              <span className="font-sans text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
                {node.name}
              </span>
              <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-300 pl-1 border-l border-slate-200 dark:border-slate-700">
                {node.usage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Top-Left Mode & Auto-Spin Controls */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1 rounded-xl bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm z-30 font-mono text-[11px]">
        <button
          onClick={() => setInteractionMode('rotate')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer ${
            interactionMode === 'rotate'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Drag background to rotate 3D galaxy"
        >
          <Orbit size={12} />
          Rotate
        </button>
        <button
          onClick={() => setInteractionMode('pan')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer ${
            interactionMode === 'pan'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Drag background to move/pan entire galaxy"
        >
          <Move size={12} />
          Move
        </button>
        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-2 py-1 rounded-lg flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
        >
          {autoRotate ? <Pause size={12} className="text-amber-500" /> : <Play size={12} className="text-emerald-500" />}
          <span className="hidden sm:inline">{autoRotate ? 'Spinning' : 'Paused'}</span>
        </button>
      </div>

      {/* Top-Right Zoom & Reset Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm z-30 font-mono">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom In (Scroll Up)"
        >
          <ZoomIn size={14} />
        </button>

        <span className="px-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-200 min-w-11 text-center">
          {zoomLevelPercent}%
        </span>

        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom Out (Scroll Down)"
        >
          <ZoomOut size={14} />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        <button
          onClick={handleResetView}
          className="px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer"
          title="Reset All Positions & Zoom (Double Click)"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Bottom Interactive Guide Banner */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-2 pointer-events-none z-30 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
        <span>
          <strong>Drag any Node / Label</strong> to move it • <strong>Drag Space</strong> to {interactionMode === 'pan' ? 'Pan' : 'Rotate'} • <strong>Scroll</strong> to Zoom
        </span>
      </div>
    </div>
  );
};

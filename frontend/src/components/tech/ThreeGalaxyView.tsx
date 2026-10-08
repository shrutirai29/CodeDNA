import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { TechnologyNode } from '../../types/developer';
import { useDeveloperStore } from '../../store/useDeveloperStore';

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

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 75);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 1.2 : 1.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2.5, 120);
    pointLight.position.set(0, 0, 40);
    scene.add(pointLight);

    // 3. Central Core Node
    const coreGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x6366f1 : 0x4f46e5,
      emissive: 0x6366f1,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Central Halo Ring
    const haloGeo = new THREE.RingGeometry(5.2, 5.8, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 4. Distribute Nodes in 3D Space
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
      // Golden spiral distribution on 3D ellipsoid
      const phi = Math.acos(-1 + (2 * i) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const radiusX = 28;
      const radiusY = 18;
      const radiusZ = 22;

      const x = radiusX * Math.cos(theta) * Math.sin(phi);
      const y = radiusY * Math.sin(theta) * Math.sin(phi);
      const z = radiusZ * Math.cos(phi);

      const sphereSize = Math.max(1.8, Math.min(4.0, (n.usage / 100) * 8 + 1.6));
      const geometry = new THREE.SphereGeometry(sphereSize, 20, 20);

      const colorVal = n.color ? parseInt(n.color.replace('#', '0x'), 16) : 0x6366f1;
      const material = new THREE.MeshStandardMaterial({
        color: colorVal,
        emissive: colorVal,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.7
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      // Text sprite floating above sphere
      const sprite = createTextSprite(n.name, n.color);
      sprite.position.set(x, y + sphereSize + 2.5, z);
      scene.add(sprite);

      nodeMeshes.push({ mesh, node: n, sprite });

      // Connecting Laser Lines to Central Core or Parent
      const lineMat = new THREE.LineBasicMaterial({
        color: colorVal,
        transparent: true,
        opacity: isDarkMode ? 0.35 : 0.25
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
    });

    // 5. Connect Parent-Child Nodes (e.g. React -> JavaScript, FastAPI -> Python)
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
            opacity: 0.6
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

    // 6. Interactive Mouse Orbit & Drag Controls
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

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

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

    // 7. Render Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotation when not dragging
      if (!isDragging) {
        targetRotationY += 0.0025;
      }

      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.08;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.08;

      haloMesh.rotation.z += 0.01;

      // Pulse selected node
      nodeMeshes.forEach(nm => {
        if (selectedNode && nm.node.id === selectedNode.id) {
          nm.mesh.scale.set(1.3, 1.3, 1.3);
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [nodes, isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="w-full h-88 relative cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-xl bg-gradient-to-b from-indigo-950/5 to-cyan-950/5 dark:from-[#070A0F] dark:to-[#0D1117] border border-[#E2E8F0] dark:border-[#1E293B]"
    >
      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        Click & Drag to rotate 3D Neural Constellation • Hover node to inspect
      </div>
    </div>
  );
};

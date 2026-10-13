import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDeveloperStore } from '../../store/useDeveloperStore';

export const CyberBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDeveloperStore();

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    currentMount.appendChild(renderer.domElement);

    // Particle nodes setup
    const particleCount = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.02
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle material
    const isDark = isDarkMode;
    const particleColor = isDark ? 0x00F0FF : 0x6366F1;
    const lineColor = isDark ? 0x8B5CF6 : 0x06B6D4;

    const particleMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: 2.2,
      transparent: true,
      opacity: isDark ? 0.45 : 0.25,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Lines geometry for connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: isDark ? 0.12 : 0.06
    });

    const linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
    scene.add(linesMesh);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 8;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 8;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const pos = geometry.attributes.position.array as Float32Array;
      const linePositions: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        // Bounce within boundaries
        if (pos[i * 3] > 80 || pos[i * 3] < -80) velocities[i].x *= -1;
        if (pos[i * 3 + 1] > 55 || pos[i * 3 + 1] < -55) velocities[i].y *= -1;
        if (pos[i * 3 + 2] > 25 || pos[i * 3 + 2] < -25) velocities[i].z *= -1;

        // Connect nearby nodes
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 380) {
            linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      // Gentle camera sway
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (mouseY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDarkMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Developer Workspace High-Res Atmospheric Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 dark:brightness-50 dark:contrast-125"
        style={{
          backgroundImage: "url('/dev-workspace-bg.png')",
          backgroundAttachment: 'fixed'
        }}
      />

      {/* 2. Mood & Readability Ambient Glass Overlays */}
      {/* In Light Mode: Soft luminous gradient to ensure crisp >14:1 contrast on dashboard cards */}
      {/* In Dark Mode: Cyber atmospheric glass letting glowing screens and constellations shine through */}
      <div className="absolute inset-0 bg-white/20 dark:bg-[#070A0F]/88 backdrop-blur-[0.5px] transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10 dark:from-indigo-950/40 dark:via-transparent dark:to-cyan-950/35 pointer-events-none" />

      {/* 3. Three.js Floating Particle Constellation Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 opacity-70 dark:opacity-90 transition-opacity duration-500"
      />
    </div>
  );
};

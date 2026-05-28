import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SplashScreen3D({ onEnter }) {
  const containerRef = useRef(null);
  const isLoadedRef = useRef(false);
  const timelineRef = useRef({ time: 0 });
  const [isEntering, setIsEntering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Interaction and animation state references
  const scrollProgressRef = useRef(0.0);
  const smoothScrollRef = useRef(0.0);
  const autoScrollRef = useRef(false);
  const textGroupRef = useRef(null);
  const textMaterialRef = useRef(null);
  const gridMaterialRef = useRef(null);
  const cloudMaterialRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#010206');
    scene.fog = new THREE.FogExp2('#010206', 0.05);

    // Cinematic Camera Setup
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    // Position camera at a gorgeous initial angle
    camera.position.set(0, 0, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // --- Lights System (Premium Specular Shading) ---
    const ambientLight = new THREE.AmbientLight('#02040d', 0.85);
    scene.add(ambientLight);

    // Dynamic key spot light focusing on center logo
    const keySpot = new THREE.SpotLight('#00ffff', 12.0, 15, Math.PI / 4, 0.5, 1.0);
    keySpot.position.set(3, 5, 4);
    keySpot.castShadow = true;
    scene.add(keySpot);

    // Indigo rim light
    const violetLight = new THREE.DirectionalLight('#4f46e5', 4.0);
    violetLight.position.set(-5, 4, 1.5);
    scene.add(violetLight);

    // Specular highlight light
    const specularLight = new THREE.PointLight('#00ffff', 5.0, 12);
    specularLight.position.set(1.0, 0.5, 2.0);
    scene.add(specularLight);

    // --- 3D Letters (E, D, U, F, Y) ---
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    textGroupRef.current = textGroup;

    const textMaterial = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.15,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: '#00ffff',
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.0 // starts invisible, fades in on load
    });
    textMaterialRef.current = textMaterial;

    const extrudeSettings = {
      depth: 0.28,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3
    };

    const letters = [];
    const spacing = 1.25;

    // E Shape
    const shapeE = new THREE.Shape();
    shapeE.moveTo(0, 0);
    shapeE.lineTo(0, 1.4);
    shapeE.lineTo(0.9, 1.4);
    shapeE.lineTo(0.9, 1.12);
    shapeE.lineTo(0.28, 1.12);
    shapeE.lineTo(0.28, 0.84);
    shapeE.lineTo(0.78, 0.84);
    shapeE.lineTo(0.78, 0.56);
    shapeE.lineTo(0.28, 0.56);
    shapeE.lineTo(0.28, 0.28);
    shapeE.lineTo(0.9, 0.28);
    shapeE.lineTo(0.9, 0);
    shapeE.closePath();
    letters.push({ shape: shapeE, xOffset: -2 * spacing });

    // D Shape
    const shapeD = new THREE.Shape();
    shapeD.moveTo(0, 0);
    shapeD.lineTo(0, 1.4);
    shapeD.lineTo(0.45, 1.4);
    shapeD.quadraticCurveTo(0.95, 1.4, 0.95, 0.7);
    shapeD.quadraticCurveTo(0.95, 0, 0.45, 0);
    shapeD.closePath();
    const holeD = new THREE.Path();
    holeD.moveTo(0.28, 0.28);
    holeD.lineTo(0.28, 1.12);
    holeD.lineTo(0.4, 1.12);
    holeD.quadraticCurveTo(0.67, 1.12, 0.67, 0.7);
    holeD.quadraticCurveTo(0.67, 0.28, 0.4, 0.28);
    holeD.closePath();
    shapeD.holes.push(holeD);
    letters.push({ shape: shapeD, xOffset: -1 * spacing });

    // U Shape
    const shapeU = new THREE.Shape();
    shapeU.moveTo(0, 1.4);
    shapeU.lineTo(0, 0.45);
    shapeU.quadraticCurveTo(0, 0, 0.45, 0);
    shapeU.quadraticCurveTo(0.9, 0, 0.9, 0.45);
    shapeU.lineTo(0.9, 1.4);
    shapeU.lineTo(0.62, 1.4);
    shapeU.lineTo(0.62, 0.45);
    shapeU.quadraticCurveTo(0.62, 0.28, 0.45, 0.28);
    shapeU.quadraticCurveTo(0.28, 0.28, 0.28, 0.45);
    shapeU.lineTo(0.28, 1.4);
    shapeU.closePath();
    letters.push({ shape: shapeU, xOffset: 0 });

    // F Shape
    const shapeF = new THREE.Shape();
    shapeF.moveTo(0, 0);
    shapeF.lineTo(0, 1.4);
    shapeF.lineTo(0.9, 1.4);
    shapeF.lineTo(0.9, 1.12);
    shapeF.lineTo(0.28, 1.12);
    shapeF.lineTo(0.28, 0.84);
    shapeF.lineTo(0.78, 0.84);
    shapeF.lineTo(0.78, 0.56);
    shapeF.lineTo(0.28, 0.56);
    shapeF.lineTo(0.28, 0);
    shapeF.closePath();
    letters.push({ shape: shapeF, xOffset: 1 * spacing });

    // Y Shape
    const shapeY = new THREE.Shape();
    shapeY.moveTo(0.31, 0);
    shapeY.lineTo(0.31, 0.6);
    shapeY.lineTo(0, 1.4);
    shapeY.lineTo(0.31, 1.4);
    shapeY.lineTo(0.45, 1.0);
    shapeY.lineTo(0.59, 1.4);
    shapeY.lineTo(0.9, 1.4);
    shapeY.lineTo(0.59, 0.6);
    shapeY.lineTo(0.59, 0);
    shapeY.closePath();
    letters.push({ shape: shapeY, xOffset: 2 * spacing });

    letters.forEach((item) => {
      const geom = new THREE.ExtrudeGeometry(item.shape, extrudeSettings);
      geom.center();
      const mesh = new THREE.Mesh(geom, textMaterial);
      mesh.position.set(item.xOffset, -0.2, 1.2); // Centered in the middle layer
      textGroup.add(mesh);
    });

    // --- Wavy Matrix Grid Floor ---
    const gridGeometry = new THREE.PlaneGeometry(32, 24, 28, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: '#0d9488',
      wireframe: true,
      transparent: true,
      opacity: 0.0 // starts invisible, fades in
    });
    gridMaterialRef.current = gridMaterial;
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -2.1;
    scene.add(gridMesh);

    // --- Volumetric Cloud Particles ---
    const cloudCount = 140;
    const cloudGeom = new THREE.BufferGeometry();
    const cloudPositions = new Float32Array(cloudCount * 3);
    const cloudSpeeds = [];
    for (let i = 0; i < cloudCount; i++) {
      cloudPositions[i * 3] = (Math.random() - 0.5) * 16.0;
      cloudPositions[i * 3 + 1] = -2.1 + Math.random() * 0.9;
      cloudPositions[i * 3 + 2] = (Math.random() - 0.5) * 10.0;
      cloudSpeeds.push({
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
        amplitude: 0.06 + Math.random() * 0.08
      });
    }
    cloudGeom.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
    const cloudMaterial = new THREE.PointsMaterial({
      color: '#00e5ff',
      size: 0.16,
      transparent: true,
      opacity: 0.0, // starts invisible
      blending: THREE.AdditiveBlending
    });
    cloudMaterialRef.current = cloudMaterial;
    const cloudPoints = new THREE.Points(cloudGeom, cloudMaterial);
    scene.add(cloudPoints);

    // --- Parallax Coordinates ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- Interactive Scroll & Wheel Gesture Controls ---
    const handleWheel = (e) => {
      if (containerRef.current && containerRef.current.dataset.entering === 'true') return;
      if (autoScrollRef.current) return;
      
      const delta = e.deltaY * 0.0012; // speed factor
      scrollProgressRef.current = Math.max(0, Math.min(1.0, scrollProgressRef.current + delta));
    };

    let touchStartVal = 0;
    const handleTouchStart = (e) => {
      if (containerRef.current && containerRef.current.dataset.entering === 'true') return;
      if (autoScrollRef.current) return;
      touchStartVal = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (containerRef.current && containerRef.current.dataset.entering === 'true') return;
      if (autoScrollRef.current) return;
      const currentVal = e.touches[0].clientY;
      const delta = (touchStartVal - currentVal) * 0.0035; // sensitivity
      scrollProgressRef.current = Math.max(0, Math.min(1.0, scrollProgressRef.current + delta));
      touchStartVal = currentVal;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // --- Entrance Animation Timers ---
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        isLoadedRef.current = true;
        setIsLoaded(true);
      }
      setLoadingProgress(progress);
    }, 50);

    // --- Animation Loop ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const timeline = timelineRef.current;

      if (isLoadedRef.current) {
        timeline.time += 0.016;

        // Smoothly interpolate scroll progress for silky-smooth inertia
        smoothScrollRef.current += (scrollProgressRef.current - smoothScrollRef.current) * 0.08;
        const scrollProgress = smoothScrollRef.current;

        // Fade in Text, Grid, and Cloud floor as they enter the screen
        const fadeInProgress = Math.min(timeline.time * 1.5, 1.0);

        // Map scrollProgress (0 to 1) to camera position Z: from 7.2 down to -1.8 (dives right through "U")
        // We also map camera Y slightly downward to angle the dive
        const targetCamZ = THREE.MathUtils.lerp(7.2, -1.8, scrollProgress);
        const targetCamY = THREE.MathUtils.lerp(0.0, -0.35, scrollProgress);
        camera.position.z = targetCamZ;
        camera.position.y = targetCamY;

        // Parallax coordinate offset (reduced as we zoom in closer to keep camera on path)
        const parallaxMult = 1.0 - scrollProgress;
        targetX += (mouseX - targetX) * 0.06;
        targetY += (mouseY - targetY) * 0.06;
        camera.position.x = targetX * 0.5 * parallaxMult;

        // Text and Grid/Cloud Opacity control:
        // They fade out as we zoom deep into the portal
        if (textMaterialRef.current) {
          textMaterialRef.current.opacity = fadeInProgress * (1 - Math.min(1.0, scrollProgress * 1.25));
        }
        if (gridMaterialRef.current) {
          gridMaterialRef.current.opacity = fadeInProgress * 0.15 * (1 - scrollProgress);
        }
        if (cloudMaterialRef.current) {
          cloudMaterialRef.current.opacity = fadeInProgress * 0.25 * (1 - scrollProgress);
        }

        // Float / Sway effect for text group (only active at low scroll, settles as camera speeds up)
        const floatIntensity = Math.max(0, 1 - scrollProgress * 2.0);
        if (textGroupRef.current) {
          textGroupRef.current.position.y = Math.sin(elapsedTime * 1.0) * 0.04 * floatIntensity;
          textGroupRef.current.rotation.y = targetX * 0.08 * floatIntensity;
        }

        specularLight.position.x = targetX * 4.0;
        specularLight.position.y = -targetY * 3.0;

        // Animate wavy grid vertices
        const posAttr = gridGeometry.attributes.position;
        const gridTime = elapsedTime * 0.7;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const vz = Math.sin(vx * 0.16 + gridTime) * Math.cos(vy * 0.16 + gridTime) * 0.38 
                   + Math.sin(vx * 0.32 + gridTime * 1.4) * 0.14;
          posAttr.setZ(i, vz);
        }
        posAttr.needsUpdate = true;

        // Animate cloud particles
        const cloudPos = cloudPositions;
        for (let i = 0; i < cloudCount; i++) {
          const idx = i * 3;
          const speedInfo = cloudSpeeds[i];
          cloudPos[idx] += Math.sin(elapsedTime * 0.08 + speedInfo.phase) * 0.0016;
          cloudPos[idx + 1] = -1.9 + Math.sin(elapsedTime * speedInfo.speed + speedInfo.phase) * speedInfo.amplitude;
          if (Math.abs(cloudPos[idx]) > 8.0) cloudPos[idx] = -cloudPos[idx];
        }
        cloudPoints.geometry.attributes.position.needsUpdate = true;

        // --- TRIGGER PORTAL ENTRY TRANSITION ---
        if (scrollProgress >= 0.985 && !isEntering) {
          setIsEntering(true);
          autoScrollRef.current = true;
          if (containerRef.current) {
            containerRef.current.dataset.entering = 'true';
          }
          setTimeout(() => {
            onEnter();
          }, 600); // smooth white fade-out transition
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearInterval(loadInterval);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        if (renderer.domElement.parentNode) {
          container.removeChild(renderer.domElement);
        }
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-between pointer-events-auto select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Vignette Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(1,2,6,0.95)_90%)] z-0" />

      {/* Dynamic Overlay */}
      <div 
        className={`absolute inset-0 bg-transparent flex flex-col items-center justify-between py-12 px-4 z-10 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${
          isEntering ? 'opacity-0 scale-90 blur-md pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Spacer for flex alignment */}
        <div />

        {/* Top Tagline positioned above the 3D text centerpiece with balanced gap */}
        <div className="absolute top-[20%] sm:top-[22%] md:top-[24%] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 tracking-wider text-center select-none pointer-events-none">
          <span className="text-[#00ffff] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
            Next-Gen Smart Campus
          </span>
        </div>

        {/* Loading / Action Button Panel */}
        <div className="flex flex-col items-center gap-4 mb-4 w-full max-w-xs z-20">
          {!isLoaded ? (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-[#7c3aed] via-[#0d9488] to-[#00ffff] transition-all duration-300 rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
                Initializing 3D Matrix... {loadingProgress}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3.5 w-full animate-fade-in">
              {/* Scroll / Swipe Indicator */}
              <div className="flex flex-col items-center gap-1.5 select-none pointer-events-none opacity-70 transition-opacity">
                <span className="text-[10px] sm:text-xs text-[#00ffff] tracking-[0.25em] uppercase font-bold animate-pulse text-center">
                  Scroll or Swipe to Dive In
                </span>
                <div className="flex flex-col items-center gap-0.5 mt-1.5 animate-bounce">
                  <svg className="w-5 h-5 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Entering Portal Bloom Overlay (Solid White Flash transition) */}
      <div 
        className={`absolute inset-0 bg-white z-20 pointer-events-none transition-opacity duration-700 ${
          isEntering ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

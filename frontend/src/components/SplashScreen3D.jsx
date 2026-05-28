import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SplashScreen3D({ onEnter }) {
  const containerRef = useRef(null);
  const isLoadedRef = useRef(false);
  const timelineRef = useRef({ time: 0, state: 'particles-forming' });
  const [isEntering, setIsEntering] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
    // Start dark and very close, panning up from bottom
    camera.position.set(-1.2, 0.8, 3.8);
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

    // Emissive focus light at center spine
    const spinePortalLight = new THREE.PointLight('#00ffff', 0.0, 8);
    spinePortalLight.position.set(0, 0, 0.1);
    scene.add(spinePortalLight);

    // Specular highlight light
    const specularLight = new THREE.PointLight('#00ffff', 5.0, 12);
    specularLight.position.set(1.0, 0.5, 2.0);
    scene.add(specularLight);

    // --- 3D Logo Container ---
    const logoContainer = new THREE.Group();
    scene.add(logoContainer);

    // --- Materials (Polished Glass, Chrome, and Neon Glow) ---
    const navyMaterial = new THREE.MeshPhysicalMaterial({
      color: '#0e113c',
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.0, // Materializes dynamically
    });

    const tealMaterial = new THREE.MeshPhysicalMaterial({
      color: '#0d9488',
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.0, // Materializes dynamically
    });

    const pageMaterial = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.0,
    });

    const portalMaterial = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });

    // --- Unfolding Book Assemblies ---
    const leftBookGroup = new THREE.Group();
    logoContainer.add(leftBookGroup);

    const rightBookGroup = new THREE.Group();
    logoContainer.add(rightBookGroup);

    const borderThickness = 0.075;

    // LEFT COVER ASSEMBLY (Deep Navy Blue Metallic)
    const spineLeft = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 1.8, borderThickness), navyMaterial);
    spineLeft.position.set(-0.02, 0, 0);
    leftBookGroup.add(spineLeft);

    const outerLeft = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 1.8, borderThickness), navyMaterial);
    outerLeft.position.set(-1.15, 0, 0);
    leftBookGroup.add(outerLeft);

    const topLeft = new THREE.Mesh(new THREE.BoxGeometry(1.15, borderThickness, borderThickness), navyMaterial);
    topLeft.position.set(-0.575, 0.9, 0);
    leftBookGroup.add(topLeft);

    const bottomLeft = new THREE.Mesh(new THREE.BoxGeometry(1.15, borderThickness, borderThickness), navyMaterial);
    bottomLeft.position.set(-0.575, -0.9, 0);
    leftBookGroup.add(bottomLeft);

    const eBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.065, borderThickness - 0.015), navyMaterial);
    eBar1.position.set(-0.48, 0.35, 0);
    leftBookGroup.add(eBar1);

    const eBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.065, borderThickness - 0.015), navyMaterial);
    eBar2.position.set(-0.48, -0.35, 0);
    leftBookGroup.add(eBar2);

    // Left Inner Pages
    const leftPageGeom = new THREE.BoxGeometry(0.95, 1.68, 0.012);
    for (let i = 0; i < 3; i++) {
      const page = new THREE.Mesh(leftPageGeom, pageMaterial);
      page.position.set(-0.55, 0, 0.02 + i * 0.02);
      page.rotation.y = -0.025 * (i + 1);
      leftBookGroup.add(page);
    }

    // RIGHT COVER ASSEMBLY (Teal Metallic)
    const spineRight = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 1.8, borderThickness), tealMaterial);
    spineRight.position.set(0.02, 0, 0);
    rightBookGroup.add(spineRight);

    const outerRight = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 1.8, borderThickness), tealMaterial);
    outerRight.position.set(1.15, 0, 0);
    rightBookGroup.add(outerRight);

    const topRight = new THREE.Mesh(new THREE.BoxGeometry(1.15, borderThickness, borderThickness), tealMaterial);
    topRight.position.set(0.575, 0.9, 0);
    rightBookGroup.add(topRight);

    const bottomRight = new THREE.Mesh(new THREE.BoxGeometry(1.15, borderThickness, borderThickness), tealMaterial);
    bottomRight.position.set(0.575, -0.9, 0);
    rightBookGroup.add(bottomRight);

    // Right Inner Pages
    const rightPageGeom = new THREE.BoxGeometry(0.95, 1.68, 0.012);
    for (let i = 0; i < 3; i++) {
      const page = new THREE.Mesh(rightPageGeom, pageMaterial);
      page.position.set(0.55, 0, 0.02 + i * 0.02);
      page.rotation.y = 0.025 * (i + 1);
      rightBookGroup.add(page);
    }

    // Center Spine Cylinder
    const spineCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.95, 16), navyMaterial);
    logoContainer.add(spineCenter);

    // --- Embedded Portal (Central cylinder inside spine, unfolds to bright white) ---
    const portalCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.92, 16), portalMaterial);
    portalCyl.position.set(0, 0, 0.02);
    portalCyl.scale.set(0.01, 1, 0.01);
    logoContainer.add(portalCyl);

    // --- SPROUTING NEURAL NETWORK ---
    const networkGroup = new THREE.Group();
    networkGroup.position.set(0, 0, 0.025);
    rightBookGroup.add(networkGroup);

    const nodeGeom = new THREE.SphereGeometry(0.052, 32, 32);
    
    const logoNodeCoords = [
      new THREE.Vector3(1.15, 0.35, 0.1),
      new THREE.Vector3(1.35, 0.65, 0.15),
      new THREE.Vector3(1.65, 0.90, 0.2),
      new THREE.Vector3(1.25, 1.05, 0.15),
      new THREE.Vector3(1.45, 0.20, 0.15),
      new THREE.Vector3(1.70, 0.50, 0.2),
      new THREE.Vector3(1.30, -0.15, 0.1),
      new THREE.Vector3(1.60, -0.20, 0.15),
    ];

    const nodes = [];
    logoNodeCoords.forEach((pos, idx) => {
      const scale = idx === 0 ? 1.25 : 0.85;

      // Unique emissive material for sequential lighting
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: '#00ffff',
        roughness: 0.1,
        metalness: 0.9,
        emissive: '#00ffff',
        emissiveIntensity: 0.0, // starts dark
        transparent: true,
        opacity: 0.0 // materializes dynamically
      });

      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMaterial);
      nodeMesh.position.copy(pos);
      nodeMesh.scale.set(scale, scale, scale);
      networkGroup.add(nodeMesh);

      nodes.push({
        mesh: nodeMesh,
        material: nodeMaterial,
        basePos: pos.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 1.5,
        turnOnTime: 1.5 + idx * 0.25 // Sequential boot times
      });
    });

    const connectors = [
      [0, 1], [1, 2], [1, 3], [0, 4], [4, 5], [1, 5], [0, 6], [6, 7]
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
      color: '#00ffff',
      transparent: true,
      opacity: 0.0, // materializes dynamically
    });

    const connectorMeshes = [];
    connectors.forEach(([from, to]) => {
      const p1 = logoNodeCoords[from];
      const p2 = logoNodeCoords[to];

      const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(lineGeom, lineMaterial);
      networkGroup.add(line);
      connectorMeshes.push({
        mesh: line,
        fromIdx: from,
        toIdx: to
      });
    });

    // --- Neural energy pulses ---
    const pulseCount = 3;
    const pulseGeom = new THREE.SphereGeometry(0.024, 16, 16);
    const pulses = [];
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.0 // starts invisible
    });

    for (let i = 0; i < pulseCount; i++) {
      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMaterial);
      networkGroup.add(pulseMesh);
      
      const connectorIndex = Math.floor(Math.random() * connectors.length);
      pulses.push({
        mesh: pulseMesh,
        connectorIdx: connectorIndex,
        progress: Math.random(),
        speed: 0.009 + Math.random() * 0.012
      });
    }

    // --- Particle Materialization (Cyan particles forming the logo outline) ---
    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleTargets = [];
    const particleRandomSources = [];

    // Sample targets directly along book outline to materialize the logo shape
    for (let i = 0; i < particleCount; i++) {
      let x = 0, y = 0, z = 0;
      
      if (i < 100) {
        // Left Cover Outline targets
        const ratio = (i / 100) * Math.PI * 2;
        x = -0.55 + Math.cos(ratio) * 0.6;
        y = Math.sin(ratio) * 0.9;
        z = -0.05 + (Math.random() - 0.5) * 0.1;
      } else if (i < 200) {
        // Right Cover Outline targets
        const ratio = ((i - 100) / 100) * Math.PI * 2;
        x = 0.55 + Math.cos(ratio) * 0.6;
        y = Math.sin(ratio) * 0.9;
        z = -0.05 + (Math.random() - 0.5) * 0.1;
      } else {
        // Sprouting network targets
        const nodeIdx = (i - 200) % logoNodeCoords.length;
        const targetCoord = logoNodeCoords[nodeIdx];
        x = targetCoord.x;
        y = targetCoord.y;
        z = targetCoord.z + (Math.random() - 0.5) * 0.1;
      }

      particleTargets.push(new THREE.Vector3(x, y, z));
      
      // Scattered origin coordinates in space
      const randX = (Math.random() - 0.5) * 12.0;
      const randY = (Math.random() - 0.5) * 12.0;
      const randZ = 1.0 + Math.random() * 4.0;
      particleRandomSources.push(new THREE.Vector3(randX, randY, randZ));

      particleCoords[i * 3] = randX;
      particleCoords[i * 3 + 1] = randY;
      particleCoords[i * 3 + 2] = randZ;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: '#00ffff',
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(particleGeom, starMaterial);
    scene.add(starParticles);

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

    // --- Entrance Animation Timers ---
    logoContainer.scale.set(0.01, 0.01, 0.01);
    leftBookGroup.rotation.y = 0;
    rightBookGroup.rotation.y = 0;

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
    }, 60);

    // --- Animation Loop ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const timeline = timelineRef.current;

      if (isLoadedRef.current) {
        timeline.time += 0.016; // Increment logical timeline only when loaded!

        // --- STEP 1: Darkness & Particles Condensing to form book ---
        if (timeline.state === 'particles-forming') {
          const positions = starParticles.geometry.attributes.position.array;
          
          // Easing factor: slowly gather particles over 1.6 seconds
          const gatherProgress = Math.min(timeline.time / 1.6, 1.0);
          const easeProgress = 1 - Math.pow(1 - gatherProgress, 3); // Cubic Ease Out

          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const source = particleRandomSources[i];
            const dest = particleTargets[i];

            // Lerp from scatter source to target book points
            positions[idx] = THREE.MathUtils.lerp(source.x, dest.x, easeProgress);
            positions[idx + 1] = THREE.MathUtils.lerp(source.y, dest.y, easeProgress);
            positions[idx + 2] = THREE.MathUtils.lerp(source.z, dest.z, easeProgress);
          }
          starParticles.geometry.attributes.position.needsUpdate = true;

          // Materialize Solid Book Covers at t = 0.8s
          if (timeline.time > 0.8) {
            const matProgress = Math.min((timeline.time - 0.8) / 0.8, 1.0);
            
            navyMaterial.opacity = matProgress;
            tealMaterial.opacity = matProgress;
            pageMaterial.opacity = matProgress;
            
            // Scaled in matching the materialization
            const introScale = THREE.MathUtils.lerp(0.01, 0.70, matProgress);
            logoContainer.scale.set(introScale, introScale, introScale);
          }

          if (timeline.time > 1.6) {
            timeline.state = 'nodes-igniting';
          }
        }

        // --- STEP 2: AI Nodes Illuminate Sequentially ---
        if (timeline.state === 'nodes-igniting') {
          // Safety: Force book cover opacities to full solid
          navyMaterial.opacity = 1.0;
          tealMaterial.opacity = 1.0;
          pageMaterial.opacity = 1.0;
          if (logoContainer.scale.x < 0.7) {
            logoContainer.scale.set(0.7, 0.7, 0.7);
          }

          // Open pages slightly during sequential ignition
          const unfoldingProgress = Math.min((timeline.time - 1.6) / 2.0, 1.0);
          const targetAngle = 0.38 * unfoldingProgress;
          leftBookGroup.rotation.y = targetAngle;
          rightBookGroup.rotation.y = -targetAngle;

          // Light up nodes sequentially based on their individual turnOnTime
          nodes.forEach((node) => {
            if (timeline.time > node.turnOnTime) {
              node.mesh.opacity = 1.0;
              node.material.opacity = 1.0;
              
              // Fade in intensity up to 1.4 glow
              const intensity = Math.min((timeline.time - node.turnOnTime) * 2.0, 1.4);
              node.material.emissiveIntensity = intensity;
            }
          });

          // Animate connector opacity matching sequential nodes
          lineMaterial.opacity = Math.min((timeline.time - 1.6) / 1.5, 0.65);
          pulseMaterial.opacity = Math.min((timeline.time - 2.0) / 1.0, 0.9);

          // Panning camera to standard focus center
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.025);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.025);
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.2, 0.025);

          if (timeline.time > 3.6) {
            timeline.state = 'interactive-idle';
          }
        }

        // --- STEP 3: Levitation & Interactive Mouse Parallax ---
        if (timeline.state === 'interactive-idle') {
          // Safety: Force solid rendering of book and logo scaling
          navyMaterial.opacity = 1.0;
          tealMaterial.opacity = 1.0;
          pageMaterial.opacity = 1.0;
          if (logoContainer.scale.x < 0.7) {
            logoContainer.scale.set(0.7, 0.7, 0.7);
          }

          // Keep all sequential elements fully active
          nodes.forEach((node) => {
            node.material.emissiveIntensity = 1.2 + Math.sin(elapsedTime * 3.0 + node.phase) * 0.25;
          });

          // Levitating float
          logoContainer.position.y = Math.sin(elapsedTime * 0.8) * 0.08;
          logoContainer.position.x = Math.cos(elapsedTime * 0.6) * 0.03;

          targetX += (mouseX - targetX) * 0.06;
          targetY += (mouseY - targetY) * 0.06;

          logoContainer.rotation.y = targetX * 0.22;
          logoContainer.rotation.x = -targetY * 0.12;

          specularLight.position.x = targetX * 4.0;
          specularLight.position.y = -targetY * 3.0;

          // Dissolve forming particles back into an orbital dust field
          const positions = starParticles.geometry.attributes.position.array;
          for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            // Float gently around book
            starPositionsFloating(positions, idx, i, elapsedTime);
          }
          starParticles.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Helper function to animate stars
      function starPositionsFloating(positions, idx, i, time) {
        const target = particleTargets[i];
        // Slow sway wave offset
        positions[idx] = target.x + Math.sin(time * 0.8 + i) * 0.08;
        positions[idx + 1] = target.y + Math.cos(time * 0.5 + i) * 0.08;
        positions[idx + 2] = target.z + Math.sin(time * 1.2 + i) * 0.06;
      }

      // --- 4. Floating Nodes ---
      if (timeline.state !== 'particles-forming') {
        nodes.forEach((node) => {
          const bounce = Math.sin(elapsedTime * node.speed + node.phase) * 0.025;
          node.mesh.position.y = node.basePos.y + bounce;
          node.mesh.position.x = node.basePos.x + Math.cos(elapsedTime * node.speed + node.phase) * 0.015;
        });

        connectorMeshes.forEach((conn) => {
          const p1 = nodes[conn.fromIdx].mesh.position;
          const p2 = nodes[conn.toIdx].mesh.position;
          const positions = conn.mesh.geometry.attributes.position.array;

          positions[0] = p1.x;
          positions[1] = p1.y;
          positions[2] = p1.z;
          positions[3] = p2.x;
          positions[4] = p2.y;
          positions[5] = p2.z;
          
          conn.mesh.geometry.attributes.position.needsUpdate = true;
        });
      }

      // --- 5. Energy Pulses ---
      if (timeline.state !== 'particles-forming') {
        pulses.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress > 1.0) {
            pulse.progress = 0;
            pulse.connectorIdx = Math.floor(Math.random() * connectors.length);
          }

          const connector = connectors[pulse.connectorIdx];
          const startNode = nodes[connector[0]].mesh.position;
          const endNode = nodes[connector[1]].mesh.position;
          
          pulse.mesh.position.lerpVectors(startNode, endNode, pulse.progress);
          
          const scaleVal = 0.7 + Math.sin(elapsedTime * 6.0 + pulse.progress * Math.PI) * 0.3;
          pulse.mesh.scale.set(scaleVal, scaleVal, scaleVal);
        });
      }

      // --- 6. Enter Portal Zoom ---
      if (containerRef.current && containerRef.current.dataset.entering === 'true') {
        // Swing pages open wide
        leftBookGroup.rotation.y = THREE.MathUtils.lerp(leftBookGroup.rotation.y, 1.25, 0.08);
        rightBookGroup.rotation.y = THREE.MathUtils.lerp(rightBookGroup.rotation.y, -1.25, 0.08);

        // Open and illuminate white portal mesh
        portalCyl.scale.x = THREE.MathUtils.lerp(portalCyl.scale.x, 3.5, 0.08);
        portalCyl.scale.z = THREE.MathUtils.lerp(portalCyl.scale.z, 3.5, 0.08);
        portalMaterial.opacity = THREE.MathUtils.lerp(portalMaterial.opacity, 1.0, 0.08);
        spinePortalLight.intensity = THREE.MathUtils.lerp(spinePortalLight.intensity, 15.0, 0.08);

        // Volumetric zoom acceleration
        camera.position.z -= 0.16;
        camera.position.x += (0 - camera.position.x) * 0.2;
        camera.position.y += (0 - camera.position.y) * 0.2;

        logoContainer.rotation.y += (0 - logoContainer.rotation.y) * 0.2;
        logoContainer.rotation.x += (0 - logoContainer.rotation.x) * 0.2;
        scene.fog.color.lerp(new THREE.Color('#00ffff'), 0.16);
      } else {
        camera.lookAt(logoContainer.position);
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
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  const handleEnterClick = () => {
    setIsEntering(true);
    if (containerRef.current) {
      containerRef.current.dataset.entering = 'true';
    }
    setTimeout(() => {
      onEnter();
    }, 1300);
  };

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
        {/* Top Header */}
        <div className="flex flex-col items-center gap-1.5 tracking-wider text-center mt-4">
          <span className="text-[#00ffff] text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
            Next-Gen Smart Campus
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-none mt-2 select-none tracking-[0.1em]">
            EDUFY
          </h1>
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent mt-4" />
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
              <button
                onClick={handleEnterClick}
                className="group relative w-full py-4 px-6 rounded-2xl bg-white text-slate-950 font-black text-xs overflow-hidden transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(0,255,255,0.25)] hover:shadow-[0_0_60px_rgba(0,255,255,0.5)] border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ffff] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                <span className="relative z-10 flex items-center justify-center gap-2.5 tracking-[0.2em] group-hover:text-white transition-colors duration-300">
                  ENTER PORTAL
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
              
              <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase text-center mt-1">
                Enter the world of Edufy
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Entering Portal Bloom Overlay */}
      <div 
        className={`absolute inset-0 bg-[#00ffff] z-20 pointer-events-none transition-opacity duration-1000 ${
          isEntering ? 'opacity-35' : 'opacity-0'
        }`}
      />
    </div>
  );
}

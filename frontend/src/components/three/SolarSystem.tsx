import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import sunTextureImg from '@/assets/sun-texture.png';

// Sun component with texture and glow - optimized
const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const sunTexture = useTexture(sunTextureImg);
  const rotationRef = useRef(0);
  const coronaScaleRef = useRef(1);

  sunTexture.wrapS = THREE.RepeatWrapping;
  sunTexture.wrapT = THREE.ClampToEdgeWrapping;

  useFrame(({ clock }) => {
    rotationRef.current += 0.0003;
    if (sunRef.current) sunRef.current.rotation.y = rotationRef.current;
    
    if (coronaRef.current) {
      coronaScaleRef.current = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
      coronaRef.current.rotation.z = rotationRef.current * 0.67;
      coronaRef.current.scale.setScalar(coronaScaleRef.current);
    }
  });

  return (
    <group>
      <Sphere ref={sunRef} args={[2, 24, 20]} position={[0, 0, 0]}>
        <meshBasicMaterial map={sunTexture} color="#ffffff" />
      </Sphere>
      <Sphere args={[2.05, 16, 12]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffaa33" transparent opacity={0.3} />
      </Sphere>
      <Sphere ref={coronaRef} args={[2.2, 12, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ff9922" transparent opacity={0.25} />
      </Sphere>
      <Sphere args={[2.5, 12, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ff8811" transparent opacity={0.15} />
      </Sphere>
      <pointLight color="#ffcc66" intensity={3} distance={150} decay={2} />
    </group>
  );
};

// Lightweight procedural texture generator
const useRealisticPlanetTexture = (config: {
  type: 'terrestrial' | 'gas' | 'rocky' | 'ice';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  hasOceans?: boolean;
  oceanColor?: string;
  resolution?: number;
}) => {
  return useMemo(() => {
    const resolution = config.resolution || 256;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution / 2;
    const ctx = canvas.getContext('2d')!;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)
      } : { r: 128, g: 128, b: 128 };
    };

    const noise = (x: number, y: number, octaves: number = 4, persistence: number = 0.5) => {
      let value = 0, amplitude = 1, frequency = 1, maxValue = 0;
      for (let i = 0; i < octaves; i++) {
        value += Math.sin(x * frequency * 0.02 + Math.cos(y * frequency * 0.015)) *
                 Math.cos(y * frequency * 0.018 + Math.sin(x * frequency * 0.012)) * amplitude;
        value += Math.sin((x + y) * frequency * 0.01 + i * 1.5) * amplitude * 0.5;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }
      return (value / maxValue + 1) * 0.5;
    };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const primary = hexToRgb(config.primaryColor);
    const secondary = hexToRgb(config.secondaryColor);
    const tertiary = config.tertiaryColor ? hexToRgb(config.tertiaryColor) : secondary;
    const ocean = config.oceanColor ? hexToRgb(config.oceanColor) : { r: 30, g: 80, b: 140 };

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        let r, g, b;

        if (config.type === 'terrestrial') {
          const continentNoise = noise(x, y, 5, 0.6);
          const detailNoise = noise(x * 2, y * 2, 3, 0.4);
          const isOcean = config.hasOceans && continentNoise < 0.45;
          const isDesert = continentNoise > 0.7 && Math.abs(y - canvas.height / 2) < canvas.height * 0.2;

          if (isOcean) {
            const depth = continentNoise / 0.45;
            r = Math.floor(ocean.r * (0.6 + depth * 0.4) + detailNoise * 15);
            g = Math.floor(ocean.g * (0.7 + depth * 0.3) + detailNoise * 20);
            b = Math.floor(ocean.b * (0.8 + depth * 0.2) + detailNoise * 25);
          } else if (isDesert) {
            r = Math.floor(tertiary.r * (0.9 + detailNoise * 0.2));
            g = Math.floor(tertiary.g * (0.85 + detailNoise * 0.15));
            b = Math.floor(tertiary.b * (0.8 + detailNoise * 0.1));
          } else {
            const vegBlend = detailNoise;
            r = Math.floor(primary.r * vegBlend + secondary.r * (1 - vegBlend));
            g = Math.floor(primary.g * vegBlend + secondary.g * (1 - vegBlend));
            b = Math.floor(primary.b * vegBlend + secondary.b * (1 - vegBlend));
          }
        } else if (config.type === 'gas') {
          const bandNoise = noise(x * 0.5, y * 3, 3, 0.7);
          const latBand = Math.sin(y / canvas.height * Math.PI * 12 + bandNoise * 2);
          const blend = (latBand + 1) * 0.5;
          r = Math.floor(primary.r * blend + secondary.r * (1 - blend));
          g = Math.floor(primary.g * blend + secondary.g * (1 - blend));
          b = Math.floor(primary.b * blend + secondary.b * (1 - blend));
        } else if (config.type === 'rocky') {
          const baseNoise = noise(x, y, 4, 0.5);
          const craterNoise = noise(x * 3, y * 3, 2, 0.6);
          r = Math.floor(primary.r * baseNoise + secondary.r * (1 - baseNoise) - craterNoise * 30);
          g = Math.floor(primary.g * baseNoise + secondary.g * (1 - baseNoise) - craterNoise * 25);
          b = Math.floor(primary.b * baseNoise + secondary.b * (1 - baseNoise) - craterNoise * 20);
        } else {
          const iceNoise = noise(x, y, 3, 0.6);
          r = Math.floor(200 + iceNoise * 55);
          g = Math.floor(210 + iceNoise * 45);
          b = Math.floor(230 + iceNoise * 25);
        }

        data[i] = Math.min(255, Math.max(0, r));
        data[i + 1] = Math.min(255, Math.max(0, g));
        data[i + 2] = Math.min(255, Math.max(0, b));
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [config]);
};

// Cloud layer texture - only used when needed
const useCloudTexture = (enabled: boolean) => {
  return useMemo(() => {
    if (!enabled) return null;
    const resolution = 256;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution / 2;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        let cloud = 0;
        cloud += Math.sin(x * 0.02 + Math.cos(y * 0.015)) * 0.3;
        cloud += Math.sin(x * 0.05 + y * 0.03) * Math.cos(y * 0.02) * 0.4;
        cloud += Math.sin((x + y) * 0.015) * 0.2;
        cloud = (cloud + 1) * 0.5;
        const alpha = cloud > 0.4 ? (cloud - 0.4) * 2 : 0;
        data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
        data[i + 3] = Math.floor(alpha * 180);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [enabled]);
};

// Ring texture
const useRingTexture = (enabled: boolean, innerColor: string, outerColor: string) => {
  return useMemo(() => {
    if (!enabled) return null;
    const resolution = 256;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)
      } : { r: 200, g: 180, b: 150 };
    };

    const inner = hexToRgb(innerColor);
    const outer = hexToRgb(outerColor);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let x = 0; x < canvas.width; x++) {
      const t = x / canvas.width;
      let alpha = 0.8;
      if (t > 0.3 && t < 0.35) alpha = 0.2;
      if (t > 0.5 && t < 0.52) alpha = 0.3;
      if (t > 0.7 && t < 0.73) alpha = 0.15;

      data[x * 4] = Math.floor(inner.r * (1 - t) + outer.r * t);
      data[x * 4 + 1] = Math.floor(inner.g * (1 - t) + outer.g * t);
      data[x * 4 + 2] = Math.floor(inner.b * (1 - t) + outer.b * t);
      data[x * 4 + 3] = Math.floor(alpha * 255);
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [enabled, innerColor, outerColor]);
};

// Optimized planet component
interface RealisticPlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  planetType: 'terrestrial' | 'gas' | 'rocky' | 'ice';
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  initialAngle?: number;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  hasClouds?: boolean;
  hasOceans?: boolean;
  oceanColor?: string;
  hasRing?: boolean;
  ringInnerColor?: string;
  ringOuterColor?: string;
  rotationSpeed?: number;
  tilt?: number;
}

const RealisticPlanet = ({
  radius, orbitRadius, speed, planetType, primaryColor, secondaryColor, tertiaryColor,
  initialAngle = 0, hasAtmosphere, atmosphereColor = '#88ccff', atmosphereIntensity = 1,
  hasClouds, hasOceans, oceanColor, hasRing, ringInnerColor = '#d4b896', ringOuterColor = '#8b7355',
  rotationSpeed = 0.005, tilt = 0,
}: RealisticPlanetProps) => {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const surfaceTexture = useRealisticPlanetTexture({
    type: planetType, primaryColor, secondaryColor, tertiaryColor, hasOceans, oceanColor, resolution: 256,
  });

  const cloudTexture = useCloudTexture(!!hasClouds);
  const ringTexture = useRingTexture(!!hasRing, ringInnerColor, ringOuterColor);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      const t = clock.getElapsedTime() * speed + initialAngle;
      planetRef.current.position.x = Math.cos(t) * orbitRadius;
      planetRef.current.position.z = Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) meshRef.current.rotation.y += rotationSpeed;
    if (cloudRef.current) cloudRef.current.rotation.y += rotationSpeed * 1.2;
  });

  return (
    <group ref={planetRef}>
      <group rotation={[tilt, 0, 0]}>
        {/* Main planet surface - ultra-optimized segments */}
        <Sphere ref={meshRef} args={[radius, 24, 18]}>
          <meshStandardMaterial map={surfaceTexture} roughness={0.8} metalness={0.1} />
        </Sphere>

        {/* Cloud layer */}
        {hasClouds && cloudTexture && (
          <Sphere ref={cloudRef} args={[radius * 1.015, 18, 12]}>
            <meshStandardMaterial map={cloudTexture} transparent opacity={0.7} depthWrite={false} />
          </Sphere>
        )}

        {/* Atmosphere - single layer */}
        {hasAtmosphere && (
          <Sphere args={[radius * 1.06, 18, 12]}>
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={0.2 * atmosphereIntensity}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
        )}

        {/* Ring system */}
        {hasRing && ringTexture && (
          <group rotation={[Math.PI / 2.2, 0.1, 0]}>
            <mesh>
              <ringGeometry args={[radius * 1.4, radius * 2.4, 40]} />
              <meshBasicMaterial map={ringTexture} transparent opacity={0.85} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// Simplified orbit ring - ultra-optimized
const OrbitRing = ({ radius }: { radius: number }) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    <mesh>
      <ringGeometry args={[radius - 0.03, radius + 0.03, 48]} />
      <meshBasicMaterial color="#f5c36a" transparent opacity={0.35} side={THREE.DoubleSide} />
    </mesh>
  </group>
);

// Camera controller with GSAP smooth animation
const CameraController = ({ scrollProgress }: { scrollProgress: number }) => {
  const { camera, size } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  const cameraState = useRef({ x: 0, y: 3, z: 30 });
  const isMobile = size.width < 768;
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const mobileZoomOffset = isMobile ? 20 : 0;
    const targetZ = 30 + mobileZoomOffset - scrollProgress * 25;
    const targetX = isMobile ? 0 : mousePos.current.x * 4;
    const targetY = (isMobile ? 0 : mousePos.current.y * 3) + 3;

    // Kill previous tween
    if (tweenRef.current) tweenRef.current.kill();

    // Create smooth GSAP tween
    tweenRef.current = gsap.to(cameraState.current, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [scrollProgress, isMobile]);

  useFrame(() => {
    camera.position.x = cameraState.current.x;
    camera.position.y = cameraState.current.y;
    camera.position.z = cameraState.current.z;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Ultra-optimized particle field - reduced count
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const rotationRef = useRef(0);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(300 * 3); // Reduced from 600
    const colors = new Float32Array(300 * 3);

    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const warmth = Math.random() * 0.3;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.9 + warmth * 0.1;
      colors[i * 3 + 2] = 0.7 + warmth * 0.2;
    }
    return { positions, colors };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      rotationRef.current += 0.00003;
      particlesRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={300} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={300} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} transparent opacity={0.7} vertexColors sizeAttenuation />
    </points>
  );
};

interface SolarSystemProps {
  scrollProgress: number;
}

export const SolarSystemScene = ({ scrollProgress }: SolarSystemProps) => (
  <>
    <CameraController scrollProgress={scrollProgress} />
    <ambientLight intensity={0.2} />
    <directionalLight position={[10, 5, 5]} intensity={0.5} color="#fff8e0" />

    <Stars radius={120} depth={60} count={800} factor={5} saturation={0.3} fade speed={0.5} />
    <ParticleField />

    <Sun />

    <OrbitRing radius={5} />
    <OrbitRing radius={7.5} />
    <OrbitRing radius={11} />
    <OrbitRing radius={15} />
    <OrbitRing radius={20} />

    {/* Mercury */}
    <RealisticPlanet radius={0.25} orbitRadius={5} speed={0.9} planetType="rocky"
      primaryColor="#9a8878" secondaryColor="#5a4a3a" initialAngle={0.5} rotationSpeed={0.002} />

    {/* Venus */}
    <RealisticPlanet radius={0.45} orbitRadius={7.5} speed={0.6} planetType="terrestrial"
      primaryColor="#e6c87a" secondaryColor="#c9a050" tertiaryColor="#d4a855" initialAngle={2.1}
      hasAtmosphere atmosphereColor="#ffe4a0" atmosphereIntensity={1.5} hasClouds rotationSpeed={0.001} />

    {/* Earth */}
    <RealisticPlanet radius={0.5} orbitRadius={11} speed={0.4} planetType="terrestrial"
      primaryColor="#2d5a27" secondaryColor="#3d6545" tertiaryColor="#c9a050" oceanColor="#1a5080"
      initialAngle={4.2} hasAtmosphere atmosphereColor="#88ccff" atmosphereIntensity={1.2}
      hasClouds hasOceans rotationSpeed={0.008} tilt={0.41} />

    {/* Mars */}
    <RealisticPlanet radius={0.35} orbitRadius={15} speed={0.25} planetType="rocky"
      primaryColor="#c45c3a" secondaryColor="#8b3a20" tertiaryColor="#d4704a" initialAngle={1.3}
      hasAtmosphere atmosphereColor="#ffccaa" atmosphereIntensity={0.3} rotationSpeed={0.007} tilt={0.44} />

    {/* Saturn */}
    <RealisticPlanet radius={1.1} orbitRadius={20} speed={0.12} planetType="gas"
      primaryColor="#e4c88c" secondaryColor="#c4a060" tertiaryColor="#d4b078" initialAngle={3.7}
      hasAtmosphere atmosphereColor="#f5e6c8" atmosphereIntensity={0.4}
      hasRing ringInnerColor="#d4b896" ringOuterColor="#8b7355" rotationSpeed={0.012} tilt={0.47} />
  </>
);

export const SolarSystem = ({ scrollProgress }: SolarSystemProps) => (
  <Canvas
    camera={{ position: [0, 3, 30], fov: 55 }}
    style={{
      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '100vw', height: '100%', overflow: 'hidden'
    }}
    gl={{ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false
    }}
    dpr={[1, 1]}
    frameloop="always"
    performance={{ min: 0.5, max: 1 }}
  >
    <SolarSystemScene scrollProgress={scrollProgress} />
  </Canvas>
);

export default SolarSystem;

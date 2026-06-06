import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Realistic starfield component
const StarfieldScene = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { size } = useThree();

  const { positions, colors, sizes } = useMemo(() => {
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars across a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 100 + Math.random() * 200;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Realistic star colors (white, blue-white, yellow-white, red)
      const colorType = Math.random();
      if (colorType < 0.6) {
        // White stars (most common)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorType < 0.75) {
        // Blue-white stars
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      } else if (colorType < 0.9) {
        // Yellow-white stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      } else {
        // Red/orange stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.5;
      }

      // Realistic star sizes (brightness variation)
      const brightness = Math.random();
      sizes[i] = brightness < 0.7 ? 0.5 + Math.random() * 0.8 : 1 + Math.random() * 1.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      // Very slow rotation for subtle effect
      starsRef.current.rotation.x += 0.00001;
      starsRef.current.rotation.y += 0.00002;
    }
  });

  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={1}
          sizeAttenuation
          transparent
          opacity={0.9}
          vertexColors
        />
      </points>
    </>
  );
};

interface RealisticStarfieldProps {
  scrollProgress?: number;
}

export const RealisticStarfield = ({ scrollProgress = 0 }: RealisticStarfieldProps) => (
  <Canvas
    camera={{ position: [0, 0, 0], fov: 75 }}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
    }}
    gl={{
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: true,
    }}
    dpr={[1, 1]}
    frameloop="always"
  >
    <color attach="background" args={['#000000']} />
    <StarfieldScene />
  </Canvas>
);

export default RealisticStarfield;

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Atmosphere() {
  const particlesRef = useRef<THREE.Points>(null);
  const firefliesRef = useRef<THREE.Group>(null);

  // Generate 250 subtle dust particles
  const particleCount = 200;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 9 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
      spd[i] = 0.2 + Math.random() * 0.3;
    }
    return [pos, spd];
  }, [particleCount]);

  // Fireflies data
  const fireflies = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      baseX: (Math.random() - 0.5) * 22,
      baseY: 1.2 + Math.random() * 3.5,
      baseZ: (Math.random() - 0.5) * 32,
      speed: 0.8 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? '#ffea75' : '#7affb2',
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animate dust particles
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i] * 0.015;
        if (posArray[i * 3 + 1] > 10) {
          posArray[i * 3 + 1] = 0.5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate fireflies
    if (firefliesRef.current) {
      firefliesRef.current.children.forEach((child, idx) => {
        const ff = fireflies[idx];
        if (!ff) return;
        child.position.x = ff.baseX + Math.sin(time * ff.speed + ff.phase) * 1.2;
        child.position.y = ff.baseY + Math.cos(time * ff.speed * 0.7 + ff.phase) * 0.4;
        child.position.z = ff.baseZ + Math.cos(time * ff.speed * 0.9 + ff.phase) * 1.0;
        
        // Gentle pulse
        const scale = 0.8 + Math.sin(time * 3 + ff.phase) * 0.4;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <>
      {/* Subtle night fog */}
      <color attach="background" args={['#060a17']} />
      <fog attach="fog" args={['#060a17', 14, 38]} />

      {/* Floating dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffdd88"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Fireflies group */}
      <group ref={firefliesRef}>
        {fireflies.map((ff, idx) => (
          <mesh key={idx} position={[ff.baseX, ff.baseY, ff.baseZ]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={ff.color} />
          </mesh>
        ))}
      </group>
    </>
  );
}

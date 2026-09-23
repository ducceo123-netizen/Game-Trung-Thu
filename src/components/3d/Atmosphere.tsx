import { useMemo } from 'react';

export function Atmosphere() {
  const particleCount = 72;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 4.8 + 0.25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 38 - 4;
    }
    return pos;
  }, []);

  return (
    <>
      <color attach="background" args={['#d8d5cc']} />
      <fog attach="fog" args={['#d8d5cc', 28, 58]} />
      <points frustumCulled>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#fff1c7" transparent opacity={0.22} depthWrite={false} />
      </points>
    </>
  );
}

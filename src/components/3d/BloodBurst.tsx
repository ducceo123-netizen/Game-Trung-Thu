import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function BloodBurst() {
  const damageTick = useGameStore((s) => s.damageTick);
  const root = useRef<THREE.Group>(null);
  const life = useRef(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        velocity: new THREE.Vector3(
          Math.cos((i / 10) * Math.PI * 2) * (0.35 + (i % 3) * 0.08),
          0.55 + (i % 4) * 0.12,
          Math.sin((i / 10) * Math.PI * 2) * (0.35 + (i % 2) * 0.1),
        ),
      })),
    [],
  );

  useEffect(() => {
    if (damageTick <= 0) return;
    life.current = 0.48;
    if (root.current) {
      root.current.visible = true;
      root.current.children.forEach((child) => child.position.set(0, 0.9, 0));
    }
  }, [damageTick]);

  useFrame((_, delta) => {
    if (!root.current || life.current <= 0) {
      if (root.current) root.current.visible = false;
      return;
    }
    life.current -= delta;
    root.current.children.forEach((child, i) => {
      const p = particles[i];
      child.position.x += p.velocity.x * delta;
      child.position.y += p.velocity.y * delta;
      child.position.z += p.velocity.z * delta;
      p.velocity.y -= 2.8 * delta;
    });
  });

  return (
    <group ref={root} visible={false}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.035 + (i % 3) * 0.01, 5, 5]} />
          <meshBasicMaterial color={i % 2 ? '#b91c1c' : '#ef4444'} />
        </mesh>
      ))}
    </group>
  );
}

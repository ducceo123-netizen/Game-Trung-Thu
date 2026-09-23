import { useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function BooGhost() {
  const currentFloor = useGameStore((s) => s.currentFloor);
  const warning = useGameStore((s) => s.booWarning);
  const active = useGameStore((s) => s.booActive);
  const cooldown = useGameStore((s) => s.booCooldownUntil);
  const target = useGameStore((s) => s.playerPosition);
  const triggerWarning = useGameStore((s) => s.triggerBooWarning);
  const startChase = useGameStore((s) => s.startBooChase);
  const ghost = useRef<THREE.Group>(null);
  const spawnInitialized = useRef(false);

  useEffect(() => {
    if (currentFloor !== 3 || active || warning) return;
    const remainingCooldown = Math.max(0, (cooldown ?? 0) - Date.now());
    const wait = remainingCooldown + 12000 + Math.random() * 18000;
    const timer = window.setTimeout(() => triggerWarning(), wait);
    return () => window.clearTimeout(timer);
  }, [currentFloor, active, warning, cooldown, triggerWarning]);

  useEffect(() => {
    if (!warning || currentFloor !== 3) return;
    const timer = window.setTimeout(() => startChase(), 1900 + Math.random() * 700);
    return () => window.clearTimeout(timer);
  }, [warning, currentFloor, startChase]);

  useEffect(() => {
    if (!active) spawnInitialized.current = false;
  }, [active]);

  useFrame((state, delta) => {
    if (!active || !ghost.current) return;
    const targetVec = new THREE.Vector3(target[0], 1.35, target[2]);
    if (!spawnInitialized.current) {
      const angle = Math.random() * Math.PI * 2;
      ghost.current.position.set(
        target[0] + Math.cos(angle) * 7.5,
        1.5,
        target[2] + Math.sin(angle) * 7.5,
      );
      spawnInitialized.current = true;
    }
    const dir = targetVec.clone().sub(ghost.current.position);
    dir.y = 0;
    if (dir.lengthSq() > 0.01) {
      dir.normalize();
      ghost.current.position.addScaledVector(dir, delta * 4.4);
    }
    ghost.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 5) * 0.18;
    ghost.current.lookAt(targetVec.x, ghost.current.position.y, targetVec.z);
  });

  if (!active || currentFloor !== 3) return null;

  return (
    <group ref={ghost}>
      <mesh>
        <sphereGeometry args={[0.52, 12, 10]} />
        <meshStandardMaterial color="#e8e5f5" emissive="#a78bfa" emissiveIntensity={0.6} transparent opacity={0.82} roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.68, 0]}>
        <coneGeometry args={[0.78, 1.55, 9]} />
        <meshStandardMaterial color="#d7d2e7" emissive="#7c3aed" emissiveIntensity={0.28} transparent opacity={0.66} roughness={0.88} />
      </mesh>
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.48]}>
          <sphereGeometry args={[0.075, 7, 7]} />
          <meshBasicMaterial color="#111827" />
        </mesh>
      ))}
      <mesh position={[0, -0.15, 0.5]} scale={[1.5, 0.6, 0.3]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#35152f" />
      </mesh>
      <Text position={[0, 1.0, 0]} fontSize={0.22} color="#fecaca" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#450a0a">
        BOO
      </Text>
      <pointLight color="#7c3aed" intensity={1.3} distance={4.2} decay={2} />
    </group>
  );
}

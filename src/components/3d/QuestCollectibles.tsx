import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function QuestCollectibles() {
  const questItems = useGameStore((s) => s.questItems);
  const itemsGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!itemsGroupRef.current) return;

    itemsGroupRef.current.children.forEach((child, i) => {
      // Bobbing & rotating
      child.rotation.y = time * 1.5 + i;
      child.position.y = (child.userData.baseY || 0.5) + Math.sin(time * 3 + i) * 0.08;
    });
  });

  return (
    <group ref={itemsGroupRef}>
      {questItems.map((item) => {
        if (item.collected) return null;

        return (
          <group
            key={item.id}
            position={item.position}
            userData={{ baseY: item.position[1] }}
          >
            {/* Glowing Beacon Ring on floor */}
            <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.45, 16]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.6} />
            </mesh>

            {/* Pillar beam */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 2.0, 8]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.25} />
            </mesh>

            {/* Item 1: Extension Cord (Ổ cắm Lioa cam tròn) */}
            {item.id === 'extension_cord' && (
              <group scale={[0.8, 0.8, 0.8]}>
                {/* Orange circular reel */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
                  <meshStandardMaterial color="#f97316" roughness={0.4} />
                </mesh>
                {/* 3 outlet sockets */}
                {[-0.1, 0, 0.1].map((ox, idx) => (
                  <mesh key={idx} position={[ox, 0.065, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
                    <meshBasicMaterial color="#0f172a" />
                  </mesh>
                ))}
                {/* Handle */}
                <mesh position={[0, 0.2, 0]}>
                  <torusGeometry args={[0.12, 0.02, 6, 12]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              </group>
            )}

            {/* Item 2: Hot Glue Gun (Súng bắn keo silicon) */}
            {item.id === 'glue_gun' && (
              <group scale={[0.8, 0.8, 0.8]} rotation={[0, 0, 0.4]}>
                {/* Gun body (blue/teal plastic) */}
                <mesh castShadow>
                  <boxGeometry args={[0.42, 0.15, 0.1]} />
                  <meshStandardMaterial color="#06b6d4" roughness={0.3} />
                </mesh>
                {/* Handle grip */}
                <mesh position={[-0.1, -0.16, 0]} rotation={[0, 0, -0.3]}>
                  <boxGeometry args={[0.1, 0.25, 0.09]} />
                  <meshStandardMaterial color="#0891b2" roughness={0.4} />
                </mesh>
                {/* Brass nozzle tip */}
                <mesh position={[0.25, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.04, 0.12, 8]} />
                  <meshStandardMaterial color="#eab308" metalness={0.8} />
                </mesh>
                {/* Glue stick feeding into back */}
                <mesh position={[-0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
                  <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
                </mesh>
              </group>
            )}

            {/* Item 3: LED Controller Remote (Remote LED mini) */}
            {item.id === 'led_controller' && (
              <group scale={[0.8, 0.8, 0.8]}>
                {/* White flat remote */}
                <mesh castShadow>
                  <boxGeometry args={[0.22, 0.4, 0.04]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.3} />
                </mesh>
                {/* IR emitter bulb top */}
                <mesh position={[0, 0.21, 0]}>
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshBasicMaterial color="#ec4899" />
                </mesh>
                {/* Colored mini buttons grid */}
                {Array.from({ length: 9 }).map((_, bi) => {
                  const bx = ((bi % 3) - 1) * 0.06;
                  const by = (Math.floor(bi / 3) - 1) * 0.08;
                  const bcolor = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#ffffff'][bi];
                  return (
                    <mesh key={bi} position={[bx, by, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
                      <meshBasicMaterial color={bcolor} />
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* Floating text name */}
            <group position={[0, 0.6, 0]}>
              <Text
                fontSize={0.11}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#0f172a"
              >
                {item.vietnameseName}
              </Text>
            </group>

            {/* Light source */}
            <pointLight color={item.color} intensity={2.0} distance={3.5} decay={2} />
          </group>
        );
      })}
    </group>
  );
}

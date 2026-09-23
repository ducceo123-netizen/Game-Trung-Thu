import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function QuestCollectibles() {
  const questItems = useGameStore((s) => s.questItems);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.y = Math.sin(t * 0.7 + i) * 0.18;
      child.position.y = (child.userData.baseY || 0.55) + Math.sin(t * 2.2 + i) * 0.06;
    });
  });

  return (
    <group ref={groupRef}>
      {questItems.map((item, idx) => {
        if (item.collected) return null;
        return (
          <group key={item.id} position={item.position} userData={{ baseY: item.position[1] }}>
            {/* prize mooncake */}
            <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.18, 12]} />
              <meshStandardMaterial color={idx % 2 ? '#b45309' : '#c76a1b'} roughness={0.72} />
            </mesh>
            <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.26, 12]} />
              <meshStandardMaterial color="#d89a42" roughness={0.8} />
            </mesh>

            {/* embossed pattern */}
            {[0, 1, 2, 3].map((i) => (
              <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.14, 0.105, Math.sin(i * Math.PI / 2) * 0.14]} rotation={[-Math.PI / 2,0,0]}>
                <ringGeometry args={[0.025,0.043,8]} />
                <meshBasicMaterial color="#8f4517" />
              </mesh>
            ))}

            {/* ticket sticking out */}
            <group position={[0.28, 0.14, 0]} rotation={[0, 0, -0.18]}>
              <mesh>
                <boxGeometry args={[0.56, 0.18, 0.025]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.5} />
              </mesh>
              <Text position={[0,0,0.016]} fontSize={0.045} color="#0f4c75" anchorX="center" anchorY="middle" fontWeight="bold">
                VÉ MÁY BAY • 3.000.000đ
              </Text>
            </group>

            <Text
              position={[0, 0.62, 0]}
              fontSize={0.1}
              color="#fff7d6"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.015}
              outlineColor="#7c2d12"
            >
              {item.vietnameseName}
            </Text>

            <mesh position={[0, -0.23, 0]} rotation={[-Math.PI / 2,0,0]}>
              <ringGeometry args={[0.32,0.44,16]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.45} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

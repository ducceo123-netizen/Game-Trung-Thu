import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly White Rabbit Mesh Component
export function RabbitMesh({ scale = [1, 1, 1] }: { scale?: [number, number, number] }) {
  return (
    <group scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.65, 0.15]} castShadow>
        <sphereGeometry args={[0.26, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Left Ear */}
      <mesh position={[-0.1, 1.0, 0.1]} rotation={[0.1, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.05, 0.32, 4, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Right Ear */}
      <mesh position={[0.1, 1.0, 0.1]} rotation={[0.1, 0, 0.15]} castShadow>
        <capsuleGeometry args={[0.05, 0.32, 4, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Pink inner ears */}
      <mesh position={[-0.1, 1.0, 0.14]} rotation={[0.1, 0, -0.15]}>
        <capsuleGeometry args={[0.025, 0.22, 4, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh position={[0.1, 1.0, 0.14]} rotation={[0.1, 0, 0.15]}>
        <capsuleGeometry args={[0.025, 0.22, 4, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 0.68, 0.36]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.1, 0.68, 0.36]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Pink nose */}
      <mesh position={[0, 0.61, 0.4]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#fb7185" />
      </mesh>
      {/* Fluffy tail */}
      <mesh position={[0, 0.25, -0.32]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// Security Guard NPC ("BẢO VỆ")
export function SecurityGuardNPC({ position }: { position: [number, number, number] }) {
  const guardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!guardRef.current) return;
    const time = state.clock.getElapsedTime();
    // Idle breathing & slight look around
    guardRef.current.position.y = position[1] + Math.sin(time * 2) * 0.02;
    guardRef.current.rotation.y = Math.sin(time * 0.8) * 0.15;
  });

  return (
    <group ref={guardRef} position={position}>
      {/* Legs */}
      <mesh position={[-0.15, 0.45, 0]} castShadow>
        <boxGeometry args={[0.18, 0.9, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.45, 0]} castShadow>
        <boxGeometry args={[0.18, 0.9, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Torso (Security blue shirt) */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.32]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.6} />
      </mesh>

      {/* Gold Security Badge */}
      <mesh position={[0.14, 1.38, 0.17]}>
        <boxGeometry args={[0.08, 0.1, 0.01]} />
        <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flashlight on belt */}
      <mesh position={[-0.28, 0.92, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.035, 0.045, 0.35, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.35, 1.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.18]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      <mesh position={[0.35, 1.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.18]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[0.34, 0.38, 0.32]} />
        <meshStandardMaterial color="#fbb086" roughness={0.6} />
      </mesh>

      {/* Security Cap */}
      <group position={[0, 2.02, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        {/* Cap visor / peak */}
        <mesh position={[0, -0.04, 0.16]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Cap gold star */}
        <mesh position={[0, 0.02, 0.22]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>

      {/* Mustache */}
      <mesh position={[0, 1.72, 0.17]}>
        <boxGeometry args={[0.16, 0.04, 0.02]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {/* Floating Name Badge */}
      <group position={[0, 2.35, 0]}>
        <mesh>
          <planeGeometry args={[1.6, 0.38]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.85} />
        </mesh>
        <Text
          position={[0, 0.05, 0.01]}
          fontSize={0.12}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          CHÚ BẢO VỆ
        </Text>
        <Text
          position={[0, -0.1, 0.01]}
          fontSize={0.075}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          [Cựu chiến binh IT]
        </Text>
      </group>
    </group>
  );
}

// Rabbit riding a robot vacuum cleaner (Roomba) around the alley
export function VacuumRidingRabbit() {
  const vacuumRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!vacuumRef.current) return;
    const time = state.clock.getElapsedTime();
    // Patrol back and forth in alley
    const zPos = 1.0 + Math.sin(time * 0.4) * 6.0;
    const xPos = Math.cos(time * 0.4) * 1.5;
    vacuumRef.current.position.set(xPos, 0, zPos);
    vacuumRef.current.rotation.y = Math.sin(time * 0.4) > 0 ? 0 : Math.PI;
  });

  return (
    <group ref={vacuumRef}>
      {/* Robot Vacuum Base */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Power button ring */}
      <mesh position={[0, 0.145, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Rabbit riding on top */}
      <group position={[0, 0.15, 0]} scale={[0.7, 0.7, 0.7]}>
        <RabbitMesh />
      </group>

      {/* Mini nametag */}
      <group position={[0, 1.15, 0]}>
        <Text
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0f172a"
        >
          Thỏ Đi Tuần Tra
        </Text>
      </group>
    </group>
  );
}

// Rabbit hiding behind cardboard box in alley
export function HidingRabbit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <group scale={[0.65, 0.65, 0.65]} rotation={[0, 0.6, 0]}>
        <RabbitMesh />
      </group>
      <group position={[0, 0.9, 0]}>
        <Text
          fontSize={0.08}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#0f172a"
        >
          Thỏ Trốn Họp
        </Text>
      </group>
    </group>
  );
}

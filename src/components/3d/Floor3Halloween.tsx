import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../../stores/useGameStore';

function Pumpkin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh scale={[1.15, 0.85, 1]}>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color="#c85a17" emissive="#7c2d12" emissiveIntensity={0.18} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.2, 6]} />
        <meshStandardMaterial color="#365314" />
      </mesh>
    </group>
  );
}

export function Floor3Halloween() {
  const warning = useGameStore((s) => s.booWarning);
  const active = useGameStore((s) => s.booActive);

  return (
    <group>
      <color attach="background" args={[active ? '#050207' : '#090817']} />
      <fog attach="fog" args={[active ? '#090108' : '#120f23', 8, 28]} />

      <ambientLight intensity={warning || active ? 0.12 : 0.22} color="#5b4b8a" />
      <hemisphereLight args={['#302457', '#07060d', warning || active ? 0.15 : 0.28]} />
      <pointLight
        position={[0, 3.3, 2]}
        intensity={warning ? 0.15 : active ? 0.08 : 0.55}
        distance={12}
        color={warning || active ? '#ef4444' : '#7c3aed'}
      />

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <boxGeometry args={[18, 0.24, 30]} />
          <meshStandardMaterial color="#232126" roughness={0.92} />
        </mesh>
        <mesh position={[-8.8, 2.5, 0]}>
          <boxGeometry args={[0.4, 5, 30]} />
          <meshStandardMaterial color="#17151b" roughness={0.95} />
        </mesh>
        <mesh position={[8.8, 2.5, 0]}>
          <boxGeometry args={[0.4, 5, 30]} />
          <meshStandardMaterial color="#17151b" roughness={0.95} />
        </mesh>
        <mesh position={[0, 2.5, -14.8]}>
          <boxGeometry args={[18, 5, 0.4]} />
          <meshStandardMaterial color="#17151b" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* creepy corridor partitions */}
      {[-5.5, 0, 5.5].map((x, i) => (
        <group key={x}>
          <mesh position={[x, 2.1, -2 - i * 2.1]}>
            <boxGeometry args={[2.4, 4.2, 0.18]} />
            <meshStandardMaterial color="#24202b" roughness={0.96} />
          </mesh>
          <mesh position={[x, 3.4, -1.9 - i * 2.1]}>
            <boxGeometry args={[2.1, 0.08, 0.08]} />
            <meshStandardMaterial color={i % 2 ? '#7f1d1d' : '#5b21b6'} emissive={i % 2 ? '#450a0a' : '#3b0764'} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      <Text position={[0, 3.1, 12.8]} fontSize={0.34} color="#f0abfc" anchorX="center" anchorY="middle" fontWeight="bold">
        LẦU 3 • HALLOWEEN ZONE
      </Text>
      <Text position={[0, 2.55, 12.8]} fontSize={0.16} color="#fca5a5" anchorX="center" anchorY="middle">
        ↓ CẦU THANG XUỐNG LẦU 2 • BẤM E
      </Text>

      <Pumpkin position={[-5.7, 0.32, 7.5]} />
      <Pumpkin position={[5.0, 0.32, 0.3]} />
      <Pumpkin position={[-2.2, 0.32, -9.5]} />

      {/* ghost cloth decoys */}
      {[
        [-6.2, 1.4, 2.5],
        [5.8, 1.5, -7.2],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#d8d5e8" transparent opacity={0.5} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <coneGeometry args={[0.46, 1.0, 7]} />
            <meshStandardMaterial color="#c8c5d6" transparent opacity={0.42} roughness={0.95} />
          </mesh>
        </group>
      ))}

      {(warning || active) && (
        <Text position={[0, 3.65, 3]} fontSize={0.28} color="#ef4444" anchorX="center" anchorY="middle" fontWeight="bold">
          {active ? 'BOO ĐANG RƯỢT — CHẠY XUỐNG LẦU 2!' : '... có gì đó đang tới ...'}
        </Text>
      )}
    </group>
  );
}

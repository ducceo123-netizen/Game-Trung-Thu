import { Text } from '@react-three/drei';
import { useGameStore } from '../../stores/useGameStore';

export const WORKSHOP_POSITION: [number, number, number] = [-5.4, 0, -9.7];

export function LanternWorkshop() {
  const built = useGameStore((s) => s.personalLanternBuilt);

  return (
    <group position={WORKSHOP_POSITION}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.12, 1.25]} />
        <meshStandardMaterial color="#c79b69" roughness={0.82} />
      </mesh>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]} castShadow>
          <boxGeometry args={[0.1, 0.7, 1.0]} />
          <meshStandardMaterial color="#ece9df" roughness={0.68} />
        </mesh>
      ))}

      <group position={[0, 2.18, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[3.45, 0.92, 0.08]} />
          <meshStandardMaterial color="#1c5b72" roughness={0.68} />
        </mesh>
        <Text position={[0, 0.16, 0.05]} fontSize={0.2} color="#fff6d6" anchorX="center" anchorY="middle" fontWeight="bold">
          QUẦY LÀM LỒNG ĐÈN
        </Text>
        <Text position={[0, -0.15, 0.05]} fontSize={0.11} color="#d9f2f5" anchorX="center" anchorY="middle">
          BẤM E • UP ẢNH • LÀM XONG CẦM ĐI LUÔN
        </Text>
      </group>

      {/* messy workshop materials based on the event / office context */}
      <mesh position={[-0.95, 0.86, 0.05]} rotation={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.16, 0.4]} />
        <meshStandardMaterial color="#a86f37" roughness={0.92} />
      </mesh>
      <mesh position={[-0.28, 0.87, -0.08]} rotation={[0, 0, -0.95]}>
        <cylinderGeometry args={[0.025, 0.025, 0.82, 8]} />
        <meshStandardMaterial color="#a58e43" roughness={0.9} />
      </mesh>
      <group position={[0.38, 0.88, 0.03]}>
        <mesh rotation={[0, 0, 0.8]}>
          <boxGeometry args={[0.42, 0.12, 0.22]} />
          <meshStandardMaterial color="#db4735" roughness={0.55} />
        </mesh>
        <mesh position={[0.26, 0.05, 0]} rotation={[0,0,0.8]}>
          <cylinderGeometry args={[0.018,0.018,0.35,6]} />
          <meshStandardMaterial color="#f2e7c9" roughness={0.6} />
        </mesh>
      </group>
      <mesh position={[1.0, 0.88, 0.05]}>
        <cylinderGeometry args={[0.18, 0.18, 0.24, 16]} />
        <meshStandardMaterial color="#d9d6cf" roughness={0.45} />
      </mesh>

      <Text
        position={[0, 0.18, 0.68]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.105}
        color={built ? '#156f75' : '#7c2d12'}
        anchorX="center"
        anchorY="middle"
      >
        {built ? '✓ ĐÃ LÀM XONG • ĐANG CẦM TRÊN TAY • NHẤN F BẬT/TẮT ĐÈN' : '[E] MỞ QUẦY UP ẢNH'}
      </Text>
    </group>
  );
}
import { Text } from '@react-three/drei';

export const ITEM_SHOP_POSITION:[number,number,number]=[-6.7,0,-14.2];

export function ItemShop() {
  return (
    <group position={ITEM_SHOP_POSITION}>
      <mesh position={[0,0.65,0]} castShadow>
        <boxGeometry args={[2.9,1.3,1.2]} />
        <meshStandardMaterial color="#263238" roughness={0.72} />
      </mesh>
      <mesh position={[0,1.5,-0.3]}>
        <boxGeometry args={[3.2,0.62,0.08]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      <Text position={[0,1.58,-0.25]} fontSize={0.16} color="#fff7d6" anchorX="center" anchorY="middle" fontWeight="bold">
        TIỆM ĐỒ TRUNG THU • BẤM E
      </Text>
      <Text position={[0,1.35,-0.24]} fontSize={0.075} color="#fde68a" anchorX="center" anchorY="middle">
        KIẾM • BLASTER • XE ĐIỆN
      </Text>

      <group position={[-0.75,1.18,0.28]}>
        <mesh rotation={[0,0,-0.8]}>
          <boxGeometry args={[0.08,0.95,0.08]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.75} roughness={0.2} />
        </mesh>
        <mesh position={[-0.28,-0.28,0]} rotation={[0,0,-0.8]}>
          <boxGeometry args={[0.34,0.12,0.1]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
      </group>

      <group position={[0.15,1.05,0.3]}>
        <mesh>
          <boxGeometry args={[0.62,0.22,0.16]} />
          <meshStandardMaterial color="#111827" roughness={0.4} />
        </mesh>
        <mesh position={[0.18,-0.2,0]} rotation={[0,0,-0.18]}>
          <boxGeometry args={[0.15,0.36,0.13]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      <group position={[0.9,0.45,0.25]}>
        <mesh>
          <boxGeometry args={[0.82,0.15,0.35]} />
          <meshStandardMaterial color="#0f766e" roughness={0.5} />
        </mesh>
        {[-0.28,0.28].map((x)=><mesh key={x} position={[x,-0.16,0.15]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.11,0.11,0.09,10]}/><meshStandardMaterial color="#111827"/></mesh>)}
      </group>
    </group>
  );
}
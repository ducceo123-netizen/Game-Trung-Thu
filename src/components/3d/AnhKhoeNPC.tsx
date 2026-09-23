import { Text } from '@react-three/drei';

export const ANH_KHOE_POSITION:[number,number,number]=[-6.0,0,-1.0];

export function AnhKhoeNPC() {
  return (
    <group position={ANH_KHOE_POSITION}>
      <mesh position={[-0.13,0.3,0]}><boxGeometry args={[0.14,0.6,0.16]}/><meshStandardMaterial color="#334155"/></mesh>
      <mesh position={[0.13,0.3,0]}><boxGeometry args={[0.14,0.6,0.16]}/><meshStandardMaterial color="#334155"/></mesh>
      <mesh position={[0,0.78,0]}><boxGeometry args={[0.56,0.62,0.3]}/><meshStandardMaterial color="#111827"/></mesh>
      <Text position={[0,0.76,-0.16]} rotation={[0,Math.PI,0]} fontSize={0.075} color="#fff" anchorX="center" anchorY="middle" fontWeight="bold">{'DELIVER\nHAPPINESS'}</Text>
      <mesh position={[0,1.28,0]}><sphereGeometry args={[0.29,10,8]}/><meshStandardMaterial color="#e7b77d" roughness={0.7}/></mesh>
      <mesh position={[0,1.48,-0.03]}><boxGeometry args={[0.56,0.12,0.32]}/><meshStandardMaterial color="#1f2937"/></mesh>
      <Text position={[0,1.9,0]} fontSize={0.14} color="#fef3c7" anchorX="center" anchorY="middle" fontWeight="bold">ANH KHOẺ</Text>
      <Text position={[0,1.68,0]} fontSize={0.08} color="#fde68a" anchorX="center" anchorY="middle">Khen đẹp trai thử xem?</Text>
    </group>
  );
}

import { useEconomyStore } from '../../stores/useEconomyStore';

export function PlayerEquipment() {
  const equipped=useEconomyStore((s)=>s.equippedItem);
  if(!equipped) return null;

  if(equipped==='sword') return (
    <group position={[0.42,0.62,0.18]} rotation={[0,0,-0.55]}>
      <mesh position={[0,0.42,0]}><boxGeometry args={[0.055,0.85,0.055]}/><meshStandardMaterial color="#dbeafe" emissive="#60a5fa" emissiveIntensity={0.55} metalness={0.75} roughness={0.2}/></mesh>
      <mesh position={[0,0,0]}><boxGeometry args={[0.28,0.07,0.08]}/><meshStandardMaterial color="#f59e0b"/></mesh>
      <mesh position={[0,-0.19,0]}><boxGeometry args={[0.08,0.32,0.08]}/><meshStandardMaterial color="#78350f"/></mesh>
    </group>
  );

  if(equipped==='blaster') return (
    <group position={[0.46,0.7,0.22]}>
      <mesh><boxGeometry args={[0.62,0.2,0.16]}/><meshStandardMaterial color="#111827" metalness={0.45} roughness={0.35}/></mesh>
      <mesh position={[0.18,-0.2,0]} rotation={[0,0,-0.15]}><boxGeometry args={[0.14,0.34,0.13]}/><meshStandardMaterial color="#374151"/></mesh>
      <mesh position={[-0.35,0,0]}><cylinderGeometry args={[0.05,0.05,0.25,8]} /><meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.7}/></mesh>
    </group>
  );

  return (
    <group position={[0,-0.02,0.04]}>
      <mesh><boxGeometry args={[0.82,0.09,0.3]}/><meshStandardMaterial color="#0f766e" metalness={0.25} roughness={0.4}/></mesh>
      {[-0.28,0.28].map((x)=><mesh key={x} position={[x,-0.11,0.12]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.1,0.1,0.08,10]}/><meshStandardMaterial color="#111827"/></mesh>)}
    </group>
  );
}

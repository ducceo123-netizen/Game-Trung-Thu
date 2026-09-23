import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEconomyStore } from '../../stores/useEconomyStore';
import { useGameStore } from '../../stores/useGameStore';

export function PlayerEquipment() {
  const equipped=useEconomyStore((s)=>s.equippedItem);
  const attackTrigger=useGameStore((s)=>s.lanternAttackTrigger);
  const gunRef=useRef<THREE.Group>(null);
  const muzzleRef=useRef<THREE.Mesh>(null);
  const tracerRef=useRef<THREE.Mesh>(null);
  const recoil=useRef(0);

  useEffect(()=>{
    if(equipped==='blaster' && attackTrigger>0) recoil.current=1;
  },[attackTrigger,equipped]);

  useFrame((_,delta)=>{
    recoil.current=Math.max(0,recoil.current-delta*9);
    const kick=Math.sin(recoil.current*Math.PI)*0.12;
    if(gunRef.current) gunRef.current.position.z=0.22-kick;
    if(muzzleRef.current) muzzleRef.current.visible=recoil.current>0.45;
    if(tracerRef.current) tracerRef.current.visible=recoil.current>0.62;
  });

  if(!equipped) return null;

  if(equipped==='sword') return (
    <group position={[0.42,0.62,0.18]} rotation={[0,0,-0.55]}>
      <mesh position={[0,0.42,0]}><boxGeometry args={[0.055,0.85,0.055]}/><meshStandardMaterial color="#dbeafe" emissive="#60a5fa" emissiveIntensity={0.55} metalness={0.75} roughness={0.2}/></mesh>
      <mesh position={[0,0,0]}><boxGeometry args={[0.28,0.07,0.08]}/><meshStandardMaterial color="#f59e0b"/></mesh>
      <mesh position={[0,-0.19,0]}><boxGeometry args={[0.08,0.32,0.08]}/><meshStandardMaterial color="#78350f"/></mesh>
    </group>
  );

  if(equipped==='blaster') return (
    <group ref={gunRef} position={[0.34,0.72,0.2]}>
      <mesh>
        <boxGeometry args={[0.18,0.2,0.72]}/>
        <meshStandardMaterial color="#111827" metalness={0.45} roughness={0.35}/>
      </mesh>
      <mesh position={[0,-0.2,-0.02]} rotation={[-0.15,0,0]}>
        <boxGeometry args={[0.14,0.34,0.16]}/>
        <meshStandardMaterial color="#374151"/>
      </mesh>
      <mesh position={[0,0,0.48]} rotation={[Math.PI/2,0,0]}>
        <cylinderGeometry args={[0.05,0.05,0.25,8]}/>
        <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.7}/>
      </mesh>
      <mesh ref={muzzleRef} visible={false} position={[0,0,0.66]}>
        <sphereGeometry args={[0.12,8,6]}/>
        <meshBasicMaterial color="#fff7c2"/>
      </mesh>
      <mesh ref={tracerRef} visible={false} position={[0,0,2.55]} rotation={[Math.PI/2,0,0]}>
        <cylinderGeometry args={[0.02,0.02,3.8,6]}/>
        <meshBasicMaterial color="#fb7185" transparent opacity={0.9}/>
      </mesh>
    </group>
  );

  return (
    <group position={[0,-0.02,0.04]}>
      <mesh><boxGeometry args={[0.82,0.09,0.3]}/><meshStandardMaterial color="#0f766e" metalness={0.25} roughness={0.4}/></mesh>
      {[-0.28,0.28].map((x)=><mesh key={x} position={[x,-0.11,0.12]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.1,0.1,0.08,10]}/><meshStandardMaterial color="#111827"/></mesh>)}
    </group>
  );
}
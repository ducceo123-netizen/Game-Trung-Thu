import { useEffect, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useWhiteboardStore } from '../../stores/useWhiteboardStore';

export const WHITEBOARD_POSITION:[number,number,number]=[6.7,0,-1.2];

export function CollaborativeWhiteboard(){
  const imageData=useWhiteboardStore(s=>s.imageData);
  const updatedName=useWhiteboardStore(s=>s.updatedName);
  const init=useWhiteboardStore(s=>s.init);
  const open=useWhiteboardStore(s=>s.openBoard);

  useEffect(()=>{void init();},[init]);

  const texture=useMemo(()=>{
    if(!imageData) return null;
    const t=new THREE.TextureLoader().load(imageData);
    t.colorSpace=THREE.SRGBColorSpace;
    t.minFilter=THREE.LinearFilter;
    return t;
  },[imageData]);

  return (
    <group position={WHITEBOARD_POSITION} rotation={[0,-Math.PI/2,0]}>
      <mesh position={[0,1.55,0]} castShadow onClick={(e)=>{e.stopPropagation();open();}}>
        <boxGeometry args={[3.4,2.5,0.1]}/>
        <meshStandardMaterial color="#d4d2ca" metalness={0.35} roughness={0.3}/>
      </mesh>
      <mesh position={[0,1.55,0.06]} onClick={(e)=>{e.stopPropagation();open();}}>
        <planeGeometry args={[3.1,2.15]}/>
        <meshBasicMaterial map={texture??undefined} color={texture?'#ffffff':'#f8fafc'} toneMapped={false}/>
      </mesh>
      {!texture&&(
        <Text position={[0,1.55,0.075]} fontSize={0.18} color="#64748b" anchorX="center" anchorY="middle" maxWidth={2.6} textAlign="center">
          {'BẢNG VẼ CHUNG\nCLICK / E ĐỂ VẼ'}
        </Text>
      )}
      <Text position={[0,3.02,0.07]} fontSize={0.13} color="#0f172a" anchorX="center" anchorY="middle" fontWeight="bold">
        WHITEBOARD UID • VẼ BẰNG CHUỘT
      </Text>
      <Text position={[0,2.78,0.07]} fontSize={0.07} color="#475569" anchorX="center" anchorY="middle">
        {updatedName ? 'Vẽ gần nhất: ' + updatedName : 'Bảng chung realtime'}
      </Text>
      {[-1.35,1.35].map(x=><mesh key={x} position={[x,0.36,0]}><cylinderGeometry args={[0.025,0.025,0.7,6]}/><meshStandardMaterial color="#777"/></mesh>)}
    </group>
  );
}

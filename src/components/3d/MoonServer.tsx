import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function MoonServer() {
  const moonOnline = useGameStore((s) => s.moonOnline);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const moonRef = useRef<THREE.Mesh>(null);
  const ledsRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (moonRef.current) {
      const mat = moonRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = moonOnline
        ? 1.8 + Math.sin(t * 2.2) * 0.18
        : gamePhase === 'rebooting'
          ? (Math.random() > 0.45 ? 1.4 : 0.08)
          : 0.08 + (Math.sin(t * 4) > 0.82 ? 0.16 : 0);
    }
    if (ledsRef.current) {
      ledsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.color.set(moonOnline ? (i % 2 ? '#38bdf8' : '#22c55e') : (Math.sin(t * 8 + i) > 0 ? '#ef4444' : '#7f1d1d'));
      });
    }
    if (sparksRef.current) {
      sparksRef.current.visible = gamePhase === 'rebooting';
      if (sparksRef.current.visible) {
        sparksRef.current.children.forEach((child, i) => {
          child.position.set(
            Math.sin(t * 8 + i) * (0.6 + (i % 3) * 0.2),
            1.0 + ((t * 2 + i * 0.17) % 2.1),
            0.45 + Math.cos(t * 6 + i) * 0.22,
          );
        });
      }
    }
  });

  return (
    <group position={[0, 0, -18]}>
      {/* Indoor moon projection / installation on the back wall, below the real office ceiling */}
      <group position={[0, 3.45, -4.0]}>
        <mesh ref={moonRef} castShadow>
          <cylinderGeometry args={[1.75, 1.75, 0.16, 40]} />
          <meshStandardMaterial
            color={moonOnline ? '#fff6cf' : '#48515d'}
            emissive={moonOnline ? '#ffd96d' : '#475569'}
            emissiveIntensity={0.12}
            roughness={0.72}
          />
        </mesh>
        {[[-0.55,0.42,0.1,0.28],[0.62,0.18,0.1,0.38],[-0.15,-0.62,0.1,0.24]].map(([x,y,z,r],i)=>(
          <mesh key={i} position={[x,y,z+0.085]} rotation={[Math.PI/2,0,0]}>
            <circleGeometry args={[r,18]} />
            <meshStandardMaterial color={moonOnline ? '#e8cf8d' : '#35404b'} roughness={0.9} />
          </mesh>
        ))}
        {moonOnline && <pointLight color="#fff0bc" intensity={2.6} distance={12} decay={2} position={[0,0,1.2]} />}
        <Text position={[0,-2.25,0.12]} fontSize={0.18} color={moonOnline ? '#166534' : '#b91c1c'} anchorX="center" anchorY="middle" fontWeight="bold">
          {moonOnline ? 'MOON SERVER: ONLINE 🌕' : 'MOON SERVER: OFFLINE ⚡'}
        </Text>
      </group>

      {/* Compact server + altar gag that fits the real UID office */}
      <group position={[0,0,0]}>
        <mesh position={[0,0.18,0]} castShadow receiveShadow>
          <boxGeometry args={[3.3,0.36,1.65]} />
          <meshStandardMaterial color="#d7c2a3" roughness={0.82} />
        </mesh>

        <group position={[0,1.5,0]}>
          <mesh castShadow>
            <boxGeometry args={[1.45,2.55,0.82]} />
            <meshStandardMaterial color="#1b2026" metalness={0.68} roughness={0.36} />
          </mesh>
          {[-0.85,-0.45,-0.05,0.35,0.75].map((y)=>(
            <mesh key={y} position={[0,y,0.42]}>
              <boxGeometry args={[1.2,0.24,0.045]} />
              <meshStandardMaterial color="#303844" metalness={0.6} roughness={0.35} />
            </mesh>
          ))}
          <group ref={ledsRef} position={[0,0,0.47]}>
            {Array.from({length:15}).map((_,i)=>(
              <mesh key={i} position={[-0.45+(i%5)*0.14,0.76-Math.floor(i/5)*0.4,0]}>
                <sphereGeometry args={[0.018,6,6]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            ))}
          </group>
        </group>

        <group position={[-1.2,0.82,0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.58,1.1,0.55]} />
            <meshStandardMaterial color="#8c8b84" metalness={0.48} roughness={0.5} />
          </mesh>
          <mesh position={[0,0.18,0.285]}>
            <planeGeometry args={[0.28,0.28]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
          <Text position={[0,0.18,0.292]} fontSize={0.09} color="#7f1d1d" anchorX="center" anchorY="middle" fontWeight="bold">
            220V
          </Text>
        </group>

        <group position={[1.15,0.72,0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.95,0.66,0.72]} />
            <meshStandardMaterial color="#9b2c25" roughness={0.65} />
          </mesh>
          <Text position={[0,0.08,0.37]} fontSize={0.08} color="#fff3c4" anchorX="center" anchorY="middle" fontWeight="bold">
            NỒI LẨU
          </Text>
          <Text position={[0,-0.1,0.37]} fontSize={0.052} color="#fca5a5" anchorX="center" anchorY="middle">
            DO NOT PLUG
          </Text>
        </group>

        {[[-0.9,'#f97316'],[0,'#eab308'],[0.9,'#111827']].map(([x,c],i)=>(
          <mesh key={i} position={[x as number,0.04,0.72]} rotation={[0,i*0.7,0]}>
            <torusGeometry args={[0.3+i*0.08,0.018,6,18]} />
            <meshStandardMaterial color={c as string} roughness={0.6} />
          </mesh>
        ))}

        <group position={[0,3.05,0]}>
          <mesh>
            <boxGeometry args={[2.9,0.58,0.08]} />
            <meshStandardMaterial color="#164e63" roughness={0.62} />
          </mesh>
          <Text position={[0,0.1,0.05]} fontSize={0.17} color="#fff5cf" anchorX="center" anchorY="middle" fontWeight="bold">
            TRẠM PHÁT TRĂNG
          </Text>
          <Text position={[0,-0.13,0.05]} fontSize={0.08} color="#bae6fd" anchorX="center" anchorY="middle">
            UID Gò Dầu • prototype nội bộ
          </Text>
        </group>
      </group>

      <group ref={sparksRef}>
        {Array.from({length:12}).map((_,i)=>(
          <mesh key={i}>
            <sphereGeometry args={[0.04,6,6]} />
            <meshBasicMaterial color={i%2 ? '#38bdf8' : '#facc15'} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

import { useMemo, useRef, type ReactNode } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

type V3 = [number, number, number];

function Tassel({ position = [0, -0.72, 0] as V3 }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.07, 0.018, 6, 12]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.14, 0]}>
        <coneGeometry args={[0.075, 0.38, 8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.82} />
      </mesh>
    </group>
  );
}

function WarmFairyLights({ radiusX = 0.46, radiusY = 0.38, z = 0.2, count = 14 }: {
  radiusX?: number;
  radiusY?: number;
  z?: number;
  count?: number;
}) {
  const actualCount = Math.min(count, 8);
  const pts = useMemo(() => Array.from({ length: actualCount }, (_, i) => {
    const a = (i / actualCount) * Math.PI * 2;
    return [Math.cos(a) * radiusX, Math.sin(a) * radiusY, z + Math.sin(a * 2) * 0.025] as V3;
  }), [radiusX, radiusY, z, actualCount]);

  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.026, 6, 6]} />
          <meshStandardMaterial color="#fff3b0" emissive="#ffc857" emissiveIntensity={2.3} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function CarryRig() {
  return (
    <group position={[-0.55, 1.12, 0]} rotation={[0, 0, -0.62]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.024, 1.55, 8]} />
        <meshStandardMaterial color="#b7904d" roughness={0.9} />
      </mesh>
      {[0.0, 0.42, 0.84].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <torusGeometry args={[0.026, 0.004, 6, 10]} />
          <meshStandardMaterial color="#715b2e" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0.03, 1.25, 0]} rotation={[Math.PI / 2, 0, 0.18]}>
        <torusGeometry args={[0.055, 0.012, 6, 12, Math.PI * 1.45]} />
        <meshStandardMaterial color="#f0c323" roughness={0.45} />
      </mesh>
    </group>
  );
}

function BaseLantern({
  position,
  name,
  color,
  children,
}: {
  position: V3;
  name: string;
  color: string;
  children: ReactNode;
}) {
  const payload = useRef<THREE.Group>(null);
  const lastPoke = useRef(0);
  const impulse = useRef(0);
  const bambooPokeTrigger = useGameStore((s) => s.bambooPokeTrigger);

  useFrame((state) => {
    if (!payload.current) return;
    if (lastPoke.current !== bambooPokeTrigger) {
      lastPoke.current = bambooPokeTrigger;
      impulse.current = 0.55;
    }
    impulse.current *= 0.93;
    const t = state.clock.elapsedTime;
    payload.current.rotation.z = Math.sin(t * 1.45 + position[0]) * 0.045 + impulse.current * Math.sin(t * 9);
    payload.current.rotation.x = Math.cos(t * 1.2 + position[2]) * 0.025 + impulse.current * 0.35;
  });

  return (
    <group position={position}>
      <CarryRig />
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 1.28, 5]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.94} />
      </mesh>
      <group ref={payload}>
        {children}
        <Text
          position={[0, 1.05, 0]}
          fontSize={0.095}
          color="#fff7cf"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#1f2937"
          maxWidth={1.8}
          textAlign="center"
        >
          {name}
        </Text>
      </group>
    </group>
  );
}

export function SalonpasLantern({ position }: { position: V3 }) {
  return (
    <BaseLantern position={position} name="SALONPAS DIY" color="#ffd166">
      <group rotation={[0.02, -0.04, -0.025]}>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.6, 0.28]} />
          <meshStandardMaterial color="#f7f3e8" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.05, 0.145]}>
          <planeGeometry args={[0.9, 0.5]} />
          <meshStandardMaterial color="#f9fafb" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.12, 0.151]}>
          <planeGeometry args={[0.88, 0.2]} />
          <meshBasicMaterial color="#1e4f9a" />
        </mesh>
        <mesh position={[0, 0.27, 0.151]}>
          <planeGeometry args={[0.88, 0.08]} />
          <meshBasicMaterial color="#5a9f50" />
        </mesh>
        <Text position={[0, 0.12, 0.158]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          Salonpas
        </Text>
        <Text position={[-0.18, -0.1, 0.158]} fontSize={0.052} color="#b91c1c" anchorX="center" anchorY="middle">
          Đau cơ • Đau lưng
        </Text>
        <WarmFairyLights radiusX={0.52} radiusY={0.31} z={0.17} />
        <Tassel position={[0, -0.72, 0]} />
      </group>
    </BaseLantern>
  );
}

export function BeerRabbitLantern({ position }: { position: V3 }) {
  const fled = useGameStore((s) => s.beerCanRabbitFled);
  const rabbitX = useRef(0);
  useFrame((_, delta) => {
    if (fled) rabbitX.current = Math.min(5, rabbitX.current + delta * 4.5);
  });

  return (
    <BaseLantern position={position} name="BIA + THỎ" color="#ffde78">
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.95, 20]} />
          <meshStandardMaterial color="#1c7a52" metalness={0.52} roughness={0.33} />
        </mesh>
        <mesh position={[0, 0.47, 0]}>
          <cylinderGeometry args={[0.3, 0.32, 0.055, 20]} />
          <meshStandardMaterial color="#d8d9d6" metalness={0.82} roughness={0.18} />
        </mesh>
        <Text position={[0, 0.04, 0.325]} fontSize={0.11} color="#f5e6b2" anchorX="center" anchorY="middle" fontWeight="bold">
          BIA GÒ DẦU
        </Text>
        <WarmFairyLights radiusX={0.35} radiusY={0.44} z={0.33} count={12} />
        {!fled && (
          <group position={[0, 0.67, 0.03]} scale={[0.25, 0.25, 0.25]}>
            <mesh castShadow>
              <sphereGeometry args={[0.62, 12, 10]} />
              <meshStandardMaterial color="#f7f7f2" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.62, 0.12]} castShadow>
              <sphereGeometry args={[0.48, 12, 10]} />
              <meshStandardMaterial color="#f7f7f2" roughness={0.78} />
            </mesh>
            {[-0.18, 0.18].map((x) => (
              <group key={x}>
                <mesh position={[x, 1.2, 0.08]} rotation={[0.05, 0, x * 0.8]}>
                  <capsuleGeometry args={[0.095, 0.46, 4, 8]} />
                  <meshStandardMaterial color="#f7f7f2" roughness={0.72} />
                </mesh>
                <mesh position={[x, 1.2, 0.13]} rotation={[0.05, 0, x * 0.8]}>
                  <capsuleGeometry args={[0.042, 0.35, 4, 8]} />
                  <meshStandardMaterial color="#f5a3b7" roughness={0.62} />
                </mesh>
              </group>
            ))}
            <mesh position={[0, 0.58, 0.56]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#e78aa2" />
            </mesh>
          </group>
        )}
        {fled && (
          <mesh position={[rabbitX.current, 0.82 + Math.sin(rabbitX.current * 3) * 0.18, 0]} scale={[0.18,0.18,0.18]}>
            <sphereGeometry args={[0.7, 8, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.55} />
          </mesh>
        )}
        <Tassel />
      </group>
    </BaseLantern>
  );
}

export function SatoriBottleLantern({ position }: { position: V3 }) {
  const launched = useGameStore((s) => s.waterBottleLaunched);
  const y = useRef(0);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (launched) {
      time.current += delta;
      y.current = Math.sin(Math.min(Math.PI, time.current * 1.8)) * 2.6;
    } else {
      time.current = 0;
      y.current = 0;
    }
  });

  return (
    <BaseLantern position={position} name="CHAI NƯỚC SATORI" color="#fff0a8">
      <group position={[0, y.current, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.25, 0.25, 1.08, 16]} />
          <meshStandardMaterial color="#cfe9f5" transparent opacity={0.58} roughness={0.28} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.15, 12]} />
          <meshStandardMaterial color="#2368a0" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.02, 0.255]}>
          <planeGeometry args={[0.5, 0.34]} />
          <meshStandardMaterial color="#2a91a8" roughness={0.6} />
        </mesh>
        <Text position={[0, 0.02, 0.263]} fontSize={0.105} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          SATORI
        </Text>
        <WarmFairyLights radiusX={0.28} radiusY={0.5} z={0.26} count={13} />
        <Tassel position={[0, -0.82, 0]} />
      </group>
    </BaseLantern>
  );
}

export function HerbalJarLantern({ position }: { position: V3 }) {
  return (
    <BaseLantern position={position} name="HŨ DẦU THẢO MỘC" color="#ffe894">
      <group rotation={[0, 0.05, -0.02]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.38, 0.78, 18]} />
          <meshStandardMaterial color="#8ea45f" transparent opacity={0.68} roughness={0.35} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 0.16, 18]} />
          <meshStandardMaterial color="#1d7a4b" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.0, 0.4]}>
          <planeGeometry args={[0.68, 0.47]} />
          <meshStandardMaterial color="#e8c746" roughness={0.78} />
        </mesh>
        <Text position={[0, 0.08, 0.409]} fontSize={0.075} color="#7f1d1d" anchorX="center" anchorY="middle" fontWeight="bold">
          DẦU THẢO MỘC
        </Text>
        <Text position={[0, -0.08, 0.409]} fontSize={0.052} color="#14532d" anchorX="center" anchorY="middle">
          Bản limited Trung Thu
        </Text>
        <WarmFairyLights radiusX={0.45} radiusY={0.37} z={0.41} count={12} />
        <Tassel />
      </group>
    </BaseLantern>
  );
}

export function CardboardBoxLantern({ position }: { position: V3 }) {
  const open = useGameStore((s) => s.boxLanternOpen);
  return (
    <BaseLantern position={position} name="FINAL_FINAL_v7" color="#ffd27a">
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.7, 0.68]} />
          <meshStandardMaterial color="#a86f37" roughness={0.92} />
        </mesh>
        <mesh position={[0, 0, 0.35]}>
          <planeGeometry args={[0.58, 0.24]} />
          <meshStandardMaterial color="#f6f1df" roughness={0.78} />
        </mesh>
        <Text position={[0, 0.04, 0.36]} fontSize={0.078} color="#1f2937" anchorX="center" anchorY="middle" fontWeight="bold">
          FINAL_FINAL_v7
        </Text>
        <Text position={[0, -0.07, 0.36]} fontSize={0.048} color="#b91c1c" anchorX="center" anchorY="middle">
          đừng sửa nữa pls
        </Text>
        <group position={[0, 0.36, 0.33]} rotation={[open ? 1.5 : 0.08, 0, 0]}>
          <mesh position={[0, 0, 0.16]}>
            <boxGeometry args={[0.82, 0.025, 0.32]} />
            <meshStandardMaterial color="#8a582d" roughness={0.95} />
          </mesh>
        </group>
        <WarmFairyLights radiusX={0.46} radiusY={0.36} z={0.36} count={12} />
        <Tassel position={[0, -0.78, 0]} />
      </group>
    </BaseLantern>
  );
}

export function BeautyLantern({ position }: { position: V3 }) {
  const sparkle = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (sparkle.current) sparkle.current.rotation.y = state.clock.elapsedTime * 0.7;
  });
  return (
    <BaseLantern position={position} name="LỒNG ĐÈN SẮC ĐẸP" color="#ff9bd5">
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.95, 0.18]} />
          <meshStandardMaterial color="#f5c4dc" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.03, 0.11]}>
          <planeGeometry args={[0.62, 0.78]} />
          <meshStandardMaterial color="#fff0f7" roughness={0.52} />
        </mesh>
        {[-0.22, 0, 0.22].map((x, i) => (
          <group key={x} position={[x, 0.1 - i*0.08, 0.2]} rotation={[0, 0, (i-1)*0.16]}>
            <mesh>
              <cylinderGeometry args={[0.032,0.032,0.52,8]} />
              <meshStandardMaterial color={i===1 ? '#d69a5d' : '#333333'} metalness={0.45} roughness={0.35} />
            </mesh>
            <mesh position={[0,0.32,0]}>
              <coneGeometry args={[0.09,0.18,10]} />
              <meshStandardMaterial color="#8b5e5e" roughness={0.86} />
            </mesh>
          </group>
        ))}
        {[-0.16,0.16].map((x) => (
          <group key={x} position={[x,-0.28,0.2]}>
            <mesh>
              <cylinderGeometry args={[0.07,0.07,0.34,10]} />
              <meshStandardMaterial color="#202020" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0,0.22,0]}>
              <cylinderGeometry args={[0.05,0.05,0.16,10]} />
              <meshStandardMaterial color="#d93362" roughness={0.3} />
            </mesh>
          </group>
        ))}
        <group ref={sparkle}>
          {[0,2.1,4.2].map((a) => (
            <mesh key={a} position={[Math.cos(a)*0.5, Math.sin(a)*0.28, Math.sin(a)*0.5]}>
              <octahedronGeometry args={[0.05]} />
              <meshBasicMaterial color="#fff4fb" />
            </mesh>
          ))}
        </group>
        <WarmFairyLights radiusX={0.43} radiusY={0.48} z={0.22} count={13} />
        <Tassel position={[0,-0.82,0]} />
      </group>
    </BaseLantern>
  );
}

export function KeyboardLantern({ position }: { position: V3 }) {
  const typed = useGameStore((s) => s.lastTypedKeys);
  return (
    <BaseLantern position={position} name="BÀN PHÍM RGB" color="#55d8ff">
      <group rotation={[0.02, 0.05, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.78, 1.02, 0.12]} />
          <meshStandardMaterial color="#22252a" roughness={0.45} metalness={0.45} />
        </mesh>
        <group position={[0, 0.03, 0.08]}>
          {Array.from({length: 24}).map((_,i) => {
            const row=Math.floor(i/4);
            const col=i%4;
            return (
              <mesh key={i} position={[(col-1.5)*0.15,(row-2.5)*0.145,0]}>
                <boxGeometry args={[0.115,0.11,0.038]} />
                <meshStandardMaterial color={i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#a78bfa' : '#22d3ee'} emissive="#164e63" emissiveIntensity={0.35} roughness={0.42} />
              </mesh>
            );
          })}
        </group>
        <Text position={[0,-0.58,0.12]} fontSize={0.068} color="#67e8f9" anchorX="center" anchorY="middle">
          {typed || 'ASDFGHJK'}
        </Text>
        <Tassel position={[0,-0.82,0]} />
      </group>
    </BaseLantern>
  );
}

export function PrinterLantern({ position }: { position: V3 }) {
  const papers=useGameStore((s)=>s.printerPapers);
  return (
    <BaseLantern position={position} name="MÁY IN 2900" color="#a7d8ff">
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.9,0.52,0.68]} />
          <meshStandardMaterial color="#e7e8e3" roughness={0.65} />
        </mesh>
        <mesh position={[0,0.3,-0.12]} rotation={[-0.35,0,0]}>
          <boxGeometry args={[0.52,0.38,0.025]} />
          <meshStandardMaterial color="#cdd1cf" roughness={0.55} />
        </mesh>
        <mesh position={[0,-0.05,0.35]}>
          <boxGeometry args={[0.55,0.08,0.03]} />
          <meshBasicMaterial color="#1f2937" />
        </mesh>
        <Text position={[0,0.12,0.355]} fontSize={0.072} color="#1f2937" anchorX="center" anchorY="middle" fontWeight="bold">
          UID PRINTER
        </Text>
        <Text position={[0,-0.14,0.355]} fontSize={0.05} color="#b91c1c" anchorX="center" anchorY="middle">
          pls revise
        </Text>
        <WarmFairyLights radiusX={0.48} radiusY={0.28} z={0.37} count={12} />
        <Tassel position={[0,-0.7,0]} />
        {papers.slice(-3).map((p,i)=>(
          <mesh key={p.id} position={[0.15*(i-1),-0.38-i*0.08,0.45]} rotation={[0.25,0,i*0.18]}>
            <planeGeometry args={[0.28,0.18]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </BaseLantern>
  );
}

export function InstantNoodleLantern({ position }: { position: V3 }) {
  return (
    <BaseLantern position={position} name="MÌ GÓI CỨU OT" color="#ffcc73">
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.38,0.28,0.68,18]} />
          <meshStandardMaterial color="#ef476f" roughness={0.58} />
        </mesh>
        <mesh position={[0,0.35,0]}>
          <torusGeometry args={[0.38,0.025,8,18]} />
          <meshStandardMaterial color="#f7f3e8" />
        </mesh>
        <Text position={[0,0.02,0.34]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          HẢO HẢO
        </Text>
        <Text position={[0,-0.14,0.34]} fontSize={0.052} color="#fff2a6" anchorX="center" anchorY="middle">
          OT vị tôm chua cay
        </Text>
        <WarmFairyLights radiusX={0.4} radiusY={0.32} z={0.35} count={12} />
        <Tassel position={[0,-0.72,0]} />
      </group>
    </BaseLantern>
  );
}

export const LANTERN_INTERACTION_POINTS = [
  { id:'salonpas', position:[-3.1,1.65,6.0] as V3 },
  { id:'beer', position:[3.2,1.7,4.4] as V3 },
  { id:'satori', position:[-2.6,1.65,1.5] as V3 },
  { id:'box', position:[2.9,1.65,-1.9] as V3 },
  { id:'noodles', position:[-2.7,1.65,-4.7] as V3 },
  { id:'keyboard', position:[4.6,1.75,-7.1] as V3 },
  { id:'beauty', position:[-5.8,1.75,-7.6] as V3 },
  { id:'printer', position:[4.4,1.7,-9.8] as V3 },
] as const;

export function DIYLanterns() {
  return (
    <group>
      <SalonpasLantern position={[-3.1,1.65,6.0]} />
      <BeerRabbitLantern position={[3.2,1.7,4.4]} />
      <SatoriBottleLantern position={[-2.6,1.65,1.5]} />
      <CardboardBoxLantern position={[2.9,1.65,-1.9]} />
      <InstantNoodleLantern position={[-2.7,1.65,-4.7]} />
      <KeyboardLantern position={[4.6,1.75,-7.1]} />
      <BeautyLantern position={[-5.8,1.75,-7.6]} />
      <PrinterLantern position={[4.4,1.7,-9.8]} />
      <HerbalJarLantern position={[0.6,1.7,3.0]} />
    </group>
  );
}
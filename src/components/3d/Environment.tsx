import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

type V3 = [number, number, number];

const WOOD = '#c79b69';
const WALL = '#f2efe7';
const FLOOR = '#e7e2d7';
const CONCRETE = '#aaa59b';
const BLACK = '#171717';
const GLASS = '#6b8790';
const TEAL = '#19a6ad';
const ORANGE = '#e76f3c';
const PLANTER = '#f3f2ec';
const GREEN = ['#2f7d42', '#4f944d', '#6aa84f', '#2e6b3d'];

function RoundedSign({
  text,
  position,
  rotation = [0, 0, 0],
  width = 2.6,
  bg = '#13395b',
  fg = '#f8fafc',
  fontSize = 0.14,
}: {
  text: string;
  position: V3;
  rotation?: V3;
  width?: number;
  bg?: string;
  fg?: string;
  fontSize?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.62, 0.07]} />
        <meshStandardMaterial color={bg} roughness={0.72} />
      </mesh>
      <Text
        position={[0, 0, 0.045]}
        fontSize={fontSize}
        color={fg}
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.25}
        textAlign="center"
        fontWeight="bold"
      >
        {text}
      </Text>
    </group>
  );
}

function TrackLight({ position, rotation = [0, 0, 0] }: { position: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.09, 0.11, 0.28, 10]} />
        <meshStandardMaterial color={BLACK} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.17, 0]}>
        <circleGeometry args={[0.07, 10]} />
        <meshBasicMaterial color="#fff2cf" />
      </mesh>
    </group>
  );
}

function CeilingTrack({ z, x = 0, length = 7 }: { z: number; x?: number; length?: number }) {
  return (
    <group>
      <mesh position={[x, 5.02, z]}>
        <boxGeometry args={[length, 0.045, 0.045]} />
        <meshStandardMaterial color={BLACK} roughness={0.38} />
      </mesh>
      {[-0.38, 0, 0.38].map((t, i) => (
        <TrackLight key={i} position={[x + t * length, 4.86, z]} rotation={[0, 0, i === 1 ? 0 : (i - 1) * 0.16]} />
      ))}
    </group>
  );
}

function HangingWoodLight({ position, length = 4.6 }: { position: V3; length?: number }) {
  return (
    <group position={position}>
      <mesh position={[-length / 2 + 0.35, 0.6, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.2, 5]} />
        <meshBasicMaterial color="#7a756c" />
      </mesh>
      <mesh position={[length / 2 - 0.35, 0.6, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.2, 5]} />
        <meshBasicMaterial color="#7a756c" />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[length, 0.18, 0.26]} />
        <meshStandardMaterial color={WOOD} roughness={0.72} />
      </mesh>
      <mesh position={[0, -0.105, 0]}>
        <boxGeometry args={[length - 0.18, 0.025, 0.12]} />
        <meshStandardMaterial color="#fff5d7" emissive="#ffe3a1" emissiveIntensity={1.05} />
      </mesh>
      
    </group>
  );
}

function OfficeChair({ position, rotation = [0, 0, 0], dark = false }: { position: V3; rotation?: V3; dark?: boolean }) {
  const c = dark ? '#30343a' : '#ecebe4';
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.48, 0.08, 0.48]} />
        <meshStandardMaterial color={c} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.85, 0.19]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.62, 0.08]} />
        <meshStandardMaterial color={c} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
        <meshStandardMaterial color="#767676" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.035, 5]} />
        <meshStandardMaterial color="#555b61" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function SimpleChair({ position, rotation = [0, 0, 0] }: { position: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.52, 0.06, 0.5]} />
        <meshStandardMaterial color="#f2f1ea" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.88, 0.2]} castShadow>
        <boxGeometry args={[0.52, 0.65, 0.06]} />
        <meshStandardMaterial color="#f2f1ea" roughness={0.72} />
      </mesh>
      {[[-0.19, 0.2, -0.18], [0.19, 0.2, -0.18], [-0.19, 0.2, 0.18], [0.19, 0.2, 0.18]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.018, 0.018, 0.42, 6]} />
          <meshStandardMaterial color="#9a9a95" metalness={0.55} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Planter({ position, length = 3.2, depth = 0.72, height = 0.68 }: { position: V3; length?: number; depth?: number; height?: number }) {
  const leaves = useMemo(() => {
    return Array.from({ length: Math.max(5, Math.min(7, Math.round(length * 2))) }, (_, i) => {
      const count = Math.max(5, Math.min(7, Math.round(length * 2)));
      const t = i / Math.max(1, count - 1);
      const x = -length / 2 + 0.2 + t * (length - 0.4);
      const z = ((i % 3) - 1) * depth * 0.19;
      const y = height + 0.22 + (i % 4) * 0.06;
      return { x, y, z, color: GREEN[i % GREEN.length], scale: 0.16 + (i % 3) * 0.03 };
    });
  }, [length, depth, height]);

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height, depth]} />
        <meshStandardMaterial color={PLANTER} roughness={0.88} />
      </mesh>
      {leaves.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]} rotation={[0, (i * 1.7) % Math.PI, (i % 2 ? 1 : -1) * 0.22]}>
          <mesh scale={[1, 1.6, 0.55]}>
            <sphereGeometry args={[p.scale, 8, 6]} />
            <meshStandardMaterial color={p.color} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DeskRow({ position, length = 5.4, rotation = [0, 0, 0] }: { position: V3; length?: number; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.08, 1.15]} />
        <meshStandardMaterial color="#d7b58a" roughness={0.8} />
      </mesh>
      {[-length / 2 + 0.28, length / 2 - 0.28].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]} castShadow>
          <boxGeometry args={[0.08, 0.72, 1.02]} />
          <meshStandardMaterial color="#ecebe5" roughness={0.65} />
        </mesh>
      ))}
      <Planter position={[0, 0.77, 0]} length={Math.min(3.5, length - 1)} depth={0.42} height={0.48} />
      {[-1.7, 0, 1.7].filter((x) => Math.abs(x) < length / 2 - 0.35).map((x, i) => (
        <OfficeChair key={x} position={[x, 0, 1.0]} rotation={[0, Math.PI, 0]} dark={i % 2 === 0} />
      ))}
    </group>
  );
}

function TVStand({ position, rotation = [0, 0, 0], label = 'UID' }: { position: V3; rotation?: V3; label?: string }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[2.6, 1.48, 0.12]} />
        <meshStandardMaterial color="#151719" roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.65, 0.071]}>
        <planeGeometry args={[2.36, 1.25]} />
        <meshStandardMaterial color="#eef7fb" emissive="#d7efff" emissiveIntensity={0.25} />
      </mesh>
      <Text position={[0, 1.76, 0.085]} fontSize={0.34} color="#164d72" anchorX="center" anchorY="middle" fontWeight="bold">
        {label}
      </Text>
      <Text position={[0, 1.38, 0.085]} fontSize={0.12} color="#e3703f" anchorX="center" anchorY="middle">
        MID-AUTUMN WORKSHOP
      </Text>
      <mesh position={[0, 0.73, 0]}>
        <boxGeometry args={[0.12, 1.05, 0.12]} />
        <meshStandardMaterial color="#262626" metalness={0.62} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.72]} />
        <meshStandardMaterial color="#303030" metalness={0.55} roughness={0.42} />
      </mesh>
    </group>
  );
}

function Whiteboard({ position, rotation = [0, 0, 0] }: { position: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[1.8, 2.25, 0.09]} />
        <meshStandardMaterial color="#d4d2ca" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.55, 0.055]}>
        <planeGeometry args={[1.64, 2.02]} />
        <meshStandardMaterial color="#f5f5ef" roughness={0.25} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.8, 6]} />
          <meshStandardMaterial color="#9a9a95" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.45, 0.06, 0.5]} />
        <meshStandardMaterial color="#9a9a95" metalness={0.55} roughness={0.38} />
      </mesh>
    </group>
  );
}

function ReceptionArea() {
  return (
    <group position={[0, 0, 11.4]}>
      <mesh position={[-2.7, 0.62, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.24, 1.15]} />
        <meshStandardMaterial color={WOOD} roughness={0.76} />
      </mesh>
      <mesh position={[-2.7, 1.27, 0]} castShadow>
        <boxGeometry args={[4.35, 0.16, 1.28]} />
        <meshStandardMaterial color="#f4f2eb" roughness={0.45} />
      </mesh>
      <mesh position={[-0.7, 1.42, -0.12]} castShadow>
        <boxGeometry args={[0.6, 2.85, 1.0]} />
        <meshStandardMaterial color={ORANGE} roughness={0.55} />
      </mesh>
      <Planter position={[3.2, 0, -0.15]} length={3.7} depth={1.15} height={1.15} />
      <RoundedSign text="UID • LẦU 2 • VĂN PHÒNG GÒ DẦU" position={[0.3, 3.3, -0.95]} width={5.4} bg="#f3f0e8" fg="#154b70" fontSize={0.2} />
      <RoundedSign text="HỘI THI LỒNG ĐÈN THỦ CÔNG" position={[0.3, 2.55, -0.96]} width={4.6} bg="#d86638" fg="#fff9df" fontSize={0.16} />
    </group>
  );
}

function WorkspaceArea() {
  return (
    <group>
      <DeskRow position={[0, 0, 5.8]} />
      <DeskRow position={[0.8, 0, 1.8]} />
      <DeskRow position={[-0.9, 0, -2.3]} />
      <HangingWoodLight position={[0, 4.25, 5.8]} />
      <HangingWoodLight position={[0.8, 4.25, 1.8]} />
      <HangingWoodLight position={[-0.9, 4.25, -2.3]} />
      <RoundedSign text="→ QUẦY LÀM LỒNG ĐÈN" position={[-7.65, 2.5, 3.2]} rotation={[0, Math.PI / 2, 0]} width={2.8} bg="#fff6cf" fg="#7b3d1d" />
      <RoundedSign text="UP ẢNH → LÀM ĐÈN →" position={[7.65, 2.45, -1.0]} rotation={[0, -Math.PI / 2, 0]} width={2.9} bg="#e9f4f2" fg="#10616b" />
    </group>
  );
}

function WorkshopArea() {
  return (
    <group position={[-5.4, 0, -9.4]}>
      {/* Open workshop: no blocking wall, visible directly from the main aisle */}
      <TVStand position={[-2.0, 0, 1.05]} rotation={[0, 0.18, 0]} label="UID WORKSHOP" />
      <RoundedSign text="🏮 QUẦY LÀM LỒNG ĐÈN • BẤM E" position={[0, 3.45, 0.9]} width={5.3} bg="#b45309" fg="#fff7d6" fontSize={0.18} />

      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.75, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.42} />
      </mesh>

      {[-1.75, 1.75].map((x) => (
        <SimpleChair key={x} position={[x, 0, -1.35]} rotation={[0, Math.PI, 0]} />
      ))}

      <mesh position={[-2.65, 2.55, 0.55]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fff0a8" emissive="#f59e0b" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[2.65, 2.55, 0.55]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fff0a8" emissive="#f59e0b" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function TieredSeating() {
  return (
    <group position={[5.5, 0, -14.2]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.24, 1.4 + i * 0.72]} castShadow receiveShadow>
          <boxGeometry args={[6.6, 0.4, 1.35]} />
          <meshStandardMaterial color={WOOD} roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function EventArea() {
  return (
    <group>
      <TieredSeating />
      <TVStand position={[5.5, 0, -17.9]} label="UID" />
      <RoundedSign text="KHU THẮP SÁNG LỒNG ĐÈN" position={[5.5, 3.65, -18.25]} width={4.5} bg="#b53b2e" fg="#fff3c4" fontSize={0.17} />
      <RoundedSign text="MANG ĐÈN TỚI ĐÂY • BẤM E" position={[5.5, 2.95, -18.25]} width={4.0} bg="#fff1c9" fg="#7f271d" fontSize={0.14} />
      {[-2.2, -1.1, 0, 1.1, 2.2].map((x, i) => (
        <SimpleChair key={x} position={[5.5 + x, 0, -11.1 - (i % 2) * 0.18]} rotation={[0, Math.PI, 0]} />
      ))}
    </group>
  );
}

function BoothArea() {
  return (
    <group position={[6.55, 0, 5.8]}>
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[3.2, 3.3, 2.5]} />
        <meshStandardMaterial color={TEAL} roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.65, -1.27]}>
        <boxGeometry args={[2.55, 2.65, 0.08]} />
        <meshStandardMaterial color="#d9c5a9" roughness={0.92} />
      </mesh>
      <mesh position={[-1.28, 1.55, 0]}>
        <boxGeometry args={[0.16, 2.4, 2.0]} />
        <meshStandardMaterial color={WOOD} roughness={0.78} />
      </mesh>
      <mesh position={[1.28, 1.55, 0]}>
        <boxGeometry args={[0.16, 2.4, 2.0]} />
        <meshStandardMaterial color={WOOD} roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.82, 0.05, 0.72]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <boxGeometry args={[0.08, 0.56, 0.08]} />
        <meshStandardMaterial color="#242424" roughness={0.45} />
      </mesh>
      <RoundedSign text="MEETING BOOTH • GIỮ YÊN LẶNG" position={[0, 3.55, 0]} width={3.3} bg="#11727a" fg="#f7f2dd" fontSize={0.12} />
    </group>
  );
}

function GlassWall({ position, width = 8, height = 4.2, rotation = [0,0,0] }: { position: V3; width?: number; height?: number; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color={GLASS} transparent opacity={0.16} roughness={0.32} depthWrite={false} />
      </mesh>
      {Array.from({ length: Math.floor(width / 1.55) + 1 }).map((_, i, arr) => {
        const x = -width / 2 + (i / (arr.length - 1)) * width;
        return (
          <mesh key={i} position={[x, 0, 0.025]}>
            <boxGeometry args={[0.055, height, 0.055]} />
            <meshStandardMaterial color={BLACK} roughness={0.35} />
          </mesh>
        );
      })}
      <mesh position={[0, height / 2, 0.025]}>
        <boxGeometry args={[width, 0.055, 0.055]} />
        <meshStandardMaterial color={BLACK} />
      </mesh>
      <mesh position={[0, -height / 2, 0.025]}>
        <boxGeometry args={[width, 0.055, 0.055]} />
        <meshStandardMaterial color={BLACK} />
      </mesh>
    </group>
  );
}

function StaircaseToFloor3() {
  return (
    <group position={[7.1, 0, -4.0]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0.14 + i * 0.18, -i * 0.42]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.28, 0.46]} />
          <meshStandardMaterial color="#d8c3a5" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-1.1, 1.15, -1.45]} rotation={[0, 0, -0.42]}>
        <cylinderGeometry args={[0.025, 0.025, 3.5, 8]} />
        <meshStandardMaterial color="#1f2937" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[1.1, 1.15, -1.45]} rotation={[0, 0, -0.42]}>
        <cylinderGeometry args={[0.025, 0.025, 3.5, 8]} />
        <meshStandardMaterial color="#1f2937" metalness={0.55} roughness={0.35} />
      </mesh>
      <RoundedSign
        text="CẦU THANG LÊN LẦU 3 • BẤM E"
        position={[0, 2.35, 0.6]}
        width={3.9}
        bg="#3f2a56"
        fg="#f3e8ff"
        fontSize={0.14}
      />
      <Text position={[0, 1.75, 0.58]} fontSize={0.11} color="#7f1d1d" anchorX="center" anchorY="middle">
        Halloween Zone • cân nhắc trước khi lên
      </Text>
    </group>
  );
}

export function Environment() {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh position={[0, -0.12, -3.8]} receiveShadow>
          <boxGeometry args={[20, 0.24, 40]} />
          <meshStandardMaterial color={FLOOR} roughness={0.62} metalness={0.05} />
        </mesh>
      </RigidBody>

      {/* subtle tile seams */}
      {[-8,-4,0,4,8].map((x) => (
        <mesh key={'x'+x} position={[x, 0.008, -4]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[0.018, 39]} />
          <meshBasicMaterial color="#d5d0c7" />
        </mesh>
      ))}
      {[12,8,4,0,-4,-8,-12,-16,-20].map((z) => (
        <mesh key={'z'+z} position={[0, 0.009, z]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[19.5, 0.018]} />
          <meshBasicMaterial color="#d5d0c7" />
        </mesh>
      ))}

      {/* concrete ceiling and exposed black services */}
      <mesh position={[0, 5.3, -3.7]} receiveShadow>
        <boxGeometry args={[20, 0.28, 40]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.96} />
      </mesh>
      {[-7.4, -2.2, 3.0, 8.2].map((z) => (
        <mesh key={z} position={[0, 5.02, z]}>
          <boxGeometry args={[18.5, 0.18, 0.28]} />
          <meshStandardMaterial color={BLACK} roughness={0.48} />
        </mesh>
      ))}
      <mesh position={[3.8, 4.95, -4.2]}>
        <boxGeometry args={[0.48, 0.35, 25]} />
        <meshStandardMaterial color="#202327" roughness={0.55} />
      </mesh>

      {/* outer walls / collision */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-9.75, 2.55, -3.8]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 5.1, 40]} />
          <meshStandardMaterial color={WALL} roughness={0.93} />
        </mesh>
        <mesh position={[9.75, 2.55, -3.8]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 5.1, 40]} />
          <meshStandardMaterial color={WALL} roughness={0.93} />
        </mesh>
        <mesh position={[0, 2.55, -23.55]} castShadow receiveShadow>
          <boxGeometry args={[20, 5.1, 0.5]} />
          <meshStandardMaterial color={WALL} roughness={0.93} />
        </mesh>
        <mesh position={[0, 2.55, 15.85]}>
          <boxGeometry args={[20, 5.1, 0.4]} />
          <meshStandardMaterial color={WALL} transparent opacity={0.08} />
        </mesh>
      </RigidBody>

      {/* large windows like the reference photos */}
      <GlassWall position={[7.8, 2.6, 0.6]} width={9.2} height={4.0} rotation={[0, -Math.PI/2, 0]} />
      <GlassWall position={[-0.2, 2.6, -22.3]} width={8.0} height={4.0} />
      <mesh position={[8.4, 2.0, -3.2]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[10, 3.2]} />
        <meshStandardMaterial color="#a74939" roughness={0.95} />
      </mesh>

      <ReceptionArea />
      <WorkspaceArea />
      <WorkshopArea />
      <EventArea />
      <BoothArea />
      <StaircaseToFloor3 />

      <CeilingTrack z={12.3} length={7.5} />
      <CeilingTrack z={8.5} x={-1.5} length={8.0} />
      <CeilingTrack z={3.6} x={1.1} length={8.5} />
      <CeilingTrack z={-1.5} x={-0.8} length={8.5} />
      <CeilingTrack z={-7.0} x={0.5} length={9.0} />
      <CeilingTrack z={-12.5} x={0.4} length={9.0} />
      <CeilingTrack z={-18.0} x={0.8} length={8.0} />

      <RoundedSign text="← WORKSHOP UID • QUẦY LÀM LỒNG ĐÈN" position={[-7.7, 2.9, -5.8]} rotation={[0, Math.PI/2, 0]} width={3.7} bg="#164e63" fg="#fff7db" fontSize={0.13} />
      <RoundedSign text="SĂN 3 BÁNH TRUNG THU ✈ 3.000.000đ" position={[7.7, 2.9, -8.2]} rotation={[0, -Math.PI/2, 0]} width={4.4} bg="#9b2c25" fg="#fff0be" fontSize={0.12} />

      {/* some workshop clutter / handmade feel */}
      <mesh position={[-7.4, 0.28, -7.9]} rotation={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.15, 0.55, 0.75]} />
        <meshStandardMaterial color="#a56f3e" roughness={0.92} />
      </mesh>
      <mesh position={[-7.1, 0.62, -8.0]} rotation={[0, -0.18, 0]} castShadow>
        <boxGeometry args={[0.8, 0.18, 0.6]} />
        <meshStandardMaterial color="#c38b4d" roughness={0.9} />
      </mesh>
      <mesh position={[-6.65, 0.86, -8.1]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.028, 0.028, 0.86, 8]} />
        <meshStandardMaterial color="#8fa34c" roughness={0.85} />
      </mesh>
    </group>
  );
}
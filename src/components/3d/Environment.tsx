import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly Vietnamese Plastic Stool ("Ghế nhựa Duy Tân")
export function PlasticStool({ position, rotation = [0, 0, 0], color = '#d32f2f' }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat with small center hole */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.05, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* 4 Sturdy angled legs */}
      {[
        [-0.16, 0.2, -0.16],
        [0.16, 0.2, -0.16],
        [-0.16, 0.2, 0.16],
        [0.16, 0.2, 0.16],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.045, 0.4, 0.045]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Folding Office / Street Vendor Table (Bàn inox / bàn gấp)
export function FoldingTable({ position, rotation = [0, 0, 0] }: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Table top */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Table legs (crossed steel bars) */}
      <mesh position={[-0.6, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Cardboard Box with duct tape
export function CardboardBox({ position, rotation = [0, 0, 0], scale = [1, 1, 1], label = 'FINAL_v7' }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  label?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color="#b4834b" roughness={0.9} />
      </mesh>
      {/* Brown/silver duct tape cross */}
      <mesh position={[0, 0.605, 0]}>
        <boxGeometry args={[0.71, 0.01, 0.12]} />
        <meshStandardMaterial color="#88623b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.606, 0]}>
        <boxGeometry args={[0.12, 0.01, 0.71]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Handwritten text sticker */}
      {label && (
        <group position={[0, 0.35, 0.355]}>
          <mesh>
            <planeGeometry args={[0.38, 0.18]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.065}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}

// Hanging Office Sign
export function OfficeSign({ text, position, rotation = [0, 0, 0], bgColor = '#dc2626', textColor = '#fef08a' }: {
  text: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  bgColor?: string;
  textColor?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Sign board */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 0.5, 0.06]} />
        <meshStandardMaterial color={bgColor} roughness={0.6} />
      </mesh>
      {/* Yellow border */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[2.1, 0.42, 0.01]} />
        <meshStandardMaterial color={textColor} roughness={0.3} emissive={textColor} emissiveIntensity={0.2} />
      </mesh>
      {/* Inner panel */}
      <mesh position={[0, 0, 0.042]}>
        <boxGeometry args={[2.02, 0.36, 0.01]} />
        <meshStandardMaterial color={bgColor} />
      </mesh>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.13}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.9}
        textAlign="center"
      >
        {text}
      </Text>
      {/* Suspension wire */}
      <mesh position={[-0.8, 0.45, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.5, 4]} />
        <meshBasicMaterial color="#475569" />
      </mesh>
      <mesh position={[0.8, 0.45, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.5, 4]} />
        <meshBasicMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// Fairy lights cable with blinking colored LEDs
export function FairyLightsString({ start, end, lightCount = 10 }: {
  start: [number, number, number];
  end: [number, number, number];
  lightCount?: number;
}) {
  const lightsRef = useRef<THREE.Group>(null);
  const colors = useMemo(() => ['#ff0055', '#ffaa00', '#00ffcc', '#ff00aa', '#ffff00', '#00e5ff'], []);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= lightCount; i++) {
      const t = i / lightCount;
      const x = start[0] + (end[0] - start[0]) * t;
      const z = start[2] + (end[2] - start[2]) * t;
      // Catany / sag curve
      const sag = Math.sin(t * Math.PI) * 0.45;
      const y = start[1] + (end[1] - start[1]) * t - sag;
      pts.push({ x, y, z, color: colors[i % colors.length] });
    }
    return pts;
  }, [start, end, lightCount, colors]);

  useFrame((state) => {
    if (!lightsRef.current) return;
    const time = state.clock.getElapsedTime();
    lightsRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && 'emissiveIntensity' in mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.4 + Math.sin(time * 6 + i * 1.3) * 0.8;
      }
    });
  });

  return (
    <group ref={lightsRef}>
      {points.map((pt, i) => (
        <mesh key={i} position={[pt.x, pt.y, pt.z]}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial
            color={pt.color}
            emissive={pt.color}
            emissiveIntensity={1.0}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Mini traditional red star lantern on strings
export function MiniStarLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Star center */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 5]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      {/* Bamboo ring rim */}
      <mesh>
        <torusGeometry args={[0.25, 0.015, 8, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
      {/* Mini point light */}
      <pointLight color="#ff4444" intensity={0.4} distance={3} decay={2} />
    </group>
  );
}

export function Environment() {
  return (
    <group>
      {/* --- GROUND (Alley & Courtyard) --- */}
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh position={[0, -0.1, -4]} receiveShadow>
          <boxGeometry args={[24, 0.2, 48]} />
          <meshStandardMaterial color="#1a202c" roughness={0.85} metalness={0.15} />
        </mesh>
      </RigidBody>

      {/* Decorative pavement tiles & wet puddles */}
      <mesh position={[0, 0.01, 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* Central courtyard stone circle */}
      <mesh position={[0, 0.012, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7.5, 32]} />
        <meshStandardMaterial color="#242f44" roughness={0.6} />
      </mesh>
      {/* Yellow Caution / Safety painted lines */}
      <mesh position={[-3.8, 0.015, 6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 18]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <mesh position={[3.8, 0.015, 6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 18]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* --- ALLEY WALLS & BUILDINGS (Low Poly Vietnamese Corporate Office) --- */}
      {/* Left Wall Corridor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-5.8, 4, 6]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 8, 22]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>
        {/* Left Courtyard Wall */}
        <mesh position={[-8.5, 4, -15]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 8, 20]} />
          <meshStandardMaterial color="#232b38" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Right Wall Corridor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[5.8, 4, 6]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 8, 22]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>
        {/* Right Courtyard Wall */}
        <mesh position={[8.5, 4, -15]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 8, 20]} />
          <meshStandardMaterial color="#232b38" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Back Wall Courtyard */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 4, -25.5]} castShadow receiveShadow>
          <boxGeometry args={[20, 8, 1.5]} />
          <meshStandardMaterial color="#1a202c" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Entrance Fence / Barrier (Prevents player from walking off the map) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1.5, 16.5]}>
          <boxGeometry args={[14, 3, 0.5]} />
          <meshStandardMaterial color="#334155" transparent opacity={0.1} />
        </mesh>
      </RigidBody>

      {/* Corrugated Tin Roofs Overhangs (Mái tôn xanh) */}
      <mesh position={[-4.5, 4.8, 6]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[2, 0.08, 18]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[4.5, 4.8, 6]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[2, 0.08, 18]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Air conditioning condenser units (Cục nóng điều hòa kêu è è) */}
      {[-4.9, 4.9].map((x, i) => (
        <group key={i} position={[x, 3.2, 5 + i * 4]}>
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.6, 0.9]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[x < 0 ? 0.24 : -0.24, 0, 0]}>
            <circleGeometry args={[0.22, 16]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        </group>
      ))}

      {/* --- ENTRANCE GATE & EVENT BANNER --- */}
      <group position={[0, 3.8, 15]}>
        {/* Gate bamboo posts */}
        <mesh position={[-3.2, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        <mesh position={[3.2, -1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Red company event banner */}
        <mesh castShadow>
          <boxGeometry args={[6.8, 1.1, 0.06]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} />
        </mesh>
        <Text
          position={[0, 0.18, 0.04]}
          fontSize={0.24}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          LỄ HỘI RẰM THÁNG 8 CÔNG TY BÙ ĐẦU
        </Text>
        <Text
          position={[0, -0.22, 0.04]}
          fontSize={0.14}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ĐỊA ĐIỂM: LẦU 4 • VĂN PHÒNG GÒ DẦU
        </Text>
      </group>

      {/* --- SECURITY GUARD BOOTH (CHỐT BẢO VỆ) --- */}
      <group position={[3.6, 0, 13]}>
        {/* Booth Cabin */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[1.6, 2.5, 1.6]} />
          <meshStandardMaterial color="#0f766e" roughness={0.6} />
        </mesh>
        {/* Booth Window */}
        <mesh position={[0, 1.4, -0.81]}>
          <planeGeometry args={[1.1, 0.8]} />
          <meshStandardMaterial color="#e0f2fe" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Booth Sign */}
        <Text
          position={[0, 2.2, -0.82]}
          fontSize={0.12}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
        >
          CHỐT BẢO VỆ
        </Text>
      </group>

      {/* --- HILARIOUS CORPORATE SIGNS ALONG ALLEY --- */}
      <OfficeSign
        text="PHÒNG HÀNH CHÍNH"
        position={[-4.8, 3.4, 11]}
        rotation={[0, Math.PI / 2, 0]}
        bgColor="#1e3a8a"
        textColor="#93c5fd"
      />
      <OfficeSign
        text="KHÔNG TỰ Ý CẮM NỒI LẨU VÀO Ổ ĐIỆN SERVER"
        position={[4.8, 3.5, 7.5]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#b91c1c"
        textColor="#fef08a"
      />
      <OfficeSign
        text="LỒNG ĐÈN ĐÃ QUA QA (Chưa test Prod)"
        position={[-4.8, 3.5, 3]}
        rotation={[0, Math.PI / 2, 0]}
        bgColor="#15803d"
        textColor="#86efac"
      />
      <OfficeSign
        text="LỒNG ĐÈN CHƯA QUA QA (Dev tự tin lắm)"
        position={[4.8, 3.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#c2410c"
        textColor="#fed7aa"
      />
      <OfficeSign
        text="CREATIVE DEPT: SỬA LẦN CUỐI_FINAL_REAL"
        position={[-4.8, 3.5, -4]}
        rotation={[0, Math.PI / 2, 0]}
        bgColor="#6b21a8"
        textColor="#f0abfc"
      />
      <OfficeSign
        text="BAN TỔ CHỨC: CHỊ HẰNG ĐANG XIN NGHỈ PHÉP"
        position={[4.8, 3.5, -7]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#0369a1"
        textColor="#bae6fd"
      />

      {/* --- DIRECTION SIGNS TO THE PERSONAL LANTERN WORKSHOP --- */}
      <OfficeSign
        text="🏮 QUẦY LÀM LỒNG ĐÈN  ↓  ĐI THẲNG"
        position={[4.8, 2.55, 9.2]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#92400e"
        textColor="#fde68a"
      />
      <OfficeSign
        text="📸 UP ẢNH LÀM LỒNG ĐÈN  ↓"
        position={[-4.8, 2.55, 2.0]}
        rotation={[0, Math.PI / 2, 0]}
        bgColor="#7c2d12"
        textColor="#fef3c7"
      />
      <OfficeSign
        text="← QUẦY LÀM LỒNG ĐÈN • LẦU 4"
        position={[4.8, 2.55, -6.8]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#854d0e"
        textColor="#fef08a"
      />

      {/* --- FAIRY LIGHT STRINGS ZIG-ZAGGING OVERHEAD --- */}
      <FairyLightsString start={[-4.8, 4.4, 13]} end={[4.8, 4.2, 9]} lightCount={12} />
      <FairyLightsString start={[4.8, 4.2, 9]} end={[-4.8, 4.3, 5]} lightCount={12} />
      <FairyLightsString start={[-4.8, 4.3, 5]} end={[4.8, 4.1, 1]} lightCount={12} />
      <FairyLightsString start={[4.8, 4.1, 1]} end={[-4.8, 4.4, -3]} lightCount={12} />
      <FairyLightsString start={[-4.8, 4.4, -3]} end={[4.8, 4.2, -7]} lightCount={12} />
      <FairyLightsString start={[-7.5, 4.8, -11]} end={[7.5, 4.8, -11]} lightCount={16} />

      {/* Mini stars hung overhead */}
      <MiniStarLantern position={[-1.5, 3.6, 9]} />
      <MiniStarLantern position={[2.0, 3.5, 5]} />
      <MiniStarLantern position={[-0.8, 3.4, 1]} />
      <MiniStarLantern position={[1.8, 3.6, -3]} />

      {/* --- PROPS: FOLDING TABLES & PLASTIC STOOLS --- */}
      {/* Table 1 with stools */}
      <FoldingTable position={[-3.2, 0, 7.5]} rotation={[0, 0.1, 0]} />
      <PlasticStool position={[-3.6, 0, 8.2]} color="#dc2626" />
      <PlasticStool position={[-2.8, 0, 8.2]} color="#2563eb" />
      <PlasticStool position={[-3.6, 0, 6.8]} color="#dc2626" />

      {/* Table 2 with stools in Lantern Market */}
      <FoldingTable position={[3.2, 0, 2.5]} rotation={[0, -0.15, 0]} />
      <PlasticStool position={[3.6, 0, 3.2]} color="#16a34a" />
      <PlasticStool position={[2.8, 0, 3.2]} color="#dc2626" />

      {/* Table 3 in Market */}
      <FoldingTable position={[-3.2, 0, -2.5]} rotation={[0, 0.2, 0]} />
      <PlasticStool position={[-3.5, 0, -1.8]} color="#2563eb" />
      <PlasticStool position={[-2.8, 0, -3.2]} color="#dc2626" />

      {/* Stools scattered around Courtyard */}
      <PlasticStool position={[-2.5, 0, -11]} color="#dc2626" />
      <PlasticStool position={[-3.4, 0, -12]} color="#16a34a" />
      <PlasticStool position={[2.6, 0, -11]} color="#2563eb" />
      <PlasticStool position={[3.5, 0, -12.5]} color="#dc2626" />

      {/* Cardboard boxes stacked in corners */}
      <CardboardBox position={[-4.2, 0, 12]} rotation={[0, 0.3, 0]} label="CHIPS_snack" />
      <CardboardBox position={[-4.4, 0, 11.2]} rotation={[0, -0.2, 0]} label="BANH_TRUNG_THU" />
      <CardboardBox position={[-4.3, 0.6, 11.5]} rotation={[0, 0.1, 0]} scale={[0.8, 0.8, 0.8]} label="FINAL_FINAL_v7" />
      <CardboardBox position={[4.2, 0, 10.5]} rotation={[0, -0.4, 0]} label="DAY_DIEN_CU" />
      <CardboardBox position={[4.1, 0, -5]} rotation={[0, 0.5, 0]} label="TAI_LIEU_QA" />

      {/* Potted kumquat / decorative office tree */}
      <group position={[-3.8, 0, 14]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.22, 0.6, 12]} />
          <meshStandardMaterial color="#991b1b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.6, 10, 10]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        {/* Tiny oranges */}
        {[[0.3, 1.2, 0.3], [-0.3, 1.0, 0.4], [0.4, 0.9, -0.2], [-0.2, 1.3, -0.3]].map(([ox, oy, oz], oi) => (
          <mesh key={oi} position={[ox, oy, oz]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#ea580c" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Water cooler near entrance */}
      <group position={[3.8, 0, 11.5]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.4, 1.0, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 12]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
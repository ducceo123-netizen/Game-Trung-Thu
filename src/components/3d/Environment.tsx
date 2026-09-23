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
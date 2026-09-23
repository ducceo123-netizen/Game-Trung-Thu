import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function MoonServer() {
  const moonOnline = useGameStore((s) => s.moonOnline);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const sparksRef = useRef<THREE.Group>(null);
  const serverLedsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate moon slowly
    if (moonMeshRef.current) {
      moonMeshRef.current.rotation.y = time * 0.04;

      // When offline or rebooting, moon flickers
      const mat = moonMeshRef.current.material as THREE.MeshStandardMaterial;
      if (moonOnline) {
        mat.emissive.set('#ffea88');
        mat.emissiveIntensity = 2.4 + Math.sin(time * 2) * 0.2;
        mat.color.set('#fffbeb');
      } else if (gamePhase === 'rebooting') {
        const flicker = Math.random() > 0.4 ? 1.8 : 0.1;
        mat.emissiveIntensity = flicker;
      } else {
        // Offline dim state
        const dimFlicker = Math.sin(time * 3) > 0.8 ? 0.35 : 0.15;
        mat.emissive.set('#64748b');
        mat.emissiveIntensity = dimFlicker;
        mat.color.set('#334155');
      }
    }

    // Server rack LEDs flicker
    if (serverLedsRef.current) {
      serverLedsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'color' in mesh.material) {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          if (moonOnline) {
            mat.color.set(i % 2 === 0 ? '#22c55e' : '#38bdf8');
          } else {
            mat.color.set(Math.sin(time * 8 + i * 2) > 0 ? '#ef4444' : '#7f1d1d');
          }
        }
      });
    }

    // Sparks when rebooting
    if (sparksRef.current) {
      sparksRef.current.visible = gamePhase === 'rebooting';
      if (sparksRef.current.visible) {
        sparksRef.current.children.forEach((child) => {
          child.position.x = (Math.random() - 0.5) * 1.5;
          child.position.y = 1.0 + Math.random() * 2.0;
          child.position.z = -18 + (Math.random() - 0.5) * 1.5;
        });
      }
    }
  });

  return (
    <group position={[0, 0, -18]}>
      {/* ========================================================
          1. GIANT MOON IN THE SKY ABOVE COURTYARD
         ======================================================== */}
      <group position={[0, 14, -4]}>
        <mesh ref={moonMeshRef} castShadow>
          <sphereGeometry args={[4.2, 32, 32]} />
          <meshStandardMaterial
            color="#334155"
            emissive="#64748b"
            emissiveIntensity={0.2}
            roughness={0.7}
          />
        </mesh>

        {/* Moon craters / dark maria spots */}
        <mesh position={[1.2, 1.0, 3.8]}>
          <circleGeometry args={[0.9, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[-1.5, -0.8, 3.7]}>
          <circleGeometry args={[1.3, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0.4, -1.8, 3.6]}>
          <circleGeometry args={[0.7, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Giant Moonlight Point Source */}
        {moonOnline ? (
          <>
            <pointLight color="#fff7ed" intensity={4.5} distance={50} decay={1.5} />
            {/* Radiant halo ring when online */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <ringGeometry args={[4.8, 5.2, 32]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.4} />
            </mesh>
          </>
        ) : (
          <pointLight color="#38bdf8" intensity={0.4} distance={20} decay={2} />
        )}

        {/* Floating Server Status Label under the Moon */}
        <group position={[0, -5.2, 0]}>
          <mesh>
            <planeGeometry args={[4.2, 1.1]} />
            <meshBasicMaterial color="#020617" transparent opacity={0.9} />
          </mesh>
          <Text
            position={[0, 0.22, 0.01]}
            fontSize={0.28}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            MOON SERVER v1.0
          </Text>
          <Text
            position={[0, -0.22, 0.01]}
            fontSize={0.24}
            color={moonOnline ? '#22c55e' : '#ef4444'}
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {moonOnline ? 'STATUS: ONLINE 🌕' : 'STATUS: OFFLINE ⚡ (404)'}
          </Text>
        </group>
      </group>

      {/* ========================================================
          2. TRẠM PHÁT TRĂNG (Machine underneath)
          Combination of:
          - Server Rack (19" metal cabinet with server blades)
          - Electrical Box (High voltage breaker & danger sign)
          - Vietnamese Shrine (Red cloth altar, incense burner, fruit offering)
          - Tangled office extension cords
         ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Foundation Altar Stone Pedestal */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.4, 3.2]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Shrine Table with Red Cloth (Bàn thờ ông Táo / Thổ địa IT) */}
        <mesh position={[0, 0.8, 0.4]} castShadow>
          <boxGeometry args={[3.2, 0.8, 1.4]} />
          <meshStandardMaterial color="#991b1b" roughness={0.4} />
        </mesh>
        {/* Gold fringe trim on altar cloth */}
        <mesh position={[0, 0.45, 1.11]}>
          <boxGeometry args={[3.22, 0.08, 0.02]} />
          <meshStandardMaterial color="#facc15" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Incense Burner Pot (Bát hương) */}
        <group position={[0, 1.25, 0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.22, 16]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Ash surface */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.2, 16]} />
            <meshStandardMaterial color="#78716c" />
          </mesh>
          {/* 3 Glowing Incense Sticks (3 nén nhang đỏ) */}
          {[-0.05, 0, 0.05].map((ix, idx) => (
            <group key={idx} position={[ix, 0.25, 0]}>
              <mesh>
                <cylinderGeometry args={[0.005, 0.005, 0.35, 4]} />
                <meshStandardMaterial color="#b91c1c" />
              </mesh>
              {/* Glowing red ember tip */}
              <mesh position={[0, 0.18, 0]}>
                <sphereGeometry args={[0.012, 6, 6]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          ))}
        </group>

        {/* Offerings: Plate of Mooncakes and Pomelo (Đĩa bánh trung thu & Bưởi) */}
        <group position={[-0.8, 1.25, 0.6]}>
          {/* Ceramic plate */}
          <mesh>
            <cylinderGeometry args={[0.26, 0.22, 0.03, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          {/* Mooncake (Bánh nướng vàng) */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 12]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
        </group>
        <group position={[0.8, 1.25, 0.6]}>
          {/* Green pomelo (Quả bưởi xanh) */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#65a30d" roughness={0.6} />
          </mesh>
        </group>

        {/* --- 19" SERVER RACK BEHIND THE ALTAR --- */}
        <group position={[0, 1.8, -0.6]}>
          {/* Rack Chassis */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 2.6, 1.0]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Front Glass / Perforated Mesh Door */}
          <mesh position={[0, 0, 0.51]}>
            <planeGeometry args={[1.4, 2.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} transparent opacity={0.7} />
          </mesh>

          {/* Server blade units */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((sy, si) => (
            <mesh key={si} position={[0, sy, 0.48]}>
              <boxGeometry args={[1.35, 0.28, 0.06]} />
              <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}

          {/* Blinking LEDs on Server Blades */}
          <group ref={serverLedsRef} position={[0, 0, 0.52]}>
            {Array.from({ length: 15 }).map((_, li) => {
              const lx = -0.55 + (li % 5) * 0.14;
              const ly = 0.8 - Math.floor(li / 5) * 0.4;
              return (
                <mesh key={li} position={[lx, ly, 0]}>
                  <sphereGeometry args={[0.02, 6, 6]} />
                  <meshBasicMaterial color="#ef4444" />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* --- INDUSTRIAL ELECTRICAL BREAKER BOX ON SIDE --- */}
        <group position={[-1.3, 1.6, -0.6]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 1.2, 0.6]} />
            <meshStandardMaterial color="#78716c" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* High Voltage Danger Sign (Tam giác vàng sấm sét) */}
          <mesh position={[-0.26, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.25, 0.25]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
          {/* Big Red Emergency Kill Switch / Breaker lever */}
          <mesh position={[-0.28, -0.2, 0]}>
            <boxGeometry args={[0.08, 0.22, 0.08]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>

        {/* Tangled mess of yellow/orange/black power cables on floor */}
        {[
          [0.6, 0.02, 0.2],
          [-0.8, 0.02, 0.4],
          [1.1, 0.02, -0.2],
        ].map(([cx, cy, cz], ci) => (
          <mesh key={ci} position={[cx, cy, cz]} rotation={[0, ci * 0.8, 0]}>
            <torusGeometry args={[0.35 + ci * 0.1, 0.02, 6, 16]} />
            <meshStandardMaterial color={ci === 0 ? '#ea580c' : ci === 1 ? '#eab308' : '#0f172a'} />
          </mesh>
        ))}

        {/* Machine Name Banner: "TRẠM PHÁT TRĂNG" */}
        <group position={[0, 3.4, -0.6]}>
          <mesh>
            <boxGeometry args={[2.8, 0.55, 0.1]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          <Text
            position={[0, 0.08, 0.06]}
            fontSize={0.16}
            color="#fef08a"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            TRẠM PHÁT TRĂNG
          </Text>
          <Text
            position={[0, -0.14, 0.06]}
            fontSize={0.09}
            color="#93c5fd"
            anchorX="center"
            anchorY="middle"
          >
            Nghiêm cấm cắm nồi lẩu vào ổ điện này
          </Text>
        </group>
      </group>

      {/* Sparks particles when rebooting */}
      <group ref={sparksRef}>
        {Array.from({ length: 12 }).map((_, si) => (
          <mesh key={si}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

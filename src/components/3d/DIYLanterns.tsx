import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

interface LanternProps {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  onInteract: () => void;
  children: React.ReactNode;
  pokeSwing?: number;
}

// Base Lantern Wrapper with suspension string, gentle natural breeze sway,
// and dramatic swing response when poked by bamboo pole
function BaseHangingLantern({
  name,
  position,
  color,
  children,
}: LanternProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lanternBodyRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const bambooPokeTrigger = useGameStore((s) => s.bambooPokeTrigger);
  const lastPokeRef = useRef(0);
  const impulseRef = useRef({ x: 0, z: 0 });

  // When player triggers bamboo poke, if near this lantern, impart a big angular velocity!
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!lanternBodyRef.current) return;

    if (bambooPokeTrigger !== lastPokeRef.current) {
      lastPokeRef.current = bambooPokeTrigger;
      // Impart dramatic impulse
      impulseRef.current.x = (Math.random() - 0.5) * 1.8;
      impulseRef.current.z = (Math.random() - 0.5) * 1.8;
    }

    // Dampen impulse
    impulseRef.current.x *= 0.94;
    impulseRef.current.z *= 0.94;

    // Natural gentle sway + impulse
    const naturalSwayX = Math.sin(time * 1.8 + position[0]) * 0.08;
    const naturalSwayZ = Math.cos(time * 1.4 + position[2]) * 0.08;

    lanternBodyRef.current.rotation.x = naturalSwayX + impulseRef.current.x;
    lanternBodyRef.current.rotation.z = naturalSwayZ + impulseRef.current.z;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* DIY carrying rig inspired by real handmade Mid-Autumn lanterns:
          bamboo stick -> cheap yellow hook -> red cord -> improvised payload */}
      <group position={[-0.48, 1.25, 0.02]} rotation={[0, 0, -0.58]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.024, 1.45, 8]} />
          <meshStandardMaterial color="#9a7b36" roughness={0.9} />
        </mesh>
        {[0.02, 0.38, 0.74].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.026, 0.004, 6, 10]} />
            <meshStandardMaterial color="#6f5b2b" roughness={1} />
          </mesh>
        ))}
        <mesh position={[0.03, 1.16, 0]} rotation={[Math.PI / 2, 0, 0.2]}>
          <torusGeometry args={[0.055, 0.012, 6, 12, Math.PI * 1.45]} />
          <meshStandardMaterial color="#f4c430" roughness={0.45} />
        </mesh>
      </group>

      {/* Visible red hanging cord, deliberately simple and handmade */}
      <mesh position={[0, 0.73, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 1.46, 5]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.95} />
      </mesh>

      {/* Main swinging payload */}
      <group
        ref={lanternBodyRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        {children}

        {/* Floating name badge if hovered */}
        {hovered && (
          <group position={[0, 0.9, 0]}>
            <mesh>
              <planeGeometry args={[1.6, 0.35]} />
              <meshBasicMaterial color="#0f172a" transparent opacity={0.85} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.11}
              color="#fef08a"
              anchorX="center"
              anchorY="middle"
            >
              {name}
            </Text>
          </group>
        )}

        {/* Ambient point light */}
        <pointLight color={color} intensity={1.2} distance={4.5} decay={2} position={[0, 0, 0]} />
      </group>
    </group>
  );
}

// 1. SALONPAS LANTERN (Rectangular medicine box, white/blue/green, fairy lights wrapped, red tassel)
export function SalonpasLantern({ position }: { position: [number, number, number] }) {
  const applyHealing = useGameStore((s) => s.applySalonpasHealing);

  return (
    <BaseHangingLantern
      id="salonpas"
      name="LỒNG ĐÈN SALONPAS"
      position={position}
      color="#10b981"
      onInteract={applyHealing}
    >
      <group>
        {/* Literal improvised medicine-package body: wide cardboard box, not a fantasy lantern */}
        <mesh castShadow rotation={[0.02, -0.04, -0.025]}>
          <boxGeometry args={[0.98, 0.58, 0.3]} />
          <meshStandardMaterial color="#0f9f70" roughness={0.78} />
        </mesh>
        {/* Slightly imperfect white printed front label */}
        <mesh position={[0, 0, 0.156]} rotation={[0, 0, -0.015]}>
          <planeGeometry args={[0.9, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
        {/* Blue Salonpas brand band */}
        <mesh position={[0, 0.08, 0.162]} rotation={[0, 0, 0.01]}>
          <planeGeometry args={[0.82, 0.19]} />
          <meshBasicMaterial color="#1d4ed8" />
        </mesh>
        <Text
          position={[0, 0.12, 0.155]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          SALONPAS
        </Text>
        <Text
          position={[0, -0.15, 0.155]}
          fontSize={0.06}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          TRỊ ĐAU LƯNG DEADLINE
        </Text>

        {/* Cheap warm fairy-light wire visibly wrapped around the real package */}
        <mesh rotation={[0.25, 0.45, 0.08]}>
          <torusGeometry args={[0.48, 0.008, 6, 28]} />
          <meshStandardMaterial color="#6b4f2a" roughness={0.9} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.48, Math.sin(a) * 0.28, 0.18 + Math.sin(a * 2) * 0.04]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#ffe9a8" emissive="#ffc94a" emissiveIntensity={2.2} roughness={0.25} />
            </mesh>
          );
        })}

        {/* Red tassel underneath (Chùm tua rua đỏ) */}
        <group position={[0, -0.6, 0]}>
          <mesh>
            <coneGeometry args={[0.08, 0.35, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </BaseHangingLantern>
  );
}

// 2. BEER CAN LANTERN (Huge green beer can hanging, rabbit on top who runs away when clicked)
export function BeerCanLantern({ position }: { position: [number, number, number] }) {
  const rabbitFled = useGameStore((s) => s.beerCanRabbitFled);
  const triggerRabbit = useGameStore((s) => s.triggerBeerCanRabbit);
  const rabbitOffset = useRef(0);

  useFrame((_, delta) => {
    if (rabbitFled && rabbitOffset.current < 6) {
      rabbitOffset.current += delta * 5;
    }
  });

  return (
    <BaseHangingLantern
      id="beer_can"
      name="LỒNG ĐÈN LON BIA SAIGON"
      position={position}
      color="#22c55e"
      onInteract={triggerRabbit}
    >
      <group>
        {/* Bamboo hanging bar */}
        <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>

        {/* Giant Green Beer Can */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.85, 20]} />
          <meshStandardMaterial color="#15803d" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Silver can rims */}
        <mesh position={[0, 0.43, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.06, 20]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.43, 0]}>
          <cylinderGeometry args={[0.3, 0.28, 0.06, 20]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Golden star / beer logo */}
        <Text
          position={[0, 0.05, 0.305]}
          fontSize={0.11}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          BIA BÙ ĐẦU
        </Text>
        <Text
          position={[0, -0.15, 0.305]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          100% CỒN & DEADLINE
        </Text>

        {/* Tiny white rabbit sitting on top of the can */}
        {!rabbitFled ? (
          <group position={[0, 0.58, 0]} scale={[0.22, 0.22, 0.22]}>
            {/* Rabbit body */}
            <mesh castShadow>
              <sphereGeometry args={[0.7, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            {/* Rabbit head */}
            <mesh position={[0, 0.7, 0.3]} castShadow>
              <sphereGeometry args={[0.5, 12, 12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            {/* Ears */}
            <mesh position={[-0.2, 1.4, 0.2]} rotation={[0.1, 0, -0.2]}>
              <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.2, 1.4, 0.2]} rotation={[0.1, 0, 0.2]}>
              <capsuleGeometry args={[0.1, 0.5, 4, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Pink nose */}
            <mesh position={[0, 0.65, 0.78]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#f472b6" />
            </mesh>
          </group>
        ) : (
          /* Rabbit fleeing animation trail */
          <group position={[rabbitOffset.current, 0.58 + rabbitOffset.current * 0.3, 0]} scale={[0.18, 0.18, 0.18]}>
            <mesh>
              <sphereGeometry args={[0.6, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        )}
      </group>
    </BaseHangingLantern>
  );
}

// 3. WATER BOTTLE LANTERN (1.5L plastic bottle, fairy lights inside, launches like rocket)
export function WaterBottleLantern({ position }: { position: [number, number, number] }) {
  const launched = useGameStore((s) => s.waterBottleLaunched);
  const launchBottle = useGameStore((s) => s.launchWaterBottle);
  const bottleY = useRef(0);
  const bottleSpeed = useRef(0);

  useFrame((_, delta) => {
    if (launched) {
      bottleSpeed.current += delta * 12;
      bottleY.current = Math.sin(bottleSpeed.current) * 3.5;
    } else {
      bottleY.current = 0;
      bottleSpeed.current = 0;
    }
  });

  return (
    <BaseHangingLantern
      id="water_bottle"
      name="LỒNG ĐÈN CHAI AQUAFINA TÊN LỬA"
      position={position}
      color="#00ffff"
      onInteract={launchBottle}
    >
      <group position={[0, bottleY.current, 0]}>
        {/* Transparent bottle body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.75, 16]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.8}
            opacity={0.85}
            transparent
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        {/* Bottle neck & blue cap */}
        <mesh position={[0, 0.44, 0]}>
          <coneGeometry args={[0.22, 0.18, 16]} />
          <meshPhysicalMaterial color="#e0f2fe" transmission={0.7} transparent roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Cheap fairy lights tangled inside */}
        <mesh position={[0, 0, 0]}>
          <dodecahedronGeometry args={[0.14]} />
          <meshBasicMaterial color={launched ? '#ff0055' : '#00ffff'} />
        </mesh>
        {/* Rocket thrust flame when launched */}
        {launched && (
          <group position={[0, -0.6, 0]}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.2, 0.6, 8]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
          </group>
        )}
      </group>
    </BaseHangingLantern>
  );
}

// 4. CARDBOARD BOX LANTERN ("FINAL_FINAL_v7", one flap opens)
export function CardboardBoxLantern({ position }: { position: [number, number, number] }) {
  const isOpen = useGameStore((s) => s.boxLanternOpen);
  const toggleBox = useGameStore((s) => s.openCardboardBox);

  return (
    <BaseHangingLantern
      id="cardboard_box"
      name="LỒNG ĐÈN THÙNG CARTON FINAL_v7"
      position={position}
      color="#f59e0b"
      onInteract={toggleBox}
    >
      <group>
        {/* Box body */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        {/* Handwritten text */}
        <Text
          position={[0, 0, 0.355]}
          fontSize={0.085}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          FINAL_FINAL_v7
        </Text>
        <Text
          position={[0, -0.15, 0.355]}
          fontSize={0.055}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
        >
          (Bản in thật lần cuối)
        </Text>
        {/* Falling flap */}
        <group position={[0, 0.3, 0.35]} rotation={[isOpen ? 1.6 : 0.2, 0, 0]}>
          <mesh position={[0, 0, 0.15]}>
            <boxGeometry args={[0.68, 0.02, 0.3]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
        </group>
        {/* Inner bulb glow */}
        <pointLight color="#f59e0b" intensity={2} distance={3} />
      </group>
    </BaseHangingLantern>
  );
}

// 5. INSTANT NOODLE LANTERN (Hao Hao cup with glowing noodles & steam particles)
export function InstantNoodleLantern({ position }: { position: [number, number, number] }) {
  const eatNoodles = useGameStore((s) => s.eatInstantNoodles);
  const steamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!steamRef.current) return;
    const time = state.clock.getElapsedTime();
    steamRef.current.children.forEach((child, i) => {
      child.position.y = 0.45 + ((time * 0.4 + i * 0.3) % 0.6);
      const scale = 0.5 + Math.sin(time * 3 + i) * 0.3;
      child.scale.set(scale, scale, scale);
    });
  });

  return (
    <BaseHangingLantern
      id="noodles"
      name="LỒNG ĐÈN MÌ TÔM HẢO HẢO"
      position={position}
      color="#ef4444"
      onInteract={eatNoodles}
    >
      <group>
        {/* Pink Hao Hao noodle cup */}
        <mesh castShadow>
          <cylinderGeometry args={[0.34, 0.24, 0.65, 18]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.4} />
        </mesh>
        {/* Cup Rim */}
        <mesh position={[0, 0.33, 0]}>
          <torusGeometry args={[0.34, 0.02, 8, 18]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Yellow wavy curly noodles glowing inside */}
        <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.6} />
        </mesh>
        {/* Hao Hao label */}
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          HẢO HẢO
        </Text>
        <Text
          position={[0, -0.14, 0.3]}
          fontSize={0.055}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
        >
          TÔM CHUA CAY DEV
        </Text>

        {/* Steam particles */}
        <group ref={steamRef}>
          {[-0.1, 0, 0.1].map((x, i) => (
            <mesh key={i} position={[x, 0.45 + i * 0.15, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
            </mesh>
          ))}
        </group>
      </group>
    </BaseHangingLantern>
  );
}

// 6. KEYBOARD LANTERN (Vertical keyboard, rainbow RGB gaming animation, typing ASDFGHJK)
export function KeyboardLantern({ position }: { position: [number, number, number] }) {
  const triggerRGB = useGameStore((s) => s.triggerKeyboardRGB);
  const lastTyped = useGameStore((s) => s.lastTypedKeys);
  const keysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!keysRef.current) return;
    const time = state.clock.getElapsedTime();
    keysRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && 'color' in mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        // Rainbow wave across keyboard
        const hue = (time * 0.5 + i * 0.08) % 1;
        mat.color.setHSL(hue, 1, 0.6);
        mat.emissive.setHSL(hue, 1, 0.4);
      }
    });
  });

  return (
    <BaseHangingLantern
      id="keyboard"
      name="LỒNG ĐÈN BÀN PHÍM CƠ RGB"
      position={position}
      color="#06b6d4"
      onInteract={triggerRGB}
    >
      <group>
        {/* Keyboard base plate */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 1.2, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Keycaps grid */}
        <group ref={keysRef} position={[0, 0, 0.055]}>
          {Array.from({ length: 18 }).map((_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = (col - 1) * 0.14;
            const y = (row - 2.5) * 0.18;
            return (
              <mesh key={i} position={[x, y, 0]}>
                <boxGeometry args={[0.11, 0.13, 0.04]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.4} />
              </mesh>
            );
          })}
        </group>

        {/* Display typing text */}
        <group position={[0, -0.68, 0]}>
          <Text
            fontSize={0.09}
            color="#22d3ee"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {lastTyped || 'ASDFGHJK'}
          </Text>
        </group>
      </group>
    </BaseHangingLantern>
  );
}

// 7. BEAUTY LANTERN (Makeup brushes, lipstick, pink sparkles, beauty filter: 280%)
export function BeautyLantern({ position }: { position: [number, number, number] }) {
  const triggerBeauty = useGameStore((s) => s.triggerBeautyFilter);
  const sparklesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!sparklesRef.current) return;
    const time = state.clock.getElapsedTime();
    sparklesRef.current.rotation.y = time * 0.8;
  });

  return (
    <BaseHangingLantern
      id="beauty"
      name="LỒNG ĐÈN BEAUTY FILTER 280%"
      position={position}
      color="#ec4899"
      onInteract={triggerBeauty}
    >
      <group>
        {/* Center glowing pink heart / sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#f472b6" emissive="#db2777" emissiveIntensity={0.8} />
        </mesh>

        {/* Lipstick cylinder 1 */}
        <group position={[-0.26, 0, 0]} rotation={[0, 0, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.35, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.18, 10]} />
            <meshStandardMaterial color="#e11d48" roughness={0.2} />
          </mesh>
        </group>

        {/* Makeup Brush 2 */}
        <group position={[0.26, 0, 0]} rotation={[0, 0, -0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.1, 0.22, 10]} />
            <meshStandardMaterial color="#f472b6" roughness={0.8} />
          </mesh>
        </group>

        {/* Orbiting sparkles */}
        <group ref={sparklesRef}>
          {[0, 2, 4].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.5, Math.sin(angle) * 0.3, Math.sin(angle) * 0.5]}
            >
              <octahedronGeometry args={[0.06]} />
              <meshBasicMaterial color="#fbcfe8" />
            </mesh>
          ))}
        </group>

        <Text
          position={[0, -0.45, 0]}
          fontSize={0.08}
          color="#f472b6"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          FILTER: 280%
        </Text>
      </group>
    </BaseHangingLantern>
  );
}

// 8. PRINTER LANTERN (Office printer suspended from rope, randomly printing paper tickets)
export function PrinterLantern({ position }: { position: [number, number, number] }) {
  const printPaper = useGameStore((s) => s.printOfficePaper);
  const papers = useGameStore((s) => s.printerPapers);

  return (
    <BaseHangingLantern
      id="printer"
      name="LỒNG ĐÈN MÁY IN CANON 2900"
      position={position}
      color="#38bdf8"
      onInteract={printPaper}
    >
      <group>
        {/* Printer chassis */}
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.45, 0.55]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
        {/* Paper feeder tray top */}
        <mesh position={[0, 0.28, -0.15]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.45, 0.35, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>
        {/* Front output slot */}
        <mesh position={[0, -0.05, 0.28]}>
          <boxGeometry args={[0.48, 0.08, 0.02]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Canon 2900 legendary text */}
        <Text
          position={[0, 0.12, 0.28]}
          fontSize={0.07}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          CANON LBP 2900
        </Text>
        <Text
          position={[0, -0.16, 0.28]}
          fontSize={0.05}
          color="#dc2626"
          anchorX="center"
          anchorY="middle"
        >
          KẸT GIẤY LIÊN TỤC
        </Text>

        {/* Paper coming out */}
        <mesh position={[0, -0.05, 0.4]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[0.4, 0.25]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* Falling printed sheets */}
        {papers.map((p) => (
          <group key={p.id} position={[p.x - position[0], p.y - position[1], p.z - position[2]]}>
            <mesh rotation={[-Math.PI / 2, 0, Math.random()]}>
              <planeGeometry args={[0.26, 0.16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Text
              position={[0, 0.01, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.045}
              color="#dc2626"
              anchorX="center"
              anchorY="middle"
            >
              {p.text}
            </Text>
          </group>
        ))}
      </group>
    </BaseHangingLantern>
  );
}

// Group of all 8 DIY Lanterns positioned naturally throughout the alley and market
export function DIYLanterns() {
  return (
    <group>
      {/* 1. Salonpas in Alley Entrance section */}
      <SalonpasLantern position={[-2.8, 2.2, 10.5]} />

      {/* 2. Beer Can in Alley */}
      <BeerCanLantern position={[2.8, 2.3, 7.0]} />

      {/* 3. Water Bottle in Alley */}
      <WaterBottleLantern position={[-2.6, 2.2, 4.0]} />

      {/* 4. Cardboard Box in Market Entrance */}
      <CardboardBoxLantern position={[2.7, 2.3, 1.2]} />

      {/* 5. Instant Noodle in Market */}
      <InstantNoodleLantern position={[-2.8, 2.2, -1.8]} />

      {/* 6. Keyboard in Market */}
      <KeyboardLantern position={[2.6, 2.4, -4.5]} />

      {/* 7. Beauty Lantern in Market Courtyard transition */}
      <BeautyLantern position={[-3.2, 2.3, -7.5]} />

      {/* 8. Printer Lantern in Courtyard */}
      <PrinterLantern position={[3.2, 2.2, -9.5]} />
    </group>
  );
}
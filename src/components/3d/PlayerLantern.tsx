import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useGameStore } from '../../stores/useGameStore';

export function PlayerLantern() {
  const imageData = useGameStore((s) => s.personalLanternImage);
  const equipped = useGameStore((s) => s.playerHasLanternEquipped);
  const lit = useGameStore((s) => s.personalLanternLit);
  const shape = useGameStore((s) => s.personalLanternShapeMode);
  const lanternText = useGameStore((s) => s.personalLanternText);
  const carryRef = useRef<THREE.Group>(null);
  const swingRef = useRef<THREE.Group>(null);
  const attackProgress = useRef(0);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const attackTrigger = useGameStore((s) => s.lanternAttackTrigger);

  useEffect(() => {
    if (!imageData) {
      setTexture((old) => {
        old?.dispose();
        return null;
      });
      return;
    }
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load(imageData, (next) => {
      if (!alive) {
        next.dispose();
        return;
      }
      next.colorSpace = THREE.SRGBColorSpace;
      next.minFilter = THREE.LinearFilter;
      setTexture((old) => {
        old?.dispose();
        return next;
      });
    });
    return () => {
      alive = false;
    };
  }, [imageData]);

  useEffect(() => {
    if (attackTrigger > 0) attackProgress.current = 1;
  }, [attackTrigger]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (swingRef.current) {
      swingRef.current.rotation.z = Math.sin(t * 4.2) * 0.055;
      swingRef.current.rotation.x = Math.cos(t * 3.2) * 0.025;
    }

    if (carryRef.current) {
      if (attackProgress.current > 0) {
        attackProgress.current = Math.max(0, attackProgress.current - delta * 4.2);
        const swing = Math.sin((1 - attackProgress.current) * Math.PI);
        carryRef.current.rotation.y = -0.55 + swing * 1.7;
        carryRef.current.rotation.z = -swing * 0.45;
      } else {
        carryRef.current.rotation.y = 0;
        carryRef.current.rotation.z = 0;
      }
    }
  });

  if (!equipped || (!imageData && !lanternText.trim())) return null;

  const bodySize: [number, number, number] =
    shape === 'portrait' ? [0.52, 0.78, 0.12] :
    shape === 'wide' ? [0.86, 0.5, 0.12] :
    [0.66, 0.66, 0.12];

  const imageSize: [number, number] =
    shape === 'portrait' ? [0.43, 0.67] :
    shape === 'wide' ? [0.75, 0.4] :
    [0.56, 0.56];

  return (
    <group ref={carryRef} position={[0.48, 0.72, 0.12]}>
      {/* bamboo handle */}
      <mesh position={[0.14, 0.48, 0]} rotation={[0, 0, -0.45]}>
        <cylinderGeometry args={[0.016, 0.021, 1.35, 7]} />
        <meshStandardMaterial color="#a98942" roughness={0.9} />
      </mesh>

      <mesh position={[0.48, 0.65, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.82, 5]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.9} />
      </mesh>

      <group ref={swingRef} position={[0.48, 0.16, 0]}>
        {/* body silhouette changes with uploaded image orientation */}
        <mesh>
          <boxGeometry args={bodySize} />
          <meshStandardMaterial
            color={lit ? '#d9a84d' : '#9b7442'}
            emissive={lit ? '#f59e0b' : '#000000'}
            emissiveIntensity={lit ? 0.42 : 0}
            roughness={0.82}
          />
        </mesh>

        <mesh position={[0, 0, 0.066]}>
          <planeGeometry args={imageSize} />
          <meshStandardMaterial
            map={texture ?? undefined}
            color={texture ? '#ffffff' : '#ead9b7'}
            emissive={lit ? '#ffffff' : '#000000'}
            emissiveMap={lit && texture ? texture : undefined}
            emissiveIntensity={lit ? 0.28 : 0}
            roughness={0.72}
          />
        </mesh>

        {lanternText.trim() && (
          <group position={[0, -bodySize[1]*0.18, 0.085]}>
            <mesh>
              <planeGeometry args={[bodySize[0]*0.92, Math.min(0.32, bodySize[1]*0.38)]} />
              <meshBasicMaterial color="#111827" transparent opacity={0.76} />
            </mesh>
            <Text
              position={[0,0,0.01]}
              fontSize={0.07}
              maxWidth={bodySize[0]*0.8}
              textAlign="center"
              color="#fff7d6"
              anchorX="center"
              anchorY="middle"
            >
              {lanternText}
            </Text>
          </group>
        )}

        {attackProgress.current > 0 && (
          <mesh position={[0.25,0,0]} rotation={[0,0,Math.PI/2]}>
            <torusGeometry args={[0.72,0.035,6,18,Math.PI*0.75]} />
            <meshBasicMaterial color="#fff3b0" transparent opacity={0.48} />
          </mesh>
        )}

        {/* simple LED frame */}
        {[
          [-bodySize[0] / 2, bodySize[1] / 2],
          [0, bodySize[1] / 2],
          [bodySize[0] / 2, bodySize[1] / 2],
          [-bodySize[0] / 2, -bodySize[1] / 2],
          [0, -bodySize[1] / 2],
          [bodySize[0] / 2, -bodySize[1] / 2],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.08]}>
            <sphereGeometry args={[0.023, 5, 5]} />
            <meshStandardMaterial
              color={lit ? '#fff3b0' : '#66593e'}
              emissive={lit ? '#ffc857' : '#000000'}
              emissiveIntensity={lit ? 2.1 : 0}
            />
          </mesh>
        ))}

        <mesh position={[0, -bodySize[1] / 2 - 0.2, 0]}>
          <coneGeometry args={[0.065, 0.28, 7]} />
          <meshStandardMaterial color="#dc2626" roughness={0.85} />
        </mesh>

        {lit && <pointLight color="#ffd166" intensity={1.4} distance={3.2} decay={2} />}
      </group>
    </group>
  );
}
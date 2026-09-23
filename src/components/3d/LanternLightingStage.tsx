import { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function LanternLightingStage() {
  const imageData = useGameStore((s) => s.personalLanternImage);
  const built = useGameStore((s) => s.personalLanternBuilt);
  const lit = useGameStore((s) => s.personalLanternLit);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!imageData) {
      setTexture((old) => {
        old?.dispose();
        return null;
      });
      return;
    }

    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(imageData, (next) => {
      if (!active) {
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
      active = false;
    };
  }, [imageData]);

  return (
    <group position={[5.5, 0, -14.0]}>
      {/* low presentation pedestal */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.62, 0.36, 24]} />
        <meshStandardMaterial color="#d8c6ad" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.15, 1.28, 0.1, 24]} />
        <meshStandardMaterial color="#f0ede5" roughness={0.62} />
      </mesh>

      <Text
        position={[0, 0.62, 0.95]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.11}
        color={built ? (lit ? '#fef3c7' : '#7c2d12') : '#64748b'}
        anchorX="center"
        anchorY="middle"
      >
        {built ? (lit ? '✨ ĐÈN CỦA BẠN ĐÃ SÁNG' : '[E] THẮP SÁNG LỒNG ĐÈN') : 'LÀM LỒNG ĐÈN Ở WORKSHOP TRƯỚC'}
      </Text>

      {built && (
        <group position={[0, 1.65, 0]}>
          {/* bamboo hanger and red suspension */}
          <mesh position={[-0.6, 0.92, 0]} rotation={[0, 0, -0.62]} castShadow>
            <cylinderGeometry args={[0.02, 0.026, 1.8, 8]} />
            <meshStandardMaterial color="#b68a45" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 1.0, 5]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.94} />
          </mesh>

          {/* photo lantern body */}
          <group rotation={[0, 0.08, -0.025]}>
            <mesh castShadow>
              <boxGeometry args={[1.15, 0.92, 0.28]} />
              <meshStandardMaterial
                color={lit ? '#efb84f' : '#b18453'}
                emissive={lit ? '#f59e0b' : '#000000'}
                emissiveIntensity={lit ? 0.6 : 0}
                roughness={0.82}
              />
            </mesh>

            <mesh position={[0, 0, 0.146]}>
              <planeGeometry args={[0.96, 0.73]} />
              {texture ? (
                <meshStandardMaterial
                  map={texture}
                  emissive={lit ? '#ffffff' : '#000000'}
                  emissiveMap={lit ? texture : undefined}
                  emissiveIntensity={lit ? 0.35 : 0}
                  roughness={0.72}
                />
              ) : (
                <meshStandardMaterial color="#f4ead7" roughness={0.8} />
              )}
            </mesh>

            {/* visible wire + bulbs */}
            <mesh rotation={[0.2, 0.5, 0.05]}>
              <torusGeometry args={[0.57, 0.008, 6, 28]} />
              <meshStandardMaterial color="#74562f" roughness={0.95} />
            </mesh>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 0.58, Math.sin(a) * 0.45, 0.18]}>
                  <sphereGeometry args={[0.027, 6, 6]} />
                  <meshStandardMaterial
                    color={lit ? '#fff5bf' : '#6b5d42'}
                    emissive={lit ? '#ffc94d' : '#000000'}
                    emissiveIntensity={lit ? 2.8 : 0}
                    roughness={0.28}
                  />
                </mesh>
              );
            })}

            <mesh position={[0, -0.72, 0]}>
              <coneGeometry args={[0.085, 0.38, 8]} />
              <meshStandardMaterial color="#dc2626" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <torusGeometry args={[0.07, 0.018, 6, 12]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.72} />
            </mesh>

            {lit && <pointLight color="#ffbf47" intensity={4.4} distance={7} decay={2} />}
          </group>
        </group>
      )}

      {lit && (
        <>
          <pointLight position={[0, 2.1, 0]} color="#ffd778" intensity={1.8} distance={9} decay={2} />
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            const r = 1.0 + (i % 3) * 0.24;
            return (
              <mesh key={i} position={[Math.cos(a) * r, 1.0 + (i % 5) * 0.22, Math.sin(a) * r]}>
                <octahedronGeometry args={[0.035]} />
                <meshBasicMaterial color={i % 2 ? '#ffe08a' : '#fff7d1'} />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
}

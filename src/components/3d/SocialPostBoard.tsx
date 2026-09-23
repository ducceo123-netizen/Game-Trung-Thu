import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { UID_SOCIAL_POST_DATA_URL } from '../../assets/uidSocialPost';

export const SOCIAL_POST_POSITION: [number, number, number] = [-2.2, 0, -5.6];

export function SocialPostBoard() {
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(UID_SOCIAL_POST_DATA_URL);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    return t;
  }, []);

  return (
    <group position={SOCIAL_POST_POSITION} rotation={[0, 0.28, 0]}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[1.15, 0.08, 0.62]} />
        <meshStandardMaterial color="#d8d8d2" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.48, -0.08]}>
        <boxGeometry args={[0.07, 2.7, 0.07]} />
        <meshStandardMaterial color="#8b8b87" metalness={0.35} roughness={0.45} />
      </mesh>

      <mesh position={[0, 1.62, 0]} castShadow>
        <boxGeometry args={[1.84, 2.52, 0.08]} />
        <meshStandardMaterial color="#f4efe7" roughness={0.82} />
      </mesh>

      <mesh position={[0, 1.62, 0.047]}>
        <planeGeometry args={[1.68, 2.34]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <group position={[0, 3.0, 0.045]}>
        <mesh>
          <planeGeometry args={[1.78, 0.32]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        <Text
          position={[0, 0.01, 0.01]}
          fontSize={0.08}
          color="#fff7ed"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          UID SOCIAL CHECK-IN • BẤM E
        </Text>
      </group>

      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.66, 0.9, 24]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

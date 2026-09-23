import { useEffect, useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UID_SOCIAL_POST_DATA_URL } from '../../assets/uidSocialPost';
import { useSocialScreenStore } from '../../stores/useSocialScreenStore';
import { useGameStore } from '../../stores/useGameStore';

export const SOCIAL_POST_POSITION: [number, number, number] = [-2.2, 0, -5.6];

function loadTexture(source: string, onDone: (texture: THREE.Texture) => void) {
  const loader = new THREE.TextureLoader();
  loader.load(source, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    onDone(texture);
  });
}

export function SocialPostBoard() {
  const posts = useSocialScreenStore((s) => s.posts);
  const init = useSocialScreenStore((s) => s.init);
  const openSocialPost = useGameStore((s) => s.openSocialPost);
  const [index, setIndex] = useState(0);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const transition = useRef(0);
  const transitioning = useRef(false);
  const swapped = useRef(false);
  const nextIndex = useRef(0);

  const sources = posts.length > 0
    ? posts.map((post) => post.image_data)
    : [UID_SOCIAL_POST_DATA_URL];

  const safeIndex = Math.min(index, Math.max(0, sources.length - 1));
  const source = sources[safeIndex] ?? UID_SOCIAL_POST_DATA_URL;

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    let alive = true;
    loadTexture(source, (next) => {
      if (!alive) {
        next.dispose();
        return;
      }
      setTexture((old) => {
        old?.dispose();
        return next;
      });
    });
    return () => {
      alive = false;
    };
  }, [source]);

  useEffect(() => {
    const material = screenMat.current;
    if (!material) return;
    material.map = texture;
    material.color.set(texture ? '#ffffff' : '#111827');
    material.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    if (sources.length <= 1) return;
    const timer = window.setInterval(() => {
      if (transitioning.current) return;
      nextIndex.current = (safeIndex + 1) % sources.length;
      transition.current = 0;
      swapped.current = false;
      transitioning.current = true;
    }, 7500);
    return () => window.clearInterval(timer);
  }, [safeIndex, sources.length]);

  useEffect(() => {
    if (safeIndex !== index) setIndex(safeIndex);
  }, [safeIndex, index]);

  useFrame((_, delta) => {
    const material = screenMat.current;
    if (!material) return;

    if (!transitioning.current) {
      material.opacity = THREE.MathUtils.lerp(material.opacity, 1, Math.min(1, delta * 8));
      return;
    }

    transition.current += delta / 1.8;
    const p = Math.min(1, transition.current);

    if (p < 0.5) {
      material.opacity = 1 - p * 2;
    } else {
      if (!swapped.current) {
        swapped.current = true;
        setIndex(nextIndex.current);
      }
      material.opacity = (p - 0.5) * 2;
    }

    if (p >= 1) {
      material.opacity = 1;
      transitioning.current = false;
    }
  });

  const currentOwner = posts.length > 0
    ? posts[safeIndex]?.player_name ?? 'UIDer'
    : '@UnityInDiversity';

  return (
    <group position={SOCIAL_POST_POSITION} rotation={[0, 0.28, 0]}>
      {/* freestanding digital screen */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[1.35, 0.09, 0.72]} />
        <meshStandardMaterial color="#2f3438" metalness={0.45} roughness={0.4} />
      </mesh>

      <mesh position={[0, 1.45, -0.09]}>
        <boxGeometry args={[0.09, 2.55, 0.09]} />
        <meshStandardMaterial color="#444b50" metalness={0.55} roughness={0.32} />
      </mesh>

      <mesh position={[0, 1.68, 0]} castShadow>
        <boxGeometry args={[2.25, 2.72, 0.16]} />
        <meshStandardMaterial color="#171a1d" metalness={0.38} roughness={0.35} />
      </mesh>

      <mesh position={[0, 1.68, 0.086]} onClick={(e)=>{e.stopPropagation();openSocialPost();}}>
        <planeGeometry args={[2.02, 2.43]} />
        <meshBasicMaterial
          ref={screenMat}
          map={texture ?? undefined}
          color={texture ? '#ffffff' : '#111827'}
          transparent
          opacity={1}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position={[0, 3.18, 0.08]}>
        <mesh>
          <planeGeometry args={[2.28, 0.38]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        <Text
          position={[0, 0.05, 0.01]}
          fontSize={0.095}
          color="#fff7ed"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          UID SOCIAL SCREEN • CLICK / E • UP ẢNH
        </Text>
        <Text
          position={[0, -0.09, 0.01]}
          fontSize={0.055}
          color="#ffedd5"
          anchorX="center"
          anchorY="middle"
        >
          {posts.length > 1 ? `${safeIndex + 1}/${posts.length} • ${currentOwner}` : currentOwner}
        </Text>
      </group>

      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 1.0, 24]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}
import { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../stores/useGameStore';

export function LanternWorkshop() {
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
    <group position={[-3.35, 0, -12.6]}>
      {/* Quầy làm lồng đèn */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.12, 1.15]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.88} />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 0.35, 0]} castShadow>
          <boxGeometry args={[0.12, 0.7, 0.9]} />
          <meshStandardMaterial color="#6b4423" roughness={0.9} />
        </mesh>
      ))}

      {/* Bảng chỉ dẫn tại quầy */}
      <group position={[0, 2.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.15, 0.95, 0.08]} />
          <meshStandardMaterial color="#f7d154" roughness={0.72} />
        </mesh>
        <Text position={[0, 0.16, 0.05]} fontSize={0.2} color="#541b10" anchorX="center" anchorY="middle" fontWeight="bold">
          QUẦY LÀM LỒNG ĐÈN
        </Text>
        <Text position={[0, -0.18, 0.05]} fontSize={0.105} color="#7c2d12" anchorX="center" anchorY="middle">
          ĐI TỚI GẦN • BẤM E • UP ẢNH CỦA BẠN
        </Text>
      </group>

      {/* Vật liệu DIY trên bàn */}
      <mesh position={[-0.85, 0.88, 0.1]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.32]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
      <mesh position={[0.78, 0.93, 0.05]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.05, 0.05, 0.62, 8]} />
        <meshStandardMaterial color="#84a83d" roughness={0.8} />
      </mesh>
      <mesh position={[0.42, 0.88, -0.1]}>
        <boxGeometry args={[0.38, 0.16, 0.28]} />
        <meshStandardMaterial color="#dc2626" roughness={0.65} />
      </mesh>

      {/* Lồng đèn cá nhân xuất hiện sau khi làm xong */}
      {built && (
        <group position={[0, 1.55, -0.05]} rotation={[0, 0.08, -0.025]}>
          {/* Dây treo */}
          <mesh position={[0, 0.58, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.8, 5]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.9} />
          </mesh>

          {/* Thân lồng đèn dạng hộp carton DIY */}
          <mesh castShadow>
            <boxGeometry args={[1.05, 0.78, 0.22]} />
            <meshStandardMaterial
              color={lit ? '#f59e0b' : '#9a6a3a'}
              emissive={lit ? '#ff9f1c' : '#000000'}
              emissiveIntensity={lit ? 0.85 : 0}
              roughness={0.82}
            />
          </mesh>

          {/* Ảnh user làm mặt chính */}
          <mesh position={[0, 0, 0.116]}>
            <planeGeometry args={[0.88, 0.62]} />
            {texture ? (
              <meshStandardMaterial
                map={texture}
                emissive={lit ? '#ffffff' : '#000000'}
                emissiveMap={lit ? texture : undefined}
                emissiveIntensity={lit ? 0.45 : 0}
                roughness={0.75}
              />
            ) : (
              <meshStandardMaterial color="#f5e7c8" roughness={0.8} />
            )}
          </mesh>

          {/* Dây LED quấn quanh */}
          {Array.from({ length: 14 }).map((_, i) => {
            const t = i / 14;
            const a = t * Math.PI * 2;
            const x = Math.cos(a) * 0.55;
            const y = Math.sin(a) * 0.38;
            return (
              <mesh key={i} position={[x, y, 0.14]}>
                <sphereGeometry args={[0.026, 6, 6]} />
                <meshStandardMaterial
                  color={lit ? '#fff1a8' : '#6b5a35'}
                  emissive={lit ? '#ffc83d' : '#000000'}
                  emissiveIntensity={lit ? 2.8 : 0}
                />
              </mesh>
            );
          })}

          {/* Tua rua đỏ */}
          <mesh position={[0, -0.62, 0]}>
            <coneGeometry args={[0.08, 0.34, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.72} />
          </mesh>

          {lit && <pointLight color="#ffbf47" intensity={3.2} distance={5.5} decay={2} />}
        </group>
      )}

      <Text
        position={[0, 0.18, 0.64]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.11}
        color={built ? (lit ? '#fde68a' : '#fb923c') : '#e2e8f0'}
        anchorX="center"
        anchorY="middle"
      >
        {built ? (lit ? '✨ ĐÃ THẮP SÁNG' : 'BẤM E ĐỂ THẮP SÁNG') : 'UP ẢNH → LÀM LỒNG ĐÈN'}
      </Text>
    </group>
  );
}

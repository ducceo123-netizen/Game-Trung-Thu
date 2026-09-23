import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Atmosphere } from './Atmosphere';
import { Environment } from './Environment';
import { DIYLanterns } from './DIYLanterns';
import { QuestCollectibles } from './QuestCollectibles';
import { SecurityGuardNPC, VacuumRidingRabbit, HidingRabbit } from './NPCs';
import { MoonServer } from './MoonServer';
import { Player } from './Player';
import { LanternWorkshop } from './LanternWorkshop';
import { LanternLightingStage } from './LanternLightingStage';
import { useGameStore } from '../../stores/useGameStore';

export function GameScene() {
  const moonOnline = useGameStore((s) => s.moonOnline);
  const isBeautyMode = useGameStore((s) => s.isBeautyMode);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas
        dpr={[1, 1.25]}
        shadows={false}
        camera={{ position: [0, 5, 20], fov: 50, near: 0.1, far: 70 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            {/* Atmosphere (Night fog, dust particles, fireflies) */}
            <Atmosphere />

            {/* Ambient Base Light */}
            <ambientLight
              color={isBeautyMode ? '#f472b6' : '#1e293b'}
              intensity={moonOnline ? 1.0 : 0.72}
            />

            {/* Moon Directional Key Light */}
            <directionalLight
              position={[8, 22, -15]}
              intensity={moonOnline ? 2.2 : 1.15}
              color={moonOnline ? '#fff7e6' : '#f3f4f6'}
            />

            {/* Neutral office fill + restrained warm lantern accent */}
            <hemisphereLight args={['#f7f5ee', '#8b8c86', 0.95]} />
            <directionalLight
              position={[-10, 10, 10]}
              intensity={0.35}
              color="#ffd6a1"
            />

            {/* 3D World Environment (Buildings, Corridors, Props, Signs) */}
            <Environment />

            {/* The 8 Ridiculous DIY Trash Lanterns */}
            <DIYLanterns />

            {/* The 3 Glowing Mid-Autumn Quest Collectibles */}
            <QuestCollectibles />

            {/* Security Guard NPC near Entrance */}
            <SecurityGuardNPC position={[2.2, 0, 12]} />

            {/* Rabbits (Vacuum riding, Hiding behind boxes) */}
            <VacuumRidingRabbit />
            <HidingRabbit position={[6.2, 0.5, 5.7]} />

            {/* Walk-up workshop: upload a photo and turn it into a DIY lantern */}
            <LanternWorkshop />

            {/* Dedicated presentation area where the finished lantern is lit */}
            <LanternLightingStage />

            {/* The Moon & The Trạm Phát Trăng Machine */}
            <MoonServer />

            {/* Low-Poly Player Controller */}
            <Player />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
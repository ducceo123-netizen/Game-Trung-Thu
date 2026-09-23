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
import { useGameStore } from '../../stores/useGameStore';

export function GameScene() {
  const moonOnline = useGameStore((s) => s.moonOnline);
  const isBeautyMode = useGameStore((s) => s.isBeautyMode);

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas
        shadows
        camera={{ position: [0, 5, 20], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            {/* Atmosphere (Night fog, dust particles, fireflies) */}
            <Atmosphere />

            {/* Ambient Base Light */}
            <ambientLight
              color={isBeautyMode ? '#f472b6' : '#1e293b'}
              intensity={moonOnline ? 0.9 : 0.4}
            />

            {/* Moon Directional Key Light */}
            <directionalLight
              position={[8, 22, -15]}
              intensity={moonOnline ? 2.5 : 0.8}
              color={moonOnline ? '#fffbeb' : '#38bdf8'}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={60}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
            />

            {/* Secondary warm rim light for lanterns */}
            <directionalLight
              position={[-10, 10, 10]}
              intensity={0.5}
              color="#f97316"
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
            <HidingRabbit position={[-4.0, 0.5, 11]} />

            {/* Walk-up workshop: upload a photo and turn it into a DIY lantern */}
            <LanternWorkshop />

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
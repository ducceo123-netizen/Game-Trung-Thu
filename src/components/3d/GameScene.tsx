import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Atmosphere } from './Atmosphere';
import { Environment } from './Environment';
import { DIYLanterns } from './DIYLanterns';
import { QuestCollectibles } from './QuestCollectibles';
import { SecurityGuardNPC } from './NPCs';
import { Player } from './Player';
import { LanternWorkshop } from './LanternWorkshop';
import { Floor3Halloween } from './Floor3Halloween';
import { BooGhost } from './BooGhost';
import { MultiplayerPlayers } from './MultiplayerPlayers';
import { SocialPostBoard } from './SocialPostBoard';
import { WorldMooncakes } from './WorldMooncakes';
import { ItemShop } from './ItemShop';
import { AnhKhoeNPC } from './AnhKhoeNPC';
import { useGameStore } from '../../stores/useGameStore';

export function GameScene() {
  const moonOnline = useGameStore((s) => s.moonOnline);
  const isBeautyMode = useGameStore((s) => s.isBeautyMode);
  const currentFloor = useGameStore((s) => s.currentFloor);

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
            {currentFloor === 2 ? (
              <>
                <Atmosphere />
                <ambientLight
                  color={isBeautyMode ? '#f472b6' : '#293241'}
                  intensity={moonOnline ? 0.9 : 0.72}
                />
                <hemisphereLight args={['#f7f5ee', '#8b8c86', 0.9]} />
                <directionalLight position={[8, 16, -10]} intensity={1.0} color="#fff7e6" />

                <Environment />
                <DIYLanterns />
                <QuestCollectibles />
                <SecurityGuardNPC position={[2.2, 0, 12]} />
                <AnhKhoeNPC />
                <ItemShop />
                <SocialPostBoard />
                <LanternWorkshop />
              </>
            ) : (
              <>
                <Floor3Halloween />
                <BooGhost />
              </>
            )}

            {/* Shared currency drops can exist on either floor */}
            <WorldMooncakes />

            {/* Realtime remote players + local player persist while changing floors */}
            <MultiplayerPlayers />
            <Player />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
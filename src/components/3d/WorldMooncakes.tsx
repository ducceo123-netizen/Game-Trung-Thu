import { useEffect } from 'react';
import { Text } from '@react-three/drei';
import { MULTIPLAYER_ROOM_ID, supabase } from '../../lib/supabase';
import { useEconomyStore } from '../../stores/useEconomyStore';
import { useGameStore } from '../../stores/useGameStore';

export function WorldMooncakes() {
  const cakes = useEconomyStore((s)=>s.worldMooncakes);
  const refresh = useEconomyStore((s)=>s.refreshMooncakes);
  const spawnTick = useEconomyStore((s)=>s.spawnMooncakeTick);
  const initEconomy = useEconomyStore((s)=>s.initEconomy);
  const playerName = useGameStore((s)=>s.playerName);
  const currentFloor = useGameStore((s)=>s.currentFloor);

  useEffect(()=>{
    void initEconomy(playerName);
    void spawnTick();
    const spawnTimer=window.setInterval(()=>void spawnTick(),8500);
    const channel=supabase
      .channel('uid-world-mooncakes')
      .on('postgres_changes',{
        event:'*',
        schema:'public',
        table:'world_mooncakes',
        filter:`room_id=eq.${MULTIPLAYER_ROOM_ID}`,
      },()=>void refresh())
      .subscribe();

    return ()=>{
      window.clearInterval(spawnTimer);
      void supabase.removeChannel(channel);
    };
  },[refresh,spawnTick,initEconomy,playerName]);

  return (
    <group>
      {cakes.filter((cake)=>cake.floor===currentFloor).map((cake)=>(
        <group key={cake.id} position={[cake.x,0.42,cake.z]}>
          <mesh rotation={[0,Math.PI/4,0]}>
            <cylinderGeometry args={[0.22,0.22,0.13,12]} />
            <meshStandardMaterial color={cake.source==='drop'?'#ef4444':'#d97706'} emissive={cake.source==='drop'?'#7f1d1d':'#78350f'} emissiveIntensity={0.35} roughness={0.75} />
          </mesh>
          <mesh position={[0,0.075,0]} rotation={[-Math.PI/2,0,0]}>
            <ringGeometry args={[0.06,0.13,10]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <Text position={[0,0.48,0]} fontSize={0.08} color="#fff7d6" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#7c2d12">
            {cake.source==='drop'?'BÁNH RƠI TỪ NGƯỜI CHƠI':'BÁNH TRUNG THU'}
          </Text>
        </group>
      ))}
    </group>
  );
}
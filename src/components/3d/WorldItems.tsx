import { useEffect } from 'react';
import { Text } from '@react-three/drei';
import { MULTIPLAYER_ROOM_ID, supabase } from '../../lib/supabase';
import { useEconomyStore, type ShopItemId } from '../../stores/useEconomyStore';
import { useGameStore } from '../../stores/useGameStore';

function ItemMesh({ item }: { item: ShopItemId }) {
  if(item==='sword') return (
    <group rotation={[0,0,-0.8]}>
      <mesh position={[0,0.25,0]}><boxGeometry args={[0.05,0.65,0.05]}/><meshStandardMaterial color="#dbeafe" emissive="#60a5fa" emissiveIntensity={0.45} metalness={0.7}/></mesh>
      <mesh position={[0,-0.1,0]}><boxGeometry args={[0.22,0.06,0.08]}/><meshStandardMaterial color="#f59e0b"/></mesh>
    </group>
  );
  if(item==='blaster') return (
    <group>
      <mesh><boxGeometry args={[0.5,0.16,0.14]}/><meshStandardMaterial color="#111827" metalness={0.4}/></mesh>
      <mesh position={[0.14,-0.16,0]} rotation={[0,0,-0.15]}><boxGeometry args={[0.12,0.28,0.12]}/><meshStandardMaterial color="#374151"/></mesh>
    </group>
  );
  return (
    <group>
      <mesh><boxGeometry args={[0.7,0.08,0.28]}/><meshStandardMaterial color="#0f766e"/></mesh>
      {[-0.23,0.23].map(x=><mesh key={x} position={[x,-0.1,0.1]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.08,0.08,0.06,8]}/><meshStandardMaterial color="#111827"/></mesh>)}
    </group>
  );
}

const LABELS:Record<ShopItemId,string>={
  sword:'KIẾM LED',
  scooter:'XE ĐIỆN MINI',
  blaster:'BLASTER',
};

export function WorldItems() {
  const items=useEconomyStore(s=>s.worldItems);
  const refresh=useEconomyStore(s=>s.refreshWorldItems);
  const currentFloor=useGameStore(s=>s.currentFloor);

  useEffect(()=>{
    void refresh();
    const channel=supabase
      .channel('uid-world-items')
      .on('postgres_changes',{
        event:'*',schema:'public',table:'world_items',filter:`room_id=eq.${MULTIPLAYER_ROOM_ID}`
      },()=>void refresh())
      .subscribe();
    return()=>{void supabase.removeChannel(channel);};
  },[refresh]);

  return (
    <group>
      {items.filter(i=>i.floor===currentFloor).map(item=>(
        <group key={item.id} position={[item.x,0.38,item.z]}>
          <ItemMesh item={item.item_id}/>
          <mesh position={[0,-0.28,0]} rotation={[-Math.PI/2,0,0]}>
            <ringGeometry args={[0.35,0.48,20]}/>
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.4}/>
          </mesh>
          <Text position={[0,0.55,0]} fontSize={0.08} color="#cffafe" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#164e63">
            {LABELS[item.item_id]} • BẤM E NHẶT
          </Text>
        </group>
      ))}
    </group>
  );
}

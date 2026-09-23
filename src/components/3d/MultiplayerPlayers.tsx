import { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { MULTIPLAYER_PLAYER_ID, MULTIPLAYER_ROOM_ID, supabase } from '../../lib/supabase';
import { setMultiplayerChannel, type CombatAttackPayload, type SocialChatPayload } from '../../lib/multiplayerBus';
import { useGameStore, type LanternShapeMode } from '../../stores/useGameStore';
import { useEconomyStore, type ShopItemId } from '../../stores/useEconomyStore';

type RemotePlayerState = {
  id: string;
  name: string;
  floor: 1 | 2 | 3;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  lanternBuilt: boolean;
  lanternLit: boolean;
  lanternShape: LanternShapeMode;
  lanternImage: string | null;
  lanternText: string;
  equippedItem: ShopItemId | null;
  health: number;
  isDead: boolean;
  chatText: string;
  chatMeme: string | null;
  chatUntil: number;
};

function RemoteLantern({
  imageData,
  lit,
  shape,
  text,
}: {
  imageData: string | null;
  lit: boolean;
  shape: LanternShapeMode;
  text: string;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

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

  const bodySize: [number, number, number] =
    shape === 'portrait' ? [0.46, 0.68, 0.1] :
    shape === 'wide' ? [0.72, 0.43, 0.1] :
    [0.56, 0.56, 0.1];

  const imageSize: [number, number] =
    shape === 'portrait' ? [0.38, 0.58] :
    shape === 'wide' ? [0.62, 0.34] :
    [0.47, 0.47];

  return (
    <group position={[0.5, 0.92, 0.08]}>
      <mesh position={[0.12, 0.4, 0]} rotation={[0, 0, -0.45]}>
        <cylinderGeometry args={[0.014, 0.018, 1.15, 6]} />
        <meshStandardMaterial color="#a98942" roughness={0.9} />
      </mesh>
      <group position={[0.4, 0.05, 0]}>
        <mesh>
          <boxGeometry args={bodySize} />
          <meshStandardMaterial
            color={lit ? '#d9a84d' : '#906d3d'}
            emissive={lit ? '#f59e0b' : '#000000'}
            emissiveIntensity={lit ? 0.3 : 0}
            roughness={0.82}
          />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={imageSize} />
          <meshStandardMaterial
            map={texture ?? undefined}
            color={texture ? '#ffffff' : '#e4d4b4'}
            emissive={lit ? '#ffffff' : '#000000'}
            emissiveMap={lit && texture ? texture : undefined}
            emissiveIntensity={lit ? 0.2 : 0}
          />
        </mesh>
        {text.trim() && (
          <group position={[0,-bodySize[1]*0.18,0.08]}>
            <mesh><planeGeometry args={[bodySize[0]*0.92,Math.min(0.28,bodySize[1]*0.36)]}/><meshBasicMaterial color="#111827" transparent opacity={0.78}/></mesh>
            <Text position={[0,0,0.01]} fontSize={0.06} maxWidth={bodySize[0]*0.8} textAlign="center" color="#fff7d6" anchorX="center" anchorY="middle">{text}</Text>
          </group>
        )}

        <mesh position={[0, -bodySize[1] / 2 - 0.16, 0]}>
          <coneGeometry args={[0.055, 0.22, 7]} />
          <meshStandardMaterial color="#dc2626" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}


function RemoteEquipment({ item }: { item: ShopItemId | null }) {
  if (!item) return null;
  if (item === 'sword') return (
    <group position={[0.42,0.62,0.18]} rotation={[0,0,-0.55]}>
      <mesh position={[0,0.42,0]}><boxGeometry args={[0.055,0.85,0.055]}/><meshStandardMaterial color="#dbeafe" emissive="#60a5fa" emissiveIntensity={0.45} metalness={0.7}/></mesh>
      <mesh><boxGeometry args={[0.28,0.07,0.08]}/><meshStandardMaterial color="#f59e0b"/></mesh>
    </group>
  );
  if (item === 'blaster') return (
    <group position={[0.46,0.7,0.22]}>
      <mesh><boxGeometry args={[0.62,0.2,0.16]}/><meshStandardMaterial color="#111827" metalness={0.45}/></mesh>
      <mesh position={[0.18,-0.2,0]} rotation={[0,0,-0.15]}><boxGeometry args={[0.14,0.34,0.13]}/><meshStandardMaterial color="#374151"/></mesh>
    </group>
  );
  return (
    <group position={[0,-0.02,0.04]}>
      <mesh><boxGeometry args={[0.82,0.09,0.3]}/><meshStandardMaterial color="#0f766e"/></mesh>
    </group>
  );
}


function RemoteChatBubble({ text, meme }: { text: string; meme: string | null }) {
  const [texture,setTexture]=useState<THREE.Texture|null>(null);

  useEffect(()=>{
    if(!meme){
      setTexture(old=>{old?.dispose();return null;});
      return;
    }
    let alive=true;
    new THREE.TextureLoader().load(meme,next=>{
      if(!alive){next.dispose();return;}
      next.colorSpace=THREE.SRGBColorSpace;
      setTexture(old=>{old?.dispose();return next;});
    });
    return()=>{alive=false;};
  },[meme]);

  if(!text && !meme) return null;

  return (
    <group position={[0,2.55,0]}>
      <mesh>
        <planeGeometry args={[1.8,meme?1.25:0.55]}/>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.93}/>
      </mesh>
      {meme && (
        <mesh position={[0,text?0.12:0,0.012]}>
          <planeGeometry args={[1.45,0.9]}/>
          <meshBasicMaterial map={texture??undefined} color={texture?'#ffffff':'#d1d5db'}/>
        </mesh>
      )}
      {text && (
        <Text position={[0,meme?-0.48:0,0.02]} fontSize={0.11} maxWidth={1.55} color="#111827" anchorX="center" anchorY="middle" textAlign="center">
          {text}
        </Text>
      )}
    </group>
  );
}

function RemotePlayerAvatar({ player }: { player: RemotePlayerState }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3(player.x, player.y, player.z));
  const targetRot = useRef(player.rotationY);

  useEffect(() => {
    target.current.set(player.x, player.y, player.z);
    targetRot.current = player.rotationY;
  }, [player.x, player.y, player.z, player.rotationY]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.lerp(target.current, Math.min(1, delta * 12));
    let diff = targetRot.current - group.current.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    group.current.rotation.y += diff * Math.min(1, delta * 12);
  });

  const bodyRotation: [number, number, number] = player.isDead ? [0, 0, Math.PI / 2] : [0, 0, 0];

  return (
    <group ref={group} position={[player.x, player.y, player.z]} rotation={[0, player.rotationY, 0]}>
      <group rotation={bodyRotation} position={player.isDead ? [0, 0.3, 0] : [0, 0, 0]}>
        <mesh position={[-0.13, 0.25, 0]}>
          <boxGeometry args={[0.14, 0.5, 0.15]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        <mesh position={[0.13, 0.25, 0]}>
          <boxGeometry args={[0.14, 0.5, 0.15]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>

        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.48, 0.48, 0.28]} />
          <meshStandardMaterial color="#111827" roughness={0.62} />
        </mesh>
        <mesh position={[-0.31, 0.62, 0]}>
          <boxGeometry args={[0.13, 0.42, 0.14]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.31, 0.62, 0]}>
          <boxGeometry args={[0.13, 0.42, 0.14]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        <group position={[0, 0.85, 0]}>
          <mesh position={[0, 0.26, 0]}>
            <boxGeometry args={[0.42, 0.4, 0.36]} />
            <meshStandardMaterial color="#f2c879" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.47, 0]}>
            <boxGeometry args={[0.46, 0.1, 0.39]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
        </group>

        <Text
          position={[-0.1, 0.72, 0.151]}
          fontSize={0.075}
          color="#eaf6ff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          UID
        </Text>

        <Text
          position={[0, 0.66, -0.151]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.07}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          lineHeight={0.85}
        >
          {'DELIVER\nHAPPINESS'}
        </Text>

        {player.lanternBuilt && !player.isDead && (
          <RemoteLantern imageData={player.lanternImage} lit={player.lanternLit} shape={player.lanternShape} text={player.lanternText} />
        )}
        {!player.isDead && <RemoteEquipment item={player.equippedItem} />}
      </group>

      {player.chatUntil > Date.now() && (
        <RemoteChatBubble text={player.chatText} meme={player.chatMeme} />
      )}

      <group position={[0, 1.92, 0]}>
        <mesh>
          <planeGeometry args={[1.42, 0.36]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.82} />
        </mesh>
        <Text position={[0, 0.08, 0.01]} fontSize={0.1} color="#7dd3fc" anchorX="center" anchorY="middle" fontWeight="bold">
          {player.name}
        </Text>
        <mesh position={[-0.43 + (Math.max(0, player.health) / 100) * 0.43, -0.085, 0.012]}>
          <planeGeometry args={[0.86 * (Math.max(0, player.health) / 100), 0.065]} />
          <meshBasicMaterial color={player.health > 50 ? '#22c55e' : player.health > 25 ? '#f59e0b' : '#ef4444'} />
        </mesh>
        <mesh position={[0, -0.085, 0.008]}>
          <planeGeometry args={[0.9, 0.075]} />
          <meshBasicMaterial color="#3f1515" />
        </mesh>
        {player.isDead && (
          <Text position={[0, -0.085, 0.02]} fontSize={0.07} color="#fecaca" anchorX="center" anchorY="middle" fontWeight="bold">
            GAME OVER
          </Text>
        )}
      </group>
    </group>
  );
}

export function MultiplayerPlayers() {
  const currentFloor = useGameStore((s) => s.currentFloor);
  const playerName = useGameStore((s) => s.playerName);
  const lanternBuilt = useGameStore((s) => s.personalLanternBuilt);
  const lanternLit = useGameStore((s) => s.personalLanternLit);
  const lanternShape = useGameStore((s) => s.personalLanternShapeMode);
  const lanternImage = useGameStore((s) => s.personalLanternImage);
  const lanternText = useGameStore((s) => s.personalLanternText);
  const equippedItem = useEconomyStore((s)=>s.equippedItem);
  const health = useGameStore((s) => s.health);
  const isDead = useGameStore((s) => s.isDead);
  const setOnlineConnected = useGameStore((s) => s.setOnlineConnected);
  const setOnlinePlayerCount = useGameStore((s) => s.setOnlinePlayerCount);
  const syncMooncakeClaim = useGameStore((s) => s.syncMooncakeClaim);
  const receiveCombatAttack = useGameStore((s) => s.receiveCombatAttack);

  const [remotePlayers, setRemotePlayers] = useState<Record<string, RemotePlayerState>>({});
  const channelRef = useRef<RealtimeChannel | null>(null);
  const joinedRef = useRef(false);

  const visiblePlayers = useMemo(
    () => Object.values(remotePlayers).filter((p) => p.floor === currentFloor),
    [remotePlayers, currentFloor],
  );

  useEffect(() => {
    const channel = supabase.channel('uid-go-dau-main', {
      config: {
        presence: { key: MULTIPLAYER_PLAYER_ID },
        broadcast: { self: false, ack: false },
      },
    });

    channelRef.current = channel;
    setMultiplayerChannel(channel);

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as Record<string, Array<Record<string, unknown>>>;
      const next: Record<string, RemotePlayerState> = {};

      for (const [key, metas] of Object.entries(state)) {
        if (key === MULTIPLAYER_PLAYER_ID || metas.length === 0) continue;
        const meta = metas[metas.length - 1];
        next[key] = {
          id: key,
          name: String(meta.name ?? 'UID Player'),
          floor: Number(meta.floor) === 1 ? 1 : Number(meta.floor) === 3 ? 3 : 2,
          x: Number(meta.x ?? 0),
          y: Number(meta.y ?? 0.5),
          z: Number(meta.z ?? 0),
          rotationY: Number(meta.rotationY ?? 0),
          lanternBuilt: Boolean(meta.lanternBuilt),
          lanternLit: Boolean(meta.lanternLit),
          lanternShape: (meta.lanternShape as LanternShapeMode) ?? 'generic',
          lanternImage: typeof meta.lanternImage === 'string' ? meta.lanternImage : null,
          lanternText: typeof meta.lanternText === 'string' ? meta.lanternText : '',
          equippedItem: (meta.equippedItem as ShopItemId) ?? null,
          health: Number(meta.health ?? 100),
          isDead: Boolean(meta.isDead),
          chatText: '',
          chatMeme: null,
          chatUntil: 0,
        };
      }

      setRemotePlayers((prev) => {
        for (const [id, old] of Object.entries(prev)) {
          if (next[id]) {
            next[id].x = old.x;
            next[id].y = old.y;
            next[id].z = old.z;
            next[id].rotationY = old.rotationY;
          }
        }
        return next;
      });
      setOnlinePlayerCount(Object.keys(state).length);
    });

    channel.on('broadcast', { event: 'player_move' }, ({ payload }) => {
      const p = payload as Partial<RemotePlayerState> & { id?: string };
      if (!p.id || p.id === MULTIPLAYER_PLAYER_ID) return;
      setRemotePlayers((prev) => {
        const existing = prev[p.id!];
        if (!existing) return prev;
        return {
          ...prev,
          [p.id!]: {
            ...existing,
            x: Number(p.x ?? existing.x),
            y: Number(p.y ?? existing.y),
            z: Number(p.z ?? existing.z),
            rotationY: Number(p.rotationY ?? existing.rotationY),
            floor: Number(p.floor) === 1 ? 1 : Number(p.floor) === 3 ? 3 : 2,
          },
        };
      });
    });

    channel.on('broadcast', { event: 'player_meta' }, ({ payload }) => {
      const p = payload as Partial<RemotePlayerState> & { id?: string };
      if (!p.id || p.id === MULTIPLAYER_PLAYER_ID) return;
      setRemotePlayers((prev) => {
        const existing: RemotePlayerState = prev[p.id!] ?? {
          id: p.id!,
          name: 'UID Player',
          floor: 2,
          x: 0,
          y: 0.5,
          z: 0,
          rotationY: 0,
          lanternBuilt: false,
          lanternLit: false,
          lanternShape: 'generic',
          lanternImage: null,
          lanternText: '',
          equippedItem: null,
          health: 100,
          isDead: false,
          chatText: '',
          chatMeme: null,
          chatUntil: 0,
        };
        return {
          ...prev,
          [p.id!]: {
            ...existing,
            ...p,
            id: p.id!,
            floor: Number(p.floor ?? existing.floor) === 1 ? 1 : Number(p.floor ?? existing.floor) === 3 ? 3 : 2,
            lanternShape: (p.lanternShape as LanternShapeMode) ?? existing.lanternShape,
            health: Number(p.health ?? existing.health),
            isDead: Boolean(p.isDead ?? existing.isDead),
          },
        };
      });
    });

    channel.on('broadcast', { event: 'combat_attack' }, ({ payload }) => {
      receiveCombatAttack(payload as CombatAttackPayload);
    });

    channel.on('broadcast', { event: 'social_chat' }, ({ payload }) => {
      const p=payload as SocialChatPayload;
      if(!p.playerId || p.playerId===MULTIPLAYER_PLAYER_ID) return;

      const local=useGameStore.getState();
      if(p.floor!==local.currentFloor) return;
      const dx=local.playerPosition[0]-p.x;
      const dz=local.playerPosition[2]-p.z;
      if(Math.hypot(dx,dz)>8) return;

      setRemotePlayers(prev=>{
        const existing=prev[p.playerId];
        if(!existing) return prev;
        return {
          ...prev,
          [p.playerId]:{
            ...existing,
            chatText:p.text.slice(0,120),
            chatMeme:p.meme,
            chatUntil:Date.now()+7000,
          },
        };
      });

      window.setTimeout(()=>{
        setRemotePlayers(prev=>{
          const existing=prev[p.playerId];
          if(!existing || existing.chatUntil>Date.now()) return prev;
          return {
            ...prev,
            [p.playerId]:{...existing,chatText:'',chatMeme:null,chatUntil:0},
          };
        });
      },7100);
    });

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mooncake_claims',
        filter: `room_id=eq.${MULTIPLAYER_ROOM_ID}`,
      },
      (payload) => {
        const row = payload.new as { mooncake_id?: string; claimed_name?: string };
        if (row.mooncake_id) syncMooncakeClaim(row.mooncake_id, row.claimed_name ?? 'UID Player');
      },
    );

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        joinedRef.current = true;
        setOnlineConnected(true);
        const s = useGameStore.getState();
        await channel.track({
          name: s.playerName,
          floor: s.currentFloor,
          x: s.playerPosition[0],
          y: s.playerPosition[1],
          z: s.playerPosition[2],
          rotationY: s.playerRotationY,
          lanternBuilt: s.personalLanternBuilt,
          lanternLit: s.personalLanternLit,
          lanternShape: s.personalLanternShapeMode,
          lanternImage: s.personalLanternImage,
          lanternText: s.personalLanternText,
          equippedItem: useEconomyStore.getState().equippedItem,
          health: s.health,
          isDead: s.isDead,
        });

        const { data } = await supabase
          .from('mooncake_claims')
          .select('mooncake_id, claimed_name')
          .eq('room_id', MULTIPLAYER_ROOM_ID);

        data?.forEach((row) => syncMooncakeClaim(row.mooncake_id, row.claimed_name));
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        setOnlineConnected(false);
      }
    });

    const moveTimer = window.setInterval(() => {
      if (!joinedRef.current) return;
      const s = useGameStore.getState();
      void channel.send({
        type: 'broadcast',
        event: 'player_move',
        payload: {
          id: MULTIPLAYER_PLAYER_ID,
          x: s.playerPosition[0],
          y: s.playerPosition[1],
          z: s.playerPosition[2],
          rotationY: s.playerRotationY,
          floor: s.currentFloor,
        },
      });
    }, 100);

    return () => {
      window.clearInterval(moveTimer);
      joinedRef.current = false;
      setOnlineConnected(false);
      setOnlinePlayerCount(1);
      setMultiplayerChannel(null);
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [setOnlineConnected, setOnlinePlayerCount, syncMooncakeClaim, receiveCombatAttack]);

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel || !joinedRef.current) return;

    const s = useGameStore.getState();
    const meta = {
      name: playerName,
      floor: currentFloor,
      x: s.playerPosition[0],
      y: s.playerPosition[1],
      z: s.playerPosition[2],
      rotationY: s.playerRotationY,
      lanternBuilt,
      lanternLit,
      lanternShape,
      lanternImage,
      lanternText,
      equippedItem,
      health,
      isDead,
    };

    void channel.track(meta);
    void channel.send({
      type: 'broadcast',
      event: 'player_meta',
      payload: {
        id: MULTIPLAYER_PLAYER_ID,
        ...meta,
      },
    });
  }, [playerName, currentFloor, lanternBuilt, lanternLit, lanternShape, lanternImage, lanternText, equippedItem, health, isDead]);

  return (
    <>
      {visiblePlayers.map((player) => (
        <RemotePlayerAvatar key={player.id} player={player} />
      ))}
    </>
  );
}
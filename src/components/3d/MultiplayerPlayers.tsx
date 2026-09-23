import { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { MULTIPLAYER_PLAYER_ID, MULTIPLAYER_ROOM_ID, supabase } from '../../lib/supabase';
import { useGameStore, type LanternShapeMode } from '../../stores/useGameStore';

type RemotePlayerState = {
  id: string;
  name: string;
  floor: 2 | 3;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  lanternBuilt: boolean;
  lanternLit: boolean;
  lanternShape: LanternShapeMode;
  lanternImage: string | null;
};

function RemoteLantern({
  imageData,
  lit,
  shape,
}: {
  imageData: string | null;
  lit: boolean;
  shape: LanternShapeMode;
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
        <mesh position={[0, -bodySize[1] / 2 - 0.16, 0]}>
          <coneGeometry args={[0.055, 0.22, 7]} />
          <meshStandardMaterial color="#dc2626" roughness={0.85} />
        </mesh>
      </group>
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

  return (
    <group ref={group} position={[player.x, player.y, player.z]} rotation={[0, player.rotationY, 0]}>
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
        fontSize={0.08}
        color="#eaf6ff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        UID
      </Text>

      {player.lanternBuilt && (
        <RemoteLantern
          imageData={player.lanternImage}
          lit={player.lanternLit}
          shape={player.lanternShape}
        />
      )}

      <group position={[0, 1.86, 0]}>
        <mesh>
          <planeGeometry args={[1.35, 0.29]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.78} />
        </mesh>
        <Text
          position={[0, 0.01, 0.01]}
          fontSize={0.1}
          color="#7dd3fc"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {player.name}
        </Text>
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
  const setOnlineConnected = useGameStore((s) => s.setOnlineConnected);
  const setOnlinePlayerCount = useGameStore((s) => s.setOnlinePlayerCount);
  const syncMooncakeClaim = useGameStore((s) => s.syncMooncakeClaim);

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

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as Record<string, Array<Record<string, unknown>>>;
      const next: Record<string, RemotePlayerState> = {};

      for (const [key, metas] of Object.entries(state)) {
        if (key === MULTIPLAYER_PLAYER_ID || metas.length === 0) continue;
        const meta = metas[metas.length - 1];
        next[key] = {
          id: key,
          name: String(meta.name ?? 'UID Player'),
          floor: Number(meta.floor) === 3 ? 3 : 2,
          x: Number(meta.x ?? 0),
          y: Number(meta.y ?? 0.5),
          z: Number(meta.z ?? 0),
          rotationY: Number(meta.rotationY ?? 0),
          lanternBuilt: Boolean(meta.lanternBuilt),
          lanternLit: Boolean(meta.lanternLit),
          lanternShape: (meta.lanternShape as LanternShapeMode) ?? 'generic',
          lanternImage: typeof meta.lanternImage === 'string' ? meta.lanternImage : null,
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
            floor: Number(p.floor) === 3 ? 3 : 2,
          },
        };
      });
    });

    channel.on('broadcast', { event: 'player_meta' }, ({ payload }) => {
      const p = payload as Partial<RemotePlayerState> & { id?: string };
      if (!p.id || p.id === MULTIPLAYER_PLAYER_ID) return;
      setRemotePlayers((prev) => {
        const existing = prev[p.id!] ?? {
          id: p.id!,
          name: 'UID Player',
          floor: 2 as const,
          x: 0,
          y: 0.5,
          z: 0,
          rotationY: 0,
          lanternBuilt: false,
          lanternLit: false,
          lanternShape: 'generic' as LanternShapeMode,
          lanternImage: null,
        };
        return {
          ...prev,
          [p.id!]: {
            ...existing,
            ...p,
            id: p.id!,
            floor: Number(p.floor ?? existing.floor) === 3 ? 3 : 2,
            lanternShape: (p.lanternShape as LanternShapeMode) ?? existing.lanternShape,
          },
        };
      });
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
        if (row.mooncake_id) {
          syncMooncakeClaim(row.mooncake_id, row.claimed_name ?? 'UID Player');
        }
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
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [setOnlineConnected, setOnlinePlayerCount, syncMooncakeClaim]);

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel || !joinedRef.current) return;
    const s = useGameStore.getState();
    void channel.track({
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
    });
    void channel.send({
      type: 'broadcast',
      event: 'player_meta',
      payload: {
        id: MULTIPLAYER_PLAYER_ID,
        name: playerName,
        floor: currentFloor,
        lanternBuilt,
        lanternLit,
        lanternShape,
        lanternImage,
      },
    });
  }, [playerName, currentFloor, lanternBuilt, lanternLit, lanternShape, lanternImage]);

  return (
    <>
      {visiblePlayers.map((player) => (
        <RemotePlayerAvatar key={player.id} player={player} />
      ))}
    </>
  );
}

import type { RealtimeChannel } from '@supabase/supabase-js';

export type CombatAttackPayload = {
  id: string;
  attackerId: string;
  attackerName: string;
  floor: 2 | 3;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  damage: number;
  range: number;
  weapon: 'lantern' | 'sword' | 'blaster';
  createdAt: number;
};

let activeChannel: RealtimeChannel | null = null;

export function setMultiplayerChannel(channel: RealtimeChannel | null) {
  activeChannel = channel;
}

export function broadcastCombatAttack(payload: CombatAttackPayload) {
  if (!activeChannel) return;
  void activeChannel.send({
    type: 'broadcast',
    event: 'combat_attack',
    payload,
  });
}
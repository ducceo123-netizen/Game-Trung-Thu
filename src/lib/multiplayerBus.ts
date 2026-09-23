import type { RealtimeChannel } from '@supabase/supabase-js';

export type SocialChatPayload = {
  id: string;
  playerId: string;
  playerName: string;
  floor: 2 | 3;
  x: number;
  y: number;
  z: number;
  text: string;
  meme: string | null;
  createdAt: number;
};

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

export function broadcastSocialChat(payload: SocialChatPayload) {
  if (!activeChannel) return;
  void activeChannel.send({
    type: 'broadcast',
    event: 'social_chat',
    payload,
  });
}

export function broadcastCombatAttack(payload: CombatAttackPayload) {
  if (!activeChannel) return;
  void activeChannel.send({
    type: 'broadcast',
    event: 'combat_attack',
    payload,
  });
}
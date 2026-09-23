import { createClient } from '@supabase/supabase-js';

export const MULTIPLAYER_ROOM_ID = 'uid-go-dau';

export const supabase = createClient(
  'https://ebszibcctojncrnumxig.supabase.co',
  'sb_publishable_6jroZAd9KkMTs8y_mlqSbA_4_GiMGmd',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 20,
      },
    },
  },
);

export const MULTIPLAYER_PLAYER_ID =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `uid-${Date.now()}-${Math.random().toString(36).slice(2)}`;

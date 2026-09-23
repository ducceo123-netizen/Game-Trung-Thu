import { create } from 'zustand';
import { MULTIPLAYER_PLAYER_ID, MULTIPLAYER_ROOM_ID, supabase } from '../lib/supabase';

export type SocialScreenPost = {
  id: string;
  room_id: string;
  player_id: string;
  player_name: string;
  image_data: string;
  created_at: string;
};

interface SocialScreenState {
  posts: SocialScreenPost[];
  loading: boolean;
  initialized: boolean;
  refresh: () => Promise<void>;
  init: () => Promise<void>;
  addPost: (playerName: string, imageData: string) => Promise<boolean>;
  replaceAllWithMine: (playerName: string, imageData: string) => Promise<boolean>;
}

let channelStarted = false;

export const useSocialScreenStore = create<SocialScreenState>((set,get)=>({
  posts: [],
  loading: false,
  initialized: false,

  refresh: async () => {
    const { data } = await supabase
      .from('social_screen_posts')
      .select('*')
      .eq('room_id', MULTIPLAYER_ROOM_ID)
      .order('created_at',{ascending:true});

    set({posts:(data ?? []) as SocialScreenPost[],loading:false});
  },

  init: async () => {
    if (!get().initialized) set({loading:true,initialized:true});
    await get().refresh();

    if (channelStarted) return;
    channelStarted = true;

    supabase
      .channel('uid-social-screen-shared')
      .on('postgres_changes',{
        event:'*',
        schema:'public',
        table:'social_screen_posts',
        filter:`room_id=eq.${MULTIPLAYER_ROOM_ID}`,
      },()=>void get().refresh())
      .subscribe();
  },

  addPost: async (playerName,imageData) => {
    const { error } = await supabase.rpc('add_social_screen_post',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
      p_image:imageData,
    });
    if (error) return false;
    await get().refresh();
    return true;
  },

  replaceAllWithMine: async (playerName,imageData) => {
    const { error } = await supabase.rpc('replace_social_screen_with_mine',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
      p_image:imageData,
    });
    if (error) return false;
    await get().refresh();
    return true;
  },
}));

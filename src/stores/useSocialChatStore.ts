import { create } from 'zustand';
import { MULTIPLAYER_PLAYER_ID } from '../lib/supabase';
import { broadcastSocialChat } from '../lib/multiplayerBus';
import { useGameStore } from './useGameStore';

interface LocalChatBubble {
  text: string;
  meme: string | null;
  until: number;
}

interface SocialChatState {
  open: boolean;
  localBubble: LocalChatBubble | null;
  openChat: () => void;
  closeChat: () => void;
  sendChat: (text: string, meme: string | null) => void;
  clearLocalBubble: () => void;
}

export const useSocialChatStore = create<SocialChatState>((set,get)=>({
  open:false,
  localBubble:null,

  openChat:()=>set({open:true}),
  closeChat:()=>set({open:false}),

  sendChat:(text,meme)=>{
    const s=useGameStore.getState();
    const clean=text.trim().slice(0,120);
    if(!clean && !meme) return;

    const now=Date.now();
    const payload={
      id:`${MULTIPLAYER_PLAYER_ID}-chat-${now}`,
      playerId:MULTIPLAYER_PLAYER_ID,
      playerName:s.playerName,
      floor:s.currentFloor,
      x:s.playerPosition[0],
      y:s.playerPosition[1],
      z:s.playerPosition[2],
      text:clean,
      meme,
      createdAt:now,
    };

    set({localBubble:{text:clean,meme,until:now+7000},open:false});
    broadcastSocialChat(payload);
  },

  clearLocalBubble:()=>{
    if(get().localBubble && get().localBubble!.until<=Date.now()) set({localBubble:null});
  },
}));

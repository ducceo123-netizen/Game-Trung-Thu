import { create } from 'zustand';
import { MULTIPLAYER_PLAYER_ID, MULTIPLAYER_ROOM_ID, supabase } from '../lib/supabase';

interface WhiteboardState {
  open: boolean;
  imageData: string;
  updatedName: string;
  initialized: boolean;
  openBoard: () => void;
  closeBoard: () => void;
  init: () => Promise<void>;
  save: (playerName: string, imageData: string) => Promise<boolean>;
}

let channelStarted=false;

export const useWhiteboardStore=create<WhiteboardState>((set,get)=>({
  open:false,
  imageData:'',
  updatedName:'',
  initialized:false,

  openBoard:()=>set({open:true}),
  closeBoard:()=>set({open:false}),

  init:async()=>{
    if(!get().initialized) set({initialized:true});
    const {data}=await supabase
      .from('shared_whiteboards')
      .select('image_data,updated_name')
      .eq('room_id',MULTIPLAYER_ROOM_ID)
      .maybeSingle();

    if(data) set({imageData:data.image_data??'',updatedName:data.updated_name??''});

    if(channelStarted) return;
    channelStarted=true;
    supabase
      .channel('uid-shared-whiteboard')
      .on('postgres_changes',{
        event:'*',
        schema:'public',
        table:'shared_whiteboards',
        filter:`room_id=eq.${MULTIPLAYER_ROOM_ID}`,
      },payload=>{
        const row=payload.new as {image_data?:string;updated_name?:string};
        set({imageData:row.image_data??'',updatedName:row.updated_name??''});
      })
      .subscribe();
  },

  save:async(playerName,imageData)=>{
    const {data,error}=await supabase.rpc('save_shared_whiteboard',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
      p_image:imageData,
    });
    if(error||!data) return false;
    set({imageData:data.image_data??imageData,updatedName:data.updated_name??playerName});
    return true;
  },
}));
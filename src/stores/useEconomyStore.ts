import { create } from 'zustand';
import { MULTIPLAYER_PLAYER_ID, MULTIPLAYER_ROOM_ID, supabase } from '../lib/supabase';

export type ShopItemId = 'sword' | 'scooter' | 'blaster';
export type WorldItem = {
  id: string;
  room_id: string;
  item_id: ShopItemId;
  dropped_by: string;
  dropped_name: string;
  floor: number;
  x: number;
  z: number;
  claimed_by: string | null;
  claimed_at: string | null;
  created_at: string;
};

export type WorldMooncake = {
  id: string;
  room_id: string;
  floor: number;
  x: number;
  z: number;
  value: number;
  source: string;
  claimed_by: string | null;
  claimed_at: string | null;
};

interface EconomyState {
  balance: number;
  purchasedItems: ShopItemId[];
  equippedItem: ShopItemId | null;
  shopOpen: boolean;
  worldMooncakes: WorldMooncake[];
  worldItems: WorldItem[];
  khoeClaimed: boolean;
  initialized: boolean;

  initEconomy: (playerName: string) => Promise<void>;
  refreshMooncakes: () => Promise<void>;
  refreshWorldItems: () => Promise<void>;
  spawnMooncakeTick: () => Promise<void>;
  claimMooncake: (id: string, playerName: string) => Promise<boolean>;
  praiseAnhKhoe: (playerName: string) => Promise<boolean>;
  purchaseItem: (item: ShopItemId, playerName: string) => Promise<{ok:boolean;reason:string}>;
  equipItem: (item: ShopItemId | null) => void;
  dropItem: (item: ShopItemId, playerName: string, floor: 2 | 3, x: number, z: number) => Promise<{ok:boolean;reason:string}>;
  claimWorldItem: (id: string, playerName: string) => Promise<{ok:boolean;reason:string;item:ShopItemId|null}>;
  openShop: () => void;
  closeShop: () => void;
  dropOnDeath: (playerName: string, floor: 2 | 3, x: number, z: number) => Promise<number>;
}

export const SHOP_PRICES: Record<ShopItemId, number> = {
  sword: 15,
  scooter: 25,
  blaster: 30,
};

export const useEconomyStore = create<EconomyState>((set,get)=>({
  balance: 0,
  purchasedItems: [],
  equippedItem: null,
  shopOpen: false,
  worldMooncakes: [],
  worldItems: [],
  khoeClaimed: false,
  initialized: false,

  initEconomy: async (playerName) => {
    const { data, error } = await supabase.rpc('ensure_player_wallet',{
      p_room: MULTIPLAYER_ROOM_ID,
      p_player: MULTIPLAYER_PLAYER_ID,
      p_name: playerName,
    });
    if (!error && data) {
      const row = Array.isArray(data) ? data[0] : data;
      set({
        balance: Number(row?.balance ?? 0),
        purchasedItems: (row?.purchased_items ?? []) as ShopItemId[],
        khoeClaimed: Boolean(row?.claimed_khoe),
        initialized: true,
      });
    }
    await Promise.all([get().refreshMooncakes(), get().refreshWorldItems()]);
  },

  refreshMooncakes: async () => {
    const { data } = await supabase
      .from('world_mooncakes')
      .select('*')
      .eq('room_id', MULTIPLAYER_ROOM_ID)
      .is('claimed_at', null)
      .order('created_at',{ascending:true});
    set({worldMooncakes:(data ?? []) as WorldMooncake[]});
  },

  refreshWorldItems: async () => {
    const { data } = await supabase
      .from('world_items')
      .select('*')
      .eq('room_id', MULTIPLAYER_ROOM_ID)
      .is('claimed_at', null)
      .order('created_at',{ascending:true});
    set({worldItems:(data ?? []) as WorldItem[]});
  },

  spawnMooncakeTick: async () => {
    await supabase.rpc('spawn_world_mooncake',{p_room:MULTIPLAYER_ROOM_ID});
    await get().refreshMooncakes();
  },

  claimMooncake: async (id,playerName) => {
    const { data, error } = await supabase.rpc('claim_world_mooncake',{
      p_id:id,
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
    });
    const row=Array.isArray(data)?data[0]:data;
    if (error || !row?.claimed) {
      await get().refreshMooncakes();
      return false;
    }
    set({balance:Number(row.balance ?? get().balance)});
    await get().refreshMooncakes();
    return true;
  },

  praiseAnhKhoe: async (playerName) => {
    const { data, error } = await supabase.rpc('praise_anh_khoe',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
    });
    const row=Array.isArray(data)?data[0]:data;
    if (error || !row) return false;
    set({balance:Number(row.balance ?? get().balance),khoeClaimed:true});
    return Boolean(row.granted);
  },

  purchaseItem: async (item,playerName) => {
    const { data, error } = await supabase.rpc('purchase_shop_item',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
      p_item:item,
    });
    const row=Array.isArray(data)?data[0]:data;
    if (error || !row) return {ok:false,reason:'error'};
    set({
      balance:Number(row.balance ?? get().balance),
      purchasedItems:(row.purchased_items ?? get().purchasedItems) as ShopItemId[],
    });
    return {ok:Boolean(row.purchased),reason:String(row.reason ?? 'error')};
  },

  equipItem:(item)=>set({equippedItem:item}),

  dropItem: async (item,playerName,floor,x,z) => {
    const { data, error } = await supabase.rpc('drop_owned_item',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
      p_item:item,
      p_floor:floor,
      p_x:x,
      p_z:z,
    });
    const row=Array.isArray(data)?data[0]:data;
    if (error || !row?.dropped) return {ok:false,reason:String(row?.reason ?? 'error')};
    set({
      purchasedItems:(row.purchased_items ?? []) as ShopItemId[],
      equippedItem:get().equippedItem===item?null:get().equippedItem,
    });
    await get().refreshWorldItems();
    return {ok:true,reason:'ok'};
  },

  claimWorldItem: async (id,playerName) => {
    const { data, error } = await supabase.rpc('claim_world_item',{
      p_id:id,
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
    });
    const row=Array.isArray(data)?data[0]:data;
    if (error || !row?.claimed) {
      await get().refreshWorldItems();
      return {ok:false,reason:String(row?.reason ?? 'error'),item:(row?.item_id ?? null) as ShopItemId|null};
    }
    set({purchasedItems:(row.purchased_items ?? get().purchasedItems) as ShopItemId[]});
    await get().refreshWorldItems();
    return {ok:true,reason:'ok',item:(row.item_id ?? null) as ShopItemId|null};
  },

  openShop:()=>set({shopOpen:true}),
  closeShop:()=>set({shopOpen:false}),

  dropOnDeath: async (playerName,floor,x,z) => {
    const { data } = await supabase.rpc('drop_mooncakes_on_death',{
      p_room:MULTIPLAYER_ROOM_ID,
      p_player:MULTIPLAYER_PLAYER_ID,
      p_name:playerName,
      p_floor:floor,
      p_x:x,
      p_z:z,
    });
    const row=Array.isArray(data)?data[0]:data;
    const dropped=Number(row?.dropped ?? 0);
    set({balance:Number(row?.balance ?? get().balance)});
    await get().refreshMooncakes();
    return dropped;
  },
}));
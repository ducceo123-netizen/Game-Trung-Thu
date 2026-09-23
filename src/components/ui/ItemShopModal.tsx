import { useState } from 'react';
import { SHOP_PRICES, type ShopItemId, useEconomyStore } from '../../stores/useEconomyStore';
import { useGameStore } from '../../stores/useGameStore';

const ITEMS:{id:ShopItemId;name:string;desc:string}[]=[
  {id:'sword',name:'⚔️ Kiếm LED',desc:'Cận chiến mạnh hơn • 35 damage'},
  {id:'scooter',name:'🛵 Xe điện mini',desc:'Chạy nhanh hơn khi equip'},
  {id:'blaster',name:'🔫 Blaster đồ chơi',desc:'Tầm đánh xa hơn • 20 damage'},
];

export function ItemShopModal() {
  const open=useEconomyStore((s)=>s.shopOpen);
  const close=useEconomyStore((s)=>s.closeShop);
  const balance=useEconomyStore((s)=>s.balance);
  const purchased=useEconomyStore((s)=>s.purchasedItems);
  const equipped=useEconomyStore((s)=>s.equippedItem);
  const buy=useEconomyStore((s)=>s.purchaseItem);
  const equip=useEconomyStore((s)=>s.equipItem);
  const dropItem=useEconomyStore((s)=>s.dropItem);
  const name=useGameStore((s)=>s.playerName);
  const floor=useGameStore((s)=>s.currentFloor);
  const position=useGameStore((s)=>s.playerPosition);
  const show=useGameStore((s)=>s.showAchievement);
  const [busyItem,setBusyItem]=useState<ShopItemId|null>(null);
  const [status,setStatus]=useState('');

  if(!open) return null;

  return (
    <div className="interactive-ui absolute inset-0 z-[92] bg-black/70 backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-950 border-2 border-amber-400 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between bg-amber-500 text-slate-950 px-4 py-3 font-black">
          <span>🛒 TIỆM ĐỒ TRUNG THU</span>
          <button onClick={close} className="bg-black/20 px-2 py-1">✕</button>
        </div>
        <div className="p-4">
          <div className="mb-2 text-sm">Ví của bạn: <b className="text-yellow-300">{balance} bánh Trung Thu</b></div>
          <div className="mb-4 min-h-5 text-xs text-cyan-300">
            {status || 'Bấm MUA → mua xong bấm EQUIP để dùng.'}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {ITEMS.map((item)=>{
              const owned=purchased.includes(item.id);
              const isEquipped=equipped===item.id;
              return <div key={item.id} className="border border-slate-700 bg-slate-900 p-3">
                <div className="font-black text-lg">{item.name}</div>
                <div className="text-xs text-slate-400 min-h-10 mt-1">{item.desc}</div>
                <div className="text-yellow-300 font-bold my-3">{SHOP_PRICES[item.id]} bánh</div>
                {!owned ? <button
                  type="button"
                  disabled={busyItem!==null}
                  className="w-full bg-amber-400 text-slate-950 font-black py-2 disabled:opacity-50"
                  onClick={async()=>{
                    if (balance < SHOP_PRICES[item.id]) {
                      setStatus(`Thiếu ${SHOP_PRICES[item.id]-balance} bánh để mua ${item.name}.`);
                      show({id:'shop_buy',title:'CHƯA ĐỦ BÁNH',subtitle:`Cần ${SHOP_PRICES[item.id]} bánh Trung Thu.`});
                      return;
                    }

                    try {
                      setBusyItem(item.id);
                      setStatus(`Đang mua ${item.name}...`);
                      const r=await buy(item.id,name);
                      const message=r.ok
                        ? `Đã mua ${item.name}. Bấm EQUIP để dùng.`
                        : r.reason==='not_enough'
                          ? 'Không đủ bánh Trung Thu.'
                          : r.reason==='already_owned'
                            ? 'Bạn đã sở hữu vật phẩm này.'
                            : 'Mua chưa thành công, thử lại.';
                      setStatus(message);
                      show({id:'shop_buy',title:r.ok?'MUA THÀNH CÔNG':'CHƯA MUA ĐƯỢC',subtitle:message});
                    } catch {
                      setStatus('Lỗi kết nối shop. Thử lại sau vài giây.');
                    } finally {
                      setBusyItem(null);
                    }
                  }}
                >{busyItem===item.id?'ĐANG MUA...':'MUA'}</button>:
                <div className="space-y-2">
                  <button
                    type="button"
                    className={'w-full py-2 font-black '+(isEquipped?'bg-emerald-500 text-slate-950':'bg-cyan-700')}
                    onClick={()=>{
                      equip(isEquipped?null:item.id);
                      setStatus(isEquipped?`Đã bỏ equip ${item.name}.`:`Đã equip ${item.name}.`);
                    }}
                  >{isEquipped?'BỎ EQUIP':'EQUIP'}</button>
                  <button
                    type="button"
                    disabled={busyItem!==null}
                    className="w-full border border-red-700 bg-red-950 py-2 text-xs font-black text-red-200 disabled:opacity-50"
                    onClick={async()=>{
                      setBusyItem(item.id);
                      setStatus(`Đang bỏ ${item.name} xuống đất...`);
                      try{
                        const r=await dropItem(item.id,name,floor,position[0],position[2]);
                        const message=r.ok
                          ? `Đã bỏ ${item.name} xuống đất. Người khác có thể nhặt bằng E.`
                          : 'Không bỏ được vật phẩm này.';
                        setStatus(message);
                        show({id:'drop_item',title:r.ok?'📦 ĐÃ BỎ VẬT PHẨM':'KHÔNG BỎ ĐƯỢC',subtitle:message});
                      }finally{
                        setBusyItem(null);
                      }
                    }}
                  >
                    📦 BỎ RA ĐẤT
                  </button>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
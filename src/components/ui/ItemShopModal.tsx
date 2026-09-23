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
  const name=useGameStore((s)=>s.playerName);
  const show=useGameStore((s)=>s.showAchievement);

  if(!open) return null;

  return (
    <div className="interactive-ui absolute inset-0 z-[92] bg-black/70 backdrop-blur-[3px] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-950 border-2 border-amber-400 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between bg-amber-500 text-slate-950 px-4 py-3 font-black">
          <span>🛒 TIỆM ĐỒ TRUNG THU</span>
          <button onClick={close} className="bg-black/20 px-2 py-1">✕</button>
        </div>
        <div className="p-4">
          <div className="mb-4 text-sm">Ví của bạn: <b className="text-yellow-300">{balance} bánh Trung Thu</b></div>
          <div className="grid sm:grid-cols-3 gap-3">
            {ITEMS.map((item)=>{
              const owned=purchased.includes(item.id);
              const isEquipped=equipped===item.id;
              return <div key={item.id} className="border border-slate-700 bg-slate-900 p-3">
                <div className="font-black text-lg">{item.name}</div>
                <div className="text-xs text-slate-400 min-h-10 mt-1">{item.desc}</div>
                <div className="text-yellow-300 font-bold my-3">{SHOP_PRICES[item.id]} bánh</div>
                {!owned ? <button className="w-full bg-amber-400 text-slate-950 font-black py-2" onClick={async()=>{
                  const r=await buy(item.id,name);
                  show({id:'shop_buy',title:r.ok?'MUA THÀNH CÔNG':'CHƯA MUA ĐƯỢC',subtitle:r.ok?`Đã mua ${item.name}`:r.reason==='not_enough'?'Không đủ bánh Trung Thu.':'Vật phẩm đã có hoặc lỗi mạng.'});
                }}>MUA</button>:
                <button className={'w-full py-2 font-black '+(isEquipped?'bg-emerald-500 text-slate-950':'bg-cyan-700')} onClick={()=>equip(isEquipped?null:item.id)}>{isEquipped?'ĐANG EQUIP':'EQUIP'}</button>}
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

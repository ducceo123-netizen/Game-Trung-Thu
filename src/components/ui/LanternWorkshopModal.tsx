import { ChangeEvent, useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export function LanternWorkshopModal() {
  const open = useGameStore((s) => s.workshopOpen);
  const image = useGameStore((s) => s.personalLanternImage);
  const built = useGameStore((s) => s.personalLanternBuilt);
  const closeWorkshop = useGameStore((s) => s.closeWorkshop);
  const setImage = useGameStore((s) => s.setPersonalLanternImage);
  const build = useGameStore((s) => s.buildPersonalLantern);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 interactive-ui">
      <div className="w-full max-w-xl bg-[#d6d3c9] border-t-4 border-l-4 border-white border-b-4 border-r-4 border-slate-900 shadow-2xl font-mono text-slate-900">
        <div className="bg-[#8b1e1e] text-yellow-100 px-4 py-2 flex items-center justify-between border-b-2 border-slate-900">
          <div className="font-black tracking-wide">🏮 QUẦY LÀM LỒNG ĐÈN — UID GÒ DẦU • LẦU 4</div>
          <button onClick={closeWorkshop} className="bg-[#c0c0c0] text-slate-900 border border-white px-2 cursor-pointer">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-yellow-100 border-2 border-amber-700 p-3 text-sm leading-relaxed">
            <div className="font-black mb-1">BẢNG HƯỚNG DẪN:</div>
            <div>1. Chọn một tấm ảnh bất kỳ trên máy.</div>
            <div>2. Hệ thống sẽ biến ảnh thành mặt chính của một chiếc lồng đèn DIY.</div>
            <div>3. Bấm <b>LÀM LỒNG ĐÈN</b>.</div>
            <div>4. Đóng bảng, đi theo biển <b>KHU THẮP SÁNG →</b>.</div>
            <div>5. Đứng trên bục showcase và bấm <b>E</b> để bật đèn.</div>
            <div className="mt-1 text-[11px] text-amber-900">Mẹo: ảnh chân dung, ảnh team hay meme nội bộ đều chơi được.</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => inputRef.current?.click()}
              className="min-h-48 border-2 border-dashed border-slate-700 bg-slate-100 hover:bg-white cursor-pointer flex flex-col items-center justify-center gap-2 p-3"
            >
              {image ? (
                <img src={image} alt="Ảnh lồng đèn" className="max-h-44 max-w-full object-contain" />
              ) : (
                <>
                  <div className="text-5xl">📸</div>
                  <div className="font-black">BẤM ĐỂ UP ẢNH</div>
                  <div className="text-xs text-slate-600">JPG / PNG / WEBP</div>
                </>
              )}
            </button>

            <div className="bg-slate-900 text-slate-100 border-2 border-slate-700 p-4 flex flex-col justify-between">
              <div>
                <div className="text-yellow-300 font-black mb-2">PREVIEW OUTPUT</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Ảnh sẽ trở thành mặt chính của một lồng đèn carton DIY, có dây đỏ, tua rua và LED vàng quấn quanh theo đúng vibe đồ tự chế.
                </div>
              </div>
              <div className="mt-4 text-xs text-cyan-300">
                FLOW: WORKSHOP → KHU THẮP SÁNG
              </div>
            </div>
          </div>

          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

          <div className="flex gap-2 justify-end">
            <button
              onClick={closeWorkshop}
              className="px-4 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-slate-900 cursor-pointer"
            >
              ĐÓNG
            </button>
            <button
              disabled={!image}
              onClick={() => {
                build();
                closeWorkshop();
              }}
              className="px-4 py-2 bg-amber-400 disabled:bg-slate-400 disabled:text-slate-600 border-t-2 border-l-2 border-yellow-100 border-b-2 border-r-2 border-slate-900 font-black cursor-pointer disabled:cursor-not-allowed"
            >
              {built ? 'LÀM LẠI LỒNG ĐÈN' : '🏮 LÀM LỒNG ĐÈN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}